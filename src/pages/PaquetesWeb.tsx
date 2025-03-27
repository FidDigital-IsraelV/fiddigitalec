import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PaymentPlan } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import PayPhoneButton from '@/components/payment/PayPhoneButton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

const PaquetesWeb: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [requirements, setRequirements] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch payment plans with error handling
  const { data: plans, isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['payment-plans-web'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('payment_plans')
          .select('*')
          .order('price', { ascending: true });
        
        if (error) {
          console.error('Error fetching plans:', error);
          throw error;
        }
        
        if (!data) {
          throw new Error('No se encontraron planes de pago');
        }
        
        return data as PaymentPlan[];
      } catch (error) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

    try {
      const { error } = await supabase
        .from('purchases')
        .update({ requirements })
        .eq('email', email)
        .eq('plan_id', selectedPlan.id)
        .eq('status', 'pending');
      
      if (error) {
        console.error('Error saving requirements:', error);
        toast.error(`Error al guardar requerimientos: ${error.message}`);
      } else {
        toast.success('Requerimientos guardados correctamente');
      }
    } catch (error) {
      console.error('Error in handleSubmitRequirements:', error);
      toast.error('Error al guardar los requerimientos');
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      // Aquí puedes agregar cualquier lógica adicional después del pago exitoso
      toast.success('¡Pago completado con éxito!');
      setSelectedPlan(null);
      setEmail('');
    } catch (error) {
      console.error('Error al procesar el pago exitoso:', error);
      toast.error('Error al procesar el pago');
    }
  };

  const handlePaymentStart = async () => {
    if (!selectedPlan || !email) {
      toast.error('Por favor, seleccione un plan y complete su correo electrónico');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validar el correo electrónico
      if (!email.includes('@')) {
        throw new Error('Por favor, ingrese un correo electrónico válido');
      }

      // El registro de compra ahora se maneja en el PayPhoneButton
      setSelectedPlan(selectedPlan);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el pago');
      toast.error('Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        <p className="mt-4 text-gray-600">Cargando planes de pago...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar los planes</h2>
        <p className="text-gray-600 mb-4">Hubo un problema al cargar los planes de pago. Por favor, intente nuevamente.</p>
        <Button onClick={() => window.location.reload()}>
          Intentar nuevamente
        </Button>
      </div>
    );
  }

  // Show empty state
  if (!plans || plans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay planes disponibles</h2>
        <p className="text-gray-600">Por favor, vuelva más tarde para ver nuestros planes de pago.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Paquetes Web</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Seleccione el paquete que mejor se adapte a sus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden border-gradient h-full flex flex-col">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-3xl text-indigo-800 font-bold">
                  {plan.title}
                </CardTitle>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-4 flex-grow">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center">
                    <span className="text-sm text-gray-500 mr-1">a solo</span>
                    <span className="text-6xl font-bold text-indigo-900">${plan.price}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-indigo-800 hover:bg-indigo-700 mb-6"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Empieza ahora
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1 flex-shrink-0">
                        <Check className="h-5 w-5 text-pink-500" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedPlan && (
        <div id="checkout-form" className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-800 text-white p-6">
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
                className="w-full bg-indigo-800 hover:bg-indigo-700"
                onSuccess={handlePaymentSuccess}
                onStart={handlePaymentStart}
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

export default PaquetesWeb;
