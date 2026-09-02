#!/usr/bin/env node
/* Builds the Merchant's Ledger student sheet (EN + ES) as HTML -> PDF via Chromium.
   Usage: node build_ledger.js   (needs playwright-core; set PW_MODULES to its node_modules dir)
   The HTML in this file is the layout source of truth (same pattern as the Salem lesson). */
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const PW = process.env.PW_MODULES || path.join(HERE, 'node_modules');

const STR = {
  en: {
    title: "Caravan: The Merchant's Road", sub: "Merchant's Ledger",
    name: "Name", period: "Period", date: "Date",
    howto: "Fill this in while you play. Copy the numbers from the screen. You do not need to do any math until the very end.",
    day1: "DAY 1", day2: "DAY 2",
    bell: "Bell ringer", bellHint: "Answer in one or two sentences.",
    stripTitle: "The price of 1 load of silk at each stop",
    stripHint: "Write the silk price from the price board when you arrive in each city.",
    cities: ["Chang'an", "Dunhuang", "Kashgar", "Samarkand", "Baghdad", "Constantinople"],
    logTitle: "My trade log",
    thCity: "City", thBought: "What I bought", thSold: "What I sold", thRoad: "My road decision — and why",
    finalRow: "Sold everything to Anna", noRoad: "End of the road",
    codeTitle: "My Caravan Code (end of Day 1)",
    codeHint: "Copy it exactly from the screen. Capital letters and numbers only — it never uses I, L, O, or U.",
    profitTitle: "How did I do?",
    profitStart: "Every merchant started with 60 coins.",
    profitEnd: "I finished with", coins: "coins",
    circle: "Circle one and fill in the blank:",
    more: "I finished with MORE than 60.", moreEq: "My coins − 60 =", earned: "coins earned",
    fewer: "I finished with FEWER than 60.", fewerEq: "60 − my coins =", lost: "coins lost",
    example: "Example: a merchant who finished with 118 coins writes 118 − 60 = 58 coins earned.",
    reflectTitle: "Think and write",
    q1: "1. Silk cost 8 coins in Chang'an and 90 in Constantinople. In your own words, why did the price grow at every stop?",
    q2: "2. Vandak said: “I have never seen China. My silk has.” What did he mean?",
    q3: "3. Would you rather be a merchant who runs one leg of the road, or the whole road like you just did? Why?",
    exitTitle: "Exit ticket",
    exit: "Name one thing that traveled the Silk Road that was not a good for sale, and tell how it traveled.",
  },
  es: {
    title: "Caravana: El camino del mercader", sub: "Libro de cuentas del mercader",
    name: "Nombre", period: "Periodo", date: "Fecha",
    howto: "Llena esta hoja mientras juegas. Copia los números de la pantalla. No necesitas hacer cuentas hasta el final.",
    day1: "DÍA 1", day2: "DÍA 2",
    bell: "Actividad de inicio", bellHint: "Responde en una o dos oraciones.",
    stripTitle: "El precio de 1 carga de seda en cada parada",
    stripHint: "Escribe el precio de la seda de la tabla de precios al llegar a cada ciudad.",
    cities: ["Chang'an", "Dunhuang", "Kashgar", "Samarcanda", "Bagdad", "Constantinopla"],
    logTitle: "Mi registro de tratos",
    thCity: "Ciudad", thBought: "Lo que compré", thSold: "Lo que vendí", thRoad: "Mi decisión de camino — y por qué",
    finalRow: "Le vendí todo a Anna", noRoad: "Fin del camino",
    codeTitle: "Mi Código de Caravana (fin del Día 1)",
    codeHint: "Cópialo exacto de la pantalla. Solo letras mayúsculas y números — nunca usa I, L, O ni U.",
    profitTitle: "¿Cómo me fue?",
    profitStart: "Todos los mercaderes empezaron con 60 monedas.",
    profitEnd: "Terminé con", coins: "monedas",
    circle: "Encierra una opción y llena el espacio:",
    more: "Terminé con MÁS de 60.", moreEq: "Mis monedas − 60 =", earned: "monedas ganadas",
    fewer: "Terminé con MENOS de 60.", fewerEq: "60 − mis monedas =", lost: "monedas perdidas",
    example: "Ejemplo: un mercader que terminó con 118 monedas escribe 118 − 60 = 58 monedas ganadas.",
    reflectTitle: "Piensa y escribe",
    q1: "1. La seda costaba 8 monedas en Chang'an y 90 en Constantinopla. Con tus palabras, ¿por qué subía el precio en cada parada?",
    q2: "2. Vandak dijo: “Nunca he visto China. Mi seda sí.” ¿Qué quiso decir?",
    q3: "3. ¿Preferirías ser un mercader que recorre un solo tramo del camino, o todo el camino como acabas de hacer? ¿Por qué?",
    exitTitle: "Boleto de salida",
    exit: "Nombra una cosa que viajó por la Ruta de la Seda que no era una mercancía para vender, y explica cómo viajó.",
  }
};

const CSS = `
  @page { size: Letter; margin: 0.45in 0.5in; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #222; margin: 0; font-size: 11pt; line-height: 1.3; }
  .page { width: 7.5in; min-height: 10.1in; page-break-after: always; position: relative; }
  .page:last-child { page-break-after: auto; }
  header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #b0512b; padding-bottom: 4px; margin-bottom: 8px; }
  header h1 { margin: 0; font-size: 17pt; letter-spacing: .5px; }
  header .sub { font-size: 11pt; color: #6f6353; font-style: italic; }
  .idline { display: flex; gap: 18px; font-size: 10pt; margin: 4px 0 8px; }
  .idline span { flex: 1; border-bottom: 1px solid #222; padding-bottom: 2px; }
  .howto { font-size: 9.5pt; color: #444; background: #f4e9d3; border-left: 4px solid #c69b41; padding: 5px 8px; margin: 0 0 8px; }
  .day { font-family: 'Courier New', monospace; font-weight: bold; letter-spacing: 2px; font-size: 10pt; color: #b0512b; border-bottom: 1px solid #cfc0a0; margin: 8px 0 5px; }
  .label { font-weight: bold; font-size: 10.5pt; margin: 6px 0 2px; }
  .hint { font-size: 8.5pt; color: #666; font-style: italic; margin: 0 0 4px; }
  .bell { border: 1.5px dashed #888; border-radius: 6px; padding: 5px 8px; min-height: .62in; margin-bottom: 6px; }
  .bell .label { margin-top: 0; }
  .strip { display: flex; gap: 6px; margin: 4px 0 8px; }
  .strip .box { flex: 1; text-align: center; }
  .strip .box .v { border: 1.5px solid #222; border-radius: 6px; height: .5in; display: flex; align-items: center; justify-content: center; font-size: 14pt; color: #bbb; }
  .strip .box .c { font-size: 8.5pt; margin-top: 3px; font-family: 'Courier New', monospace; }
  table.log { width: 100%; border-collapse: collapse; margin: 2px 0 6px; table-layout: fixed; }
  table.log th { font-family: 'Courier New', monospace; font-size: 8.5pt; text-align: left; border-bottom: 2px solid #222; padding: 3px 5px; }
  table.log td { border: 1px solid #999; padding: 4px 5px; height: .58in; vertical-align: top; font-size: 9.5pt; }
  table.log td.city { font-weight: bold; width: 1.05in; background: #f7f0e1; }
  table.log td.muted { color: #888; font-style: italic; font-size: 8.5pt; }
  .code { border: 2px solid #b0512b; border-radius: 8px; padding: 6px 10px; margin: 4px 0 6px; display: flex; align-items: center; gap: 14px; background: #fbf4e4; }
  .code .label { margin: 0; white-space: nowrap; }
  .code .cells { display: flex; gap: 6px; align-items: center; font-family: 'Courier New', monospace; font-size: 16pt; }
  .code .cell { width: .32in; height: .42in; border: 1.5px solid #222; border-radius: 4px; background: #fff; }
  .code .dash { color: #888; }
  .code .hint { margin: 0; flex: 1; }
  .profit { border: 1.5px solid #222; border-radius: 8px; padding: 8px 10px; margin: 4px 0 8px; }
  .profit .row { display: flex; align-items: center; gap: 8px; margin: 5px 0; font-size: 11pt; }
  .blank { display: inline-block; border-bottom: 1.5px solid #222; min-width: .8in; height: 1em; }
  .blank.wide { min-width: 1.3in; }
  .circ { border: 1.5px solid #222; border-radius: 999px; padding: 2px 9px; font-weight: bold; }
  .example { font-size: 9pt; color: #555; font-style: italic; margin-top: 4px; }
  .q { margin: 6px 0 4px; font-size: 10.5pt; }
  .lines { height: 1.05in; background: repeating-linear-gradient(to bottom, transparent 0, transparent .25in, #aaa .25in, #aaa calc(.25in + 1px)); margin-bottom: 6px; }
  .lines.short { height: .8in; }
  .exit { border: 2px dashed #b0512b; border-radius: 8px; padding: 6px 10px; margin-top: 6px; }
  .foot { position: absolute; bottom: 0; right: 0; font-size: 8pt; color: #999; font-family: 'Courier New', monospace; }
`;

function sheet(L) {
  const s = STR[L];
  const cells = Array.from({length:4}).map(()=>'<span class="cell"></span>').join('');
  const strip = s.cities.map(c => `<div class="box"><div class="v">🪙</div><div class="c">${c}</div></div>`).join('');
  const row = (i, day) => {
    const last = i === 5;
    return `<tr><td class="city">${s.cities[i]}</td>
      <td></td>
      <td>${last ? `<span class="muted">${s.finalRow}</span>` : ''}</td>
      <td>${last ? `<span class="muted">${s.noRoad}</span>` : ''}</td></tr>`;
  };
  const head = `<header><div><h1>${s.title}</h1><div class="sub">${s.sub}</div></div><div class="sub">${L === 'en' ? 'c. 800' : 'c. 800'}</div></header>`;
  const thead = `<thead><tr><th style="width:1.05in">${s.thCity}</th><th>${s.thBought}</th><th>${s.thSold}</th><th style="width:2.5in">${s.thRoad}</th></tr></thead>`;
  return `<!DOCTYPE html><html lang="${L}"><head><meta charset="utf-8"><title>${s.title} — ${s.sub}</title><style>${CSS}</style></head><body>
<div class="page">
  ${head}
  <div class="idline"><span>${s.name}: </span><span>${s.period}: </span><span>${s.date}: </span></div>
  <div class="howto">${s.howto}</div>

  <div class="day">${s.day1}</div>
  <div class="bell"><div class="label">${s.bell}</div><div class="hint">${s.bellHint}</div></div>

  <div class="label">${s.stripTitle}</div>
  <div class="hint">${s.stripHint}</div>
  <div class="strip">${strip}</div>

  <div class="label">${s.logTitle}</div>
  <table class="log">${thead}<tbody>${row(0)}${row(1)}${row(2)}</tbody></table>

  <div class="code"><div class="label">${s.codeTitle}</div><div class="cells">${cells}<span class="dash">-</span>${cells}<span class="dash">-</span>${cells}</div></div>
  <div class="hint">${s.codeHint}</div>

  <div class="day">${s.day2}</div>
  <div class="bell"><div class="label">${s.bell}</div><div class="hint">${s.bellHint}</div></div>
  <table class="log">${thead}<tbody>${row(3)}${row(4)}${row(5)}</tbody></table>
  <div class="foot">${s.sub} · 1/2</div>
</div>

<div class="page">
  ${head}
  <div class="label" style="font-size:12pt">${s.profitTitle}</div>
  <div class="profit">
    <div class="row">${s.profitStart}</div>
    <div class="row">${s.profitEnd} <span class="blank"></span> ${s.coins}.</div>
    <div class="row" style="margin-top:8px"><b>${s.circle}</b></div>
    <div class="row"><span class="circ">A</span> ${s.more} &nbsp; ${s.moreEq} <span class="blank"></span> ${s.earned}</div>
    <div class="row"><span class="circ">B</span> ${s.fewer} &nbsp; ${s.fewerEq} <span class="blank"></span> ${s.lost}</div>
    <div class="example">${s.example}</div>
  </div>

  <div class="label" style="font-size:12pt">${s.reflectTitle}</div>
  <div class="q">${s.q1}</div><div class="lines"></div>
  <div class="q">${s.q2}</div><div class="lines"></div>
  <div class="q">${s.q3}</div><div class="lines"></div>

  <div class="exit"><div class="label" style="margin-top:0">${s.exitTitle}</div><div class="q" style="margin-top:2px">${s.exit}</div><div class="lines short"></div></div>
  <div class="foot">${s.sub} · 2/2</div>
</div>
</body></html>`;
}

(async () => {
  const { chromium } = require(path.join(PW, 'playwright-core'));
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  for (const L of ['en', 'es']) {
    const html = sheet(L);
    const htmlPath = path.join(HERE, `caravan_ledger_sheet_${L}.html`);
    fs.writeFileSync(htmlPath, html);
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({ path: path.join(HERE, `caravan_ledger_sheet_${L}.pdf`), format: 'Letter', printBackground: true, margin: { top: '0.45in', bottom: '0.45in', left: '0.5in', right: '0.5in' } });
    /* previews for review */
    await page.setViewportSize({ width: 816, height: 1056 });
    const pages = await page.$$('.page');
    for (let i = 0; i < pages.length; i++) {
      await pages[i].screenshot({ path: path.join(process.env.PREVIEW_DIR || HERE, `preview_ledger_${L}_p${i+1}.png`) });
    }
    await page.close();
    console.log(`built caravan_ledger_sheet_${L}.pdf`);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
