export interface ResumeData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
    location: string;
    website: string;
    avatar?: string;
  };
  summary: string;
  experience: {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }[];
  education: {
    id: string;
    degree: string;
    field: string;
    institution: string;
    year: string;
    gpa?: string;
    achievements?: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: number;
    type: 'technical' | 'soft';
  }[];
  projects: {
    id: string;
    name: string;
    techStack: string;
    url: string;
    github: string;
    bullets: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    id: string;
    name: string;
    level: string;
  }[];
  customSections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    location: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
};
