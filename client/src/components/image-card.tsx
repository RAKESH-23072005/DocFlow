import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Loader2 } from "lucide-react";
import { UploadedImage } from "./image-compressor";
import { formatFileSize } from "@/lib/image-utils";
import { useState } from "react";

interface ImageCardProps {
  image: UploadedImage;
  onCompress: () => void;
  onDelete: () => void;
}

export default function ImageCard({ image, onCompress, onDelete }: ImageCardProps) {
  const [isCompressing, setIsCompressing] = useState(false);

  const handleCompress = async () => {
    setIsCompressing(true);
    await onCompress();
    setIsCompressing(false);
  };



  const savingsPercentage = image.compressedSize 
    ? Math.round(((image.originalSize - image.compressedSize) / image.originalSize) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="aspect-video bg-gray-100 relative">
        <img 
          src={image.preview} 
          alt={image.file.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {formatFileSize(image.originalSize)}
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-2 truncate" title={image.file.name}>
          {image.file.name}
        </h4>
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm text-gray-600">
            <div>Original: <span className="font-medium">{formatFileSize(image.originalSize)}</span></div>
            {image.isCompressed && image.compressedSize && (
              <div>Compressed: <span className="font-medium text-success">{formatFileSize(image.compressedSize)}</span></div>
            )}
          </div>
          {image.isCompressed && savingsPercentage > 0 && (
            <Badge className="bg-success text-white">
              {savingsPercentage}% saved
            </Badge>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex space-x-2">
            {!image.isCompressed ? (
              <Button
                onClick={handleCompress}
                disabled={isCompressing}
                className="flex-1 bg-primary text-white hover:bg-blue-700 text-sm font-medium py-2"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                    </svg>
                    Compress
                  </>
                )}
              </Button>
            ) : null}
            <Button
              onClick={onDelete}
              variant="outline"
              size="sm"
              className="text-gray-400 hover:text-red-500 px-3"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
