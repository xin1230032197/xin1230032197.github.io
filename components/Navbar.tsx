import { siteContent } from "@/data/siteContent";

export function Navbar() {
  return (
    <div className="dock-wrap">
      <nav className="dock" aria-label="Primary navigation">
        {siteContent.navigation.map((item) => (
          <a href={item.href} key={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
