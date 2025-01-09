import matter from 'gray-matter';
import dayjs from 'dayjs';
import { FrontMatter } from './definitions';
import config from '../../next.config';

function isImage(str: string) {
  return str.startsWith('![img](') || str.startsWith('![image](');
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
  const paragraphsWithoutCode = content.trim().split(codeReg);

  // code blocks sit inside the paragraphs, p1 | code 1 | p2 | code2 | p3
  // so the number of code blocks should be the number of paragraphs minus 1
  const codes = { length: paragraphsWithoutCode.length - 1 };

  const re = /\s+|\n/;
  const words = paragraphsWithoutCode.join(' ').trim().split(re);

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

export function howManyMinsReadForImage(num: number) {
  /*
    the 1st image adds 12 s
    the 2nd image +11 s
    the 3rd image +10 s, etc. up to the 10th image
    any images after the 10th one are counted as +3 s
   */
  if (num <= 0) {
    return 0;
  }
  const f = (x: number) => 12 - x;
  const delta = -1;
  const sum = (n: number) => ((f(0) + f(n)) / 2) * ((f(n) - f(0)) / delta + 1);
  if (num < 11) {
    return sum(num - 1);
  } else {
    return sum(9) + (num - 10) * 3;
  }
}
export function howManyMinsRead(content: string) {
  const result = countWords(content);
  // 30s for code block
  const seconds4code = (result.codes || 0) * 60;
  const seconds4image = howManyMinsReadForImage(result.images || 0);
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

export function debounce<T>(fn: (...args: T[]) => Promise<void> | void, durationInSec: number) {
  let lastCalledAt: number | null;
  return (...args: T[]) => {
    if (!lastCalledAt || Date.now() > lastCalledAt * 1000 + durationInSec * 1000) {
      lastCalledAt = Math.floor(Date.now() / 1000);
      return fn(...args);
    }
    return;
  };
}
