/* =====================================================================
   SHADOW WAR — world renderer (terrain layer + the draw-order contract)

   DRAW ORDER (stable — every renderer slots into exactly one layer):
     1. Base terrain            drawTerrain (pre-baked, variant-resolved)
     2. Shoreline/path details  (baked into layer 1 via legend.resolve)
     3. Ground props            static props baked into layer 1;
                                story-driven props + drawAmbient at runtime
     4. Structure bases         (baked into layer 1 — structures are tiles)
     5. Characters & entities   entityRenderer.drawActors (y-sorted, +dz)
     6. Tall props/foreground   drawSmoke (chimney smoke drifts over roofs)
     7. World effects           effectRenderer: dusk wash, lantern glows
     8. Cones & restricted zone effectRenderer.drawCones
                                (static restricted tint pre-baked into 1)
     9. Interaction labels      DOM overlay (#labels) — outside canvas
    10. Objective banner + HUD  DOM — outside canvas

   PERFORMANCE: the whole static map — variant-resolved tiles, static
   props, restricted tint — is baked into TWO 640×480 canvases at init
   (one per water frame). A frame's terrain cost is one drawImage.
   Ambient decorations (~2 sprites) and smoke (~2) are the only per-frame
   environment draws, all from cached canvases resolved at bake time.
   ===================================================================== */
(function(NS){
"use strict";
const TILE=32;
let frames=null;     // [canvasWaterFrame0, canvasWaterFrame1]
let ambList=null;    // [{cvs:[canvas...], x,y(px), ms}]
let smokeList=null;  // [{x,y(px)}]
let smokeCvs=null;   // [canvas ×3]

NS.render=NS.render||{};

/* reduced-motion contract for every ambient animation:
   rm or no interval -> frame 0, always. Exported for tests. */
NS.render.ambFrame=function(count,ms,ts,rm){
  if(rm||!ms||count<2) return 0;
  return Math.floor(ts/ms)%count;
};

NS.render.buildTerrain=function(map,legend){
  frames=[0,1].map(wf=>{
    const cv=document.createElement("canvas");
    cv.width=map.width*TILE; cv.height=map.height*TILE;
    const c=cv.getContext("2d");
    c.imageSmoothingEnabled=false;
    /* layers 1–4: variant-resolved tiles (deterministic; see mapLegend) */
    for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
      const id=legend.resolve(map,x,y,wf);
      const tile=id?NS.registry.get(id):NS.registry.get("__missing__");
      c.drawImage(tile,0,0,16,16,x*TILE,y*TILE,TILE,TILE);
    }
    /* static props (both water frames get identical props) */
    (map.props||[]).forEach(p=>{
      const spr=NS.registry.get(p.id);
      const m=NS.registry.meta(p.id)||{width:16,height:16};
      c.drawImage(spr,0,0,m.width,m.height,
        p.x*TILE+(p.dx||0), p.y*TILE+(p.dy||0), m.width*2, m.height*2);
    });
    /* static restricted-zone ground tint (layer 8's passive half) —
       double-codes the pebbled ground + rope posts for colorblind students */
    c.fillStyle=NS.palette.css(NS.palette.index("restricted-zone-tint"));
    for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
      if(legend.restricted.has(map.rows[y][x])) c.fillRect(x*TILE,y*TILE,TILE,TILE);
    }
    return cv;
  });
  /* resolve animated decorations once — no lookups in the frame loop */
  ambList=(map.ambient||[]).map(a=>({
    cvs:a.frames.map(id=>NS.registry.get(id)),
    x:a.x*TILE+(a.dx||0), y:a.y*TILE+(a.dy||0), ms:a.ms||0,
  }));
  smokeCvs=["amb.smoke.0","amb.smoke.1","amb.smoke.2"].map(id=>NS.registry.get(id));
  smokeList=map.find("M").map(p=>({x:p.x*TILE, y:(p.y-1)*TILE}));
};

NS.render.drawTerrain=function(ctx,waterFrame){
  ctx.drawImage(frames[waterFrame?1:0],0,0);
};

/* layer 3 (runtime): animated ambient decorations (chicken, bird, …) */
NS.render.drawAmbient=function(ctx,ts,rm){
  for(let i=0;i<ambList.length;i++){
    const a=ambList[i];
    const f=NS.render.ambFrame(a.cvs.length,a.ms,ts,rm);
    ctx.drawImage(a.cvs[f],0,0,16,16,a.x,a.y,TILE,TILE);
  }
};

/* layer 6: chimney smoke, above roofs and characters; 3 slow frames */
NS.render.drawSmoke=function(ctx,ts,rm){
  const f=NS.render.ambFrame(3,600,ts,rm);
  for(let i=0;i<smokeList.length;i++){
    ctx.drawImage(smokeCvs[f],0,0,16,16,smokeList[i].x,smokeList[i].y,TILE,TILE);
  }
};

/* blit any registered sprite at a tile position, 16→32 nearest-neighbor */
NS.render.drawTileSprite=function(ctx,id,tx,ty){
  ctx.drawImage(NS.registry.get(id),0,0,16,16,tx*TILE,ty*TILE,TILE,TILE);
};

})(globalThis.SWART = globalThis.SWART || {});
