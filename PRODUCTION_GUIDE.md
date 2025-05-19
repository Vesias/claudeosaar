# ClaudeOSaar Production Deployment Guide

## Prerequisites

- Kubernetes cluster (1.25+)
- Helm 3
- kubectl configured
- Docker registry access
- SSL certificates
- Domain configuration

## 1. Infrastructure Setup

### AWS/GCP/Azure
```bash
# Example for AWS EKS
eksctl create cluster \
  --name claudeosaar-prod \
  --region eu-central-1 \
  --nodegroup-name standard-workers \
  --node-type m5.xlarge \
  --nodes 5 \
  --nodes-min 3 \
  --nodes-max 10 \
  --managed
```

### Storage Classes
```bash
kubectl apply -f k8s/storage-classes.yaml
```

## 2. Database Setup

### PostgreSQL with pgvector
```bash
# Install PostgreSQL operator
kubectl create namespace postgres-operator
helm install postgres-operator \
  postgres-operator-charts/postgres-operator \
  -n postgres-operator

# Create database
kubectl apply -f k8s/database.yaml
```

### Run Migrations
```bash
kubectl run migrations --rm -it \
  --image=claudeosaar/api:latest \
  --env="DATABASE_URL=$DATABASE_URL" \
  -- python /app/migrations/migrate.py up
```

## 3. Secrets Management

### Using Sealed Secrets
```bash
# Install sealed-secrets controller
kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.18.0/controller.yaml

# Create secrets
kubeseal --format=yaml < k8s/secrets.yaml > k8s/sealed-secrets.yaml
kubectl apply -f k8s/sealed-secrets.yaml
```

## 4. Deploy with Helm

### Add Helm repository
```bash
helm repo add claudeosaar https://helm.claudeosaar.saarland
helm repo update
```

### Install
```bash
helm install claudeosaar claudeosaar/claudeosaar \
  --namespace claudeosaar \
  --create-namespace \
  -f production-values.yaml
```

### Production values.yaml
```yaml
replicaCount:
  api: 5
  ui: 3
  mcp: 3

resources:
  api:
    limits:
      cpu: 4000m
      memory: 4Gi
    requests:
      cpu: 2000m
      memory: 2Gi

autoscaling:
  enabled: true
  minReplicas:
    api: 5
    ui: 3
    mcp: 3
  maxReplicas:
    api: 50
    ui: 20
    mcp: 30

monitoring:
  enabled: true
  prometheus:
    retention: 90d
    storage: 200Gi
```

## 5. SSL/TLS Configuration

### Let's Encrypt with cert-manager
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@claudeosaar.saarland
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## 6. Monitoring Setup

### Prometheus Stack
```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace \
  -f monitoring-values.yaml
```

### Custom Dashboards
```bash
kubectl apply -f monitoring/grafana/dashboards/
```

## 7. Backup Strategy

### Database Backups
```bash
# Install Velero
velero install \
  --provider aws \
  --plugins velero/velero-plugin-for-aws:v1.2.1 \
  --bucket claudeosaar-backups \
  --backup-location-config region=eu-central-1 \
  --snapshot-location-config region=eu-central-1

# Create backup schedule
velero schedule create daily-backup \
  --schedule="0 2 * * *" \
  --include-namespaces claudeosaar
```

### Workspace Backups
```bash
# Configure S3 sync for workspace volumes
kubectl apply -f k8s/workspace-backup-cronjob.yaml
```

## 8. Security Hardening

### Network Policies
```bash
kubectl apply -f k8s/network-policies.yaml
```

### Pod Security Policies
```bash
kubectl apply -f k8s/pod-security-policies.yaml
```

### RBAC
```bash
kubectl apply -f k8s/rbac.yaml
```

## 9. Performance Tuning

### Database Optimization
```sql
-- Optimize PostgreSQL
ALTER SYSTEM SET shared_buffers = '4GB';
ALTER SYSTEM SET effective_cache_size = '12GB';
ALTER SYSTEM SET maintenance_work_mem = '1GB';
ALTER SYSTEM SET work_mem = '32MB';
```

### Redis Configuration
```bash
# Apply Redis config
kubectl create configmap redis-config --from-file=redis.conf
```

## 10. Disaster Recovery

### Multi-Region Setup
```bash
# Deploy to secondary region
kubectl config use-context claudeosaar-dr
helm install claudeosaar-dr claudeosaar/claudeosaar \
  --namespace claudeosaar \
  -f dr-values.yaml
```

### Database Replication
```bash
# Configure streaming replication
kubectl apply -f k8s/postgres-replication.yaml
```

## 11. Monitoring & Alerts

### Alert Rules
```yaml
groups:
- name: claudeosaar-alerts
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    annotations:
      summary: High error rate detected
      
  - alert: WorkspaceDown
    expr: up{job="claudeosaar-api"} == 0
    annotations:
      summary: API server is down
      
  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
    annotations:
      summary: Container memory usage is high
```

## 12. Maintenance Procedures

### Rolling Updates
```bash
helm upgrade claudeosaar claudeosaar/claudeosaar \
  --namespace claudeosaar \
  --set image.tag=2.3.1 \
  --wait
```

### Database Maintenance
```bash
# Vacuum and analyze
kubectl exec -it postgres-0 -- psql -U claude -d claudeosaar \
  -c "VACUUM ANALYZE;"
```

## 13. Troubleshooting

### Common Issues

1. **Container CrashLoopBackOff**
```bash
kubectl logs -n claudeosaar <pod-name> --previous
kubectl describe pod -n claudeosaar <pod-name>
```

2. **Database Connection Issues**
```bash
# Test connection
kubectl run -it --rm psql --image=postgres:15 \
  --command -- psql -h postgres -U claude -d claudeosaar
```

3. **Memory Issues**
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n claudeosaar
```

## 14. Health Checks

### Automated Health Monitoring
```bash
# Deploy health check cronjob
kubectl apply -f k8s/health-check-cronjob.yaml
```

### Manual Health Check
```bash
./scripts/health-check.sh
```

## 15. Compliance & Auditing

### Audit Logging
```bash
# Enable audit logging
kubectl apply -f k8s/audit-policy.yaml
```

### Compliance Scanning
```bash
# Run compliance checks
kubectl apply -f k8s/compliance-scanner.yaml
```

## Support

- Documentation: https://docs.claudeosaar.saarland
- Status Page: https://status.claudeosaar.saarland
- Support: support@claudeosaar.saarland
- Emergency: +49 xxx xxx xxx