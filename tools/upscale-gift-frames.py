from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

source_dir = Path("assets/images")
output_dir = source_dir / "gift-hd"
output_dir.mkdir(parents=True, exist_ok=True)

for number in range(19, 119):
    source = source_dir / f"image-{number:03d}.jpg"
    output = output_dir / source.name
    with Image.open(source) as image:
        image = image.convert("RGB")
        pixels = np.asarray(image, dtype=np.float32)
        brightness = pixels.mean(axis=2)
        color_spread = pixels.max(axis=2) - pixels.min(axis=2)
        brightness_weight = np.clip((brightness - 218.0) / 34.0, 0.0, 1.0)
        neutral_weight = np.clip((30.0 - color_spread) / 18.0, 0.0, 1.0)
        blend = (brightness_weight * neutral_weight)[:, :, None]
        pixels = pixels * (1.0 - blend) + 255.0 * blend
        image = Image.fromarray(np.uint8(np.clip(pixels, 0, 255)), "RGB")
        enlarged = image.resize((1280, 1280), Image.Resampling.LANCZOS)
        enhanced = enlarged.filter(ImageFilter.UnsharpMask(radius=1.1, percent=115, threshold=3))
        enhanced.save(output, "JPEG", quality=91, optimize=True, progressive=True, subsampling=0)

print("100 frames HD créées en 1280 × 1280 px.")
