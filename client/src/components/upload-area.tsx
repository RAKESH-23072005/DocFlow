import { useCallback } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export default function UploadArea({ onFilesSelected }: UploadAreaProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a supported image format. Please use JPG, PNG, GIF, or WebP.`,
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);
    
    if (validFiles.length > 0) {
      // Create uploaded images data structure
      const uploadedImages = validFiles.map((file, index) => {
        const id = Date.now() + index + Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);
        
        // Store actual file in global storage for compression
        if (!(window as any).imageFiles) {
          (window as any).imageFiles = new Map();
        }
        (window as any).imageFiles.set(id, file);
        
        return {
          id,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          },
          originalSize: file.size,
          isCompressed: false,
          preview
        };
      });

      // Store metadata in session storage
      sessionStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
      
      // Redirect to compress page
      setLocation('/compress');
      
      if (validFiles.length !== fileArray.length) {
        toast({
          title: "Some files skipped",
          description: `${validFiles.length} of ${fileArray.length} files were accepted.`,
        });
      }
    }
  }, [onFilesSelected, toast, setLocation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  }, [handleFiles]);

  const handleSelectClick = () => {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input?.click();
  };

  return (
    <div className="mb-8">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center bg-white hover:border-primary hover:bg-blue-50 transition-all duration-300 cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleSelectClick}
      >
        <div className="flex flex-col items-center">
          <div className="mb-6">
            <Upload className="w-16 h-16 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
          <Button 
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors mb-4 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectClick();
            }}
          >
            <Plus className="mr-2 h-5 w-5" />
            Select images
          </Button>
          <p className="text-gray-500">or drop images here</p>
          <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG, GIF, WebP up to 10MB each</p>
        </div>
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
}
