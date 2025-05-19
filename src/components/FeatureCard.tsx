import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
  extended?: string;
  steps?: {
    title: string;
    description: string;
  }[];
  demoUrl?: string;
  featureLevel?: 'basic' | 'advanced' | 'expert';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  gradient, 
  index, 
  extended,
  steps,
  demoUrl,
  featureLevel = 'basic'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const levelColors = {
    basic: 'from-blue-500/10 to-blue-600/10',
    advanced: 'from-purple-500/10 to-purple-600/10',
    expert: 'from-amber-500/10 to-amber-600/10'
  };

  useEffect(() => {
    if (showExtended && steps?.length) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3000);
      return () => clearInterval(timer);
    }
    // Return undefined for the else case
    return undefined;
  }, [showExtended, steps]);

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

  const parallaxVariants = {
    hover: {
      y: -5,
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
      variants={parallaxVariants}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowExtended(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowExtended(false);
      }}
    >
      <Card
        variant="glass"
        hover="scale"
        className={cn(
          "relative h-full group transition-all duration-300",
          isHovered && "transform scale-[1.02] shadow-xl"
        )}
      >
        {/* Gradient Background */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl',
            gradient
          )}
        />

        {/* Icon Container with Enhanced Animation */}
        <div className="relative mb-4 transform-gpu">
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            className={cn(
              'relative p-3 bg-gradient-to-br rounded-lg inline-block cursor-pointer',
              gradient
            )}
            whileTap={{ scale: 0.95 }}
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
        <motion.div
          initial={false}
          animate={{ height: showExtended ? "auto" : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold group-hover:text-primary-300 transition-colors">
              {title}
            </h3>
            {featureLevel && (
              <span className={cn(
                "px-2 py-1 text-xs rounded-full",
                levelColors[featureLevel],
                "border border-primary-500/20"
              )}>
                {featureLevel}
              </span>
            )}
          </div>

          <p className="text-neutral-400 leading-relaxed">
            {description}
          </p>
          
          <AnimatePresence>
            {showExtended && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4"
              >
                {extended && (
                  <div className="pt-4 border-t border-neutral-800">
                    <p className="text-sm text-neutral-400">{extended}</p>
                  </div>
                )}

                {steps && (
                  <div className="pt-4 border-t border-neutral-800">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-2"
                      >
                        <h4 className="font-medium text-sm text-primary-300">
                          Step {currentStep + 1}: {steps[currentStep].title}
                        </h4>
                        <p className="text-sm text-neutral-400">
                          {steps[currentStep].description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-1 mt-3 justify-center">
                      {steps.map((_, i) => (
                        <button
                          key={i}
                          className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            i === currentStep ? "bg-primary-500" : "bg-neutral-700"
                          )}
                          onClick={() => setCurrentStep(i)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {demoUrl && (
                  <div className="pt-4 border-t border-neutral-800">
                    <button
                      onClick={() => setShowDemo(!showDemo)}
                      className="text-sm text-primary-300 hover:text-primary-200 transition-colors"
                    >
                      {showDemo ? "Hide Demo" : "Show Demo"}
                    </button>
                    {showDemo && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2"
                      >
                        <iframe
                          src={demoUrl}
                          className="w-full h-[200px] rounded-lg border border-neutral-800"
                          title={`Demo for ${title}`}
                        />
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
