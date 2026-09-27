import { CelestialGeometry } from "./Ornaments";

/** Independent material, scenery, illumination and foreground layers. */
export function InkBackground() {
  return (
    <div className="theme-environment ink-environment" aria-hidden="true">
      <div className="environment-layer ink-base" />
      <div className="environment-layer ink-atmosphere" />
      <div className="ink-library-vignette" />
      <div className="environment-layer ink-window-light" />
      <div className="environment-layer ink-candle-light" />
      <div className="environment-layer ink-material" />
      <CelestialGeometry className="ink-astrolabe" />
      <div className="environment-layer ink-reading-veil" />
      <div className="environment-layer ink-vignette" />
      <div className="environment-layer ink-dust" />
      <div className="environment-layer ink-dust ink-dust-near" />
    </div>
  );
}
