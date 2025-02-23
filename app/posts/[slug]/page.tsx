import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Markdown from 'react-markdown';
import Script from 'next/script';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getMarkdownContent, getCachedMarkdownData } from '@/app/lib/data';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { howManyMinsRead, parseImageSrc, getMarkdownFilesFolder } from '@/app/lib/utils';
import remarkGfm from 'remark-gfm';
import refreshTrigger from '@/app/lib/refresh-beacon';
const host = process.env.APP_HOST || 'https://xavierz.dev';
const basePath = process.env.APP_BASEPATH || '/blog';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const folder = getMarkdownFilesFolder();
  const slug = (await props.params).slug;
  const { data } = await getMarkdownContent(folder, slug);
  return {
    title: data.title,
    description: data.description || data.title,
    keywords: data.tags || [],
    authors: [{ name: 'xavier zhou', url: 'https://github.com/xavierchow' }],
    metadataBase: new URL('https://xavierz.dev'),
    alternates: {
      canonical: `${basePath}/posts/${slug}`,
    },
    openGraph: {
      images: parseImageSrc(data.cover),
      url: `${basePath}/posts/${slug}`,
      siteName: `Xavier's blog`,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      siteId: '@xavierzhou',
      creator: '@xavierzhou',
      images: [parseImageSrc(data.cover)],
    },
  };
}

export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const folder = getMarkdownFilesFolder();
  const slug = (await props.params).slug;
  const post = await getMarkdownContent(folder, slug);
  refreshTrigger();
  const postParams = post.data;
  const minutesToRead = howManyMinsRead(post.content);

  const posts = await getCachedMarkdownData(folder);
  const curIndex = posts.findIndex((p) => p.slug === slug);
  const previousPost = curIndex > 0 && posts[curIndex - 1];
  const nextPost = curIndex < posts.length - 1 && posts[curIndex + 1];

  const proseClassNames =
    'prose prose-sm md:prose-base lg:prose-xl prose-invert prose-a:text-[#7cd1ed] prose-p:opacity-90 prose-code:before:content-none prose-code:after:content-none';
  return (
    <main>
      <div className={`container mx-auto ${proseClassNames} px-2`}>
        <div className="bg-[#2D2D2D] rounded-xl aspect-video w-full overflow-hidden flex-shrink-0 mb-4 items-center justify-center flex relative border border-[#1c1c1c]">
          <Image
            src={parseImageSrc(postParams.cover)}
            alt={`the cover image of blog post ${postParams.title}`}
            className="w-full rounded-md"
            width={360}
            height={100}
          />
        </div>

        <div className="md:px-4 md:py-4 pb-0 2xl:py-4">
          <div className="w-full px-2">
            <div className="transition-all translate-y-0 opacity-100">
              <h2 className="text-center lg:text-center text-white  leading-[40px] text-[32px] lg:leading-[64px] lg:text-[56px]">
                {postParams.title}
              </h2>
            </div>
            <div className="flex flex-row justify-center items-center gap-3">
              <div className="opacity-60">{postParams.date}</div>
              <div className="opacity-60">{minutesToRead} min read</div>
            </div>
            <Markdown
              className="mt-5 flex flex-col items-center md:items-start"
              remarkPlugins={[remarkGfm]}
              components={{
                pre(props) {
                  // for the code block span the full width TODO line wrap
                  return <figure className="w-full" {...props} />;
                },
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <div className="syntax-highlighter-container">
                      <SyntaxHighlighter
                        {...rest}
                        PreTag="div"
                        wrapLines={false}
                        language={match[1]}
                        style={gruvboxDark}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code {...rest} className={className}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </Markdown>
          </div>
        </div>
        <div className="w-full md:px-4 md:py-4 flex flex-row justify-between">
          <Link href={`/posts/${previousPost && previousPost.slug}`} className="text-sm md:text-base">
            {previousPost && (
              <>
                <ChevronLeftIcon className="w-6 inline" />
                {previousPost.title}
              </>
            )}
          </Link>
          <Link href={`/posts/${nextPost && nextPost.slug}`} className="text-sm md:text-base">
            {nextPost && (
              <>
                {nextPost.title}
                <ChevronRightIcon className="w-6 inline" />
              </>
            )}
          </Link>
        </div>

        <div id="disqus_thread"></div>
      </div>
      <Script
        id="disqus_init_config"
        strategy="beforeInteractive"
      >{`var disqus_config = function () {this.page.title = '${postParams.title}'; this.page.url = '${host}${basePath}/posts/${slug}'; this.page.identifier = 'post/${slug}';}`}</Script>
      <Script src="https://xblog-7.disqus.com/embed.js" data-timestamp={+new Date()} />
    </main>
  );
}
