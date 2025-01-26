import type { MetadataRoute } from 'next';
import { getMarkdownFilesFolder } from '@/app/lib/utils';
import { getPostsMeta } from '@/app/lib/data';

const host = process.env.APP_HOST || 'https://xavierz.dev';
// Get type from array, @see: https://stackoverflow.com/a/51399781/4550665
type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const folder = getMarkdownFilesFolder();
  const posts = await getPostsMeta(folder);
  const links: MetadataRoute.Sitemap = posts.map((p) => {
    return {
      url: `${host}/blog/posts/${p.slug}`,
      lastModified: p.mtime,
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });
  const root: ArrayElement<MetadataRoute.Sitemap> = {
    url: `${host}/blog/`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  };
  links.push(root);
  return links;
}
