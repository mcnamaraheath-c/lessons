/* =====================================================================
   SHADOW WAR — landmark props & dock props

   THE CLOTHESLINE is the mission's central landmark:
   strong horizontal silhouette (two posts + bright cord against grass),
   the only cream horizontal line in the world, no crimson anywhere.

   Clothesline asset IDs map to the ACTUAL puzzle states in the game
   (win = 1 black petticoat + 4 white handkerchiefs; the tray decoys —
   shirt/apron/socks — never appear on the map line in Mission 1):

     prop.clothesline.empty        bare line (before the signal is hung)
     prop.clothesline.signal.m1    Mission-1 signal: petticoat + 4 hankies
     prop.clothesline.item.petticoat   composable piece (fixed slot)
     prop.clothesline.item.hank        one handkerchief at slot 0
     prop.clothesline.wash         ordinary decoy laundry (future ambience)

   Variable configurations (Mission 2 "Six Coves" needs 1–6 hankies) are
   composed at draw time by SWART.compose.drawClothesline — see
   rendering/compose.js for the slot rules.
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry,tilePaint}=NS;
const C=n=>palette.index(n);
const T=()=>px.makeBuffer(16,16,0);
const land={kind:"prop",group:"landmarks",expect:{width:16,height:16}};
const dockM={kind:"prop",group:"dock",expect:{width:16,height:16}};

/* ---------- the clothesline ---------- */
const line=tilePaint.paintGrass(T());
px.rect(line,1,3,2,11,C("roof-brown"));
px.rect(line,13,3,2,11,C("roof-brown"));
px.rect(line,1,2,2,1,C("wood-light"));
px.rect(line,13,2,2,1,C("wood-light"));
px.rect(line,2,5,12,1,C("warm-cream"));                 // the cord — the landmark line
registry.register("prop.clothesline.empty",line,land);

/* composable items (transparent overlays, aligned to the cord at y=5) */
const petti=T();
px.rect(petti,3,5,3,6,C("midnight-blue"));              // the black petticoat
px.rect(petti,3,5,3,1,C("outline-dark"));               // pinned fold
registry.register("prop.clothesline.item.petticoat",petti,land);
const hank=T();
px.rect(hank,7,5,1,3,C("paper-cream"));                 // one handkerchief, slot 0
registry.register("prop.clothesline.item.hank",hank,land);

/* Mission 1 signal, pre-composed: petticoat + exactly 4 handkerchiefs */
const sig=T();
px.rect(sig,3,5,3,6,C("midnight-blue"));
px.rect(sig,3,5,3,1,C("outline-dark"));
for(let i=0;i<4;i++) px.rect(sig,7+i*2,5,1,3,C("paper-cream"));
registry.register("prop.clothesline.signal.m1",sig,land);

/* ordinary wash (decoy items from the puzzle tray) — not used in M1 */
const wash=T();
px.rect(wash,3,5,3,5,C("warm-cream"));                  // work shirt
px.rect(wash,8,5,2,4,C("cloth-gray"));                  // socks
px.rect(wash,11,5,2,5,C("warm-cream"));                 // apron
registry.register("prop.clothesline.wash",wash,land);

/* ---------- village landmarks ---------- */
const trough=T();
px.rect(trough,2,7,12,6,C("wood-medium"));
px.rect(trough,3,8,10,3,C("water-medium"));
px.rect(trough,3,8,4,1,C("water-light"));
px.rect(trough,2,7,12,1,C("wood-dark"));
px.rect(trough,3,13,2,2,C("wood-dark"));                // legs
px.rect(trough,11,13,2,2,C("wood-dark"));
registry.register("prop.trough",trough,land);

const hitch=T();
px.rect(hitch,7,4,2,10,C("wood-dark"));
px.rect(hitch,3,4,10,2,C("wood-medium"));
px.rect(hitch,3,4,10,1,C("wood-light"));
px.rect(hitch,4,6,1,3,C("sand-medium"));                // tied lead rope
registry.register("prop.hitchpost",hitch,land);

const signT=T();
px.rect(signT,7,0,2,3,C("wood-dark"));                  // bracket from the wall
px.rect(signT,3,3,10,8,C("muted-gold"));                // the board
px.rect(signT,3,3,10,1,C("wood-dark"));
px.rect(signT,3,10,10,1,C("wood-dark"));
px.rect(signT,3,3,1,8,C("wood-dark"));
px.rect(signT,12,3,1,8,C("wood-dark"));
px.rect(signT,6,5,3,4,C("wood-dark"));                  // tankard silhouette
px.rect(signT,9,6,1,2,C("wood-dark"));                  // handle
registry.register("prop.sign.tavern",signT,land);

const wheelb=T();
px.rect(wheelb,3,7,9,4,C("wood-medium"));               // tray
px.rect(wheelb,3,7,9,1,C("wood-light"));
px.rect(wheelb,12,8,3,1,C("wood-dark"));                // handles
px.rect(wheelb,2,11,4,4,C("wood-dark"));                // wheel
px.rect(wheelb,3,12,2,2,C("weathered-gray"));
px.rect(wheelb,10,11,2,3,C("wood-dark"));               // leg
registry.register("prop.wheelbarrow",wheelb,land);

const woodpile=T();
for(let r=0;r<2;r++)for(let i=0;i<4;i++){
  const x=2+i*3+(r?1:0), y=7+r*4;
  px.rect(woodpile,x,y,3,4,C("wood-medium"));
  px.rect(woodpile,x+1,y+1,1,1,C("wood-light"));        // log end ring
  px.rect(woodpile,x,y,1,4,C("wood-dark"));
}
registry.register("prop.woodpile",woodpile,land);

const firewood=T();
for(let i=0;i<5;i++) px.rect(firewood,3+i*2,6,1,8,i%2?C("wood-light"):C("wood-medium"));
px.rect(firewood,2,13,12,2,C("wood-dark"));             // base billet
px.rect(firewood,2,6,12,1,C("wood-dark"));
registry.register("prop.firewood",firewood,land);

const basket=T();
px.rect(basket,4,9,8,5,C("sand-medium"));
px.rect(basket,4,9,8,1,C("earth-light"));
px.rect(basket,4,11,8,1,C("earth-light"));              // weave bands
px.rect(basket,5,7,6,2,C("paper-cream"));               // folded linen over the rim
registry.register("prop.basket",basket,land);

/* ---------- working waterfront ---------- */
const barrel=T();
px.rect(barrel,4,4,8,11,C("wood-medium"));
px.rect(barrel,5,3,6,1,C("wood-light"));                // top rim
px.rect(barrel,7,4,1,11,C("wood-dark"));                // stave shadow
px.rect(barrel,10,4,1,11,C("wood-dark"));
px.rect(barrel,4,6,8,1,C("iron-band"));                 // hoops
px.rect(barrel,4,12,8,1,C("iron-band"));
registry.register("prop.barrel",barrel,dockM);

const crate=T();
px.rect(crate,3,6,10,9,C("wood-light"));
px.rect(crate,3,6,10,1,C("wood-medium"));
px.rect(crate,3,14,10,1,C("wood-dark"));
px.rect(crate,3,6,1,9,C("wood-dark"));
px.rect(crate,12,6,1,9,C("wood-dark"));
px.rect(crate,3,10,10,1,C("wood-medium"));              // mid board
registry.register("prop.crate",crate,dockM);

const rope=T();
px.rect(rope,4,8,8,6,C("sand-medium"));
px.rect(rope,6,10,4,2,C("earth-dark"));                 // coil eye
px.rect(rope,4,8,8,1,C("earth-light"));
px.rect(rope,4,13,8,1,C("earth-dark"));
registry.register("prop.rope",rope,dockM);

const net=T();
for(let y=8;y<15;y+=2) px.rect(net,2,y,12,1,C("sand-dark"));
for(let x=2;x<15;x+=3) px.rect(net,x,8,1,7,C("sand-dark"));
px.dots(net,[[3,7],[8,7],[13,7]],C("muted-gold"));      // cork floats
registry.register("prop.net",net,dockM);

const dockpost=T();
px.rect(dockpost,6,4,4,11,C("wood-dark"));
px.rect(dockpost,6,3,4,1,C("wood-light"));
px.rect(dockpost,5,6,6,2,C("sand-medium"));             // mooring rope wrap
registry.register("prop.dockpost",dockpost,dockM);

/* beached rowboat — 32×12 source, spans two tiles on the sand */
const row=px.makeBuffer(32,12,0);
px.rect(row,2,3,28,6,C("wood-dark"));                   // hull
px.rect(row,4,2,24,1,C("wood-medium"));                 // gunwale
px.rect(row,0,4,2,4,C("wood-dark"));                    // stern
px.rect(row,30,4,2,3,C("wood-dark"));                   // bow
px.rect(row,9,3,1,5,C("wood-medium"));                  // thwarts
px.rect(row,20,3,1,5,C("wood-medium"));
px.rect(row,3,9,27,1,C("outline-dark"));                // ground shadow
registry.register("prop.rowboat",row,{kind:"prop",group:"dock",expect:{width:32,height:12}});

/* Brewster's whaleboat hull (26×8, drawn at the dock at night) */
const boat=px.makeBuffer(26,8,0);
px.rect(boat,0,0,26,5,C("wood-dark"));
px.rect(boat,1,0,24,1,C("wood-medium"));
px.rect(boat,2,5,22,2,C("outline-dark"));
registry.register("prop.boat",boat,{kind:"prop",group:"dock",expect:{width:26,height:8}});

})(globalThis.SWART = globalThis.SWART || {});
