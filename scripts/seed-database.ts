import { db } from "../server/db";
import { companies, jobs } from "../shared/schema";

async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    // Insert sample companies
    const companiesData = [
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

    const insertedCompanies = await db.insert(companies).values(companiesData).returning();
    console.log(`✅ Inserted ${insertedCompanies.length} companies`);

    // Insert sample jobs
    const jobsData = [
      {
        title: "Senior Frontend Developer",
        description: "Join our innovative team building next-generation web applications. Looking for someone passionate about React, TypeScript, and modern web technologies.",
        companyId: insertedCompanies[0].id,
        location: "Downtown SF • 0.5 miles",
        salary: "$120k - $150k",
        type: "full-time",
        category: "tech",
        skills: ["React", "TypeScript", "Node.js"],
        isActive: true
      },
      {
        title: "Barista & Customer Service",
        description: "Join our friendly team! Perfect for students or anyone looking for flexible hours. Experience with coffee machines preferred but not required.",
        companyId: insertedCompanies[1].id,
        location: "Mission District • 1.2 miles",
        salary: "$18/hour",
        type: "part-time",
        category: "food",
        skills: ["Customer Service", "Food Service", "Flexible Hours"],
        isActive: true
      },
      {
        title: "UX/UI Designer",
        description: "Seeking a creative designer to work on exciting client projects. Portfolio review required. Remote work options available.",
        companyId: insertedCompanies[2].id,
        location: "SOMA • 0.8 miles",
        salary: "$75/hour",
        type: "contract",
        category: "design",
        skills: ["Figma", "Adobe Creative", "Prototyping"],
        isActive: true
      },
      {
        title: "Personal Trainer",
        description: "Motivate and guide clients to achieve their fitness goals. Certification required. Flexible scheduling available.",
        companyId: insertedCompanies[3].id,
        location: "Castro District • 1.5 miles",
        salary: "$25/hour",
        type: "full-time",
        category: "fitness",
        skills: ["Fitness", "Certified Trainer", "Flexible Schedule"],
        isActive: true
      },
      {
        title: "Data Analyst",
        description: "Analyze complex datasets to drive business decisions. SQL and Python experience required. Great benefits package.",
        companyId: insertedCompanies[4].id,
        location: "Financial District • 2.1 miles",
        salary: "$85k - $105k",
        type: "full-time",
        category: "finance",
        skills: ["SQL", "Python", "Tableau"],
        isActive: true
      },
      {
        title: "Sales Associate",
        description: "Fashion-forward sales position in trendy boutique. Great for fashion enthusiasts. Employee discounts available.",
        companyId: insertedCompanies[5].id,
        location: "Union Square • 1.8 miles",
        salary: "$16/hour",
        type: "part-time",
        category: "retail",
        skills: ["Fashion", "Sales", "Customer Service"],
        isActive: true
      }
    ];

    const insertedJobs = await db.insert(jobs).values(jobsData).returning();
    console.log(`✅ Inserted ${insertedJobs.length} jobs`);

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();