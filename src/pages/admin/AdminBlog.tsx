
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

const AdminBlog = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error al eliminar el post: ' + error.message);
      } else {
        toast.success('Post eliminado correctamente');
        refetch();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al eliminar el post');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <Link 
          to="/admin/blog/nuevo" 
          className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Post
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Fecha de publicación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>{post.published_at ? format(new Date(post.published_at), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/blog/editar/${post.id}`}
                        className="inline-flex items-center p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                        className="inline-flex items-center p-1 text-red-600 hover:text-red-800"
                      >
                        {isDeleting === post.id ? (
                          <div className="animate-spin h-4 w-4 border-b-2 border-red-600 rounded-full"></div>
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">No hay posts en el blog</p>
          <Link 
            to="/admin/blog/nuevo" 
            className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear el primer post
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
