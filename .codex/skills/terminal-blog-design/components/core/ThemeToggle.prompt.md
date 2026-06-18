Segmented dark/light control. Sets `[data-theme="light"]` on the document root (dark = attribute removed), so the whole token system flips. Drop it in a header.

```jsx
<ThemeToggle initial="dark" />
```

Dark is the brand default — keep `initial="dark"` unless a surface is explicitly light-first.
