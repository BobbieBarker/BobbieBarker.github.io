import React from 'react';

/**
 * Tag — bordered, uppercase topic label (elixir, otp, llm…).
 * Optional count suffix and clickable/active states for filtering.
 */
export function Tag({
  children,
  count = null,
  active = false,
  as = 'span',
  size = 'md',     // 'sm' | 'md'
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = as === 'a' || as === 'button' || !!rest.onClick;

  const sizes = {
    sm: { fontSize: '10px', padding: '2px 7px', gap: '6px' },
    md: { fontSize: 'var(--text-xs)', padding: '3px 9px', gap: '7px' },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    border: '1px solid',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
    background: active ? 'var(--accent-wash)' : 'transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: clickable ? 'pointer' : 'default',
    lineHeight: 1,
    transition: 'color var(--duration-fast) var(--ease-snap), border-color var(--duration-fast) var(--ease-snap), background var(--duration-fast) var(--ease-snap)',
    ...(clickable && hover && !active ? { borderColor: 'var(--border-strong)', color: 'var(--text)' } : {}),
    ...sizes[size],
    ...style,
  };

  const Tag = as;
  return (
    <Tag
      style={base}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {children}
      {count != null && (
        <span style={{ color: 'var(--text-muted)', fontWeight: 'var(--weight-regular)' }}>
          {count}
        </span>
      )}
    </Tag>
  );
}
