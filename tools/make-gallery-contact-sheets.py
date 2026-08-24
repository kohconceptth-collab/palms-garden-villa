from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images" / "gallery-elena" / "full"
OUTPUT = ROOT / "gallery-contact-sheets"
OUTPUT.mkdir(exist_ok=True)

files = sorted(SOURCE.glob("*.webp"))
font = ImageFont.load_default(size=18)
columns, rows = 4, 4
cell_w, cell_h, label_h = 400, 300, 34

for page, offset in enumerate(range(0, len(files), columns * rows), 1):
    sheet = Image.new("RGB", (columns * cell_w, rows * (cell_h + label_h)), "white")
    draw = ImageDraw.Draw(sheet)
    for position, path in enumerate(files[offset : offset + columns * rows]):
        x = (position % columns) * cell_w
        y = (position // columns) * (cell_h + label_h)
        with Image.open(path) as opened:
            thumb = ImageOps.contain(opened.convert("RGB"), (cell_w, cell_h), Image.Resampling.LANCZOS)
        px = x + (cell_w - thumb.width) // 2
        py = y + (cell_h - thumb.height) // 2
        sheet.paste(thumb, (px, py))
        draw.rectangle((x, y + cell_h, x + cell_w, y + cell_h + label_h), fill="white")
        draw.text((x + 8, y + cell_h + 7), path.stem, fill="black", font=font)
    sheet.save(OUTPUT / f"gallery-{page}.jpg", quality=88)

print(f"Created {(len(files) + columns * rows - 1) // (columns * rows)} contact sheets for {len(files)} photos.")
