/* =====================================================================
   SHADOW WAR — compound drawing helpers
   Reusable multi-sprite compositions. Everything here is assembled from
   REGISTERED sprites — no scene is hard-coded into a renderer.
   ===================================================================== */
(function(NS){
"use strict";
const TILE=32;
const blit=(ctx,id,tx,ty,dx,dy)=>{
  const m=NS.registry.meta(id)||{width:16,height:16};
  ctx.drawImage(NS.registry.get(id),0,0,m.width,m.height,
    tx*TILE+(dx||0),ty*TILE+(dy||0),m.width*2,m.height*2);
};

NS.compose={

  /* The clothesline in any signal configuration.
     state: {petticoat:boolean, hankies:0..6}
     Slot rules (source pixels, ×2 on screen):
       with the petticoat: petticoat hangs at x3–5, handkerchiefs fill
         slots x7,9,11,13 — maximum 4 (this is the Mission-1 layout)
       without it: handkerchiefs start at x3, step 2 — up to 6, which is
         exactly the "Six Coves" range for Mission 2.
     Mission 1's win state is also pre-baked as prop.clothesline.signal.m1. */
  drawClothesline(ctx,tx,ty,state){
    blit(ctx,"prop.clothesline.empty",tx,ty);
    state=state||{};
    const start=state.petticoat?7:3;
    const max=state.petticoat?4:6;
    if(state.petticoat) blit(ctx,"prop.clothesline.item.petticoat",tx,ty);
    const n=Math.max(0,Math.min(max,state.hankies|0));
    for(let i=0;i<n;i++)
      blit(ctx,"prop.clothesline.item.hank",tx,ty,(start-7+i*2)*2,0);
  },

  /* the great oak, anchored at its top-left tile */
  drawLargeOak(ctx,tx,ty){
    blit(ctx,"tile.oak.nw",tx,ty);   blit(ctx,"tile.oak.ne",tx+1,ty);
    blit(ctx,"tile.oak.sw",tx,ty+1); blit(ctx,"tile.oak.se",tx+1,ty+1);
  },

  /* a working-waterfront cluster (used by the preview composition) */
  drawDockCluster(ctx,tx,ty){
    blit(ctx,"prop.barrel",tx,ty);
    blit(ctx,"prop.crate",tx+1,ty);
    blit(ctx,"prop.rope",tx,ty+1);
    blit(ctx,"prop.net",tx+1,ty+1);
  },

  drawVillageWell(ctx,tx,ty){ blit(ctx,"tile.well.0",tx,ty); },
};

})(globalThis.SWART = globalThis.SWART || {});
