/* Home — article index with intro, featured post, and the numeric list. */
const homeDS = window.DesignSystem_edb739;

function FeaturedPost({ post, go }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => go('article', post.id)}
      style={{
        border: '1px solid', borderColor: hover ? 'var(--border-strong)' : 'var(--border)',
        background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-6)',
        cursor: 'pointer', transition: 'transform var(--duration-base) var(--ease-snap), box-shadow var(--duration-base) var(--ease-snap), border-color var(--duration-base) var(--ease-snap)',
        transform: hover ? 'translate(-3px, -3px)' : 'none',
        boxShadow: hover ? '5px 5px 0 0 var(--accent)' : 'none',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
        <homeDS.Badge tone="accent">featured</homeDS.Badge>
        <span className="ds-overline">{post.date} — {post.read}</span>
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1)',
        letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)', margin: '0 0 var(--space-4)',
        color: hover ? 'var(--accent)' : 'var(--text)', transition: 'color var(--duration-fast) var(--ease-snap)',
      }}>{post.title}</h2>
      <p style={{ margin: '0 0 var(--space-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
        {post.excerpt}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        {post.tags.map((t) => <homeDS.Tag key={t}>{t}</homeDS.Tag>)}
      </div>
    </div>
  );
}

function SubscribeBlock() {
  const [done, setDone] = React.useState(false);
  return (
    <div style={{
      border: '1px solid var(--border)', borderLeft: '2px solid var(--accent)',
      background: 'var(--surface)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-6)',
    }}>
      <div className="ds-overline" style={{ color: 'var(--accent)', marginBottom: 10 }}>// subscribe</div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3)', margin: '0 0 8px', color: 'var(--text)' }}>
        New posts, no noise
      </h3>
      <p style={{ margin: '0 0 var(--space-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)' }}>
        Roughly monthly. Distributed systems, Elixir, and LLM harnesses. Unsubscribe whenever.
      </p>
      {done ? (
        <homeDS.Badge tone="success">check your inbox</homeDS.Badge>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <homeDS.Input label="Email" type="email" placeholder="you@host.dev" required />
          <homeDS.Button variant="primary" type="submit">Subscribe</homeDS.Button>
        </form>
      )}
    </div>
  );
}

function Home({ go }) {
  const d = window.BLOG_DATA;
  const featured = d.posts.find((p) => p.featured) || d.posts[0];
  const rest = d.posts.filter((p) => p !== featured);
  return (
    <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      {/* intro */}
      <div style={{ marginBottom: 'var(--space-8)', maxWidth: 720 }}>
        <div className="ds-overline" style={{ marginBottom: 'var(--space-4)' }}>$ ./blog --list --recent</div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1)', letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)', margin: 0, color: 'var(--text)' }}>
          Staff engineer.<br />Notes from the <span style={{ color: 'var(--accent)' }}>distributed</span> trenches.
        </p>
        <p style={{ marginTop: 'var(--space-5)', color: 'var(--text-secondary)', fontSize: 'var(--text-body-lg)', lineHeight: 'var(--leading-relaxed)' }}>
          {d.author.bio}
        </p>
      </div>

      <FeaturedPost post={featured} go={go} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 'var(--space-8)', marginTop: 'var(--space-8)', alignItems: 'start' }}>
        <div>
          <homeDS.Rule label="more writing" align="start" style={{ marginBottom: 'var(--space-2)' }} />
          {rest.map((p) => <window.PostRow key={p.id} post={p} go={go} />)}
        </div>
        <aside style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <SubscribeBlock />
          <div>
            <div className="ds-overline" style={{ marginBottom: 'var(--space-4)' }}>// topics</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {d.tags.map((t) => (
                <homeDS.Tag key={t.name} as="a" href="#" count={t.count}
                  onClick={(e) => { e.preventDefault(); go('archive', t.name); }}>{t.name}</homeDS.Tag>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

Object.assign(window, { Home });
