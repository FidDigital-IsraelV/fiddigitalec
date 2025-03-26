
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { CaseStudy } from '@/types/database.types';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  className?: string;
  delay?: number;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  caseStudy,
  className,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={caseStudy.image_url} 
          alt={caseStudy.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <Badge variant="secondary" className="mb-3">
          {caseStudy.category}
        </Badge>
        <h3 className="mb-2 text-xl font-semibold tracking-tight group-hover:text-fidblue transition-colors">
          {caseStudy.title}
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-400 line-clamp-2">
          {caseStudy.excerpt}
        </p>

        {caseStudy.stats && (
          <div className="grid grid-cols-2 gap-4 mb-6 border-t border-b border-gray-100 dark:border-gray-800 py-4">
            {caseStudy.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="font-semibold text-lg">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <Link 
          to={`/casos/${caseStudy.slug}`}
          className="inline-flex items-center text-fidblue hover:underline font-medium"
        >
          Ver caso de estudio 
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};

export default CaseStudyCard;
