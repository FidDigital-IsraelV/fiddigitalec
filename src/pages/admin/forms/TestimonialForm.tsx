
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Testimonial } from '@/types/database.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Star } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { useForm } from 'react-hook-form';

interface TestimonialFormData {
  name: string;
  company: string;
  role: string;
  content: string;
  rating: number;
}

const TestimonialForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [rating, setRating] = useState<number>(5);

  const { register, handleSubmit, reset } = useForm<TestimonialFormData>();

  // Obtener el testimonio si estamos editando
  const { data: testimonial, isLoading } = useQuery({
    queryKey: ['testimonial', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Testimonial;
    },
    enabled: isEditing
  });

  // Cargar datos del testimonio en el formulario
  useEffect(() => {
    if (testimonial) {
      reset({
        name: testimonial.name,
        company: testimonial.company,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating || 5
      });
      setAvatarUrl(testimonial.avatar_url || '');
      setRating(testimonial.rating || 5);
    }
  }, [testimonial, reset]);

  // Mutación para crear/actualizar el testimonio
  const mutation = useMutation({
    mutationFn: async (data: TestimonialFormData & { avatar_url: string | null }) => {
      if (isEditing) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            ...data,
            avatar_url: data.avatar_url || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      } else {
        const { data: newTestimonial, error } = await supabase
          .from('testimonials')
          .insert([{
            ...data,
            avatar_url: data.avatar_url || null
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        return newTestimonial;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonial', id] });
      toast.success(isEditing ? 'Testimonio actualizado con éxito' : 'Testimonio creado con éxito');
      navigate('/admin/testimonios');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const onSubmit = (data: TestimonialFormData) => {
    mutation.mutate({
      ...data,
      rating,
      avatar_url: avatarUrl
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? 'Editar' : 'Crear'} Testimonio
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/testimonios')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder="Nombre completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  {...register('company', { required: true })}
                  placeholder="Nombre de la empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  {...register('role', { required: true })}
                  placeholder="Cargo en la empresa"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Foto de perfil (opcional)</Label>
              <ImageUpload
                initialImageUrl={avatarUrl}
                onImageUploaded={setAvatarUrl}
                bucket="avatars"
              />
            </div>

            <div className="space-y-2">
              <Label>Valoración</Label>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Testimonio</Label>
              <Textarea
                id="content"
                {...register('content', { required: true })}
                placeholder="Contenido del testimonio"
                className="min-h-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="bg-fidblue hover:bg-blue-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
