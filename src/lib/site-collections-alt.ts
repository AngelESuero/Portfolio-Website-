import { getCollection, type CollectionEntry } from 'astro:content';

let entriesPromise: Promise<CollectionEntry<'entries'>[]> | null = null;
let postsPromise: Promise<CollectionEntry<'posts'>[]> | null = null;
let projectsPromise: Promise<CollectionEntry<'projects'>[]> | null = null;

export const getAllEntries = () => (entriesPromise ??= getCollection('entries'));
export const getAllPosts = () => (postsPromise ??= getCollection('posts'));
export const getAllProjects = () => (projectsPromise ??= getCollection('projects'));
