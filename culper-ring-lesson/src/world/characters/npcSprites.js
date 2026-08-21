/* =====================================================================
   SHADOW WAR — civilian NPCs
   No crimson anywhere in this file — villagers must never read as
   British (the registry audit enforces it). Every named character gets a
   full 4-facing idle set so entities can face the player's approach.

   Identity kit per figure: headwear + coat family + ONE accessory.
     Abraham  — straw hat, earth-brown coat, tall walking staff
                (farmer on the road between Setauket and the city)
     Widow    — day cap, gray dress, market basket
     Mr. Hart — worn tricorn, drab coat, cane, white hair
     Jonah    — dark cap, green waistcoat over shirt sleeves (ferryman)
     Brewster — tricorn, navy peacoat, ROLLED SLEEVES, rope coil
                (working boatman — deliberately no pirate kit)
     Youth    — bare head, drab vest, light build (ambient farm worker)
   ===================================================================== */
(function(NS){
"use strict";
const {px,registry}=NS;
const C=n=>NS.palette.index(n);
const civ={faction:"civilian"};

NS.registerIdleSet("npc.abraham",{
  coat:C("cloth-brown"), skirt:0,
  hat:"straw", hatC:C("muted-gold"), hatBrimC:C("earth-light"),
  hair:C("hair-brown"), skin:C("skin-light"),
  accessory:"staff",
},civ);

NS.registerIdleSet("npc.widow",{
  coat:C("cloth-gray"), skirt:1,
  hat:"cap", hatC:C("warm-cream"),
  hair:C("hair-gray"), skin:C("skin-light"),
  accessory:"basket",
},civ);

NS.registerIdleSet("npc.oldman",{
  coat:C("cloth-drab"), skirt:0,
  hat:"tricorn", hatC:C("felt-dark"),
  hair:C("hair-white"), skin:C("skin-light"),
  accessory:"stick",
},civ);

NS.registerIdleSet("npc.jonah",{
  coat:C("cloth-green"), skirt:0, vest:1,
  hat:"cap", hatC:C("felt-dark"),
  hair:C("hair-dark"), skin:C("skin-deep"),
},civ);

NS.registerIdleSet("npc.brewster",{
  coat:C("cloth-navy"), skirt:0, rolled:1,
  hat:"tricorn", hatC:C("felt-dark"),
  hair:C("hair-brown"), skin:C("skin-medium"),
  accessory:"rope",
},civ);

NS.registerIdleSet("npc.youth",{
  coat:C("cloth-drab"), skirt:0, vest:1,
  hat:null, hatC:0,
  hair:C("hair-brown"), skin:C("skin-light"),
},civ);

/* palette-swap variant demo: the widow's body in market-day brown —
   one source, two villagers. Use sparingly; swaps share silhouettes. */
const gray=C("cloth-gray"), brown=C("cloth-brown");
registry.register("npc.villager.woman.brown.idle.south",
  px.swapPalette(registry.getData("npc.widow.idle.south"),{[gray]:brown}),
  {kind:"character",group:"characters",faction:"civilian",expect:{width:16,height:16}});

})(globalThis.SWART = globalThis.SWART || {});
