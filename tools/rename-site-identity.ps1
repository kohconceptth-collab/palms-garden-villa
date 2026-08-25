$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$extensions = @('.html', '.js', '.py', '.txt', '.xml', '.webmanifest')
$files = Get-ChildItem -LiteralPath $root -Recurse -File | Where-Object {
  $extensions -contains $_.Extension -or $_.Name -eq '.htaccess'
}

$replacements = @(
  @('https://elenaparadisevilla.com', 'https://palmsgardenvilla.kohconcept.com'),
  @('elenaparadisevilla.com', 'palmsgardenvilla.kohconcept.com'),
  @('Elena Paradise Villa', 'Palm Garden Villa'),
  @('Elena Paradise', 'Palm Garden'),
  @('ELENA PARADISE', 'PALM GARDEN'),
  @('PARADISE VILLA', 'GARDEN VILLA'),
  @('ELENA', 'PALM'),
  @('elena-paradise-villa.jpg', 'palm-garden-villa.jpg')
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
