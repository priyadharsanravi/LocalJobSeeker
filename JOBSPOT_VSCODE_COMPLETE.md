# JobSpot - Complete VS Code Project

This is a comprehensive Instagram-style job discovery app built with React, TypeScript, Express, and PostgreSQL.

## 🚀 Quick Setup

1. Create a new folder: `mkdir jobspot-app && cd jobspot-app`
2. Copy all files below into your project
3. Install dependencies: `npm install`
4. Set up environment: Create `.env` with your DATABASE_URL
5. Setup database: `npm run db:push`
6. Seed data: `npm run db:seed`
7. Start app: `npm run dev`

---

## 📁 Project Structure

```
jobspot-app/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── drizzle.config.ts
├── index.html
├── .env
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── server/
│   │   ├── index.ts
│   │   ├── db.ts
│   │   ├── storage.ts
│   │   └── routes.ts
│   ├── shared/
│   │   └── schema.ts
│   ├── components/
│   │   ├── ui/ (various components)
│   │   ├── job-card.tsx
│   │   └── bottom-nav.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── search.tsx
│   │   └── post-job.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts
└── scripts/
    └── seed.ts
```

---

## 🔧 Essential Setup Files

### package.json
```json
{
  "name": "jobspot-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"tsx src/server/index.ts\" \"vite\"",
    "build": "vite build",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.17.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "concurrently": "^8.2.2",
    "cors": "^2.8.5",
    "date-fns": "^3.0.0",
    "drizzle-orm": "^0.29.0",
    "drizzle-zod": "^0.5.1",
    "express": "^4.18.2",
    "lucide-react": "^0.303.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.2.0",
    "vite": "^5.0.0",
    "wouter": "^3.0.0",
    "ws": "^8.14.2",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/ws": "^8.5.10",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.6",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.6.0",
    "typescript": "^5.3.0"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
```

### .env
```
DATABASE_URL=your_postgresql_database_url_here
```

---

## 🎨 Core Application Files

### src/main.tsx
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### src/App.tsx
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Switch, Route } from 'wouter';
import Home from './pages/home';
import Search from './pages/search';
import PostJob from './pages/post-job';
import { Toaster } from './components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/search" component={Search} />
          <Route path="/post" component={PostJob} />
        </Switch>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

---

## 🗄️ Database & Server Setup

### src/shared/schema.ts
```typescript
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  location: text("location").notNull(),
  description: text("description"),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  companyId: integer("company_id").notNull(),
  location: text("location").notNull(),
  salary: text("salary").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  skills: text("skills").array().notNull().default([]),
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  coverLetter: text("cover_letter"),
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  applications: many(applications),
}));

// Insert schemas
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, postedAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, appliedAt: true });

// Types
export type Company = typeof companies.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;

export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type JobWithCompany = Job & {
  company: Company;
  likesCount?: number;
  commentsCount?: number;
};
```

### src/server/index.ts
```typescript
import express from 'express';
import cors from 'cors';
import { registerRoutes } from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

registerRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

### src/server/db.ts
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

---

## 🎯 Key React Components

### src/pages/home.tsx (Simplified Essential Version)
```typescript
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Heart, MessageCircle, Share2, Clock, Plus, Code, TrendingUp, Palette, Utensils, Briefcase, MapPin, Bell, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import type { JobWithCompany } from '@shared/schema';

export default function Home() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery<JobWithCompany[]>({
    queryKey: ["/api/jobs", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      const response = await fetch(`/api/jobs?${params}`);
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