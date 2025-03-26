
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

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const AdminTestimonios = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { data: testimonials, isLoading, refetch } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Testimonial[];
    }
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error al eliminar el testimonio: ' + error.message);
      } else {
        toast.success('Testimonio eliminado correctamente');
        refetch();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al eliminar el testimonio');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Testimonios</h1>
        <Link 
          to="/admin/testimonios/nuevo" 
          className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Testimonio
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium">{testimonial.name}</TableCell>
                  <TableCell>{testimonial.company}</TableCell>
                  <TableCell>{testimonial.role}</TableCell>
                  <TableCell>{testimonial.created_at ? format(new Date(testimonial.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/testimonios/editar/${testimonial.id}`}
                        className="inline-flex items-center p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        disabled={isDeleting === testimonial.id}
                        className="inline-flex items-center p-1 text-red-600 hover:text-red-800"
                      >
                        {isDeleting === testimonial.id ? (
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
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">No hay testimonios</p>
          <Link 
            to="/admin/testimonios/nuevo" 
            className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear el primer testimonio
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonios;
