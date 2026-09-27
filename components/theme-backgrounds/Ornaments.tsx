/** Fine instrument geometry, not a rasterized interface. */
export function CelestialGeometry({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`celestial-geometry ${className}`}
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth=".65">
        <circle cx="300" cy="300" r="278" />
        <circle cx="300" cy="300" r="266" />
        <circle cx="300" cy="300" r="232" />
        <circle cx="300" cy="300" r="196" strokeDasharray="2 8" />
        <circle cx="300" cy="300" r="135" />
        <ellipse
          cx="300"
          cy="300"
          rx="266"
          ry="93"
          transform="rotate(-35 300 300)"
        />
        <ellipse
          cx="300"
          cy="300"
          rx="266"
          ry="125"
          transform="rotate(56 300 300)"
        />
        <path
          d="M300 10v580M10 300h580M103 103l394 394M103 497l394-394"
          opacity=".5"
        />
        {Array.from({ length: 72 }, (_, i) => (
          <path
            key={i}
            d={`M300 22v${i % 6 === 0 ? 17 : 6}`}
            transform={`rotate(${i * 5} 300 300)`}
          />
        ))}
      </g>
      <g fill="currentColor">
        <circle cx="300" cy="300" r="3" />
        <circle cx="169" cy="200" r="3" />
        <circle cx="445" cy="434" r="2" />
      </g>
    </svg>
  );
}

export function StarOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m12 2 1.7 8.3L22 12l-8.3 1.7L12 22l-1.7-8.3L2 12l8.3-1.7L12 2Z"
        stroke="currentColor"
        strokeWidth=".7"
      />
      <path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth=".5" />
    </svg>
  );
}
