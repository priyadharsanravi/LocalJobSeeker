import { Heart, MessageCircle, Share2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { JobWithCompany } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: JobWithCompany;
  onApply: (jobId: number) => void;
}

const jobImages = [
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
];

export default function JobCard({ job, onApply }: JobCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveJobMutation = useMutation({
    mutationFn: async () => {
      const userId = "user123"; // Simple user identification
      if (isSaved) {
        await apiRequest("DELETE", `/api/saved-jobs/${job.id}/${userId}`);
      } else {
        await apiRequest("POST", "/api/saved-jobs", { jobId: job.id, userId });
      }
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: isSaved ? "Job unsaved" : "Job saved",
        description: isSaved ? "Job removed from saved list" : "Job added to saved list",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      });
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full-time": return "bg-secondary text-white";
      case "part-time": return "bg-accent text-white";
      case "contract": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getSkillColors = (category: string) => {
    switch (category) {
      case "tech": return "bg-blue-100 text-blue-800";
      case "finance": return "bg-green-100 text-green-800";
      case "design": return "bg-purple-100 text-purple-800";
      case "food": return "bg-orange-100 text-orange-800";
      case "fitness": return "bg-green-100 text-green-800";
      case "retail": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const randomImage = jobImages[job.id % jobImages.length];

  return (
    <article className="bg-white border-b border-gray-100">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img 
              src={job.company.logo} 
              alt={`${job.company.name} logo`} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{job.company.name}</h3>
              <p className="text-sm text-gray-600">{job.location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getTypeColor(job.type)}`}>
              {job.type}
            </Badge>
            <button className="text-gray-400">
              <Share2 size={16} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h2>
          <p className="text-gray-600 text-sm">{job.description}</p>
        </div>

        <img 
          src={randomImage} 
          alt="Job environment" 
          className="w-full h-48 object-cover rounded-lg mb-3"
        />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center space-x-1 transition-colors ${
                isLiked ? "text-primary" : "text-gray-600 hover:text-primary"
              }`}
            >
              <Heart className={isLiked ? "fill-current" : ""} size={20} />
              <span className="text-sm">{(job.likesCount || 0) + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-secondary transition-colors">
              <MessageCircle size={20} />
              <span className="text-sm">{job.commentsCount || 0}</span>
            </button>
            <button 
              onClick={() => saveJobMutation.mutate()}
              className={`transition-colors ${
                isSaved ? "text-accent" : "text-gray-600 hover:text-accent"
              }`}
              disabled={saveJobMutation.isPending}
            >
              <Share2 className={isSaved ? "fill-current" : ""} size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-success">{job.salary}</span>
            <Button 
              onClick={() => onApply(job.id)}
              className="bg-primary text-white hover:bg-primary/90 px-4 py-2 rounded-full text-sm"
            >
              Apply Now
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.skills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`${getSkillColors(job.category)} text-xs`}
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Clock size={12} className="mr-1" />
          Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
        </div>
      </div>
    </article>
  );
}
