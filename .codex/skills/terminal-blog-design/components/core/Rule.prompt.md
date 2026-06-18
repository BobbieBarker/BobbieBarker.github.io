Section divider — a plain hairline, a dashed line, or an ASCII box-drawing rule. Add a `label` to set an uppercase section marker into it.

```jsx
<Rule />
<Rule variant="ascii" />
<Rule label="recent" align="start" />
<Rule label="2025" variant="dashed" />
```

`align="start"` pins the label left (archive year headers); `center` floats it between two lines.
