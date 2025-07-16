import { MapPin } from "lucide-react";

interface LocationBarProps {
  location: string;
  jobCount: number;
}

export default function LocationBar({ location, jobCount }: LocationBarProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="text-secondary" size={16} />
          <span>{location}</span>
          <span className="text-gray-400">•</span>
          <span>{jobCount} jobs nearby</span>
        </div>
      </div>
    </div>
  );
}
