terraform {
  required_version = ">= 1.0"
  
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "claudeosaar-terraform-state"
    key    = "production/terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

provider "aws" {
  region = var.aws_region
}

module "eks_cluster" {
  source = "./modules/eks"
  
  cluster_name    = "claudeosaar-production"
  cluster_version = "1.28"
  region          = var.aws_region
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  node_groups = {
    general = {
      desired_capacity = 3
      min_capacity     = 2
      max_capacity     = 10
      instance_types   = ["t3.xlarge"]
    }
    
    gpu = {
      desired_capacity = 1
      min_capacity     = 0
      max_capacity     = 3
      instance_types   = ["g4dn.xlarge"]
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}

module "vpc" {
  source = "./modules/vpc"
  
  name = "claudeosaar-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b", "${var.aws_region}c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  
  tags = {
    Terraform   = "true"
    Environment = "production"
  }
}

module "rds" {
  source = "./modules/rds"
  
  identifier = "claudeosaar-db"
  
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.r6g.xlarge"
  allocated_storage = 100
  
  database_name = "claudeosaar"
  username      = "claudeosaar"
  
  vpc_security_group_ids = [module.eks_cluster.worker_security_group_id]
  subnet_ids            = module.vpc.database_subnets
  
  backup_retention_period = 30
  multi_az               = true
  
  pgvector_enabled = true
}

module "elasticache" {
  source = "./modules/elasticache"
  
  cluster_id           = "claudeosaar-cache"
  engine              = "redis"
  node_type           = "cache.r6g.large"
  num_cache_nodes     = 2
  parameter_group_name = "default.redis7"
  
  subnet_ids         = module.vpc.private_subnets
  security_group_ids = [module.eks_cluster.worker_security_group_id]
}

module "s3" {
  source = "./modules/s3"
  
  buckets = {
    "claudeosaar-production" = {
      versioning = true
      lifecycle_rules = [{
        id     = "expire-old-versions"
        status = "Enabled"
        
        transition = {
          days          = 30
          storage_class = "STANDARD_IA"
        }
        
        expiration = {
          days = 90
        }
      }]
    }
    
    "claudeosaar-backups" = {
      versioning = false
      lifecycle_rules = [{
        id     = "expire-backups"
        status = "Enabled"
        
        expiration = {
          days = 30
        }
      }]
    }
    
    "claudeosaar-logs" = {
      versioning = false
      lifecycle_rules = [{
        id     = "archive-logs"
        status = "Enabled"
        
        transition = {
          days          = 7
          storage_class = "GLACIER"
        }
        
        expiration = {
          days = 90
        }
      }]
    }
  }
}

module "cloudfront" {
  source = "./modules/cloudfront"
  
  domain_name = "agentland.saarland"
  
  origins = {
    app = {
      domain_name = "app.agentland.saarland"
      origin_id   = "app"
    }
    
    api = {
      domain_name = "api.agentland.saarland"
      origin_id   = "api"
    }
    
    s3 = {
      domain_name = module.s3.bucket_regional_domain_names["claudeosaar-production"]
      origin_id   = "s3"
    }
  }
  
  cache_behaviors = {
    "/api/*" = {
      target_origin_id = "api"
      allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods   = ["GET", "HEAD"]
      compress         = true
    }
    
    "/static/*" = {
      target_origin_id = "s3"
      allowed_methods  = ["GET", "HEAD"]
      cached_methods   = ["GET", "HEAD"]
      compress         = true
      ttl = {
        default = 86400
        max     = 31536000
      }
    }
  }
}

resource "kubernetes_namespace" "claudeosaar" {
  metadata {
    name = "claudeosaar"
    
    labels = {
      app = "claudeosaar"
      env = "production"
    }
  }
}

resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  version    = "4.8.0"
  namespace  = "ingress-nginx"
  
  create_namespace = true
  
  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }
  
  set {
    name  = "controller.service.annotations.service\\.beta\\.kubernetes\\.io/aws-load-balancer-type"
    value = "nlb"
  }
}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  repository = "https://charts.jetstack.io"
  chart      = "cert-manager"
  version    = "v1.13.0"
  namespace  = "cert-manager"
  
  create_namespace = true
  
  set {
    name  = "installCRDs"
    value = "true"
  }
}

resource "helm_release" "prometheus" {
  name       = "prometheus"
  repository = "https://prometheus-community.github.io/helm-charts"
  chart      = "kube-prometheus-stack"
  version    = "51.0.0"
  namespace  = "monitoring"
  
  create_namespace = true
  
  values = [
    file("${path.module}/values/prometheus.yaml")
  ]
}

resource "helm_release" "claudeosaar" {
  name      = "claudeosaar"
  chart     = "${path.module}/../../k8s/helm/claudeosaar"
  namespace = kubernetes_namespace.claudeosaar.metadata[0].name
  
  values = [
    file("${path.module}/values/claudeosaar.yaml"),
    file("${path.module}/values/claudeosaar-production.yaml")
  ]
  
  set_sensitive {
    name  = "config.anthropicApiKey"
    value = var.anthropic_api_key
  }
  
  set_sensitive {
    name  = "config.stripeSecretKey"
    value = var.stripe_secret_key
  }
  
  set {
    name  = "database.host"
    value = module.rds.endpoint
  }
  
  set {
    name  = "redis.host"
    value = module.elasticache.endpoint
  }
}