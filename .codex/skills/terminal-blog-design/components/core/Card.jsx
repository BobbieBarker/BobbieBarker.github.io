import React from 'react';

/**
 * Card — bordered surface. The brutalist default is a flat hairline
 * box; `raised` adds the hard offset shadow; `interactive` lifts on hover.
 */
export function Card({
  children,
  variant = 'flat',     // 'flat' | 'raised' | 'interactive'
  as = 'div',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);

  const base = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    transition: 'transform var(--duration-base) var(--ease-snap), box-shadow var(--duration-base) var(--ease-snap), border-color var(--duration-base) var(--ease-snap)',
  };

  const variants = {
    flat: {},
    raised: { boxShadow: 'var(--shadow-hard)', borderColor: 'var(--border-strong)' },
    interactive: {
      cursor: 'pointer',
      ...(hover ? {
        borderColor: 'var(--border-strong)',
        transform: 'translate(-2px, -2px)',
        boxShadow: '4px 4px 0 0 var(--accent)',
      } : {}),
    },
  };

  const Tag = as;
  return (
    <Tag
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
