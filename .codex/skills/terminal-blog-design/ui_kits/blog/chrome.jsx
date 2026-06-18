/* Shared chrome for the blog: Header, Footer, PostRow.
   Identity is nameless — the orange >_ mark + a live `~/path` prompt.
   Composes the design-system primitives off window.DesignSystem_edb739. */
const DS = window.DesignSystem_edb739;

function Mark({ size = 30 }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: 'var(--radius-md)', background: 'var(--accent)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
      fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: size * 0.5,
      color: 'var(--accent-contrast)',
    }}>&gt;_</span>
  );
}

/* The "wordmark" is a terminal prompt path — no brand name. */
function Prompt({ path = '', onClick, size = 30, fontSize = 16, cursor = true }) {
  return (
    <a onClick={onClick} href="#" style={{
      display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none',
    }}>
      <Mark size={size} />
      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize, lineHeight: 1, display: 'inline-flex', alignItems: 'baseline' }}>
        <span style={{ color: 'var(--accent)' }}>~</span>
        <span style={{ color: 'var(--text-secondary)' }}>/{path}</span>
        {cursor && <span style={{ color: 'var(--accent)', marginLeft: 3, animation: 'blink 1.1s steps(1) infinite' }}>▋</span>}
      </span>
    </a>
  );
}

const ROUTE_PATH = { home: '', writing: '', archive: 'tags', about: 'about', article: 'writing' };

function Header({ route, go }) {
  const navItems = [
    { id: 'home', label: 'writing' },
    { id: 'archive', label: 'tags' },
    { id: 'about', label: 'about' },
  ];
  return (
    <header style={{
      borderBottom: '2px solid var(--border-strong)', position: 'sticky', top: 0, zIndex: 20,
      background: 'color-mix(in srgb, var(--bg) 88%, transparent)', backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '16px var(--space-6)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Prompt path={ROUTE_PATH[route] ?? ''} onClick={(e) => { e.preventDefault(); go('home'); }} />
        <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {navItems.map((n) => (
            <a key={n.id} href="#" onClick={(e) => { e.preventDefault(); go(n.id); }}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500,
                letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase', textDecoration: 'none',
                color: route === n.id ? 'var(--accent)' : 'var(--text-secondary)',
              }}>{n.label}</a>
          ))}
          <DS.ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function Footer({ go }) {
  const d = window.BLOG_DATA;
  return (
    <footer style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--space-12)' }}>
      <div style={{
        maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-6)', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Prompt path="" size={28} cursor={false} onClick={(e) => { e.preventDefault(); go('home'); }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            // built on the BEAM · no trackers · {d.author.location}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          {d.author.links.map((l) => (
            <a key={l.label} href={l.href} style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none',
            }}>{l.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function PostRow({ post, go }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => go('article', post.id)}
      style={{
        display: 'grid', gridTemplateColumns: '48px 1fr', gap: 'var(--space-5)',
        padding: 'var(--space-5) 0', borderBottom: '1px solid var(--border)', cursor: 'pointer',
      }}>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3)', color: 'var(--accent)', lineHeight: 1 }}>
        {post.n}
      </div>
      <div>
        <div className="ds-overline" style={{ marginBottom: 8 }}>
          {post.date} — {post.read}
        </div>
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h2)',
          letterSpacing: 'var(--tracking-snug)', lineHeight: 'var(--leading-snug)', margin: '0 0 10px',
          color: hover ? 'var(--accent)' : 'var(--text)', transition: 'color var(--duration-fast) var(--ease-snap)',
        }}>{post.title}</h3>
        <p style={{ margin: '0 0 14px', color: 'var(--text-secondary)', fontSize: 'var(--text-body)', lineHeight: 'var(--leading-normal)', maxWidth: 640 }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          {post.tags.map((t) => <DS.Tag key={t} size="sm">{t}</DS.Tag>)}
        </div>
      </div>
    </article>
  );
}

Object.assign(window, { Mark, Prompt, Header, Footer, PostRow });
