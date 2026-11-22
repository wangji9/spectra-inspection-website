
(() => {
"use strict";
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=matchMedia("(prefers-reduced-motion: reduce)");
function transition(img){if(reduced.matches)return;img.classList.remove("swap");void img.offsetWidth;img.classList.add("swap")}
function tabs(selector,dataName,panel,change){
 const buttons=$$(selector+" [role=tab]");
 for(const btn of buttons)btn.addEventListener("click",()=>{
  for(const other of buttons){
   const yes=other===btn;
   other.setAttribute("aria-selected",String(yes));other.tabIndex=yes?0:-1;
  }
  if(panel)panel.setAttribute("aria-labelledby",btn.id);
  change(btn.dataset[dataName]);
 });
 $(selector).addEventListener("keydown",e=>{
  const n=buttons.indexOf(document.activeElement);if(n<0)return;
  const j=e.key==="ArrowRight"?(n+1)%buttons.length:e.key==="ArrowLeft"?(n+buttons.length-1)%buttons.length:e.key==="Home"?0:e.key==="End"?buttons.length-1:-1;
  if(j<0)return;
  e.preventDefault();buttons[j].click();buttons[j].focus();
 });
}
const heroImages=[
 ["overview.png","观澜多模态巡检平台界面"],
 ["vision.png","工业视觉识别界面"],
 ["thermal-detail.png","工业红外热成像界面"],
 ["acoustic.png","声场定位分析界面"]
];
const heroImg=$("#hero-image"),heroBtns=$$("[data-hero]");
let heroIndex=0,visible=true,paused=false,timeout=0;
function schedule(){
 clearTimeout(timeout);
 if(visible&&!paused&&!document.hidden&&!reduced.matches)timeout=setTimeout(()=>selectHero(heroIndex+1),6500);
}
function selectHero(i){
 heroIndex=(i+heroImages.length)%heroImages.length;
 heroImg.src="assets/"+heroImages[heroIndex][0];heroImg.alt=heroImages[heroIndex][1];transition(heroImg);
 heroBtns.forEach((b,j)=>{b.classList.toggle("is-active",j===heroIndex);b.setAttribute("aria-pressed",String(j===heroIndex))});
 schedule();
}
heroBtns.forEach((btn,j)=>btn.addEventListener("click",()=>selectHero(j)));
const hero=$(".hero");
hero.addEventListener("mouseenter",()=>{paused=true;schedule()});
hero.addEventListener("mouseleave",()=>{paused=false;schedule()});
hero.addEventListener("focusin",()=>{paused=true;schedule()});
hero.addEventListener("focusout",e=>{if(!hero.contains(e.relatedTarget)){paused=false;schedule()}});
if("IntersectionObserver" in window)new IntersectionObserver(e=>{visible=e[0].isIntersecting;schedule()},{threshold:.18}).observe(hero);
document.addEventListener("visibilitychange",schedule);
reduced.addEventListener("change",schedule);
schedule();

const modelModes={
 question:["问现场问题，<br>得到有依据的回答。","文字、图像与工程数据可以共同参与分析。","model-qa.png","板端智能问答实际界面"],
 image:["理解画面中的对象、<br>位置与变化。","结合现场截图与采样结果完成图像问答。","vision.png","工业视觉目标检测界面"],
 video:["连接连续画面，<br>识别事件发生过程。","从多帧视频中提取事件及时间线。","production.jpg","工业生产区域"],
 speech:["把现场口述，<br>变成可检索的记录。","音频、说话人和转写文本相互对应。","voice.png","语音分轨及转写界面"]
};
tabs(".model-menu","model",$("#model-panel"),key=>{
 const d=modelModes[key],img=$("#model-feature-image");
 $("#model-feature-title").innerHTML=d[0];$("#model-feature-note").textContent=d[1];
 img.src="assets/"+d[2];img.alt=d[3];transition(img);
});
const fusionModes={
 event:["把同一事件的证据关联起来。","画面、声音与热像，同步进入分析。","event.png","事件关联记录界面"],
 question:["对着现场证据，提出问题。","结合工程资料与多模态记录进行问答。","model-qa.png","板端多模态智能问答界面"],
 report:["把过程沉淀为可复核的报告。","保留事件来源、处置记录与关联证据。","report.png","巡检报告与归档界面"]
};
tabs(".fusion-selector","fusion",$("#fusion-panel"),key=>{
 const d=fusionModes[key],img=$("#fusion-image");
 $("#fusion-heading").textContent=d[0];$("#fusion-summary").textContent=d[1];
 img.src="assets/"+d[2];img.alt=d[3];transition(img);
});
const flowModes=[
 ["留下现场的完整信息。","采集画面、声音与温度变化。","overview.png","多模态采集界面"],
 ["把不同信号对应到同一事件。","时间同步，关联原始记录。","event.png","多模态事件关联界面"],
 ["从多源证据中找到线索。","信号分析与模型理解共同参与。","acoustic.png","声学分析界面"],
 ["将发现的问题推进处置。","缺陷分派、整改与复核。","defect.png","缺陷处置界面"],
 ["让每次判断都有完整归档。","报告、记录与证据可回查。","report.png","报告归档界面"]
];
tabs(".workflow-tabs","flow",$("#workflow-panel"),value=>{
 const d=flowModes[Number(value)],img=$("#workflow-image");
 $("#workflow-heading").textContent=d[0];$("#workflow-summary").textContent=d[1];
 img.src="assets/"+d[2];img.alt=d[3];transition(img);
});

// Scientific signal processing: deterministic 16 kHz synthetic recording.
const sampleRate=16000,count=4096;
let seed=29;
const random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296-.5};
const recording=Float64Array.from({length:count},(_,n)=>.18*Math.sin(2*Math.PI*1200*n/sampleRate)+.065*Math.sin(2*Math.PI*3200*n/sampleRate)+.025*random());
function powerFFT(src){
 const n=src.length,re=new Float64Array(n),im=new Float64Array(n);
 for(let i=0;i<n;i++)re[i]=src[i]*(.5-.5*Math.cos(2*Math.PI*i/n));
 for(let i=1,j=0;i<n;i++){
  let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;
  if(i<j){const t=re[i];re[i]=re[j];re[j]=t}
 }
 for(let size=2;size<=n;size<<=1){
  const half=size>>1;
  for(let start=0;start<n;start+=size)for(let k=0;k<half;k++){
   const angle=-2*Math.PI*k/size,c=Math.cos(angle),s=Math.sin(angle);
   const a=start+k,b=a+half,r=re[b]*c-im[b]*s,v=re[b]*s+im[b]*c;
   re[b]=re[a]-r;im[b]=im[a]-v;re[a]+=r;im[a]+=v;
  }
 }
 const result=new Float64Array(n/2+1);
 for(let k=0;k<result.length;k++)result[k]=re[k]*re[k]+im[k]*im[k];
 return result;
}
const spectrum=Array.from(powerFFT(recording),(p,i)=>({x:i*sampleRate/count/1000,y:20*Math.log10(Math.max(1e-12,(i===0||i===count/2?1:2)*Math.sqrt(p)/(count/2)))}));
const waveform=Array.from(recording.slice(0,640),(v,i)=>({x:i/sampleRate*1000,y:v}));
const len=1024,welch=new Float64Array(len/2+1);let nSegments=0;
for(let start=0;start+len<=count;start+=len/2){
 const p=powerFFT(recording.slice(start,start+len));
 for(let i=0;i<p.length;i++)welch[i]+=(i===0||i===len/2?1:2)*p[i]/(sampleRate*len*.375);
 nSegments++;
}
const psd=Array.from(welch,(v,i)=>({x:i*sampleRate/len/1000,y:10*Math.log10(Math.max(1e-15,v/nSegments))}));
const chartData={
 fft:{points:spectrum,xmax:8,ymin:-100,ymax:0,xstep:2,ystep:20,xminstep:1,yminstep:10,xlab:"频率 (kHz)",ylab:"幅值 (dBFS)",title:"FFT 幅值谱"},
 time:{points:waveform,xmax:40,ymin:-.3,ymax:.3,xstep:10,ystep:.15,xminstep:5,yminstep:.075,xlab:"时间 (ms)",ylab:"幅值 (FS)",title:"时域波形"},
 welch:{points:psd,xmax:8,ymin:-130,ymax:-20,xstep:2,ystep:20,xminstep:1,yminstep:10,xlab:"频率 (kHz)",ylab:"功率谱密度 (dBFS²/Hz)",title:"Welch 功率谱"}
};
const host=$("#signal-plot"),W=1080,H=490,L=98,T=34,R=1040,B=404;
function line(cls,x1,y1,x2,y2){return '<line class="'+cls+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>'}
function textAt(x,y,content,anchor,cls){
 return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||"middle")+'" class="'+(cls||"")+'">'+content+'</text>';
}
function renderChart(mode){
 const d=chartData[mode],px=v=>L+v/d.xmax*(R-L),py=v=>B-(v-d.ymin)/(d.ymax-d.ymin)*(B-T);
 let grid="",ticks="",curve="";
 const eq=(a,b)=>Math.abs(a-b)<1e-5;
 for(let x=0;x<=d.xmax+.00001;x+=d.xminstep){
  const isMajor=eq(x/d.xstep,Math.round(x/d.xstep));
  grid+=line(isMajor?"major-grid":"minor-grid",px(x),T,px(x),B);
  if(isMajor){ticks+=line("ticks",px(x),B,px(x),B+8);ticks+=textAt(px(x),B+31,x.toFixed(0));}
 }
 for(let i=0;i<400;i++){
  const y=d.ymin+i*d.yminstep;if(y>d.ymax+.00001)break;
  const isMajor=eq((y-d.ymin)/d.ystep,Math.round((y-d.ymin)/d.ystep));
  grid+=line(isMajor?"major-grid":"minor-grid",L,py(y),R,py(y));
  if(isMajor){ticks+=line("ticks",L-8,py(y),L,py(y));ticks+=textAt(L-17,py(y)+5,String(Number(y.toFixed(3))),"end");}
 }
 d.points.forEach((p,i)=>{curve+=(i?"L":"M")+px(p.x).toFixed(2)+" "+py(Math.max(d.ymin,Math.min(d.ymax,p.y))).toFixed(2)+" "});
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+d.title+'，横轴'+d.xlab+'，纵轴'+d.ylab+'">'+
 '<rect width="'+W+'" height="'+H+'" fill="#fff"/>'+
 '<defs><clipPath id="plot-clip"><rect x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/></clipPath></defs>'+
 '<g>'+grid+'</g><rect class="axis" x="'+L+'" y="'+T+'" width="'+(R-L)+'" height="'+(B-T)+'"/>'+
 '<g>'+ticks+'</g>'+
 '<g clip-path="url(#plot-clip)"><path class="curve" d="'+curve+'"/>'+
 '<line id="plot-cursor" x1="0" x2="0" y1="'+T+'" y2="'+B+'" stroke="#556775" stroke-width="1" stroke-dasharray="5 4" visibility="hidden"/>'+
 '<circle id="plot-point" r="4" fill="#0071e3" stroke="#fff" stroke-width="1.5" visibility="hidden"/></g>'+
 textAt((L+R)/2,H-21,d.xlab,"middle","axis-label")+
 '<text transform="translate(29 '+((T+B)/2)+') rotate(-90)" text-anchor="middle" class="axis-label">'+d.ylab+'</text>'+
 textAt(R-5,22,"","end","annotation").replace('class="annotation"','class="annotation" id="plot-readout"')+
 '</svg>';
 host.innerHTML=svg;
 const visual=$("svg",host),cursor=$("#plot-cursor"),dot=$("#plot-point"),readout=$("#plot-readout");
 visual.addEventListener("pointermove",e=>{
  const bounds=visual.getBoundingClientRect(),x=(e.clientX-bounds.left)*W/bounds.width;
  if(x<L||x>R){cursor.setAttribute("visibility","hidden");dot.setAttribute("visibility","hidden");readout.textContent="";return}
  const fraction=(x-L)/(R-L),i=Math.max(0,Math.min(d.points.length-1,Math.round(fraction*(d.points.length-1))));
  const p=d.points[i],cx=px(p.x),cy=py(Math.max(d.ymin,Math.min(d.ymax,p.y)));
  cursor.setAttribute("x1",cx);cursor.setAttribute("x2",cx);cursor.setAttribute("visibility","visible");
  dot.setAttribute("cx",cx);dot.setAttribute("cy",cy);dot.setAttribute("visibility","visible");
  readout.textContent=p.x.toFixed(2)+" / "+p.y.toFixed(2);
 });
 visual.addEventListener("pointerleave",()=>{cursor.setAttribute("visibility","hidden");dot.setAttribute("visibility","hidden");readout.textContent=""});
}
renderChart("fft");
tabs(".signal-controls","signal",$("#signal-panel"),renderChart);

// Click and keyboard to inspect full original screenshots, without cropping.
const viewer=$("#image-viewer"),large=$("#viewer-image");let trigger=null;
$$(".hero-art img,.challenge-shots img,.model-panel img,.sensor-feature>img,.fusion-summary img,.fusion-display img,.workflow-display img,.benefit img").forEach(img=>{
 img.setAttribute("role","button");img.tabIndex=0;
 img.setAttribute("aria-label","查看完整图片："+img.alt);
 const open=()=>{if(viewer.open)return;trigger=img;large.src=img.src;large.alt=img.alt;viewer.showModal()};
 img.addEventListener("click",open);
 img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
});
$(".viewer-close").addEventListener("click",()=>viewer.close());
viewer.addEventListener("click",e=>{if(e.target===viewer)viewer.close()});
viewer.addEventListener("close",()=>trigger?.focus());

if(!reduced.matches&&"IntersectionObserver" in window){
 const elements=$$(".section-intro,.challenge-shots,.challenge-points,.model-layout,.performance-primary,.performance-secondary,.sensor-feature,.fusion-summary,.fusion-display,.workflow-display,.benefit");
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.07,rootMargin:"0px 0px -35px 0px"});
 elements.forEach(el=>{el.classList.add("reveal");observer.observe(el)});
 document.documentElement.classList.add("motion-ready");
}

// 精细动态：技术规格入场与推理数字滚动，均支持减少动态效果。
const specSection=$("#technical");
if(specSection && !reduced.matches && "IntersectionObserver" in window){
 const specObserver=new IntersectionObserver(entries=>{
  for(const entry of entries)if(entry.isIntersecting){
   specSection.classList.add("tech-in-view");
   specObserver.unobserve(specSection);
  }
 },{threshold:.10});
 specObserver.observe(specSection);
}
if(!reduced.matches && "IntersectionObserver" in window){
 const animatedStats=$$(".performance-primary .metric-value strong");
 const numberObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   numberObserver.unobserve(entry.target);
   const el=entry.target;
   const finalText=el.textContent.trim();
   const value=Number(finalText);
   if(!Number.isFinite(value))return;
   const decimals=(finalText.split(".")[1]||"").length;
   const started=performance.now(),duration=880;
   const step=now=>{
    const t=Math.min(1,(now-started)/duration);
    const ease=1-Math.pow(1-t,3);
    el.textContent=t===1?finalText:(value*ease).toFixed(decimals);
    if(t<1)requestAnimationFrame(step);
   };
   requestAnimationFrame(step);
  });
 },{threshold:.7});
 animatedStats.forEach(el=>numberObserver.observe(el));
}
})();
