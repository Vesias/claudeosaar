import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Check, Star, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  gradient: string;
  index: number;
  featureDetails?: { [key: string]: string };
}

const PricingCard: React.FC<PricingTier> = ({ 
  name, 
  price, 
  description, 
  features, 
  cta, 
  popular, 
  gradient, 
  index,
  featureDetails = {}
}) => {
  const router = useRouter();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 100,
          delay: index * 0.1
        }
      });
    }
  }, [controls, inView, index]);

  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      whileHover="hover"
      variants={cardVariants}
      className={cn(
        'relative',
        popular && 'z-10'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {popular && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2"
        >
          <Badge variant="primary" size="lg" leftIcon={<Star className="h-4 w-4" />}>
            Most Popular
          </Badge>
        </motion.div>
      )}

      <Card
        variant={popular ? 'glow' : 'glass'}
        hover="scale"
        className={cn(
          'relative h-full transition-all duration-300',
          popular && 'scale-105',
          isHovered && 'shadow-2xl'
        )}
      >
        {/* Gradient Background for Popular Plan */}
        {popular && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-2xl" />
        )}

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-neutral-400 mb-4">{description}</p>
            <div className="text-4xl font-bold mb-1">
              {price}
              {price !== "€0" && <span className="text-base font-normal text-neutral-400">/month</span>}
            </div>
          </div>

          {/* Features List with Expandable Details */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + featureIndex * 0.05 }}
                className="relative"
              >
                <div 
                  className="flex items-start gap-3 cursor-pointer"
                  onClick={() => setExpandedFeature(expandedFeature === feature ? null : feature)}
                >
                  <div className={cn(
                    'mt-0.5 p-0.5 rounded-full transition-all duration-300',
                    `bg-gradient-to-br ${gradient}`,
                    isHovered && 'shadow-lg'
                  )}>
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-neutral-300">{feature}</span>
                  {featureDetails[feature] && (
                    <ChevronDown 
                      className={cn(
                        "h-4 w-4 text-neutral-400 transition-transform duration-300",
                        expandedFeature === feature && "transform rotate-180"
                      )} 
                    />
                  )}
                </div>
                
                <AnimatePresence>
                  {expandedFeature === feature && featureDetails[feature] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-7 mt-2 text-sm text-neutral-400 border-l-2 border-neutral-800 pl-4"
                    >
                      {featureDetails[feature]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
          </ul>

          {/* Enhanced CTA Button */}
          <Button
            fullWidth
            variant={popular ? 'primary' : 'glass'}
            size="lg"
            onClick={() => router.push(name === 'Enterprise' ? '/contact' : '/signup')}
            className={cn(
              'group transition-all duration-300',
              popular && 'shadow-lg hover:shadow-xl',
              isHovered && 'transform scale-105'
            )}
          >
            <span>{cta}</span>
            <motion.div
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              →
            </motion.div>
          </Button>
        </div>

        {/* Animated Border for Popular Plan */}
        {popular && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="absolute inset-0 rounded-2xl border-2 border-primary-500/50" />
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default PricingCard;
