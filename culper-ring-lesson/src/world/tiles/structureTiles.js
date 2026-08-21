/* =====================================================================
   SHADOW WAR — colonial structures
   Long Island vernacular, 1779: wood clapboard, modest rectangles,
   practical pitched roofs, small-paned windows, stone chimneys.
   No gutters, no Victorian trim, no fantasy.

   Building identities (per the pilot spec):
   · Anna's house — light clapboard, cream trim, small-paned windows
   · Roe's tavern — darker weathered boards, amber-lit panes, hung sign
   · Woodhull farm — split rails, tilled field, board-and-batten barn
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry,tilePaint}=NS;
const C=n=>palette.index(n);
const T=()=>px.makeBuffer(16,16,0);
const meta={kind:"tile",group:"structures",expect:{width:16,height:16}};

/* ---------- light clapboard set (Anna's house) ---------- */
function paintClapboard(){
  const s=T();
  px.rect(s,0,0,16,16,C("warm-cream"));
  for(let y=3;y<16;y+=3) px.rect(s,0,y,16,1,C("sand-dark"));   // clapboard courses
  px.rect(s,0,0,16,2,C("roof-brown"));                          // top plate
  px.rect(s,0,0,1,16,C("roof-brown"));                          // corner trim
  px.rect(s,15,0,1,16,C("roof-brown"));
  px.rect(s,0,15,16,1,C("earth-dark"));                         // sill/ground line
  return s;
}
registry.register("tile.house.wall",paintClapboard(),meta);

/* small-paned window in light clapboard */
const win=paintClapboard();
px.rect(win,4,4,8,8,C("wood-dark"));                            // frame
px.rect(win,5,5,6,6,C("deep-navy"));                            // glass
px.rect(win,7,5,1,6,C("paper-cream"));                          // muntins
px.rect(win,5,7,6,1,C("paper-cream"));
px.rect(win,4,12,8,1,C("paper-cream"));                         // sill
registry.register("tile.house.window",win,meta);

/* ---------- dark weathered set (Roe's tavern) ---------- */
function paintDarkBoards(){
  const s=T();
  px.rect(s,0,0,16,16,C("wood-medium"));
  for(let y=3;y<16;y+=3) px.rect(s,0,y,16,1,C("wood-dark"));
  px.rect(s,0,0,16,2,C("wood-dark"));
  px.rect(s,0,0,1,16,C("wood-dark"));
  px.rect(s,15,0,1,16,C("wood-dark"));
  px.rect(s,0,15,16,1,C("outline-dark"));
  return s;
}
registry.register("tile.house.wall.dark",paintDarkBoards(),meta);

/* tavern window — candle-lit panes say "occupied, warm, busy" */
const winD=paintDarkBoards();
px.rect(winD,4,4,8,8,C("outline-dark"));
px.rect(winD,5,5,6,6,C("deep-navy"));
px.rect(winD,6,6,2,2,C("candle-amber"));                        // lamplight, small
px.rect(winD,9,8,2,2,C("candle-amber"));
px.rect(winD,7,5,1,6,C("wood-dark"));
px.rect(winD,5,7,6,1,C("wood-dark"));
registry.register("tile.house.window.dark",winD,meta);

/* ---------- roofs ---------- */
const roof=T();
px.rect(roof,0,0,16,16,C("roof-brown"));
px.rect(roof,0,0,16,1,C("wood-light"));
px.rect(roof,0,5,16,1,C("wood-medium"));
px.rect(roof,0,10,16,1,C("wood-medium"));
px.rect(roof,0,15,16,1,C("wood-dark"));
px.dots(roof,[[4,3],[11,7],[7,12]],C("wood-medium"));           // weathering
registry.register("tile.roof.0",roof,meta);

/* roof tile carrying a fieldstone chimney (map char M).
   Smoke animates above it at runtime — see worldRenderer.drawSmoke. */
const chim=T();
px.rect(chim,0,0,16,16,C("roof-brown"));
px.rect(chim,0,0,16,1,C("wood-light"));
px.rect(chim,0,5,16,1,C("wood-medium"));
px.rect(chim,0,10,16,1,C("wood-medium"));
px.rect(chim,0,15,16,1,C("wood-dark"));
px.rect(chim,5,1,6,8,C("weathered-gray"));                      // stack
px.rect(chim,4,1,8,2,C("stone-light"));                         // crown
px.rect(chim,6,2,4,1,C("outline-dark"));                        // flue
px.dots(chim,[[6,5],[9,7],[7,6]],C("outline-dark"));            // stone joints
registry.register("tile.roof.chimney",chim,meta);

/* ---------- doors (interaction points get the amber tell) ---------- */
const doorH=paintClapboard();
px.rect(doorH,4,3,8,13,C("wood-dark"));
px.rect(doorH,5,4,6,11,C("wood-medium"));
px.rect(doorH,5,4,6,1,C("wood-dark"));
px.rect(doorH,10,9,1,2,C("candle-amber"));
registry.register("tile.door.house",doorH,meta);

const doorT=paintDarkBoards();
px.rect(doorT,4,3,8,13,C("outline-dark"));
px.rect(doorT,5,4,6,11,C("wood-dark"));
px.rect(doorT,10,9,1,2,C("candle-amber"));
px.rect(doorT,3,15,10,1,C("earth-dark"));                       // worn threshold
registry.register("tile.door.tavern",doorT,meta);

/* ---------- barn set (Woodhull farm, board-and-batten) ---------- */
const barnRoof=T();
px.rect(barnRoof,0,0,16,16,C("wood-medium"));
px.rect(barnRoof,0,0,16,1,C("wood-light"));
px.rect(barnRoof,0,4,16,1,C("wood-dark"));
px.rect(barnRoof,0,9,16,1,C("wood-dark"));
px.rect(barnRoof,0,14,16,2,C("wood-dark"));
px.dots(barnRoof,[[3,6],[12,2],[8,11]],C("wood-dark"));
registry.register("tile.barn.roof",barnRoof,meta);

function paintBarnWall(){
  const s=T();
  px.rect(s,0,0,16,16,C("wood-medium"));
  for(let x=2;x<16;x+=3) px.rect(s,x,0,1,16,C("wood-dark"));    // vertical battens
  px.rect(s,0,0,16,2,C("wood-dark"));
  px.rect(s,0,15,16,1,C("outline-dark"));
  return s;
}
registry.register("tile.barn.wall",paintBarnWall(),meta);

const barnDoor=paintBarnWall();
px.rect(barnDoor,3,3,10,13,C("wood-dark"));
px.rect(barnDoor,4,4,8,11,C("wood-medium"));
px.rect(barnDoor,4,6,8,1,C("wood-light"));                      // cross braces
px.rect(barnDoor,4,11,8,1,C("wood-light"));
px.rect(barnDoor,4,4,1,11,C("wood-dark"));
px.rect(barnDoor,11,4,1,11,C("wood-dark"));
registry.register("tile.barn.door",barnDoor,meta);

/* ---------- fences ---------- */
const fence=tilePaint.paintGrass(T());
px.rect(fence,0,5,16,2,C("roof-brown"));
px.rect(fence,0,10,16,2,C("roof-brown"));
px.rect(fence,7,3,2,11,C("wood-medium"));
registry.register("tile.fence.0",fence,meta);

/* open gate — WALKABLE: posts stand aside, trampled ground between,
   no rail crosses the gap (collision must match the picture) */
const gate=tilePaint.paintGrass(T());
px.rect(gate,0,3,3,11,C("wood-medium"));                        // gate posts
px.rect(gate,13,3,3,11,C("wood-medium"));
px.rect(gate,0,3,3,1,C("wood-light"));
px.rect(gate,13,3,3,1,C("wood-light"));
px.rect(gate,3,10,10,4,C("earth-medium"));                      // trampled through-path
px.dots(gate,[[5,12],[9,11]],C("earth-dark"));
registry.register("tile.fence.gate",gate,meta);

/* ---------- shore boundary + dock + well (unchanged art) ---------- */
const post=tilePaint.paintGrass(T());
px.rect(post,6,2,3,12,C("roof-brown"));
px.rect(post,6,1,3,1,C("wood-light"));
px.rect(post,0,4,16,1,C("sand-medium"));
registry.register("tile.post.0",post,meta);

const dock=T();
px.rect(dock,0,0,16,16,C("wood-medium"));
px.rect(dock,0,0,16,1,C("roof-brown"));
px.rect(dock,5,0,1,16,C("wood-dark"));
px.rect(dock,10,0,1,16,C("wood-dark"));
px.rect(dock,0,15,16,1,C("wood-dark"));
registry.register("tile.dock.0",dock,meta);

const well=tilePaint.paintGrass(T());
px.rect(well,3,5,10,8,C("weathered-gray"));
px.rect(well,5,7,6,4,C("outline-dark"));
px.rect(well,3,4,10,1,C("stone-light"));
px.dots(well,[[4,6],[11,9]],C("outline-dark"));
registry.register("tile.well.0",well,meta);

/* generic wall kept for compatibility (plain light clapboard) */
registry.register("tile.wall.0",paintClapboard(),meta);

})(globalThis.SWART = globalThis.SWART || {});
