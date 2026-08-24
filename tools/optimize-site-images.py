from pathlib import Path
from PIL import Image, ImageOps
import os

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "assets" / "images"


def settings(path: Path):
    relative = path.relative_to(IMAGES).as_posix()
    if relative.startswith("gift-hd/") or "qr" in relative.lower():
        return None
    if relative.startswith("gallery-elena/full/"):
        return 1800, 80
    if relative.startswith("gallery-elena/"):
        return 1400, 82
    if relative.startswith("partners/"):
        return 900, 80
    if path.name == "image-001.webp":
        return 1800, 84
    if path.name.startswith("logo-") or "app-store" in path.name:
        return 700, 86
    return 1400, 82


before = 0
after = 0
optimized = 0

for target in IMAGES.rglob("*.webp"):
    chosen = settings(target)
    if chosen is None:
        continue
    source = next(
        (candidate for candidate in (target.with_suffix(".jpg"), target.with_suffix(".png")) if candidate.exists()),
        target,
    )
    max_edge, quality = chosen
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
        if image.mode not in ({"RGBA", "LA"} if has_alpha else {"RGB", "L"}):
            image = image.convert("RGBA" if has_alpha else "RGB")
        temporary = target.with_suffix(".optimized.webp")
        options = {"format": "WEBP", "method": 6, "optimize": True}
        if has_alpha:
            options.update(quality=max(quality, 86), alpha_quality=95)
        else:
            options.update(quality=quality)
        image.save(temporary, **options)
    old_size = target.stat().st_size
    new_size = temporary.stat().st_size
    before += old_size
    if new_size < old_size:
        os.replace(temporary, target)
        after += new_size
        optimized += 1
    else:
        temporary.unlink()
        after += old_size

print(f"Optimized files: {optimized}")
print(f"Before: {before / 1024 / 1024:.2f} MB")
print(f"After: {after / 1024 / 1024:.2f} MB")
print(f"Reduction: {(1 - after / before) * 100:.1f}%")
