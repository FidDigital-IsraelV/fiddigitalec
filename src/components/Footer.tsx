
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail, PhoneCall, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 pt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-bold">
                <span className="text-fidblue">FID</span>
                <span>DIGITAL</span>
              </h2>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs">
              Transformamos ideas en experiencias digitales memorables. Desarrollo web, marketing digital y diseño UX/UI.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-fidblue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-fidblue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-fidblue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-fidblue transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/servicios" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link to="/planes" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  Planes
                </Link>
              </li>
              <li>
                <Link to="/casos" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  Casos de Éxito
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tienda" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  Tienda
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 text-fidblue flex-shrink-0 mt-1" />
                <span className="text-gray-600 dark:text-gray-400">
                  Av. Principal 123, Ciudad, País
                </span>
              </li>
              <li className="flex items-center">
                <PhoneCall size={20} className="mr-3 text-fidblue flex-shrink-0" />
                <a href="tel:+123456789" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  +12 345 6789
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-fidblue flex-shrink-0" />
                <a href="mailto:info@fiddigital.com" className="text-gray-600 dark:text-gray-400 hover:text-fidblue transition-colors">
                  info@fiddigital.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Suscríbete para recibir noticias, ofertas especiales y contenido exclusivo.
            </p>
            <form className="flex flex-col space-y-3">
              <Input 
                type="email" 
                placeholder="Tu correo electrónico" 
                className="bg-white dark:bg-gray-800"
              />
              <Button type="submit" className="w-full">
                Suscribirse
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} FIDDIGITAL. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacidad" className="text-gray-600 dark:text-gray-400 hover:text-fidblue text-sm transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/terminos" className="text-gray-600 dark:text-gray-400 hover:text-fidblue text-sm transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
