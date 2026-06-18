/* Article — the reading page. Renders a post body of mixed blocks,
   with code blocks as the hero element. */
const artDS = window.DesignSystem_edb739;

function Block({ b }) {
  if (b.t === 'p') return <p>{b.c}</p>;
  if (b.t === 'h2') return <h2>{b.c}</h2>;
  if (b.t === 'h3') return <h3>{b.c}</h3>;
  if (b.t === 'code') return (
    <artDS.CodeBlock filename={b.filename} language={b.language} highlightLines={b.highlight || []} code={b.c} style={{ margin: 'var(--space-6) 0' }} />
  );
  if (b.t === 'callout') return <artDS.Callout tone={b.tone} style={{ margin: 'var(--space-6) 0' }}>{b.c}</artDS.Callout>;
  return null;
}

function Article({ id, go }) {
  const d = window.BLOG_DATA;
  const post = d.posts.find((p) => p.id === id) || d.posts[0];
  const idx = d.posts.indexOf(post);
  const next = d.posts[idx + 1];
  const body = post.body || [{ t: 'p', c: post.excerpt }, { t: 'p', c: 'Full text coming soon — this entry is part of the kit as a list item only.' }];

  React.useEffect(() => { window.scrollTo(0, 0); }, [id]);

  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go('home'); }} className="ds-overline" style={{ display: 'inline-block', marginBottom: 'var(--space-6)', color: 'var(--text-muted)', textDecoration: 'none' }}>
        ← cd ~/writing
      </a>

      <div className="ds-overline" style={{ marginBottom: 'var(--space-4)' }}>
        {post.date} — {post.read}
      </div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-display)',
        letterSpacing: 'var(--tracking-tight)', lineHeight: 'var(--leading-tight)', margin: '0 0 var(--space-5)', color: 'var(--text)',
      }}>{post.title}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-6)' }}>
        {post.tags.map((t) => <artDS.Tag key={t} as="a" href="#" onClick={(e) => { e.preventDefault(); go('archive', t); }}>{t}</artDS.Tag>)}
      </div>

      <artDS.Rule variant="ascii" style={{ marginBottom: 'var(--space-7)' }} />

      <div className="prose">
        {body.map((b, i) => <Block key={i} b={b} />)}
      </div>

      {/* author + next */}
      <div style={{ marginTop: 'var(--space-10)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--border)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
        <window.Mark size={40} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h4)', color: 'var(--text)' }}>{d.author.role}</div>
          <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)', maxWidth: 520 }}>{d.author.bio}</p>
        </div>
      </div>

      {next && (
        <div onClick={() => go('article', next.id)} style={{
          marginTop: 'var(--space-6)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-5)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        }}>
          <div>
            <div className="ds-overline" style={{ marginBottom: 6 }}>next ↓</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h4)', color: 'var(--text)' }}>{next.title}</div>
          </div>
          <span style={{ color: 'var(--accent)', fontSize: 24 }}>→</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Article });
