export function StatusBar() {
  const items = [
    ["Status", "Online"],
    ["Focus", "AI Infrastructure"],
    ["Stack", "C++ / Python / CUDA"],
    ["Build", "0.1.0"],
  ];

  return (
    <footer className="border-t border-[var(--ink)] px-5 py-5 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-[1320px] flex-wrap gap-x-7 gap-y-3 font-mono text-[10px] uppercase tracking-[0.12em] sm:text-[11px]">
        {items.map(([label, value]) => (
          <span key={label} className="text-[var(--muted-ink)]">{label}: <strong className="font-medium text-[var(--ink)]">{value}</strong></span>
        ))}
      </div>
    </footer>
  );
}
