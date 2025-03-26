
import React, { useState } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ImageUploadProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
  className?: string;
  bucket?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImageUrl,
  onImageUploaded,
  className,
  bucket = 'public',
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
  const { uploadImage, isUploading, progress } = useImageUpload(bucket);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload the image
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        onImageUploaded(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return (
    <div className={className}>
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-300">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-40 object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
          <Upload className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 text-center mb-2">
            Haz clic o arrastra una imagen
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      {isUploading && (
        <div className="mt-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">{progress}% Completado</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
