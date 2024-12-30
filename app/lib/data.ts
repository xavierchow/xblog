import { readFile, readdir } from 'node:fs/promises';
import path from 'path';
import { Post } from '@/app/lib/definitions';
import { parseFrontMatter } from '@/app/lib/utils';

export async function getMarkdownData(folder: string): Promise<Post[]> {
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
