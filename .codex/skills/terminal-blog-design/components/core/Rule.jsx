import React from 'react';

/**
 * Rule — horizontal divider. Plain hairline, or an ASCII-style dashed
 * rule, optionally with a centered/leading uppercase label.
 */
export function Rule({
  label = null,
  variant = 'solid',   // 'solid' | 'dashed' | 'ascii'
  align = 'center',    // 'center' | 'start'
  style = {},
  ...rest
}) {
  const lineFor = {
    solid:  { borderTop: '1px solid var(--border)' },
    dashed: { borderTop: '1px dashed var(--line-2)' },
    ascii:  null,
  };

  const asciiLine = (
    <span style={{
      color: 'var(--line-2)', fontFamily: 'var(--font-mono)', fontSize: '11px',
      letterSpacing: '0.05em', overflow: 'hidden', whiteSpace: 'nowrap', flex: 1,
      userSelect: 'none',
    }}>
      {'────────────────────────────────────────────────────────────────────────'}
    </span>
  );

  const lineEl = variant === 'ascii'
    ? asciiLine
    : <span style={{ flex: 1, ...lineFor[variant] }} />;

  if (!label) {
    return variant === 'ascii'
      ? <div style={{ display: 'flex', overflow: 'hidden', ...style }} {...rest}>{asciiLine}</div>
      : <hr style={{ border: 'none', ...lineFor[variant], margin: 0, ...style }} {...rest} />;
  }

  const labelEl = (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)', letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase', color: 'var(--text-muted)', flex: 'none',
    }}>
      {label}
    </span>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', ...style }} {...rest}>
      {align === 'center' && lineEl}
      {labelEl}
      {lineEl}
    </div>
  );
}
