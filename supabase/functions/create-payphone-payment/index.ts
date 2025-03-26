
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYPHONE_API_KEY = Deno.env.get('PAYPHONE_API_KEY');
    const PAYPHONE_STORE_ID = Deno.env.get('PAYPHONE_STORE_ID');
    const CLIENT_REDIRECT_URL = Deno.env.get('CLIENT_URL') || 'https://iomavnsblxiyrcflnvir.supabase.co';

    if (!PAYPHONE_API_KEY || !PAYPHONE_STORE_ID) {
      throw new Error('Las credenciales de PayPhone no están configuradas');
    }

    const { amount, purchaseId, planTitle, email } = await req.json();

    if (!amount || !purchaseId) {
      return new Response(
        JSON.stringify({ error: 'Faltan datos requeridos para el pago' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Iniciando pago de ${amount} para el plan ${planTitle}`);

    // Call PayPhone API to create payment
    const response = await fetch('https://pay.payphonetodoesposible.com/api/Links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAYPHONE_API_KEY}`
      },
      body: JSON.stringify({
        amount,
        clientTransactionId: purchaseId,
        responseUrl: `${CLIENT_REDIRECT_URL}/payment-success`,
        cancellationUrl: `${CLIENT_REDIRECT_URL}/payment-cancelled`,
        storeId: PAYPHONE_STORE_ID,
        reference: `Plan ${planTitle}`,
        email: email
      })
    });

    const paymentData = await response.json();

    if (!response.ok) {
      console.error('Error en la respuesta de PayPhone:', paymentData);
      throw new Error(`Error de PayPhone: ${paymentData.message || 'Error desconocido'}`);
    }

    console.log('Respuesta de PayPhone:', paymentData);

    return new Response(
      JSON.stringify({
        paymentUrl: paymentData.paymentUrl,
        transactionId: paymentData.transactionId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
