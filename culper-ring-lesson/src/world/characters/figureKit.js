/* =====================================================================
   SHADOW WAR — shared figure builder
   One parameterized 16×16 body so every villager reads as the same
   species of chunky pixel person. Facings: south/north/west/east.
   Frames: 0 (idle) and 1 (step). Skirted figures sway the hem; trousered
   figures alternate legs.

   SILHOUETTE FIRST (ART_BIBLE): at 16×16 identity comes from headwear,
   body shape, clothing color family, ONE accessory, and stance — never
   from facial detail. Faces are hair + two eye pixels, full stop.

   Frame discipline: feet always touch row 15, heads never rise above the
   hat's fixed rows, accessories keep the same anchor across frames — so
   there is no frame-to-frame size wobble (validated in tools/test-assets).

   opts (all palette indexes unless noted):
     coat, skirt(bool), skin, hair
     hat: tall|tricorn|straw|bonnet|cap|null · hatC · hatBrimC?
     vest: shirt sleeves show (arms use shirtC, default warm-cream)
     rolled: rolled sleeves (lower arms show skin) — working sailor look
     crossbelt: white military crossbelts (British kit)
     accessory: staff|stick|basket|rope|musket|musketL|haversack
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette}=NS;
const C=n=>palette.index(n);

NS.buildFigure=function(o,facing,step){
  const s=px.makeBuffer(16,16,0);
  const R=(x,y,w,h,i)=>px.rect(s,x,y,w,h,i);
  const eye=C("outline-dark"), boot=C("boot-dark");
  // head + face
  R(5,3,6,4,o.skin);
  if(facing==="north"){ R(5,3,6,4,o.hair); }
  else{
    R(5,3,6,1,o.hair);
    if(facing==="south"){ R(6,5,1,1,eye); R(9,5,1,1,eye); }
    if(facing==="west"){ R(6,5,1,1,eye); }
    if(facing==="east"){ R(9,5,1,1,eye); }
  }
  // hats — the silhouette layer (tall hat is BRITISH ONLY by convention)
  if(o.hat==="tall"){    R(5,0,6,3,o.hatC); R(5,2,6,1,C("iron-band")); R(4,3,8,1,o.hatC); }
  if(o.hat==="tricorn"){ R(5,1,6,2,o.hatC); R(3,3,10,1,o.hatC); }
  if(o.hat==="straw"){   R(5,1,6,2,o.hatC); R(3,3,10,1,o.hatBrimC!==undefined?o.hatBrimC:o.hatC); }
  if(o.hat==="bonnet"){  R(4,1,8,3,o.hatC); R(4,4,1,2,o.hatC); R(11,4,1,2,o.hatC); }
  if(o.hat==="cap"){     R(5,1,6,2,o.hatC); }
  // body
  const armC = o.vest ? (o.shirtC!==undefined?o.shirtC:C("warm-cream")) : o.coat;
  if(o.skirt){
    R(5,7,6,3,o.coat);
    R(4,7,1,3,armC); R(11,7,1,3,armC);                  // arms
    R(4,10,8,3,o.coat);
    const sway=step?(facing==="west"?-1:1):0;
    R(3+sway,13,10,2,o.coat);                           // hem
    R(5,15,2,1,boot); R(9,15,2,1,boot);                 // shoes peek (row 15)
    R(6,8,4,2,C("warm-cream"));                         // apron front
  }else{
    R(5,7,6,5,o.coat);
    R(4,7,1,4,armC); R(11,7,1,4,armC);
    if(o.rolled){ R(4,9,1,2,o.skin); R(11,9,1,2,o.skin); }   // rolled sleeves
    if(o.crossbelt){ R(5,7,1,4,C("white-crossbelt")); R(10,7,1,4,C("white-crossbelt")); }
    const la=step?1:0, lb=step?0:1;
    R(5,12+la,2,3-la,boot); R(9,12+lb,2,3-lb,boot);
    R(5,15,2,1,boot); R(9,15,2,1,boot);                 // feet planted (row 15)
  }
  // identifying accessories — same anchors in both frames of a facing
  // (usually ONE per figure; guards pair musket + haversack)
  const accs=Array.isArray(o.accessory)?o.accessory:(o.accessory?[o.accessory]:[]);
  accs.forEach(acc=>{
    if(acc==="staff"){                                  // tall walking staff
      const x=facing==="west"?2:13;
      R(x,3,1,12,C("wood-light")); R(x,3,1,1,C("wood-medium"));
    }
    if(acc==="stick"){                                  // elder's cane
      const x=facing==="west"?2:13;
      R(x,8,1,7,C("wood-medium")); R(x,8,1,1,C("wood-dark"));
    }
    if(acc==="basket"){                                 // market basket at the hip
      R(2,10,3,3,C("sand-medium")); R(2,10,3,1,C("earth-light"));
    }
    if(acc==="rope"){                                   // boatman's rope coil
      R(11,10,3,3,C("sand-medium")); px.dot(s,12,11,C("earth-dark"));
    }
    if(acc==="musket"||acc==="musketL"){                // shouldered musket
      const x=acc==="musketL"?1:14;
      R(x,1,1,7,C("iron-band"));                        // barrel above the shoulder
      R(x,8,1,6,C("wood-dark"));                        // stock
    }
    if(acc==="haversack"){                              // white canvas haversack
      R(11,9,3,4,C("paper-cream")); px.dot(s,11,9,C("sand-dark"));
    }
  });
  return s;
};

const FACINGS=["south","north","west","east"];
NS.FACINGS=FACINGS;

/* register a 4-facing × 2-frame walk set + its animation group */
NS.registerWalkSet=function(groupId,opts,meta){
  const facings={};
  FACINGS.forEach(f=>{
    facings[f]=[0,1].map(step=>{
      const id=groupId+"."+f+"."+step;
      NS.registry.register(id,NS.buildFigure(opts,f,step),
        Object.assign({kind:"character",group:"characters",expect:{width:16,height:16}},meta));
      return id;
    });
  });
  NS.registry.defineAnim(groupId,facings);
};

/* register a 4-facing idle set (one frame per facing) —
   ids: <groupId>.idle.<facing>, anim group: <groupId>.idle */
NS.registerIdleSet=function(groupId,opts,meta){
  const facings={};
  FACINGS.forEach(f=>{
    const id=groupId+".idle."+f;
    NS.registry.register(id,NS.buildFigure(opts,f,0),
      Object.assign({kind:"character",group:"characters",expect:{width:16,height:16}},meta));
    facings[f]=[id];
  });
  NS.registry.defineAnim(groupId+".idle",facings);
};

/* single idle facing (kept for special cases) */
NS.registerIdle=function(id,opts,facing,meta){
  NS.registry.register(id,NS.buildFigure(opts,facing,0),
    Object.assign({kind:"character",group:"characters",expect:{width:16,height:16}},meta));
};

})(globalThis.SWART = globalThis.SWART || {});
