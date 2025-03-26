import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/components/Hero';
import { Button } from '@/components/ui/button';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <Hero 
        title="Tu negocio en Internet"
        subtitle="Crea tu página web o tienda online y llega a más clientes"
        ctaText="Ver Paquetes Web"
        ctaAction={() => navigate('/paquetes-web')}
        imageSrc="/hero-image.jpg"
      />
      
      {/* Rest of home page content */}
    </div>
  );
};

export default Home;
