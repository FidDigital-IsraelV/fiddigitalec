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

        // Initialize PayPhone Button Box
        window.ppb = new window.PPaymentButtonBox({
          token: import.meta.env.VITE_PAYPHONE_API_KEY,
          clientTransactionId: purchase.id,
          amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
          amountWithTax: Math.round(amount * 100), // All amount is taxable in this case
          tax: 0, // Tax is included in the amount
          currency: "USD",
          storeId: import.meta.env.VITE_PAYPHONE_STORE_ID,
          reference: `Plan ${planTitle}`,
          email: email,
          lang: "es",
          defaultMethod: "card",
          timeZone: -5
        }).render('pp-button');

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
