
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BlogPost } from '@/types/database.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { useForm } from 'react-hook-form';
import { slugify } from '@/lib/utils';

interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
}

const BlogForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [imageUrl, setImageUrl] = useState<string>('');

  const { register, handleSubmit, reset, setValue, watch } = useForm<BlogFormData>();
  const title = watch('title', '');

  // Obtener el post si estamos editando
  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as BlogPost;
    },
    enabled: isEditing
  });

  // Cargar datos del post en el formulario
  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        author: post.author,
        read_time: post.read_time
      });
      setImageUrl(post.image_url);
    }
  }, [post, reset]);

  // Mutación para crear/actualizar el post
  const mutation = useMutation({
    mutationFn: async (data: BlogFormData & { slug: string, image_url: string }) => {
      if (isEditing) {
        const { error } = await supabase
          .from('blog_posts')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      } else {
        const { data: newPost, error } = await supabase
          .from('blog_posts')
          .insert([{
            ...data,
            published_at: new Date().toISOString()
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        return newPost;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost', id] });
      toast.success(isEditing ? 'Post actualizado con éxito' : 'Post creado con éxito');
      navigate('/admin/blog');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const onSubmit = (data: BlogFormData) => {
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
          {isEditing ? 'Editar' : 'Crear'} Post
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/blog')}
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
                placeholder="Título del post"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  {...register('author', { required: true })}
                  placeholder="Autor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="read_time">Tiempo de lectura</Label>
                <Input
                  id="read_time"
                  {...register('read_time', { required: true })}
                  placeholder="Ej: 5 min"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen destacada</Label>
              <ImageUpload
                initialImageUrl={imageUrl}
                onImageUploaded={setImageUrl}
                bucket="blog"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt', { required: true })}
                placeholder="Resumen breve del post"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                {...register('content', { required: true })}
                placeholder="Contenido completo del post"
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

export default BlogForm;
