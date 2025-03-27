import React, { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

declare global {
  interface Window {
    ppb: any;
    PPaymentButtonBox: any;
  }
}

interface PayPhoneButtonProps {
  planId: string;
  planTitle: string;
  amount: number;
  email: string;
  onSuccess?: (transactionId: string) => void;
  onStart?: () => void;
  className?: string;
}

const PayPhoneButton: React.FC<PayPhoneButtonProps> = ({
  planId,
  planTitle, 
  amount,
  email,
  onSuccess,
  onStart,
  className
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    if (buttonRef.current) {
      initializePayPhone();
    }

    return () => {
      if (window.ppb) {
        // Cleanup if needed
      }
    };
  }, [planId, planTitle, amount, email]);

  const initializePayPhone = async () => {
    try {
      setIsLoading(true);
      
      // Call onStart callback if provided
      if (onStart) {
        await onStart();
      }

      // Validate environment variables
      const apiKey = import.meta.env.VITE_PAYPHONE_API_KEY;
      const storeId = import.meta.env.VITE_PAYPHONE_STORE_ID;

      if (!apiKey || !storeId) {
        throw new Error('Faltan credenciales de PayPhone. Verifique las variables de entorno.');
      }

      // Log credentials for debugging (without exposing sensitive data)
      console.log('PayPhone Configuration:', {
        storeId,
        apiKeyLength: apiKey.length,
        environment: import.meta.env.MODE
      });

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

      // Convert amount to cents and calculate tax (12% IVA in Ecuador)
      const amountInCents = Math.round(amount * 100);
      const baseAmount = Math.round(amountInCents / 1.12); // Remove tax from total
      const taxAmount = amountInCents - baseAmount; // Calculate tax amount

      // Initialize PayPhone Button Box with explicit storeId
      const payPhoneConfig = {
        token: apiKey,
        clientTransactionId: purchase.id,
        amount: amountInCents,
        amountWithTax: baseAmount,
        tax: taxAmount,
        amountWithoutTax: 0,
        service: 0,
        tip: 0,
        currency: "USD",
        storeId: storeId.trim(), // Ensure no whitespace
        reference: `Plan ${planTitle}`,
        email: email,
        lang: "es",
        defaultMethod: "card",
        timeZone: -5
      };

      // Log the complete configuration (without sensitive data)
      console.log('PayPhone Button Configuration:', {
        ...payPhoneConfig,
        token: '***',
        storeId: payPhoneConfig.storeId
      });

      // Initialize the button
      window.ppb = new window.PPaymentButtonBox(payPhoneConfig).render('pp-button');

      // Listen for payment success
      window.addEventListener('message', async (event) => {
        if (event.data.type === 'PAYPHONE_PAYMENT_SUCCESS') {
          // Update purchase status to completed
          const { error: updateError } = await supabase
            .from('purchases')
            .update({ 
              status: 'completed',
              transaction_id: event.data.transactionId
            })
            .eq('id', purchase.id);

          if (updateError) {
            console.error('Error updating purchase status:', updateError);
            toast.error('Error al actualizar el estado del pago');
          } else {
            toast.success('¡Pago completado con éxito!');
            if (onSuccess && event.data.transactionId) {
              onSuccess(event.data.transactionId);
            }
          }
        }
      });

    } catch (error) {
      console.error('Error al inicializar PayPhone:', error);
      toast.error('Error al inicializar el pago', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div id="pp-button" ref={buttonRef} className={className} />
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          Inicializando pago...
        </div>
      )}
    </div>
  );
};

export default PayPhoneButton;
