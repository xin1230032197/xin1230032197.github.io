"""Regenerate fast first-load Chinese subsets; full fonts remain a fallback for new text.
Run with Python + fonttools + brotli after adding content.
"""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parents[1]
text = "".join(p.read_text(encoding="utf-8") for directory in ["app", "components", "content", "data"] for p in (root / directory).rglob("*") if p.suffix in [".tsx", ".ts", ".md"])
points = sorted({ord(c) for c in text if ord(c) > 255})
css = []
for stem, family in [("SourceHanSerifSC", "Source Han Serif SC"), ("SourceHanSansSC", "Source Han Sans SC")]:
    font = TTFont(root / "public" / "fonts" / (stem + ".woff2"))
    options = subset.Options()
    options.flavor = "woff2"
    options.recalc_timestamp = False
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=points)
    sub.subset(font)
    name = stem + "-subset.woff2"
    font.save(root / "public" / "fonts" / name)
    css.append('@font-face{font-family:"' + family + '";src:url("/fonts/' + name + '") format("woff2");font-weight:100 900;font-display:swap;unicode-range:' + ','.join(f'U+{c:X}' for c in points) + '}')
    print(name, (root / "public" / "fonts" / name).stat().st_size, "bytes")
(root / "app" / "font-subsets.css").write_text("\n".join(css) + "\n", encoding="utf-8")
