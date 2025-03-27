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
  className?: string;
}

const PayPhoneButton: React.FC<PayPhoneButtonProps> = ({
  planId,
  planTitle, 
  amount,
  email,
  onSuccess
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializePayPhone = async () => {
      try {
        // Validate environment variables
        const apiKey = import.meta.env.VITE_PAYPHONE_API_KEY;
        const storeId = import.meta.env.VITE_PAYPHONE_STORE_ID;

        if (!apiKey || !storeId) {
          throw new Error('Faltan credenciales de PayPhone. Verifique las variables de entorno.');
        }

        console.log('PayPhone Credentials:', {
          storeId,
          apiKeyLength: apiKey.length
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

        // Initialize PayPhone Button Box
        const payPhoneConfig = {
          token: apiKey,
          clientTransactionId: purchase.id,
          amount: amountInCents, // Total amount in cents
          amountWithTax: baseAmount, // Base amount that will be taxed
          tax: taxAmount, // Tax amount
          amountWithoutTax: 0, // No amount without tax in this case
          service: 0,
          tip: 0,
          currency: "USD",
          storeId: storeId,
          reference: `Plan ${planTitle}`,
          email: email,
          lang: "es",
          defaultMethod: "card",
          timeZone: -5
        };

        console.log('PayPhone Configuration:', payPhoneConfig);

        window.ppb = new window.PPaymentButtonBox(payPhoneConfig).render('pp-button');

        // Listen for payment success
        window.addEventListener('message', (event) => {
          if (event.data.type === 'PAYPHONE_PAYMENT_SUCCESS') {
            toast.success('¡Pago completado con éxito!');
            if (onSuccess && event.data.transactionId) {
              onSuccess(event.data.transactionId);
            }
          }
        });

      } catch (error) {
        console.error('Error al inicializar PayPhone:', error);
        toast.error('Error al inicializar el pago', {
          description: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    };

    if (buttonRef.current) {
      initializePayPhone();
    }

    return () => {
      // Cleanup if needed
      if (window.ppb) {
        // Add any cleanup code if required by PayPhone
      }
    };
  }, [planId, planTitle, amount, email, onSuccess]);

  return <div id="pp-button" ref={buttonRef} />;
};

export default PayPhoneButton;
