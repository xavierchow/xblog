import Link from 'next/link';
import Image from 'next/image';
type PostMeta = {
  url: string;
  title: string;
  date: string;
  tags?: string[];
};
export default function Card({ url, title, date, tags }: PostMeta) {
  return (
    <div className="p-4">
      <Link href={url}>
        <div className="bg-[#2D2D2D] rounded-xl overflow-hidden flex-shrink-0 mb-4 items-center justify-center flex aspect-video w-full">
          <Image src="/lake.jpg" alt={`blog post image`} className="w-full rounded-md" width={360} height={100} />
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="opacity-60">{date}</div>
          <div className="opacity-60">{tags && tags.map((t) => `#${t}`).join(' ')} </div>
        </div>
        <div className="text-3xl my-4">{title}</div>
        Placeholder
      </Link>
    </div>
  );
}
