Bordered surface container — square corners, hairline border, no inner padding (you set it). Use `interactive` for clickable post cards.

```jsx
<Card style={{ padding: 'var(--space-5)' }}>…</Card>
<Card variant="raised" style={{ padding: 'var(--space-6)' }}>callout box</Card>
<Card variant="interactive" as="a" href="/post/1">featured post</Card>
```

`flat` (default) · `raised` (hard offset shadow) · `interactive` (translates up toward an orange hard shadow on hover). Pad it yourself with `--space-*`.
