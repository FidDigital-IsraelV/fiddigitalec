
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BlogPost as BlogPostType } from '@/types/database.types';
import { format } from 'date-fns';

interface BlogPostProps {
  post: BlogPostType;
  className?: string;
  delay?: number;
  featured?: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({
  post,
  className,
  delay = 0,
  featured = false
}) => {
  // Format date
  const formattedDate = post.published_at 
    ? format(new Date(post.published_at), 'dd MMM, yyyy')
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative rounded-2xl overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        featured ? "shadow-md" : "shadow-sm hover:shadow-md",
        className
      )}
    >
      <div className={cn(
        "overflow-hidden",
        featured ? "aspect-[16/9]" : "aspect-[5/3]"
      )}>
        <img 
          src={post.image_url} 
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-3">
          <Badge variant="secondary" className="mr-3">
            {post.category}
          </Badge>
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{post.read_time}</span>
            </div>
          </div>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h3 className={cn(
            "font-semibold tracking-tight transition-colors group-hover:text-fidblue mb-3",
            featured ? "text-2xl" : "text-xl"
          )}>
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <User className="h-4 w-4 mr-1" />
          <span>{post.author}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPost;
