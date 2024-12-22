import Markdown from "react-markdown";
import { getMarkdownContent } from "@/app/lib/data";

export default async function Page(props: {
    params: Promise<{ slug: string }>;
}) {
    const folder = "posts/";
    const slug = (await props.params).slug;
    const post = await getMarkdownContent(folder, slug);
    const postParams = post.data;
    return (
        <main>
            <div className="container mx-auto prose prose-invert">
                <div className="md:px-4 md:py-4 pb-0 2xl:px-24 2xl:py-4">
                    <div className="w-full px-2">
                        <div className="transition-all translate-y-0 opacity-100">
                            <section className="blog-details">
                                <h2 className="text-center lg:text-center text-white  leading-[40px] text-[32px] lg:leading-[64px] lg:text-[56px]">
                                    {postParams.title}
                                </h2>
                                <Markdown className="mt-5 flex flex-col items-center md:items-start">
                                    {post.content}
                                </Markdown>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
