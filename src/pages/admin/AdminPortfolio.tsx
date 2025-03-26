import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  client_name: string;
  project_url: string;
  slug: string;
  created_at: string;
}

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all portfolio items
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PortfolioItem[];
    }
  });

  // Delete portfolio item mutation
  const deleteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      toast.success('Proyecto eliminado con éxito');
    },
    onError: (error) => {
      toast.error(`Error al eliminar el proyecto: ${error.message}`);
    }
  });

  const handleDelete = (itemId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este proyecto?')) {
      deleteMutation.mutate(itemId);
    }
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
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <Button 
          onClick={() => navigate('/admin/portfolio/nuevo')}
          className="bg-fidblue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {portfolioItems?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-medium">No hay proyectos</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Comience agregando un nuevo proyecto al portfolio
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolioItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.client_name}</TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {item.project_url ? (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fidblue hover:underline"
                    >
                      Ver proyecto
                    </a>
                  ) : (
                    'No disponible'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/portfolio/${item.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminPortfolio; 