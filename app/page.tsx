import Link from 'next/link';
import { getMarkdownData } from '@/app/lib/data';

export default async function Home() {
  const posts = await getMarkdownData('posts/');

  console.log('posts %j', posts);

  return (
    <>
      {posts.map((post, i) => (
        <article key={i}>
          <Link href={`/blog/${post.slug}`}>
            <h3>{post.title}</h3>
          </Link>
          <span>{post.date}</span>
        </article>
      ))}
    </>
  );
}
