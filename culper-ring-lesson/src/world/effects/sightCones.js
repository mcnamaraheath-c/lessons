/* =====================================================================
   SHADOW WAR — guard sight cones
   The rule the student must SEE: 3 tiles straight ahead, a soft crimson
   wedge. Wedge canvases are pre-rendered per (direction × length × calm)
   — max 24 small canvases — and blitted per frame. No per-frame paths.

   Geometry matches the shipped pilot exactly: from the guard's front
   edge (10px out) widening from ±5px to ±17px at the far end.
   ===================================================================== */
(function(NS){
"use strict";
const TILE=32;
const cache={};

function buildCone(dir,len,calm){
  const far=len*TILE;
  const cv=document.createElement("canvas");
  const horiz=(dir==="east"||dir==="west");
  cv.width = horiz?far:34;
  cv.height= horiz?34:far;
  const c=cv.getContext("2d");
  c.globalAlpha=calm?0.13:0.20;
  c.fillStyle="#a83232";               // palette: sight-cone-tint base hue
  c.beginPath();
  if(dir==="east"){ c.moveTo(0,12); c.lineTo(far,0); c.lineTo(far,34); c.lineTo(0,22); }
  if(dir==="west"){ c.moveTo(far,12); c.lineTo(0,0); c.lineTo(0,34); c.lineTo(far,22); }
  if(dir==="south"){ c.moveTo(12,0); c.lineTo(0,far); c.lineTo(34,far); c.lineTo(22,0); }
  if(dir==="north"){ c.moveTo(12,far); c.lineTo(0,0); c.lineTo(34,0); c.lineTo(22,far); }
  c.closePath(); c.fill();
  c.globalAlpha=calm?0.3:0.45;         // palette: sight-cone-edge
  c.strokeStyle="#a83232"; c.lineWidth=1; c.stroke();
  return cv;
}

NS.cones={
  /* draw a cone for a guard whose sprite's top-left pixel is at (x,y).
     dir: south|north|west|east, len: 1..3 visible tiles */
  draw(ctx,x,y,dir,len,calm){
    if(len<1) return;
    const key=dir+len+(calm?"c":"n");
    const cv=cache[key]||(cache[key]=buildCone(dir,len,!!calm));
    const cx=x+16, cy=y+16;            // guard center
    if(dir==="east")  ctx.drawImage(cv,cx+10,cy-17);
    if(dir==="west")  ctx.drawImage(cv,cx-10-cv.width,cy-17);
    if(dir==="south") ctx.drawImage(cv,cx-17,cy+10);
    if(dir==="north") ctx.drawImage(cv,cx-17,cy-10-cv.height);
  },
};

})(globalThis.SWART = globalThis.SWART || {});
