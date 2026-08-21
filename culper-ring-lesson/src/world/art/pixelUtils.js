/* =====================================================================
   SHADOW WAR — pixel buffer utilities
   Source format: { width, height, pixels: number[height][width] }
   where each number is a palette index (0 = transparent).

   All conversion to canvases happens ONCE at init and is cached by the
   sprite registry — nothing in here may run per frame.
   ===================================================================== */
(function(NS){
"use strict";
const P=()=>NS.palette;

const px={

  /* ---------- construction ---------- */
  makeBuffer(width,height,fill){
    fill=fill|0;
    const pixels=new Array(height);
    for(let y=0;y<height;y++) pixels[y]=new Array(width).fill(fill);
    return {width,height,pixels};
  },

  /* Compact string-row authoring format:
     fromStrings([".XX.","X..X"], {".":0,"X":5}) — every row must be the
     same length and every character must appear in the char map. */
  fromStrings(rows,charMap){
    if(!Array.isArray(rows)||!rows.length) throw new Error("fromStrings: rows required");
    const width=rows[0].length, height=rows.length;
    const pixels=rows.map((row,y)=>{
      if(row.length!==width) throw new Error("fromStrings: row "+y+" length "+row.length+" != "+width);
      return [...row].map((ch,x)=>{
        if(!(ch in charMap)) throw new Error("fromStrings: unmapped char '"+ch+"' at "+x+","+y);
        return charMap[ch];
      });
    });
    return {width,height,pixels};
  },

  /* ---------- painting primitives (used by procedural generators) ---------- */
  rect(s,x,y,w,h,idx){
    const x0=Math.max(0,x), y0=Math.max(0,y);
    const x1=Math.min(s.width,x+w), y1=Math.min(s.height,y+h);
    for(let yy=y0;yy<y1;yy++){ const row=s.pixels[yy]; for(let xx=x0;xx<x1;xx++) row[xx]=idx; }
    return s;
  },
  dot(s,x,y,idx){
    if(x>=0&&y>=0&&x<s.width&&y<s.height) s.pixels[y][x]=idx;
    return s;
  },
  dots(s,list,idx){ list.forEach(([x,y])=>px.dot(s,x,y,idx)); return s; },

  /* ---------- transforms (return NEW buffers; sources stay immutable) ---------- */
  flipH(s){
    return {width:s.width,height:s.height,pixels:s.pixels.map(row=>row.slice().reverse())};
  },
  flipV(s){
    return {width:s.width,height:s.height,pixels:s.pixels.slice().reverse().map(r=>r.slice())};
  },
  /* swapPalette(sprite, {fromIndex: toIndex, ...}) — simple recolor for
     variants (e.g. one villager body, several coat colors). */
  swapPalette(s,mapping){
    return {width:s.width,height:s.height,
      pixels:s.pixels.map(row=>row.map(i=>(i in mapping)?mapping[i]:i))};
  },
  clone(s){ return {width:s.width,height:s.height,pixels:s.pixels.map(r=>r.slice())}; },

  /* ---------- validation ---------- */
  /* Returns [] when clean, else a list of human-readable problems. */
  validate(s,expect){
    const errs=[];
    if(!s||typeof s!=="object"){ return ["sprite is not an object"]; }
    if(!Number.isInteger(s.width)||!Number.isInteger(s.height)||s.width<1||s.height<1)
      errs.push("bad dimensions "+s.width+"x"+s.height);
    if(expect&&(s.width!==expect.width||s.height!==expect.height))
      errs.push("expected "+expect.width+"x"+expect.height+", got "+s.width+"x"+s.height);
    if(!Array.isArray(s.pixels)||s.pixels.length!==s.height){
      errs.push("pixels row count "+(s.pixels&&s.pixels.length)+" != height "+s.height);
      return errs;
    }
    s.pixels.forEach((row,y)=>{
      if(!Array.isArray(row)||row.length!==s.width){ errs.push("malformed row "+y); return; }
      row.forEach((i,x)=>{
        if(!P().isValidIndex(i)) errs.push("unknown palette index "+i+" at "+x+","+y);
      });
    });
    return errs;
  },
  isBlank(s){
    return s.pixels.every(row=>row.every(i=>i===0));
  },
  usedIndexes(s){
    const set=new Set();
    s.pixels.forEach(row=>row.forEach(i=>{ if(i!==0) set.add(i); }));
    return set;
  },

  /* ---------- rasterization (init-time only) ---------- */
  /* Renders a buffer to an offscreen canvas at 1:1 source pixels. The
     renderer scales at blit time with imageSmoothingEnabled=false, which
     gives nearest-neighbor 16→32 scaling for free. */
  toCanvas(s,scale){
    scale=scale||1;
    const cv=document.createElement("canvas");
    cv.width=s.width*scale; cv.height=s.height*scale;
    const c=cv.getContext("2d");
    const colors=P().colors;
    for(let y=0;y<s.height;y++){
      const row=s.pixels[y];
      let x=0;
      while(x<s.width){
        const i=row[x];
        if(i===0){ x++; continue; }
        let run=1;                          // run-length fill: fewer fillRect calls
        while(x+run<s.width && row[x+run]===i) run++;
        c.fillStyle=colors[i];
        c.fillRect(x*scale,y*scale,run*scale,scale);
        x+=run;
      }
    }
    return cv;
  },
};

NS.px=px;
})(globalThis.SWART = globalThis.SWART || {});
