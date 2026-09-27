import { CelestialGeometry } from "./Ornaments";

export function AuroraBackground() {
  return (
    <div className="theme-environment aurora-environment" aria-hidden="true">
      <div className="environment-layer aurora-base" />
      <svg
        className="environment-layer aurora-star-field"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="codex-stars"
            width="487"
            height="419"
            patternUnits="userSpaceOnUse"
          >
            {Array.from({ length: 27 }, (_, i) => (
              <circle
                key={i}
                cx={(i * 137 + 19) % 487}
                cy={(i * 83 + 37) % 419}
                r={i % 7 === 0 ? 1.25 : 0.55}
                fill="#b7e2df"
                opacity={0.22 + (i % 4) * 0.15}
              />
            ))}
            <path
              d="M312 118h8m-4-4v8 M74 337h6m-3-3v6"
              stroke="#9ddbd8"
              strokeWidth=".65"
              opacity=".6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#codex-stars)" />
      </svg>
      <div className="aurora-ribbons" />
      <div className="aurora-celestial-landscape" />
      <CelestialGeometry className="aurora-orbits" />
      <div className="environment-layer aurora-space-haze" />
      <div className="environment-layer aurora-chart" />
      <div className="environment-layer aurora-reading-veil" />
      <div className="environment-layer aurora-grain" />
    </div>
  );
}
