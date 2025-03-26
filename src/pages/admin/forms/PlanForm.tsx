
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PaymentPlan } from '@/types/database.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface PlanFormData {
  title: string;
  price: number;
  description: string;
  is_popular: boolean;
}

const PlanForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const { register, handleSubmit, reset, setValue, watch } = useForm<PlanFormData>();

  // Fetch plan if editing
  const { data: plan, isLoading } = useQuery({
    queryKey: ['paymentPlan', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as PaymentPlan;
    },
    enabled: isEditing
  });

  // Set form values when plan data is loaded
  useEffect(() => {
    if (plan) {
      reset({
        title: plan.title,
        price: plan.price,
        description: plan.description,
        is_popular: plan.is_popular
      });
      setFeatures(plan.features || []);
    }
  }, [plan, reset]);

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Mutation for create/update
  const mutation = useMutation({
    mutationFn: async (data: PlanFormData & { features: string[] }) => {
      if (isEditing) {
        const { error } = await supabase
          .from('payment_plans')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
        return { id };
      } else {
        const { data: newPlan, error } = await supabase
          .from('payment_plans')
          .insert([{
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('id')
          .single();
        
        if (error) throw error;
        return newPlan;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-plans'] });
      toast.success(isEditing ? 'Plan actualizado con éxito' : 'Plan creado con éxito');
      navigate('/admin/planes');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    }
  });

  const onSubmit = (data: PlanFormData) => {
    mutation.mutate({
      ...data,
      features
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
          {isEditing ? 'Editar' : 'Crear'} Plan de Pago
        </h1>
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/planes')}
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
                placeholder="Título del plan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { 
                  required: true,
                  valueAsNumber: true,
                  min: 0
                })}
                placeholder="Precio"
              />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <Switch
                id="is_popular"
                {...register('is_popular')}
              />
              <Label htmlFor="is_popular">Marcar como popular</Label>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
                placeholder="Descripción del plan"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Características</Label>
              <div className="flex space-x-2">
                <Input
                  id="new-feature"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nueva característica"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFeature();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  onClick={handleAddFeature}
                  variant="outline"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <span>{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {features.length === 0 && (
                  <p className="text-sm text-gray-500">No hay características agregadas</p>
                )}
              </div>
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

export default PlanForm;
