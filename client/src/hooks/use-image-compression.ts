import { useCallback } from 'react';
import { compressImageFile } from '@/lib/image-utils';
import { useToast } from '@/hooks/use-toast';

export function useImageCompression() {
  const { toast } = useToast();

  const compressImage = useCallback(async (file: File, quality: number): Promise<Blob> => {
    try {
      const compressedBlob = await compressImageFile(file, quality);

      if (compressedBlob.size < file.size) {
        const savings = ((file.size - compressedBlob.size) / file.size * 100).toFixed(0);
        toast({
          title: "Compression successful",
          description: `${file.name} compressed by ${savings}%`,
        });
      } else {
        toast({
          title: "Compression complete",
          description: `${file.name} processed (no size reduction achieved at this quality level)`,
        });
      }

      return compressedBlob;
    } catch (error) {
      toast({
        title: "Compression failed",
        description: `Failed to compress ${file.name}. Please try again.`,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  return { compressImage };
}
