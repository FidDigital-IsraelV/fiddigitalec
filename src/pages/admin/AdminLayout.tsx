import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'sonner';

const AdminLayout = () => {
  const { user, profile, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Debug information to help troubleshoot
    console.log("AdminLayout rendered with:", { 
      userId: user?.id, 
      profileId: profile?.id, 
      isAdmin, 
      isLoading 
    });
    
    if (!isLoading && user && !isAdmin) {
      toast.error("No tienes permisos de administrador");
      navigate('/');
    }
  }, [user, isAdmin, isLoading, navigate]);
  
  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }
  
  // Redireccionar si no está autenticado
  if (!user) {
    console.log("No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Redireccionar si no es administrador
  if (!isAdmin) {
    console.log("Not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
