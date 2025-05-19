import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        variant="glass"
        hover="scale"
        className="relative h-full group"
      >
        {/* Gradient Background */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl',
            gradient
          )}
        />

        {/* Icon Container */}
        <div className="relative mb-4">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.5 }}
            className={cn(
              'relative p-3 bg-gradient-to-br rounded-lg inline-block',
              gradient
            )}
          >
            {icon}
          </motion.div>
          {/* Icon Glow */}
          <motion.div
            className={cn(
              'absolute -inset-2 bg-gradient-to-br rounded-lg blur-lg opacity-0 group-hover:opacity-50',
              gradient
            )}
            animate={{
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-300 transition-colors">
          {title}
        </h3>
        <p className="text-neutral-400 leading-relaxed">
          {description}
        </p>

        {/* Hover Border Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
          <div className="absolute inset-y-0 -left-px w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent" />
          <div className="absolute inset-y-0 -right-px w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent" />
        </motion.div>

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-300 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-300 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-300 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary-500/0 group-hover:border-primary-500/50 transition-all duration-300 rounded-br-lg" />
      </Card>
    </motion.div>
  );
};

export default FeatureCard;