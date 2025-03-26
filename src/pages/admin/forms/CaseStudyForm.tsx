
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CaseStudy } from '@/types/database.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { useForm, useFieldArray } from 'react-hook-form';
import { slugify } from '@/lib/utils';

interface CaseFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  stats: { label: string; value: string }[];
}

const CaseStudyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [imageUrl, setImageUrl] = useState<string>('');

  const { register, handleSubmit, reset, watch, control } = useForm<CaseFormData>({
    defaultValues: {
      stats: [{ label: '', value: '' }]
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "stats"
  });

  const title = watch('title', '');

  // Obtener el caso si estamos editando
  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ['caseStudy', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as CaseStudy;
    },
    enabled: isEditing
  });

  // Cargar datos del caso en el formulario
  useEffect(() => {
    if (caseStudy) {
      reset({
        title: caseStudy.title,
        excerpt: caseStudy.excerpt,
        content: caseStudy.content,
        category: caseStudy.category,
        stats: caseStudy.stats || [{ label: '', value: '' }]
      });
      setImageUrl(caseStudy.image_url);
    }
  }, [caseStudy, reset]);

  // Mutación para crear/actualizar el caso
  const mutation = useMutation({
    mutationFn: async (data: CaseFormData & { slug: string, image_url: string }) => {
      // Filtrar estadísticas vacías
      const filteredStats = data.stats.filter(stat => stat.label.trim() !== '' && stat.value.trim() !== '');
      
      if (isEditing) {
        const { error } = await supabase
          .from('case_studies')
          .update({
            ...data,
            stats: filteredStats.length > 0 ? filteredStats : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      } else {
        const { data: newCase, error } = await supabase
          .from('case_studies')
          .insert([{
            ...data,
            stats: filteredStats.length > 0 ? filteredStats : null
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        return newCase;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseStudies'] });
      queryClient.invalidateQueries({ queryKey: ['caseStudy', id] });
      toast.success(isEditing ? 'Caso actualizado con éxito' : 'Caso creado con éxito');
      navigate('/admin/casos');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const onSubmit = (data: CaseFormData) => {
    if (!imageUrl) {
      toast.error('Debes subir una imagen');
      return;
    }

    const slug = slugify(data.title);
    
    mutation.mutate({
      ...data,
      slug,
      image_url: imageUrl
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
          {isEditing ? 'Editar' : 'Crear'} Caso de Éxito
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/casos')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                placeholder="Título del caso"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={title ? slugify(title) : ''}
                readOnly
                className="bg-gray-100"
              />
              <p className="text-xs text-gray-500">Generado automáticamente desde el título</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                {...register('category', { required: true })}
                placeholder="Categoría"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagen destacada</Label>
              <ImageUpload
                initialImageUrl={imageUrl}
                onImageUploaded={setImageUrl}
                bucket="cases"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Estadísticas</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({ label: '', value: '' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Añadir
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Etiqueta"
                    {...register(`stats.${index}.label`)}
                  />
                  <Input
                    placeholder="Valor"
                    {...register(`stats.${index}.value`)}
                  />
                  {index > 0 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt', { required: true })}
                placeholder="Resumen breve del caso"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                {...register('content', { required: true })}
                placeholder="Contenido completo del caso"
                className="min-h-[300px]"
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

export default CaseStudyForm;
