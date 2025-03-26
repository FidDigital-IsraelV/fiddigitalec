
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageSrc: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  className?: string;
  delay?: number;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  imageSrc,
  category,
  isNew = false,
  isSale = false,
  rating,
  className,
  delay = 0,
  onAddToCart,
  onAddToWishlist
}) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToCart) onAddToCart(id);
  };
  
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onAddToWishlist) onAddToWishlist(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {isNew && (
          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
            Nuevo
          </Badge>
        )}
        
        {isSale && (
          <Badge variant="destructive">
            -{discount}%
          </Badge>
        )}
      </div>
      
      {/* Wishlist Button */}
      <button 
        onClick={handleAddToWishlist}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors backdrop-blur-sm"
        aria-label="Add to wishlist"
      >
        <Heart className="h-5 w-5" />
      </button>
      
      {/* Product Image */}
      <a href={`/tienda/productos/${id}`} className="block overflow-hidden">
        <div className="aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img 
            src={imageSrc} 
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </a>
      
      {/* Product Info */}
      <div className="p-4">
        <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
          {category}
        </span>
        
        <a href={`/tienda/productos/${id}`} className="block">
          <h3 className="font-medium text-base group-hover:text-fidblue transition-colors mb-2 line-clamp-2">
            {name}
          </h3>
        </a>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {originalPrice && (
              <span className="text-gray-500 line-through mr-2 text-sm">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-semibold text-lg">
              ${price.toFixed(2)}
            </span>
          </div>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleAddToCart}
            className="p-0 h-auto hover:bg-transparent hover:text-fidblue"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
