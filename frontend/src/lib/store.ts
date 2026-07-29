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
  owner_id?: string;
  name: string;
  tagline?: string;
  industry: string;
  target_market?: string;
  problem_statement: string;
  solution_overview: string;
  stage: 'idea' | 'validation' | 'mvp' | 'growth' | 'scaling';
  readiness_score: number;
  status?: 'Running' | 'Completed' | 'Pending' | 'Queued';
  created_at: string;
  updated_at?: string;
}

export interface VentureUIStore {
  // Authentication Session
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Projects State
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;

  // Navigation & Drawer UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useVentureStore = create<VentureUIStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  projects: [],
  setProjects: (projects) => set({ projects }),
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),

  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
  isDrawerOpen: false,
  setIsDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  theme: 'light',
  setTheme: (theme) => set({ theme })
}));
