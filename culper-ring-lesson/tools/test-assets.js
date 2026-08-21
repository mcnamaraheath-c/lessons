#!/usr/bin/env node
/* =====================================================================
   SHADOW WAR — asset pipeline unit tests (no dependencies)
   Run: node tools/test-assets.js
   Covers: palette integrity, pixel utils (formats, transforms,
   validation), registry (dup/missing/fallback/anims), audits (crimson,
   blank), and the real asset set registered by the modules.
   ===================================================================== */
"use strict";
const path=require("path");
const ROOT=path.join(__dirname,"..");

/* minimal canvas stub so registry.get()/toCanvas() work under node */
global.document={
  createElement(tag){
    if(tag!=="canvas") throw new Error("stub: only canvas");
    const store={};
    return {width:0,height:0,
      getContext(){ return new Proxy(store,{
        get:(o,k)=> (k in o)?o[k]
          : k==="createRadialGradient"?()=>({addColorStop(){}})
          : (typeof k==="string"?()=>undefined:undefined),
        set:(o,k,v)=>{o[k]=v;return true;},
      });},
    };
  },
};
global.console.warn=()=>{};   // registry warnings are expected in tests; keep output clean

/* load modules in dependency order (same list as build.js) */
[
 "src/world/art/palette.js","src/world/art/pixelUtils.js","src/world/art/spriteRegistry.js",
 "src/world/art/illustrations/illusManifest.js",
 "src/world/tiles/terrainTiles.js","src/world/tiles/natureTiles.js",
 "src/world/tiles/structureTiles.js","src/world/tiles/propTiles.js",
 "src/world/tiles/ambientProps.js",
 "src/world/characters/figureKit.js","src/world/characters/annaSprites.js",
 "src/world/characters/npcSprites.js","src/world/characters/guardSprites.js",
 "src/world/ui/uiMarkers.js",
 "src/world/effects/worldEffects.js","src/world/effects/sightCones.js",
 "src/world/maps/mapLegend.js","src/world/maps/setauketMap.js",
 "src/world/rendering/worldRenderer.js","src/world/rendering/entityRenderer.js",
 "src/world/rendering/effectRenderer.js","src/world/rendering/compose.js","src/world/init.js",
].forEach(f=>require(path.join(ROOT,f)));

const SWART=globalThis.SWART;
const {px,palette,registry}=SWART;

let pass=0,fail=0;
function t(name,fn){
  try{ fn(); pass++; console.log("OK   "+name); }
  catch(e){ fail++; console.log("FAIL "+name+" :: "+e.message); }
}
function eq(a,b,msg){ if(a!==b) throw new Error((msg||"eq")+": "+JSON.stringify(a)+" != "+JSON.stringify(b)); }
function throws(fn,msg){ try{fn();}catch(e){return;} throw new Error("expected throw: "+msg); }

/* ---------- palette ---------- */
t("palette: required semantic names exist",()=>{
  ["transparent","outline-dark","midnight-blue","deep-navy","paper-cream","warm-cream",
   "candle-amber","muted-gold","earth-dark","earth-medium","earth-light",
   "grass-dark","grass-medium","grass-light","water-dark","water-medium","water-light",
   "weathered-gray","roof-brown","wood-dark","wood-medium","wood-light",
   "skin-light","skin-medium","hair-dark","cloth-blue","cloth-brown","cloth-gray",
   "british-crimson","british-crimson-dark","white-crossbelt",
   "restricted-zone-tint","sight-cone-tint"].forEach(n=>palette.index(n));
});
t("palette: indexes are dense, stable, and documented",()=>{
  for(let i=0;i<palette.size;i++){
    const info=palette.info[i];
    if(!info) throw new Error("gap at index "+i);
    eq(info.index,i,"index mismatch");
    if(!info.use) throw new Error("no documented use for "+info.name);
  }
});
t("palette: unknown name throws",()=>{ throws(()=>palette.index("hot-pink"),"unknown name"); });
t("palette: transparent is index 0 with no color",()=>{
  eq(palette.index("transparent"),0); eq(palette.css(0),null);
});

/* ---------- pixel utils ---------- */
t("px: makeBuffer dimensions + fill",()=>{
  const s=px.makeBuffer(4,3,7);
  eq(s.width,4); eq(s.height,3); eq(s.pixels.length,3); eq(s.pixels[2][3],7);
});
t("px: fromStrings converts and validates",()=>{
  const s=px.fromStrings([".X.","X.X"],{".":0,"X":4});
  eq(s.width,3); eq(s.height,2); eq(s.pixels[0][1],4); eq(s.pixels[1][1],0);
  throws(()=>px.fromStrings([".X","X"],{".":0,"X":4}),"ragged rows");
  throws(()=>px.fromStrings(["?"],{".":0}),"unmapped char");
});
t("px: validate catches bad dims, bad index, malformed row",()=>{
  const good=px.makeBuffer(2,2,1);
  eq(px.validate(good).length,0);
  eq(px.validate(good,{width:16,height:16}).length,1,"size mismatch");
  const badIdx=px.makeBuffer(2,2,0); badIdx.pixels[0][0]=999;
  eq(px.validate(badIdx).length,1,"unknown index");
  const ragged={width:2,height:2,pixels:[[0,0],[0]]};
  if(!px.validate(ragged).some(e=>/malformed row/.test(e))) throw new Error("ragged not caught");
});
t("px: flipH / flipV / swapPalette are pure",()=>{
  const s=px.fromStrings(["X.",".."],{".":0,"X":4});
  const h=px.flipH(s), v=px.flipV(s), sw=px.swapPalette(s,{4:6});
  eq(h.pixels[0][1],4); eq(v.pixels[1][0],4); eq(sw.pixels[0][0],6);
  eq(s.pixels[0][0],4,"source mutated");
});
t("px: isBlank + usedIndexes",()=>{
  eq(px.isBlank(px.makeBuffer(3,3,0)),true);
  const s=px.makeBuffer(3,3,0); px.dot(s,1,1,5);
  eq(px.isBlank(s),false);
  eq([...px.usedIndexes(s)].join(","),"5");
});
t("px: rect clips instead of crashing",()=>{
  const s=px.makeBuffer(4,4,0);
  px.rect(s,-2,-2,10,10,3);
  eq(s.pixels[0][0],3); eq(s.pixels[3][3],3);
});
t("px: toCanvas produces a cacheable canvas at source size",()=>{
  const s=px.makeBuffer(5,7,2);
  const cv=px.toCanvas(s);
  eq(cv.width,5); eq(cv.height,7);
});

/* ---------- registry (isolated via reset) ---------- */
t("registry: duplicate id rejected",()=>{
  const s=px.makeBuffer(2,2,1);
  registry.register("test.dup",s,{kind:"tile"});
  throws(()=>registry.register("test.dup",s,{kind:"tile"}),"dup id");
});
t("registry: invalid sprite rejected at registration",()=>{
  const bad=px.makeBuffer(2,2,0); bad.pixels[0][0]=999;
  throws(()=>registry.register("test.bad",bad,{}),"bad palette index");
});
t("registry: missing id returns visible fallback and warns once",()=>{
  const cv=registry.get("test.nope");
  if(!cv||!cv.width) throw new Error("no fallback canvas");
  registry.get("test.nope");
  eq(registry.getWarnings().filter(w=>/test\.nope/.test(w)).length,1,"warned more than once");
});
t("registry: canvas caching returns same object",()=>{
  const a=registry.get("tile.grass.0"), b=registry.get("tile.grass.0");
  if(a!==b) throw new Error("not cached");
});
t("registry: anim groups resolve with all facings and frames",()=>{
  const anim=registry.anim("anna.walk");
  ["south","north","west","east"].forEach(f=>{
    if(!anim[f]||anim[f].length!==2) throw new Error("anna.walk."+f+" incomplete");
  });
  if(registry.anim("anna.walk")!==anim) throw new Error("anim not cached");
});
t("registry: metadata exposed",()=>{
  const m=registry.meta("guard.walk.south.0");
  eq(m.kind,"character"); eq(m.faction,"british"); eq(m.width,16); eq(m.height,16);
});

/* ---------- audits on the real asset set ---------- */
t("audit: no crimson outside British sprites",()=>{
  const bad=registry.auditCrimson();
  if(bad.length) throw new Error(bad.join("; "));
});
t("audit: crimson IS caught when a civilian wears it",()=>{
  const s=px.makeBuffer(16,16,0);
  px.rect(s,4,4,4,4,palette.index("british-crimson"));
  registry.register("test.redcivilian",s,{kind:"character",faction:"civilian"});
  const bad=registry.auditCrimson();
  if(!bad.some(b=>/test\.redcivilian/.test(b))) throw new Error("crimson civilian not flagged");
});
t("audit: blank frames flagged",()=>{
  registry.register("test.blank",px.makeBuffer(16,16,0),{kind:"prop"});
  if(!registry.auditBlank().some(b=>/test\.blank/.test(b))) throw new Error("blank not flagged");
});
t("audit: anim frame refs verified",()=>{
  registry.defineAnim("test.ghost",{south:["test.missing.frame"]});
  if(!registry.auditAnimFrames().some(b=>/test\.ghost/.test(b))) throw new Error("missing frame not flagged");
});
t("audit: real asset set has expected inventory",()=>{
  const ids=registry.list().filter(id=>!id.startsWith("test."));
  const wants=["tile.grass.0","tile.water.0","tile.water.1","tile.tree.0","tile.wall.0",
    "tile.roof.0","tile.door.house","tile.door.tavern","tile.fence.0","tile.post.0",
    "tile.dock.0","tile.well.0","prop.clothesline.empty","prop.clothesline.signal.m1","prop.boat",
    "anna.walk.south.0","anna.walk.east.1","guard.walk.west.0",
    "npc.abraham.idle.south","npc.jonah.idle.south","npc.brewster.idle.north"];
  wants.forEach(w=>{ if(!ids.includes(w)) throw new Error("missing "+w); });
  const structural=ids.map(id=>px.validate(registry.getData(id))).flat();
  if(structural.length) throw new Error(structural.join("; "));
});
t("audit: every real sprite uses only documented palette indexes",()=>{
  registry.list().filter(id=>!id.startsWith("test.")).forEach(id=>{
    px.usedIndexes(registry.getData(id)).forEach(i=>{
      if(!palette.isValidIndex(i)) throw new Error(id+" uses index "+i);
    });
  });
});
t("map: legend resolves every character used in the Setauket map (both frames)",()=>{
  const m=SWART.maps.setauket, L=SWART.legend;
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){
    [0,1].forEach(wf=>{
      const id=L.resolve(m,x,y,wf);
      if(!id||!registry.has(id))
        throw new Error("("+x+","+y+") '"+m.rows[y][x]+"' wf"+wf+" -> "+id);
    });
  }
});
t("map: dimensions match the addendum (20×15)",()=>{
  const m=SWART.maps.setauket;
  eq(m.width,20); eq(m.height,15); eq(m.rows.length,15);
  m.rows.forEach((r,i)=>eq(r.length,20,"row "+i));
});

/* ---------- environment library (Phase 2.6) ---------- */
t("env: full inventory registered",()=>{
  ["tile.grass.0","tile.grass.1","tile.grass.2","tile.dirt.0",
   "tile.path.center","tile.path.ns","tile.path.we","tile.path.cross",
   "tile.sand.0","tile.sand.1","tile.sand.restricted","tile.mud.0",
   "tile.water.shallow.0","tile.water.shallow.1","tile.soil.0","tile.garden.0",
   "tile.tree.deep","tile.bush.0","tile.oak.nw","tile.oak.ne","tile.oak.sw","tile.oak.se",
   "tile.wall.stone","tile.rocks.0",
   "tile.house.wall","tile.house.window","tile.house.wall.dark","tile.house.window.dark",
   "tile.roof.chimney","tile.barn.roof","tile.barn.wall","tile.barn.door","tile.fence.gate",
   "prop.clothesline.empty","prop.clothesline.signal.m1",
   "prop.clothesline.item.petticoat","prop.clothesline.item.hank","prop.clothesline.wash",
   "prop.trough","prop.hitchpost","prop.sign.tavern","prop.wheelbarrow",
   "prop.woodpile","prop.firewood","prop.basket",
   "prop.barrel","prop.crate","prop.rope","prop.net","prop.dockpost","prop.rowboat",
   "amb.chicken.0","amb.chicken.1","amb.dog","amb.cat","amb.bird.0","amb.bird.1",
   "amb.smoke.0","amb.smoke.1","amb.smoke.2","amb.laundry.0","amb.laundry.1",
   "amb.tuft","amb.flowers","amb.tool","amb.hay",
  ].forEach(id=>{ if(!registry.has(id)) throw new Error("missing "+id); });
});
t("env: clothesline states match the actual puzzle (petticoat + 4 hankies)",()=>{
  const sig=registry.getData("prop.clothesline.signal.m1");
  const used=px.usedIndexes(sig);
  if(!used.has(palette.index("midnight-blue"))) throw new Error("no petticoat");
  if(!used.has(palette.index("paper-cream"))) throw new Error("no handkerchiefs");
  // exactly 4 handkerchief columns at slots 7,9,11,13 on the cord row
  const row=sig.pixels[5], cream=palette.index("paper-cream");
  const cols=[7,9,11,13].filter(x=>row[x]===cream).length;
  eq(cols,4,"handkerchief slots");
  eq(row[8],0,"gap between hankies");
  // no crimson anywhere near the landmark
  palette.BRITISH_ONLY.forEach(i=>{ if(used.has(i)) throw new Error("crimson on the clothesline"); });
});
t("env: no environment or ambient asset uses British crimson",()=>{
  const bad=[];
  registry.list().filter(id=>!id.startsWith("test.")).forEach(id=>{
    const m=registry.meta(id);
    if(m.faction==="british") return;
    const used=px.usedIndexes(registry.getData(id));
    palette.BRITISH_ONLY.forEach(i=>{ if(used.has(i)) bad.push(id); });
  });
  if(bad.length) throw new Error(bad.join(", "));
});
t("env: variant resolution is deterministic and position-based",()=>{
  const m=SWART.maps.setauket, L=SWART.legend;
  const a=L.resolve(m,4,4,0), b=L.resolve(m,4,4,0);
  eq(a,b,"same tile twice");
  if(!/^tile\.grass\.[012]$/.test(a)) throw new Error("grass variant: "+a);
  eq(L.resolve(m,9,6,0),"tile.path.cross","road junction");
  eq(L.resolve(m,9,3,0),"tile.path.ns","vertical run");
  eq(L.resolve(m,5,6,0),"tile.path.we","horizontal run");
  eq(L.resolve(m,4,13,0),"tile.water.shallow.0","water beside sand is shallow");
  eq(L.resolve(m,4,14,0),"tile.water.0","open water is deep");
  eq(L.resolve(m,4,14,1),"tile.water.1","deep water frame 2");
  eq(L.resolve(m,4,11,0),"tile.sand.restricted","watched shore is pebbled");
  eq(L.resolve(m,4,12,0),"tile.mud.0","waterline sand is wet mud");
  eq(L.resolve(m,0,0,0),"tile.tree.deep","interior forest");
  if(L.resolve(m,6,0,0)!=="tile.tree.0") throw new Error("border tree should show trunk");
});
t("env: every map character resolves to a registered sprite",()=>{
  const m=SWART.maps.setauket, L=SWART.legend;
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++){
    const id=L.resolve(m,x,y,0);
    if(!id||!registry.has(id)) throw new Error("("+x+","+y+") '"+m.rows[y][x]+"' -> "+id);
  }
});
t("env: collision matches the picture (gate open, barn/oak/rocks solid)",()=>{
  const B=SWART.legend.block;
  ["u","r","s","K","L","k","l","n","x","y","M","Z","z","D"].forEach(ch=>{
    if(!B.has(ch)) throw new Error("'"+ch+"' should block");
  });
  ["=","g","q","e"].forEach(ch=>{
    if(B.has(ch)) throw new Error("'"+ch+"' should be walkable");
  });
});
t("env: props are registered, in bounds, and off every critical tile",()=>{
  const m=SWART.maps.setauket;
  const critical=new Set();
  const mark=(x,y)=>critical.add(x+","+y);
  mark(4,4); mark(4,3); mark(3,3);          // spawn, yard, Anna's doorstep
  mark(6,4);                                 // clothesline interaction point
  mark(14,4); mark(14,3); mark(15,3); mark(16,3);   // gate, field, Abraham + face tile
  mark(14,9);                                // tavern doorstep
  for(let x=4;x<=14;x++) mark(x,5);          // main east-west walking row
  for(let x=2;x<=14;x++) mark(x,9);          // watch zone
  for(let y=10;y<=13;y++) mark(9,y);         // dock approach + dock end
  for(let x=2;x<=8;x++) mark(x,11);          // guard 1 patrol
  for(let x=11;x<=17;x++) mark(x,11);        // guard 2 patrol
  m.props.forEach(p=>{
    if(!registry.has(p.id)) throw new Error("prop id missing: "+p.id);
    const span=p.spanX||1;
    for(let i=0;i<span;i++){
      const x=p.x+i;
      if(x<0||p.y<0||x>=m.width||p.y>=m.height) throw new Error(p.id+" out of bounds");
      if(critical.has(x+","+p.y)) throw new Error(p.id+" sits on critical tile "+x+","+p.y);
    }
  });
  // blocked props must actually block, and only where declared
  if(!m.propBlocked(2,12)||!m.propBlocked(16,12)) throw new Error("blockers not registered");
  if(m.propBlocked(10,12)) throw new Error("rope coil should not block");
});
t("env: ambient anims registered; reduced motion always shows frame 0",()=>{
  SWART.maps.setauket.ambient.forEach(a=>{
    a.frames.forEach(id=>{ if(!registry.has(id)) throw new Error("ambient frame "+id); });
  });
  const f=SWART.render.ambFrame;
  for(let ts=0;ts<5000;ts+=333){
    eq(f(3,600,ts,true),0,"rm must freeze");
  }
  if(f(3,600,700,false)===f(3,600,1300,false)) throw new Error("frames should advance without rm");
  eq(f(2,0,9999,false),0,"static prop stays on frame 0");
});
t("env: every non-test asset carries a preview group",()=>{
  registry.list().filter(id=>!id.startsWith("test.")).forEach(id=>{
    const meta=registry.meta(id);
    if(!(meta.group||meta.kind)) throw new Error(id+" has no group");
  });
});
t("env: compose.drawClothesline slot math stays in the cord",()=>{
  // stub ctx records draw x-positions
  const xs=[];
  const ctx={drawImage(cv,sx,sy,sw,sh,dx){ xs.push(dx); }};
  SWART.compose.drawClothesline(ctx,0,0,{petticoat:true,hankies:4});
  eq(xs.length,6,"base+petticoat+4 hankies");
  const hankXs=xs.slice(2);
  eq(JSON.stringify(hankXs),"[0,4,8,12]","M1 hankie slots");
  xs.length=0;
  SWART.compose.drawClothesline(ctx,0,0,{petticoat:false,hankies:6});
  eq(xs.length,7,"base+6 hankies for Six Coves");
  eq(xs[1],-8,"first slot moves to x3 without petticoat");
});
t("env: every terrain-layer sprite is fully opaque (no canvas bleed-through)",()=>{
  const m=SWART.maps.setauket, L=SWART.legend;
  const seen=new Set();
  for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)[0,1].forEach(wf=>{
    seen.add(L.resolve(m,x,y,wf));
  });
  const bad=[];
  seen.forEach(id=>{
    const s=registry.getData(id);
    if(s.pixels.some(row=>row.some(i=>i===0))) bad.push(id);
  });
  if(bad.length) throw new Error("transparent pixels in terrain: "+bad.join(", "));
});
t("env: full audit stays clean with the new library",()=>{
  const bad=registry.auditCrimson().concat(registry.auditAnimFrames())
    .filter(w=>!/test\./.test(w));
  if(bad.length) throw new Error(bad.join("; "));
});

/* ---------- character & entity library (Phase 2.7) ---------- */
const FACINGS=["south","north","west","east"];
const CHAR_GROUPS={ // group -> frames per facing
  "anna.walk":2, "anna.idle":1,
  "guard.variantA":2, "guard.variantB":2, "guard.walk":2,
  "npc.abraham.idle":1, "npc.widow.idle":1, "npc.oldman.idle":1,
  "npc.jonah.idle":1, "npc.brewster.idle":1, "npc.youth.idle":1,
};
function bbox(s){
  let x0=99,x1=-1,y0=99,y1=-1;
  s.pixels.forEach((row,y)=>row.forEach((i,x)=>{
    if(i!==0){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; }
  }));
  return {x0,x1,y0,y1};
}
t("chars: every group has 4 facings with the right frame count, all 16×16",()=>{
  for(const g in CHAR_GROUPS){
    const anim=registry.anim(g);
    FACINGS.forEach(f=>{
      if(!anim[f]) throw new Error(g+" missing facing "+f);
      if(anim[f].length!==CHAR_GROUPS[g]) throw new Error(g+"."+f+" frames="+anim[f].length);
    });
  }
});
t("chars: feet planted on row 15, no frame-to-frame size wobble",()=>{
  const seen=new Set();
  for(const g in CHAR_GROUPS){
    // walk sets: compare frame bboxes within each facing
    const def=registry.animGroups().includes(g);
    if(!def) throw new Error("group missing: "+g);
  }
  ["anna.walk","guard.variantA","guard.variantB"].forEach(g=>{
    FACINGS.forEach(f=>{
      const ids=[0,1].map(n=>{
        const frameIds={ "anna.walk":"anna.walk."+f+"."+n,
          "guard.variantA":"guard.walk."+f+"."+n,
          "guard.variantB":"guard.b.walk."+f+"."+n }[g];
        return frameIds;
      });
      const boxes=ids.map(id=>bbox(registry.getData(id)));
      boxes.forEach((b,i)=>{ if(b.y1!==15) throw new Error(ids[i]+" feet not on row 15 (y1="+b.y1+")"); });
      if(Math.abs((boxes[0].x1-boxes[0].x0)-(boxes[1].x1-boxes[1].x0))>1)
        throw new Error(g+"."+f+" width wobble");
      if(boxes[0].y0!==boxes[1].y0) throw new Error(g+"."+f+" head height wobble");
    });
  });
  // idle sets: feet on row 15
  ["npc.abraham","npc.widow","npc.oldman","npc.jonah","npc.brewster","npc.youth"].forEach(base=>{
    FACINGS.forEach(f=>{
      const b=bbox(registry.getData(base+".idle."+f));
      if(b.y1!==15) throw new Error(base+".idle."+f+" feet not on row 15");
    });
  });
});
t("chars: grayscale silhouette — only British soldiers reach hat row 0",()=>{
  registry.list().filter(id=>registry.meta(id).kind==="character").forEach(id=>{
    const hasRow0=registry.getData(id).pixels[0].some(i=>i!==0);
    const british=registry.meta(id).faction==="british";
    if(british&&!hasRow0) throw new Error(id+" (british) lost its tall hat");
    if(!british&&hasRow0) throw new Error(id+" (civilian) reaches the tall-hat row");
  });
});
t("chars: guard variants are related but distinct; crossbelts present",()=>{
  const a=registry.getData("guard.walk.south.0");
  const b=registry.getData("guard.b.walk.south.0");
  if(JSON.stringify(a.pixels)===JSON.stringify(b.pixels)) throw new Error("variants are identical");
  [a,b].forEach((s,i)=>{
    const used=px.usedIndexes(s);
    if(!used.has(palette.index("british-crimson"))) throw new Error("variant "+i+" lost the crimson coat");
    if(!used.has(palette.index("white-crossbelt"))) throw new Error("variant "+i+" lost the crossbelts");
    if(!used.has(palette.index("iron-band"))) throw new Error("variant "+i+" lost the musket");
  });
});
t("chars: brewster reads as boatman, not pirate (rolled sleeves + rope, sane hat)",()=>{
  const s=registry.getData("npc.brewster.idle.south");
  const used=px.usedIndexes(s);
  if(!used.has(palette.index("skin-medium"))) throw new Error("no rolled sleeves");
  if(!used.has(palette.index("sand-medium"))) throw new Error("no rope coil");
});
t("chars: palette-swap villager variant registered and recolored",()=>{
  const v=registry.getData("npc.villager.woman.brown.idle.south");
  const used=px.usedIndexes(v);
  if(used.has(palette.index("cloth-gray"))) throw new Error("swap did not apply");
  if(!used.has(palette.index("cloth-brown"))) throw new Error("target color missing");
});
t("ui: interaction markers registered, 8×8, opaque-cored, no crimson",()=>{
  ["ui.marker.interact","ui.marker.talk","ui.marker.locked"].forEach(id=>{
    const s=registry.getData(id);
    if(!s) throw new Error(id+" missing");
    eq(s.width,8,id); eq(s.height,8,id);
    if(px.isBlank(s)) throw new Error(id+" is empty");
    const used=px.usedIndexes(s);
    palette.BRITISH_ONLY.forEach(i=>{ if(used.has(i)) throw new Error(id+" uses crimson"); });
  });
});
t("game: entity metadata references real sprite groups and facings",()=>{
  const src=require("fs").readFileSync(path.join(ROOT,"index.html"),"utf8");
  const entBlock=src.match(/const ENTS=\[([\s\S]*?)\];/);
  if(!entBlock) throw new Error("ENTS not found");
  const re=/sprite:"([\w.]+)",\s*facing:"(\w+)"/g;
  let m,count=0;
  while((m=re.exec(entBlock[1]))){
    count++;
    const anim=registry.anim(m[1]+".idle");
    if(!anim[m[2]]||!anim[m[2]].length)
      throw new Error("entity uses "+m[1]+".idle."+m[2]+" which does not resolve");
  }
  if(count<4) throw new Error("expected ≥4 entities, matched "+count);
  if(!/guard\.variantA/.test(src)||!/guard\.variantB/.test(src))
    throw new Error("game does not use both guard variants");
  ["ui.marker.talk","ui.marker.locked","ui.marker.interact"].forEach(id=>{
    if(!src.includes(id)) throw new Error("game never draws "+id);
  });
});

/* ---------- final map assembly QA (Phase 2.8) ---------- */
const FS=require("fs");
const GAME_SRC=FS.readFileSync(path.join(ROOT,"index.html"),"utf8");
/* entity tiles extracted from the real game source */
function entityTiles(){
  const block=GAME_SRC.match(/const ENTS=\[([\s\S]*?)\];/)[1];
  const out=[]; const re=/x:(\d+),\s*y:(\d+)/g; let m;
  while((m=re.exec(block))) out.push([+m[1],+m[2]]);
  return out;
}
function walkableAt(x,y,ents){
  const map=SWART.maps.setauket;
  if(x<0||y<0||x>=map.width||y>=map.height) return false;
  if(SWART.legend.block.has(map.rows[y][x])) return false;
  if(map.propBlocked(x,y)) return false;
  if(ents&&ents.some(([ex,ey])=>ex===x&&ey===y)) return false;
  return true;
}
function bfs(sx,sy,ents){
  const map=SWART.maps.setauket;
  const dist=new Map(); dist.set(sx+","+sy,0);
  const q=[[sx,sy]];
  while(q.length){
    const [x,y]=q.shift(), d=dist.get(x+","+y);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{
      const nx=x+dx, ny=y+dy, k=nx+","+ny;
      if(dist.has(k)||!walkableAt(nx,ny,ents)) return;
      dist.set(k,d+1); q.push([nx,ny]);
    });
  }
  return dist;
}
t("map QA: spawn tile is walkable and matches the game",()=>{
  const sp=SWART.maps.setauket.playerSpawn;
  if(!walkableAt(sp.x,sp.y,entityTiles())) throw new Error("spawn blocked at "+sp.x+","+sp.y);
  eq(sp.x,4); eq(sp.y,4);
});
t("map QA: BFS — every required objective tile reachable from spawn",()=>{
  const ents=entityTiles();
  const dist=bfs(4,4,ents);
  const targets={
    "clothesline stand":[6,4], "Anna's doorstep":[3,3],
    "Abraham stand":[14,3], "farm gate":[14,4],
    "watch zone (near)":[14,9], "watch zone (far)":[2,9],
    "tavern doorstep":[14,9],
    "dock crossing":[9,11], "dock end (Brewster)":[9,13],
    "widow stand":[5,7], "jonah stand":[11,9], "hart stand":[12,8],
  };
  const missing=[];
  for(const name in targets){
    const [x,y]=targets[name];
    if(!dist.has(x+","+y)) missing.push(name+" ("+x+","+y+")");
  }
  if(missing.length) throw new Error("unreachable: "+missing.join("; "));
});
t("map QA: objective-leg distances stay near the 10-tile guideline",()=>{
  const ents=entityTiles();
  const legs=[
    ["spawn -> Abraham",[4,4],[14,3]],
    ["Abraham -> watch zone",[14,3],[14,9]],
    ["watch zone -> clothesline",[14,9],[6,4]],
    ["clothesline -> dock end",[6,4],[9,13]],
  ];
  const report=[];
  legs.forEach(([name,a,b])=>{
    const d=bfs(a[0],a[1],ents).get(b[0]+","+b[1]);
    if(d===undefined) throw new Error(name+" unreachable");
    report.push(name+" = "+d+" tiles");
    if(d>13) throw new Error(name+" too long: "+d);
  });
  console.log("     "+report.join("  |  "));
});
t("map QA: no required entity is sealed behind collision",()=>{
  const ents=entityTiles();
  const dist=bfs(4,4,ents);
  ents.forEach(([x,y])=>{
    const ok=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>dist.has((x+dx)+","+(y+dy)));
    if(!ok) throw new Error("entity at "+x+","+y+" has no reachable adjacent tile");
  });
});
t("map QA: guard patrol segments stay on open walkable sand",()=>{
  const wps=[]; const re=/wp:\[\[(\d+),(\d+)\],\[(\d+),(\d+)\]\]/g; let m;
  while((m=re.exec(GAME_SRC))) wps.push([[+m[1],+m[2]],[+m[3],+m[4]]]);
  if(wps.length!==2) throw new Error("expected 2 patrol routes, found "+wps.length);
  wps.forEach(([[ax,ay],[bx,by]],i)=>{
    if(ay!==by) throw new Error("patrol "+i+" not a straight row");
    for(let x=Math.min(ax,bx);x<=Math.max(ax,bx);x++){
      if(!walkableAt(x,ay,null)) throw new Error("patrol "+i+" blocked at "+x+","+ay);
      if(!SWART.legend.restricted.has(SWART.maps.setauket.rows[ay][x]))
        throw new Error("patrol "+i+" leaves the restricted shore at "+x+","+ay);
    }
  });
});
t("map QA: required story nodes exist for every map hookup",()=>{
  ["ab1","ab_wait","ab_after","ab_bonus","w1","w2","cl_early","cl_watch","cl_done",
   "gi1","cs1","d1","d_dock","yard1","br1","br2","gc1","int1","int3a","tav1",
   "house1","house2","vf1","vo1","jf1","jf2","dock_early","wash_good","wash_weak"]
  .forEach(id=>{
    if(!new RegExp("\\n"+id+":\\{").test(GAME_SRC)) throw new Error("node missing: "+id);
  });
});
t("map QA: exactly one clothesline, one tavern door, one house door, one dock end",()=>{
  const m=SWART.maps.setauket;
  eq(m.find("C").length,1,"clothesline");
  eq(m.find("V").length,1,"tavern door");
  eq(m.find("A").length,1,"house door");
  eq(m.find("B").length,1,"dock end");
});

/* ---------- illustration manifest (ILLUSTRATION_BIBLE) ---------- */
t("illus: title cover embedded as WebP within its byte cap, with bilingual alt + source",()=>{
  const cov=SWART.illus&&SWART.illus["illus.title-cover"];
  if(!cov) throw new Error("illus.title-cover missing");
  if(!cov.data.startsWith("data:image/webp;base64,")) throw new Error("not embedded WebP");
  const kb=Math.round(cov.data.length*3/4/1024);
  if(kb>80) throw new Error("title cover "+kb+" KB exceeds the 80 KB cap (ILLUSTRATION_BIBLE §12)");
  if(!cov.alt||!cov.alt.en||!cov.alt.es) throw new Error("bilingual alt text missing");
  if(!cov.source) throw new Error("source/rights metadata missing");
});
t("illus: game wires the cover to the title screen",()=>{
  const src=require("fs").readFileSync(path.join(ROOT,"index.html"),"utf8");
  ["illus.title-cover","s-title.cover","aria-label"].forEach(s=>{
    if(!src.includes(s)) throw new Error("index.html missing: "+s);
  });
});

console.log("\n"+pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
