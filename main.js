// Add or change customization choices here. Each choice is cycled by its matching button.
const OPTIONS = {
  face: ['classic', 'smile', 'wink'],
  hat: ['kashmiri', 'beanie', 'top hat'],
  scarf: ['paisley', 'saffron', 'pine'],
  arms: ['sticks', 'kangri']
};
const STAGES = [
  {name:'base', cx:180, cy:354, max:112, step:16, label:'roll the first snowball'},
  {name:'middle',cx:180, cy:260, max:83, step:14, label:'roll the middle snowball'},
  {name:'head', cx:180, cy:165, max:58, step:12, label:'roll the little head'}
];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const balls = Object.fromEntries(STAGES.map(s=>[s.name, document.getElementById(s.name)]));
let stage = 0, rolling = 0, options = {face:0,hat:0,scarf:0,arms:0}, complete=false;
const rollButton=document.getElementById('rollButton'), caption=document.getElementById('caption');
const rollControl=document.getElementById('rollControl'), dressControls=document.getElementById('dressControls');
const toast=document.getElementById('toast'); let toastTimer;
function announce(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1900)}
function updateBall(){const s=STAGES[stage], r=Math.min(s.max, rolling*s.step+10);balls[s.name].setAttribute('r',r);balls[s.name].setAttribute('cx',s.cx);balls[s.name].setAttribute('cy',s.cy);if(r>=s.max){balls[s.name].classList.remove('settle');void balls[s.name].getBoundingClientRect();balls[s.name].classList.add('settle');stage++;rolling=0;if(stage<STAGES.length){caption.textContent=STAGES[stage].label;announce(stage===1?'A good strong base!':'Looking like a snowman!')}else dressUp()}}
function roll(){if(stage>=STAGES.length)return;rolling++;updateBall()}
function dressUp(){rollControl.hidden=true;dressControls.hidden=false;document.getElementById('clothes').style.display='block';document.getElementById('armGroup').style.display='block';document.querySelectorAll('.part-hit').forEach(b=>b.style.display='block');complete=true;announce('Your little snow friend is ready');celebrate()}
function cycleFace(){const g=document.getElementById('face');const n=OPTIONS.face[options.face];options.face=(options.face+1)%OPTIONS.face.length;g.innerHTML=n==='classic'?'<circle cx="163" cy="159" r="5" fill="#343b3c"/><circle cx="198" cy="159" r="5" fill="#343b3c"/><path d="m174 169 27 8-25 10Z" fill="#e88e4e"/><path d="M164 183q17 20 35 0" fill="none" stroke="#64473d" stroke-width="3" stroke-linecap="round"/>':n==='smile'?'<path d="M157 160q7 12 14 0m18 0q7 12 14 0M166 180q14 18 29 0" fill="none" stroke="#4a5552" stroke-width="3" stroke-linecap="round"/><path d="m175 168 23 7-22 8Z" fill="#ed9c56"/>':'<path d="M157 161q7-10 14 0m18 0h14M165 182q14 16 29-1" fill="none" stroke="#4a5552" stroke-width="3" stroke-linecap="round"/><path d="m175 168 23 7-22 8Z" fill="#ed9c56"/>';pop(g)}
function cycleHat(){const g=document.getElementById('hat');const n=OPTIONS.hat[options.hat];options.hat=(options.hat+1)%OPTIONS.hat.length;g.innerHTML=n==='kashmiri'?'<path d="M145 132q35-50 70 0Z" fill="#415e75" stroke="#31495f" stroke-width="3"/><path d="M142 131h76v10h-76Z" fill="#a7444d"/><path d="M158 124q22 8 46 0" fill="none" stroke="#f2d59a" stroke-width="3"/>':n==='beanie'?'<path d="M145 132q2-43 35-43t35 43Z" fill="#bf744c" stroke="#9b5e42" stroke-width="3"/><path d="M143 127h74v14h-74Z" fill="#e6b676"/><circle cx="180" cy="87" r="7" fill="#e6b676"/>':'<path d="M147 125h66v12h-66Zm11-2V97h44v26Zm-4-33h52v9h-52Z" fill="#405261" stroke="#314250" stroke-width="3"/>';pop(g)}
function cycleScarf(){const p=document.getElementById('scarf');const n=OPTIONS.scarf[options.scarf];options.scarf=(options.scarf+1)%OPTIONS.scarf.length;const colors={paisley:['url(#shawl)','#a7444d'],saffron:['#d79645','#bd7c3f'],pine:['#356557','#294c42']};p.setAttribute('fill',colors[n][0]);p.setAttribute('stroke',colors[n][1]);p.nextElementSibling.setAttribute('fill',colors[n][0]);p.nextElementSibling.setAttribute('stroke',colors[n][1]);pop(p)}
function cycleArms(){const n=OPTIONS.arms[options.arms];options.arms=(options.arms+1)%OPTIONS.arms.length;document.getElementById('kangri').style.display=n==='sticks'?'none':'block';announce(n==='sticks'?'Twig arms':'A little kangri warmth');pop(document.getElementById('armGroup'))}
function pop(el){el.style.transformOrigin='center';el.animate([{transform:'scale(.9)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:reduced?160:340,easing:'cubic-bezier(.2,1.5,.4,1)'})}
function celebrate(){const host=document.getElementById('sparkles');host.innerHTML='';for(let i=0;i<14;i++){const s=document.createElement('span');s.className='sparkle';s.textContent=i%2?'✦':'✧';s.style.left=(8+Math.random()*84)+'%';s.style.top=(12+Math.random()*76)+'%';s.style.animationDelay=(Math.random()*.7)+'s';host.append(s)}setTimeout(()=>host.innerHTML='',2400)}
rollButton.addEventListener('click',roll);document.querySelectorAll('.part-hit').forEach(b=>b.addEventListener('click',()=>{stage=STAGES.findIndex(s=>s.name===b.dataset.part);if(stage<0)stage=0;rolling=0;rollControl.hidden=false;dressControls.hidden=true;document.getElementById('clothes').style.display='none';document.getElementById('armGroup').style.display='none';document.querySelectorAll('.part-hit').forEach(x=>x.style.display='none');Object.values(balls).forEach(x=>x.setAttribute('r',0));caption.textContent=STAGES[stage].label;complete=false;announce('Let’s make a fresh snowball')}));
document.querySelectorAll('[data-cycle]').forEach(b=>b.addEventListener('click',()=>({face:cycleFace,hat:cycleHat,scarf:cycleScarf,arms:cycleArms}[b.dataset.cycle])()));
document.getElementById('again').addEventListener('click',()=>{stage=0;rolling=0;complete=false;options={face:0,hat:0,scarf:0,arms:0};Object.values(balls).forEach(x=>x.setAttribute('r',0));document.getElementById('clothes').style.display='none';document.getElementById('armGroup').style.display='none';rollControl.hidden=false;dressControls.hidden=true;document.querySelectorAll('.part-hit').forEach(x=>x.style.display='none');caption.textContent=STAGES[0].label;announce('A fresh patch of snow')});
document.getElementById('memoryButton').addEventListener('click',()=>{const pop=document.createElement('div');pop.className='memory-pop';pop.innerHTML='<img src="winter-memory.jpeg" alt="A bundled-up winter moment in the snow">';pop.addEventListener('click',()=>pop.remove());document.body.append(pop)});
// Canvas snowfall uses a small bounded particle pool for mobile performance.
const canvas=document.getElementById('snow'),ctx=canvas.getContext('2d');let flakes=[];
function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=reduced?35:Math.min(110,Math.round(innerWidth/8));flakes=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.6+Math.random()*2.1,v:.35+Math.random()*.9,w:Math.random()*6,a:.3+Math.random()*.55}))}addEventListener('resize',resize);resize();
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const f of flakes){ctx.beginPath();ctx.fillStyle=`rgba(255,255,255,${f.a})`;ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill();f.y+=reduced?f.v*.28:f.v;f.x+=Math.sin(f.y*.012+f.w)*.35;if(f.y>innerHeight+4){f.y=-4;f.x=Math.random()*innerWidth}}requestAnimationFrame(draw)}draw();

// Stream the official BTS upload; playback starts only after the visitor opens the player.
const musicButton=document.getElementById('musicButton'),musicPanel=document.getElementById('musicPanel');
function setMusicPanel(open){musicPanel.hidden=!open;musicButton.setAttribute('aria-expanded',String(open))}
musicButton.addEventListener('click',()=>setMusicPanel(musicPanel.hidden));
document.getElementById('musicClose').addEventListener('click',()=>setMusicPanel(false));
