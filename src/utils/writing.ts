import type { CollectionEntry } from 'astro:content';

export type WritingPost = CollectionEntry<'writing'>;

export interface TagSummary {
	name: string;
	slug: string;
	count: number;
}

export function getPublishedWriting(posts: WritingPost[]) {
	return posts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date) {
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');

	return `${year} · ${month} · ${day}`;
}

export function dateISOString(date: Date) {
	return date.toISOString().slice(0, 10);
}

export function getReadingTime(post: WritingPost) {
	if (post.data.readingTime) {
		return post.data.readingTime;
	}

	const body = 'body' in post ? String((post as { body?: string }).body ?? '') : '';
	const words = body.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.ceil(words / 220));

	return `${minutes} min`;
}

export function getPostNumber(index: number) {
	return String(index + 1).padStart(2, '0');
}

export function slugifyTag(tag: string) {
	return tag
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function getTagHref(tag: string) {
	return `/tags/${slugifyTag(tag)}/`;
}

export function getAllTags(posts: WritingPost[]): TagSummary[] {
	const counts = new Map<string, number>();

	for (const post of posts) {
		for (const tag of post.data.tags) {
			counts.set(tag, (counts.get(tag) ?? 0) + 1);
		}
	}

	return Array.from(counts, ([name, count]) => ({ name, slug: slugifyTag(name), count })).sort(
		(a, b) => a.name.localeCompare(b.name),
	);
}

export function getPostsForTag(posts: WritingPost[], tag: string) {
	const slug = slugifyTag(tag);

	return posts.filter((post) => post.data.tags.some((postTag) => slugifyTag(postTag) === slug));
}
