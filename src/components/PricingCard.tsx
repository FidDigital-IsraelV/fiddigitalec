
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  ctaText,
  ctaLink,
  popular = false,
  className,
  delay = 0,
  onClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "relative rounded-2xl border bg-white dark:bg-gray-900 p-6 shadow-sm",
        popular 
          ? "border-fidblue shadow-lg dark:border-fidblue/70" 
          : "border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-0 right-0 flex justify-center">
          <span className="bg-fidblue text-white text-xs font-medium py-1 px-3 rounded-full">
            Más Popular
          </span>
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Consultar" && (
          <span className="text-gray-600 dark:text-gray-400 ml-1">/Proyecto</span>
        )}
      </div>

      <ul className="mb-8 space-y-3">
        {features.map((feature, index) => (
          <li 
            key={index} 
            className={cn(
              "flex items-start text-sm",
              feature.included 
                ? "text-gray-900 dark:text-gray-100" 
                : "text-gray-400 dark:text-gray-500"
            )}
          >
            <Check className={cn(
              "mr-2 h-4 w-4 mt-0.5",
              feature.included ? "text-fidblue" : "text-gray-300 dark:text-gray-600"
            )} />
            {feature.text}
          </li>
        ))}
      </ul>

      {onClick ? (
        <Button 
          onClick={onClick}
          className={cn(
            "w-full", 
            popular ? "" : "bg-gray-900 hover:bg-gray-800 dark:bg-fidblue dark:hover:bg-fidblue-dark"
          )}
        >
          {ctaText}
        </Button>
      ) : (
        <Button 
          asChild 
          className={cn(
            "w-full", 
            popular ? "" : "bg-gray-900 hover:bg-gray-800 dark:bg-fidblue dark:hover:bg-fidblue-dark"
          )}
        >
          <a href={ctaLink}>
            {ctaText}
          </a>
        </Button>
      )}
    </motion.div>
  );
};

export default PricingCard;
