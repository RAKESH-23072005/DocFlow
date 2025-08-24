import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Monitor, Triangle, Archive, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface FloatingActionsProps {
  onAddImages: (files: File[]) => void;
}

export default function FloatingActions({ onAddImages }: FloatingActionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();
  // useLocation hook removed as unused

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

  const handleAddImages = () => {
    const input = document.getElementById('addMoreFiles') as HTMLInputElement;
    input?.click();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const actions = [
    { 
      icon: Upload, 
      label: "Add more images", 
      onClick: handleAddImages,
      bgColor: "bg-gray-700 hover:bg-gray-800",
      delay: "delay-75"
    },
    { 
      icon: Monitor, 
      label: "Desktop app", 
      onClick: () => toast({ title: "Desktop app", description: "Feature coming soon!" }),
      bgColor: "bg-blue-500 hover:bg-blue-600",
      delay: "delay-100"
    },
    { 
      icon: Triangle, 
      label: "Mobile app", 
      onClick: () => toast({ title: "Mobile app", description: "Feature coming soon!" }),
      bgColor: "bg-orange-500 hover:bg-orange-600",
      delay: "delay-150"
    },
    { 
      icon: Archive, 
      label: "Archive", 
      onClick: () => toast({ title: "Archive", description: "Feature coming soon!" }),
      bgColor: "bg-blue-400 hover:bg-blue-500",
      delay: "delay-200"
    }
  ];

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end space-y-3">
        {/* Action buttons */}
        <div className={`flex flex-col items-end space-y-3 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {actions.map((action, index) => (
            <div key={index} className={`transition-all duration-300 ${action.delay} ${
              isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center space-x-3 group">
                {/* Tooltip */}
                <div className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  {action.label}
                </div>
                {/* Button */}
                <Button
                  onClick={action.onClick}
                  className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${action.bgColor}`}
                  size="sm"
                >
                  <action.icon className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Main toggle button */}
        <Button
          onClick={toggleExpanded}
          className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-110 ${
            isExpanded 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          size="sm"
        >
          {isExpanded ? (
            <Plus className="w-6 h-6 text-white transition-transform duration-300" />
          ) : (
            <div className="relative">
              <Plus className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                1
              </span>
            </div>
          )}
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        id="addMoreFiles"
        multiple
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={handleFileInput}
      />

      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-40 transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}