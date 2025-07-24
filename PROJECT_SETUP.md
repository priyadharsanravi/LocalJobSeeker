# JobSpot - Instagram-Style Job Discovery App

## Quick Setup for VS Code

### 1. Create New Project
```bash
mkdir jobspot-app
cd jobspot-app
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install express react react-dom @types/express @types/node @types/react @types/react-dom
npm install drizzle-orm @neondatabase/serverless drizzle-kit
npm install @tanstack/react-query wouter zod drizzle-zod
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-slot
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install tailwindcss autoprefixer postcss @tailwindcss/typography
npm install vite @vitejs/plugin-react tsx typescript

# Dev dependencies  
npm install -D @types/ws tailwindcss-animate
```

### 3. Project Structure
```
jobspot-app/
├── package.json
├── vite.config.ts
├── tsconfig.json  
├── tailwind.config.js
├── postcss.config.js
├── drizzle.config.ts
├── index.html
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
│   │   ├── ui/ (shadcn components)
│   │   ├── header.tsx
│   │   ├── job-card.tsx
│   │   └── bottom-navigation.tsx
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── search.tsx
│   │   └── post-job.tsx
│   ├── hooks/
│   │   └── use-toast.ts
│   └── lib/
│       ├── utils.ts
│       └── queryClient.ts
└── scripts/
    └── seed.ts
```

### 4. Environment Setup
Create `.env` file:
```
DATABASE_URL=your_database_url_here
```

### 5. Package.json Scripts
```json
{
  "scripts": {
    "dev": "tsx src/server/index.ts",
    "build": "vite build",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx scripts/seed.ts"
  }
}
```

### 6. Run the App
```bash
npm run db:push  # Setup database
npm run db:seed  # Add sample data
npm run dev      # Start development server
```

## Key Features
- Instagram-style job discovery feed
- Mobile-first responsive design
- PostgreSQL database with Drizzle ORM
- Job posting, searching, and saving
- Real-time data with React Query
- Modern UI with Radix components

## Database Schema
- Companies (id, name, logo, location, description)
- Jobs (id, title, description, company_id, location, salary, type, category, skills, posted_at, is_active)
- Applications (id, job_id, applicant_name, applicant_email, cover_letter, applied_at, status)  
- Saved Jobs (id, job_id, user_id, saved_at)

## Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: Tailwind CSS + Radix UI
- **State**: TanStack React Query
- **Routing**: Wouter