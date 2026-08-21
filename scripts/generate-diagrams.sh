#!/bin/sh
# Regenerates docs/images/*.jpg from the .mmd Mermaid sources in
# docs/diagrams/. mermaid-cli only writes .png/.svg/.pdf, so each render is
# converted to .jpg with `sips` (bundled with macOS). On another OS, swap the
# `sips` line for an equivalent PNG->JPEG converter (e.g. ImageMagick's
# `convert`).
set -eu

cd "$(dirname "$0")/.."

mkdir -p docs/images

for source in docs/diagrams/*.mmd; do
  name=$(basename "$source" .mmd)
  png="docs/images/$name.png"
  jpg="docs/images/$name.jpg"

  echo "Rendering $name..."
  npx --yes @mermaid-js/mermaid-cli -i "$source" -o "$png" -b white -s 2
  sips -s format jpeg "$png" --out "$jpg" >/dev/null
  rm -f "$png"
done

echo "Done. Regenerated $(ls docs/images/*.jpg | wc -l | tr -d ' ') diagrams."
