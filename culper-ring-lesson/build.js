#!/usr/bin/env node
/* =====================================================================
   SHADOW WAR — asset bundle builder
   The student deliverable stays ONE self-contained index.html (spec §2).
   Authors edit modules under src/world/; this script concatenates them
   (in dependency order) into index.html between the marker comments.

   Usage:
     node build.js          rebuild the bundle inside index.html
     node build.js --check  exit 1 if index.html is stale (for tests/CI)

   No dependencies. Do not add any.
   ===================================================================== */
"use strict";
const fs=require("fs");
const path=require("path");

const ROOT=__dirname;
const HTML=path.join(ROOT,"index.html");
const START="//<<WORLD-ART-BUNDLE-START>>";
const END="//<<WORLD-ART-BUNDLE-END>>";

/* dependency order — palette first, init last */
const MODULES=[
  "src/world/art/palette.js",
  "src/world/art/pixelUtils.js",
  "src/world/art/spriteRegistry.js",
  "src/world/art/illustrations/illusManifest.js",
  "src/world/tiles/terrainTiles.js",
  "src/world/tiles/natureTiles.js",
  "src/world/tiles/structureTiles.js",
  "src/world/tiles/propTiles.js",
  "src/world/tiles/ambientProps.js",
  "src/world/characters/figureKit.js",
  "src/world/characters/annaSprites.js",
  "src/world/characters/npcSprites.js",
  "src/world/characters/guardSprites.js",
  "src/world/ui/uiMarkers.js",
  "src/world/effects/worldEffects.js",
  "src/world/effects/sightCones.js",
  "src/world/maps/mapLegend.js",
  "src/world/maps/setauketMap.js",
  "src/world/rendering/worldRenderer.js",
  "src/world/rendering/entityRenderer.js",
  "src/world/rendering/effectRenderer.js",
  "src/world/rendering/compose.js",
  "src/world/previews/assetPreview.js",
  "src/world/init.js",
];

function bundle(){
  return MODULES.map(rel=>{
    const src=fs.readFileSync(path.join(ROOT,rel),"utf8").trim();
    return "/* ---- "+rel+" ---- */\n"+src;
  }).join("\n\n");
}

function main(){
  const check=process.argv.includes("--check");
  const html=fs.readFileSync(HTML,"utf8");
  const a=html.indexOf(START), b=html.indexOf(END);
  if(a<0||b<0||b<a){ console.error("build: markers not found in index.html"); process.exit(1); }
  const current=html.slice(a+START.length,b).trim();
  const next=bundle();
  if(check){
    if(current!==next.trim()){ console.error("build: index.html bundle is STALE — run `node build.js`"); process.exit(1); }
    console.log("build: bundle up to date ("+MODULES.length+" modules)");
    return;
  }
  const out=html.slice(0,a+START.length)+"\n"+next+"\n"+html.slice(b);
  fs.writeFileSync(HTML,out);
  console.log("build: injected "+MODULES.length+" modules ("+(next.length/1024).toFixed(1)+" KB) into index.html");
}
main();
