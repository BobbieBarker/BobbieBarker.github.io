/* About / now page. */
const aboutDS = window.DesignSystem_edb739;

function About({ go }) {
  const d = window.BLOG_DATA;
  const stack = [
    { k: 'languages', v: 'elixir, rust, typescript' },
    { k: 'runtime', v: 'the BEAM (OTP 27)' },
    { k: 'currently', v: 'LLM agent harnesses + evals' },
    { k: 'editor', v: 'neovim, tmux, a lot of :w' },
  ];
  return (
    <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', marginBottom: 'var(--space-7)' }}>
        <window.Mark size={56} />
        <div>
          <div className="ds-overline" style={{ marginBottom: 8, color: 'var(--accent)' }}>$ whoami</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1)', letterSpacing: 'var(--tracking-tight)', margin: 0, color: 'var(--text)' }}>
            {d.author.role}
          </h1>
          <div className="ds-overline" style={{ marginTop: 8 }}>{d.author.location}</div>
        </div>
      </div>

      <div className="prose">
        <p>{d.author.bio}</p>
        <p>This is where I think out loud about systems that refuse to stay up, languages that make concurrency boring (a compliment), and the slow, unglamorous work of making language models behave in production.</p>
        <h2>// now</h2>
        <p>Building an agentic harness with replayable transcripts and an eval loop that fails loudly. Mostly writing Elixir, occasionally fighting Rust borrow checker, always reading postmortems.</p>
      </div>

      <div style={{ marginTop: 'var(--space-7)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        {stack.map((s, i) => (
          <div key={s.k} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr', gap: 'var(--space-4)',
            padding: 'var(--space-4) var(--space-5)', borderTop: i ? '1px solid var(--border)' : 'none',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
          }}>
            <span style={{ color: 'var(--text-muted)', letterSpacing: 'var(--tracking-wide)', textTransform: 'uppercase' }}>{s.k}</span>
            <span style={{ color: 'var(--text)' }}>{s.v}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-7)', display: 'flex', gap: 12 }}>
        <aboutDS.Button variant="primary" as="a" href={d.author.links[0].href}>github ↗</aboutDS.Button>
        <aboutDS.Button variant="secondary" onClick={() => go('home')}>read the blog</aboutDS.Button>
      </div>
    </div>
  );
}

Object.assign(window, { About });
