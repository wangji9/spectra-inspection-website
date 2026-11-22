// Sequential workflow: motion only runs while the section is in view.
const stages=[
{label:'CAPTURE',title:'把此刻的现场，<br>完整留下。',desc:'',tags:['现场画面','六麦声音','红外热像'],image:'overview.png',alt:'现场采集与多模态预览界面'},
{label:'ALIGN',title:'让多路信息，<br>回到同一时刻。',desc:'',tags:['事件基准','采样时间','证据关联'],image:'event.png',alt:'事件详情与多路证据时间对齐界面'},
{label:'ANALYSE',title:'循着信号，<br>找到复查的方向。',desc:'',tags:['信号分析','空间响应','板端问答'],image:'acoustic.png',alt:'声学空间响应分析界面'},
{label:'RESOLVE',title:'让每一个异常，<br>都有后续。',desc:'',tags:['缺陷分派','整改记录','复核关闭'],image:'defect.png',alt:'缺陷整改与复核记录界面'},
{label:'ARCHIVE',title:'交接的不只是结论，<br>还有完整依据。',desc:'',tags:['PDF 报告','版本归档','证据回查'],image:'report.png',alt:'事件分析报告完整页面'}
];
let stageIndex=0,stageVisible=false,stagePaused=matchMedia('(prefers-reduced-motion: reduce)').matches,stageTimer=null;
const controls=document.querySelector('.journey-controls'),stageButtons=[...document.querySelectorAll('[data-step]')],toggle=document.querySelector('.journey-toggle');
function animateContent(element){element.classList.remove('is-changing');requestAnimationFrame(()=>requestAnimationFrame(()=>element.classList.add('is-changing')))}
function updateStage(index,manual=false){stageIndex=index;const data=stages[index];stageButtons.forEach((button,i)=>{const selected=i===index;button.setAttribute('aria-selected',selected);button.tabIndex=selected?0:-1;button.classList.toggle('is-complete',i<index)});document.querySelector('#journey-panel').setAttribute('aria-labelledby',stageButtons[index].id);document.querySelector('#journey-label').textContent=data.label;document.querySelector('#journey-title').innerHTML=data.title;document.querySelector('#journey-desc').textContent=data.desc;document.querySelector('#journey-tags').innerHTML=data.tags.map(t=>`<span>${t}</span>`).join('');document.querySelector('#journey-image').src='assets/'+data.image;document.querySelector('#journey-image').alt=data.alt;animateContent(document.querySelector('#journey-panel'));if(manual)stagePaused=true;syncStageTimer()}
function syncStageTimer(){clearTimeout(stageTimer);controls.classList.remove('is-running');toggle.textContent=stagePaused?'播放':'暂停';toggle.setAttribute('aria-label',stagePaused?'播放流程动画':'暂停流程动画');toggle.setAttribute('aria-pressed',String(stagePaused));if(stageVisible&&!stagePaused&&!document.hidden){requestAnimationFrame(()=>controls.classList.add('is-running'));stageTimer=setTimeout(()=>updateStage((stageIndex+1)%stages.length),6000)}}
stageButtons.forEach((button,i)=>button.addEventListener('click',()=>updateStage(i,true)));
toggle.addEventListener('click',()=>{stagePaused=!stagePaused;syncStageTimer()});
const journeyObserver=new IntersectionObserver(entries=>{stageVisible=entries[0].isIntersecting;syncStageTimer()},{threshold:.25});journeyObserver.observe(document.querySelector('#workflow'));document.addEventListener('visibilitychange',syncStageTimer);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{stagePaused=e.matches;syncStageTimer()});
document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>animateContent(document.querySelector('#scenario-panel'))));document.querySelectorAll('[data-platform]').forEach(b=>b.addEventListener('click',()=>animateContent(document.querySelector('#platform-panel'))));
// Open every product visual in a full, uncropped viewer.
const viewer=document.querySelector('#image-dialog');let imageTrigger;
document.querySelectorAll('.device img,.acoustic-image img,.platform-screen img,.scenario-photo img,.thermal-visual img,.journey-media img,.intelligence-grid img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');function openImage(){imageTrigger=img;const full=document.querySelector('#full-image');full.src=img.src;full.alt=img.alt;viewer.showModal();document.body.style.overflow='hidden'}img.addEventListener('click',openImage);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openImage()}})});
document.querySelector('.image-close').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});viewer.addEventListener('close',()=>{document.body.style.overflow='';imageTrigger?.focus()});
document.querySelectorAll('.mini-wave i').forEach((bar,i)=>bar.style.setProperty('--i',i));
