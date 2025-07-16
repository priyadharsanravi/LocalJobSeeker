import { Plus, Code, TrendingUp, Palette, Utensils } from "lucide-react";

interface JobCategoriesProps {
  onCategorySelect: (category: string) => void;
  onPostJobClick: () => void;
}

export default function JobCategories({ onCategorySelect, onPostJobClick }: JobCategoriesProps) {
  const categories = [
    { id: "post", label: "Post Job", icon: Plus, gradient: "gradient-bg" },
    { id: "tech", label: "Tech", icon: Code, gradient: "gradient-tech" },
    { id: "finance", label: "Finance", icon: TrendingUp, gradient: "gradient-finance" },
    { id: "design", label: "Design", icon: Palette, gradient: "gradient-design" },
    { id: "food", label: "Food", icon: Utensils, gradient: "gradient-food" },
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => category.id === "post" ? onPostJobClick() : onCategorySelect(category.id)}
              className="flex-shrink-0 text-center hover:scale-105 transition-transform duration-200"
            >
              <div className={`w-16 h-16 ${category.gradient} rounded-full flex items-center justify-center mb-2 ${category.id !== "post" ? "p-0.5" : ""}`}>
                {category.id !== "post" ? (
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <category.icon className="text-primary" size={20} />
                  </div>
                ) : (
                  <category.icon className="text-white" size={20} />
                )}
              </div>
              <span className="text-xs text-gray-600">{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
