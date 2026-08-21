/* =====================================================================
   SHADOW WAR — British soldiers
   THE ONLY CHARACTER FILE ALLOWED TO USE BRITISH CRIMSON.
   Danger is double-coded for colorblind students: crimson coat AND the
   tall shako silhouette (row 0 pixels — no civilian reaches row 0).
   White crossbelts + dark gaiters complete the kit; both cues survive
   grayscale (validated in tools/test-assets).

   Two related patrol variants so the pair doesn't read as clones:
     variant A — musket shouldered on the RIGHT
     variant B — musket shouldered on the LEFT + white haversack
   Both are working soldiers on occupation duty: no caricature, no
   villain styling. Full 2-frame walk sets because guards patrol; the
   game advances the frame only on tile arrival (synchronized to
   movement, never free-running), and facing must always be unmistakable
   because the sight cone points where the sprite points.

   Anim groups: guard.variantA / guard.variantB
   (guard.walk is kept as a compatibility alias of variant A).
   ===================================================================== */
(function(NS){
"use strict";
const C=n=>NS.palette.index(n);

const kit={
  coat:C("british-crimson"), skirt:0,
  hat:"tall", hatC:C("iron-dark"),
  hair:C("hair-dark"), skin:C("skin-light"),
  crossbelt:true,
};

NS.registerWalkSet("guard.walk",
  Object.assign({},kit,{accessory:"musket"}),
  {faction:"british"});
NS.registry.defineAnim("guard.variantA",{
  south:["guard.walk.south.0","guard.walk.south.1"],
  north:["guard.walk.north.0","guard.walk.north.1"],
  west:["guard.walk.west.0","guard.walk.west.1"],
  east:["guard.walk.east.0","guard.walk.east.1"],
});

NS.registerWalkSet("guard.b.walk",
  Object.assign({},kit,{accessory:["musketL","haversack"]}),
  {faction:"british"});
NS.registry.defineAnim("guard.variantB",{
  south:["guard.b.walk.south.0","guard.b.walk.south.1"],
  north:["guard.b.walk.north.0","guard.b.walk.north.1"],
  west:["guard.b.walk.west.0","guard.b.walk.west.1"],
  east:["guard.b.walk.east.0","guard.b.walk.east.1"],
});

})(globalThis.SWART = globalThis.SWART || {});
