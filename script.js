/* =====================================================================
   ✏️  EDITA AQUÍ  — todo lo personalizable está en este objeto
   ===================================================================== */
const CONFIG = {
  nombre: "Mi amor",
  palabrasIntro: ["Alanna", "Eres muy especial", "Te quiero mucho"],   // luego aparece el corazón
  tituloEscena2: ["¡Feliz", "cumpleaños!"],             // cada elemento = una línea
  textoPortada: "Nuestra pequeña historia",
  gif: "gif/cumple.gif",                // ej. "gif/cumple.gif" → se muestra entre "¡Feliz cumpleaños!" y el nombre

  // Cada elemento = una doble página del libro abierto:
  //   fotos[0] → hoja izquierda, fotos[1] → hoja derecha, texto → recuadro de arriba.
  // Fotos: rutas relativas (ej. "img/imagen1.jpeg") si lo subes a Vercel/Netlify junto a este archivo.
  // Si una foto no carga, se muestra un marcador rosado para que notes cuál falta.
 paginas: [

    {
        texto: "Eres una de esas personitas que me ha sorprendido muchísimo en tan poquito tiempo. No sé cómo pasó, pero poco a poco te has vuelto alguien muy especial para mí",
        fotos: ["img/imagen1.jpeg", "img/imagen2.jpeg"]
    },

    {
        texto: "Desde que te conocí, me nació esa necesidad de apoyarte, de estar para ti y de acompañarte en lo que necesites. No sé, simplemente me gusta saber que puedo estar a tu lado.",
        fotos: ["img/imagen3.jpeg", "img/imagen4.jpeg"]
    },

    {
        texto: "Y creo que todo eso hizo que me fascinaras por completo. Eres una reina, mi amor, y siento que mereces que te quieran, te cuiden y te traten como la reina que eres.",
        fotos: ["img/imagen5.jpeg", "img/imagen6.jpeg"]
    },

    {
        texto: "Me encanta ir conociéndote poquito a poquito, saber qué te gusta, qué te hace feliz, tus ocurrencias y hasta esas pequeñas cosas que quizás tú ni notas. Y no te voy a mentir, cada vez me dan más ganas de seguir descubriéndote.",
        fotos: ["img/imagen7.jpeg", "img/imagen8.jpeg"]
    },

    {
        texto: "Sé que llevamos poquito tiempo, pero me gusta mucho lo que estamos construyendo. Quiero seguir compartiendo momentos contigo, seguir riéndonos, conociéndonos y ver hasta dónde nos lleva todo esto tan bonito que está empezando.",
        fotos: ["img/imagen9.jpeg", "img/imagen10.jpeg"]
    },

],

  // Fotos que no van en el libro pero sí en el corazón de fotos del final
  // (el corazón usa las del libro + estas).
  fotosExtra: ["img/imagen11.jpeg", "img/imagen12.jpeg", "img/imagen13.jpeg", "img/imagen14.jpeg", "img/imagen15.jpeg"],

  mensajeFinal: "Te quiero mucho, Alanna ♥",
  musica: "",               // ej. "musica.mp3" → activa la pantalla "Toca para abrir"
  tiempos: { palabra: 4200, corazon: 3000, escena2: 6000 }  // milisegundos
};
/* ===================================================================== */

const $ = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const show = id => $(id).classList.add('active');
const hide = id => $(id).classList.remove('active');

/* ---------- fotos + marcador si faltan ---------- */
function placeholder(n){
  const h = [330,290,350,305,10,270][n % 6];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},85%,78%)'/><stop offset='1' stop-color='hsl(${h+25},70%,55%)'/></linearGradient></defs><rect width='300' height='400' fill='url(#g)'/><text x='150' y='200' font-size='90' text-anchor='middle' fill='white'>♥</text><text x='150' y='265' font-size='30' text-anchor='middle' fill='white' font-family='sans-serif'>Foto ${n+1}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}
const allPhotos = [...CONFIG.paginas.flatMap(p => p.fotos), ...(CONFIG.fotosExtra || [])];
function makeImg(idx){
  const img = new Image(); img.alt = ''; img.decoding = 'async';
  const src = allPhotos[idx];
  img.onerror = () => { img.onerror = null; img.src = placeholder(idx); };
  img.src = src ? src : placeholder(idx);
  return img;
}

/* ---------- canvas helpers ---------- */
function fit(c){ const d = Math.min(devicePixelRatio || 1, 2); c.width = innerWidth * d; c.height = innerHeight * d;
  const x = c.getContext('2d'); x.setTransform(d,0,0,d,0,0); return x; }

/* ---------- lluvia de corazones (estilo matrix) ---------- */
let rainOn = false;
function startRain(){
  const c = $('rain'); let ctx = fit(c); const fs = 16;
  const chars = ('♥♡❤LOVE' + CONFIG.nombre.toUpperCase()).split('');
  let cols, drops;
  const setup = () => { ctx = fit(c); cols = Math.ceil(innerWidth / fs); drops = Array.from({length:cols}, () => Math.random() * -50); };
  setup(); addEventListener('resize', setup);
  ctx.fillStyle = '#05040c'; ctx.fillRect(0,0,innerWidth,innerHeight);
  let last = 0; rainOn = true;
  (function loop(t){
    if (!rainOn) return;
    if (t - last > 55){
      last = t;
      ctx.fillStyle = 'rgba(5,4,12,0.13)'; ctx.fillRect(0,0,innerWidth,innerHeight);
      ctx.font = `bold ${fs}px monospace`;
      for (let i = 0; i < cols; i++){
        const ch = chars[Math.random()*chars.length|0], y = drops[i]*fs;
        ctx.fillStyle = Math.random() > .92 ? '#ffd6ea' : '#ff3d9a';
        ctx.fillText(ch, i*fs, y);
        if (y > innerHeight && Math.random() > .975) drops[i] = 0;
        drops[i]++;
      }
    }
    requestAnimationFrame(loop);
  })(0);
}

/* ---------- cielo estrellado ---------- */
let starsOn = false;
function startStars(){
  const c = $('stars'); let ctx = fit(c); let stars = [];
  const setup = () => { ctx = fit(c); stars = Array.from({length: Math.round(innerWidth*innerHeight/5000)}, () => ({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.4+.3, p:Math.random()*6.28, s:Math.random()*.02+.005, v:Math.random()*.15+.03 })); };
  setup(); addEventListener('resize', setup); starsOn = true;
  (function loop(){
    if (!starsOn) return;
    ctx.fillStyle = '#05040c'; ctx.fillRect(0,0,innerWidth,innerHeight);
    for (const s of stars){
      s.p += s.s; s.y += s.v; if (s.y > innerHeight) { s.y = 0; s.x = Math.random()*innerWidth; }
      ctx.globalAlpha = .25 + .75*Math.abs(Math.sin(s.p));
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    }
    ctx.globalAlpha = 1; requestAnimationFrame(loop);
  })();
}

/* ---------- corazón pixelado ---------- */
function pixelHeart(){
  const map = ['.XX.XX.','XXXXXXX','XXXXXXX','.XXXXX.','..XXX..','...X...'].join('');
  const box = $('pheart'); box.innerHTML = '';
  [...map].forEach((ch, i) => {
    const cell = document.createElement('i');
    if (ch === 'X'){ cell.className = 'on'; cell.style.animationDelay = (i*35) + 'ms'; }
    box.appendChild(cell);
  });
  setTimeout(() => box.classList.add('beat'), 1500);
}

/* ---------- escena 2 ---------- */
function buildBday(){
  const colors = ['#ff6b9d','#ffb347','#ffe66d','#7bed9f','#70a1ff','#c56cf0'];
  let k = 0;
  $('bday').innerHTML = CONFIG.tituloEscena2.map(line =>
    `<span class="line">${[...line].map(ch => ch === ' ' ? ' ' :
      `<span class="bl" style="color:${colors[k % 6]};animation-delay:${(k++)*0.08}s">${ch}<i class="candle"></i></span>`).join('')}</span>`).join('');
  $('bname').textContent = CONFIG.nombre;
  const box = $('bgif');
  const empty = () => { box.classList.add('empty'); box.textContent = 'Aquí va tu GIF'; };
  if (!CONFIG.gif) return empty();
  const img = new Image(); img.alt = '';
  img.onerror = empty;
  img.src = CONFIG.gif;
  box.appendChild(img);
}

/* ---------- libro de doble página ---------- */
// Hoja 0 = portada (frente) + página izquierda de la 1ª doble (reverso).
// Hoja k = página derecha de la doble k (frente) + página izquierda de la doble k+1 (reverso).
let leaves = [], spread = 0, busy = false;   // spread 0 = cerrado; 1..S = doble abierta
function fillPage(side, photoIdx, num){
  side.innerHTML = `<div class="photo"></div><span class="pn">${num}</span>`;
  side.querySelector('.photo').appendChild(makeImg(photoIdx));
}
function buildBook(){
  const S = CONFIG.paginas.length, book = $('book'), L = S + 1;
  for (let i = 0; i < L; i++){
    const leaf = document.createElement('div'); leaf.className = 'leaf'; leaf.style.zIndex = L - i;
    const front = document.createElement('div'); front.className = 'side front';
    const back  = document.createElement('div'); back.className  = 'side back';
    if (i === 0){ front.classList.add('cover'); front.innerHTML = '<b></b><span>♥</span>';
                  front.querySelector('b').textContent = CONFIG.textoPortada; }
    else fillPage(front, (i - 1) * 2 + 1, i * 2);
    if (i < S) fillPage(back, i * 2, i * 2 + 1); else back.classList.add('endpaper');
    leaf.append(front, back); book.appendChild(leaf); leaves.push(leaf);
  }
  $('next').onclick = forward; $('prev').onclick = backward;
  book.addEventListener('click', e => {
    if (spread === 0) return forward();
    const r = book.getBoundingClientRect();
    e.clientX > r.left + r.width / 2 ? forward() : backward();
  });
  book.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); forward(); } });
  let sx = null;
  book.addEventListener('touchstart', e => sx = e.touches[0].clientX, {passive:true});
  book.addEventListener('touchend', e => { if (sx === null || spread === 0) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40){ e.preventDefault(); dx < 0 ? forward() : backward(); } });
}
function setMsg(){
  const p = $('msgText'); p.classList.add('fade');
  setTimeout(() => { p.textContent = CONFIG.paginas[spread - 1].texto; p.classList.remove('fade'); }, spread === 1 ? 0 : 350);
}
function updateNav(){
  const S = CONFIG.paginas.length;
  $('pageNum').textContent = `${spread} / ${S}`;
  $('prev').disabled = spread <= 1;
  $('next').textContent = spread === S ? '♥' : '›';
}
async function forward(){
  if (busy) return; busy = true;
  if (spread === CONFIG.paginas.length){ hide('s3'); await sleep(900); showHeart(); return; }
  const leaf = leaves[spread]; leaf.style.zIndex = 500; leaf.classList.add('flipped');
  spread++; if (spread === 1) $('s3').classList.add('opened');
  setMsg(); updateNav();
  await sleep(1100); leaf.style.zIndex = 100 + spread; busy = false;
}
async function backward(){
  if (busy || spread <= 1) return; busy = true;
  spread--; const leaf = leaves[spread]; leaf.style.zIndex = 500; leaf.classList.remove('flipped');
  setMsg(); updateNav();
  await sleep(1100); leaf.style.zIndex = leaves.length - spread; busy = false;
}

/* ---------- corazón de fotos ---------- */
function buildHeart(animated){
  const box = $('heart'); box.innerHTML = '';
  const W = box.clientWidth, H = box.clientHeight;
  const N = Math.min(40, Math.max(22, allPhotos.length));
  const tile = W * (N > 28 ? .13 : .16);
  for (let i = 0; i < N; i++){
    const t = (i / N) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = 13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
    const px = W/2 + (x/16) * (W/2 - tile/2 - 4);
    const py = H/2 - ((y + 2.5)/14.5) * (H/2 - tile/2 - 4);
    const el = document.createElement('div'); el.className = 'tile';
    el.style.cssText = `width:${tile}px;height:${tile*1.15}px;left:${px - tile/2}px;top:${py - tile*.575}px;` +
      `--dx:${W/2 - px}px;--dy:${H/2 - py}px;--r:${(Math.random()*14 - 7).toFixed(1)}deg;` +
      `transition-delay:${animated ? i*110 : 0}ms`;
    el.appendChild(makeImg(i % allPhotos.length));
    box.appendChild(el);
  }
  requestAnimationFrame(() => requestAnimationFrame(() => box.querySelectorAll('.tile').forEach(t => t.classList.add('in'))));
  return N;
}
async function showHeart(){
  show('s5');
  const N = buildHeart(true);
  await sleep(N*110 + 1200);
  $('heart').classList.add('beat');
  $('final').textContent = CONFIG.mensajeFinal; $('final').classList.add('show');
  setInterval(floatHeart, 700);
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => buildHeart(false), 250); });
}
function floatHeart(){
  const h = document.createElement('span'); h.className = 'float-heart'; h.textContent = '♥';
  h.style.left = Math.random()*100 + 'vw'; h.style.fontSize = (12 + Math.random()*18) + 'px';
  h.style.animationDuration = (6 + Math.random()*5) + 's';
  document.body.appendChild(h); setTimeout(() => h.remove(), 11000);
}

/* ---------- secuencia principal ---------- */
async function run(){
  buildBday(); buildBook();

  show('rain'); startRain(); show('s1');
  await sleep(900);
  const w = $('word'); w.style.setProperty('--dur', CONFIG.tiempos.palabra + 'ms');
  for (const p of CONFIG.palabrasIntro){
    w.textContent = p; w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop');
    await sleep(CONFIG.tiempos.palabra);
  }
  w.classList.remove('pop'); w.textContent = '';
  pixelHeart(); await sleep(CONFIG.tiempos.corazon);

  hide('s1'); hide('rain'); await sleep(1000); rainOn = false;
  show('stars'); startStars(); show('s2');
  await sleep(CONFIG.tiempos.escena2);
  hide('s2'); await sleep(900); show('s3');
}

if (CONFIG.musica){
  $('music').src = CONFIG.musica; show('gate');
  $('gateBtn').onclick = () => { $('music').play().catch(() => {}); hide('gate'); setTimeout(run, 600); };
} else run();
