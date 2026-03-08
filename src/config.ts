// ============================================================
// User-specific configuration
// All values specific to jsurrea's portfolio are centralised
// here so that adapting this project to a different user only
// requires editing this file.
// ============================================================

/** GitHub username – drives API calls and derived URLs. */
export const GITHUB_USER = 'jsurrea';

/** URL of the profile YAML used to populate CV sections. */
export const PROFILE_URL = `https://${GITHUB_USER}.github.io/CV/profile.yaml`;

/** Public URL of the online CV / resume. */
export const CV_URL = `https://${GITHUB_USER}.github.io/CV/`;

/** GitHub organisation logins to feature in the Open-Source section. */
export const ORG_LOGINS: string[] = ['Open-Source-Uniandes', 'AI-Museum'];

/**
 * Roles cycled by the hero typewriter animation.
 * The first entry is also shown as the static fallback.
 */
export const HERO_ROLES: string[] = [
  'Software Engineer',
  'AI Researcher',
  'Open Source Builder',
  'Computer Vision Engineer',
  'Full-Stack Developer',
];

export interface OrgMeta {
  tagline: string;
  description: string;
  highlights: string[];
}

/**
 * Rich metadata for each featured organisation.
 * This supplements the data returned by the GitHub API (which only
 * provides a short description).
 */
export const ORG_DESCRIPTIONS: Record<string, OrgMeta> = {
  'Open-Source-Uniandes': {
    tagline: 'Building open technology for the Uniandes community',
    description:
      'A student-led initiative at Universidad de los Andes dedicated to creating open-source tools that solve real problems for the university community. We believe the best solutions emerge from collaboration and listening to the people they serve. Every project is built in public — contributions are welcomed, and new ideas are mentored from concept to production.',
    highlights: [
      'Serving 8,000+ students with production-grade open tools',
      'Student-run, community-first engineering culture',
      'Open mentorship: from idea to deployed product',
      'Building a portfolio of impact-driven software',
    ],
  },
  'AI-Museum': {
    tagline: 'Democratizing AI education through open, visual, interactive learning',
    description:
      'An ambitious initiative to make Artificial Intelligence education accessible to everyone — through open-source materials, rich visualizations, and novel interactive experiences. We are building a comprehensive library of learning resources so that anyone, anywhere, can learn or teach AI without barriers. Our long-term vision is the first physical AI Museum at global scale.',
    highlights: [
      'Open-source learning materials for all levels',
      'Focus on visualizations, interactivity, and experimentation',
      'Free forever — for learners and educators worldwide',
      "Vision: the world's first physical AI Museum",
    ],
  },
};
