#!/usr/bin/env node
/* Build step: embed images from img/ and img/generated/ into the final single file.
   Usage: node build_embed.js
   Reads  caravan_merchants_road.src.html  (placeholder: "__IMG_JSON__")
   Writes caravan_merchants_road.html
   Missing images are simply skipped — the lesson draws placeholder art for them. */
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SRC = path.join(HERE, 'caravan_merchants_road.src.html');
const OUT = path.join(HERE, 'caravan_merchants_road.html');

/* key used by the lesson  ->  file on disk (first that exists wins) */
const MAP = {
  /* real, public-domain / CC exhibits (see img/SOURCES.md) */
  sancai_camel:    ['img/sancai_camel_musicians.jpg'],
  zhang_qian:      ['img/zhang_qian_mural.jpg'],
  diamond_sutra:   ['img/diamond_sutra_868.jpg'],
  afrasiab:        ['img/afrasiab_mural_dignitaries.jpg'],
  baghdad_library: ['img/baghdad_library_1237.jpg'],
  quadriga_silk:   ['img/byzantine_quadriga_silk.jpg'],
  /* teacher-generated art (see IMAGE_PROMPTS.md) */
  cover:              ['img/generated/cover_caravan_dusk.png', 'img/generated/cover_caravan_dusk.jpg'],
  bg_changan:         ['img/generated/bg_changan_market.png', 'img/generated/bg_changan_market.jpg'],
  bg_jadegate:        ['img/generated/bg_jade_gate_desert.png', 'img/generated/bg_jade_gate_desert.jpg'],
  bg_kashgar:         ['img/generated/bg_kashgar_bazaar.png', 'img/generated/bg_kashgar_bazaar.jpg'],
  bg_samarkand:       ['img/generated/bg_samarkand_caravanserai.png', 'img/generated/bg_samarkand_caravanserai.jpg'],
  bg_baghdad:         ['img/generated/bg_baghdad_round_city.png', 'img/generated/bg_baghdad_round_city.jpg'],
  bg_constantinople:  ['img/generated/bg_constantinople_harbor.png', 'img/generated/bg_constantinople_harbor.jpg'],
  npc_uncle_wei:      ['img/generated/npc_uncle_wei.png', 'img/generated/npc_uncle_wei.jpg'],
  npc_brother_kong:   ['img/generated/npc_brother_kong.png', 'img/generated/npc_brother_kong.jpg'],
  npc_old_yusuf:      ['img/generated/npc_old_yusuf.png', 'img/generated/npc_old_yusuf.jpg'],
  npc_vandak:         ['img/generated/npc_vandak.png', 'img/generated/npc_vandak.jpg'],
  npc_roshan:         ['img/generated/npc_roshan.png', 'img/generated/npc_roshan.jpg'],
  npc_scholar_salim:  ['img/generated/npc_scholar_salim.png', 'img/generated/npc_scholar_salim.jpg'],
  npc_anna:           ['img/generated/npc_anna_silk_buyer.png', 'img/generated/npc_anna_silk_buyer.jpg'],
};

const mime = (f) => f.endsWith('.png') ? 'image/png' : 'image/jpeg';
const img = {};
let embedded = 0, missing = [];
for (const [key, candidates] of Object.entries(MAP)) {
  const found = candidates.map(c => path.join(HERE, c)).find(p => fs.existsSync(p));
  if (!found) { missing.push(key); continue; }
  const data = fs.readFileSync(found);
  img[key] = `data:${mime(found)};base64,${data.toString('base64')}`;
  embedded++;
}

let html = fs.readFileSync(SRC, 'utf8');
const placeholder = '"__IMG_JSON__"';
if (!html.includes(placeholder)) {
  console.error('ERROR: placeholder not found in source file');
  process.exit(1);
}
html = html.replace(placeholder, JSON.stringify(img));
fs.writeFileSync(OUT, html);

const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`Built ${path.basename(OUT)} — ${kb} KB, ${embedded} images embedded.`);
if (missing.length) console.log(`Not yet present (placeholder art will draw instead): ${missing.join(', ')}`);
