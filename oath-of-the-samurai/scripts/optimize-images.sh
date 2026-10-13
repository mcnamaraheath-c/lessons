#!/usr/bin/env bash
# Resize and recompress every image in images/ so the game loads fast on Chromebooks.
# Needs ImageMagick (https://imagemagick.org). Run from the oath-of-the-samurai folder:
#   bash scripts/optimize-images.sh
# Each image is shrunk to at most 1600px wide (never enlarged), saved as JPEG at
# quality 82, and stripped of metadata. PNG/WebP files are converted to .jpg with
# the same name, because the game looks for .jpg filenames.
set -euo pipefail
cd "$(dirname "$0")/../images"

if command -v magick >/dev/null 2>&1; then IM="magick"
elif command -v convert >/dev/null 2>&1; then IM="convert"
else
  echo "ImageMagick not found; using Python with Pillow instead." >&2
  python3 - <<'PY'
from PIL import Image
import glob, os
for f in sorted(glob.glob('*.[jJ][pP][gG]')+glob.glob('*.[jJ][pP][eE][gG]')+glob.glob('*.[pP][nN][gG]')+glob.glob('*.[wW][eE][bB][pP]')):
    im = Image.open(f)
    if im.mode in ('RGBA', 'LA', 'P'):
        rgba = im.convert('RGBA'); bg = Image.new('RGB', im.size, (0xF4, 0xED, 0xE0))
        bg.paste(rgba, mask=rgba.split()[-1]); im = bg
    else:
        im = im.convert('RGB')
    w, h = im.size
    if w > 1600: im = im.resize((1600, round(h * 1600 / w)), Image.LANCZOS)
    out = os.path.splitext(f)[0] + '.jpg'
    im.save(out, 'JPEG', quality=82, optimize=True, progressive=True)
    if f.lower() != out.lower(): os.remove(f)
    print(out, os.path.getsize(out) // 1024, 'KB')
PY
  exit 0
fi

shopt -s nullglob nocaseglob
for f in *.jpg *.jpeg *.png *.webp; do
  out="${f%.*}.jpg"
  tmp="$(mktemp --suffix=.jpg)"
  $IM "$f" -auto-orient -resize '1600x>' -background '#F4EDE0' -flatten \
      -strip -interlace Plane -quality 82 "$tmp"
  mv "$tmp" "$out"
  if [ "${f,,}" != "${out,,}" ]; then rm -f "$f"; fi
  echo "$out  $(du -k "$out" | cut -f1) KB"
done
