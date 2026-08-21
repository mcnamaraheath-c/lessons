/* =====================================================================
   SHADOW WAR — shared indexed palette (single source of truth for color)
   Every sprite, tile, prop, and effect references colors by index only.
   Hex values were lifted from the shipped pilot art so the refactor is
   pixel-faithful. See ART_BIBLE.md for usage rules.

   HARD RULE: british-crimson / british-crimson-dark are reserved for
   British soldiers and explicitly British objects. The registry audit
   (spriteRegistry.auditCrimson) enforces this at load time.
   ===================================================================== */
(function(NS){
"use strict";

// [index, name, css color (hex or rgba), intended use]
const DEF=[
  [ 0, "transparent",           null,                      "empty pixel — never drawn"],
  [ 1, "outline-dark",          "#10161f",                 "outlines, eyes, night ink, well interior"],
  [ 2, "midnight-blue",         "#1a2332",                 "night sky, the black petticoat, deep cloth shadow"],
  [ 3, "deep-navy",             "#243247",                 "window glass, raised UI panels"],
  [ 4, "paper-cream",           "#f2e8d5",                 "paper, white handkerchiefs, lightest highlights"],
  [ 5, "warm-cream",            "#e0d2b4",                 "plaster walls, bonnets, aprons, the clothesline cord"],
  [ 6, "candle-amber",          "#e8a33d",                 "door handles, lantern cores, the single accent color"],
  [ 7, "muted-gold",            "#b9985a",                 "straw hats, dry-grass accents, tavern signage"],
  [ 8, "earth-dark",            "#7a5f3f",                 "path speckle (dark)"],
  [ 9, "earth-medium",          "#8a6f4d",                 "dirt path base"],
  [10, "earth-light",           "#97805c",                 "path speckle (light), straw-hat brim"],
  [11, "grass-dark",            "#3f5937",                 "grass noise (dark)"],
  [12, "grass-medium",          "#4a6741",                 "grass base"],
  [13, "grass-light",           "#55764b",                 "grass noise (light)"],
  [14, "water-dark",            "#24405e",                 "Sound water base"],
  [15, "water-medium",          "#2c4d6e",                 "wave lines (animated)"],
  [16, "water-light",           "#3a5f83",                 "sparse water sparkle (reserved, use sparingly)"],
  [17, "weathered-gray",        "#8f9aa5",                 "well stones, fieldstone"],
  [18, "stone-light",           "#a8b2bc",                 "stone rims and highlights"],
  [19, "roof-brown",            "#6e5137",                 "roofs, house timbers, fence rails, dock edge"],
  [20, "wood-dark",             "#4a3620",                 "door planks, tree trunks, dock plank lines"],
  [21, "wood-medium",           "#5a4029",                 "dock boards, fence posts, roof shading"],
  [22, "wood-light",            "#7d5f42",                 "roof ridge, post tops, worn-wood highlight"],
  [23, "leaf-dark",             "#2f4a2e",                 "tree canopy base"],
  [24, "leaf-light",            "#3b5c39",                 "canopy highlight"],
  [25, "sand-medium",           "#c9b489",                 "shoreline sand base; also rope/cord tan"],
  [26, "sand-dark",             "#b9a273",                 "sand speckle"],
  [27, "skin-light",            "#d9a877",                 "skin tone"],
  [28, "skin-medium",           "#c98d5f",                 "skin tone (weathered)"],
  [29, "skin-deep",             "#7a5232",                 "skin tone (Jonah Greene)"],
  [30, "hair-dark",             "#33261a",                 "near-black hair"],
  [31, "hair-brown",            "#5b4225",                 "brown hair"],
  [32, "hair-gray",             "#8f8f8f",                 "gray hair"],
  [33, "hair-white",            "#cfcfcf",                 "white hair (elderly)"],
  [34, "cloth-blue",            "#3a5a7a",                 "Anna's dress — civilian blue"],
  [35, "cloth-brown",           "#6e5137",                 "civilian brown coats (same hex as roof-brown by design)"],
  [36, "cloth-gray",            "#5f6b7a",                 "civilian gray dress (Widow Foster)"],
  [37, "cloth-green",           "#3f6b52",                 "civilian green (Jonah's waistcoat)"],
  [38, "cloth-navy",            "#2c3e57",                 "seafarer navy (Brewster's peacoat)"],
  [39, "cloth-drab",            "#4c5a49",                 "civilian drab (Mr. Hart)"],
  [40, "felt-dark",             "#2b2f36",                 "tricorn and cap felt"],
  [41, "iron-dark",             "#14161c",                 "British shako body — the tall-hat silhouette"],
  [42, "iron-band",             "#3a3f4a",                 "shako plate band"],
  [43, "boot-dark",             "#2b2418",                 "legs, boots, shoes"],
  [44, "british-crimson",       "#a83232",                 "RESERVED: British coats + explicitly British objects only"],
  [45, "british-crimson-dark",  "#7c2323",                 "RESERVED: crimson shading, same restriction"],
  [46, "white-crossbelt",       "#e8d9b0",                 "British crossbelt webbing"],
  [47, "restricted-zone-tint",  "rgba(168,50,50,0.10)",    "static ground tint over restricted shore/dock"],
  [48, "sight-cone-tint",       "rgba(168,50,50,0.20)",    "guard sight cone fill"],
  [49, "sight-cone-edge",       "rgba(168,50,50,0.45)",    "guard sight cone outline"],
  [50, "shadow-tint",           "rgba(0,0,0,0.25)",        "small drop shadows under characters"],
  [51, "lantern-glow",          "rgba(232,163,61,0.28)",   "dusk lantern radial core (fades to alpha 0)"],
  [52, "dusk-tint",             "rgba(12,18,34,0.45)",     "full-screen night wash"],
];

const colors=[], byName={}, info=[];
DEF.forEach(([i,name,css,use])=>{
  if(colors[i]!==undefined) throw new Error("palette: duplicate index "+i);
  if(byName[name]!==undefined) throw new Error("palette: duplicate name "+name);
  colors[i]=css; byName[name]=i; info[i]={index:i,name,css,use};
});

NS.palette={
  colors, byName, info,
  size: colors.length,
  css(i){ return colors[i]||null; },
  index(name){
    if(!(name in byName)) throw new Error("palette: unknown color name '"+name+"'");
    return byName[name];
  },
  isValidIndex(i){ return Number.isInteger(i) && i>=0 && i<colors.length; },
  /* indexes that may only appear in sprites whose meta.faction === "british" */
  BRITISH_ONLY:[byName["british-crimson"], byName["british-crimson-dark"]],
};

})(globalThis.SWART = globalThis.SWART || {});
