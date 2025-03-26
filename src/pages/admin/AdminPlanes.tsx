
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentPlan } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminPlanes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch all plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['payment-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaymentPlan[];
    }
  });

  // Delete plan mutation
  const deleteMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('payment_plans')
        .delete()
        .eq('id', planId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-plans'] });
      toast.success('Plan eliminado con éxito');
    },
    onError: (error) => {
      toast.error(`Error al eliminar el plan: ${error.message}`);
    }
  });

  const handleDelete = (planId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este plan?')) {
      deleteMutation.mutate(planId);
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
        <h1 className="text-3xl font-bold tracking-tight">Planes de Pago</h1>
        <Button 
          onClick={() => navigate('/admin/planes/nuevo')}
          className="bg-fidblue hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      {plans?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-medium">No hay planes de pago</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Comience creando un nuevo plan de pago
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.title}</TableCell>
                <TableCell>${plan.price.toFixed(2)}</TableCell>
                <TableCell>{plan.is_popular ? 'Sí' : 'No'}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/admin/planes/editar/${plan.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminPlanes;
