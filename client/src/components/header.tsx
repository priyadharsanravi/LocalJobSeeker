import { Bell, Mail, Briefcase } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
              <Briefcase className="text-white" size={16} />
            </div>
            <h1 className="text-xl font-bold text-gray-900">JobSpot</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" size={20} />
            <Mail className="text-gray-600" size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
