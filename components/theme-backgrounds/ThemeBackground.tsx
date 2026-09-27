import { InkBackground } from "./InkBackground";
import { ZenBackground } from "./ZenBackground";
import { AuroraBackground } from "./AuroraBackground";

/** CSS selects the visual layer; the document and navigation never remount. */
export function ThemeBackground() {
  return (
    <div className="theme-backgrounds" aria-hidden="true">
      <InkBackground />
      <ZenBackground />
      <AuroraBackground />
    </div>
  );
}
