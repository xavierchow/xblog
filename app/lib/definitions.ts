export type FrontMatter = {
  title: string;
  date: string;
  tags?: string[];
  cover?: string;
  description?: string;
};
export type Post = {
  slug: string;
  content: string;
} & FrontMatter;
