from pathlib import Path
from PIL import Image, ImageOps
import re

ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "assets" / "images"
SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg"}

before = 0
after = 0
converted = 0

for source in IMAGE_ROOT.rglob("*"):
    if not source.is_file() or source.suffix.lower() not in SOURCE_EXTENSIONS:
        continue
    target = source.with_suffix(".webp")
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
        save_options = {"format": "WEBP", "method": 6}
        if has_alpha:
            save_options["lossless"] = True
        else:
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            save_options.update(quality=88, optimize=True)
        image.save(target, **save_options)
    before += source.stat().st_size
    after += target.stat().st_size
    converted += 1

asset_pattern = re.compile(r"(?<!https://elenaparadisevilla\.com/)(assets/images/[^\"'`)]+?)\.(?:png|jpe?g)", re.I)
for relative in ("index.html", "css/style.css", "js/script.js"):
    path = ROOT / relative
    text = path.read_text(encoding="utf-8")
    text = asset_pattern.sub(r"\1.webp", text)
    path.write_text(text, encoding="utf-8", newline="")

print(f"Converted: {converted}")
print(f"Before: {before / 1024 / 1024:.2f} MB")
print(f"After: {after / 1024 / 1024:.2f} MB")
print(f"Reduction: {(1 - after / before) * 100:.1f}%")
