const STEPS = [
  { number: "01", label: "Wallet", detail: "Control" },
  { number: "02", label: "Passport", detail: "Soulbound" },
  { number: "03", label: "Evidence", detail: "Projects + skills" },
  { number: "04", label: "Builder Graph", detail: "Machine-readable" },
  { number: "05", label: "Agents", detail: "Capabilities" },
];

export function AnimatedBuilderFlow() {
  return (
    <section className="relative overflow-hidden rounded-md border border-line bg-white px-4 py-6 shadow-sm sm:px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brass-500 to-transparent opacity-70" />

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-700">
            Identity protocol
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-ink sm:text-2xl">
            From wallet to agent-readable builder
          </h2>
        </div>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-slate sm:block">
          live architecture
        </span>
      </div>

      <div className="relative grid gap-2 sm:grid-cols-5 sm:gap-0">
        <div className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-line sm:block" />
        {STEPS.map((step, index) => (
          <div key={step.number} className="relative flex items-center gap-3 sm:block sm:text-center">
            <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-paper font-mono text-xs text-ink shadow-sm sm:mx-auto">
              <span className={index === 1 ? "animate-pulse" : ""}>{step.number}</span>
            </div>
            <div className="min-w-0 sm:mt-3">
              <p className="text-sm font-semibold text-ink">{step.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-wide text-slate">{step.detail}</p>
            </div>
            {index < STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className="flow-arrow absolute left-7 top-[4.35rem] hidden text-brass-700 sm:block"
              >
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="flow-card border border-line bg-paper p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Today</p>
          <p className="mt-1 text-sm text-slate">Mint, verify and share a GIWA-native builder passport.</p>
        </div>
        <div className="flow-card border border-line bg-paper p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Next</p>
          <p className="mt-1 text-sm text-slate">Attach attestations, credentials and contribution evidence.</p>
        </div>
        <div className="flow-card border border-line bg-paper p-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-brass-700">Future</p>
          <p className="mt-1 text-sm text-slate">Let applications and agents discover verifiable builder capabilities.</p>
        </div>
      </div>
    </section>
  );
}
