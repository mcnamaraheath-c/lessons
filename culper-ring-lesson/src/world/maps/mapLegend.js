/* =====================================================================
   SHADOW WAR — map legend
   Maps ASCII characters to sprites and physics flags. This file owns
   VISUAL + PHYSICS meaning only. Bilingual labels, node hookups, and
   trigger logic live in the game script (story layer) — keep them there.

   CHARACTER KEY (keep the ASCII map readable):
     .  grass          d  dirt path       ~  shore sand      W  water
     g  tilled field   q  kitchen garden  e  packed dirt     b/B dock
     T  tree           u  bush            r  shore rocks     s  stone wall
     K L / k l         the great oak (2×2: canopy row / trunk row)
     H  clapboard wall n  window (light)  A  Anna's door     M  chimney roof
     x  dark boards    y  window (dark)   V  tavern door     h  roof
     Z  barn roof      z  barn wall       D  barn door       f  fence
     =  open gate (WALKABLE)              P  rope post       o  well
     C  clothesline

   DETERMINISTIC VARIANT RULES — resolve(map,x,y,waterFrame):
   Nothing is random and nothing changes between frames except the two
   water frames. The same map string always bakes the same picture.
     grass '.'  -> tile.grass.{(x*7+y*13)%3}
     path  'd'  -> by path-neighbor mask: N/S only -> tile.path.ns,
                   E/W only -> tile.path.we, both axes -> tile.path.cross,
                   isolated -> tile.path.center
     sand  '~'  -> tile.mud.0 when the tile south of it is water
                   (wet waterline), else tile.sand.restricted (the whole
                   pilot shore is a watched zone; plain sand.0/.1 exist
                   for future unrestricted beaches)
     water 'W'  -> tile.water.shallow.{f} when any orthogonal neighbor is
                   sand/dock/rocks, else deep tile.water.{f}
     tree  'T'  -> tile.tree.deep when all four orthogonal neighbors are
                   also trees (or map edge), else tile.tree.0
     everything else -> the fixed sprite below
   ===================================================================== */
(function(NS){
"use strict";

const FIXED={
  "e":{sprite:"tile.dirt.0"},
  "g":{sprite:"tile.soil.0"},
  "q":{sprite:"tile.garden.0"},
  "b":{sprite:"tile.dock.0"},
  "B":{sprite:"tile.dock.0"},                        // dock end (trigger tile)
  "u":{sprite:"tile.bush.0"},
  "r":{sprite:"tile.rocks.0"},
  "s":{sprite:"tile.wall.stone"},
  "K":{sprite:"tile.oak.nw"},"L":{sprite:"tile.oak.ne"},
  "k":{sprite:"tile.oak.sw"},"l":{sprite:"tile.oak.se"},
  "H":{sprite:"tile.house.wall"},
  "n":{sprite:"tile.house.window"},
  "A":{sprite:"tile.door.house"},
  "x":{sprite:"tile.house.wall.dark"},
  "y":{sprite:"tile.house.window.dark"},
  "V":{sprite:"tile.door.tavern"},
  "h":{sprite:"tile.roof.0"},
  "M":{sprite:"tile.roof.chimney"},
  "Z":{sprite:"tile.barn.roof"},
  "z":{sprite:"tile.barn.wall"},
  "D":{sprite:"tile.barn.door"},
  "f":{sprite:"tile.fence.0"},
  "=":{sprite:"tile.fence.gate"},
  "P":{sprite:"tile.post.0"},
  "o":{sprite:"tile.well.0"},
  "C":{sprite:"prop.clothesline.empty"},
  /* variant families listed for completeness/preview; resolve() picks */
  ".":{sprite:"tile.grass.0"},
  "d":{sprite:"tile.path.center"},
  "~":{sprite:"tile.sand.restricted"},
  "W":{frames:["tile.water.0","tile.water.1"]},
};

const at=(map,x,y)=>(x<0||y<0||x>=map.width||y>=map.height)?"T":map.rows[y][x];
const SANDY=new Set(["~","b","B","r"]);

function resolve(map,x,y,wf){
  const ch=at(map,x,y);
  switch(ch){
    case ".": return "tile.grass."+((x*7+y*13)%3);
    case "d":{
      const ns=(at(map,x,y-1)==="d")||(at(map,x,y+1)==="d");
      const we=(at(map,x-1,y)==="d")||(at(map,x+1,y)==="d");
      if(ns&&we) return "tile.path.cross";
      if(ns) return "tile.path.ns";
      if(we) return "tile.path.we";
      return "tile.path.center";
    }
    case "~": return at(map,x,y+1)==="W" ? "tile.mud.0" : "tile.sand.restricted";
    case "W":{
      const shallow=SANDY.has(at(map,x,y-1))||SANDY.has(at(map,x,y+1))||
                    SANDY.has(at(map,x-1,y))||SANDY.has(at(map,x+1,y));
      return (shallow?"tile.water.shallow.":"tile.water.")+(wf?1:0);
    }
    case "T":{
      const deep=at(map,x,y-1)==="T"&&at(map,x,y+1)==="T"&&
                 at(map,x-1,y)==="T"&&at(map,x+1,y)==="T";
      return deep?"tile.tree.deep":"tile.tree.0";
    }
    default:{
      const def=FIXED[ch];
      if(!def) return null;                          // registry fallback will scream
      return def.frames?def.frames[wf?1:0]:def.sprite;
    }
  }
}

NS.legend={
  tiles:FIXED,
  resolve,
  /* physics — collision must match the picture */
  block:      new Set(["T","W","H","h","f","P","o","C","A","V",
                       "u","r","s","K","L","k","l","n","x","y","M","Z","z","D"]),
  /* tall things stop guard sightlines; low bushes/rocks do not */
  sightBlock: new Set(["T","H","h","f","P","o","C","A","V",
                       "s","K","L","k","l","n","x","y","M","Z","z","D"]),
  restricted: new Set(["~","b","B"]),
};

})(globalThis.SWART = globalThis.SWART || {});
