import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  current: number;
  total: number;
}

export default function ProgressIndicator({ current, total }: ProgressIndicatorProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Compressing Images...</h3>
        <span className="text-sm text-gray-600">{current}/{total} completed</span>
      </div>
      <Progress value={percentage} className="w-full h-3" />
    </div>
  );
}
