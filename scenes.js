(()=>{
'use strict';
const mode=document.body.dataset.scene,reduced=matchMedia('(prefers-reduced-motion: reduce)');
const active=document.querySelector('.scene-nav [aria-current]');if(active)active.parentElement.scrollLeft=Math.max(0,active.offsetLeft-active.parentElement.offsetLeft-active.parentElement.clientWidth/2+active.clientWidth/2);
if(mode==='mektup'){
 const envelope=document.getElementById('open-letter'),letter=document.getElementById('letter'),answer=document.getElementById('answer'),question=document.getElementById('question'),choices=document.getElementById('choices'),reset=document.getElementById('reset-letter'),rain=document.getElementById('confetti'),yes=document.getElementById('yes'),no=document.getElementById('no');
 let position={x:0,y:0},lastMove=0;
 function placeNo(x,y){position={x,y};no.style.transform=`translate(${x}px,${y}px)`}
 function resetNo(){if(!letter.hidden&&!choices.hidden)placeNo(Math.max(0,choices.clientWidth-no.offsetWidth-8),8)}
 function evade(event){
  if(event)event.preventDefault();
  if(choices.hidden)return;
  const area=choices.getBoundingClientRect(),yesBox=yes.getBoundingClientRect(),w=no.offsetWidth,h=no.offsetHeight,maxX=Math.max(0,choices.clientWidth-w-4),maxY=Math.max(0,choices.clientHeight-h-4);
  const px=event&&Number.isFinite(event.clientX)?event.clientX-area.left:position.x+w/2,py=event&&Number.isFinite(event.clientY)?event.clientY-area.top:position.y+h/2;
  let best=null,score=-1;
  for(let row=0;row<4;row++)for(let col=0;col<5;col++){
   const x=4+(maxX-4)*col/4,y=4+(maxY-4)*row/3;
   if(x<yesBox.right-area.left+14&&x+w>yesBox.left-area.left-14&&y<yesBox.bottom-area.top+14&&y+h>yesBox.top-area.top-14)continue;
   if(Math.hypot(x-position.x,y-position.y)<25)continue;
   const distance=Math.hypot(x+w/2-px,y+h/2-py);
   if(distance>score){score=distance;best={x,y}}
  }
  if(best){placeNo(best.x,best.y);lastMove=performance.now()}
 }
 envelope.onclick=()=>{envelope.hidden=true;letter.hidden=false;resetNo();yes.focus({preventScroll:true})};
 no.addEventListener('pointerenter',evade);no.addEventListener('pointerdown',evade);no.addEventListener('click',evade);
 no.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){evade(event);yes.focus({preventScroll:true})}});
 choices.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||performance.now()-lastMove<220)return;const box=no.getBoundingClientRect();if(event.clientX>box.left-25&&event.clientX<box.right+25&&event.clientY>box.top-25&&event.clientY<box.bottom+25)evade(event)});
 window.addEventListener('resize',resetNo);
 yes.onclick=()=>{
  question.textContent='iyi ki sen, iyi ki biz ♡';
  answer.textContent='askimm bebegmmm sen benı terkedene kadar hep senın olacagım sen benden soguyana kadar hep senın olacagım senı cok sevıyorum hayatim senı uzdugum her an ıcın cok ozur dılerım bebegmmmm';
  answer.hidden=false;choices.hidden=true;reset.hidden=false;reset.focus({preventScroll:true});
  if(!reduced.matches){rain.replaceChildren();for(let i=0;i<24;i++){const heart=document.createElement('span');heart.textContent='♥';heart.style.left=(i*43%100)+'%';heart.style.animationDelay=(i%7)*.12+'s';rain.append(heart)}setTimeout(()=>rain.replaceChildren(),3800)}
 };
 reset.onclick=()=>{question.textContent='hep benim sevgilim olur musun?';answer.hidden=true;choices.hidden=false;reset.hidden=true;rain.replaceChildren();resetNo();yes.focus({preventScroll:true})};return;
}
const canvas=document.getElementById('art'),ctx=canvas.getContext('2d'),button=document.getElementById('motion');if(!ctx){button.disabled=true;return}
const TAU=Math.PI*2;let width=1,height=1,time=0,paused=reduced.matches,last=0,frame=null;
const segments=[],petals=[],letters=[];
let starBounds,starLength=0;
if(mode==='renkli-yildiz'){
 let x=0,y=0,a=0;const xs=[0],ys=[0];
 for(let i=0;i<300;i++){const nx=x+Math.cos(a)*i*3,ny=y+Math.sin(a)*i*3;segments.push({x,y,nx,ny,color:`hsl(${i*1.8} 100% 62%)`});xs.push(nx);ys.push(ny);x=nx;y=ny;a+=145*Math.PI/180}
 starBounds={left:Math.min(...xs),right:Math.max(...xs),top:Math.min(...ys),bottom:Math.max(...ys)};starLength=16000;
}
if(mode==='spiral'){
 for(let r=22;r<=233;r+=13){const count=Math.max(3,Math.floor(TAU*r/65));for(let i=0;i<count;i++)letters.push({r,a:i*TAU/count+r*.024})}
}
if(mode==='gul'){
 const rings=[{r:3,n:5,l:40,w:17},{r:10,n:7,l:65,w:29},{r:20,n:9,l:95,w:42},{r:31,n:12,l:122,w:52}];
 rings.forEach((ring,k)=>{for(let j=0;j<ring.n;j++){const angle=j*TAU/ring.n+k*.4;const petal=[];for(const side of [1,-1])for(let i=0;i<11;i++){const t=(side===1?i:10-i)/10,forward=ring.r+ring.l*Math.sin(t*Math.PI/2),across=side*ring.w*Math.sin(t*Math.PI);petal.push({x:Math.cos(angle)*forward-Math.sin(angle)*across,y:-65+(Math.sin(angle)*forward+Math.cos(angle)*across)*.79})}petals.push({points:petal,color:['#ffe2ee','#ffa6d3','#f65aab','#dd398e'][k]})}});
}
const duration=mode==='gul'?13500:16000,hold=3000,fade=900,cycle=duration+hold+fade;
function drawSpiral(t){
 ctx.font='600 7.4px Arial,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
 for(const word of letters){const a=word.a+t*.0001*(1+word.r/400),wave=(Math.cos(a*3-word.r*.034-t*.0007)+1)/2;ctx.save();ctx.translate(Math.cos(a)*word.r,Math.sin(a)*word.r);ctx.rotate(a+Math.PI/2);ctx.globalAlpha=.22+.78*wave;ctx.fillStyle=wave>.8?'#ff6a6e':'#ef354c';ctx.fillText('seni seviyorum',0,0);ctx.restore()}
}
function drawStar(t){
 const progress=Math.min(300,t/starLength*300),n=Math.floor(progress),b=starBounds,s=460/Math.max(b.right-b.left,b.bottom-b.top);
 ctx.save();ctx.scale(s,s);ctx.translate(-(b.left+b.right)/2,-(b.top+b.bottom)/2);ctx.lineWidth=1.1/s;ctx.lineCap='round';
 let tx=0,ty=0;for(let i=0;i<Math.min(300,n+1);i++){const p=segments[i],f=i<n?1:progress-n;tx=p.x+(p.nx-p.x)*f;ty=p.y+(p.ny-p.y)*f;ctx.strokeStyle=p.color;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(tx,ty);ctx.stroke()}
 if(t<starLength){ctx.fillStyle='#fff3c9';ctx.shadowColor='#ffe5a3';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(tx,ty,2.5/s,0,TAU);ctx.fill()}ctx.restore();
}
function drawRose(t){
 const progress=Math.min(1,t/duration),stem=Math.min(1,progress*5);
 ctx.save();ctx.strokeStyle='#458966';ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=80*stem;i++){const u=i/80,x=12+52*u*u-27*u,y=-25+252*u;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
 ctx.font='600 7px Arial,sans-serif';ctx.textAlign='center';ctx.fillStyle='#64a47c';
 if(progress>.12)for(const [bx,by,flip] of [[16,105,-1],[28,163,1]])for(let i=0;i<22;i++){const a=i/22*TAU;ctx.save();ctx.translate(bx+flip*(25+28*Math.cos(a)),by-10*Math.cos(a)+9*Math.sin(a));ctx.rotate(flip*.12);ctx.fillText('I love you',0,0);ctx.restore()}
 const amount=Math.max(0,(progress-.16)/.84)*petals.length;
 for(let p=0;p<Math.min(petals.length,Math.ceil(amount));p++){const petal=petals[p],visible=Math.min(1,amount-p);ctx.fillStyle=petal.color;ctx.globalAlpha=.82;for(let i=0;i<petal.points.length*visible;i++){const dot=petal.points[i];ctx.fillText('I love you',dot.x,dot.y)}}ctx.restore();
}
function render(){
 ctx.clearRect(0,0,width,height);ctx.save();ctx.translate(width/2,height/2);const scale=Math.min(width,height)*.91/520;ctx.scale(scale,scale);
 const t=reduced.matches&&paused?duration:time%cycle;
 if(mode!=='spiral'&&t>duration+hold)ctx.globalAlpha=1-(t-duration-hold)/fade;
 if(mode==='spiral')drawSpiral(time);else if(mode==='gul')drawRose(t);else drawStar(t);
 ctx.restore();
}
function tick(now){frame=null;if(paused||document.hidden){last=0;return}if(last)time+=Math.min(now-last,50);last=now;render();frame=requestAnimationFrame(tick)}
function sync(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;button.textContent=paused?'♡ Devam et':'♡ Durdur';button.setAttribute('aria-pressed',String(paused));if(!paused&&!document.hidden)frame=requestAnimationFrame(tick)}
function resize(){const box=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=box.width;height=box.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);render()}
button.onclick=()=>{paused=!paused;sync()};document.getElementById('replay').onclick=()=>{time=0;paused=reduced.matches;render();sync()};reduced.addEventListener('change',e=>{paused=e.matches;render();sync()});document.addEventListener('visibilitychange',sync);new ResizeObserver(resize).observe(canvas);resize();sync();
})();
