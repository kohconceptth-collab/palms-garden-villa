from pathlib import Path
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "images" / "gallery-palms"
WEB = SOURCE / "web"
THUMBS = SOURCE / "thumbs"
WEB.mkdir(exist_ok=True)
THUMBS.mkdir(exist_ok=True)

files = sorted(SOURCE.glob("*.jpg"))
for source in files:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        web = image.copy()
        web.thumbnail((1800, 1400), Image.Resampling.LANCZOS)
        web.save(WEB / f"{source.stem}.webp", "WEBP", quality=84, method=6)
        thumb = ImageOps.fit(image, (720, 540), Image.Resampling.LANCZOS)
        thumb.save(THUMBS / f"{source.stem}.webp", "WEBP", quality=80, method=6)

cell_w, cell_h = 300, 230
cols = 4
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * cell_w, rows * cell_h), "white")
draw = ImageDraw.Draw(sheet)
for index, source in enumerate(files):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        preview = ImageOps.fit(image, (cell_w, cell_h - 28), Image.Resampling.LANCZOS)
    x = (index % cols) * cell_w
    y = (index // cols) * cell_h
    sheet.paste(preview, (x, y))
    draw.rectangle((x, y + cell_h - 28, x + cell_w, y + cell_h), fill="white")
    draw.text((x + 8, y + cell_h - 22), source.stem.replace("IMG-20250930-", ""), fill="black")

sheet.save(SOURCE / "contact-sheet.jpg", quality=88)
print(f"Processed {len(files)} images")
