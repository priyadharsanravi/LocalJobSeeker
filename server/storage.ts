import { 
  companies, 
  jobs, 
  applications, 
  savedJobs,
  type Company, 
  type Job, 
  type Application, 
  type SavedJob,
  type InsertCompany, 
  type InsertJob, 
  type InsertApplication, 
  type InsertSavedJob,
  type JobWithCompany 
} from "@shared/schema";
import { db } from "./db";
import { eq, like, and, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  // Companies
  createCompany(company: InsertCompany): Promise<Company>;
  getCompanies(): Promise<Company[]>;
  getCompany(id: number): Promise<Company | undefined>;

  // Jobs
  createJob(job: InsertJob): Promise<Job>;
  getJobs(filters?: { category?: string; location?: string; search?: string }): Promise<JobWithCompany[]>;
  getJob(id: number): Promise<JobWithCompany | undefined>;
  updateJob(id: number, job: Partial<InsertJob>): Promise<Job | undefined>;
  deleteJob(id: number): Promise<boolean>;

  // Applications
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsForJob(jobId: number): Promise<Application[]>;
  getApplications(): Promise<Application[]>;

  // Saved Jobs
  saveJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  unsaveJob(jobId: number, userId: string): Promise<boolean>;
  getSavedJobs(userId: string): Promise<JobWithCompany[]>;
  isJobSaved(jobId: number, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private companies: Map<number, Company>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private savedJobs: Map<number, SavedJob>;
  private companyIdCounter: number = 1;
  private jobIdCounter: number = 1;
  private applicationIdCounter: number = 1;
  private savedJobIdCounter: number = 1;

  constructor() {
    this.companies = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.savedJobs = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Create sample companies
    const sampleCompanies: InsertCompany[] = [
      {
        name: "TechCorp Solutions",
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "Downtown SF",
        description: "Leading technology solutions provider"
      },
      {
        name: "Green Leaf Cafe",
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "Mission District",
        description: "Eco-friendly local coffee shop"
      },
      {
        name: "DesignStudio Pro",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "SOMA",
        description: "Creative design agency"
      },
      {
        name: "FitLife Gym",
        logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "Castro District",
        description: "Premium fitness center"
      },
      {
        name: "DataFlow Analytics",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "Financial District",
        description: "Data analytics consulting"
      },
      {
        name: "StyleHub Boutique",
        logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        location: "Union Square",
        description: "Fashion retail boutique"
      }
    ];

    // Create companies and jobs
    sampleCompanies.forEach(async (companyData) => {
      const company = await this.createCompany(companyData);
      
      // Create sample jobs for each company
      const sampleJobs = this.getSampleJobsForCompany(company);
      sampleJobs.forEach(async (jobData) => {
        await this.createJob(jobData);
      });
    });
  }

  private getSampleJobsForCompany(company: Company): InsertJob[] {
    const jobsByCompany: Record<string, InsertJob[]> = {
      "TechCorp Solutions": [{
        title: "Senior Frontend Developer",
        description: "Join our innovative team building next-generation web applications. Looking for someone passionate about React, TypeScript, and modern web technologies.",
        companyId: company.id,
        location: "Downtown SF • 0.5 miles",
        salary: "$120k - $150k",
        type: "full-time",
        category: "tech",
        skills: ["React", "TypeScript", "Node.js"],
        isActive: true
      }],
      "Green Leaf Cafe": [{
        title: "Barista & Customer Service",
        description: "Join our friendly team! Perfect for students or anyone looking for flexible hours. Experience with coffee machines preferred but not required.",
        companyId: company.id,
        location: "Mission District • 1.2 miles",
        salary: "$18/hour",
        type: "part-time",
        category: "food",
        skills: ["Customer Service", "Food Service", "Flexible Hours"],
        isActive: true
      }],
      "DesignStudio Pro": [{
        title: "UX/UI Designer",
        description: "Seeking a creative designer to work on exciting client projects. Portfolio review required. Remote work options available.",
        companyId: company.id,
        location: "SOMA • 0.8 miles",
        salary: "$75/hour",
        type: "contract",
        category: "design",
        skills: ["Figma", "Adobe Creative", "Prototyping"],
        isActive: true
      }],
      "FitLife Gym": [{
        title: "Personal Trainer",
        description: "Motivate and guide clients to achieve their fitness goals. Certification required. Flexible scheduling available.",
        companyId: company.id,
        location: "Castro District • 1.5 miles",
        salary: "$25/hour",
        type: "full-time",
        category: "fitness",
        skills: ["Fitness", "Certified Trainer", "Flexible Schedule"],
        isActive: true
      }],
      "DataFlow Analytics": [{
        title: "Data Analyst",
        description: "Analyze complex datasets to drive business decisions. SQL and Python experience required. Great benefits package.",
        companyId: company.id,
        location: "Financial District • 2.1 miles",
        salary: "$85k - $105k",
        type: "full-time",
        category: "finance",
        skills: ["SQL", "Python", "Tableau"],
        isActive: true
      }],
      "StyleHub Boutique": [{
        title: "Sales Associate",
        description: "Fashion-forward sales position in trendy boutique. Great for fashion enthusiasts. Employee discounts available.",
        companyId: company.id,
        location: "Union Square • 1.8 miles",
        salary: "$16/hour",
        type: "part-time",
        category: "retail",
        skills: ["Fashion", "Sales", "Customer Service"],
        isActive: true
      }]
    };

    return jobsByCompany[company.name] || [];
  }

  // Companies
  async createCompany(company: InsertCompany): Promise<Company> {
    const id = this.companyIdCounter++;
    const newCompany: Company = { 
      ...company, 
      id,
      description: company.description || null
    };
    this.companies.set(id, newCompany);
    return newCompany;
  }

  async getCompanies(): Promise<Company[]> {
    return Array.from(this.companies.values());
  }

  async getCompany(id: number): Promise<Company | undefined> {
    return this.companies.get(id);
  }

  // Jobs
  async createJob(job: InsertJob): Promise<Job> {
    const id = this.jobIdCounter++;
    const newJob: Job = { 
      ...job, 
      id, 
      postedAt: new Date(),
      isActive: true,
      skills: job.skills || []
    };
    this.jobs.set(id, newJob);
    return newJob;
  }

  async getJobs(filters?: { category?: string; location?: string; search?: string }): Promise<JobWithCompany[]> {
    let jobsList = Array.from(this.jobs.values()).filter(job => job.isActive);

    if (filters?.category) {
      jobsList = jobsList.filter(job => job.category === filters.category);
    }

    if (filters?.location) {
      jobsList = jobsList.filter(job => 
        job.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      jobsList = jobsList.filter(job => 
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }

    // Sort by most recent
    jobsList.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

    // Add company information
    const jobsWithCompany: JobWithCompany[] = [];
    for (const job of jobsList) {
      const company = this.companies.get(job.companyId);
      if (company) {
        jobsWithCompany.push({
          ...job,
          company,
          likesCount: Math.floor(Math.random() * 200) + 20,
          commentsCount: Math.floor(Math.random() * 50) + 5
        });
      }
    }

    return jobsWithCompany;
  }

  async getJob(id: number): Promise<JobWithCompany | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const company = this.companies.get(job.companyId);
    if (!company) return undefined;

    return {
      ...job,
      company,
      likesCount: Math.floor(Math.random() * 200) + 20,
      commentsCount: Math.floor(Math.random() * 50) + 5
    };
  }

  async updateJob(id: number, jobUpdate: Partial<InsertJob>): Promise<Job | undefined> {
    const job = this.jobs.get(id);
    if (!job) return undefined;

    const updatedJob = { ...job, ...jobUpdate };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: number): Promise<boolean> {
    return this.jobs.delete(id);
  }

  // Applications
  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.applicationIdCounter++;
    const newApplication: Application = { 
      ...application, 
      id, 
      appliedAt: new Date(),
      status: "pending",
      coverLetter: application.coverLetter || null
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async getApplicationsForJob(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(app => app.jobId === jobId);
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  // Saved Jobs
  async saveJob(savedJob: InsertSavedJob): Promise<SavedJob> {
    const id = this.savedJobIdCounter++;
    const newSavedJob: SavedJob = { 
      ...savedJob, 
      id, 
      savedAt: new Date() 
    };
    this.savedJobs.set(id, newSavedJob);
    return newSavedJob;
  }

  async unsaveJob(jobId: number, userId: string): Promise<boolean> {
    const savedJob = Array.from(this.savedJobs.values()).find(
      saved => saved.jobId === jobId && saved.userId === userId
    );
    
    if (savedJob) {
      this.savedJobs.delete(savedJob.id);
      return true;
    }
    return false;
  }

  async getSavedJobs(userId: string): Promise<JobWithCompany[]> {
    const userSavedJobs = Array.from(this.savedJobs.values())
      .filter(saved => saved.userId === userId);
    
    const jobsWithCompany: JobWithCompany[] = [];
    for (const savedJob of userSavedJobs) {
      const job = this.jobs.get(savedJob.jobId);
      if (job && job.isActive) {
        const company = this.companies.get(job.companyId);
        if (company) {
          jobsWithCompany.push({
            ...job,
            company,
            isSaved: true,
            likesCount: Math.floor(Math.random() * 200) + 20,
            commentsCount: Math.floor(Math.random() * 50) + 5
          });
        }
      }
    }

    return jobsWithCompany;
  }

  async isJobSaved(jobId: number, userId: string): Promise<boolean> {
    return Array.from(this.savedJobs.values()).some(
      saved => saved.jobId === jobId && saved.userId === userId
    );
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<any | undefined> {
    // Placeholder for user functionality
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    // Placeholder for user functionality
    return undefined;
  }

  async createUser(insertUser: any): Promise<any> {
    // Placeholder for user functionality
    return {} as any;
  }

  // Companies
  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async getCompany(id: number): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company || undefined;
  }

  // Jobs
  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getJobs(filters?: { category?: string; location?: string; search?: string }): Promise<JobWithCompany[]> {
    const query = db
      .select()
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.isActive, true));

    let conditions = [eq(jobs.isActive, true)];

    if (filters?.category) {
      conditions.push(eq(jobs.category, filters.category));
    }

    if (filters?.location) {
      conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(jobs.title, searchTerm),
          ilike(jobs.description, searchTerm)
        )
      );
    }

    const result = await db
      .select()
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(...conditions))
      .orderBy(desc(jobs.postedAt));

    return result.map(row => ({
      ...row.jobs,
      company: row.companies!,
      likesCount: Math.floor(Math.random() * 200) + 20,
      commentsCount: Math.floor(Math.random() * 50) + 5
    }));
  }

  async getJob(id: number): Promise<JobWithCompany | undefined> {
    const [result] = await db
      .select()
      .from(jobs)
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(eq(jobs.id, id));

    if (!result || !result.companies) return undefined;

    return {
      ...result.jobs,
      company: result.companies,
      likesCount: Math.floor(Math.random() * 200) + 20,
      commentsCount: Math.floor(Math.random() * 50) + 5
    };
  }

  async updateJob(id: number, jobUpdate: Partial<InsertJob>): Promise<Job | undefined> {
    const [updatedJob] = await db
      .update(jobs)
      .set(jobUpdate)
      .where(eq(jobs.id, id))
      .returning();
    return updatedJob || undefined;
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return result.rowCount > 0;
  }

  // Applications
  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

  async getApplicationsForJob(jobId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId));
  }

  async getApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }

  // Saved Jobs
  async saveJob(savedJob: InsertSavedJob): Promise<SavedJob> {
    const [newSavedJob] = await db.insert(savedJobs).values(savedJob).returning();
    return newSavedJob;
  }

  async unsaveJob(jobId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(savedJobs)
      .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.userId, userId)));
    return result.rowCount > 0;
  }

  async getSavedJobs(userId: string): Promise<JobWithCompany[]> {
    const result = await db
      .select()
      .from(savedJobs)
      .leftJoin(jobs, eq(savedJobs.jobId, jobs.id))
      .leftJoin(companies, eq(jobs.companyId, companies.id))
      .where(and(eq(savedJobs.userId, userId), eq(jobs.isActive, true)))
      .orderBy(desc(savedJobs.savedAt));

    return result.map(row => ({
      ...row.jobs!,
      company: row.companies!,
      isSaved: true,
      likesCount: Math.floor(Math.random() * 200) + 20,
      commentsCount: Math.floor(Math.random() * 50) + 5
    }));
  }

  async isJobSaved(jobId: number, userId: string): Promise<boolean> {
    const [saved] = await db
      .select()
      .from(savedJobs)
      .where(and(eq(savedJobs.jobId, jobId), eq(savedJobs.userId, userId)));
    return !!saved;
  }
}

export const storage = new DatabaseStorage();
