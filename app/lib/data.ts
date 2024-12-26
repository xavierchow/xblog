import { readFile, readdir } from 'node:fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/app/lib/definitions';

export async function getMarkdownData(folder: string): Promise<Post[]> {
  const files = await readdir(folder);
  const markdownPosts = files.filter((file: string) => file.endsWith('.md'));

  const postsData = await Promise.all(
    markdownPosts.map(async (file: string) => {
      const filePath = path.join(folder, file);
      const content = await readFile(filePath, 'utf8');
      const data = matter(content);
      return {
        ...data.data,
        slug: file.replace('.md', ''),
        content: data.content,
      };
    })
  );
  return postsData;
}

export async function getMarkdownContent(folder: string, slug: string) {
  const file = `${folder}${slug}.md`;
  const content = await readFile(file, 'utf8');
  const matterResult = matter(content);
  return matterResult;
}
