from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "index.html"
text = path.read_text(encoding="utf-8")
text = text.replace("assets/videos/video-001.mp4", "assets/videos/video-001-web.mp4")
text = text.replace("assets/videos/video-002.mp4", "assets/videos/video-002-web.mp4")
path.write_text(text, encoding="utf-8", newline="")
print("Optimized villa video references enabled.")
