/**
 * Konten editorial (markdown & YAML di /content) — hanya dibaca saat build.
 * Pengganti `astro:content`: skema tetap divalidasi zod, markdown dirender ke
 * HTML di sini sehingga browser tidak perlu parser markdown.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import { z } from 'zod';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

/** yyyy-mm-dd; YAML mem-parse tanggal jadi Date, string tetap dibiarkan. */
const isoDay = z.coerce.date().transform((d) => d.toISOString().slice(0, 10));

const eventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: isoDay,
  time: z.string().optional(), // e.g. "19.30 – 21.00 WIB"
  mode: z.enum(['online', 'offline', 'hybrid']).default('online'),
  location: z.string().default('Google Meet'),
  speaker: z.string().optional(),
  registrationOpen: z.boolean().default(true),
  registrationUrl: z.url().optional(), // link eksternal menggantikan form bawaan
});

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: isoDay,
  author: z.string().default('Tim SWE Growth'),
});

const jobSchema = z.object({
  role: z.string(),
  company: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']).default('full-time'),
  applyUrl: z.url(),
  postedDate: isoDay,
  active: z.boolean().default(true),
});

const videoSchema = z.object({
  title: z.string(),
  description: z.string(),
  url: z.url(),
  youtubeId: z.string().optional(), // thumbnail dari img.youtube.com
  category: z.string().default('Sharing Session'),
  publishedDate: isoDay,
});

const mentorSchema = z.object({
  name: z.string(),
  role: z.string(),
  company: z.string().optional(),
  topics: z.array(z.string()),
  linkedin: z.url().optional(),
  available: z.boolean().default(true),
});

export type ContentEvent = z.infer<typeof eventSchema> & { id: string; html: string };
export type BlogPost = z.infer<typeof blogSchema> & { id: string; html: string };
export type Job = z.infer<typeof jobSchema> & { id: string; html: string };
export type Video = z.infer<typeof videoSchema> & { id: string };
export type Mentor = z.infer<typeof mentorSchema> & { id: string };

async function files(collection: string, ext: string) {
  const dir = path.join(CONTENT_DIR, collection);
  const names = (await readdir(dir)).filter((n) => n.endsWith(ext)).sort();
  return Promise.all(
    names.map(async (name) => ({
      id: name.slice(0, -ext.length),
      file: `content/${collection}/${name}`,
      raw: await readFile(path.join(dir, name), 'utf8'),
    })),
  );
}

function validate<T extends z.ZodObject>(schema: T, data: unknown, file: string): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Frontmatter tidak valid di ${file}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

async function markdownCollection<T extends z.ZodObject>(collection: string, schema: T) {
  return Promise.all(
    (await files(collection, '.md')).map(async ({ id, file, raw }) => {
      const { data, content } = matter(raw);
      return { ...validate(schema, data, file), id, html: await marked.parse(content) };
    }),
  );
}

async function yamlCollection<T extends z.ZodObject>(collection: string, schema: T) {
  return (await files(collection, '.yaml')).map(({ id, file, raw }) => ({
    ...validate(schema, parseYaml(raw), file),
    id,
  }));
}

const byDateDesc = <K extends string>(key: K) => (a: Record<K, string>, b: Record<K, string>) =>
  b[key].localeCompare(a[key]);

export async function getEvents(): Promise<ContentEvent[]> {
  const events = await markdownCollection('events', eventSchema);
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export async function getEvent(slug: string) {
  return (await getEvents()).find((e) => e.id === slug) ?? null;
}

export async function getPosts(): Promise<BlogPost[]> {
  return (await markdownCollection('blog', blogSchema)).sort(byDateDesc('pubDate'));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.id === slug) ?? null;
}

export async function getJobs(): Promise<Job[]> {
  return (await markdownCollection('jobs', jobSchema)).filter((j) => j.active).sort(byDateDesc('postedDate'));
}

export async function getVideos(): Promise<Video[]> {
  return (await yamlCollection('videos', videoSchema)).sort(byDateDesc('publishedDate'));
}

export async function getMentors(): Promise<Mentor[]> {
  return (await yamlCollection('mentors', mentorSchema)).sort(
    (a, b) => Number(b.available) - Number(a.available) || a.name.localeCompare(b.name),
  );
}

/** Slug activity publik di Supabase saat build, supaya halaman detailnya ikut di-prerender. */
async function getActivitySlugs() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await db.from('activities').select('slug').eq('is_public', true);
  if (error) {
    console.warn('Prerender: gagal mengambil slug activity dari Supabase —', error.message);
    return [];
  }
  return data.map((row) => row.slug as string);
}

/** Path dinamis yang di-prerender; path statis datang dari getStaticPaths(). */
export async function prerenderPaths() {
  const [events, posts, activitySlugs] = await Promise.all([getEvents(), getPosts(), getActivitySlugs()]);
  const eventSlugs = new Set([...events.map((e) => e.id), ...activitySlugs]);
  return [
    ...[...eventSlugs].map((slug) => `/events/${slug}`),
    ...posts.map((p) => `/blog/${p.id}`),
  ];
}
