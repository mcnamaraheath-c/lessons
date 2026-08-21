/* =====================================================================
   SHADOW WAR — Anna Strong (the player)
   Identity: muted colonial-blue dress · cream apron front · cream bonnet
   · practical dark shoes. Capable and domestic, never aristocratic, and
   never crimson. No carried accessory: at 16×16 a basket muddied her
   silhouette against the busy yard (see BUILD_LOG), and the apron +
   bonnet already carry the identity.

   Animation contract (the game maps its d/u/l/r facings to compass):
     anna.walk  — 4 facings × 2 frames, 140 ms/tile tween, frame
                  alternates only while a tween is active
     anna.idle  — frame 0 of each facing (feet planted, nothing animates
                  while standing)
   Frame IDs: anna.walk.<facing>.<0|1>; idle simply reuses frame 0, so
   anna.idle.<facing> resolves through the anim group, not extra art.
   ===================================================================== */
(function(NS){
"use strict";
const C=n=>NS.palette.index(n);

NS.registerWalkSet("anna.walk",{
  coat:C("cloth-blue"), skirt:1,
  hat:"bonnet", hatC:C("warm-cream"),
  hair:C("hair-brown"), skin:C("skin-light"),
},{faction:"civilian",tags:["player"]});

/* idle group: frame 0 per facing — no duplicate pixel data */
NS.registry.defineAnim("anna.idle",{
  south:["anna.walk.south.0"], north:["anna.walk.north.0"],
  west:["anna.walk.west.0"],   east:["anna.walk.east.0"],
});

})(globalThis.SWART = globalThis.SWART || {});
