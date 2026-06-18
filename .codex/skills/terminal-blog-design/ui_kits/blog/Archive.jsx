/* Archive — tag filter page. Pick a tag, the post list filters. */
const arcDS = window.DesignSystem_edb739;

function Archive({ tag, go }) {
  const d = window.BLOG_DATA;
  const [active, setActive] = React.useState(tag || null);
  const posts = active ? d.posts.filter((p) => p.tags.includes(active)) : d.posts;

  return (
    <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <div className="ds-overline" style={{ marginBottom: 'var(--space-4)' }}>$ grep -r --tag</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1)', letterSpacing: 'var(--tracking-tight)', margin: '0 0 var(--space-6)', color: 'var(--text)' }}>
        Filter by topic
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 'var(--space-7)' }}>
        <arcDS.Tag as="button" active={!active} onClick={() => setActive(null)}>all</arcDS.Tag>
        {d.tags.map((t) => (
          <arcDS.Tag key={t.name} as="button" active={active === t.name} count={t.count}
            onClick={() => setActive(t.name)}>{t.name}</arcDS.Tag>
        ))}
      </div>

      <arcDS.Rule label={`${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}${active ? ' · ' + active : ''}`} align="start" style={{ marginBottom: 'var(--space-2)' }} />

      <div style={{ maxWidth: 760 }}>
        {posts.map((p) => <window.PostRow key={p.id} post={p} go={go} />)}
      </div>
    </div>
  );
}

Object.assign(window, { Archive });
