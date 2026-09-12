import projectsData from "./projects.json";

export interface Project {
  title: string;
  category: string;
  filterCategory?: string;
  badge: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  headerBgClass: string;
  statsText: string;
}

export interface ProjectsData {
  categories: string[];
  projects: Project[];
}

const data = projectsData as ProjectsData;

export const categories: string[] = data.categories;
export const projects: Project[] = data.projects;
