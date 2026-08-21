/* =====================================================================
   SHADOW WAR — interaction markers (8×8 source, drawn at 16px)
   Small canvas glyphs that float above the tile the player is facing,
   underneath the DOM name label. Paper cream + dark outline so they
   survive grass, buildings, water, and grayscale. They bob slowly via a
   sine offset in the game loop — never a flash — and reduced-motion
   pins them still. Amber appears only on the "you can use this" glyph,
   consistent with the palette rule that amber marks interaction.

     ui.marker.interact  amber diamond — usable object (clothesline, door)
     ui.marker.talk      speech bubble — a person will speak
     ui.marker.locked    latched shutter bar — "not yet" (Roe's tavern)
   ===================================================================== */
(function(NS){
"use strict";
const {px,palette,registry}=NS;
const C=n=>palette.index(n);
const meta={kind:"ui",group:"ui",expect:{width:8,height:8}};
const M=()=>px.makeBuffer(8,8,0);

/* amber diamond in a dark outline */
const interact=M();
px.dots(interact,[[3,0],[4,0],[2,1],[5,1],[1,2],[6,2],[1,3],[6,3],[2,4],[5,4],[3,5],[4,5]],C("outline-dark"));
px.rect(interact,3,1,2,1,C("candle-amber"));
px.rect(interact,2,2,4,2,C("candle-amber"));
px.rect(interact,3,4,2,1,C("candle-amber"));
registry.register("ui.marker.interact",interact,meta);

/* small speech bubble with two ink dots and a tail */
const talk=M();
px.rect(talk,0,0,8,6,C("outline-dark"));
px.rect(talk,1,1,6,4,C("paper-cream"));
px.dot(talk,2,3,C("outline-dark"));
px.dot(talk,5,3,C("outline-dark"));
px.dot(talk,2,6,C("outline-dark"));
px.dot(talk,1,7,C("outline-dark"));
registry.register("ui.marker.talk",talk,meta);

/* latched bar over a cream field — closed, not forbidden */
const locked=M();
px.rect(locked,0,1,8,6,C("outline-dark"));
px.rect(locked,1,2,6,4,C("paper-cream"));
px.rect(locked,1,3,6,2,C("wood-medium"));   // the drawn bar
px.dot(locked,2,4,C("wood-dark"));          // pivot pin
px.dot(locked,5,4,C("wood-dark"));
registry.register("ui.marker.locked",locked,meta);

})(globalThis.SWART = globalThis.SWART || {});
