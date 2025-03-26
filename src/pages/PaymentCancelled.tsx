
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <div className="text-center space-y-6">
        <XCircle className="mx-auto h-24 w-24 text-red-500" />
        
        <h1 className="text-3xl font-bold">Pago Cancelado</h1>
        
        <p className="text-lg text-gray-600">
          La transacción ha sido cancelada o ha ocurrido un error durante el proceso.
          Puedes intentarlo de nuevo o contactarnos si necesitas ayuda.
        </p>
        
        <div className="pt-6 space-y-3">
          <Button 
            onClick={() => navigate('/paquetes-web')}
            className="mx-auto w-full bg-fidblue hover:bg-blue-700"
          >
            Volver a Paquetes Web
          </Button>
          
          <Button 
            onClick={() => navigate('/contact')}
            variant="outline"
            className="mx-auto w-full"
          >
            Contactar Soporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
