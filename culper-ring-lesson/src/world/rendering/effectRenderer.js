/* =====================================================================
   SHADOW WAR — effect renderer (draw-order layers 7 and 8)
   Order inside a frame: dusk wash → lantern glows → sight cones →
   debug grid. Cones render ABOVE characters so a student standing
   inside one can see it (per the documented layer contract).
   ===================================================================== */
(function(NS){
"use strict";

NS.render=NS.render||{};

/* layer 7: night — wash first, then the lantern halos punch through */
NS.render.drawNight=function(ctx,lanternPoints){
  NS.effects.drawDusk(ctx);
  for(let i=0;i<lanternPoints.length;i++)
    NS.effects.drawLantern(ctx,lanternPoints[i].x,lanternPoints[i].y);
};

/* layer 8: guard sight cones.
   guards: [{x,y (pixels), facing (south|north|west|east), coneLen, calm}] */
NS.render.drawCones=function(ctx,guards){
  for(let i=0;i<guards.length;i++){
    const g=guards[i];
    NS.cones.draw(ctx,g.x,g.y,g.facing,g.coneLen,g.calm);
  }
};

/* debug grid overlay (dev only, behind the backtick toggle) */
NS.render.drawDebugGrid=function(ctx,w,h,tile){
  ctx.strokeStyle="rgba(255,255,255,.25)";
  for(let x=0;x<=w;x++){ ctx.beginPath(); ctx.moveTo(x*tile,0); ctx.lineTo(x*tile,h*tile); ctx.stroke(); }
  for(let y=0;y<=h;y++){ ctx.beginPath(); ctx.moveTo(0,y*tile); ctx.lineTo(w*tile,y*tile); ctx.stroke(); }
};

})(globalThis.SWART = globalThis.SWART || {});
