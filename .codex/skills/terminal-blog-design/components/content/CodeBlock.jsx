import React from 'react';

/* ---- tiny, dependency-free highlighter ----
   Good enough for Elixir / JS / shell specimens. Token order matters. */
const TOKEN_RE = new RegExp([
  '(?<comment>#[^\\n]*|\\/\\/[^\\n]*)',
  '(?<string>"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)',
  '(?<atom>:[a-zA-Z_]\\w*[?!]?)',
  '(?<attr>@[a-zA-Z_]\\w*)',
  '(?<keyword>\\b(?:defmodule|defstruct|defp|def|do|end|fn|if|else|elsif|case|cond|when|import|alias|require|use|with|receive|after|try|rescue|raise|throw|catch|const|let|var|function|return|async|await|class|new|for|while|export|default|from|yield|true|false|nil|null|undefined)\\b)',
  '(?<builtin>\\b[A-Z][A-Za-z0-9_]*\\b)',
  '(?<number>\\b\\d[\\d_]*\\.?\\d*\\b)',
  '(?<fn>\\b[a-z_]\\w*[?!]?(?=\\())',
].join('|'), 'g');

const COLORS = {
  comment: 'var(--syntax-comment)',
  string:  'var(--syntax-string)',
  atom:    'var(--syntax-atom)',
  attr:    'var(--syntax-atom)',
  keyword: 'var(--syntax-keyword)',
  builtin: 'var(--syntax-builtin)',
  number:  'var(--syntax-number)',
  fn:      'var(--syntax-function)',
};

function highlight(line) {
  const out = [];
  let last = 0, m, i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) out.push(<span key={i++}>{line.slice(last, m.index)}</span>);
    const kind = Object.keys(m.groups).find((k) => m.groups[k] != null);
    out.push(<span key={i++} style={{ color: COLORS[kind] }}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(<span key={i++}>{line.slice(last)}</span>);
  return out.length ? out : [<span key="0">{'\u200b'}</span>];
}

/**
 * CodeBlock — the hero element of the system. A dark terminal surface
 * with a filename/language header, line numbers, and copy button.
 */
export function CodeBlock({
  code = '',
  language = 'elixir',
  filename = null,
  showLineNumbers = true,
  highlightLines = [],
  style = {},
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, '').split('\n');

  const copy = () => {
    try { navigator.clipboard.writeText(code); } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      style={{
        background: 'var(--code-bg)',
        border: '1px solid var(--code-border)',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-code)',
        fontSize: 'var(--text-code)',
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', borderBottom: '1px solid var(--code-border)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span style={{ display: 'flex', gap: '6px', flex: 'none' }}>
            {['#3a3a3a', '#3a3a3a', '#3a3a3a'].map((c, i) => (
              <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
          </span>
          {filename && (
            <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {filename}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 'none' }}>
          <span style={{
            color: 'var(--text-muted)', fontSize: '10px', letterSpacing: 'var(--tracking-wider)',
            textTransform: 'uppercase',
          }}>{language}</span>
          <button
            onClick={copy}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              color: copied ? 'var(--success)' : 'var(--text-muted)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase', transition: 'color var(--duration-fast) var(--ease-snap)',
            }}
          >{copied ? '✓ copied' : 'copy'}</button>
        </div>
      </div>

      <pre style={{ margin: 0, padding: '14px 0', overflowX: 'auto', lineHeight: 'var(--leading-code)' }}>
        <code style={{ display: 'block', minWidth: 'fit-content' }}>
          {lines.map((line, idx) => {
            const n = idx + 1;
            const hot = highlightLines.includes(n);
            return (
              <div key={idx} style={{
                display: 'flex',
                background: hot ? 'var(--accent-wash)' : 'transparent',
                boxShadow: hot ? 'inset 2px 0 0 0 var(--accent)' : 'none',
                padding: '0 14px',
              }}>
                {showLineNumbers && (
                  <span style={{
                    color: 'var(--code-gutter)', userSelect: 'none', textAlign: 'right',
                    width: '2.2em', marginRight: '16px', flex: 'none',
                  }}>{n}</span>
                )}
                <span style={{ color: 'var(--code-text)', whiteSpace: 'pre' }}>{highlight(line)}</span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
