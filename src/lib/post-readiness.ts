import type { CollectionEntry } from 'astro:content';

const AUTO_READY_MIN_BODY_CHARS = 140;

const toBodyText = (body: string) =>
  body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getPostBodyText = (post: CollectionEntry<'posts'>) => toBodyText(post.body ?? '');

export const isPostReady = (post: CollectionEntry<'posts'>) => {
  if (post.data.ready === false) return false;
  if (post.data.ready === true) return true;
  return getPostBodyText(post).length >= AUTO_READY_MIN_BODY_CHARS;
};
