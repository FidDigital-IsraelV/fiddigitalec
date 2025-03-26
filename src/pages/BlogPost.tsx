
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/types/database.types';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data as BlogPostType;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Post no encontrado</h1>
        <p className="text-xl mb-8">El artículo que estás buscando no existe o ha sido eliminado.</p>
        <Link to="/blog" className="text-indigo-800 hover:underline flex items-center justify-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Blog
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <Link to="/blog" className="text-indigo-800 hover:underline flex items-center mb-8">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Blog
      </Link>
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>{format(new Date(post.published_at), 'dd MMM, yyyy')}</span>
          <span>•</span>
          <span>{post.read_time}</span>
          <span>•</span>
          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {post.category}
          </span>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center">
          <div className="mr-3">
            <div className="h-10 w-10 rounded-full bg-indigo-800 flex items-center justify-center text-white">
              {post.author.charAt(0)}
            </div>
          </div>
          <div>
            <p className="font-medium">{post.author}</p>
          </div>
        </div>
      </div>
      
      {/* Featured Image */}
      {post.image_url && (
        <div className="mb-8">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default BlogPost;
