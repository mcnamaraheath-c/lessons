const { JSDOM } = require('jsdom');
const fs = require('fs');
const html = fs.readFileSync('/mnt/c/Users/User/OneDrive/Desktop/culper-ring-lesson/index.html', 'utf8');

const errors = [];
const vcon = new (require('jsdom').VirtualConsole)();
vcon.on('jsdomError', e => errors.push('JSDOM: ' + e.message));
vcon.on('error', (...a) => errors.push('CONSOLE.error: ' + a.join(' ')));
vcon.on('warn', (...a) => { if (/missing node/.test(a.join(' '))) errors.push('WARN: ' + a.join(' ')); });

let NOW = 0, rafQ = [];
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  url: 'file:///mnt/c/Users/User/OneDrive/Desktop/culper-ring-lesson/index.html',
  pretendToBeVisual: false,
  virtualConsole: vcon,
  beforeParse(window) {
    window.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
    window.requestAnimationFrame = cb => { rafQ.push(cb); return rafQ.length; };
    window.performance.now = () => NOW;
    window.HTMLCanvasElement.prototype.getContext = function () {
      if (!this.__ctx) {
        const store = {};
        this.__ctx = new Proxy(store, {
          get: (o, k) => {
            if (k in o) return o[k];
            if (k === 'createRadialGradient') return () => ({ addColorStop() {} });
            if (typeof k === 'string') return () => undefined;
            return undefined;
          },
          set: (o, k, v) => { o[k] = v; return true; },
        });
      }
      return this.__ctx;
    };
    window.addEventListener('error', e => errors.push('PAGEERROR: ' + e.message));
  },
});
const w = dom.window, doc = w.document;
const ev = code => w.eval(code);
const pump = (ms, step = 16) => { const end = NOW + ms; while (NOW < end) { NOW += step; const q = rafQ; rafQ = []; q.forEach(cb => { try { cb(NOW); } catch (e) { errors.push('RAF: ' + e.message); } }); } };
const $ = sel => doc.querySelector(sel);
const $$ = sel => [...doc.querySelectorAll(sel)];
const click = el => { if (!el) throw new Error('click target missing'); el.click(); };
const key = (type, k) => doc.dispatchEvent(new w.KeyboardEvent(type, { key: k, bubbles: true }));
const dlgOpen = () => !$('#m-dlg').hidden;
const dlgButtons = () => $$('#m-dlg #dlg-actions button');
const dlgText = () => $('#dlg-text').textContent;
function clickThrough(max = 14) {
  for (let i = 0; i < max; i++) {
    if (!dlgOpen()) return;
    const cont = dlgButtons().find(b => b.classList.contains('cont'));
    if (cont) cont.click(); else return;
  }
}
function choose(rx) {
  const b = dlgButtons().find(b => rx.test(b.textContent));
  if (!b) throw new Error('choice not found ' + rx + ' in: ' + dlgButtons().map(b => b.textContent).join(' | '));
  b.click();
}
function walk(dir, n) {
  const k = { u: 'ArrowUp', d: 'ArrowDown', l: 'ArrowLeft', r: 'ArrowRight' }[dir];
  for (let i = 0; i < n; i++) { key('keydown', k); pump(48); key('keyup', k); pump(200); }
}
const pos = () => ev('[W.px,W.py,S.obj,S.su,S.tr,S.it]');
let pass = 0, fail = 0;
const step = (name, fn) => {
  try { fn(); pass++; console.log('OK   ' + name); }
  catch (e) { fail++; console.log('FAIL ' + name + ' :: ' + e.message); }
};

/* ============ TEST SEQUENCE ============ */
step('boot: title visible', () => { if ($('#s-title').hidden) throw new Error('title hidden'); });
step('ES toggle', () => {
  click($('#btn-lang'));
  if (!/misión/.test($('#title-sub').textContent)) throw new Error($('#title-sub').textContent);
  click($('#btn-lang'));
  if (!/mission/.test($('#title-sub').textContent)) throw new Error('did not return to EN');
});
step('bad code rejected', () => {
  click($('#btn-resume-toggle'));
  $('#code-in').value = 'CR1.garbage!!';
  click($('#btn-code-go'));
  if (!$('#code-err').textContent) throw new Error('no error message');
});
step('new game -> select, 4 cards', () => {
  click($('#btn-new'));
  if ($('#s-select').hidden) throw new Error('select hidden');
  if ($$('.card-ch').length !== 4) throw new Error('cards=' + $$('.card-ch').length);
});
step('locked char message', () => {
  click($$('.card-ch.locked')[0]);
  if ($('#m-info').hidden) throw new Error('info modal missing');
  click($('#info-actions button'));
});
step('start Anna -> p1', () => {
  click($$('.card-ch:not(.locked)')[0]);
  if (!dlgOpen()) throw new Error('no dialogue');
  if (!/British army holds/.test(dlgText())) throw new Error(dlgText());
});
step('prologue choice + vocab button present', () => {
  clickThrough(); // p1..p3 chunks
  choose(/hide your name/);
  clickThrough(3);
  if (!$$('#dlg-text .vb').length && !/Nathan Hale/.test(dlgText())) throw new Error('unexpected text: ' + dlgText());
});
step('vocab card opens bilingual', () => {
  clickThrough(2);
  // p4b has courier + cipher vocab
  const vb = $('#dlg-text .vb');
  if (vb) {
    vb.click();
    if ($('#m-vocab').hidden) throw new Error('vocab modal hidden');
    if (!$('#v-es').textContent.includes('Español')) throw new Error($('#v-es').textContent);
    click($('#v-close'));
  }
});
step('decode puzzle reached', () => {
  clickThrough();
  if ($('#m-puz').hidden || !$('.decode-line')) throw new Error('no decode puzzle');
});
step('decode: wrong option shakes, right fills', () => {
  click($('.chip[data-n]'));
  const wrongBtn = $$('.chip-opts button').find(b => b.dataset.ok === '0');
  click(wrongBtn);
  if (!$$('.chip.done').length) { /* expected: still unsolved */ } else throw new Error('wrong answer accepted');
  click($$('.chip-opts button').find(b => b.dataset.ok === '1'));
  if ($$('.chip.done').length !== 1) throw new Error('chip not solved');
});
step('decode: solve all -> p6', () => {
  for (let i = 0; i < 2; i++) {
    click($('.chip[data-n]'));
    click($$('.chip-opts button').find(b => b.dataset.ok === '1'));
  }
  click($('#dc-go'));
  if (!dlgOpen()) throw new Error('p6 not shown');
});
step('accept mission, trust=60', () => {
  clickThrough();
  choose(/I will help/);
  if (ev('S.tr') !== 60) throw new Error('tr=' + ev('S.tr'));
  if (!$('#dlg-toast .fx-toast')) throw new Error('no toast');
});
step('prologue end -> first run -> map', () => {
  clickThrough(10);
  if ($('#m-first').hidden) throw new Error('no first-run overlay');
  click($$('#first-card button.cont')[0]); // next
  click($$('#first-card button.cont')[0]); // start walking
  if ($('#s-map').hidden) throw new Error('map hidden');
  pump(100);
  const [x, y, o] = pos();
  if (x !== 4 || y !== 4 || o !== 'talk') throw new Error(`x=${x} y=${y} obj=${o}`);
});
step('blocked by house wall', () => {
  walk('u', 1); // (4,3) is '.', then up to (4,2) H blocked
  walk('u', 1);
  const [x, y] = pos();
  if (y < 3) throw new Error('walked through wall to y=' + y);
  walk('d', 1); // back toward (4,4)
});
step('walk to Abraham + label', () => {
  const [sx, sy] = pos();
  if (sy === 3) walk('d', 1);
  walk('d', 1); walk('r', 10); walk('u', 2); // (14,3)
  const [x, y] = pos();
  if (x !== 14 || y !== 3) throw new Error(`at ${x},${y}`);
  key('keydown', 'ArrowRight'); pump(48); key('keyup', 'ArrowRight'); pump(60); // face right (blocked by Abraham)
  pump(60);
  if (!/Woodhull/.test($('#labels').textContent)) throw new Error('label: "' + $('#labels').textContent + '"');
  key('keydown', 'e'); key('keyup', 'e');
  if (!dlgOpen()) throw new Error('no dialogue from interact');
});
step('Abraham -> knowsCode + obj watch + trust branch', () => {
  clickThrough();
  choose(/Why me/);
  clickThrough(10);
  const [, , o] = pos();
  if (o !== 'watch') throw new Error('obj=' + o);
  if (!ev('S.flags.knowsCode')) throw new Error('knowsCode not set');
  if (ev('S.tr') !== 65) throw new Error('tr=' + ev('S.tr'));
});
step('clothesline gated before watching', () => {
  ev('W.px=6;W.py=4;W.pf="u";S.map.x=6;S.map.y=4;'); // teleport for speed
  key('keydown', 'e'); key('keyup', 'e');
  if (!/watch the soldiers first/i.test(dlgText())) throw new Error(dlgText());
  clickThrough(4);
});
step('labels appear for every NPC and the tavern door', () => {
  const cases = [
    [14, 3, 'ArrowRight', /Woodhull/],
    [11, 9, 'ArrowRight', /Jonah/],
    [5, 7, 'ArrowRight', /Foster/],
    [12, 8, 'ArrowRight', /Hart/],
    [6, 4, 'ArrowUp', /Clothesline/],
    [14, 9, 'ArrowRight', /tavern|Roe/i],   // last: the interact below targets the door
  ];
  for (const [x, y, faceKey, rx] of cases) {
    ev(`W.px=${x};W.py=${y};S.map.x=${x};S.map.y=${y};W.caughtUntil=1e15;`);
    key('keydown', faceKey); pump(48); key('keyup', faceKey); pump(80);
    const txt = $('#labels').textContent;
    if (!rx.test(txt)) throw new Error(`at ${x},${y} facing ${faceKey}: label "${txt}"`);
  }
  // tavern interaction (locked-marker target) still reaches its "not yet" node
  key('keydown', 'e'); key('keyup', 'e');
  if (!dlgOpen()) throw new Error('tavern door did not interact');
  if (!/tavern|taberna/i.test(dlgText())) throw new Error('wrong node: ' + dlgText());
  clickThrough(4);
});
step('keyboard-only: dialogue focus always lands on an action button', () => {
  ev('go("vf1")');
  const active = doc.activeElement;
  if (!active || !active.closest('#dlg-actions')) throw new Error('focus not on dialogue action');
  clickThrough(6);
});
step('touch-only: D-pad movement + interact button, no keyboard', () => {
  ev('SET.touch=true; applySettings();');
  if ($('#dpad').hidden || $('#btn-act').hidden) throw new Error('touch controls hidden');
  ev('W.px=4;W.py=4;W.pf="d";S.map.x=4;S.map.y=4;W.held=[];W.tw=null;');
  const right = doc.querySelector('#dpad [data-d="r"]');
  right.dispatchEvent(new w.Event('pointerdown', { bubbles: true }));
  pump(60);
  right.dispatchEvent(new w.Event('pointerup', { bubbles: true }));
  pump(220);
  if (ev('W.px') !== 5) throw new Error('dpad did not move player, x=' + ev('W.px'));
  ev('W.px=6;W.py=4;S.map.x=6;S.map.y=4;W.tw=null;');
  const up = doc.querySelector('#dpad [data-d="u"]');
  up.dispatchEvent(new w.Event('pointerdown', { bubbles: true }));
  pump(60);
  up.dispatchEvent(new w.Event('pointerup', { bubbles: true }));
  pump(60);
  click($('#btn-act'));
  if (!dlgOpen()) throw new Error('interact button did not open clothesline dialogue');
  clickThrough(6);
  ev('SET.touch=null; applySettings();');
});
step('reduced motion: water frozen, rm class set, movement still works', () => {
  ev('SET.rm=true; applySettings();');
  if (!doc.body.classList.contains('rm')) throw new Error('rm class missing');
  const wf = ev('W.waterF');
  pump(1600);
  if (ev('W.waterF') !== wf) throw new Error('water still animating under reduced motion');
  ev('W.px=4;W.py=4;S.map.x=4;S.map.y=4;W.tw=null;');
  walk('r', 1);
  if (ev('W.px') !== 5) throw new Error('movement broken under reduced motion');
  ev('SET.rm=null; applySettings();');
});
step('calm patrols: guards pause ~2s at waypoints, still deterministic', () => {
  ev('SET.calm=true;');
  ev('W.guards[0].tw=null; W.guards[0].x=W.guards[0].wp[1][0]; W.guards[0].y=W.guards[0].wp[1][1]; W.guards[0].idx=1; W.guards[0].wait=0;');
  pump(120);                                  // waypoint logic: flip + start the pause
  const x0 = ev('W.guards[0].x');
  pump(1000);
  if (ev('W.guards[0].x') !== x0) throw new Error('guard did not pause under calm patrols');
  pump(1600);
  if (ev('W.guards[0].x') === x0) throw new Error('guard never resumed after the pause');
  ev('SET.calm=false;');
});
step('guard patrol phase survives a mission code', () => {
  pump(900);                                  // let patrols advance to an arbitrary phase
  const before = ev('[W.guards[0].x,W.guards[0].y,W.guards[1].x,W.guards[1].y]');
  const code = ev('makeCode()');
  ev('S=newState()');
  if (!ev(`loadCode(${JSON.stringify(code)})`)) throw new Error('loadCode failed');
  pump(60);
  const after = ev('[W.guards[0].x,W.guards[0].y,W.guards[1].x,W.guards[1].y]');
  if (JSON.stringify(before) !== JSON.stringify(after))
    throw new Error('patrol phase lost: ' + before + ' -> ' + after);
});
step('watch zone fires w1 -> obj signal, intel+1', () => {
  ev('W.px=14;W.py=8;S.map.x=14;S.map.y=8;');
  walk('d', 1);
  if (!dlgOpen()) throw new Error('w1 did not fire');
  clickThrough(8);
  const [, , o, , , it] = pos();
  if (o !== 'signal') throw new Error('obj=' + o);
  if (it !== 1) throw new Error('intel=' + it);
});
step('guard catches player on sand', () => {
  // teleport into guard 1 cone: guard walks row 11 facing r/l
  const g = ev('[W.guards[0].x, W.guards[0].y, W.guards[0].f]');
  const [gx, gy, gf] = g;
  const dx = gf === 'r' ? 1 : gf === 'l' ? -1 : 0;
  const px = gx + dx * 2, py = gy;
  ev(`W.px=${px};W.py=${py};W.caughtUntil=0;`);
  pump(64);
  if (!dlgOpen()) throw new Error('not caught (guard at ' + g + ', player ' + px + ',' + py + ')');
  if (!/What are you doing near the dock/.test(dlgText())) throw new Error(dlgText());
  clickThrough();
  choose(/washtub/);
  clickThrough(4);
  if (ev('S.su') !== 5) throw new Error('su=' + ev('S.su'));
  if (!ev('S.flags.toldWashtub')) throw new Error('flag missing');
});
step('clothesline puzzle + interrupt + solve', () => {
  ev('W.px=6;W.py=4;W.pf="u";S.map.x=6;S.map.y=4;W.caughtUntil=1e15;');
  key('keydown', 'e'); key('keyup', 'e');
  if ($('#m-puz').hidden) throw new Error('puzzle not open');
  const tray = k => $$('.tray button').find(b => b.dataset.k === k);
  const traySel = k => { const b = tray(k); if (!b.classList.contains('sel')) b.click(); };
  const slot = i => $$('.slot')[i];
  traySel('pet'); click(slot(0));
  traySel('hank'); click(slot(1));
  if (!dlgOpen()) throw new Error('gi1 interrupt missing');
  clickThrough();
  choose(/slow and calm/);
  clickThrough(6);
  if ($('#m-puz').hidden) throw new Error('puzzle did not resume');
  click($('#cl-check')); // wrong: only 1 hank
  if (!$('.puz-msg').textContent) throw new Error('no wrong feedback');
  click($('#cl-hint'));
  if (ev('S.hints') !== 1) throw new Error('hint not counted');
  traySel('hank'); click(slot(2));
  traySel('hank'); click(slot(3));
  traySel('hank'); click(slot(4));
  click($('#cl-check'));
  if (!dlgOpen()) throw new Error('cs1 not shown');
  if (ev('S.flags.signal') !== 1) throw new Error('signal flag');
});
step('dusk dock path -> obj dock', () => {
  clickThrough(); // cs1 chunks -> d1
  choose(/dock to meet him/);
  clickThrough(6);
  const [, , o] = pos();
  if (o !== 'dock') throw new Error('obj=' + o);
  if (!ev('S.flags.dusk')) throw new Error('no dusk');
});
step('reach dock -> Brewster -> report', () => {
  ev('W.px=9;W.py=12;S.map.x=9;S.map.y=12;W.caughtUntil=1e15;');
  walk('d', 1); // onto B (9,13)
  if (!dlgOpen()) throw new Error('br1 missing');
  clickThrough(8);
  if ($('#m-puz').hidden || !$('.rb-claims')) throw new Error('report builder missing');
  if (ev('S.it') < 4) throw new Error('intel=' + ev('S.it'));
});
step('report: evidence includes Brewster card, validation works', () => {
  const evBtns = $$('.rb-evid button');
  if (!evBtns.some(b => /counting their ships/.test(b.textContent))) throw new Error('e6 missing');
  click($('#rb-send'));
  if (!$('#rb-msg').textContent) throw new Error('no validation message');
  click($$('.rb-claims button').find(b => b.dataset.c === 'c3'));
  click(evBtns.find(b => b.dataset.e === 'e1'));
  click($$('.rb-evid button').find(b => b.dataset.e === 'e2'));
  $('#rb-reason').value = 'Washington can trust this signal system again.';
  $('#rb-reason').dispatchEvent(new w.Event('input', { bubbles: true }));
  click($('#rb-send'));
  if (!$('#sealwrap')) throw new Error('no seal');
  click($('#seal-go'));
  if (!/Clear eyes|candlelight/.test(dlgText())) throw new Error(dlgText());
  clickThrough(6);
});
let code = '';
step('mission complete screen + code', () => {
  if ($('#s-done').hidden) throw new Error('done hidden');
  code = $('#s-done .codebox').textContent.trim();
  if (!code.startsWith('CR1.')) throw new Error(code.slice(0, 30));
  console.log('     code length: ' + code.length + ', intel: ' + ev('S.it') + ', susp: ' + ev('S.su') + ', trust: ' + ev('S.tr'));
});
step('debrief renders + has report', () => {
  click($('#done-debrief'));
  if ($('#s-debrief').hidden) throw new Error('debrief hidden');
  const t = $('#s-debrief').textContent;
  if (!/Brewster crossed tonight/.test(t)) throw new Error('claim missing');
  if (!/Clear eyes/.test(t)) throw new Error('washington reply missing');
});
step('debrief in Spanish', () => {
  ev('setLang("es")');
  try {
    const t = $('#s-debrief').textContent;
    if (!/Informe final/.test(t)) throw new Error('no spanish header');
  } finally { ev('setLang("en")'); }
});
step('code round-trip -> done screen restored', () => {
  ev('S=newState()');
  const ok = ev(`loadCode(${JSON.stringify(code)})`);
  if (!ok) throw new Error('loadCode false');
  if ($('#s-done').hidden) throw new Error('done not restored');
  if (ev('S.it') < 4) throw new Error('stats lost');
});
step('mid-map code round-trip', () => {
  ev(`S=newState(); S.ch="anna"; S.scene="map"; S.obj="watch"; S.flags={knowsCode:1}; S.map={x:7,y:5,f:"l",fired:["dockearly"]}; `);
  const mid = ev('makeCode()');
  ev('S=newState()');
  if (!ev(`loadCode(${JSON.stringify(mid)})`)) throw new Error('loadCode false');
  pump(100);
  const [x, y, o] = pos();
  if (x !== 7 || y !== 5 || o !== 'watch') throw new Error(`${x},${y},${o}`);
  if (!ev('S.map.fired.includes("dockearly")')) throw new Error('fired lost');
});
step('interrogation at suspicion 100', () => {
  ev('S.su=95; updateHUD(); go("gc1")');
  clickThrough();
  choose(/Nothing! I was just leaving/); // +15 -> 100
  if (!/sergeant|Sergeant|sargento/i.test(dlgText() + $('#dlg-who').textContent)) throw new Error('interrogation not triggered: ' + dlgText());
  clickThrough();
  choose(/wash for half this village/);
  clickThrough(6);
  if (ev('S.su') !== 60) throw new Error('su=' + ev('S.su'));
  if (!ev('S.flags.interrogated')) throw new Error('flag missing');
});
step('yard (safe) ending path works', () => {
  ev('S=newState(); S.ch="anna"; S.scene="map"; S.flags={knowsCode:1,watched:1}; S.obj="signal"; go("d1")');
  clickThrough();
  choose(/Stay in your yard/);
  clickThrough(8);
  if ($('#m-puz').hidden || !$('.rb-claims')) throw new Error('report not opened');
  const cards = $$('.rb-evid button').map(b => b.dataset.e);
  if (cards.includes('e6')) throw new Error('e6 should be hidden on yard path');
});
step('missing-node audit', () => {
  const bad = ev(`(function(){
    const ids=new Set(Object.keys(NODES)); const miss=[];
    for(const id in NODES){ const n=NODES[id];
      if(n.go && !ids.has(n.go)) miss.push(id+"->"+n.go);
      if(n.ch) n.ch.forEach(c=>{ if(!ids.has(c.next)) miss.push(id+"->"+c.next); });
      if(n.obj && !OBJ[n.obj]) miss.push(id+" obj "+n.obj);
    }
    for(const id in NODES){ const n=NODES[id];
      const en=Array.isArray(n.t.en)?n.t.en.length:1, es=Array.isArray(n.t.es)?n.t.es.length:1;
      if(en!==es) miss.push(id+" chunk mismatch");
      if(n.ch) n.ch.forEach((c,i)=>{ if(!c.t.es) miss.push(id+" choice "+i+" no es"); });
    }
    return miss;
  })()`);
  if (bad.length) throw new Error(bad.join('; '));
});
step('reading level spot check: sentence length', () => {
  const long = ev(`(function(){
    const out=[];
    for(const id in NODES){ const n=NODES[id]; const ch=Array.isArray(n.t.en)?n.t.en:[n.t.en];
      ch.forEach(c=>{ c.replace(/\\{\\{|\\}\\}|\\[\\[\\w+\\||\\[\\[|\\]\\]/g,"").split(/[.!?…]+/).forEach(s=>{
        const words=s.trim().split(/\\s+/).filter(Boolean).length;
        if(words>20) out.push(id+": "+words+"w");
      });});
    }
    return out;
  })()`);
  if (long.length) throw new Error('long sentences: ' + long.join('; '));
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (errors.length) { console.log('RUNTIME ERRORS:\n' + errors.slice(0, 20).join('\n')); process.exit(1); }
process.exit(fail ? 1 : 0);
