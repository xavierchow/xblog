import Card from '@/app/components/card';
import { getMarkdownData } from '@/app/lib/data';
import { unstable_cache } from 'next/cache';
const MARKDOWN_FOLDER = process.env.MARKDOWN_FOLDER || 'posts/';

export default async function Home() {
  const getCachedMarkdownData = unstable_cache(
    async () => {
      return getMarkdownData(MARKDOWN_FOLDER);
    },
    [],
    {
      tags: ['/blogs'],
      revalidate: 60,
    }
  );
  const rawPosts = await getCachedMarkdownData();

  const posts = rawPosts.sort((a, b) => {
    // descending
    return a.date > b.date ? -1 : 1;
  });

  console.log(
    'posts meta %o',
    posts.map((p) => {
      return { slug: p.slug, title: p.title, date: p.date, tags: p.tags };
    })
  );

  return (
    <main className="flex flex-col lg:items-center justify-between">
      <div className="container mx-auto">
        <div className="px-4 md:py-4 pb-0 2xl:px-24 2xl:py-4  mt-32">
          <div className="flex flex-row flex-wrap justify-start server-side-hits pt-4">
            {posts.map((post, i) => (
              <div key={i} className="w-full md:w-1/2 lg:w-1/3">
                <Card
                  slug={post.slug}
                  date={post.date}
                  title={post.title}
                  tags={post.tags}
                  cover={post.cover}
                  description={post.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}