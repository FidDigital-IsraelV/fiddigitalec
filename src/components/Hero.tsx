
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  imageSrc?: string;
  showScrollIndicator?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title = "Transformamos Ideas en Experiencias Digitales",
  subtitle = "Agencia digital especializada en desarrollo web, marketing digital, SEO y diseño UX/UI que impulsa el crecimiento de tu negocio",
  ctaText = "Cotizar Proyecto",
  ctaAction,
  imageSrc,
  showScrollIndicator = true,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-0" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 z-0" />
      
      {/* Animated Gradient Blob */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-fidblue/10 rounded-full filter blur-3xl z-0"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl z-0"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, -30, 0],
          y: [0, 50, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-fidblue/10 text-fidblue text-sm font-medium mb-6">
              Expertos en Transformación Digital
            </span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h1>

          <motion.p 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {ctaAction && (
              <Button onClick={ctaAction} size="lg" className="px-8 py-6 text-base">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base">
              <Link to="/servicios">
                Conocer Servicios
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5, duration: 1 },
            y: { repeat: Infinity, duration: 1.5 }
          }}
          onClick={scrollToContent}
        >
          <ChevronDown className="h-8 w-8 text-fidblue" />
        </motion.div>
      )}
    </div>
  );
};

export default Hero;
