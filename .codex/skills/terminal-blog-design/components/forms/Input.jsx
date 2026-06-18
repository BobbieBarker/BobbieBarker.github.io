import React from 'react';

/**
 * Input — square text field with an uppercase label and optional
 * mono prefix (e.g. a `$` or `~/`). Brutalist focus = orange ring.
 */
export function Input({
  label = null,
  prefix = null,
  hint = null,
  error = null,
  id,
  style = {},
  containerStyle = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId ? React.useId() : 'in';
  const fieldId = id || reactId;
  const borderColor = error ? 'var(--danger)' : focus ? 'var(--accent)' : 'var(--border)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', ...containerStyle }}>
      {label && (
        <label htmlFor={fieldId} style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          letterSpacing: 'var(--tracking-wider)', textTransform: 'uppercase', color: 'var(--text-secondary)',
        }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-sunken)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-sm)',
        boxShadow: focus && !error ? '0 0 0 3px var(--accent-wash)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-snap), box-shadow var(--duration-fast) var(--ease-snap)',
      }}>
        {prefix && (
          <span style={{
            paddingLeft: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-body)', userSelect: 'none',
          }}>{prefix}</span>
        )}
        <input
          id={fieldId}
          onFocus={(e) => { setFocus(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: 'var(--text)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body)',
            padding: '10px 12px', paddingLeft: prefix ? '6px' : '12px',
            width: '100%', ...style,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: error ? 'var(--danger)' : 'var(--text-muted)',
        }}>{error || hint}</span>
      )}
    </div>
  );
}
