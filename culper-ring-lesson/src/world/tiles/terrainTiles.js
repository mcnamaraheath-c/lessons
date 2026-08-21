/* =====================================================================
   SHADOW WAR — terrain tiles (ground the player walks on or past)
   16×16 source, blitted at 32×32.

   VARIANTS ARE DETERMINISTIC. Nothing picks a variant per frame:
   mapLegend.resolve() chooses by map position hash or by neighboring
   characters, so the same map always bakes the same picture.
   Speckle positions inside each tile are fixed for the same reason —
   repeated tiles must read as calm fields, not static noise.
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry}=NS;
const C=n=>palette.index(n);
const T=()=>px.makeBuffer(16,16,0);
const meta={kind:"tile",group:"terrain",expect:{width:16,height:16}};

/* ---------- shared painters (other tile modules build on these) ---------- */
function paintGrass(s){
  px.rect(s,0,0,16,16,C("grass-medium"));
  px.dots(s,[[2,3],[7,9],[12,5],[5,13],[10,1],[14,11],[1,8]],C("grass-dark"));
  px.dots(s,[[4,6],[11,12],[9,4]],C("grass-light"));
  return s;
}
function paintSand(s){
  px.rect(s,0,0,16,16,C("sand-medium"));
  px.dots(s,[[3,2],[8,7],[13,4],[5,11],[11,13],[1,9]],C("sand-dark"));
  return s;
}
function paintPath(s){
  px.rect(s,0,0,16,16,C("earth-medium"));
  px.dots(s,[[2,5],[9,2],[13,9],[6,12],[11,6]],C("earth-dark"));
  px.dots(s,[[4,9],[12,13]],C("earth-light"));
  return s;
}
function paintWater(s,off){
  px.rect(s,0,0,16,16,C("water-dark"));
  [[1,3],[9,4],[5,9],[12,11],[3,14]].forEach(([x,y])=>{
    px.rect(s,(x+off)%14,y,3,1,C("water-medium"));
  });
  return s;
}
NS.tilePaint={paintGrass,paintSand,paintPath,paintWater};

/* ---------- grass: 3 subtle variants, picked by (x*7+y*13)%3 ---------- */
registry.register("tile.grass.0",paintGrass(T()),meta);
const g1=T();
px.rect(g1,0,0,16,16,C("grass-medium"));
px.dots(g1,[[5,2],[11,8],[2,12],[14,5],[8,14],[1,4]],C("grass-dark"));
px.dots(g1,[[13,11],[3,9],[7,6]],C("grass-light"));
registry.register("tile.grass.1",g1,meta);
const g2=T();
px.rect(g2,0,0,16,16,C("grass-medium"));
px.dots(g2,[[9,3],[4,10],[14,13],[1,14],[12,1]],C("grass-dark"));
px.rect(g2,6,8,2,1,C("grass-light"));                 // one tiny sun patch
px.dots(g2,[[10,11]],C("grass-light"));
registry.register("tile.grass.2",g2,meta);

/* ---------- packed dirt (dooryards, well surround) ---------- */
const dirt=T();
px.rect(dirt,0,0,16,16,C("earth-medium"));
px.dots(dirt,[[2,2],[6,5],[11,3],[14,8],[4,11],[9,13],[13,14],[1,7],[7,9]],C("earth-dark"));
registry.register("tile.dirt.0",dirt,meta);

/* ---------- path with edge variants (see mapLegend.resolve) ----------
   .center = open crossing · .ns = north-south run (grass fringe E/W)
   .we = west-east run (grass fringe N/S) · .cross = 4-way junction   */
registry.register("tile.path.center",paintPath(T()),meta);
const pns=paintPath(T());
px.rect(pns,0,0,1,16,C("grass-medium")); px.rect(pns,15,0,1,16,C("grass-medium"));
px.dots(pns,[[0,4],[15,9],[0,12]],C("grass-dark"));
registry.register("tile.path.ns",pns,meta);
const pwe=paintPath(T());
px.rect(pwe,0,0,16,1,C("grass-medium")); px.rect(pwe,0,15,16,1,C("grass-medium"));
px.dots(pwe,[[3,0],[10,15],[13,0]],C("grass-dark"));
registry.register("tile.path.we",pwe,meta);
const pcross=paintPath(T());
px.dots(pcross,[[0,0],[15,0],[0,15],[15,15]],C("grass-medium"));   // soft corners
registry.register("tile.path.cross",pcross,meta);

/* ---------- shore: sand variants, restricted pebble sand, wet mud ---------- */
registry.register("tile.sand.0",paintSand(T()),meta);
const s1=T();
px.rect(s1,0,0,16,16,C("sand-medium"));
px.dots(s1,[[6,3],[12,9],[2,6],[9,12],[14,2],[4,14]],C("sand-dark"));
registry.register("tile.sand.1",s1,meta);
/* restricted ground: rougher, pebbled — reads "worked/watched" even in
   grayscale; the baked translucent zone tint goes on top of it */
const sr=paintSand(T());
px.dots(sr,[[4,4],[10,6],[7,11],[13,12],[2,13]],C("iron-band"));
px.dots(sr,[[5,5],[11,7]],C("stone-light"));
registry.register("tile.sand.restricted",sr,meta);
/* wet mud at the waterline */
const mud=T();
px.rect(mud,0,0,16,16,C("sand-dark"));
px.dots(mud,[[3,3],[9,6],[13,2],[6,10],[11,13],[1,12]],C("earth-dark"));
px.rect(mud,2,14,5,1,C("water-medium"));               // wet sheen streaks
px.rect(mud,10,15,4,1,C("water-medium"));
registry.register("tile.mud.0",mud,meta);

/* ---------- water: deep (2 frames) + shallow shoreline (2 frames) ---------- */
registry.register("tile.water.0",paintWater(T(),0),meta);
registry.register("tile.water.1",paintWater(T(),4),meta);
function shallow(off){
  const s=T();
  px.rect(s,0,0,16,16,C("water-medium"));
  [[2,2],[10,5],[5,10],[12,13]].forEach(([x,y])=>px.rect(s,(x+off)%13,y,3,1,C("water-light")));
  px.dots(s,[[4,6],[11,9],[7,14]],C("sand-dark"));     // seabed showing through
  return s;
}
registry.register("tile.water.shallow.0",shallow(0),meta);
registry.register("tile.water.shallow.1",shallow(5),meta);

/* ---------- worked ground ---------- */
/* tilled field (Woodhull's farm): furrow rows */
const soil=T();
px.rect(soil,0,0,16,16,C("earth-dark"));
for(let y=1;y<16;y+=3) px.rect(soil,0,y,16,1,C("earth-medium"));
px.dots(soil,[[4,3],[11,9],[7,12]],C("earth-light"));
registry.register("tile.soil.0",soil,meta);
/* kitchen garden (Anna's yard): furrows + young sprouts, tidier */
const garden=T();
px.rect(garden,0,0,16,16,C("earth-dark"));
for(let y=2;y<16;y+=4) px.rect(garden,0,y,16,1,C("earth-medium"));
px.dots(garden,[[3,3],[8,3],[13,3],[5,7],[10,7],[2,11],[7,11],[12,11],[4,15],[9,15]],C("grass-light"));
registry.register("tile.garden.0",garden,meta);

/* ---------- trees (blocking; silhouette must say "you cannot pass") ---------- */
const tree=paintGrass(T());
px.rect(tree,7,10,2,5,C("wood-dark"));
px.rect(tree,3,2,10,7,C("leaf-dark"));
px.rect(tree,5,0,6,3,C("leaf-dark"));
px.rect(tree,2,4,12,4,C("leaf-dark"));
[[4,3],[9,2],[6,6],[11,5]].forEach(([x,y])=>px.rect(tree,x,y,2,1,C("leaf-light")));
registry.register("tile.tree.0",tree,meta);
/* interior forest (every neighbor is also tree): solid canopy, no trunk —
   the border band reads as one mass instead of a picket of lollipops */
const deep=T();
px.rect(deep,0,0,16,16,C("leaf-dark"));
[[2,3],[8,1],[13,5],[5,8],[11,11],[1,13],[7,14]].forEach(([x,y])=>px.rect(deep,x,y,2,1,C("leaf-light")));
px.dots(deep,[[4,12],[14,9],[10,4]],C("outline-dark"));
registry.register("tile.tree.deep",deep,meta);

})(globalThis.SWART = globalThis.SWART || {});
