(function cinematic(){
  "use strict";
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroImages=[
    {src:"assets/overview.png",label:"多模态总览",alt:"多模态板端总览界面"},
    {src:"assets/thermal-detail.png",label:"红外热像",alt:"热像与温度趋势界面"},
    {src:"assets/acoustic.png",label:"声学成像",alt:"声学成像可视化界面"},
    {src:"assets/vision.png",label:"视觉识别",alt:"视觉目标检测界面"}
  ];
  const heroImg=document.querySelector(".device img");
  const heroBtns=[...document.querySelectorAll("[data-hero-dot]")];
  const heroCaption=document.getElementById("hero-current-label");
  const heroRegion=document.querySelector(".hero");
  const heroControls=document.querySelector(".hero-stage-controls");
  let heroIndex=0,heroVisible=true,hovered=false,heroTimer=null;
  const changeHero=(next)=>{
    heroIndex=(next+heroImages.length)%heroImages.length;
    const item=heroImages[heroIndex];
    heroImg.src=item.src;heroImg.alt=item.alt;
    heroImg.classList.remove("hero-switching");
    void heroImg.offsetWidth;
    if(!reduced.matches)heroImg.classList.add("hero-switching");
    heroCaption.textContent=item.label;
    heroBtns.forEach((b,i)=>b.setAttribute("aria-current",String(i===heroIndex)));
    scheduleHero();
  };
  const scheduleHero=()=>{
    clearTimeout(heroTimer);
    const shouldRun=!reduced.matches&&!document.hidden&&heroVisible&&!hovered;
    heroControls.classList.toggle("is-paused",!shouldRun);
    if(shouldRun)heroTimer=setTimeout(()=>changeHero(heroIndex+1),5000);
  };
  document.querySelectorAll("[data-hero-step]").forEach(b=>b.addEventListener("click",()=>changeHero(heroIndex+Number(b.dataset.heroStep))));
  heroBtns.forEach(b=>b.addEventListener("click",()=>changeHero(Number(b.dataset.heroDot))));
  heroRegion.addEventListener("mouseenter",()=>{hovered=true;scheduleHero()});
  heroRegion.addEventListener("mouseleave",()=>{hovered=false;scheduleHero()});
  heroRegion.addEventListener("focusin",()=>{hovered=true;scheduleHero()});
  heroRegion.addEventListener("focusout",e=>{if(!heroRegion.contains(e.relatedTarget)){hovered=false;scheduleHero()}});
  new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;scheduleHero()},{threshold:.15}).observe(heroRegion);
  document.addEventListener("visibilitychange",scheduleHero);
  reduced.addEventListener("change",scheduleHero);
  scheduleHero();

  const track=document.querySelector(".showcase-track");
  const cards=[...track.querySelectorAll(".showcase-card")];
  document.querySelectorAll("[data-showcase]").forEach(button=>button.addEventListener("click",()=>{
    const stride=cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap||0);
    track.scrollBy({left:stride*Number(button.dataset.showcase),behavior:reduced.matches?"auto":"smooth"});
  }));
  cards.forEach(card=>{
    const img=card.querySelector("img");
    img.tabIndex=0;img.setAttribute("role","button");img.setAttribute("aria-label","查看大图："+img.alt);
    const open=()=>{
      const modal=document.getElementById("image-dialog");
      if(modal.open)return;
      imageTrigger=img;
      const full=document.getElementById("full-image");
      full.src=img.src;full.alt=img.alt;
      modal.showModal();document.body.style.overflow="hidden";
    };
    img.addEventListener("click",open);
    img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
  });


  if(typeof platforms!=="undefined"){platforms.terminal.title="现场终端";platforms.studio.title="工程工作台";}
  if(typeof scenarios!=="undefined"){
    const short={production:"生产区域",fan:"风机巡检",fixed:"固定监测",pump:"泵组巡检",electrical:"配电巡检",handover:"班组交接"};
    Object.keys(short).forEach(k=>scenarios[k].title=short[k]);
  }
  if(typeof stages!=="undefined")["多模态采集","时间关联","现场分析","处置复核","报告归档"].forEach((title,i)=>{if(stages[i])stages[i].title=title;});
  const targets=document.querySelectorAll(".showcase-heading,.showcase-card,.section-head,.performance-heading,.story-section,.fusion-machine,.advantage-grid article");
  if(!reduced.matches&&"IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("motion-visible");observer.unobserve(entry.target)}
    }),{rootMargin:"0px 0px -35px 0px",threshold:.08});
    targets.forEach(t=>{t.classList.add("motion-fade");observer.observe(t)});
  }
})();
