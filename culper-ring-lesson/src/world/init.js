/* =====================================================================
   SHADOW WAR — world asset init
   Called once by the game before the first map frame. All pixel-data →
   canvas conversion happens here; nothing converts per frame.
   ===================================================================== */
(function(NS){
"use strict";
let done=false;

NS.TILE=32;

NS.init=function(){
  if(done) return NS;
  done=true;
  // bake the static map (terrain + structures + restricted tint), both water frames
  NS.render.buildTerrain(NS.maps.setauket,NS.legend);
  // warm the character/prop canvas caches so first draw doesn't hitch
  NS.registry.list().forEach(id=>NS.registry.get(id));
  // one full audit at load; problems are console warnings, never crashes
  const report=NS.registry.validateAll();
  if(report.errors.length && typeof console!=="undefined")
    console.warn("[SWART] asset audit:",report.errors);
  return NS;
};

})(globalThis.SWART = globalThis.SWART || {});
