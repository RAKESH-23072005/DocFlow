import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";

interface CompressionSettingsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  onBatchCompress: () => void;
  isCompressing: boolean;
}

export default function CompressionSettings({ 
  quality, 
  onQualityChange, 
  onBatchCompress, 
  isCompressing 
}: CompressionSettingsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compression Settings</h3>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex-1 sm:mr-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Quality Level</label>
          <div className="px-2">
            <Slider
              value={[quality]}
              onValueChange={(value) => onQualityChange(value[0])}
              max={100}
              min={10}
              step={5}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
            <span>Higher Compression</span>
            <span className="font-medium">{quality}%</span>
            <span>Better Quality</span>
          </div>
        </div>
        <div className="sm:ml-6">
          <Button
            onClick={onBatchCompress}
            disabled={isCompressing}
            className="bg-primary text-white hover:bg-blue-700 font-medium flex items-center"
          >
            {isCompressing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            )}
            Compress All
          </Button>
        </div>
      </div>
    </div>
  );
}
