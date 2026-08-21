/* =====================================================================
   SHADOW WAR — entity renderer (draw-order layer 5)
   Characters y-sorted by feet position. An entity may carry a small
   `dz` pixel offset to nudge its sort position (e.g. force something
   behind a porch) — that is the entire depth system, by design.

   No per-frame allocation: the game owns a persistent actor pool and
   passes the same slot objects every frame.
   ===================================================================== */
(function(NS){
"use strict";
const TILE=32;
const sortBuf=[];

NS.render=NS.render||{};

/* actors: array of {x, y, spr(canvas), dz?, shadow?} — x/y in PIXELS,
   top-left of the 32×32 cell. Slots with spr=null are skipped. */
NS.render.drawActors=function(ctx,actors){
  sortBuf.length=0;
  for(let i=0;i<actors.length;i++){ if(actors[i].spr) sortBuf.push(actors[i]); }
  sortBuf.sort((a,b)=>(a.y+(a.dz||0))-(b.y+(b.dz||0)));
  for(let i=0;i<sortBuf.length;i++){
    const a=sortBuf[i];
    if(a.shadow!==false) NS.effects.drawShadow(ctx,a.x,a.y);
    ctx.drawImage(a.spr,0,0,16,16,a.x,a.y-6,TILE,TILE);
  }
};

})(globalThis.SWART = globalThis.SWART || {});
