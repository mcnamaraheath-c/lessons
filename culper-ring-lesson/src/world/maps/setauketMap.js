/* =====================================================================
   SHADOW WAR — Setauket, 1779 (pilot map, 20×15 tiles, fixed camera)
   Layout per the Walkable World addendum:
     NW Anna's house + kitchen garden + THE CLOTHESLINE (C); a packed-dirt
        spur (e, col 7) walks the eye from her yard down to the road
     NE Woodhull farm: split rails, tilled field (g), barn (Zz D)
     Center: road (d), village well (o) on packed dirt (e)
     E Roe's tavern: dark boards (x/y), door faces WEST at (15,9) so it
       is actually reachable (the door previously faced the post row)
     S restricted shore: rope posts (P), pebbled sand, dock (b/B), rocks
     The great oak (KL/kl) anchors the southwest of Anna's yard.

   GAMEPLAY-CRITICAL TILES — do not move without updating the game:
     spawn (4,4) · clothesline C (6,3), stand at (6,4)
     Anna's door A (3,2), stand at (3,3) · farm gate = (14,4)
     Abraham stands at (15,3) on field · tavern door V (15,9), stand (14,9)
     watch zone row y=9 x2–14 · post row y=10, gap x=9
     guard patrol row y=11 (waypoints x2–8 and x11–17 must stay clear)
     dock column x8–10, dock end B (9,13)

   Props: static, baked into the terrain cache. block:1 props are solid —
   the game's walkable() consults propBlocked(). Ambient entries animate
   (2–3 slow frames) and are drawn per frame; reduced-motion shows
   frame 0 (see worldRenderer.ambFrame). Chimney smoke positions derive
   from the 'M' tiles automatically.
   ===================================================================== */
(function(NS){
"use strict";

const rows=[
  "TTTTTTTTTTTTTTTTTTTT",
  "ThMhhT...d..fffZZZ.T",
  "TnHAnT...d..fggzDz.T",
  "T...qqC..d..fggggf.T",
  "TKL....e.d..ff=fff.T",
  "Tkl....e.d......ss.T",
  "Tddddddddddddddddd.T",
  "Tu....eoed.....hMh.T",
  "T......e.d.....xyx.T",
  "T........d.....Vxx.T",
  "TPPPPPPPPdPPPPPPPPPT",
  "Tr~~~~~~~~~~~~~~~~rT",
  "T~~~~~~~bbb~~~~~~~rT",
  "WWWWWWWWbBbWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWWWW",
];

const props=[
  /* Anna's yard — domestic and orderly */
  {id:"amb.flowers",   x:1, y:3},
  {id:"prop.basket",   x:2, y:3},
  /* Woodhull farm — practical, worked */
  {id:"prop.woodpile", x:13,y:2, block:1},
  {id:"amb.hay",       x:14,y:2},
  {id:"amb.tool",      x:15,y:2},                    // leaning on the barn wall
  {id:"amb.cat",       x:12,y:4, dy:-6},             // on the fence rail
  /* southwest field — one worked corner so the quadrant isn't dead */
  {id:"prop.firewood", x:2, y:8, block:1},
  /* village center */
  {id:"amb.flowers",   x:10,y:7},
  {id:"amb.tuft",      x:3, y:7},
  {id:"amb.tuft",      x:11,y:4},
  {id:"amb.tuft",      x:18,y:4},
  /* tavern frontage — busier entrance, cul-de-sac so nothing is in the way */
  {id:"prop.sign.tavern",x:15,y:8},                  // hangs over the wall above the door
  {id:"prop.trough",   x:18,y:7, block:1},
  {id:"prop.hitchpost",x:18,y:8, block:1},
  {id:"amb.dog",       x:18,y:9},
  /* working waterfront */
  {id:"prop.barrel",   x:2, y:12, block:1},
  {id:"prop.crate",    x:3, y:12, block:1},
  {id:"prop.rope",     x:10,y:12},
  {id:"prop.net",      x:12,y:12},
  {id:"prop.rowboat",  x:15,y:12, block:1, spanX:2}, // beached, blocks both tiles
  {id:"prop.dockpost", x:8, y:13},
  {id:"prop.dockpost", x:10,y:13},
];

const ambient=[
  {frames:["amb.chicken.0","amb.chicken.1"], x:13,y:3, ms:900},
  {frames:["amb.bird.0","amb.bird.1"],       x:17,y:5, ms:1300, dy:-8}, // on the stone wall
];

/* numeric-key set for O(1) walkability checks, built once */
const blockedKeys=new Set();
props.forEach(p=>{
  if(!p.block) return;
  const span=p.spanX||1;
  for(let i=0;i<span;i++) blockedKeys.add((p.y*20)+(p.x+i));
});

NS.maps=NS.maps||{};
NS.maps.setauket={
  id:"setauket",
  width:20, height:15,
  rows, props, ambient,
  playerSpawn:{x:4,y:4,facing:"south"},
  propBlocked(x,y){ return blockedKeys.has(y*20+x); },
  find(ch){
    const out=[];
    this.rows.forEach((row,y)=>{ [...row].forEach((c,x)=>{ if(c===ch) out.push({x,y}); }); });
    return out;
  },
};

})(globalThis.SWART = globalThis.SWART || {});
