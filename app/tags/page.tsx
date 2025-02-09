import * as R from 'ramda';
import { NetworkDiagram } from '@/app/tags/network';
import { getCachedMarkdownData } from '@/app/lib/data';
import { getMarkdownFilesFolder } from '@/app/lib/utils';

export default async function Page() {
  const folder = getMarkdownFilesFolder();
  const rawPosts = await getCachedMarkdownData(folder);
  const posts = R.map(R.pick(['slug', 'title', 'tags']), rawPosts);

  console.log('posts %o', posts);
  const nested = R.map((p) => {
    return R.map((t) => ({ slug: p.slug, title: p.title, tag: t }), p.tags || []);
  }, posts);
  const flatten = R.flatten(nested);

  const groupByTags = R.groupBy(R.prop('tag'), flatten);

  const nodesTags = R.map((k) => {
    return { id: k, label: k, group: 'tag', weight: groupByTags[k]?.length || 1 };
  }, R.keys(groupByTags));
  const MAX_CHAR = 18;
  const nodeArticles = R.map((p) => {
    return {
      id: p.slug,
      label: p.title.length > MAX_CHAR ? p.title.slice(0, MAX_CHAR) + '...' : p.title,
      group: 'article',
      weight: p.tags?.length || 1,
    };
  }, posts);
  const nodes = R.concat(nodesTags, nodeArticles);
  //console.log('nodes %o', nodes);
  const links = R.map((p) => {
    return { source: p.slug, target: p.tag };
  }, flatten);
  //console.log('links %o', links);
  return (
    <div className="m-auto flex justify-center">
      <NetworkDiagram width={1536} height={1536} data={{ nodes, links }}></NetworkDiagram>
    </div>
  );
}
