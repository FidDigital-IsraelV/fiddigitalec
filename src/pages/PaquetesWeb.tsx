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
      setRequirements('');
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
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el pago');
      toast.error('Error al procesar el pago');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (plansLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        <p className="mt-4 text-gray-600">Cargando planes de pago...</p>
      </div>
    );
  }

  // Show error state
  if (plansError) {
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Paquetes Web
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Soluciones web profesionales adaptadas a tus necesidades
          </p>
        </div>

        {/* Planes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? 'border-indigo-600 shadow-indigo-100'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.title}
                </h3>
                <p className="text-4xl font-bold text-indigo-600 mb-4">
                  ${plan.price}
                  <span className="text-base font-normal text-gray-500">
                    /mes
                  </span>
                </p>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full ${
                    selectedPlan?.id === plan.id
                      ? 'bg-indigo-700 hover:bg-indigo-600'
                      : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
                >
                  {selectedPlan?.id === plan.id ? 'Plan Seleccionado' : 'Seleccionar Plan'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Formulario de Pago */}
        {selectedPlan && (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Completar Compra
            </h2>
            <div className="space-y-6">
              <div>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="requirements">Requisitos Específicos</Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe cualquier requisito específico para tu sitio web..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Resumen de Compra
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan Seleccionado:</span>
                    <span className="font-medium">{selectedPlan.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span className="font-medium">${selectedPlan.price}/mes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (12%):</span>
                    <span className="font-medium">
                      ${(selectedPlan.price * 0.12).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-indigo-600">
                    <span>Total:</span>
                    <span>
                      ${(selectedPlan.price * 1.12).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlan(null);
                    setEmail('');
                    setRequirements('');
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
                <PayPhoneButton
                  planId={selectedPlan.id}
                  planTitle={selectedPlan.title}
                  amount={selectedPlan.price}
                  email={email}
                  className="w-full bg-indigo-800 hover:bg-indigo-700"
                  onSuccess={handlePaymentSuccess}
                  onStart={handlePaymentStart}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaquetesWeb;
