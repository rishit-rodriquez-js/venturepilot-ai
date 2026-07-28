import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'founder' | 'mentor' | 'investor' | 'admin';
  company?: string;
}

export interface Project {
  id: string;
  name: string;
  tagline?: string;
  industry: string;
  target_market?: string;
  problem_statement: string;
  solution_overview: string;
  stage: 'idea' | 'validation' | 'mvp' | 'growth' | 'scaling';
  readiness_score: number;
  created_at: string;
}

interface VentureStore {
  user: UserProfile | null;
  projects: Project[];
  activeProject: Project | null;
  setUser: (user: UserProfile | null) => void;
  setProjects: (projects: Project[]) => void;
  setActiveProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
}

export const useVentureStore = create<VentureStore>((set) => ({
  user: {
    id: "00000000-0000-0000-0000-000000000001",
    email: "founder@venturepilot.ai",
    full_name: "Lead Founder",
    role: "founder",
    company: "VenturePilot Inc."
  },
  projects: [
    {
      id: "proj-1",
      name: "FinPulse AI",
      tagline: "Autonomous AI CFO & Financial Forecasting for Enterprise SaaS",
      industry: "FinTech / Enterprise SaaS",
      target_market: "CFOs & Finance Operations at Series A-C Startups",
      problem_statement: "Manual financial modeling and cash flow forecasting takes 40+ hours per month and suffers from stale data.",
      solution_overview: "Autonomous agent swarm that connects directly to ERPs and bank feeds to run continuous scenario modeling.",
      stage: "validation",
      readiness_score: 88,
      created_at: new Date().toISOString()
    },
    {
      id: "proj-2",
      name: "HealthFlow OS",
      tagline: "AI Clinical Workflow Automation for Specialized Clinics",
      industry: "HealthTech / SaaS",
      target_market: "Specialized Medical Clinics & Outpatient Centers",
      problem_statement: "Doctors spend 2.5 hours daily filling out EHR fields instead of treating patients.",
      solution_overview: "Ambient voice AI that generates structured EHR charts automatically in compliance with HIPAA.",
      stage: "mvp",
      readiness_score: 92,
      created_at: new Date().toISOString()
    }
  ],
  activeProject: null,
  setUser: (user) => set({ user }),
  setProjects: (projects) => set({ projects }),
  setActiveProject: (activeProject) => set({ activeProject }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
}));
