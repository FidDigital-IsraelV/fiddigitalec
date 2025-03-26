
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageUpload = (bucket: string = 'public') => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Make sure the bucket exists
  const ensureBucketExists = async () => {
    try {
      // Check if bucket exists
      const { data } = await supabase.storage.getBucket(bucket);
      
      if (!data) {
        // Create bucket if it doesn't exist
        await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
        });
      }
    } catch (error) {
      console.error('Error checking/creating bucket:', error);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setProgress(0);
      
      // Ensure bucket exists
      await ensureBucketExists();
      
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload the file - without onUploadProgress as it's not supported
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        toast.error(`Error al subir la imagen: ${error.message}`);
        return null;
      }
      
      // Since we can't track progress, set to 100% when done
      setProgress(100);
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error: any) {
      console.error('Error al subir la imagen:', error);
      toast.error('Error al subir la imagen');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    progress
  };
};
