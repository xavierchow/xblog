import Card from '@/app/components/card';
import { getMarkdownData } from '@/app/lib/data';

export default async function Home() {
  const posts = await getMarkdownData('posts/');

  console.log('posts %j', posts);

  return (
    <main className="flex flex-col lg:items-center justify-between">
      <div className="container mx-auto">
        <div className="px-4 md:py-4 pb-0 2xl:px-24 2xl:py-4  mt-32">
          <div className="flex flex-row flex-wrap justify-start server-side-hits pt-4">
            {posts.map((post, i) => (
              <div key={i} className="w-full md:w-1/2 lg:w-1/3">
                <Card url={`/blog/${post.slug}`} date={post.date || ''} title={post.title || ''} tags={post.tags} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
