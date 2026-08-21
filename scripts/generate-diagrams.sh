#!/bin/sh
# Regenerates docs/diagrams/*.jpg from the .mmd Mermaid sources in the same
# folder. mermaid-cli only writes .png/.svg/.pdf, so each render is converted
# to .jpg with `sips` (bundled with macOS). On another OS, swap the `sips`
# line for an equivalent PNG->JPEG converter (e.g. ImageMagick's `convert`).
set -eu

cd "$(dirname "$0")/.."

for source in docs/diagrams/*.mmd; do
  name=$(basename "$source" .mmd)
  png="docs/diagrams/$name.png"
  jpg="docs/diagrams/$name.jpg"

  echo "Rendering $name..."
  npx --yes @mermaid-js/mermaid-cli -i "$source" -o "$png" -b white -s 2
  sips -s format jpeg "$png" --out "$jpg" >/dev/null
  rm -f "$png"
done

echo "Done. Regenerated $(ls docs/diagrams/*.jpg | wc -l | tr -d ' ') diagrams."
