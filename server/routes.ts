import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, insertApplicationSchema, insertSavedJobSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get single job
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJob(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job" });
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
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Get all companies
  app.get("/api/companies", async (req, res) => {
    try {
      const companies = await storage.getCompanies();
      res.json(companies);
    } catch (error) {
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
      res.status(500).json({ message: "Failed to submit application" });
    }
  });

  // Get applications for a job
  app.get("/api/jobs/:id/applications", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const applications = await storage.getApplicationsForJob(jobId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Save job
  app.post("/api/saved-jobs", async (req, res) => {
    try {
      const savedJobData = insertSavedJobSchema.parse(req.body);
      const savedJob = await storage.saveJob(savedJobData);
      res.status(201).json(savedJob);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid saved job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to save job" });
    }
  });

  // Unsave job
  app.delete("/api/saved-jobs/:jobId/:userId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const userId = req.params.userId;
      const success = await storage.unsaveJob(jobId, userId);
      if (success) {
        res.json({ message: "Job unsaved successfully" });
      } else {
        res.status(404).json({ message: "Saved job not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave job" });
    }
  });

  // Get saved jobs for user
  app.get("/api/saved-jobs/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const savedJobs = await storage.getSavedJobs(userId);
      res.json(savedJobs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch saved jobs" });
    }
  });

  // Check if job is saved
  app.get("/api/saved-jobs/:jobId/:userId/status", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const userId = req.params.userId;
      const isSaved = await storage.isJobSaved(jobId, userId);
      res.json({ isSaved });
    } catch (error) {
      res.status(500).json({ message: "Failed to check saved status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
