/* =====================================================================
   SHADOW WAR — world effects (shadows, lantern glow, dusk wash)
   Everything expensive is rendered once into a cached canvas and
   blitted; the dusk wash is one fillRect with a cached style string.
   ===================================================================== */
(function(NS){
"use strict";
let shadowCv=null, lanternCv=null;

NS.effects={

  /* small elliptical drop shadow under a character (20×3 at their feet) */
  drawShadow(ctx,x,y){
    if(!shadowCv){
      shadowCv=document.createElement("canvas");
      shadowCv.width=20; shadowCv.height=3;
      const c=shadowCv.getContext("2d");
      c.fillStyle=NS.palette.css(NS.palette.index("shadow-tint"));
      c.fillRect(0,0,20,3);
    }
    ctx.drawImage(shadowCv,x+6,y+28);
  },

  /* warm lantern halo around a guard at dusk (112×112 radial, cached) */
  drawLantern(ctx,x,y){
    if(!lanternCv){
      lanternCv=document.createElement("canvas");
      lanternCv.width=lanternCv.height=112;
      const c=lanternCv.getContext("2d");
      const g=c.createRadialGradient(56,52,4,56,52,44);
      g.addColorStop(0,NS.palette.css(NS.palette.index("lantern-glow")));
      g.addColorStop(1,"rgba(232,163,61,0)");
      c.fillStyle=g; c.fillRect(0,0,112,112);
    }
    ctx.drawImage(lanternCv,x-40,y-40);
  },

  /* full-screen night wash — the effect renderer draws this BEFORE the
     lantern halos so the glows sit inside the dark, not under it */
  drawDusk(ctx){
    ctx.fillStyle=NS.palette.css(NS.palette.index("dusk-tint"));
    ctx.fillRect(0,0,640,480);
  },
};

})(globalThis.SWART = globalThis.SWART || {});
