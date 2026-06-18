import React from 'react';

/**
 * Badge — small status pill with a leading dot.
 * For build status, post state, semantic flags.
 */
export function Badge({
  children,
  tone = 'neutral',   // 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  dot = true,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: 'var(--text-secondary)',
    accent:  'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger:  'var(--danger)',
    info:    'var(--info)',
  };
  const c = tones[tone] || tones.neutral;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        color: c,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-pill)',
        padding: '3px 10px 3px 8px',
        lineHeight: 1,
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: c, boxShadow: `0 0 6px ${c}`, flex: 'none',
        }} />
      )}
      {children}
    </span>
  );
}
