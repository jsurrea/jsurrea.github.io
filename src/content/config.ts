import { z, defineCollection } from 'astro:content';

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(),
    endDate: z.string().optional(),
    url: z.string().url(),
    description: z.string(),
    highlights: z.array(z.string()),
    stack: z.array(z.string()),
    type: z.enum(['full-time', 'part-time', 'internship', 'research', 'freelance']),
    logo: z.string().optional(),
  }),
});

const project = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    githubRepo: z.string().optional(),
    liveUrl: z.string().url().optional(),
    tags: z.array(z.string()),
    category: z.enum(['web', 'ml', 'research', 'open-source', 'mobile', 'data']),
    featured: z.boolean().default(false),
    year: z.number(),
  }),
});

export const collections = { experience, project };
