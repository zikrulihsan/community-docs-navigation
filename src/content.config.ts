import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    time: z.string().optional(), // e.g. "19.30 – 21.00 WIB"
    mode: z.enum(['online', 'offline', 'hybrid']).default('online'),
    location: z.string().default('Google Meet'),
    speaker: z.string().optional(),
    registrationOpen: z.boolean().default(true),
    registrationUrl: z.string().url().optional(), // external link overrides the built-in form
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Tim SWE Growth'),
  }),
});

const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    role: z.string(),
    company: z.string(),
    location: z.string(),
    type: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']).default('full-time'),
    applyUrl: z.string().url(),
    postedDate: z.coerce.date(),
    active: z.boolean().default(true),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/videos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
    youtubeId: z.string().optional(), // enables thumbnail from img.youtube.com
    category: z.string().default('Sharing Session'),
    publishedDate: z.coerce.date(),
  }),
});

const mentors = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/mentors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string().optional(),
    topics: z.array(z.string()),
    linkedin: z.string().url().optional(),
    available: z.boolean().default(true),
  }),
});

export const collections = { events, blog, jobs, videos, mentors };
