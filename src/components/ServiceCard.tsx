
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  className?: string;
  iconClassName?: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  href,
  className,
  iconClassName,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="mb-5">
        <div className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl bg-fidblue/10 text-fidblue transition-colors group-hover:bg-fidblue group-hover:text-white",
          iconClassName
        )}>
          {icon}
        </div>
      </div>
      <h3 className="mb-2 text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <a 
        href={href} 
        className="inline-flex items-center text-fidblue hover:underline font-medium"
      >
        Más información
        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </a>
    </motion.div>
  );
};

export default ServiceCard;
