
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/database.types';
import CaseStudyCard from '@/components/CaseStudyCard';

const CaseStudies = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: caseStudies, isLoading } = useQuery({
    queryKey: ['case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CaseStudy[];
    }
  });
  
  // Get unique categories
  const categories = [...new Set(caseStudies?.map(study => study.category))];
  
  const filteredCaseStudies = selectedCategory
    ? caseStudies?.filter(study => study.category === selectedCategory)
    : caseStudies;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Casos de Éxito</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre cómo hemos ayudado a nuestros clientes a alcanzar sus objetivos
        </p>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null ? 'bg-indigo-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          Todos
        </button>
        
        {categories?.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category ? 'bg-indigo-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies?.map((study, index) => (
            <CaseStudyCard 
              key={study.id} 
              caseStudy={study}
              delay={index * 0.1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CaseStudies;
