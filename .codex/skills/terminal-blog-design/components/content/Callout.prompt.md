Inline aside for article prose — a left accent bar, an ASCII marker (`//`, `>>`, `!!`) and an uppercase label. Use inside `.prose` to flag notes, tips, gotchas.

```jsx
<Callout tone="warning">
  This assumes a single BEAM node. Across a cluster, reconciliation is not free.
</Callout>
<Callout tone="tip" title="Field note">Reach for <code>recon</code> first.</Callout>
```

Tones: `note` (blue) · `tip` (green) · `warning` (amber) · `danger` (red). Override the label with `title`.
