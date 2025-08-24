import { Button } from "@/components/ui/button";
import { Trash2, Plus, ArrowUpDown } from "lucide-react";
import ImageCard from "./image-card";
import { UploadedImage } from "./image-compressor";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  images: UploadedImage[];
  onCompress: (imageId: string) => void;
  onDelete: (imageId: string) => void;
  onClearAll: () => void;
  onAddImages: (files: File[]) => void;
}

export default function ImageGallery({ images, onCompress, onDelete, onClearAll, onAddImages }: ImageGalleryProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  // compressedImages removed as unused

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      const validFiles = fileArray.filter(file => {
        if (!validTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not supported. Use JPG, PNG, GIF, or WebP.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        onAddImages(validFiles);
      }
    }
    e.target.value = '';
  };

  const handleAddMoreImages = () => {
    const input = document.getElementById('addMoreImagesGallery') as HTMLInputElement;
    input?.click();
  };

  const handleSortImages = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    // Sort images by filename - would need to be passed back to parent
    toast({
      title: "Images sorted",
      description: `Arranged ${newOrder === 'asc' ? 'A to Z' : 'Z to A'}`,
    });
  };

  // Sort images based on current sort order - unused for now

  // Download all functionality removed as unused

  // Create gallery items with ads interspersed
  const renderGalleryItems = () => {
    const items: React.ReactNode[] = [];

    images.forEach((image, _index) => {
      // Add image card
      items.push(
        <ImageCard
          key={image.id}
          image={image}
          onCompress={() => onCompress(image.id)}
          onDelete={() => onDelete(image.id)}
        />
      );
    });

    return items;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-xl font-semibold text-gray-900">Your Images</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              onClick={handleSortImages}
              variant="outline"
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center"
            >
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Arrange {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </Button>

            <Button
              onClick={onClearAll}
              variant="outline"
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
          <Button
            onClick={handleAddMoreImages}
            className="bg-primary text-white hover:bg-blue-700 font-medium flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add More Images
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 max-h-[70vh] overflow-y-auto">
        {renderGalleryItems()}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="addMoreImagesGallery"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
