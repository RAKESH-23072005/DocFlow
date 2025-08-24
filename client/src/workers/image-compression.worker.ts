// Web Worker for image compression operations
// This offloads heavy image processing from the main thread

interface CompressionMessage {
  type: 'compress';
  imageData: ImageBitmap;
  quality: number;
  format: 'jpeg' | 'webp' | 'png';
}

interface CompressionResult {
  type: 'compression-complete';
  compressedBlob: Blob;
  originalSize: number;
  compressedSize: number;
}

interface ErrorMessage {
  type: 'error';
  error: string;
}

type WorkerMessage = CompressionMessage;
type WorkerResponse = CompressionResult | ErrorMessage;

// Handle messages from main thread
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  try {
    if (event.data.type === 'compress') {
      const { imageData, quality, format } = event.data;
      
      // Create canvas for compression
      const canvas = new OffscreenCanvas(imageData.width, imageData.height);
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      // Draw image to canvas
      ctx.drawImage(imageData, 0, 0);
      
      // Compress based on format
      let compressedBlob: Blob;
      
      switch (format) {
        case 'jpeg':
          compressedBlob = await canvas.convertToBlob({
            type: 'image/jpeg',
            quality: quality / 100,
          });
          break;
        case 'webp':
          compressedBlob = await canvas.convertToBlob({
            type: 'image/webp',
            quality: quality / 100,
          });
          break;
        case 'png':
          // PNG doesn't support quality, but we can resize for compression
          if (quality < 80) {
            const scale = 0.5 + (quality / 100) * 0.5; // Scale between 0.5 and 1.0
            const newWidth = Math.round(imageData.width * scale);
            const newHeight = Math.round(imageData.height * scale);
            
            const resizedCanvas = new OffscreenCanvas(newWidth, newHeight);
            const resizedCtx = resizedCanvas.getContext('2d');
            
            if (resizedCtx) {
              resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
              compressedBlob = await resizedCanvas.convertToBlob({
                type: 'image/png',
              });
            } else {
              compressedBlob = await canvas.convertToBlob({
                type: 'image/png',
              });
            }
          } else {
            compressedBlob = await canvas.convertToBlob({
              type: 'image/png',
            });
          }
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }
      
      // Calculate sizes
      const originalSize = imageData.width * imageData.height * 4; // Approximate
      const compressedSize = compressedBlob.size;
      
      // Send result back to main thread
      const result: CompressionResult = {
        type: 'compression-complete',
        compressedBlob,
        originalSize,
        compressedSize,
      };
      
      self.postMessage(result);
    }
  } catch (error) {
    const errorMessage: ErrorMessage = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
    
    self.postMessage(errorMessage);
  }
};

// Handle errors
self.onerror = (error) => {
  const errorMessage: ErrorMessage = {
    type: 'error',
    error: error.message || 'Worker error occurred',
  };
  
  self.postMessage(errorMessage);
};

export {};
