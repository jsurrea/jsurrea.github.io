export const en = {
  nav: {
    experience: 'Experience',
    education: 'Education',
    publications: 'Research',
    skills: 'Skills',
    awards: 'Awards',
    openSource: 'Open Source',
    projects: 'Projects',
  },
  hero: {
    greeting: "Hi, I'm",
    viewWork: 'View My Work',
    downloadCV: 'Download CV',
  },
  experience: {
    present: 'Present',
  },
  education: {
    present: 'Present',
  },
  projects: {
    viewCode: 'View Code',
    liveDemo: 'Live Demo',
  },
  footer: {
    madeWith: 'Made with',
  },
} as const;

export type TranslationKey = typeof en;
