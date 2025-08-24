import { useState, useCallback, useMemo } from "react";
import UploadArea from "./upload-area";
import CompressionSettings from "./compression-settings";
import ImageGallery from "./image-gallery";
import ProgressIndicator from "./progress-indicator";
import AdSlot from "./ad-slot";
import { useImageCompression } from "@/hooks/use-image-compression";

export interface UploadedImage {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  isCompressed: boolean;
  compressedBlob?: Blob;
  preview: string;
  width?: number;
  height?: number;
}

export default function ImageCompressor() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const { compressImage } = useImageCompression();

  // Memoized compression quality to prevent unnecessary re-renders
  const memoizedCompressionQuality = useMemo(() => compressionQuality, [compressionQuality]);

  // Optimized file processing with image metadata extraction
  const processImageFile = useCallback(async (file: File): Promise<Partial<UploadedImage>> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({});
      };
      
      img.src = url;
    });
  }, []);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newImages: UploadedImage[] = [];
    
    for (const file of files) {
      const metadata = await processImageFile(file);
      const image: UploadedImage = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        file,
        originalSize: file.size,
        isCompressed: false,
        preview: URL.createObjectURL(file),
        width: metadata.width,
        height: metadata.height,
      };
      newImages.push(image);
    }
    
    setUploadedImages(prev => [...prev, ...newImages]);
  }, [processImageFile]);

  const handleSingleCompress = useCallback(async (imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (!image || image.isCompressed) return;

    try {
      const compressedBlob = await compressImage(image.file, memoizedCompressionQuality);
      
      setUploadedImages(prev => prev.map(img => 
        img.id === imageId 
          ? { ...img, isCompressed: true, compressedBlob, compressedSize: compressedBlob.size }
          : img
      ));
    } catch (error) {
      // Compression failed silently
    }
  }, [uploadedImages, memoizedCompressionQuality, compressImage]);

  const handleBatchCompress = useCallback(async () => {
    const uncompressedImages = uploadedImages.filter(img => !img.isCompressed);
    if (uncompressedImages.length === 0) return;

    setIsCompressing(true);
    setProgress({ current: 0, total: uncompressedImages.length });

    for (let i = 0; i < uncompressedImages.length; i++) {
      const image = uncompressedImages[i];
      try {
        const compressedBlob = await compressImage(image.file, memoizedCompressionQuality);
        
        setUploadedImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, isCompressed: true, compressedBlob, compressedSize: compressedBlob.size }
            : img
        ));
        
        setProgress({ current: i + 1, total: uncompressedImages.length });
      } catch (error) {
        // Failed to compress image silently
      }
    }

    setTimeout(() => {
      setIsCompressing(false);
    }, 1000);
  }, [uploadedImages, memoizedCompressionQuality, compressImage]);

  const handleClearAll = useCallback(() => {
    uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
    setUploadedImages([]);
    setProgress({ current: 0, total: 0 });
  }, [uploadedImages]);

  const handleDeleteImage = useCallback((imageId: string) => {
    const image = uploadedImages.find(img => img.id === imageId);
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  }, [uploadedImages]);

  // Compression stats removed as unused

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Image Compressor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Compress your images without losing quality. Reduce file sizes and optimize your images for web and mobile.
        </p>
      </div>

      {/* Compression Settings */}
      <CompressionSettings
        quality={compressionQuality}
        onQualityChange={setCompressionQuality}
        onBatchCompress={handleBatchCompress}
        isCompressing={isCompressing}
      />

      {/* Upload Area */}
      <UploadArea onFilesSelected={handleFilesSelected} />

      {/* Progress Indicator */}
      {isCompressing && (
        <ProgressIndicator
          current={progress.current}
          total={progress.total}
        />
      )}

      {/* Image Gallery */}
      {uploadedImages.length > 0 && (
        <ImageGallery
          images={uploadedImages}
          onCompress={handleSingleCompress}
          onDelete={handleDeleteImage}
          onClearAll={handleClearAll}
          onAddImages={handleFilesSelected}
        />
      )}

      {/* Clear All Button */}
      {uploadedImages.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={handleClearAll}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Clear All Images
          </button>
        </div>
      )}

      {/* Inline Ad Slot - After Main Content */}
      <div className="mt-12">
        <AdSlot type="inline" />
      </div>

      {/* Mobile Ad Slot - Only visible on mobile */}
      <div className="mt-8 lg:hidden">
        <AdSlot type="banner" className="min-h-[200px]" />
      </div>
    </main>
  );
}
