export interface ProfileBasics {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location?: string;
  profiles: Array<{
    network: string;
    url: string;
    username: string;
    icon?: string;
  }>;
}

export interface ProfileEducation {
  institution: string;
  url: string;
  location?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string | null;
  gpa?: string;
  honor?: string;
  highlights?: string[];
}

export interface ProfileWork {
  name: string;
  note?: string;
  url: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  highlights: string[];
  stack?: string[];
  type?: string;
}

export interface ProfilePublication {
  authors: string;
  title: string;
  venue: string;
  year: string;
  paperUrl?: string;
  codeUrl?: string;
  demoUrl?: string;
}

export interface ProfileVolunteer {
  organization: string;
  url: string;
  role: string;
  startDate: string;
  endDate?: string;
  summary: string;
}

export interface ProfileAward {
  title: string;
  date: string;
  awarder: string;
  icon?: string;
  summary: string;
}

export interface ProfileCertificate {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface ProfileSkills {
  languages?: string[];
  mlAi?: string[];
  cloudDevops?: string[];
  frontend?: string[];
  backend?: string[];
  databases?: string[];
  data?: string[];
  [key: string]: string[] | undefined;
}

export interface Profile {
  basics: ProfileBasics;
  education?: ProfileEducation[];
  work?: ProfileWork[];
  publications?: ProfilePublication[];
  volunteer?: ProfileVolunteer[];
  awards?: ProfileAward[];
  certificates?: ProfileCertificate[];
  skills?: ProfileSkills;
}
