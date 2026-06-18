The hero element of the brand — a dark terminal code surface with a filename header, line numbers, copy button and built-in highlighting (tuned for Elixir, fine for JS/shell). Code blocks stay dark in both light and dark themes.

```jsx
<CodeBlock
  filename="lib/cluster/partition.ex"
  language="elixir"
  highlightLines={[2]}
  code={`def handle_partition(state) do
  {:reconcile, merge(state.crdt)}
end`}
/>
```

Pass raw source as `code`; never pre-wrap in markup. `highlightLines` takes 1-based numbers. Highlighter colors comments, strings, `:atoms`, `@attrs`, keywords, `Modules`, numbers and `fn(` calls via the `--syntax-*` tokens.
