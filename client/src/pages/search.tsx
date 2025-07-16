import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, MapPin, Filter } from "lucide-react";
import Header from "@/components/header";
import JobCard from "@/components/job-card";
import BottomNavigation from "@/components/bottom-navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import type { JobWithCompany } from "@shared/schema";

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [activeLocationFilter, setActiveLocationFilter] = useState("");

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/jobs", activeSearchTerm, activeLocationFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeSearchTerm) params.append("search", activeSearchTerm);
      if (activeLocationFilter) params.append("location", activeLocationFilter);
      
      const response = await fetch(`/api/jobs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const handleSearch = () => {
    setActiveSearchTerm(searchTerm);
    setActiveLocationFilter(locationFilter);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleApply = (jobId: number) => {
    console.log("Apply to job:", jobId);
  };

  const handlePostJobClick = () => {
    setLocation("/post");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--app-background)' }}>
      <Header />
      
      {/* Search Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-md mx-auto space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Search jobs, skills, companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <SearchIcon size={16} className="mr-2" />
            Search Jobs
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-md mx-auto pb-20">
        {activeSearchTerm || activeLocationFilter ? (
          <div className="p-4 bg-white border-b border-gray-100">
            <p className="text-sm text-gray-600">
              {jobs.length} results for{" "}
              {activeSearchTerm && (
                <span className="font-medium">"{activeSearchTerm}"</span>
              )}
              {activeSearchTerm && activeLocationFilter && " in "}
              {activeLocationFilter && (
                <span className="font-medium">{activeLocationFilter}</span>
              )}
            </p>
          </div>
        ) : null}

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
        ) : jobs.length === 0 && (activeSearchTerm || activeLocationFilter) ? (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-2">No jobs found</p>
            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 mb-2">Search for your dream job</p>
            <p className="text-sm text-gray-400">Enter keywords or location to get started</p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={handleApply} />
          ))
        )}
      </div>

      <BottomNavigation onPostJob={handlePostJobClick} />
    </div>
  );
}
