 if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const applicationMutation = useMutation({
    mutationFn: async (data: { jobId: number; applicantName: string; applicantEmail: string; coverLetter: string }) => {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit application');
      return response.json();
    },
    onSuccess: () => {
      setShowApplicationModal(false);
      setSelectedJobId(null);
    },
  });

  const categories = [
    { id: "tech", label: "Tech", icon: Code, gradient: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { id: "finance", label: "Finance", icon: TrendingUp, gradient: "bg-gradient-to-r from-green-500 to-green-600" },
    { id: "design", label: "Design", icon: Palette, gradient: "bg-gradient-to-r from-purple-500 to-purple-600" },
    { id: "food", label: "Food", icon: Utensils, gradient: "bg-gradient-to-r from-orange-500 to-orange-600" },
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
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

  const jobImages = [
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
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

      {/* Location Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="text-blue-500" size={16} />
            <span>San Francisco, CA</span>
            <span className="text-gray-400">•</span>
            <span>{jobs.length} jobs nearby</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-md mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => setLocation('/post')}
              className="flex-shrink-0 text-center hover:scale-105 transition-transform"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mb-2">
                <Plus className="text-white" size={20} />
              </div>
              <span className="text-xs text-gray-600">Post Job</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="flex-shrink-0 text-center hover:scale-105 transition-transform"
              >
                <div className={`w-16 h-16 ${category.gradient} rounded-full flex items-center justify-center mb-2 p-0.5`}>
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <category.icon className="text-gray-700" size={20} />
                  </div>
                </div>
                <span className="text-xs text-gray-600">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Job Feed */}
      <div className="max-w-md mx-auto pb-20">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found{selectedCategory && ` in ${selectedCategory}`}</p>
          </div>
        ) : (
          jobs.map((job) => (
            <article key={job.id} className="bg-white border-b border-gray-100">
              <div className="p-4">
                {/* Job Header */}
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
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                      {job.type}
                    </span>
                    <Share2 className="text-gray-400" size={16} />
                  </div>
                </div>

                {/* Job Content */}
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h2>
                  <p className="text-gray-600 text-sm">{job.description}</p>
                </div>

                {/* Job Image */}
                <img 
                  src={jobImages[job.id % jobImages.length]} 
                  alt="Job environment" 
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />

                {/* Actions & Salary */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-600">
                      <Heart size={20} />
                      <span className="text-sm">{job.likesCount || 0}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600">
                      <MessageCircle size={20} />
                      <span className="text-sm">{job.commentsCount || 0}</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-green-600">{job.salary}</span>
                    <Button 
                      onClick={() => handleApply(job.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>

                {/* Skills & Time */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <Clock size={12} className="mr-1" />
                  Posted {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-around py-2">
            <button className="flex flex-col items-center space-y-1 p-2 text-pink-500">
              <Briefcase size={20} />
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={() => setLocation('/search')}
              className="flex flex-col items-center space-y-1 p-2 text-gray-600"
            >
              <MapPin size={20} />
              <span className="text-xs">Search</span>
            </button>
            <button 
              onClick={() => setLocation('/post')}
              className="flex flex-col items-center space-y-1 p-2 text-gray-600"
            >
              <Plus size={20} />
              <span className="text-xs">Post</span>
            </button>
          </div>
        </div>
      </nav>

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
                className="flex-1 bg-pink-500 hover:bg-pink-600"
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
```

Continue reading for setup instructions and remaining files...

## 📋 Additional Required Files

You'll also need to create these utility files and remaining components. Copy the complete component files from the previous documentation files, or I can provide them individually as needed.

## 🎉 Features Included

- ✅ Instagram-style job feed with images
- ✅ Mobile-first responsive design  
- ✅ Job posting and application system
- ✅ Real-time search and filtering
- ✅ PostgreSQL database with Drizzle ORM
- ✅ TypeScript throughout the stack
- ✅ Modern UI with Tailwind CSS
- ✅ Social media-style interactions

## 🚀 Getting Started

1. Copy all files into your VS Code project
2. Run `npm install` to install dependencies
3. Set up your PostgreSQL database and add URL to `.env`
4. Run `npm run db:push` to create tables
5. Run `npm run db:seed` to add sample data
6. Run `npm run dev` to start both servers
7. Open http://localhost:3000 to view the app

The app will run with the frontend on port 3000 and backend API on port 5000, with Vite proxying API requests automatically.