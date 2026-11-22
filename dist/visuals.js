const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let latencyMode='resident',numberFrame=0;
const latencyData={resident:{value:1.86,label:'模型常驻'},cold:{value:41.81,label:'冷加载'}};
function drawLatency(){
  const host=document.querySelector('#latency-chart'),w=Math.max(220,host.clientWidth),h=230,m={left:57,right:22,top:25,bottom:50},pw=w-m.left-m.right,x=v=>m.left+v/45*pw;
  const ticks=w<360?[0,15,30,45]:[0,10,20,30,40];
  let content=ticks.map(v=>`<line x1="${x(v)}" y1="${m.top}" x2="${x(v)}" y2="${h-m.bottom}" stroke="#d6dce4" stroke-width=".7" stroke-dasharray="2 3"/><path d="M${x(v)},${h-m.bottom}v-5" stroke="#566371"/><text x="${x(v)}" y="${h-m.bottom+21}" text-anchor="middle">${v}</text>`).join('');
  ['cold','resident'].forEach((key,i)=>{const d=latencyData[key],cy=65+i*75;content+=`<text class="cn" x="${m.left-10}" y="${cy+5}" text-anchor="end">${i?'常驻':'冷加载'}</text><rect class="perf-bar" x="${m.left}" y="${cy-13}" width="${x(d.value)-m.left}" height="26" rx="1" fill="${key===latencyMode?'#0072BD':'#a6b7ca'}" opacity="${key===latencyMode?1:.55}"/><text x="${Math.min(w-4,x(d.value)+8)}" y="${cy+5}" style="font-size:12px">${d.value}</text>`});
  content+=`<rect x="${m.left}" y="${m.top}" width="${pw}" height="${h-m.bottom-m.top}" fill="none" stroke="#566371" stroke-width="1"/><text x="${m.left+pw/2}" y="${h-5}" text-anchor="middle" style="font-size:15px">Response time (s)</text>`;
  host.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="同题相机问答：冷加载41.81秒，模型常驻1.86秒">${content}</svg>`;
}
function animateNumber(element,target,decimals=2,duration=650){
  cancelAnimationFrame(numberFrame);const from=parseFloat(element.textContent)||0,start=performance.now();
  if(reducedMotion.matches){element.textContent=target.toFixed(decimals);return}
  function frame(now){const t=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-t,3);element.textContent=(from+(target-from)*ease).toFixed(decimals);if(t<1)numberFrame=requestAnimationFrame(frame)}
  numberFrame=requestAnimationFrame(frame);
}
document.querySelectorAll('[data-latency]').forEach(button=>button.addEventListener('click',()=>{
  latencyMode=button.dataset.latency;setSelected([...document.querySelectorAll('[data-latency]')],button);
  document.querySelector('#latency-panel').setAttribute('aria-labelledby',button.id);
  animateNumber(document.querySelector('#latency-value'),latencyData[latencyMode].value);
  document.querySelector('.metric-number').setAttribute('aria-label',latencyData[latencyMode].label+' '+latencyData[latencyMode].value+' 秒');drawLatency();
}));
drawLatency();new ResizeObserver(drawLatency).observe(document.querySelector('#latency-chart'));
// Feature titles act as image selectors, retaining full original images.
const galleries=[{parent:'.thermal-layout',screen:'.thermal-screen',items:['thermal.png','thermal-detail.png','event.png']},{parent:'.visual-layout',screen:'.visual-screen',items:['vision.png','production.jpg','overview.png']}];
galleries.forEach(group=>{
 const region=document.querySelector(group.parent),screen=region.querySelector(group.screen),img=screen.querySelector('img');
 region.querySelectorAll('.modality-features h3').forEach((heading,index)=>{const title=heading.textContent,button=document.createElement('button');button.type='button';button.className='feature-choice';button.textContent=title;button.setAttribute('aria-pressed',index===0);heading.replaceChildren(button);button.addEventListener('click',()=>{region.querySelectorAll('.feature-choice').forEach(b=>b.setAttribute('aria-pressed',b===button));img.src='assets/'+group.items[index];img.alt=title;animateContent(screen)})});
});
const sceneObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('scene-visible');sceneObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.thermal-screen,.visual-screen,.voice-screen,.performance-main,.performance-cards article,.model-media,.scenario-photo').forEach(el=>{el.classList.add('scene-reveal');sceneObserver.observe(el)});
const metricObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count),decimals=Number(el.dataset.decimals)||0;metricObserver.unobserve(el);if(reducedMotion.matches)return;const start=performance.now();function step(now){const t=Math.min(1,(now-start)/900);el.textContent=(target*(1-Math.pow(1-t,3))).toFixed(decimals);if(t<1)requestAnimationFrame(step)}requestAnimationFrame(step)}),{threshold:.8});
document.querySelectorAll('[data-count]').forEach(el=>metricObserver.observe(el));
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.device,.model-media,.scenario-photo').forEach(el=>{el.classList.add('tilt-media');let pending=0;el.addEventListener('pointermove',event=>{if(reducedMotion.matches)return;cancelAnimationFrame(pending);const rect=el.getBoundingClientRect(),rx=((event.clientY-rect.top)/rect.height-.5)*-2,ry=((event.clientX-rect.left)/rect.width-.5)*2;pending=requestAnimationFrame(()=>{el.style.transform=`perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`})});el.addEventListener('pointerleave',()=>{cancelAnimationFrame(pending);el.style.transform=''})})}
const chapterObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;document.querySelectorAll('.modality-nav a').forEach(a=>a.classList.toggle('current',a.hash==='#'+entry.target.id))}),{rootMargin:'-15% 0px -45% 0px'});
document.querySelectorAll('#analysis,#acoustic,#thermal,#alignment,#intelligence,#models,#voice,#performance').forEach(el=>chapterObserver.observe(el));
const imageNav=document.createElement('div');imageNav.className='image-navigation';imageNav.innerHTML='<button type="button" data-image-prev>上一张</button><span id="image-position"></span><button type="button" data-image-next>下一张</button>';viewer.append(imageNav);
let galleryImages=[],galleryIndex=0;
function imageCatalog(){const seen=new Set();galleryImages=[...document.querySelectorAll('main img[role="button"]')].filter(img=>{if(seen.has(img.src))return false;seen.add(img.src);return true}).map(img=>({src:img.src,alt:img.alt}));galleryIndex=Math.max(0,galleryImages.findIndex(item=>item.src===document.querySelector('#full-image').src));document.querySelector('#image-position').textContent=`${galleryIndex+1} / ${galleryImages.length}`}
function moveImage(delta){if(!galleryImages.length)return;galleryIndex=(galleryIndex+delta+galleryImages.length)%galleryImages.length;const img=document.querySelector('#full-image');img.src=galleryImages[galleryIndex].src;img.alt=galleryImages[galleryIndex].alt;document.querySelector('#image-position').textContent=`${galleryIndex+1} / ${galleryImages.length}`}
viewer.addEventListener('toggle',()=>{if(viewer.open)imageCatalog()});imageNav.querySelector('[data-image-prev]').addEventListener('click',()=>moveImage(-1));imageNav.querySelector('[data-image-next]').addEventListener('click',()=>moveImage(1));viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();moveImage(-1)}if(event.key==='ArrowRight'){event.preventDefault();moveImage(1)}});
details.vision[2]='<ul><li>可见光联动</li><li>温度趋势</li><li>温升告警</li></ul>';
details.sound[2]='<ul><li>六通道 PCM</li><li>FFT · Welch · STFT</li><li>四种声学成像算法</li></ul>';
details.evidence[2]='<ul><li>工程与测点</li><li>事件与整改</li><li>报告与归档</li></ul>';
details.alignment[2]='<ul><li>热像告警 · 40 ms</li><li>声音告警 · 235 ms</li><li>现场问答 · 40 ms</li></ul>';
