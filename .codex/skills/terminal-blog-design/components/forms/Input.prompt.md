Square text field with an uppercase mono label and orange focus ring; used for the newsletter signup and search. Supports a static `prefix` and `error` state.

```jsx
<Input label="Email" type="email" placeholder="you@host.dev" />
<Input label="Search" prefix="/" placeholder="grep the archive…" />
<Input label="Email" error="that doesn't look like an email" defaultValue="nope" />
```

Sunken background, hairline border that turns orange on focus (red on `error`). Pass `containerStyle` to size the wrapper.
