/* =====================================================================
   SHADOW WAR — natural barriers (all blocking except where noted)
   Rule from ART_BIBLE: blocking vegetation must not resemble walkable
   grass — every barrier here has a solid dark mass or built structure.
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry,tilePaint}=NS;
const C=n=>palette.index(n);
const T=()=>px.makeBuffer(16,16,0);
const meta={kind:"tile",group:"nature",expect:{width:16,height:16}};

/* low bush — blocking, but low: does NOT block guard sightlines */
const bush=tilePaint.paintGrass(T());
px.rect(bush,3,7,10,6,C("leaf-dark"));
px.rect(bush,5,5,6,3,C("leaf-dark"));
px.rect(bush,7,13,2,2,C("wood-dark"));
[[5,7],[9,6],[11,9],[6,10]].forEach(([x,y])=>px.rect(bush,x,y,2,1,C("leaf-light")));
registry.register("tile.bush.0",bush,meta);

/* the great oak — a 2×2 landmark (chars K L / k l on the map).
   Canopy quarters up top; the lower pair shows the massive trunk.
   Terrain tiles must be fully opaque: grass shows at the canopy corners. */
const oakNW=tilePaint.paintGrass(T());
px.rect(oakNW,2,2,14,14,C("leaf-dark"));
px.rect(oakNW,6,0,10,3,C("leaf-dark"));
[[4,4],[10,3],[7,8],[13,7],[5,12]].forEach(([x,y])=>px.rect(oakNW,x,y,2,1,C("leaf-light")));
px.dots(oakNW,[[9,11],[14,13]],C("outline-dark"));
registry.register("tile.oak.nw",oakNW,meta);
registry.register("tile.oak.ne",px.flipH(oakNW),meta);
const oakSW=tilePaint.paintGrass(T());
px.rect(oakSW,2,0,14,6,C("leaf-dark"));                 // canopy skirt
[[5,2],[11,4]].forEach(([x,y])=>px.rect(oakSW,x,y,2,1,C("leaf-light")));
px.rect(oakSW,10,6,6,8,C("wood-dark"));                 // half of the great trunk
px.rect(oakSW,11,6,2,7,C("wood-medium"));               // bark light
px.rect(oakSW,8,13,8,2,C("wood-dark"));                 // root flare
px.dots(oakSW,[[6,14],[3,12]],C("grass-dark"));
registry.register("tile.oak.sw",oakSW,meta);
registry.register("tile.oak.se",px.flipH(oakSW),meta);

/* dry-laid fieldstone wall — staggered stones, grass at the foot */
const stone=tilePaint.paintGrass(T());
px.rect(stone,0,4,16,10,C("weathered-gray"));
px.rect(stone,0,3,16,1,C("stone-light"));               // capstones
px.rect(stone,0,13,16,1,C("outline-dark"));             // ground shadow
[[3,4],[9,4],[13,4],[0,7],[6,7],[11,7],[15,7],[3,10],[8,10],[13,10]]
  .forEach(([x,y])=>px.rect(stone,x,y,1,3,C("outline-dark")));   // staggered joints
px.rect(stone,0,7,16,1,C("outline-dark"));
px.rect(stone,0,10,16,1,C("outline-dark"));
px.dots(stone,[[5,5],[12,8],[2,11]],C("stone-light"));
registry.register("tile.wall.stone",stone,meta);

/* shoreline boulders — blocking, low (sight passes over) */
const rocks=tilePaint.paintSand(T());
px.rect(rocks,2,6,7,7,C("weathered-gray"));
px.rect(rocks,3,5,5,2,C("weathered-gray"));
px.rect(rocks,10,9,5,5,C("weathered-gray"));
px.rect(rocks,3,6,3,2,C("stone-light"));
px.rect(rocks,11,9,2,1,C("stone-light"));
px.rect(rocks,2,12,7,1,C("outline-dark"));
px.rect(rocks,10,13,5,1,C("outline-dark"));
registry.register("tile.rocks.0",rocks,meta);

})(globalThis.SWART = globalThis.SWART || {});
