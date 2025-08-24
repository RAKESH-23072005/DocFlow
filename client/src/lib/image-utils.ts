export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function compressImageFile(file: File, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file || !(file instanceof File)) {
      reject(new Error('Invalid file object'));
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate dimensions - be more aggressive with compression
        let maxWidth = 1200;
        let maxHeight = 800;
        
        // For large files, be even more aggressive
        if (file.size > 5 * 1024 * 1024) { // > 5MB
          maxWidth = 800;
          maxHeight = 600;
        } else if (file.size > 2 * 1024 * 1024) { // > 2MB
          maxWidth = 1000;
          maxHeight = 700;
        }
        
        let { width, height } = img;
        const originalRatio = width / height;
        
        // Always resize for compression unless image is very small
        if (width > 400 || height > 400) {
          if (width > height) {
            width = Math.min(width, maxWidth);
            height = width / originalRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * originalRatio;
          }
        }

        // Round dimensions to avoid fractional pixels
        width = Math.round(width);
        height = Math.round(height);

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Improve canvas rendering quality for better compression
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Only add white background for PNG with transparency
        if (file.type === 'image/png') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert quality to proper range and ensure aggressive compression
        let compressionQuality = Math.max(0.1, Math.min(0.85, quality / 100));
        
        // For large files, use lower quality automatically
        if (file.size > 3 * 1024 * 1024) {
          compressionQuality = Math.min(compressionQuality, 0.6);
        } else if (file.size > 1 * 1024 * 1024) {
          compressionQuality = Math.min(compressionQuality, 0.7);
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Clean up
              URL.revokeObjectURL(img.src);
              
              // Ensure we actually reduced file size - be more aggressive
              if (blob.size >= file.size * 0.8) {
                // Try with much lower quality if compression didn't work well
                const retryQuality = Math.max(0.1, compressionQuality - 0.4);
                canvas.toBlob(
                  (retryBlob) => {
                    if (retryBlob && retryBlob.size < blob.size) {
                      resolve(retryBlob);
                    } else {
                      // Last resort: try smallest possible JPEG
                      canvas.toBlob(
                        (finalBlob) => {
                          resolve(finalBlob || blob);
                        },
                        'image/jpeg',
                        0.1
                      );
                    }
                  },
                  'image/jpeg', // Force JPEG for better compression
                  retryQuality
                );
              } else {
                resolve(blob);
              }
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type === 'image/png' && quality > 80 ? 'image/png' : 'image/jpeg',
          compressionQuality
        );
      } catch (error) {
        reject(new Error(`Compression failed: ${error}`));
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    try {
      img.src = URL.createObjectURL(file);
    } catch (error) {
      reject(new Error('Failed to create object URL'));
    }
  });
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to create preview'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
