Small status pill with a glowing leading dot — use for build/CI state, draft/published flags, or any short status. Distinct from `Tag` (which is for topics/filters).

```jsx
<Badge tone="success">passing</Badge>
<Badge tone="warning">draft</Badge>
<Badge tone="neutral" dot={false}>v2.3.1</Badge>
```

Tones: `neutral | accent | success | warning | danger | info`. Pill-shaped (the only rounded primitive). Set `dot={false}` for version/label badges.
