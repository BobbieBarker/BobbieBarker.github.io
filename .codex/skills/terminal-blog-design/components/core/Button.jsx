import React from 'react';

/**
 * Button — the primary action primitive.
 * Brutalist: square corners, hard offset shadow on the primary fill,
 * press translates the button into its own shadow.
 */
export function Button({
  children,
  variant = 'primary',   // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',           // 'sm' | 'md' | 'lg'
  as = 'button',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 'var(--text-xs)', gap: '6px' },
    md: { padding: '9px 18px', fontSize: 'var(--text-sm)', gap: '8px' },
    lg: { padding: '13px 26px', fontSize: 'var(--text-body)', gap: '10px' },
  };

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontWeight: 'var(--weight-medium)',
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    lineHeight: 1,
    border: '1px solid transparent',
    borderRadius: 'var(--radius-sm)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'transform var(--duration-fast) var(--ease-snap), background var(--duration-fast) var(--ease-snap), border-color var(--duration-fast) var(--ease-snap), box-shadow var(--duration-fast) var(--ease-snap)',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    ...sizes[size],
  };

  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--accent-contrast)',
      borderColor: 'var(--accent)',
      boxShadow: '2px 2px 0 0 var(--border-strong)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text)',
      borderColor: 'var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent',
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      borderColor: 'var(--danger)',
    },
  };

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const hoverStyle = !disabled && hover ? {
    primary:   { background: 'var(--accent-hover)', borderColor: 'var(--accent-hover)' },
    secondary: { background: 'var(--surface-hover)' },
    ghost:     { color: 'var(--text)', background: 'var(--surface-hover)' },
    danger:    { background: 'var(--danger)', color: 'var(--accent-contrast)' },
  }[variant] : {};

  const activeStyle = !disabled && active ? (
    variant === 'primary'
      ? { transform: 'translate(2px, 2px)', boxShadow: '0 0 0 0 var(--border-strong)' }
      : { transform: 'translate(1px, 1px)' }
  ) : {};

  const Tag = as;
  return (
    <Tag
      style={{ ...base, ...variants[variant], ...hoverStyle, ...activeStyle, ...style }}
      disabled={as === 'button' ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </Tag>
  );
}
