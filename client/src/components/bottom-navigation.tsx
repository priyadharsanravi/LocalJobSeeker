import { Home, Search, Plus, Bookmark, User } from "lucide-react";
import { useLocation } from "wouter";

interface BottomNavigationProps {
  onPostJob: () => void;
}

export default function BottomNavigation({ onPostJob }: BottomNavigationProps) {
  const [location, setLocation] = useLocation();

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "post", icon: Plus, label: "Post", path: "/post" },
    { id: "saved", icon: Bookmark, label: "Saved", path: "/saved" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.id === "post") {
      onPostJob();
    } else {
      setLocation(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                location === item.path && item.id !== "post"
                  ? "text-primary"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
