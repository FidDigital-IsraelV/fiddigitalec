
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const { profile } = useAuth();
  
  const { data: blogCount, isLoading: loadingBlog } = useQuery({
    queryKey: ['blogCount'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching blog count:", error);
        return 0;
      }
    }
  });

  const { data: caseCount, isLoading: loadingCase } = useQuery({
    queryKey: ['caseCount'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('case_studies')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching case count:", error);
        return 0;
      }
    }
  });

  const { data: testimonialCount, isLoading: loadingTestimonial } = useQuery({
    queryKey: ['testimonialCount'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('testimonials')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        return count || 0;
      } catch (error) {
        console.error("Error fetching testimonial count:", error);
        return 0;
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bienvenido, {profile?.full_name || profile?.username || 'Administrador'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total de Posts</CardTitle>
            <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingBlog ? '...' : (blogCount !== undefined ? blogCount : 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Casos de Éxito</CardTitle>
            <Award className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingCase ? '...' : (caseCount !== undefined ? caseCount : 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Testimonios</CardTitle>
            <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingTestimonial ? '...' : (testimonialCount !== undefined ? testimonialCount : 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Aquí podrían ir gráficos o datos adicionales */}
      </div>
    </div>
  );
};

export default Dashboard;
