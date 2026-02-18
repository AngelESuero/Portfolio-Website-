import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  return rss({
    title: 'a_e.s_ Writing Feed',
    description: 'Writing and archive notes by a_e.s_',
    site: context.site || 'https://portfolio-website-9c9.pages.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.summary,
      link: `/writing/${post.slug}/`
    }))
  });
}
