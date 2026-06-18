import React from 'react';

/**
 * Callout — an aside box for notes, warnings and tips. Left accent bar,
 * uppercase label, no rounded fluff.
 */
const PRESET = {
  note:    { c: 'var(--info)',    label: 'NOTE',    mark: '//' },
  tip:     { c: 'var(--success)', label: 'TIP',     mark: '>>' },
  warning: { c: 'var(--warning)', label: 'WARNING', mark: '!!' },
  danger:  { c: 'var(--danger)',  label: 'DANGER',  mark: '!!' },
};

export function Callout({
  children,
  tone = 'note',     // 'note' | 'tip' | 'warning' | 'danger'
  title = null,
  style = {},
  ...rest
}) {
  const p = PRESET[tone] || PRESET.note;
  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        background: 'var(--surface)',
        borderLeft: `2px solid ${p.c}`,
        border: '1px solid var(--border)',
        borderLeftWidth: '2px',
        borderLeftColor: p.c,
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--space-4) var(--space-5)',
        ...style,
      }}
      {...rest}
    >
      <span style={{
        color: p.c, fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-sm)', flex: 'none', userSelect: 'none', lineHeight: 'var(--leading-relaxed)',
      }}>{p.mark}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{
          color: p.c, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          fontWeight: 'var(--weight-bold)', letterSpacing: 'var(--tracking-wider)',
          textTransform: 'uppercase', marginBottom: '6px',
        }}>{title || p.label}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-normal)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
