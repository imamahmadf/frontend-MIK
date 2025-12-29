export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
}

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
  image?: string;
}

export interface Skill {
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}
