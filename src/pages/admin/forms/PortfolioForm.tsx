import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
}

const PortfolioForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    content: '',
    image_url: '',
    technologies: [],
    client_name: '',
    project_url: '',
    slug: ''
  });

  // Fetch portfolio item if editing
  const { data: portfolioItem, isLoading } = useQuery({
    queryKey: ['portfolio', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as PortfolioItem;
    },
    enabled: !!id
  });

  // Update form data when portfolio item is loaded
  useEffect(() => {
    if (portfolioItem) {
      setFormData(portfolioItem);
    }
  }, [portfolioItem]);

  // Create or update portfolio item
  const mutation = useMutation({
    mutationFn: async (data: Partial<PortfolioItem>) => {
      if (id) {
        const { error } = await supabase
          .from('portfolio')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success(id ? 'Proyecto actualizado con éxito' : 'Proyecto creado con éxito');
      navigate('/admin/portfolio');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate slug from title
      const slug = formData.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || '';

      await mutation.mutateAsync({
        ...formData,
        slug
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const technologies = e.target.value.split(',').map(tech => tech.trim());
    setFormData(prev => ({ ...prev, technologies }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Editar Proyecto' : 'Nuevo Proyecto'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">URL de la Imagen</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Nombre del Cliente</Label>
              <Input
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_url">URL del Proyecto</Label>
              <Input
                id="project_url"
                name="project_url"
                value={formData.project_url}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Tecnologías (separadas por comas)</Label>
              <Input
                id="technologies"
                name="technologies"
                value={formData.technologies?.join(', ')}
                onChange={handleTechnologiesChange}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/portfolio')}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {id ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioForm; 