/* @ds-bundle: {"format":3,"namespace":"DesignSystem_edb739","components":[{"name":"Callout","sourcePath":"components/content/Callout.jsx"},{"name":"CodeBlock","sourcePath":"components/content/CodeBlock.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Rule","sourcePath":"components/core/Rule.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"ThemeToggle","sourcePath":"components/core/ThemeToggle.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"}],"sourceHashes":{"components/content/Callout.jsx":"1e3bceabb5af","components/content/CodeBlock.jsx":"da5a6870e762","components/core/Badge.jsx":"55a9f3871fde","components/core/Button.jsx":"e9974bfe61a2","components/core/Card.jsx":"72152873051c","components/core/Rule.jsx":"a83d972c24f1","components/core/Tag.jsx":"53e600b43973","components/core/ThemeToggle.jsx":"a84a1f002d75","components/forms/Input.jsx":"75817490a483","ui_kits/blog/About.jsx":"ecefc996bb39","ui_kits/blog/Archive.jsx":"7ce90fa18ddb","ui_kits/blog/Article.jsx":"48a7b40b0cf3","ui_kits/blog/Home.jsx":"a18c9ce6eed4","ui_kits/blog/chrome.jsx":"a80d7313e3d2","ui_kits/blog/data.js":"74bac0b3e581"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_edb739 = window.DesignSystem_edb739 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/content/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Callout — an aside box for notes, warnings and tips. Left accent bar,
 * uppercase label, no rounded fluff.
 */
const PRESET = {
  note: {
    c: 'var(--info)',
    label: 'NOTE',
    mark: '//'
  },
  tip: {
    c: 'var(--success)',
    label: 'TIP',
    mark: '>>'
  },
  warning: {
    c: 'var(--warning)',
    label: 'WARNING',
    mark: '!!'
  },
  danger: {
    c: 'var(--danger)',
    label: 'DANGER',
    mark: '!!'
  }
};
function Callout({
  children,
  tone = 'note',
  // 'note' | 'tip' | 'warning' | 'danger'
  title = null,
  style = {},
  ...rest
}) {
  const p = PRESET[tone] || PRESET.note;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      background: 'var(--surface)',
      borderLeft: `2px solid ${p.c}`,
      border: '1px solid var(--border)',
      borderLeftWidth: '2px',
      borderLeftColor: p.c,
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-4) var(--space-5)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: p.c,
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-sm)',
      flex: 'none',
      userSelect: 'none',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, p.mark), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: p.c,
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-bold)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      marginBottom: '6px'
    }
  }, title || p.label), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-normal)'
    }
  }, children)));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Callout.jsx", error: String((e && e.message) || e) }); }

// components/content/CodeBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ---- tiny, dependency-free highlighter ----
   Good enough for Elixir / JS / shell specimens. Token order matters. */
const TOKEN_RE = new RegExp(['(?<comment>#[^\\n]*|\\/\\/[^\\n]*)', '(?<string>"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|`(?:\\\\.|[^`\\\\])*`)', '(?<atom>:[a-zA-Z_]\\w*[?!]?)', '(?<attr>@[a-zA-Z_]\\w*)', '(?<keyword>\\b(?:defmodule|defstruct|defp|def|do|end|fn|if|else|elsif|case|cond|when|import|alias|require|use|with|receive|after|try|rescue|raise|throw|catch|const|let|var|function|return|async|await|class|new|for|while|export|default|from|yield|true|false|nil|null|undefined)\\b)', '(?<builtin>\\b[A-Z][A-Za-z0-9_]*\\b)', '(?<number>\\b\\d[\\d_]*\\.?\\d*\\b)', '(?<fn>\\b[a-z_]\\w*[?!]?(?=\\())'].join('|'), 'g');
const COLORS = {
  comment: 'var(--syntax-comment)',
  string: 'var(--syntax-string)',
  atom: 'var(--syntax-atom)',
  attr: 'var(--syntax-atom)',
  keyword: 'var(--syntax-keyword)',
  builtin: 'var(--syntax-builtin)',
  number: 'var(--syntax-number)',
  fn: 'var(--syntax-function)'
};
function highlight(line) {
  const out = [];
  let last = 0,
    m,
    i = 0;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > last) out.push(/*#__PURE__*/React.createElement("span", {
      key: i++
    }, line.slice(last, m.index)));
    const kind = Object.keys(m.groups).find(k => m.groups[k] != null);
    out.push(/*#__PURE__*/React.createElement("span", {
      key: i++,
      style: {
        color: COLORS[kind]
      }
    }, m[0]));
    last = m.index + m[0].length;
  }
  if (last < line.length) out.push(/*#__PURE__*/React.createElement("span", {
    key: i++
  }, line.slice(last)));
  return out.length ? out : [/*#__PURE__*/React.createElement("span", {
    key: "0"
  }, '\u200b')];
}

/**
 * CodeBlock — the hero element of the system. A dark terminal surface
 * with a filename/language header, line numbers, and copy button.
 */
function CodeBlock({
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
    try {
      navigator.clipboard.writeText(code);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--code-bg)',
      border: '1px solid var(--code-border)',
      borderRadius: 'var(--radius-sm)',
      fontFamily: 'var(--font-code)',
      fontSize: 'var(--text-code)',
      overflow: 'hidden',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderBottom: '1px solid var(--code-border)',
      background: 'rgba(255,255,255,0.02)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: '6px',
      flex: 'none'
    }
  }, ['#3a3a3a', '#3a3a3a', '#3a3a3a'].map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      background: c
    }
  }))), filename && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-xs)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, filename)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '10px',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase'
    }
  }, language), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    style: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      color: copied ? 'var(--success)' : 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: '10px',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      transition: 'color var(--duration-fast) var(--ease-snap)'
    }
  }, copied ? '✓ copied' : 'copy'))), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 0,
      padding: '14px 0',
      overflowX: 'auto',
      lineHeight: 'var(--leading-code)'
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      display: 'block',
      minWidth: 'fit-content'
    }
  }, lines.map((line, idx) => {
    const n = idx + 1;
    const hot = highlightLines.includes(n);
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        display: 'flex',
        background: hot ? 'var(--accent-wash)' : 'transparent',
        boxShadow: hot ? 'inset 2px 0 0 0 var(--accent)' : 'none',
        padding: '0 14px'
      }
    }, showLineNumbers && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--code-gutter)',
        userSelect: 'none',
        textAlign: 'right',
        width: '2.2em',
        marginRight: '16px',
        flex: 'none'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--code-text)',
        whiteSpace: 'pre'
      }
    }, highlight(line)));
  }))));
}
Object.assign(__ds_scope, { CodeBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CodeBlock.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — small status pill with a leading dot.
 * For build status, post state, semantic flags.
 */
function Badge({
  children,
  tone = 'neutral',
  // 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
  dot = true,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: 'var(--text-secondary)',
    accent: 'var(--accent)',
    success: 'var(--success)',
    warning: 'var(--warning)',
    danger: 'var(--danger)',
    info: 'var(--info)'
  };
  const c = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: c,
      boxShadow: `0 0 6px ${c}`,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — the primary action primitive.
 * Brutalist: square corners, hard offset shadow on the primary fill,
 * press translates the button into its own shadow.
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  as = 'button',
  iconLeft = null,
  iconRight = null,
  disabled = false,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '6px 12px',
      fontSize: 'var(--text-xs)',
      gap: '6px'
    },
    md: {
      padding: '9px 18px',
      fontSize: 'var(--text-sm)',
      gap: '8px'
    },
    lg: {
      padding: '13px 26px',
      fontSize: 'var(--text-body)',
      gap: '10px'
    }
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
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--accent-contrast)',
      borderColor: 'var(--accent)',
      boxShadow: '2px 2px 0 0 var(--border-strong)'
    },
    secondary: {
      background: 'transparent',
      color: 'var(--text)',
      borderColor: 'var(--border-strong)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      borderColor: 'transparent'
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      borderColor: 'var(--danger)'
    }
  };
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: {
      background: 'var(--accent-hover)',
      borderColor: 'var(--accent-hover)'
    },
    secondary: {
      background: 'var(--surface-hover)'
    },
    ghost: {
      color: 'var(--text)',
      background: 'var(--surface-hover)'
    },
    danger: {
      background: 'var(--danger)',
      color: 'var(--accent-contrast)'
    }
  }[variant] : {};
  const activeStyle = !disabled && active ? variant === 'primary' ? {
    transform: 'translate(2px, 2px)',
    boxShadow: '0 0 0 0 var(--border-strong)'
  } : {
    transform: 'translate(1px, 1px)'
  } : {};
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...activeStyle,
      ...style
    },
    disabled: as === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Card — bordered surface. The brutalist default is a flat hairline
 * box; `raised` adds the hard offset shadow; `interactive` lifts on hover.
 */
function Card({
  children,
  variant = 'flat',
  // 'flat' | 'raised' | 'interactive'
  as = 'div',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    transition: 'transform var(--duration-base) var(--ease-snap), box-shadow var(--duration-base) var(--ease-snap), border-color var(--duration-base) var(--ease-snap)'
  };
  const variants = {
    flat: {},
    raised: {
      boxShadow: 'var(--shadow-hard)',
      borderColor: 'var(--border-strong)'
    },
    interactive: {
      cursor: 'pointer',
      ...(hover ? {
        borderColor: 'var(--border-strong)',
        transform: 'translate(-2px, -2px)',
        boxShadow: '4px 4px 0 0 var(--accent)'
      } : {})
    }
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Rule.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Rule — horizontal divider. Plain hairline, or an ASCII-style dashed
 * rule, optionally with a centered/leading uppercase label.
 */
function Rule({
  label = null,
  variant = 'solid',
  // 'solid' | 'dashed' | 'ascii'
  align = 'center',
  // 'center' | 'start'
  style = {},
  ...rest
}) {
  const lineFor = {
    solid: {
      borderTop: '1px solid var(--border)'
    },
    dashed: {
      borderTop: '1px dashed var(--line-2)'
    },
    ascii: null
  };
  const asciiLine = /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--line-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      letterSpacing: '0.05em',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      flex: 1,
      userSelect: 'none'
    }
  }, '────────────────────────────────────────────────────────────────────────');
  const lineEl = variant === 'ascii' ? asciiLine : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      ...lineFor[variant]
    }
  });
  if (!label) {
    return variant === 'ascii' ? /*#__PURE__*/React.createElement("div", _extends({
      style: {
        display: 'flex',
        overflow: 'hidden',
        ...style
      }
    }, rest), asciiLine) : /*#__PURE__*/React.createElement("hr", _extends({
      style: {
        border: 'none',
        ...lineFor[variant],
        margin: 0,
        ...style
      }
    }, rest));
  }
  const labelEl = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      flex: 'none'
    }
  }, label);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      ...style
    }
  }, rest), align === 'center' && lineEl, labelEl, lineEl);
}
Object.assign(__ds_scope, { Rule });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Rule.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Tag — bordered, uppercase topic label (elixir, otp, llm…).
 * Optional count suffix and clickable/active states for filtering.
 */
function Tag({
  children,
  count = null,
  active = false,
  as = 'span',
  size = 'md',
  // 'sm' | 'md'
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const clickable = as === 'a' || as === 'button' || !!rest.onClick;
  const sizes = {
    sm: {
      fontSize: '10px',
      padding: '2px 7px',
      gap: '6px'
    },
    md: {
      fontSize: 'var(--text-xs)',
      padding: '3px 9px',
      gap: '7px'
    }
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
    ...(clickable && hover && !active ? {
      borderColor: 'var(--border-strong)',
      color: 'var(--text)'
    } : {}),
    ...sizes[size],
    ...style
  };
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: base,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children, count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontWeight: 'var(--weight-regular)'
    }
  }, count));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/core/ThemeToggle.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ThemeToggle — flips [data-theme] between dark and light on a target
 * element (document root by default). Square segmented mono control.
 */
function ThemeToggle({
  target = null,
  // DOM element; defaults to documentElement
  initial = 'dark',
  onChange = null,
  style = {},
  ...rest
}) {
  const [theme, setTheme] = React.useState(initial);
  const apply = t => {
    const el = target || (typeof document !== 'undefined' ? document.documentElement : null);
    if (el) {
      if (t === 'light') el.setAttribute('data-theme', 'light');else el.removeAttribute('data-theme');
    }
    setTheme(t);
    onChange && onChange(t);
  };
  const opt = (t, label) => {
    const on = theme === t;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      onClick: () => apply(t),
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-wide)',
        textTransform: 'uppercase',
        padding: '5px 10px',
        border: 'none',
        cursor: 'pointer',
        background: on ? 'var(--accent)' : 'transparent',
        color: on ? 'var(--accent-contrast)' : 'var(--text-muted)',
        transition: 'background var(--duration-fast) var(--ease-snap), color var(--duration-fast) var(--ease-snap)'
      }
    }, label);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'inline-flex',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
      ...style
    }
  }, rest), opt('dark', 'dark'), opt('light', 'light'));
}
Object.assign(__ds_scope, { ThemeToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ThemeToggle.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — square text field with an uppercase label and optional
 * mono prefix (e.g. a `$` or `~/`). Brutalist focus = orange ring.
 */
function Input({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '7px',
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      letterSpacing: 'var(--tracking-wider)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      background: 'var(--bg-sunken)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-sm)',
      boxShadow: focus && !error ? '0 0 0 3px var(--accent-wash)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-snap), box-shadow var(--duration-fast) var(--ease-snap)'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      paddingLeft: '12px',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-body)',
      userSelect: 'none'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: fieldId,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: 'var(--text)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-body)',
      padding: '10px 12px',
      paddingLeft: prefix ? '6px' : '12px',
      width: '100%',
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/About.jsx
try { (() => {
/* About / now page. */
const aboutDS = window.DesignSystem_edb739;
function About({
  go
}) {
  const d = window.BLOG_DATA;
  const stack = [{
    k: 'languages',
    v: 'elixir, rust, typescript'
  }, {
    k: 'runtime',
    v: 'the BEAM (OTP 27)'
  }, {
    k: 'currently',
    v: 'LLM agent harnesses + evals'
  }, {
    k: 'editor',
    v: 'neovim, tmux, a lot of :w'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      alignItems: 'center',
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(window.Mark, {
    size: 56
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 8,
      color: 'var(--accent)'
    }
  }, "$ whoami"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h1)',
      letterSpacing: 'var(--tracking-tight)',
      margin: 0,
      color: 'var(--text)'
    }
  }, d.author.role), /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginTop: 8
    }
  }, d.author.location))), /*#__PURE__*/React.createElement("div", {
    className: "prose"
  }, /*#__PURE__*/React.createElement("p", null, d.author.bio), /*#__PURE__*/React.createElement("p", null, "This is where I think out loud about systems that refuse to stay up, languages that make concurrency boring (a compliment), and the slow, unglamorous work of making language models behave in production."), /*#__PURE__*/React.createElement("h2", null, "// now"), /*#__PURE__*/React.createElement("p", null, "Building an agentic harness with replayable transcripts and an eval loop that fails loudly. Mostly writing Elixir, occasionally fighting Rust borrow checker, always reading postmortems.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, stack.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    style: {
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      gap: 'var(--space-4)',
      padding: 'var(--space-4) var(--space-5)',
      borderTop: i ? '1px solid var(--border)' : 'none',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase'
    }
  }, s.k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text)'
    }
  }, s.v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-7)',
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(aboutDS.Button, {
    variant: "primary",
    as: "a",
    href: d.author.links[0].href
  }, "github \u2197"), /*#__PURE__*/React.createElement(aboutDS.Button, {
    variant: "secondary",
    onClick: () => go('home')
  }, "read the blog")));
}
Object.assign(window, {
  About
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/Archive.jsx
try { (() => {
/* Archive — tag filter page. Pick a tag, the post list filters. */
const arcDS = window.DesignSystem_edb739;
function Archive({
  tag,
  go
}) {
  const d = window.BLOG_DATA;
  const [active, setActive] = React.useState(tag || null);
  const posts = active ? d.posts.filter(p => p.tags.includes(active)) : d.posts;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, "$ grep -r --tag"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h1)',
      letterSpacing: 'var(--tracking-tight)',
      margin: '0 0 var(--space-6)',
      color: 'var(--text)'
    }
  }, "Filter by topic"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(arcDS.Tag, {
    as: "button",
    active: !active,
    onClick: () => setActive(null)
  }, "all"), d.tags.map(t => /*#__PURE__*/React.createElement(arcDS.Tag, {
    key: t.name,
    as: "button",
    active: active === t.name,
    count: t.count,
    onClick: () => setActive(t.name)
  }, t.name))), /*#__PURE__*/React.createElement(arcDS.Rule, {
    label: `${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}${active ? ' · ' + active : ''}`,
    align: "start",
    style: {
      marginBottom: 'var(--space-2)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760
    }
  }, posts.map(p => /*#__PURE__*/React.createElement(window.PostRow, {
    key: p.id,
    post: p,
    go: go
  }))));
}
Object.assign(window, {
  Archive
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/Archive.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/Article.jsx
try { (() => {
/* Article — the reading page. Renders a post body of mixed blocks,
   with code blocks as the hero element. */
const artDS = window.DesignSystem_edb739;
function Block({
  b
}) {
  if (b.t === 'p') return /*#__PURE__*/React.createElement("p", null, b.c);
  if (b.t === 'h2') return /*#__PURE__*/React.createElement("h2", null, b.c);
  if (b.t === 'h3') return /*#__PURE__*/React.createElement("h3", null, b.c);
  if (b.t === 'code') return /*#__PURE__*/React.createElement(artDS.CodeBlock, {
    filename: b.filename,
    language: b.language,
    highlightLines: b.highlight || [],
    code: b.c,
    style: {
      margin: 'var(--space-6) 0'
    }
  });
  if (b.t === 'callout') return /*#__PURE__*/React.createElement(artDS.Callout, {
    tone: b.tone,
    style: {
      margin: 'var(--space-6) 0'
    }
  }, b.c);
  return null;
}
function Article({
  id,
  go
}) {
  const d = window.BLOG_DATA;
  const post = d.posts.find(p => p.id === id) || d.posts[0];
  const idx = d.posts.indexOf(post);
  const next = d.posts[idx + 1];
  const body = post.body || [{
    t: 'p',
    c: post.excerpt
  }, {
    t: 'p',
    c: 'Full text coming soon — this entry is part of the kit as a list item only.'
  }];
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('home');
    },
    className: "ds-overline",
    style: {
      display: 'inline-block',
      marginBottom: 'var(--space-6)',
      color: 'var(--text-muted)',
      textDecoration: 'none'
    }
  }, "\u2190 cd ~/writing"), /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, post.date, " \u2014 ", post.read), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-display)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 'var(--leading-tight)',
      margin: '0 0 var(--space-5)',
      color: 'var(--text)'
    }
  }, post.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 'var(--space-6)'
    }
  }, post.tags.map(t => /*#__PURE__*/React.createElement(artDS.Tag, {
    key: t,
    as: "a",
    href: "#",
    onClick: e => {
      e.preventDefault();
      go('archive', t);
    }
  }, t))), /*#__PURE__*/React.createElement(artDS.Rule, {
    variant: "ascii",
    style: {
      marginBottom: 'var(--space-7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "prose"
  }, body.map((b, i) => /*#__PURE__*/React.createElement(Block, {
    key: i,
    b: b
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-10)',
      paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      gap: 'var(--space-4)',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(window.Mark, {
    size: 40
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h4)',
      color: 'var(--text)'
    }
  }, d.author.role), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)',
      maxWidth: 520
    }
  }, d.author.bio))), next && /*#__PURE__*/React.createElement("div", {
    onClick: () => go('article', next.id),
    style: {
      marginTop: 'var(--space-6)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-5)',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 6
    }
  }, "next \u2193"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h4)',
      color: 'var(--text)'
    }
  }, next.title)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontSize: 24
    }
  }, "\u2192")));
}
Object.assign(window, {
  Article
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/Article.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/Home.jsx
try { (() => {
/* Home — article index with intro, featured post, and the numeric list. */
const homeDS = window.DesignSystem_edb739;
function FeaturedPost({
  post,
  go
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: () => go('article', post.id),
    style: {
      border: '1px solid',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border)',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-6)',
      cursor: 'pointer',
      transition: 'transform var(--duration-base) var(--ease-snap), box-shadow var(--duration-base) var(--ease-snap), border-color var(--duration-base) var(--ease-snap)',
      transform: hover ? 'translate(-3px, -3px)' : 'none',
      boxShadow: hover ? '5px 5px 0 0 var(--accent)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(homeDS.Badge, {
    tone: "accent"
  }, "featured"), /*#__PURE__*/React.createElement("span", {
    className: "ds-overline"
  }, post.date, " \u2014 ", post.read)), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h1)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 'var(--leading-tight)',
      margin: '0 0 var(--space-4)',
      color: hover ? 'var(--accent)' : 'var(--text)',
      transition: 'color var(--duration-fast) var(--ease-snap)'
    }
  }, post.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-body-lg)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, post.excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, post.tags.map(t => /*#__PURE__*/React.createElement(homeDS.Tag, {
    key: t
  }, t))));
}
function SubscribeBlock() {
  const [done, setDone] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid var(--border)',
      borderLeft: '2px solid var(--accent)',
      background: 'var(--surface)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      color: 'var(--accent)',
      marginBottom: 10
    }
  }, "// subscribe"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h3)',
      margin: '0 0 8px',
      color: 'var(--text)'
    }
  }, "New posts, no noise"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-normal)'
    }
  }, "Roughly monthly. Distributed systems, Elixir, and LLM harnesses. Unsubscribe whenever."), done ? /*#__PURE__*/React.createElement(homeDS.Badge, {
    tone: "success"
  }, "check your inbox") : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setDone(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(homeDS.Input, {
    label: "Email",
    type: "email",
    placeholder: "you@host.dev",
    required: true
  }), /*#__PURE__*/React.createElement(homeDS.Button, {
    variant: "primary",
    type: "submit"
  }, "Subscribe")));
}
function Home({
  go
}) {
  const d = window.BLOG_DATA;
  const featured = d.posts.find(p => p.featured) || d.posts[0];
  const rest = d.posts.filter(p => p !== featured);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 'var(--space-8)',
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, "$ ./blog --list --recent"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h1)',
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 'var(--leading-tight)',
      margin: 0,
      color: 'var(--text)'
    }
  }, "Staff engineer.", /*#__PURE__*/React.createElement("br", null), "Notes from the ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "distributed"), " trenches."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-body-lg)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, d.author.bio)), /*#__PURE__*/React.createElement(FeaturedPost, {
    post: featured,
    go: go
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) 300px',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-8)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(homeDS.Rule, {
    label: "more writing",
    align: "start",
    style: {
      marginBottom: 'var(--space-2)'
    }
  }), rest.map(p => /*#__PURE__*/React.createElement(window.PostRow, {
    key: p.id,
    post: p,
    go: go
  }))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'sticky',
      top: 90,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(SubscribeBlock, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 'var(--space-4)'
    }
  }, "// topics"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8
    }
  }, d.tags.map(t => /*#__PURE__*/React.createElement(homeDS.Tag, {
    key: t.name,
    as: "a",
    href: "#",
    count: t.count,
    onClick: e => {
      e.preventDefault();
      go('archive', t.name);
    }
  }, t.name)))))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/chrome.jsx
try { (() => {
/* Shared chrome for the blog: Header, Footer, PostRow.
   Identity is nameless — the orange >_ mark + a live `~/path` prompt.
   Composes the design-system primitives off window.DesignSystem_edb739. */
const DS = window.DesignSystem_edb739;
function Mark({
  size = 30
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-md)',
      background: 'var(--accent)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      fontFamily: 'var(--font-mono)',
      fontWeight: 700,
      fontSize: size * 0.5,
      color: 'var(--accent-contrast)'
    }
  }, ">_");
}

/* The "wordmark" is a terminal prompt path — no brand name. */
function Prompt({
  path = '',
  onClick,
  size = 30,
  fontSize = 16,
  cursor = true
}) {
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    href: "#",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    size: size
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize,
      lineHeight: 1,
      display: 'inline-flex',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "~"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-secondary)'
    }
  }, "/", path), cursor && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      marginLeft: 3,
      animation: 'blink 1.1s steps(1) infinite'
    }
  }, "\u258B")));
}
const ROUTE_PATH = {
  home: '',
  writing: '',
  archive: 'tags',
  about: 'about',
  article: 'writing'
};
function Header({
  route,
  go
}) {
  const navItems = [{
    id: 'home',
    label: 'writing'
  }, {
    id: 'archive',
    label: 'tags'
  }, {
    id: 'about',
    label: 'about'
  }];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      borderBottom: '2px solid var(--border-strong)',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: '16px var(--space-6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Prompt, {
    path: ROUTE_PATH[route] ?? '',
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, navItems.map(n => /*#__PURE__*/React.createElement("a", {
    key: n.id,
    href: "#",
    onClick: e => {
      e.preventDefault();
      go(n.id);
    },
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      fontWeight: 500,
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      textDecoration: 'none',
      color: route === n.id ? 'var(--accent)' : 'var(--text-secondary)'
    }
  }, n.label)), /*#__PURE__*/React.createElement(DS.ThemeToggle, null))));
}
function Footer({
  go
}) {
  const d = window.BLOG_DATA;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border)',
      marginTop: 'var(--space-12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-wide)',
      margin: '0 auto',
      padding: 'var(--space-8) var(--space-6)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Prompt, {
    path: "",
    size: 28,
    cursor: false,
    onClick: e => {
      e.preventDefault();
      go('home');
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "// built on the BEAM \xB7 no trackers \xB7 ", d.author.location)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-6)'
    }
  }, d.author.links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href,
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      letterSpacing: 'var(--tracking-wide)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      textDecoration: 'none'
    }
  }, l.label)))));
}
function PostRow({
  post,
  go
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: () => go('article', post.id),
    style: {
      display: 'grid',
      gridTemplateColumns: '48px 1fr',
      gap: 'var(--space-5)',
      padding: 'var(--space-5) 0',
      borderBottom: '1px solid var(--border)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h3)',
      color: 'var(--accent)',
      lineHeight: 1
    }
  }, post.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "ds-overline",
    style: {
      marginBottom: 8
    }
  }, post.date, " \u2014 ", post.read), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 'var(--text-h2)',
      letterSpacing: 'var(--tracking-snug)',
      lineHeight: 'var(--leading-snug)',
      margin: '0 0 10px',
      color: hover ? 'var(--accent)' : 'var(--text)',
      transition: 'color var(--duration-fast) var(--ease-snap)'
    }
  }, post.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 14px',
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-body)',
      lineHeight: 'var(--leading-normal)',
      maxWidth: 640
    }
  }, post.excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, post.tags.map(t => /*#__PURE__*/React.createElement(DS.Tag, {
    key: t,
    size: "sm"
  }, t)))));
}
Object.assign(window, {
  Mark,
  Prompt,
  Header,
  Footer,
  PostRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/chrome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/blog/data.js
try { (() => {
// Fake content for the blog UI kit. window.BLOG_DATA
window.BLOG_DATA = {
  author: {
    handle: '@staff',
    role: 'Staff Engineer',
    bio: 'I write about distributed systems, the BEAM, and building LLM agents that survive contact with production.',
    location: 'remote / utc+0',
    links: [{
      label: 'github',
      href: '#'
    }, {
      label: 'rss',
      href: '#'
    }, {
      label: 'mastodon',
      href: '#'
    }]
  },
  tags: [{
    name: 'elixir',
    count: 14
  }, {
    name: 'dist-sys',
    count: 11
  }, {
    name: 'llm',
    count: 9
  }, {
    name: 'agents',
    count: 7
  }, {
    name: 'otp',
    count: 6
  }, {
    name: 'perf',
    count: 5
  }, {
    name: 'evals',
    count: 4
  }],
  posts: [{
    id: 'supervision-trees-lie',
    n: '01',
    title: 'Supervision trees are a lie you tell yourself',
    date: '2026 · 05 · 12',
    iso: '2026-05-12',
    read: '14 min',
    tags: ['elixir', 'otp'],
    featured: true,
    excerpt: 'What "let it crash" actually costs once you have 40k processes and a partitioned cluster — and why the answer is rarely a bigger supervisor.',
    body: [{
      t: 'p',
      c: 'Every Elixir talk eventually reaches the slide with the supervision tree. Boxes, arrows, a reassuring story: a process dies, its supervisor restarts it, the system heals. It is a genuinely good model. It is also, at scale, a comfortable lie.'
    }, {
      t: 'h2',
      c: 'The cost nobody graphs'
    }, {
      t: 'p',
      c: 'Restarts are not free. A restart discards in-memory state, and at 40k processes the question is no longer "did it restart" but "what did the restart take with it". When a partition heals and ten thousand GenServers restart in the same second, you do not have resilience. You have a thundering herd with extra steps.'
    }, {
      t: 'code',
      filename: 'lib/cluster/partition.ex',
      language: 'elixir',
      highlight: [4],
      c: 'defmodule Cluster.Partition do\n  def handle_heal(replicas) do\n    replicas\n    |> Enum.map(&reconcile/1)   # <- this is the herd\n    |> Enum.reduce(%{}, &merge/2)\n  end\nend'
    }, {
      t: 'callout',
      tone: 'warning',
      c: 'A supervisor restarting 10k children is not a recovery strategy. It is a denial-of-service you scheduled against yourself.'
    }, {
      t: 'h2',
      c: 'What actually helps'
    }, {
      t: 'p',
      c: 'Backpressure at the boundary, jittered restart intervals, and treating reconciliation as a first-class operation instead of an accident of restart order. The supervision tree is the floor, not the strategy.'
    }, {
      t: 'callout',
      tone: 'tip',
      c: 'Reach for recon before :observer when a node is already hot — :observer will happily make a bad day worse.'
    }, {
      t: 'p',
      c: 'None of this means "let it crash" is wrong. It means the slogan ends a sentence that production makes you finish.'
    }]
  }, {
    id: 'agentic-harness',
    n: '02',
    title: "Building an agentic harness that doesn't lie",
    date: '2026 · 04 · 28',
    iso: '2026-04-28',
    read: '22 min',
    tags: ['llm', 'agents'],
    excerpt: 'Tool-call verification, replayable transcripts, and why your eval loop is the actual product — not the model.'
  }, {
    id: 'crdts',
    n: '03',
    title: 'CRDTs I have known and loved',
    date: '2026 · 04 · 09',
    iso: '2026-04-09',
    read: '9 min',
    tags: ['dist-sys'],
    excerpt: 'A field guide to merge semantics that survive contact with real network partitions, ranked by how much they have hurt me.'
  }, {
    id: 'profiling-beam',
    n: '04',
    title: 'Profiling the BEAM without losing your mind',
    date: '2026 · 03 · 30',
    iso: '2026-03-30',
    read: '11 min',
    tags: ['elixir', 'perf'],
    excerpt: 'recon, :observer, and the flamegraph workflow I actually reach for when a node is on fire at 3am.'
  }, {
    id: 'eval-loop-product',
    n: '05',
    title: 'The eval loop is the product',
    date: '2026 · 03 · 15',
    iso: '2026-03-15',
    read: '18 min',
    tags: ['llm', 'evals'],
    excerpt: 'Stop shipping prompts. Start shipping the harness that tells you, ruthlessly and automatically, when a prompt got worse.'
  }, {
    id: 'genserver-myths',
    n: '06',
    title: 'Six things I believed about GenServer that were wrong',
    date: '2026 · 02 · 26',
    iso: '2026-02-26',
    read: '7 min',
    tags: ['elixir', 'otp'],
    excerpt: 'A short, slightly embarrassing list — collected over eight years and roughly four production incidents.'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/blog/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.CodeBlock = __ds_scope.CodeBlock;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Rule = __ds_scope.Rule;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.ThemeToggle = __ds_scope.ThemeToggle;

__ds_ns.Input = __ds_scope.Input;

})();
