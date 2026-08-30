# IMAGE_PROMPTS.md — Generated art for "Caravan: The Merchant's Road"

Prompts for the teacher to run in Midjourney (same workflow as the Salem intro images).
Drop finished PNGs into `img/generated/` using the **exact filenames** below, then run
`node build_embed.js` — the build picks them up automatically and retires the placeholder
art. Until then, the lesson ships with neutral built-in scene art, so nothing is blocked.

Every generated image is captioned in-lesson "as our artist imagines it" (ES: "como lo
imagina nuestro artista") per the caption policy in `CLAUDE.md`.

## Style notes (apply to all prompts)

Append to every prompt: `--ar 3:2` for backdrops (`--ar 1:1` for portraits). Suggested
shared style tail so the set feels like one book:

> muted earth-tone palette, soft warm light, illustrated history book style, painterly,
> respectful and realistic depiction, no text, no watermark

Avoid: fantasy elements, anime style, modern objects, and (for portraits) any resemblance
to a specific real person. People of every culture along the route get the same dignity
and detail — working clothes, calm expressions, no caricature.

## Backdrops (3:2, target ≥1600px wide)

1. **`cover_caravan_dusk.png`** — A camel caravan crossing tall sand dunes at dusk,
   long shadows, a dozen loaded Bactrian camels in single file, drivers walking beside
   them, distant snow-capped mountains on the horizon.

2. **`bg_changan_market.png`** — The West Market of Tang-dynasty Chang'an, c. 800 CE:
   busy open-air market street, wooden stalls with bolts of colored silk, ceramic jars,
   tea bricks, merchants and customers of many nationalities, Tang architecture with
   tiled roofs, Bactrian camels being loaded.

3. **`bg_jade_gate_desert.png`** — The Jade Gate frontier post at the edge of the Gobi:
   a rammed-earth Tang watchtower and gate, a caravan waiting to pass inspection,
   gravel desert stretching west, late morning heat haze.

4. **`bg_kashgar_bazaar.png`** — A green oasis market town at the foot of huge
   mountains: poplar trees, mud-brick buildings, an open bazaar with melons, jade
   stones, wool, and spices, Bactrian camels resting by a stream, the Pamir range
   towering behind.

5. **`bg_samarkand_caravanserai.png`** — The courtyard of a Silk Road caravanserai in
   Samarkand at evening: arched brick galleries around a square courtyard, camels
   unloaded, bales and jars stacked, merchants from different lands sharing food by
   lamplight.

6. **`bg_baghdad_round_city.png`** — Abbasid Baghdad, c. 800 CE: view toward the round
   city walls from a busy Tigris riverbank, boats loading goods, domes and minarets,
   date palms, scholars carrying books and scrolls among the crowd.

7. **`bg_constantinople_harbor.png`** — The Golden Horn harbor of Constantinople:
   stone sea walls and the city rising behind, merchant ships at the quays, the dome
   of Hagia Sophia in the distance, crates and amphorae on the dock, gulls, bright
   Mediterranean light.

## Character portraits (1:1, chest-up, target ≥1024px)

All are invented composites — see the cast in `CLAUDE.md` §5. Same style tail, `--ar 1:1`.

1. **`npc_uncle_wei.png`** — An older Chinese merchant, Tang dynasty, kind weathered
   face, gray beard, plain brown hemp robe and black cap, standing before shelves of
   silk bolts.
2. **`npc_brother_kong.png`** — A middle-aged Chinese Buddhist monk in ochre robes,
   shaved head, ink brush in hand, warm tired smile, cave-temple wall paintings behind
   him, candlelight.
3. **`npc_old_yusuf.png`** — An elderly Central Asian camel trader, deeply lined
   sun-browned face, white beard, quilted coat and fur-trimmed cap, standing beside a
   Bactrian camel, mountains behind.
4. **`npc_vandak.png`** — A Sogdian merchant in his forties, dark pointed beard,
   patterned silk caftan with a belt of small tools, confident easy grin, caravanserai
   arches behind him.
5. **`npc_roshan.png`** — A Central Asian woman paper-maker, middle-aged, headscarf and
   work apron, hands stained from the vats, holding a fresh sheet of paper, drying
   frames behind her.
6. **`npc_scholar_salim.png`** — A scholar of Abbasid Baghdad, neat black beard, white
   turban and dark robe, holding an open bound book, shelves of scrolls and books
   behind, warm lamplight.
7. **`npc_anna_silk_buyer.png`** — A Byzantine silk merchant woman, dignified, embroidered
   blue dalmatica and simple veil, examining a bolt of crimson silk by a window
   overlooking the harbor.

## Checklist for the teacher

- [ ] Generate, pick the best of four, upscale
- [ ] Check each image: no text artifacts, no modern objects, no weird hands in frame,
      each culture depicted respectfully
- [ ] Save as PNG with the exact filename into `img/generated/`
- [ ] Tell Claude (or run `node build_embed.js` yourself) to rebuild
