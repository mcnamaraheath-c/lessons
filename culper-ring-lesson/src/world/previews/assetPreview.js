/* =====================================================================
   SHADOW WAR — asset preview (DEV ONLY)
   Opened from debug mode (backtick, then P) or from previews/preview.html.
   Never reachable during normal student play — the game only calls
   NS.preview.open() from inside its debug branch.

   Shows: full palette (index/name/hex/use), every registered sprite with
   ID + dimensions, animation groups playing live, and audit warnings.
   ===================================================================== */
(function(NS){
"use strict";
let panel=null, animTimer=null;

function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

function build(){
  panel=document.createElement("div");
  panel.id="swart-preview";
  panel.setAttribute("style",
    "position:fixed;inset:2vh 2vw;z-index:99;overflow:auto;background:#10161f;"+
    "color:#f2e8d5;border:2px solid #e8a33d;border-radius:12px;padding:16px;"+
    "font:14px/1.5 monospace");
  const report=NS.registry.validateAll();
  let html='<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">'+
    '<h2 style="font:700 18px Georgia,serif;letter-spacing:.08em">SHADOW WAR — ASSET PREVIEW (dev)</h2>'+
    '<label style="margin-left:auto;color:#9aa8bb"><input type="checkbox" id="swart-gray"> grayscale</label>'+
    '<button id="swart-preview-close" style="font:inherit;padding:6px 14px;cursor:pointer">close</button></div>';

  // audit results first — this is the panel's real job
  const problems=report.errors.concat(report.warnings);
  html+='<h3 style="color:#e8a33d;margin:12px 0 4px">audit — '+report.count+' assets, '+
    problems.length+' problem(s)</h3>';
  html+=problems.length
    ? '<ul style="color:#ff7b7b">'+problems.map(w=>"<li>"+esc(w)+"</li>").join("")+"</ul>"
    : '<div style="color:#7da87b">clean ✓</div>';

  // palette
  html+='<h3 style="color:#e8a33d;margin:14px 0 4px">palette ('+NS.palette.size+')</h3>'+
    '<table style="border-collapse:collapse">'+
    NS.palette.info.map(p=>'<tr>'+
      '<td style="padding:1px 8px">'+p.index+'</td>'+
      '<td><span style="display:inline-block;width:28px;height:14px;border:1px solid #555;'+
        'background:'+(p.css||"transparent")+'"></span></td>'+
      '<td style="padding:1px 8px">'+esc(p.name)+'</td>'+
      '<td style="padding:1px 8px;color:#9aa8bb">'+esc(p.css||"—")+'</td>'+
      '<td style="padding:1px 8px;color:#8090a5">'+esc(p.use)+'</td></tr>').join("")+"</table>";

  // sprites grouped by meta.group (terrain / nature / structures /
  // landmarks / dock / ambient / …), falling back to kind
  const GROUP_ORDER=["terrain","nature","structures","landmarks","dock","ambient","character","effect","tile","prop","misc"];
  const byKind={};
  NS.registry.list().forEach(id=>{
    const m=NS.registry.meta(id);
    const k=m.group||m.kind;
    (byKind[k]=byKind[k]||[]).push(id);
  });
  const groups=Object.keys(byKind).sort((a,b)=>{
    const ia=GROUP_ORDER.indexOf(a), ib=GROUP_ORDER.indexOf(b);
    return (ia<0?99:ia)-(ib<0?99:ib) || a.localeCompare(b);
  });
  for(const kind of groups){
    html+='<h3 style="color:#e8a33d;margin:14px 0 4px">'+esc(kind)+' ('+byKind[kind].length+')</h3>'+
      '<div style="display:flex;flex-wrap:wrap;gap:10px">'+
      byKind[kind].sort().map(id=>{
        const m=NS.registry.meta(id);
        return '<figure style="margin:0;text-align:center">'+
          '<span class="swart-spr" data-id="'+esc(id)+'" style="display:inline-block;'+
            'width:'+(m.width*3)+'px;height:'+(m.height*3)+'px;background:#243247"></span>'+
          '<figcaption style="max-width:110px;color:#9aa8bb;font-size:11px">'+esc(id)+
          '<br>'+m.width+"×"+m.height+(m.faction?"<br>"+esc(m.faction):"")+'</figcaption></figure>';
      }).join("")+"</div>";
  }

  // animation groups (live, with a reduced-motion preview toggle)
  const animGroups=NS.registry.animGroups();
  if(animGroups.length){
    html+='<h3 style="color:#e8a33d;margin:14px 0 4px">animations ('+animGroups.length+')</h3>'+
      '<label style="display:block;margin-bottom:8px;color:#9aa8bb">'+
      '<input type="checkbox" id="swart-rm"> reduced-motion preview (frame 0 only)</label>'+
      '<div style="display:flex;flex-wrap:wrap;gap:14px">'+
      animGroups.map(g=>'<figure style="margin:0;text-align:center">'+
        '<span class="swart-anim" data-g="'+esc(g)+'" style="display:inline-block;width:48px;height:48px;background:#243247"></span>'+
        '<figcaption style="color:#9aa8bb;font-size:11px">'+esc(g)+'</figcaption></figure>').join("")+"</div>";
  }
  // characters in context: key sprites over grass / path / dock / shore
  const CTX_BGS=["tile.grass.0","tile.path.center","tile.dock.0","tile.sand.restricted"];
  const CTX_SPRITES=["anna.walk.south.0","guard.walk.south.0","guard.b.walk.south.0",
    "npc.abraham.idle.west","npc.widow.idle.east","npc.oldman.idle.west",
    "npc.jonah.idle.south","npc.brewster.idle.south","npc.youth.idle.south"];
  html+='<h3 style="color:#e8a33d;margin:14px 0 4px">characters in context (readability check)</h3>'+
    '<div style="display:flex;flex-wrap:wrap;gap:10px">'+
    CTX_SPRITES.map(id=>'<figure style="margin:0;text-align:center">'+
      '<span class="swart-ctx" data-id="'+esc(id)+'"></span>'+
      '<figcaption style="max-width:132px;color:#9aa8bb;font-size:11px">'+esc(id)+'</figcaption></figure>').join("")+"</div>";
  // floating-label samples over the same backgrounds
  html+='<h3 style="color:#e8a33d;margin:14px 0 4px">interaction labels over terrain</h3>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap">'+
    CTX_BGS.map(bg=>'<span class="swart-lbl" data-bg="'+esc(bg)+'" style="position:relative;display:inline-block;width:96px;height:64px">'+
      '<span style="position:absolute;left:50%;top:18px;transform:translate(-50%,-100%);background:#f2e8d5;'+
      'border:2px solid #10161f;color:#2b2418;font-weight:600;font-size:12px;padding:1px 7px;border-radius:7px;white-space:nowrap">Tendedero</span></span>').join("")+"</div>";
  // the missing-sprite fallback, so everyone knows what "broken" looks like
  html+='<h3 style="color:#e8a33d;margin:14px 0 4px">missing-sprite fallback</h3>'+
    '<figure style="margin:0;text-align:center;display:inline-block">'+
    '<span id="swart-fallback"></span>'+
    '<figcaption style="color:#9aa8bb;font-size:11px">what an unregistered ID renders as</figcaption></figure>';
  panel.innerHTML=html;
  document.body.appendChild(panel);

  // paint context strips (sprite composited over each background tile)
  panel.querySelectorAll(".swart-ctx").forEach(el=>{
    const id=el.dataset.id;
    CTX_BGS.forEach(bg=>{
      const cv=document.createElement("canvas"); cv.width=cv.height=32;
      cv.style.margin="0 1px";
      const c=cv.getContext("2d"); c.imageSmoothingEnabled=false;
      c.drawImage(NS.registry.get(bg),0,0,16,16,0,0,32,32);
      c.drawImage(NS.registry.get(id),0,0,16,16,0,-4,32,32);
      el.appendChild(cv);
    });
  });
  // label sample backgrounds
  panel.querySelectorAll(".swart-lbl").forEach(el=>{
    const cv=document.createElement("canvas"); cv.width=96; cv.height=64;
    cv.style.cssText="position:absolute;inset:0";
    const c=cv.getContext("2d"); c.imageSmoothingEnabled=false;
    for(let x=0;x<3;x++)for(let y=0;y<2;y++)
      c.drawImage(NS.registry.get(el.dataset.bg),0,0,16,16,x*32,y*32,32,32);
    el.insertBefore(cv,el.firstChild);
  });
  // fallback checker
  { const cv=document.createElement("canvas"); cv.width=cv.height=48;
    const c=cv.getContext("2d"); c.imageSmoothingEnabled=false;
    c.drawImage(NS.registry.fallback(),0,0,16,16,0,0,48,48);
    panel.querySelector("#swart-fallback").appendChild(cv); }
  // grayscale preview: one CSS filter covers palette, sprites, and labels
  panel.querySelector("#swart-gray").addEventListener("change",e=>{
    panel.style.filter=e.target.checked?"grayscale(1)":"";
  });

  // paint sprite thumbnails (scaled 3×, nearest neighbor)
  panel.querySelectorAll(".swart-spr").forEach(el=>{
    const id=el.dataset.id, m=NS.registry.meta(id);
    const cv=document.createElement("canvas");
    cv.width=m.width*3; cv.height=m.height*3;
    const c=cv.getContext("2d");
    c.imageSmoothingEnabled=false;
    c.drawImage(NS.registry.get(id),0,0,m.width,m.height,0,0,cv.width,cv.height);
    el.appendChild(cv);
  });
  // animation players: cycle facings and frames
  const players=[...panel.querySelectorAll(".swart-anim")].map(el=>{
    const cv=document.createElement("canvas"); cv.width=cv.height=48;
    el.appendChild(cv);
    return {g:el.dataset.g, c:cv.getContext("2d")};
  });
  const FACING_CYCLE=["south","west","north","east"];
  let tick=0;
  animTimer=setInterval(()=>{
    const rm=panel.querySelector("#swart-rm");
    const frozen=rm&&rm.checked;
    if(!frozen) tick++;
    players.forEach(p=>{
      const anim=NS.registry.anim(p.g);
      const facing=FACING_CYCLE[(tick>>2)%4];
      const frames=anim[facing]||anim[Object.keys(anim)[0]];
      if(!frames||!frames.length) return;
      p.c.imageSmoothingEnabled=false;
      p.c.clearRect(0,0,48,48);
      p.c.drawImage(frames[frozen?0:tick%frames.length],0,0,16,16,0,0,48,48);
    });
  },240);
  panel.querySelector("#swart-preview-close").addEventListener("click",NS.preview.close);
}

NS.preview={
  open(){ if(!panel) build(); panel.style.display="block"; },
  close(){
    if(animTimer){ clearInterval(animTimer); animTimer=null; }
    if(panel){ panel.remove(); panel=null; }
  },
  isOpen(){ return !!panel; },
};

})(globalThis.SWART = globalThis.SWART || {});
