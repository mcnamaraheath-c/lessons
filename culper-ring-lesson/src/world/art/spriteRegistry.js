/* =====================================================================
   SHADOW WAR — sprite registry
   Renderers never touch pixel data: they ask the registry for a cached
   offscreen canvas by ID ("tile.grass.0", "anna.walk.south.1", ...).

   Guarantees:
   - duplicate IDs are rejected at registration
   - structural validation runs once, at registration (cheap, init-time)
   - a missing ID returns a loud magenta fallback instead of crashing,
     and logs the ID once
   - canvases are rasterized lazily on first get() and cached forever
   ===================================================================== */
(function(NS){
"use strict";

const data={};      // id -> {sprite, meta}
const canvases={};  // id -> canvas (cache)
const anims={};     // groupId -> {facing: [frameId,...]}
const animCache={}; // groupId -> {facing: [canvas,...]}
const warnings=[];
const missingSeen=new Set();
let fallbackCanvas=null;

function warn(msg){
  warnings.push(msg);
  if(typeof console!=="undefined") console.warn("[SWART] "+msg);
}

function makeFallback(){
  if(fallbackCanvas) return fallbackCanvas;
  const cv=document.createElement("canvas");
  cv.width=cv.height=16;
  const c=cv.getContext("2d");
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
    c.fillStyle=((x+y)%2)?"#ff00ff":"#10161f";
    c.fillRect(x*4,y*4,4,4);
  }
  fallbackCanvas=cv;
  return cv;
}

NS.registry={

  /* register(id, spriteBuffer, meta)
     meta: { kind:'tile'|'character'|'prop'|'effect',
             faction:'british'|'civilian'|null,
             expect:{width,height}?  — enforced size
             tags:[]? } */
  register(id,sprite,meta){
    if(data[id]) throw new Error("registry: duplicate id '"+id+"'");
    meta=meta||{};
    const errs=NS.px.validate(sprite,meta.expect);
    if(errs.length) throw new Error("registry: invalid sprite '"+id+"': "+errs.join("; "));
    data[id]={sprite,meta:{kind:meta.kind||"misc",faction:meta.faction||null,
      tags:meta.tags||[],width:sprite.width,height:sprite.height}};
    return id;
  },

  has(id){ return !!data[id]; },

  /* cached canvas for an id; loud fallback when missing */
  get(id){
    const cached=canvases[id];
    if(cached) return cached;
    const rec=data[id];
    if(!rec){
      if(!missingSeen.has(id)){ missingSeen.add(id); warn("missing sprite '"+id+"' — using fallback"); }
      return makeFallback();
    }
    return (canvases[id]=NS.px.toCanvas(rec.sprite));
  },
  getSprite(id){ return NS.registry.get(id); },   // conceptual alias

  /* the loud magenta checker shown for missing IDs — public so the
     asset preview can display it without triggering a warning */
  fallback(){ return makeFallback(); },

  /* raw source buffer (for tools/tests, not for rendering) */
  getData(id){ return data[id]?data[id].sprite:null; },
  meta(id){ return data[id]?data[id].meta:null; },
  list(){ return Object.keys(data); },
  getWarnings(){ return warnings.slice(); },

  /* ---------- animation groups ---------- */
  /* defineAnim("anna.walk", {south:["anna.walk.south.0",...], ...}) */
  defineAnim(groupId,facings){
    if(anims[groupId]) throw new Error("registry: duplicate anim group '"+groupId+"'");
    anims[groupId]=facings;
  },
  /* Resolved once and cached: {south:[canvas,canvas], ...}.
     Game code holds the returned object — frame lookup allocates nothing. */
  anim(groupId){
    const cached=animCache[groupId];
    if(cached) return cached;
    const def=anims[groupId];
    if(!def){ warn("missing anim group '"+groupId+"'"); return (animCache[groupId]={}); }
    const out={};
    for(const facing in def) out[facing]=def[facing].map(id=>NS.registry.get(id));
    return (animCache[groupId]=out);
  },
  animGroups(){ return Object.keys(anims); },

  /* ---------- audits (dev/test time; also run once at init) ---------- */
  /* British crimson may only appear in sprites tagged faction:'british'. */
  auditCrimson(){
    const bad=[];
    const reserved=NS.palette.BRITISH_ONLY;
    for(const id in data){
      const {sprite,meta}=data[id];
      if(meta.faction==="british") continue;
      if(meta.tags.includes("crimson-ok")) continue;   // explicitly British object (rare)
      const used=NS.px.usedIndexes(sprite);
      reserved.forEach(i=>{ if(used.has(i)) bad.push(id+" uses reserved '"+NS.palette.info[i].name+"'"); });
    }
    return bad;
  },
  auditBlank(){
    const bad=[];
    for(const id in data) if(NS.px.isBlank(data[id].sprite)) bad.push(id+" is fully transparent");
    return bad;
  },
  auditAnimFrames(){
    const bad=[];
    for(const g in anims){
      for(const facing in anims[g]){
        anims[g][facing].forEach(id=>{ if(!data[id]) bad.push("anim '"+g+"."+facing+"' references missing '"+id+"'"); });
        if(!anims[g][facing].length) bad.push("anim '"+g+"."+facing+"' has no frames");
      }
    }
    return bad;
  },
  validateAll(){
    const errors=[].concat(NS.registry.auditCrimson(), NS.registry.auditBlank(), NS.registry.auditAnimFrames());
    return {errors, warnings:warnings.slice(), count:Object.keys(data).length};
  },

  /* test hook — never used by game code */
  _resetForTests(){
    for(const k in data) delete data[k];
    for(const k in canvases) delete canvases[k];
    for(const k in anims) delete anims[k];
    for(const k in animCache) delete animCache[k];
    warnings.length=0; missingSeen.clear();
  },
};

})(globalThis.SWART = globalThis.SWART || {});
