import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Check, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  gradient: string;
  index: number;
}

const PricingCard: React.FC<PricingTier> = ({ name, price, description, features, cta, popular, gradient, index }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'relative',
        popular && 'z-10'
      )}
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
          'relative h-full',
          popular && 'scale-105'
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

          {/* Features List */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, featureIndex) => (
              <motion.li
                key={featureIndex}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + featureIndex * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  'mt-0.5 p-0.5 rounded-full',
                  `bg-gradient-to-br ${gradient}`
                )}>
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="text-neutral-300">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA Button */}
          <Button
            fullWidth
            variant={popular ? 'primary' : 'glass'}
            size="lg"
            onClick={() => router.push(name === 'Enterprise' ? '/contact' : '/signup')}
            className={cn(
              'group',
              popular && 'shadow-lg hover:shadow-xl'
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