$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$extensions = @('.html', '.css', '.js', '.py', '.txt', '.xml', '.webmanifest')
$files = Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
  $extensions -contains $_.Extension -or $_.Name -eq '.htaccess'
}

$replacements = @(
  @('Palm Garden Villa', 'Palms Garden Villa'),
  @('PALM GARDEN', 'PALMS GARDEN'),
  @('Palm Garden', 'Palms Garden'),
  @('four bedrooms', 'three bedrooms'),
  @('4 bedrooms', '3 bedrooms'),
  @('<div class="stat"><b>4</b> BEDROOMS</div>', '<div class="stat"><b>3</b> BEDROOMS</div>'),
  @('<div class="fact"><b>4</b>BEDROOMS</div>', '<div class="fact"><b>3</b>BEDROOMS</div>'),
  @('numberOfBedrooms":4', 'numberOfBedrooms":3'),
  @('<div class="fact"><b>650 m²</b>OUTDOOR AREA</div>', '<div class="fact"><b>800 m²</b>LAND</div>'),
  @('https://maps.app.goo.gl/1RVdT7AKJeCSSbkGA', 'https://maps.app.goo.gl/F4maNtN58nHHMgrv8?g_st=iw'),
  @('https://maps.app.goo.gl/F4maNtN58nHHMgrv8?g_st=iw', 'https://maps.app.goo.gl/FGqQaWS7jSWPc6JS9'),
  @('43/52 Soi Kokyang, Moo 1', 'Soi Sylvia'),
  @('43/52 Soi Kokyang, Moo 1<br>Rawai, Mueang, Phuket District 83130', 'Soi Sylvia<br>Rawai, Mueang, Phuket District 83130'),
  @('"streetAddress":"Soi Sylvia"', '"streetAddress":"67/82 Soi Sylvia"'),
  @('<br>Soi Sylvia<br>Rawai, Mueang, Phuket District 83130', '<br>67/82 Soi Sylvia<br>Rawai, Mueang, Phuket District 83130'),
  @('for up to eight guests', 'for up to six guests'),
  @('Maximum capacity: 8 guests', 'Maximum capacity: 6 guests'),
  @('Maximum occupancy: 8 guests', 'Maximum occupancy: 6 guests'),
  @('Capacité maximale : 8 personnes', 'Capacité maximale : 6 personnes'),
  @('最多入住 8 位客人', '最多入住 6 位客人'),
  @('ผู้เข้าพักสูงสุด 8 คน', 'ผู้เข้าพักสูงสุด 6 คน'),
  @('Максимальная вместимость: 8 гостей', 'Максимальная вместимость: 6 гостей'),
  @('"maxValue":8', '"maxValue":6'),
  @('<div class="stat"><b>8</b> GUESTS</div>', '<div class="stat"><b>6</b> GUESTS</div>'),
  @('four bathrooms', 'three bathrooms'),
  @('4 bathrooms', '3 bathrooms'),
  @('4 salles de bains', '3 salles de bains'),
  @('5 bathrooms', '3 bathrooms'),
  @('5 salles de bains', '3 salles de bains'),
  @('5 ห้องน้ำ', '3 ห้องน้ำ'),
  @('5 ванных комнат', '3 ванные комнаты'),
  @('5 间浴室', '3 间浴室'),
  @('"numberOfBathroomsTotal":4', '"numberOfBathroomsTotal":3'),
  @('<div class="fact"><b>4</b>BATHROOMS</div>', '<div class="fact"><b>3</b>BATHROOMS</div>'),
  @('<b>320 m²</b> OF LUXURY', '<b>250 m²</b> VILLA SIZE'),
  @('private 10 × 5 m swimming pool', 'private 12 × 5 m swimming pool'),
  @('<b>10×5 m</b>POOL', '<b>12×5 m</b>POOL'),
  @('<b>1 LARGE TV</b>', '<b>85″ SMART TV</b>'),
  @('<b>85″ SMART TV</b>', '<b>85" CINEMA-SIZE SMART TV</b>'),
  @('NETFLIX INCLUDED', 'BOX TV + NETFLIX'),
  @('<b>1 TV</b>NETFLIX', '<b>85″ TV</b>BOX TV + NETFLIX'),
  @('<b>1 + 1/2</b>KITCHENS', '<b>2</b>INDOOR + OUTDOOR<br>KITCHENS'),
  @('BBQ & OUTDOOR DINING', 'OUTDOOR KITCHEN & SALA'),
  @('ENJOY MEALS OUTSIDE', 'SPACIOUS COVERED DINING'),
  @('<b>1</b>COVERED PARKING<br><span style="font-size:.82em">CAR + MOTORBIKE</span>', '<b>2 CARS</b>COVERED PARKING'),
  @('Discover Palms Garden Villa, a private luxury villa in Rawai, Phuket with three bedrooms, three bathrooms, a tropical garden and a private 12 × 5 m swimming pool.', 'Discover Palms Garden Villa in Rawai, Phuket: 3 bedrooms, 3 bathrooms, a 12 × 5 m private pool, tropical garden and 800 m² of land.'),
  @('"image":["https://palmgardenvilla.kohconcept.com/assets/images/gallery-palms/web/IMG-20250930-WA0038.webp","https://palmgardenvilla.kohconcept.com/assets/images/gallery-palms/web/IMG-20250930-WA0038.webp"]', '"image":["https://palmgardenvilla.kohconcept.com/assets/images/gallery-palms/web/IMG-20250930-WA0038.webp","https://palmgardenvilla.kohconcept.com/assets/images/gallery-palms/web/IMG-20250930-WA0030.webp"]'),
  @('elena-favicon-192.png', 'palms-favicon-192.png'),
  @("['Villa for sale','Villa à vendre','วิลล่าสำหรับขาย','Вилла на продажу'],['3 bedrooms Rawai','4 chambres à Rawai','4 ห้องนอน ราไวย์','4 спальни, Раваи']", "['Villa information','Informations sur la villa','ข้อมูลวิลล่า','Информация о вилле'],['3 bedrooms Rawai','3 chambres à Rawai','3 ห้องนอน ราไวย์','3 спальни, Раваи']"),
  @("'Information about the villa':'别墅信息','3 bedrooms':'4 间卧室','3 bathrooms':'3 间浴室','Private salted pool — 8.5 × 4 m':'私人盐水泳池 — 8.5 × 4 米','Maximum occupancy: 6 guests':'最多入住 6 位客人','Living room and fully equipped kitchen':'客厅和设施齐全的厨房','Covered parking for 2 cars':'可停放 2 辆车的有盖停车位','490 m² land · 180 m² living space':'占地 490 平方米 · 室内面积 180 平方米'", "'Information about the villa':'别墅信息','3 bedrooms':'3 间卧室','3 bathrooms':'3 间浴室','Private pool — 12 × 5 m':'私人泳池 — 12 × 5 米','Maximum occupancy: 6 guests':'最多入住 6 位客人','Living room and fully equipped kitchen':'客厅和设施齐全的厨房','Covered parking for 2 cars':'可停放 2 辆车的有盖停车位','800 m² land · 250 m² villa':'占地 800 平方米 · 别墅面积 250 平方米'"),
  @("'Villa for sale':'别墅出售','3 bedrooms Rawai':'拉威四卧室别墅'", "'Villa information':'别墅信息','3 bedrooms Rawai':'拉威三卧室别墅'"),
  @('<meta name="theme-color" content="#174c3b">', '<meta name="theme-color" content="#06131c">'),
  @('<div class="panel review-panel"><h3>Share your experience</h3><p>Your review matters to us.</p><img class="google-review-logo" src="assets/images/image-018.webp" alt="Google 5 stars" loading="lazy" decoding="async" width="1400" height="583"><a class="review-button" href="https://share.google/38rSPLKH6VmrVjPFg" target="_blank" rel="noopener noreferrer">Leave a review →</a></div>', '<article class="panel wine-card" aria-label="RA Wine recommendation"><div class="wine-card__content"><span class="wine-card__kicker">Our Wine Shop Selection</span><h3 class="notranslate" translate="no">RA Wine</h3><a class="wine-map-button" href="https://maps.app.goo.gl/AhNvmaayVMQ993Y8A" target="_blank" rel="noopener noreferrer">View on Google Maps →</a></div></article>'),
  @('https://www.google.com/maps/search/?api=1&amp;query=RA+Wine+Rawai+Phuket', 'https://maps.app.goo.gl/AhNvmaayVMQ993Y8A'),
  @('<h1>LUXURY, NATURE<br>&amp; ABSOLUTE<br><span>SERENITY</span></h1>', '<h1>PRIVATE PARADISE<br>UNDER THE<br><span>PALMS</span></h1>'),
  @('<h1>LUXURY, NATURE<br>& ABSOLUTE<br><span>SERENITY</span></h1>', '<h1>PRIVATE PARADISE<br>UNDER THE<br><span>PALMS</span></h1>'),
  @('<h1>PRIVATE PARADISE<br>UNDER THE<br><span>PALMS</span></h1>', '<h1>TROPICAL LUXURY<br>BENEATH THE<br><span>PALMS</span></h1>'),
  @('<h2>Space, luxury<br>and serenity</h2>', '<h2>Palm garden living,<br>entirely yours</h2>'),
  @('Nestled in the heart of Rawai, Palms Garden Villa offers an idyllic setting for an unforgettable holiday. Enjoy generous spaces, elegant décor and services designed for your comfort.', 'Wake up to palm-framed pool views, unwind in the tropical garden and share long evenings beneath the spacious sala. Set on 800 m² of private grounds, Palms Garden Villa is designed for effortless stays in Rawai.'),
  @('<section><h3>Website Publisher</h3><p>Palms Garden Villa<br>Phuket, Thailand<br>Website Owner: Chavdar Tiholov<br>Contact: <a href="mailto:office@biomind.bg">office@biomind.bg</a></p></section><section><h3>Hosting Provider</h3><p>SuperHosting.BG Ltd.<br>5 Nikola Tesla Str., BSR 2, 4th Floor<br>1574 Sofia, Bulgaria<br>UIN: 131449987<br>superhosting.bg</p></section>', '<section><h3>Website Publisher</h3><p>Palms Garden Villa<br>Phuket, Thailand<br>Website Owner: Michel Henlin</p></section><section><h3>Hosting Provider</h3><p>Website hosting and technical management: Koh Concept<br>Infrastructure provider: HOSTINGER PTE LTD<br>16 Raffles Quay, #33-03, Hong Leong Building<br>Singapore 048581<br>Server location: Malaysia<br>hostinger.com</p></section>'),
  @('Website Owner: Lionel LOPEZ', 'Website Owner: Michel Henlin'),
  @('palmgardenvilla.kohconcept.com', 'palmsgardenvilla.kohconcept.com'),
  @("../assets/images/image-001.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp"),
  @("../assets/images/image-001-mobile.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp"),
  @("../assets/images/image-002.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0030.webp"),
  @("../assets/images/gallery-elena/06-terrasse-piscine.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0022.webp"),
  @("../assets/images/villa-preview-bathroom.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0024.webp"),
  @("../assets/images/image-004.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp"),
  @("../assets/images/image-005.webp", "../assets/images/gallery-palms/web/IMG-20250930-WA0038.webp"),
  @('<a class="brand" id="fullscreenBrand"', '<a class="brand notranslate" translate="no" id="fullscreenBrand"'),
  @('<div class="brand"><img class="footer-logo"', '<div class="brand notranslate" translate="no"><img class="footer-logo"')
)

$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  $updated = $content
  foreach ($entry in $replacements) {
    $updated = $updated.Replace($entry[0], $entry[1])
  }
  if ($updated -ne $content) {
    [System.IO.File]::WriteAllText($file.FullName, $updated, $utf8NoBom)
  }
}
