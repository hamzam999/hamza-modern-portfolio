
export interface Project {
  title: string;
  description: string;
  tech: string[];
  impact: string[];
  image: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  metrics: string[];
  details: string[];
}

export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}
