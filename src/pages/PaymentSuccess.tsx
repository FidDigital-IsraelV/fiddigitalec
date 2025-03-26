
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const transactionId = searchParams.get('transactionId');
    
    if (transactionId) {
      // Update purchase status to completed
      const updatePurchase = async () => {
        const { error } = await supabase
          .from('purchases')
          .update({ 
            status: 'completed',
            transaction_id: transactionId
          })
          .eq('transaction_id', transactionId);
        
        if (error) {
          console.error('Error updating purchase:', error);
        }
      };
      
      updatePurchase();
    }
    
    // Show success toast
    toast.success('¡Pago completado con éxito!', {
      description: 'Gracias por tu compra. Te hemos enviado un correo con los detalles.'
    });
  }, [location]);
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center space-y-6">
        <CheckCircle2 className="mx-auto h-24 w-24 text-green-500" />
        
        <h1 className="text-3xl font-bold">¡Pago Exitoso!</h1>
        
        <p className="text-lg text-gray-600">
          Tu pago ha sido procesado correctamente. 
          Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.
        </p>
        
        <div className="pt-6">
          <Button 
            onClick={() => navigate('/')}
            className="mx-auto bg-fidblue hover:bg-blue-700"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
