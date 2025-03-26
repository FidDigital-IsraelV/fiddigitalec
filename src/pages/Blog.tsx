
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BlogPost as BlogPostType } from '@/types/database.types';
import BlogPost from '@/components/BlogPost';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPostType[];
    }
  });
  
  // Get unique categories
  const categories = [...new Set(posts?.map(post => post.category))];
  
  const filteredPosts = selectedCategory
    ? posts?.filter(post => post.category === selectedCategory)
    : posts;
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Noticias, insights y consejos sobre desarrollo web y marketing digital
        </p>
      </div>
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === null ? 'bg-indigo-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          Todos
        </button>
        
        {categories?.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category ? 'bg-indigo-800 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fidblue"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts?.map((post, index) => (
            <BlogPost 
              key={post.id} 
              post={post}
              delay={index * 0.1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blog;
