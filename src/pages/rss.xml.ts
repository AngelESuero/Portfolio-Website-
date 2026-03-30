import rss from '@astrojs/rss';
import { getAllPosts } from '../lib/site-collections';
import { getContentVoiceExcerpt } from '../lib/content-excerpts';

export async function GET(context) {
  const posts = await getAllPosts();
  return rss({
    title: 'a_e.s_ Writing Feed',
    description: 'Writing and archive notes by a_e.s_',
    site: context.site || 'https://portfolio-website-9c9.pages.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: getContentVoiceExcerpt(post, 180),
      link: `/writing/${post.slug}/`
    }))
  });
}
