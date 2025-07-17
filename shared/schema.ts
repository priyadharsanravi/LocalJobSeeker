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
  type: text("type").notNull(), // full-time, part-time, contract
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
  status: text("status").notNull().default("pending"), // pending, reviewed, accepted, rejected
});

export const savedJobs = pgTable("saved_jobs", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  userId: text("user_id").notNull(), // simple user identification
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  appliedAt: true,
});

export const insertSavedJobSchema = createInsertSchema(savedJobs).omit({
  id: true,
  savedAt: true,
});

export type Company = typeof companies.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type SavedJob = typeof savedJobs.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type InsertSavedJob = z.infer<typeof insertSavedJobSchema>;

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

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
}));

export const savedJobsRelations = relations(savedJobs, ({ one }) => ({
  job: one(jobs, {
    fields: [savedJobs.jobId],
    references: [jobs.id],
  }),
}));

// Extended types for API responses
export type JobWithCompany = Job & {
  company: Company;
  isSaved?: boolean;
  likesCount?: number;
  commentsCount?: number;
};
