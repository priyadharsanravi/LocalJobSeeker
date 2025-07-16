import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Bookmark } from "lucide-react";
import Header from "@/components/header";
import JobCard from "@/components/job-card";
import BottomNavigation from "@/components/bottom-navigation";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobWithCompany } from "@shared/schema";

export default function SavedJobs() {
  const [, setLocation] = useLocation();
  const userId = "user123"; // Simple user identification

  const { data: savedJobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/saved-jobs", userId],
    queryFn: async () => {
      const response = await fetch(`/api/saved-jobs/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch saved jobs");
      return response.json();
    },
  });

  const handleApply = (jobId: number) => {
    console.log("Apply to job:", jobId);
  };

  const handlePostJobClick = () => {
    setLocation("/post");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-background)' }}>
      <Header />
      
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Bookmark className="text-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Saved Jobs</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {savedJobs.length} saved {savedJobs.length === 1 ? "job" : "jobs"}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto pb-20">
        {isLoading ? (
          <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-2">No saved jobs yet</p>
            <p className="text-sm text-gray-400">
              Jobs you save will appear here for easy access
            </p>
          </div>
        ) : (
          savedJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))
        )}
      </div>

      <BottomNavigation onPostJob={handlePostJobClick} />
    </div>
  );
}
