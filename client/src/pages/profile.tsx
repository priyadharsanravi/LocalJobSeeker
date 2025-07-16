import { useLocation } from "wouter";
import { User, Briefcase, MapPin, Mail, Phone, Settings } from "lucide-react";
import Header from "@/components/header";
import BottomNavigation from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Profile() {
  const [, setLocation] = useLocation();

  const handlePostJobClick = () => {
    setLocation("/post");
  };

  const userStats = [
    { label: "Applications Sent", value: "12" },
    { label: "Jobs Saved", value: "8" },
    { label: "Profile Views", value: "24" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-background)' }}>
      <Header />
      
      <div className="max-w-md mx-auto p-4 pb-20">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">John Doe</h1>
                <p className="text-gray-600">Frontend Developer</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin size={14} className="mr-1" />
                  San Francisco, CA
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {userStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400" size={18} />
                <span className="text-gray-700">john.doe@email.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400" size={18} />
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Node.js", "Python", "AWS", "Git"].map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation("/saved")}
              >
                <Briefcase size={18} className="mr-3" />
                View Saved Jobs
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setLocation("/search")}
              >
                <Settings size={18} className="mr-3" />
                Job Preferences
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
              >
                <User size={18} className="mr-3" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation onPostJob={handlePostJobClick} />
    </div>
  );
}
