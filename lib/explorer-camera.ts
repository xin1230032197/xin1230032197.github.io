import type { Camera } from "./explorer-types";

export function zoomAt(camera: Camera, point: { x: number; y: number }, delta: number): Camera {
  const k = Math.max(.4, Math.min(3.5, camera.k * Math.exp(Math.max(-.45, Math.min(.45, -delta * .002)))));
  return {
    k, x: point.x - (point.x - camera.x) / camera.k * k,
    y: point.y - (point.y - camera.y) / camera.k * k,
  };
}

/** Unlimited concentric rings; search and panning reach nodes outside the viewport. */
export function bubblePositions(count: number, width: number, height: number) {
  const mobile = width < 500;
  const gap = mobile ? 128 : 158;
  const initial = Math.max(mobile ? 135 : 190, Math.min(width * .30, height * .30, 245));
  const points: { x: number; y: number }[] = [];
  let remaining = count, ring = 0;
  while (remaining > 0) {
    const radius = initial + ring * gap;
    const capacity = Math.max(3, Math.floor(2 * Math.PI * radius / gap));
    const size = Math.min(remaining, capacity);
    for (let i = 0; i < size; i++) {
      const angle = -Math.PI / 2 + i * 2 * Math.PI / size + ring * .17;
      points.push({ x: width / 2 + Math.cos(angle) * radius, y: height / 2 + Math.sin(angle) * radius });
    }
    remaining -= size;
    ring++;
  }
  return points;
}
