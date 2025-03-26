import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import WhatsAppButton from '@/components/ui/whatsapp-button';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  content: string;
  image_url: string;
  technologies: string[];
  client_name: string;
  project_url: string;
  slug: string;
  created_at: string;
}

const PortfolioDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: project, isLoading } = useQuery({
    queryKey: ['portfolio', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as PortfolioItem;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Proyecto no encontrado</h1>
        <Button onClick={() => navigate('/portfolio')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Portfolio
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Button
        variant="ghost"
        onClick={() => navigate('/portfolio')}
        className="mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Portfolio
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-6 max-w-3xl mx-auto">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h1 className="text-2xl font-bold mb-1">{project.title}</h1>
            <p className="text-sm opacity-90">{project.client_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="md:col-span-2">
            <div className="prose dark:prose-invert max-w-none prose-sm">
              <div dangerouslySetInnerHTML={{ __html: project.content }} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-3">Detalles del Proyecto</h2>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Cliente:</span> {project.client_name}</p>
                <p><span className="font-medium">Fecha:</span> {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Tecnologías Utilizadas</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {project.project_url && (
              <Button
                asChild
                className="w-full"
                variant="outline"
                size="sm"
              >
                <a 
                  href={project.project_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('URL del proyecto:', project.project_url);
                    window.location.href = project.project_url;
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Proyecto en Vivo
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <WhatsAppButton 
        phoneNumber="+593995855756" 
        message="Hola, me gustaría obtener más información sobre sus servicios."
      />
    </div>
  );
};

export default PortfolioDetail; 