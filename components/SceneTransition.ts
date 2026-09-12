/**
 * A short-lived tiled copy of the cover. Only transform and opacity animate.
 * Tiles are removed after 900ms, on resize, on tab hiding, or on unmount.
 */
export function dissolveCover(source: HTMLElement, host: HTMLElement) {
  const { width, height } = source.getBoundingClientRect();
  const columns = width < 640 ? 2 : 4;
  const rows = 3;
  const animations: Animation[] = [];
  host.replaceChildren();
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const tile = document.createElement("div");
      tile.className = "scene-fragment";
      const left = (column * width) / columns;
      const top = (row * height) / rows;
      Object.assign(tile.style, {
        left: `${left}px`, top: `${top}px`,
        width: `${Math.ceil(width / columns) + 1}px`,
        height: `${Math.ceil(height / rows) + 1}px`,
      });
      const copy = source.cloneNode(true) as HTMLElement;
      copy.classList.add("fragment-copy");
      copy.inert = true;
      copy.removeAttribute("id");
      copy.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      Object.assign(copy.style, {
        position: "absolute", width: `${width}px`, height: `${height}px`,
        left: `-${left}px`, top: `-${top}px`,
      });
      tile.appendChild(copy);
      host.appendChild(tile);
      const direction = column - (columns - 1) / 2;
      animations.push(tile.animate([
        { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
        { opacity: 0.92, offset: 0.22 },
        {
          transform: `translate(${direction * 55}px, ${(row - 1) * 46 - 25}px) rotate(${direction * 4 + row - 1}deg) scale(.92)`,
          opacity: 0,
        },
      ], {
        duration: 650,
        delay: column * 38 + (2 - row) * 40,
        easing: "cubic-bezier(.22,.65,.25,1)",
        fill: "both",
      }));
    }
  }
  const cancel = () => {
    animations.forEach((animation) => animation.cancel());
    host.replaceChildren();
    window.removeEventListener("resize", cancel);
    document.removeEventListener("visibilitychange", onVisibility);
  };
  const onVisibility = () => { if (document.hidden) cancel(); };
  window.addEventListener("resize", cancel, { once: true });
  document.addEventListener("visibilitychange", onVisibility);
  const finished = Promise.allSettled(animations.map((animation) => animation.finished))
    .then(cancel);
  return { finished, cancel };
}
