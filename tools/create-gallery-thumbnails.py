from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "images" / "gallery-thumbs"
OUTPUT.mkdir(parents=True, exist_ok=True)

sources = [
    "assets/images/gallery-elena/01-piscine-facade.webp",
    "assets/images/gallery-elena/02-piscine-jardin.webp",
    "assets/images/gallery-elena/full/IMG-20251223-WA0135.webp",
    "assets/images/gallery-elena/full/IMG-20251223-WA0125.webp",
    "assets/images/gallery-elena/full/IMG-20251223-WA0110.webp",
    "assets/images/gallery-elena/06-terrasse-piscine.webp",
    "assets/images/gallery-elena/full/IMG-20251223-WA0138.webp",
]

before = after = 0
for relative in sources:
    source = ROOT / relative
    target = OUTPUT / source.name
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        image.thumbnail((900, 900), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=78, method=6, optimize=True)
    before += source.stat().st_size
    after += target.stat().st_size

print(f"Gallery previews: {before / 1024 / 1024:.2f} MB -> {after / 1024 / 1024:.2f} MB")
