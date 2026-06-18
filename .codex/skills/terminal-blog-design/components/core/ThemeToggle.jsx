import React from 'react';

/**
 * ThemeToggle — flips [data-theme] between dark and light on a target
 * element (document root by default). Square segmented mono control.
 */
export function ThemeToggle({
  target = null,         // DOM element; defaults to documentElement
  initial = 'dark',
  onChange = null,
  style = {},
  ...rest
}) {
  const [theme, setTheme] = React.useState(initial);

  const apply = (t) => {
    const el = target || (typeof document !== 'undefined' ? document.documentElement : null);
    if (el) {
      if (t === 'light') el.setAttribute('data-theme', 'light');
      else el.removeAttribute('data-theme');
    }
    setTheme(t);
    onChange && onChange(t);
  };

  const opt = (t, label) => {
    const on = theme === t;
    return (
      <button
        key={t}
        onClick={() => apply(t)}
        style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase',
          padding: '5px 10px', border: 'none', cursor: 'pointer',
          background: on ? 'var(--accent)' : 'transparent',
          color: on ? 'var(--accent-contrast)' : 'var(--text-muted)',
          transition: 'background var(--duration-fast) var(--ease-snap), color var(--duration-fast) var(--ease-snap)',
        }}
      >{label}</button>
    );
  };

  return (
    <div
      style={{
        display: 'inline-flex', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', overflow: 'hidden', ...style,
      }}
      {...rest}
    >
      {opt('dark', 'dark')}
      {opt('light', 'light')}
    </div>
  );
}
