
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

type CaseStudy = Database['public']['Tables']['case_studies']['Row'];

const AdminCasos = () => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { data: cases, isLoading, refetch } = useQuery({
    queryKey: ['caseStudies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CaseStudy[];
    }
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error('Error al eliminar el caso: ' + error.message);
      } else {
        toast.success('Caso eliminado correctamente');
        refetch();
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al eliminar el caso');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Casos de Éxito</h1>
        <Link 
          to="/admin/casos/nuevo" 
          className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Caso
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        </div>
      ) : cases && cases.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseStudy) => (
                <TableRow key={caseStudy.id}>
                  <TableCell className="font-medium">{caseStudy.title}</TableCell>
                  <TableCell>{caseStudy.category}</TableCell>
                  <TableCell>{caseStudy.created_at ? format(new Date(caseStudy.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/casos/editar/${caseStudy.id}`}
                        className="inline-flex items-center p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(caseStudy.id)}
                        disabled={isDeleting === caseStudy.id}
                        className="inline-flex items-center p-1 text-red-600 hover:text-red-800"
                      >
                        {isDeleting === caseStudy.id ? (
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
          <p className="mb-4 text-lg text-gray-500 dark:text-gray-400">No hay casos de éxito</p>
          <Link 
            to="/admin/casos/nuevo" 
            className="inline-flex items-center bg-fidblue hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear el primer caso
          </Link>
        </div>
      )}
    </div>
  );
};

export default AdminCasos;
