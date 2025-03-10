import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'path';
import { unstable_cache } from 'next/cache';
import { Post } from '@/app/lib/definitions';
import { parseFrontMatter } from '@/app/lib/utils';
const CACHE_TTL_IN_MIN = parseInt(process.env.CACHE_TTL_IN_MIN || '5');
export async function getMarkdownData(folder: string): Promise<Post[]> {
  console.log('reading markdown--- %s', new Date());

  const files = await readdir(folder);
  const markdownPosts = files.filter((file: string) => file.endsWith('.md'));

  const postsData = await Promise.all(
    markdownPosts.map(async (file: string) => {
      const filePath = path.join(folder, file);
      const doc = await readFile(filePath, 'utf8');
      const { data, content } = parseFrontMatter(doc);
      return {
        ...data,
        slug: file.replace('.md', ''),
        content: content,
      };
    })
  );
  return postsData;
}

export async function getMarkdownContent(folder: string, slug: string) {
  const file = `${folder}${slug}.md`;
  const content = await readFile(file, 'utf8');
  return parseFrontMatter(content);
}

export async function getCachedMarkdownData(folder: string) {
  let cachedGetter;
  if (process.env.WATCH_MARKDOWN === 'yes') {
    cachedGetter = () => getMarkdownData(folder);
  } else {
    cachedGetter = unstable_cache(
      async () => {
        return getMarkdownData(folder);
      },
      [],
      {
        tags: ['/blogs'],
        revalidate: 60 * CACHE_TTL_IN_MIN,
      }
    );
  }
  const rawPosts = await cachedGetter();

  const posts = rawPosts.sort((a, b) => {
    // descending
    return a.date > b.date ? -1 : 1;
  });
  return posts;
}
export async function getPostsMeta(folder: string) {
  const getMeta = async (folder: string) => {
    const files = await readdir(folder);
    const markdownPosts = files.filter((file: string) => file.endsWith('.md'));
    const postsMeta = await Promise.all(
      markdownPosts.map(async (file: string) => {
        const filePath = path.join(folder, file);
        const stats = await stat(filePath);
        return {
          ...stats,
          slug: file.replace('.md', ''),
        };
      })
    );
    return postsMeta;
  };

  const getter = unstable_cache(
    async () => {
      return getMeta(folder);
    },
    [],
    {
      tags: ['/sitemap'],
      revalidate: 60 * CACHE_TTL_IN_MIN,
    }
  );
  return getter();
}
