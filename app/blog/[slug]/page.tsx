import Markdown from "react-markdown";
import { getMarkdownContent } from "@/app/lib/data";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

export default async function Page(props: {
    params: Promise<{ slug: string }>;
}) {
    const folder = "posts/";
    const slug = (await props.params).slug;
    const post = await getMarkdownContent(folder, slug);
    const postParams = post.data;
    const proseClassNames =
        "prose prose-sm md:prose-base lg:prose-xl prose-invert prose-a:text-[#7cd1ed] prose-p:opacity-90 prose-code:before:content-none prose-code:after:content-none";
    return (
        <main>
            <div className={`container mx-auto ${proseClassNames}`}>
                <div className="md:px-4 md:py-4 pb-0 2xl:px-24 2xl:py-4">
                    <div className="w-full px-2">
                        <div className="transition-all translate-y-0 opacity-100">
                            <h2 className="text-center lg:text-center text-white  leading-[40px] text-[32px] lg:leading-[64px] lg:text-[56px]">
                                {postParams.title}
                            </h2>
                        </div>
                        <Markdown
                            className="mt-5 flex flex-col items-center md:items-start"
                            remarkPlugins={[remarkGfm]}
                            components={{
                                pre(props) {
                                    // for the code block span the full width
                                    return <figure className="w-full" {...props} />;
                                },
                                code(props) {
                                    const { children, className, node, ...rest } = props;
                                    const match = /language-(\w+)/.exec(className || "");
                                    return match ? (
                                        <div className="syntax-highlighter-container">
                                            <SyntaxHighlighter
                                                {...rest}
                                                PreTag="div"
                                                wrapLines={false}
                                                children={String(children).replace(/\n$/, "")}
                                                language={match[1]}
                                                style={gruvboxDark}
                                            />
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
