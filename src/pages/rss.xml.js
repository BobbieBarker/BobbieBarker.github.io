import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPublishedWriting, getReadingTime } from '../utils/writing';

export async function GET(context) {
	const posts = getPublishedWriting(await getCollection('writing'));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.excerpt,
			pubDate: post.data.date,
			customData: `<readingTime>${getReadingTime(post)}</readingTime>`,
			link: `/writing/${post.id}/`,
		})),
	});
}
