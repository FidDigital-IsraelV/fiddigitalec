
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  SearchCheck,
  Paintbrush,
  BarChart,
  ArrowRight,
  MoveRight,
  Laptop,
  Star,
  CheckCircle2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import CaseStudyCard from '@/components/CaseStudyCard';
import BlogPost from '@/components/BlogPost';
import TransitionEffect, { FadeIn, SlideIn, ScaleIn } from '@/components/TransitionEffect';

const Index: React.FC = () => {
  // Create case study objects that match the CaseStudy type
  const caseStudies = [
    {
      id: "1",
      title: "Rediseño Web para Empresa Tecnológica",
      slug: "empresa-tecnologica",
      excerpt: "Transformamos el sitio web de una importante empresa tecnológica, mejorando la experiencia de usuario y aumentando las conversiones en un 45%.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      category: "Desarrollo Web",
      stats: [
        { label: "Incremento Tráfico", value: "+125%" },
        { label: "Conversiones", value: "+45%" }
      ],
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      title: "Campaña de Marketing Digital para E-commerce",
      slug: "ecommerce-marketing",
      excerpt: "Desarrollamos una estrategia completa de marketing digital para un e-commerce, logrando un aumento significativo en ventas y visibilidad online.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2015&q=80",
      category: "Marketing Digital",
      stats: [
        { label: "ROI", value: "320%" },
        { label: "Ventas", value: "+78%" }
      ],
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      title: "Optimización SEO para Servicio Profesional",
      slug: "seo-servicios-profesionales",
      excerpt: "Implementamos una estrategia SEO completa para un despacho de abogados, posicionándolos en los primeros resultados de búsqueda para keywords clave.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      category: "SEO",
      stats: [
        { label: "Posiciones #1", value: "15 keywords" },
        { label: "Leads", value: "+90%" }
      ],
      created_at: "",
      updated_at: ""
    }
  ];

  // Create blog post objects that match the BlogPostType
  const blogPosts = [
    {
      id: "1",
      title: "Las tendencias de diseño web que dominarán el próximo año",
      slug: "tendencias-diseno-web",
      excerpt: "Descubre las tendencias de diseño web que marcarán la diferencia en el próximo año y cómo puedes implementarlas en tu sitio web.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      category: "Diseño Web",
      author: "María Torres",
      read_time: "6 min",
      published_at: "2023-06-15",
      created_at: "",
      updated_at: ""
    },
    {
      id: "2",
      title: "Cómo mejorar el SEO de tu sitio web con estrategias efectivas",
      slug: "estrategias-seo-efectivas",
      excerpt: "Te mostramos las estrategias más efectivas para mejorar el posicionamiento de tu sitio web en los motores de búsqueda.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      category: "SEO",
      author: "Alejandro Gómez",
      read_time: "8 min",
      published_at: "2023-06-02",
      created_at: "",
      updated_at: ""
    },
    {
      id: "3",
      title: "La importancia del marketing digital en tiempos de crisis",
      slug: "marketing-digital-crisis",
      excerpt: "El marketing digital se ha convertido en una herramienta indispensable para las empresas, especialmente en tiempos de crisis.",
      content: "",
      image_url: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      category: "Marketing",
      author: "Sofía Martínez",
      read_time: "5 min",
      published_at: "2023-05-28",
      created_at: "",
      updated_at: ""
    }
  ];

  return (
    <TransitionEffect>
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow">
          <Hero />

          {/* Services Section */}
          <section id="content-section" className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <FadeIn>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1 border-fidblue text-fidblue mb-4 bg-fidblue/5"
                  >
                    Nuestros Servicios
                  </Badge>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Soluciones digitales personalizadas
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Ofrecemos un conjunto completo de servicios de transformación digital para ayudar a tu negocio a crecer en el mundo digital.
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ServiceCard 
                  icon={<Code className="h-6 w-6" />}
                  title="Desarrollo Web"
                  description="Creamos sitios web a medida, responsivos y optimizados para brindar la mejor experiencia a tus usuarios."
                  href="/servicios#desarrollo-web"
                  delay={0.1}
                />

                <ServiceCard 
                  icon={<BarChart className="h-6 w-6" />}
                  title="Marketing Digital"
                  description="Estrategias de marketing digital personalizadas para aumentar tu visibilidad online y atraer clientes potenciales."
                  href="/servicios#marketing-digital"
                  delay={0.2}
                />

                <ServiceCard 
                  icon={<SearchCheck className="h-6 w-6" />}
                  title="Optimización SEO"
                  description="Mejora tu posicionamiento en buscadores y aumenta el tráfico orgánico a tu sitio web."
                  href="/servicios#optimizacion-seo"
                  delay={0.3}
                />

                <ServiceCard 
                  icon={<Paintbrush className="h-6 w-6" />}
                  title="Diseño UX/UI"
                  description="Diseñamos interfaces atractivas, funcionales y centradas en la experiencia del usuario."
                  href="/servicios#diseno-ux-ui"
                  delay={0.4}
                />
              </div>

              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link to="/servicios">
                    Ver todos los servicios
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <SlideIn direction="left">
                  <div className="space-y-6">
                    <Badge 
                      variant="outline" 
                      className="px-4 py-1 border-fidblue text-fidblue bg-fidblue/5"
                    >
                      Sobre Nosotros
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold">
                      Transformamos tu presencia digital
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      En FIDDIGITAL, somos expertos en transformación digital. Nuestro equipo de profesionales combina creatividad, tecnología y estrategia para llevar tu negocio al siguiente nivel.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-fidblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>Equipo especializado en tecnologías modernas</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-fidblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>Soluciones personalizadas para cada cliente</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-fidblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>Enfoque centrado en resultados medibles</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-fidblue mr-2 mt-0.5 flex-shrink-0" />
                        <span>Más de 5 años de experiencia en el sector</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/contacto">
                        Trabajemos juntos
                        <MoveRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </SlideIn>

                <SlideIn direction="right" delay={0.2}>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-fidblue/20 to-transparent rounded-2xl transform rotate-3 scale-[0.98]"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                      alt="Equipo de FIDDIGITAL" 
                      className="rounded-2xl shadow-lg relative w-full"
                    />
                  </div>
                </SlideIn>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-4 mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                <ScaleIn delay={0.1}>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-fidblue mb-2">100+</p>
                    <p className="text-gray-600 dark:text-gray-400">Proyectos Completados</p>
                  </div>
                </ScaleIn>
                <ScaleIn delay={0.2}>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-fidblue mb-2">50+</p>
                    <p className="text-gray-600 dark:text-gray-400">Clientes Satisfechos</p>
                  </div>
                </ScaleIn>
                <ScaleIn delay={0.3}>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-fidblue mb-2">5+</p>
                    <p className="text-gray-600 dark:text-gray-400">Años de Experiencia</p>
                  </div>
                </ScaleIn>
                <ScaleIn delay={0.4}>
                  <div className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-fidblue mb-2">24/7</p>
                    <p className="text-gray-600 dark:text-gray-400">Soporte al Cliente</p>
                  </div>
                </ScaleIn>
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <FadeIn>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1 border-fidblue text-fidblue mb-4 bg-fidblue/5"
                  >
                    Casos de Éxito
                  </Badge>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Proyectos que hablan por sí mismos
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Descubre cómo hemos ayudado a empresas de diversos sectores a alcanzar sus objetivos digitales.
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {caseStudies.map((study, index) => (
                  <CaseStudyCard 
                    key={study.id}
                    caseStudy={study}
                    delay={index * 0.1}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link to="/casos">
                    Ver todos los casos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <FadeIn>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1 border-fidblue text-fidblue mb-4 bg-fidblue/5"
                  >
                    Testimonios
                  </Badge>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Lo que dicen nuestros clientes
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    La satisfacción de nuestros clientes es nuestra mayor recompensa. Conoce sus experiencias trabajando con nosotros.
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FadeIn delay={0.1}>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Star key={index} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "El equipo de FIDDIGITAL transformó por completo nuestra presencia online. Su enfoque en la experiencia del usuario y el diseño moderno nos ha ayudado a destacar en nuestro sector."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                          alt="Ana García" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">Ana García</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">CEO, TechSolutions</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Star key={index} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "Desde que implementamos la estrategia de marketing digital desarrollada por FIDDIGITAL, nuestras ventas han aumentado un 70%. Su enfoque basado en datos y resultados es exactamente lo que necesitábamos."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                          alt="Carlos Mendoza" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">Carlos Mendoza</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Director, ModoShop</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <Star key={index} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "La optimización SEO realizada por FIDDIGITAL nos ha permitido posicionarnos en los primeros resultados de Google para palabras clave muy competitivas en nuestro sector. El ROI ha sido excepcional."
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden mr-4">
                        <img 
                          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" 
                          alt="Laura Sánchez" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">Laura Sánchez</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Marketing Manager, LegalPro</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-fidblue text-white">
            <div className="container px-4 mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <SlideIn direction="left">
                  <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                      ¿Listo para transformar tu presencia digital?
                    </h2>
                    <p className="text-white/80 text-lg">
                      Contáctanos hoy mismo y conversemos sobre cómo podemos ayudarte a alcanzar tus objetivos digitales.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button asChild variant="secondary" className="bg-white text-fidblue hover:bg-gray-100">
                        <Link to="/contacto">
                          Solicitar una cotización
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="border-white text-white hover:bg-white/10">
                        <Link to="/servicios">
                          Explorar servicios
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SlideIn>

                <SlideIn direction="right" delay={0.2}>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <Laptop className="h-10 w-10 mb-3" />
                        <h3 className="font-semibold">Desarrollo Web</h3>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <BarChart className="h-10 w-10 mb-3" />
                        <h3 className="font-semibold">Marketing Digital</h3>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <SearchCheck className="h-10 w-10 mb-3" />
                        <h3 className="font-semibold">SEO</h3>
                      </div>
                      <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                        <Paintbrush className="h-10 w-10 mb-3" />
                        <h3 className="font-semibold">Diseño UX/UI</h3>
                      </div>
                    </div>
                  </div>
                </SlideIn>
              </div>
            </div>
          </section>

          {/* Blog Section */}
          <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <FadeIn>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1 border-fidblue text-fidblue mb-4 bg-fidblue/5"
                  >
                    Blog
                  </Badge>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Últimos artículos y noticias
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Mantente al día con las últimas tendencias y noticias del mundo digital.
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                  <BlogPost 
                    key={post.id}
                    post={post}
                    delay={index * 0.1}
                  />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild variant="outline">
                  <Link to="/blog">
                    Ver todos los artículos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Clients Section */}
          <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-4 mx-auto">
              <div className="text-center mb-16">
                <FadeIn>
                  <Badge 
                    variant="outline" 
                    className="px-4 py-1 border-fidblue text-fidblue mb-4 bg-fidblue/5"
                  >
                    Clientes
                  </Badge>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Confían en nosotros
                  </h2>
                </FadeIn>
                <FadeIn delay={0.2}>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Empresas líderes en diversos sectores confían en nuestros servicios para impulsar su presencia digital.
                  </p>
                </FadeIn>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
                {[1, 2, 3, 4, 5, 6].map((_, index) => (
                  <ScaleIn key={index} delay={0.1 * index}>
                    <div className="flex items-center justify-center grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                      <img 
                        src={`https://placehold.co/150x80/0080FF/FFFFFF.png?text=LOGO+${index + 1}`} 
                        alt={`Cliente ${index + 1}`} 
                        className="h-auto max-h-12"
                      />
                    </div>
                  </ScaleIn>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </TransitionEffect>
  );
};

export default Index;
