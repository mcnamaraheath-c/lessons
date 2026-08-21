/* =====================================================================
   SHADOW WAR — ambient decoration (optional life, never load-bearing)
   Rules: ambient assets never block critical paths, never resemble
   required interactables, and never demand attention. Animation is
   restrained — 2–3 slow frames — and reduced-motion mode shows frame 0
   only (enforced in worldRenderer.ambFrame).
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry}=NS;
const C=n=>palette.index(n);
const T=()=>px.makeBuffer(16,16,0);
const amb={kind:"prop",group:"ambient",expect:{width:16,height:16}};

/* chicken — 2 frames: head up / pecking */
function chicken(peck){
  const s=T();
  px.rect(s,5,9,6,4,C("paper-cream"));                  // body
  px.rect(s,6,13,1,2,C("muted-gold"));                  // legs
  px.rect(s,9,13,1,2,C("muted-gold"));
  px.rect(s,4,10,1,2,C("warm-cream"));                  // tail
  const hy=peck?9:6;
  px.rect(s,10,hy,2,3,C("paper-cream"));                // head
  px.rect(s,12,hy+1,1,1,C("muted-gold"));               // beak
  px.rect(s,10,hy-1,1,1,C("candle-amber"));             // comb (amber, never crimson)
  px.dot(s,11,hy+1,C("outline-dark"));                  // eye
  return s;
}
registry.register("amb.chicken.0",chicken(false),amb);
registry.register("amb.chicken.1",chicken(true),amb);

/* sleeping farm dog — curled, static */
const dog=T();
px.rect(dog,3,9,10,5,C("cloth-brown"));
px.rect(dog,4,8,4,2,C("cloth-brown"));                  // head tucked
px.rect(dog,3,8,1,2,C("wood-dark"));                    // ear
px.rect(dog,12,10,2,3,C("wood-dark"));                  // tail curl
px.rect(dog,3,14,10,1,C("outline-dark"));               // shadow
registry.register("amb.dog",dog,amb);

/* cat on the fence — static silhouette (drawn raised onto the rail) */
const cat=T();
px.rect(cat,6,6,4,6,C("iron-dark"));                    // sitting body
px.rect(cat,6,4,3,3,C("iron-dark"));                    // head
px.dot(cat,6,3,C("iron-dark")); px.dot(cat,8,3,C("iron-dark"));   // ears
px.rect(cat,7,10,1,2,C("paper-cream"));                 // chest
px.rect(cat,10,8,2,1,C("iron-dark"));                   // tail along rail
px.rect(cat,12,7,1,2,C("iron-dark"));
registry.register("amb.cat",cat,amb);

/* small bird — 2 frames: perched / wing flick */
function bird(flick){
  const s=T();
  px.rect(s,6,9,4,2,C("felt-dark"));                    // body
  px.rect(s,9,8,2,2,C("felt-dark"));                    // head
  px.dot(s,11,9,C("muted-gold"));                       // beak
  px.rect(s,5,10,2,1,C("felt-dark"));                   // tail
  if(flick) px.rect(s,6,7,3,2,C("iron-band"));          // raised wing
  else px.rect(s,6,9,3,1,C("iron-band"));               // folded wing
  return s;
}
registry.register("amb.bird.0",bird(false),amb);
registry.register("amb.bird.1",bird(true),amb);

/* chimney smoke — 3 slow frames drifting upward (drawn above the stack) */
function smoke(phase){
  const s=T();
  const puffs=[[7,12],[8,8],[6,4],[9,1]];
  puffs.forEach(([x,y],i)=>{
    const dy=(y-phase*2+16)%16 - 1;
    if(dy<0||dy>13) return;
    const w=2+((i+phase)%2);
    px.rect(s,x-((i+phase)%2),dy,w,2,i%2?C("weathered-gray"):C("stone-light"));
  });
  return s;
}
registry.register("amb.smoke.0",smoke(0),amb);
registry.register("amb.smoke.1",smoke(1),amb);
registry.register("amb.smoke.2",smoke(2),amb);

/* hanging laundry (generic wash on a neighbor's line) — 2 subtle frames */
function laundry(sway){
  const s=T();
  px.rect(s,1,4,14,1,C("warm-cream"));                  // cord
  const dx=sway?1:0;
  px.rect(s,3+dx,5,3,5,C("warm-cream"));                // shirt
  px.rect(s,8+dx,5,2,4,C("cloth-gray"));                // socks
  px.rect(s,11+dx,5,2,5,C("warm-cream"));               // apron
  return s;
}
registry.register("amb.laundry.0",laundry(false),amb);
registry.register("amb.laundry.1",laundry(true),amb);

/* grass tuft + flowers — quiet ground accents */
const tuft=T();
[[4,10],[6,9],[8,10],[10,9],[7,11]].forEach(([x,y])=>px.rect(tuft,x,y,1,3,C("grass-light")));
px.rect(tuft,5,12,6,1,C("grass-dark"));
registry.register("amb.tuft",tuft,amb);

const flowers=T();
[[4,9],[9,7],[12,11]].forEach(([x,y])=>{
  px.rect(flowers,x,y+2,1,3,C("grass-light"));          // stem
  px.rect(flowers,x-1,y,3,2,C("paper-cream"));          // petals
  px.dot(flowers,x,y,C("muted-gold"));                  // center
});
registry.register("amb.flowers",flowers,amb);

/* leaning farm tool (pitchfork) — drawn against a barn wall */
const tool=T();
px.rect(tool,8,3,1,11,C("wood-light"));                 // handle
px.rect(tool,9,12,1,2,C("wood-light"));                 // lean
px.rect(tool,6,2,5,1,C("iron-band"));                   // head bar
px.rect(tool,6,0,1,2,C("iron-band"));                   // tines
px.rect(tool,8,0,1,2,C("iron-band"));
px.rect(tool,10,0,1,2,C("iron-band"));
registry.register("amb.tool",tool,amb);

/* hay bundle */
const hay=T();
px.rect(hay,3,8,10,6,C("muted-gold"));
px.rect(hay,5,6,6,2,C("muted-gold"));
px.rect(hay,3,10,10,1,C("earth-light"));                // binding band
[[4,9],[9,8],[6,12],[11,12]].forEach(([x,y])=>px.dot(hay,x,y,C("earth-light")));
px.rect(hay,3,14,10,1,C("outline-dark"));
registry.register("amb.hay",hay,amb);

/* animation groups (metadata for the preview player + renderers) */
registry.defineAnim("amb.chicken",{all:["amb.chicken.0","amb.chicken.1"]});
registry.defineAnim("amb.bird",{all:["amb.bird.0","amb.bird.1"]});
registry.defineAnim("amb.smoke",{all:["amb.smoke.0","amb.smoke.1","amb.smoke.2"]});
registry.defineAnim("amb.laundry",{all:["amb.laundry.0","amb.laundry.1"]});

})(globalThis.SWART = globalThis.SWART || {});
