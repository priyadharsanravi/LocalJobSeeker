# JobSpot - Complete VS Code Project Files (Part 2)

This is a continuation of the complete project setup. Copy all these files into your VS Code project.

---

## File: src/shared/schema.ts
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

export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: text("user_id").notNull(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
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
  savedJobs: many(savedJobs),
}));

// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, postedAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, appliedAt: true });

// Types
export type Company = typeof companies.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type SavedJob = typeof savedJobs.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type JobWithCompany = Job & {
  company: Company;
  isSaved?: boolean;
  likesCount?: number;
  commentsCount?: number;
};
```

---

## File: src/server/index.ts
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
  console.log(`Server running on port ${PORT}`);
});
```

---

## File: src/server/db.ts
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

## File: src/server/storage.ts
```typescript
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
} from "../shared/schema";
import { db } from "./db";
import { eq, and, desc, ilike, or } from "drizzle-orm";

export interface IStorage {
  createCompany(company: InsertCompany): Promise<Company>;
  getCompanies(): Promise<Company[]>;
  createJob(job: InsertJob): Promise<Job>;
  getJobs(filters?: { category?: string; location?: string; search?: string }): Promise<JobWithCompany[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  saveJob(savedJob: InsertSavedJob): Promise<SavedJob>;
  unsaveJob(jobId: number, userId: string): Promise<boolean>;
  getSavedJobs(userId: string): Promise<JobWithCompany[]>;
}

export class DatabaseStorage implements IStorage {
  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async getJobs(filters?: { category?: string; location?: string; search?: string }): Promise<JobWithCompany[]> {
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

  async createApplication(application: InsertApplication): Promise<Application> {
    const [newApplication] = await db.insert(applications).values(application).returning();
    return newApplication;
  }

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
}

export const storage = new DatabaseStorage();
```

---

## File: src/server/routes.ts
```typescript
import type { Express } from "express";
import { storage } from "./storage";
import { insertJobSchema, insertApplicationSchema } from "../shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express) {
  // Get all jobs with filtering
  app.get("/api/jobs", async (req, res) => {
    try {
      const { category, location, search } = req.query;
      const jobs = await storage.getJobs({
        category: category as string,
        location: location as string,
        search: search as string
      });
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Create new job
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      res.status(500).json({ message: "Failed to fetch companies" });
    }
  });

  // Apply to job
  app.post("/api/applications", async (req, res) => {
    try {
      const applicationData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      console.error("Error submitting application:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  });
}
```

Continue reading for the React components and remaining files...