(function initNarrative(){
 "use strict";
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
 const modes={
  event:{title:"跨模态事件关联",image:"event.png",alt:"多路数据对应同一个事件"},
  qa:{title:"结合现场证据问答",image:"model-qa.png",alt:"模型对现场证据进行智能问答"},
  report:{title:"生成可回查报告",image:"report.png",alt:"巡检报告及归档界面"}
 };
 document.querySelectorAll("[data-fusion]").forEach(button=>button.addEventListener("click",()=>{
  const d=modes[button.dataset.fusion],img=document.getElementById("fusion-image");
  document.querySelectorAll("[data-fusion]").forEach(b=>{const active=b===button;b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1});
  document.getElementById("fusion-panel").setAttribute("aria-labelledby",button.id);
  img.src="assets/"+d.image;img.alt=d.alt;document.getElementById("fusion-result").textContent=d.title;
  img.classList.remove("fusion-changed");void img.offsetWidth;
  if(!reduced.matches)img.classList.add("fusion-changed");
 }));
 const viewer=document.getElementById("image-dialog");
 document.querySelectorAll(".sensing-media img,.story-composite img,.fusion-small img,.fusion-screen img,.advantage-photo img").forEach(img=>{
  img.tabIndex=0;img.setAttribute("role","button");img.setAttribute("aria-label","查看完整图片："+img.alt);
  function open(){
   if(viewer.open)return;
   imageTrigger=img;
   document.getElementById("full-image").src=img.src;
   document.getElementById("full-image").alt=img.alt;
   viewer.showModal();document.body.style.overflow="hidden";
  }
  img.addEventListener("click",open);
  img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open()}});
 });
})();
