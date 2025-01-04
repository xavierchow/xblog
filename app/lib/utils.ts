import matter from 'gray-matter';
import dayjs from 'dayjs';
import { FrontMatter } from './definitions';
import config from '../../next.config';

function isImage(str: string) {
  return str.startsWith('![img](');
}
type CountResult = {
  words: number;
  images?: number;
  codes?: number;
};
export function countWords(content: string) {
  // (?:regex) non-capture group
  // *? Lazy quantifier
  //const codeReg = /```(?:js|haskell|python|yaml|bash|vim)(?:.|\n)*?```/;
  const codeReg = /```(?:.|\n)*?```/;
  const wordsWithoutCodes = content.trim().split(codeReg);

  const codes = { length: wordsWithoutCodes.length - 1 };

  const re = /\s+|\n/;
  const words = wordsWithoutCodes.join(' ').trim().split(re);

  const images = words.filter(isImage);
  let result: CountResult = {
    words: words.length,
  };
  if (images.length > 0) {
    result = { words: words.length - images.length, images: images.length };
  }
  if (codes.length > 0) {
    result = { words: words.length, codes: codes.length };
  }
  return result;
}

export function howManyMinsRead(content: string) {
  const result = countWords(content);
  // 30s for code block
  const seconds4code = (result.codes || 0) * 60;
  const seconds4image = (result.images || 0) * 12; // TODO improve
  const seconds4words = Math.floor(result.words / 265) * 60;
  return Math.floor((seconds4code + seconds4image + seconds4words) / 60);
}

export function parseFrontMatter(doc: string): { data: FrontMatter; content: string } {
  const { content, data } = matter(doc);
  const d = (data.date ? dayjs(data.date) : dayjs()).format('YYYY-MM-DD');

  let tags = data.tags;

  if (typeof data.tags === 'string') {
    tags = [data.tags];
  }
  return { content, data: { ...data, date: d, tags } as FrontMatter };
}

export function parseImageSrc(coverUrl?: string) {
  if (coverUrl && coverUrl.startsWith('http')) {
    return coverUrl;
  }
  return `${config.basePath}${coverUrl || '/coding.png'}`;
}

export function getMarkdownFilesFolder() {
  let markdownFolder = process.env.MARKDOWN_FOLDER || '_posts/';
  if (!markdownFolder.endsWith('/')) {
    markdownFolder = markdownFolder + '/';
  }
  return markdownFolder;
}

export function debounce<T>(fn: (...args: T[]) => void, durationInSec: number) {
  let lastCalledAt: number | null;
  return (...args: T[]) => {
    if (!lastCalledAt || Date.now() > lastCalledAt * 1000 + durationInSec * 1000) {
      lastCalledAt = Math.floor(Date.now() / 1000);
      return fn(...args);
    }
    return;
  };
}
