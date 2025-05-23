import { z } from 'zod';

import { MediaItemSchema } from '@src/schemas/global-schema';

export const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  seoFullHead: z.string(),
  permalink: z.string(),
  type: z.string(),
  thumbnail: MediaItemSchema.optional(),
  // taxonomies @TODO recheck if needed
  updatedAt: z.number(),
  createdAt: z.number(),
  publishedAt: z.number(),
  content: z.string(),
  rawContent: z.string(),
});

export type Page = z.infer<typeof PageSchema>;

export const PagePermalinks = PageSchema.pick({ permalink: true });
export const PageSlugs = PageSchema.pick({ slug: true });
export const PageRoute = PageSchema.pick({ permalink: true, slug: true, id: true, type: true });
