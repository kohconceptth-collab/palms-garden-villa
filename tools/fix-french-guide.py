from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "index.html"
text = path.read_text(encoding="utf-8")

replacements = {
    '<li class="info-section-title">Housekeeping</li>': '<li class="info-section-title">Entretien</li>',
    '⌂ Villa cleaning, bedsheets and towels changed once a week.': '⌂ Nettoyage de la villa, draps et serviettes changés une fois par semaine.',
    '⌂ Pool cleaned twice a week.': '⌂ Piscine nettoyée deux fois par semaine.',
    '<li class="info-section-title">Electricity <span>Extra</span></li>': '<li class="info-section-title">Électricité <span>En supplément</span></li>',
    '✦ Baby cot available upon request': '✦ Lit bébé disponible sur demande',
}

for source, target in replacements.items():
    if source not in text:
        raise RuntimeError(f"Expected text not found: {source}")
    text = text.replace(source, target, 1)

path.write_text(text, encoding="utf-8", newline="")
print("French guide labels corrected.")
