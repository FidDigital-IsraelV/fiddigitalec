
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PaymentPlan } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import PricingCard from '@/components/PricingCard';
import { useAuth } from '@/contexts/AuthContext';
import PayPhoneButton from '@/components/payment/PayPhoneButton';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

const Planes = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [requirements, setRequirements] = useState('');

  // Fetch all plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ['payment-plans-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data as PaymentPlan[];
    }
  });

  const handleSelectPlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    window.scrollTo({
      top: document.getElementById('checkout-form')?.offsetTop,
      behavior: 'smooth'
    });
  };

  const handleSubmitRequirements = async () => {
    if (!selectedPlan) {
      toast.error('Por favor, seleccione un plan');
      return;
    }

    if (!email || !email.includes('@')) {
      toast.error('Por favor, ingrese un email válido');
      return;
    }

    // Save requirements
    const { error } = await supabase
      .from('purchases')
      .update({ requirements })
      .eq('email', email)
      .eq('plan_id', selectedPlan.id)
      .eq('status', 'pending');
    
    if (error) {
      toast.error(`Error al guardar requerimientos: ${error.message}`);
    } else {
      toast.success('Requerimientos guardados correctamente');
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
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Planes de Servicio</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Seleccione el plan que mejor se adapte a sus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans?.map((plan) => (
          <PricingCard
            key={plan.id}
            title={plan.title}
            price={`$${plan.price.toFixed(2)}`}
            description={plan.description}
            features={plan.features.map(feature => ({ text: feature, included: true }))}
            ctaText="Seleccionar Plan"
            ctaLink="#"
            popular={plan.is_popular}
            onClick={() => handleSelectPlan(plan)}
          />
        ))}
      </div>

      {selectedPlan && (
        <div id="checkout-form" className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-fidblue text-white p-6">
            <h2 className="text-2xl font-bold">Complete su compra</h2>
            <p className="text-lg">{selectedPlan.title} - ${selectedPlan.price.toFixed(2)}</p>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Su correo electrónico"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Requerimientos específicos</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Describa sus necesidades específicas para este servicio"
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <PayPhoneButton
                planId={selectedPlan.id}
                planTitle={selectedPlan.title}
                amount={selectedPlan.price}
                email={email}
                className="w-full"
                onSuccess={() => handleSubmitRequirements()}
              />
              
              <p className="text-sm text-gray-500 text-center">
                Al hacer clic en "Pagar" acepta nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planes;
