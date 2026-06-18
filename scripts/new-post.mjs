import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dryRunIndex = args.indexOf('--dry-run');
const dryRun = dryRunIndex !== -1;

if (dryRun) {
	args.splice(dryRunIndex, 1);
}

const title = args.join(' ').trim();

if (!title) {
	console.error('Usage: bin/blog new "Article title"');
	process.exit(1);
}

const slug = title
	.toLowerCase()
	.normalize('NFKD')
	.replace(/[\u0300-\u036f]/g, '')
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '');

if (!slug) {
	console.error('Could not create a URL slug from that title.');
	process.exit(1);
}

const now = new Date();
const today = [
	now.getFullYear(),
	String(now.getMonth() + 1).padStart(2, '0'),
	String(now.getDate()).padStart(2, '0'),
].join('-');
const postsDir = path.join(process.cwd(), 'src', 'content', 'writing');
const postPath = path.join(postsDir, `${slug}.md`);

if (existsSync(postPath)) {
	console.error(`Article already exists: ${path.relative(process.cwd(), postPath)}`);
	process.exit(1);
}

const yamlTitle = title.replaceAll("'", "''");
const content = `---
title: '${yamlTitle}'
date: '${today}'
excerpt: ''
tags: []
draft: true
---

`;

if (dryRun) {
	console.log(`Would create ${path.relative(process.cwd(), postPath)}`);
	console.log(content);
	process.exit(0);
}

mkdirSync(postsDir, { recursive: true });
writeFileSync(postPath, content, 'utf8');

console.log(`Created ${path.relative(process.cwd(), postPath)}`);
