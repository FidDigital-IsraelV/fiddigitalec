
import React from 'react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estamos aquí para responder a todas tus preguntas y ayudarte a impulsar tu presencia digital.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </div>
  );
};

export default Contact;
