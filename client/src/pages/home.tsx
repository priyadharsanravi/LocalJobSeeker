import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/header";
import LocationBar from "@/components/location-bar";
import JobCategories from "@/components/job-categories";
import JobCard from "@/components/job-card";
import BottomNavigation from "@/components/bottom-navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { JobWithCompany } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/jobs", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: { jobId: number; applicantName: string; applicantEmail: string; coverLetter: string }) => {
      return await apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Application submitted!",
        description: "Your job application has been sent successfully.",
      });
      setShowApplicationModal(false);
      setSelectedJobId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  const handlePostJobClick = () => {
    setLocation("/post");
  };

  const handleApply = (jobId: number) => {
    setSelectedJobId(jobId);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJobId) return;

    const formData = new FormData(e.currentTarget);
    applicationMutation.mutate({
      jobId: selectedJobId,
      applicantName: formData.get("applicantName") as string,
      applicantEmail: formData.get("applicantEmail") as string,
      coverLetter: formData.get("coverLetter") as string,
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-background)' }}>
      <Header />
      <LocationBar location="San Francisco, CA" jobCount={jobs.length} />
      <JobCategories 
        onCategorySelect={handleCategorySelect} 
        onPostJobClick={handlePostJobClick}
      />
      
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
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found{selectedCategory && ` in ${selectedCategory}`}</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))
        )}
      </div>

      <BottomNavigation onPostJob={handlePostJobClick} />

      {/* Application Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Job</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="applicantName">Full Name</Label>
              <Input 
                id="applicantName" 
                name="applicantName" 
                required 
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="applicantEmail">Email</Label>
              <Input 
                id="applicantEmail" 
                name="applicantEmail" 
                type="email" 
                required 
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea 
                id="coverLetter" 
                name="coverLetter" 
                placeholder="Tell us why you're a great fit..."
                rows={4}
              />
            </div>
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowApplicationModal(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={applicationMutation.isPending}
              >
                {applicationMutation.isPending ? "Submitting..." : "Apply Now"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
