import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/app/lib/definitions';
import { parseImageSrc } from '@/app/lib/utils';
type PostMeta = Partial<Post>;

export default function Card({ slug, title, date, tags, cover, description }: PostMeta) {
  return (
    <div className="p-4">
      <Link href={`/posts/${slug}`}>
        <div className="bg-[#2D2D2D] rounded-xl overflow-hidden flex-shrink-0 mb-4 items-center justify-center flex aspect-video w-full">
          <Image
            src={parseImageSrc(cover)}
            alt={`the cover image of blog post ${title}`}
            className="w-full rounded-md"
            width={360}
            height={100}
          />
        </div>
        <div className="flex flex-row items-center gap-3">
          <span className="opacity-60 whitespace-nowrap">{date}</span>
          <div className="opacity-60">{tags && tags.map((t) => `#${t}`).join(' ')} </div>
        </div>
        <div className="text-2xl md:text-3xl mt-2 mb-6">{title}</div>
        <div className="opacity-60 mb-4 text-[16px]">{description}</div>
      </Link>
      <div className="w-full flex justify-start opacity-50">
        <hr className="w-4/6 md:hidden" />
      </div>
    </div>
  );
}
