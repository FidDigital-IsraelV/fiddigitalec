
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CaseStudy } from '@/types/database.types';
import { ArrowLeft } from 'lucide-react';

const CaseStudyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as CaseStudy;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }
  
  if (!caseStudy) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Caso de estudio no encontrado</h1>
        <p className="text-xl mb-8">El caso de estudio que estás buscando no existe o ha sido eliminado.</p>
        <Link to="/case-studies" className="text-indigo-800 hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Casos de Éxito
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Link to="/case-studies" className="text-indigo-800 hover:underline flex items-center mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a Casos de Éxito
      </Link>
      
      {/* Header */}
      <div className="mb-8">
        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm inline-block mb-4">
          {caseStudy.category}
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{caseStudy.title}</h1>
        
        <p className="text-xl text-gray-600">{caseStudy.excerpt}</p>
      </div>
      
      {/* Featured Image */}
      {caseStudy.image_url && (
        <div className="mb-12">
          <img 
            src={caseStudy.image_url} 
            alt={caseStudy.title} 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Stats */}
      {caseStudy.stats && caseStudy.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-gray-50 rounded-lg p-8">
          {caseStudy.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-indigo-800 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: caseStudy.content }} />
      </div>
    </div>
  );
};

export default CaseStudyDetail;
