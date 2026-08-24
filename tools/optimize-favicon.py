from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / "assets" / "icons" / "elena-favicon.png"
target = ROOT / "assets" / "icons" / "palms-favicon-192.png"

with Image.open(source) as opened:
    image = ImageOps.exif_transpose(opened).convert("RGBA")
    image.thumbnail((192, 192), Image.Resampling.LANCZOS)
    image.save(target, format="PNG", optimize=True, compress_level=9)

for relative in ("index.html", "site.webmanifest"):
    path = ROOT / relative
    text = path.read_text(encoding="utf-8")
    text = text.replace("assets/icons/elena-favicon.png", "assets/icons/palms-favicon-192.png")
    path.write_text(text, encoding="utf-8", newline="")

print(f"Before: {source.stat().st_size / 1024:.0f} KB")
print(f"After: {target.stat().st_size / 1024:.0f} KB")
