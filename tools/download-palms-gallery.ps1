$ErrorActionPreference = 'Stop'

$target = Join-Path (Split-Path -Parent $PSScriptRoot) 'assets\images\gallery-palms'
New-Item -ItemType Directory -Path $target -Force | Out-Null

$files = @(
  @('11AJoEnDWY9s9nBfyea0KofaqhOMC_wJE','IMG-20250930-WA0008.jpg'),
  @('1lCW7kQjv7-odaSybu5H816MVqqEjao8d','IMG-20250930-WA0009.jpg'),
  @('1ZAKTiSrCRJsecAnRILEYghq9dRkIVm4e','IMG-20250930-WA0010.jpg'),
  @('1xgaiPLQD3Cuopgivzz66GprLn8j329C1','IMG-20250930-WA0011.jpg'),
  @('1srsUTk_P2uWGLgaYh_gNVSxAkcDk5Kcd','IMG-20250930-WA0012.jpg'),
  @('1t1OOfVzjhHyDtaotxOd3cep0Xv4--b9I','IMG-20250930-WA0013.jpg'),
  @('1rLDB-UcyxGTLJI03pvZW0pEy1cBKnoJ4','IMG-20250930-WA0014.jpg'),
  @('1IzUPWAffE8CF3j6OxlqdJ9ie1JMi_R6Q','IMG-20250930-WA0015.jpg'),
  @('1v1vcrJqTzY6QcN0pZYPM1g7opsfxRcqk','IMG-20250930-WA0016.jpg'),
  @('11IcZXFadTkJ4SHM2ioyncvm2vAS7V1OD','IMG-20250930-WA0017.jpg'),
  @('1_q3x0221Evnu9wpXTfBDgrSzeMFShwWg','IMG-20250930-WA0018.jpg'),
  @('1IXV2ZehCa7IsLG0AwVPmT4ZiMQg8xX3P','IMG-20250930-WA0019.jpg'),
  @('1k_Tgy3vxh1BGmVF8HJITdD-MgTPVi72k','IMG-20250930-WA0020.jpg'),
  @('1RYSbu7xHWLWiKmCyu_nGD2dHgXcAiO9L','IMG-20250930-WA0021.jpg'),
  @('1xx9Sr_QB7mtGTEICYPNJp56XQo_fd_0d','IMG-20250930-WA0022.jpg'),
  @('16HpzHQ9rhqQcHw9VbkUZK9pfsEiGPkXD','IMG-20250930-WA0023.jpg'),
  @('1uJlEZNZ9RDimfx8EsESiYHUGWsqbC5sr','IMG-20250930-WA0024.jpg'),
  @('1drTeTpeuoJ7JUNJZx9OxurQkIdyYAFny','IMG-20250930-WA0025.jpg'),
  @('1mOBnw8ah2muEPeUUkXeNCF4M8-P7wNFw','IMG-20250930-WA0026.jpg'),
  @('1L1kCqbsVkY5IKU0UkO3H8c-GXzSIJMyG','IMG-20250930-WA0028.jpg'),
  @('1FSkONs33aUONGHU_urBYecXOcb-BHHv7','IMG-20250930-WA0030.jpg'),
  @('1KZZOdlYc6y4qELCBtaYSdT5TnC7ks8So','IMG-20250930-WA0031.jpg'),
  @('1helPdSakWZa3Aj57aKhpFCv0LabpJyae','IMG-20250930-WA0032.jpg'),
  @('1Hwoe4REtFQF4D5TauxChH0tqOzUpLDPc','IMG-20250930-WA0033.jpg'),
  @('1E8CP4VVaz6WCmxr-BWz68OjwW0iCQNxb','IMG-20250930-WA0034.jpg'),
  @('1zGw9UsEnE0F2sQPAwbBL0S--O_HHOYMx','IMG-20250930-WA0035.jpg'),
  @('1mjZQIV4x3_D5pb2Wm7ExdKOfNZ9yIGRg','IMG-20250930-WA0036.jpg'),
  @('1R2OX_R3UwGJBzWOFss_g1KqAbgI2aoJY','IMG-20250930-WA0037.jpg'),
  @('1kX-r26upvEQ2U1UCzIDedXLVIIp4RFox','IMG-20250930-WA0038.jpg'),
  @('1DuANvnauJZFlRRTQmno9alvc66ZOjxmq','IMG-20250930-WA0039.jpg'),
  @('1f52A--MQ5bfXorTDag3h-oSm8rl4kaT2','IMG-20250930-WA0040.jpg'),
  @('186ymlXDoNtN-aKJaZxCBckENtfgI9Hkn','IMG-20250930-WA0041.jpg'),
  @('1upQQTCvffJZFZGIhO03DhYl-lYWjfT06','IMG-20250930-WA0042.jpg'),
  @('1MWa87BuGKzEbHlrZnO50GJ9i9Impo7_g','IMG-20250930-WA0043.jpg'),
  @('1nVgZ9AL32Is7pofa5u5VEbLGvTTdGrRA','IMG-20250930-WA0044.jpg'),
  @('1x4D1gSvn-N-MFJLbjxjadLdGX3lpsPru','IMG-20250930-WA0045.jpg')
)

foreach ($file in $files) {
  $destination = Join-Path $target $file[1]
  if (-not (Test-Path -LiteralPath $destination)) {
    $url = "https://drive.usercontent.google.com/download?id=$($file[0])&export=download&confirm=t"
    Invoke-WebRequest -Uri $url -OutFile $destination
  }
}

Get-ChildItem -LiteralPath $target -File | Select-Object Name, Length
