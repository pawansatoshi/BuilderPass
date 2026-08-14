const projects = [
  {
    name: "ARCTIS",
    role: "AI + programmable money",
    description: "A four-pillar operating-system concept combining Knowledge OS, AI OS, stablecoin infrastructure and economic agents.",
    href: "https://github.com/pawansatoshi/Arctis",
  },
  {
    name: "Veridex",
    role: "On-chain intelligence",
    description: "An evidence-first Telegraph architecture for deterministic, auditable intelligence rather than opaque AI output.",
    href: "https://github.com/pawansatoshi/Veridex",
  },
  {
    name: "FactAnchor",
    role: "AI consensus primitive",
    description: "A GenLayer Intelligent Contract that resolves web-grounded claims through independent validator reasoning and consensus.",
    href: "https://github.com/pawansatoshi/factanchor",
  },
  {
    name: "GIWA Builder Passport",
    role: "Builder identity",
    description: "The current GIWA submission: a soulbound, on-chain builder identity primitive with public verification and editable metadata.",
    href: "https://github.com/pawansatoshi/BuilderPass",
  },
];

export function BuilderPortfolio() {
  return (
    <section className="space-y-4 border-t border-line pt-8 text-left">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">Builder portfolio</p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-ink">Identity → skills → projects → proofs</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate">
          BuilderPass is designed as an identity primitive, not a reputation score. Projects and
          contribution evidence can be connected to a portable builder profile without inventing a subjective ranking.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-md border border-line bg-white p-5 transition hover:border-ink/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-ink">{project.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-brass-700">{project.role}</p>
              </div>
              <span className="text-slate transition group-hover:text-ink">↗</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate">{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
