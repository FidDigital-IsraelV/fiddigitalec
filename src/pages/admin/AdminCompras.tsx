
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Purchase, PaymentPlan } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const AdminCompras = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch all purchases with plan details
  const { data: purchases, isLoading } = useQuery({
    queryKey: ['purchases', selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('purchases')
        .select(`
          *,
          payment_plans:plan_id (title)
        `);
      
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (Purchase & { payment_plans: { title: string } })[];
    }
  });

  // Filter purchases by search term
  const filteredPurchases = purchases?.filter(purchase => {
    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.email.toLowerCase().includes(searchLower) ||
      purchase.payment_plans?.title.toLowerCase().includes(searchLower) ||
      purchase.transaction_id?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP', { locale: es });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Completado</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Pendiente</span>;
      case 'failed':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Fallido</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">{status}</span>;
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
      <h1 className="text-3xl font-bold tracking-tight">Compras</h1>

      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <Tabs 
          defaultValue="all" 
          value={selectedStatus} 
          onValueChange={setSelectedStatus}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="failed">Fallidos</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar por email o plan..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPurchases?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-medium">No hay compras</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            No se encontraron registros de compras
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Detalles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases?.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{formatDate(purchase.created_at)}</TableCell>
                <TableCell>{purchase.email}</TableCell>
                <TableCell>{purchase.payment_plans?.title || 'N/A'}</TableCell>
                <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(purchase.status)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Implement view purchase details
                      alert('Detalles de la compra: ' + 
                        `\nID: ${purchase.id}` +
                        `\nRequisitos: ${purchase.requirements || 'No especificados'}` + 
                        `\nTransacción: ${purchase.transaction_id || 'No disponible'}`
                      );
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
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

export default AdminCompras;
