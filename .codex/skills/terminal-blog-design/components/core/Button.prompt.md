Primary action control — square, uppercase mono label; use the orange `primary` fill for the single most important action on a view, everything else `secondary` or `ghost`.

```jsx
<Button variant="primary" onClick={subscribe}>Subscribe</Button>
<Button variant="secondary" iconLeft={<span>↗</span>}>View source</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

Variants: `primary` (orange fill + 2px hard shadow that collapses on press), `secondary` (bright bordered), `ghost` (text-only), `danger` (red outline → fill on hover). Sizes `sm | md | lg`. Pass `as="a"` + `href` for link buttons. One primary per view.
