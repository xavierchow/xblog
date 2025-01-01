import Image from 'next/image';
import Markdown from 'react-markdown';
import { getMarkdownContent } from '@/app/lib/data';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { howManyMinsRead } from '@/app/lib/utils';
import remarkGfm from 'remark-gfm';

const MARKDOWN_FOLDER = process.env.MARKDOWN_FOLDER || '_posts/';
export default async function Page(props: { params: Promise<{ slug: string }> }) {
  const folder = MARKDOWN_FOLDER;
  const slug = (await props.params).slug;
  const post = await getMarkdownContent(folder, slug);
  const postParams = post.data;
  const minutesToRead = howManyMinsRead(post.content);
  const proseClassNames =
    'prose prose-sm md:prose-base lg:prose-xl prose-invert prose-a:text-[#7cd1ed] prose-p:opacity-90 prose-code:before:content-none prose-code:after:content-none';
  return (
    <main>
      <div className={`container mx-auto ${proseClassNames}`}>
        <div className="bg-[#2D2D2D] rounded-xl aspect-video w-full overflow-hidden flex-shrink-0 mb-4 items-center justify-center flex relative border border-[#1c1c1c]">
          <Image
            src={postParams.cover || '/coding.png'}
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
      </div>
    </main>
  );
}
