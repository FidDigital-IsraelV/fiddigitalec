import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/ui/whatsapp-button';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Planes from '@/pages/Planes';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Portfolio from '@/pages/Portfolio';
import PortfolioDetail from '@/pages/PortfolioDetail';
import NotFound from '@/pages/NotFound';
import AdminLayout from '@/pages/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import AdminBlog from '@/pages/admin/AdminBlog';
import BlogForm from '@/pages/admin/forms/BlogForm';
import AdminPortfolio from '@/pages/admin/AdminPortfolio';
import PortfolioForm from '@/pages/admin/forms/PortfolioForm';
import AdminTestimonios from '@/pages/admin/AdminTestimonios';
import TestimonialForm from '@/pages/admin/forms/TestimonialForm';
import AdminCompras from '@/pages/admin/AdminCompras';
import AdminPlanes from '@/pages/admin/AdminPlanes';
import PlanForm from '@/pages/admin/forms/PlanForm';
import PaquetesWeb from '@/pages/PaquetesWeb';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCancelled from '@/pages/PaymentCancelled';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <Toaster />
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/planes" element={<Planes />} />
                <Route path="/paquetes-web" element={<PaquetesWeb />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-cancelled" element={<PaymentCancelled />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="blog/nuevo" element={<BlogForm />} />
                  <Route path="blog/:id" element={<BlogForm />} />
                  <Route path="portfolio" element={<AdminPortfolio />} />
                  <Route path="portfolio/nuevo" element={<PortfolioForm />} />
                  <Route path="portfolio/:id" element={<PortfolioForm />} />
                  <Route path="testimonios" element={<AdminTestimonios />} />
                  <Route path="testimonios/nuevo" element={<TestimonialForm />} />
                  <Route path="testimonios/:id" element={<TestimonialForm />} />
                  <Route path="compras" element={<AdminCompras />} />
                  <Route path="planes" element={<AdminPlanes />} />
                  <Route path="planes/nuevo" element={<PlanForm />} />
                  <Route path="planes/:id" element={<PlanForm />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <WhatsAppButton 
                phoneNumber="593995855756" 
                message="Hola, me gustaría obtener más información sobre sus servicios."
              />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
