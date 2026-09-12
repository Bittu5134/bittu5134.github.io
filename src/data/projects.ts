import projectsData from "./projects.json";

export interface Project {
  title: string;
  category: string;
  badge: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  headerBgClass: string;
  statsText: string;
  stars?: number;
  forks?: number;
}

export const projects: Project[] = projectsData as Project[];
