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

      // Call PayPhone API directly
      const response = await fetch(import.meta.env.VITE_PAYPHONE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PAYPHONE_API_KEY}`
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          clientTransactionId: purchase.id,
          responseUrl: `${import.meta.env.VITE_PAYPHONE_CLIENT_URL}/payment-success`,
          cancellationUrl: `${import.meta.env.VITE_PAYPHONE_CLIENT_URL}/payment-cancelled`,
          storeId: import.meta.env.VITE_PAYPHONE_STORE_ID,
          reference: `Plan ${planTitle}`,
          email: email
        })
      });

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(`Error de PayPhone: ${paymentData.message || 'Error desconocido'}`);
      }

      // Open the PayPhone payment window
      if (paymentData.paymentUrl) {
        window.open(paymentData.paymentUrl, '_blank');
        toast.success('Página de pago abierta. Complete su transacción.', {
          description: 'Una vez completada la transacción, será redireccionado de vuelta a nuestro sitio.'
        });
        
        if (onSuccess && paymentData.transactionId) {
          onSuccess(paymentData.transactionId);
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
