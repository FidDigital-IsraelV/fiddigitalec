import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Purchase {
  id: string;
  plan_id: string;
  email: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
  plan?: {
    title: string;
  };
}

const AdminPurchases: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch purchases with plan details
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          plan:payment_plans(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Purchase[];
    }
  });

  // Update purchase status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Purchase['status'] }) => {
      const { error } = await supabase
        .from('purchases')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error) => {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar el estado');
    }
  });

  const handleStatusChange = async (purchaseId: string, newStatus: Purchase['status']) => {
    try {
      await updateStatusMutation.mutateAsync({ id: purchaseId, status: newStatus });
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Compras</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>ID Transacción</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases?.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.id}</TableCell>
                <TableCell>{purchase.plan?.title}</TableCell>
                <TableCell>{purchase.email}</TableCell>
                <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    purchase.status === 'completed' ? 'bg-green-100 text-green-800' :
                    purchase.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {purchase.status === 'completed' ? 'Completado' :
                     purchase.status === 'failed' ? 'Fallido' : 'Pendiente'}
                  </span>
                </TableCell>
                <TableCell>{purchase.transaction_id || '-'}</TableCell>
                <TableCell>{new Date(purchase.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    value={purchase.status}
                    onValueChange={(value) => handleStatusChange(purchase.id, value as Purchase['status'])}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="completed">Completado</SelectItem>
                      <SelectItem value="failed">Fallido</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminPurchases; 