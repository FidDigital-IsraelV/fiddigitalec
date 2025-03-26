
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PayPhoneButtonProps {
  planId: string;
  planTitle: string;
  amount: number;
  email: string;
  onSuccess?: (transactionId: string) => void;
  className?: string;
}

const PayPhoneButton: React.FC<PayPhoneButtonProps> = ({
  planId,
  planTitle, 
  amount,
  email,
  onSuccess,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // First, create a record of the purchase attempt
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          plan_id: planId,
          email,
          amount,
          status: 'pending',
        })
        .select('id')
        .single();
      
      if (purchaseError) {
        throw new Error(`Error al registrar la compra: ${purchaseError.message}`);
      }

      // Now, call our edge function to initialize the PayPhone payment
      const { data, error } = await supabase.functions.invoke('create-payphone-payment', {
        body: {
          amount: amount * 100, // Convert to cents as required by PayPhone
          purchaseId: purchase.id,
          planTitle,
          email
        }
      });

      if (error) {
        throw new Error(`Error al iniciar el pago: ${error.message}`);
      }

      // Open the PayPhone payment window
      if (data.paymentUrl) {
        window.open(data.paymentUrl, '_blank');
        toast.success('Página de pago abierta. Complete su transacción.', {
          description: 'Una vez completada la transacción, será redireccionado de vuelta a nuestro sitio.'
        });
        
        if (onSuccess && data.transactionId) {
          onSuccess(data.transactionId);
        }
      } else {
        throw new Error('No se pudo obtener el enlace de pago');
      }
    } catch (error) {
      console.error('Error en el proceso de pago:', error);
      toast.error('Error al procesar el pago', { 
        description: error.message 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading} 
      className={className}
    >
      {isLoading ? 'Procesando...' : 'Pagar con PayPhone'}
    </Button>
  );
};

export default PayPhoneButton;
