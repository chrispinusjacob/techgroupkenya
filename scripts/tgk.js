document.querySelectorAll('.tgk-copyright-year').forEach((el)=>{
  el.textContent=String(new Date().getFullYear());
});

const scrollProgressBar=document.getElementById('scrollProgressBar');
const scrollProgressRoot=document.getElementById('scrollProgress');
function updateScrollProgress(){
  if(!scrollProgressBar)return;
  const doc=document.documentElement;
  const max=doc.scrollHeight-doc.clientHeight;
  const pct=max>0?((doc.scrollTop||document.body.scrollTop)/max)*100:0;
  scrollProgressBar.style.width=pct+'%';
  if(scrollProgressRoot)scrollProgressRoot.setAttribute('aria-valuenow',String(Math.round(pct)));
}

const logos=[
  'Software Engineering','Web Development','Mobile Development','Cloud Computing','Cybersecurity',
  'Data Science','AI & Machine Learning','DevOps','Blockchain','Internet of Things',
  'UI/UX Design','Product Management','Network Engineering','Game Development','AR / VR',
  'Database Systems','QA & Testing','System Administration','Digital Transformation','Open Source',
  'FinTech','EdTech','Cloud Architecture','Embedded Systems','API Development',
];
const lt=document.getElementById('logosTrack');
[...logos,...logos].forEach(l=>{
  const el=document.createElement('div');
  el.className='logo-item';
  el.textContent=l;
  lt.appendChild(el);
});

const nav=document.getElementById('mainNav');
const heroTrust=document.getElementById('heroTrust');
const scrollTrust=document.getElementById('tgkScrollTrust');
const heroSection=document.querySelector('.hero');
let lastScrollY=0;
let scrollTicking=false;
const SCROLL_TRUST_THRESHOLD=280;
const SCROLL_DELTA_MIN=8;

function updateScrollTrust(){
  const y=window.scrollY;
  const dir=y>lastScrollY?'down':'up';
  const heroH=heroSection?heroSection.offsetHeight:640;

  if(heroTrust){
    const fadeStart=heroH*0.12;
    const fadeEnd=heroH*0.55;
    const t=Math.min(1,Math.max(0,(y-fadeStart)/(fadeEnd-fadeStart)));
    heroTrust.style.opacity=String(1-t*0.92);
    heroTrust.style.transform=`translateY(${t*14}px)`;
  }

  if(scrollTrust){
    const pastHero=y>SCROLL_TRUST_THRESHOLD;
    const nearTop=y<100;
    if(pastHero&&!nearTop){
      scrollTrust.hidden=false;
      scrollTrust.setAttribute('aria-hidden','false');
      scrollTrust.classList.add('is-armed');
      const delta=Math.abs(y-lastScrollY);
      if(delta>=SCROLL_DELTA_MIN){
        if(dir==='up'){
          scrollTrust.classList.add('is-visible');
          scrollTrust.classList.remove('is-hidden');
        }else{
          scrollTrust.classList.remove('is-visible');
          scrollTrust.classList.add('is-hidden');
        }
      }
    }else{
      scrollTrust.classList.remove('is-armed','is-visible','is-hidden');
      scrollTrust.hidden=true;
      scrollTrust.setAttribute('aria-hidden','true');
    }
  }

  lastScrollY=y;
  scrollTicking=false;
}

window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>10);
  updateScrollProgress();
  if(!scrollTicking){
    scrollTicking=true;
    requestAnimationFrame(updateScrollTrust);
  }
},{passive:true});
window.addEventListener('load',()=>{
  lastScrollY=window.scrollY;
  updateScrollTrust();
});
window.addEventListener('resize',updateScrollProgress);
window.addEventListener('load',updateScrollProgress);
window.addEventListener('load',()=>{
  document.querySelectorAll('.hero-content,.hero-visual').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),i*150+100);
  });
});

const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
let scrollY=0;
hamburger.addEventListener('click',()=>{
  const open=mobileMenu.classList.contains('open');
  if(open){
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  } else {
    scrollY=window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top=`-${scrollY}px`;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
  }
});
mobileMenu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  });
});

function switchPeriod(btn,period){
  const chartVal=document.getElementById('dpChartVal');
  const chartChange=document.getElementById('dpChartChange');
  if(!chartVal||!chartChange)return;
  document.querySelectorAll('.dp-period-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const configs={
    '7d':{val:'12K+',change:'▲ Community members engaging this week'},
    '1m':{val:'48+',change:'▲ Articles & resources published this month'},
    '3m':{val:'24+',change:'▲ Events & workshops this quarter'},
    '1y':{val:'Kenya',change:'▲ Nationwide tech community growth'},
  };
  const c=configs[period];
  chartVal.textContent=c.val;
  chartChange.textContent=c.change;
}

const sparklineEl=document.getElementById('sparkline');
if(sparklineEl){
  const sparkBars=[60,75,50,90,65,85,70,95];
  sparklineEl.innerHTML=sparkBars.map(h=>`<div class="pm-spark-bar" style="height:${h}%"></div>`).join('');
}

const stickyCards=document.querySelectorAll('.sticky-card');
const panelViews=document.querySelectorAll('.panel-view');
const panelLabel=document.getElementById('panelLabel');
const panelLabels=['Tech Blog','Skill Me','Tech Events'];
stickyCards.forEach((card,i)=>{
  card.addEventListener('click',()=>{
    stickyCards.forEach(c=>c.classList.remove('active'));
    panelViews.forEach(p=>p.classList.remove('active'));
    card.classList.add('active');
    document.getElementById('panel-'+i).classList.add('active');
    panelLabel.textContent=panelLabels[i];
  });
});

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      stickyCards.forEach((card,i)=>{
        const rect=card.getBoundingClientRect();
        const viewH=window.innerHeight;
        if(rect.top<viewH*0.6&&rect.bottom>viewH*0.3){
          stickyCards.forEach(c=>c.classList.remove('active'));
          panelViews.forEach(p=>p.classList.remove('active'));
          card.classList.add('active');
          document.getElementById('panel-'+i).classList.add('active');
          panelLabel.textContent=panelLabels[i];
        }
      });
    }
  });
},{threshold:0.3});
stickyCards.forEach(c=>observer.observe(c));

const statNums=document.querySelectorAll('.stat-num[data-target]');
const statsObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const target=parseFloat(el.dataset.target);
      const suffix=el.dataset.suffix||'';
      const decimal=parseInt(el.dataset.decimal)||0;
      const prefix=el.dataset.prefix||'';
      let start=0,duration=1800,startTime=null;
      function animate(ts){
        if(!startTime)startTime=ts;
        const progress=Math.min((ts-startTime)/duration,1);
        const ease=1-Math.pow(1-progress,3);
        const val=start+(target-start)*ease;
        const n=decimal?val:Math.round(val);
        const formatted=decimal?val.toFixed(decimal):(n>=1000?n.toLocaleString('en-US'):String(n));
        el.textContent=prefix+formatted+suffix;
        if(progress<1)requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      const bar=el.closest('.stat-block').querySelector('.stat-bar');
      if(bar){setTimeout(()=>{bar.style.width=bar.dataset.width;},200);}
      statsObs.unobserve(el);
    }
  });
},{threshold:0.5});
statNums.forEach(el=>statsObs.observe(el));

let isAnnual=false;
function togglePricing(){
  isAnnual=!isAnnual;
  document.getElementById('pricingToggle').classList.toggle('on',isAnnual);
  document.querySelectorAll('.price-num').forEach(el=>{
    el.textContent=isAnnual?el.dataset.annual:el.dataset.monthly;
  });
  document.querySelectorAll('.period-label').forEach(el=>{
    el.textContent=isAnnual?'annually':'monthly';
  });
  document.querySelectorAll('.price-alt-monthly').forEach(el=>{
    el.style.display=isAnnual?'none':'inline';
  });
  document.querySelectorAll('.price-alt-annual').forEach(el=>{
    el.style.display=isAnnual?'inline':'none';
  });
}

(function initFaqAccordion(){
  const faqList=document.getElementById('faqList');
  if(!faqList||faqList.dataset.ready==='1')return;
  faqList.dataset.ready='1';
  faqList.querySelectorAll('.faq-item .faq-q').forEach((q)=>{
    q.addEventListener('click',()=>{
      q.closest('.faq-item').classList.toggle('open');
    });
  });
})();

let allExpanded=false;
function toggleAllFaq(){
  allExpanded=!allExpanded;
  document.querySelectorAll('.faq-item').forEach(el=>{
    allExpanded?el.classList.add('open'):el.classList.remove('open');
  });
  document.getElementById('faqToggleLabel').textContent=allExpanded?'Collapse all':'Expand all';
  const icon=document.getElementById('faqToggleIcon');
  icon.innerHTML=allExpanded
    ?'<line x1="5" y1="12" x2="19" y2="12"/>'
    :'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
}

const testimonials=[
  {q:'Tech Group Kenya has been instrumental in my career growth. The community events and networking opportunities helped me land my dream job in software development.',name:'James M.',role:'Software Developer',init:'JM'},
  {q:'The tech blog and resources provided by Tech Group Kenya have been invaluable for staying updated with the latest trends and technologies in Kenya\'s tech scene.',name:'Grace W.',role:'Tech Entrepreneur',init:'GW'},
  {q:'As a student, Tech Group Kenya opened doors to internships and mentorship programs that shaped my career path. The community is truly supportive and innovative.',name:'David O.',role:'Computer Science Student',init:'DO'},
  {q:'Tech Group Kenya is more than a community — it\'s a movement. The events and collaborations have helped our startup connect with investors and talented developers.',name:'Sarah N.',role:'Startup Founder',init:'SN'},
];
const tt=document.getElementById('testiTrack');
[...testimonials,...testimonials].forEach(t=>{
  const el=document.createElement('div');
  el.className='testi-card';
  el.innerHTML=`<div class="testi-stars">${[...Array(5)].map(()=>'<svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>').join('')}</div><p class="testi-quote">"${t.q}"</p><div class="testi-author"><div class="testi-avatar">${t.init}</div><div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div>`;
  tt.appendChild(el);
});

let testiPaused=false;
function toggleTestimonials(){
  testiPaused=!testiPaused;
  tt.style.animationPlayState=testiPaused?'paused':'running';
  const icon=document.getElementById('testiIcon');
  const label=document.getElementById('testiLabel');
  const btn=document.getElementById('testiToggle');
  if(testiPaused){
    icon.innerHTML='<polygon points="6,4 20,12 6,20"/>';
    label.textContent='Play';
    btn.setAttribute('aria-label','Play testimonials');
  } else {
    icon.innerHTML='<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    label.textContent='Pause';
    btn.setAttribute('aria-label','Pause testimonials');
  }
}

document.getElementById('testiToggle').addEventListener('mouseenter',function(){
  this.style.borderColor='var(--sky)';
  this.style.color='var(--sky)';
});
document.getElementById('testiToggle').addEventListener('mouseleave',function(){
  this.style.borderColor='var(--border2)';
  this.style.color='var(--text2)';
});

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href==='#')return;
    e.preventDefault();
    const target=document.querySelector(href);
    if(target)target.scrollIntoView({behavior:'smooth'});
  });
});

const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.silk-reveal,.silk-reveal-left,.silk-reveal-right').forEach((el,i)=>{
  el.style.animationDelay=(i%4)*0.08+'s';
  revealObs.observe(el);
});

const statBlocks=document.querySelectorAll('.stat-block');
statBlocks.forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  el.style.transition=`opacity .8s var(--silk) ${i*0.1}s, transform .8s var(--silk) ${i*0.1}s, border-color .6s var(--silk), box-shadow .6s var(--silk)`;
});
const statObs2=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      statObs2.unobserve(e.target);
    }
  });
},{threshold:0.2});
statBlocks.forEach(el=>statObs2.observe(el));

const sectionHeaders=document.querySelectorAll('.section-title,.section-tag,.section-sub');
sectionHeaders.forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(16px)';
  el.style.transition='opacity .8s var(--silk), transform .8s var(--silk)';
});
const headerObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      headerObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
sectionHeaders.forEach(el=>headerObs.observe(el));

const phoneFrame=document.getElementById('phoneFrame');
if(phoneFrame){
  let targetX=0,targetY=0,currentX=0,currentY=0,rafId=null,running=false;
  const MAX_TILT=16;
  function animate(){
    currentX+=(targetX-currentX)*.06;
    currentY+=(targetY-currentY)*.06;
    phoneFrame.style.transform=`rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
    if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02){
      rafId=requestAnimationFrame(animate);
    } else {
      rafId=null;
      running=false;
    }
  }
  function kick(){
    if(!rafId){running=true;rafId=requestAnimationFrame(animate);}
  }
  window.addEventListener('mousemove',e=>{
    const x=e.clientX/window.innerWidth-.5;
    const y=e.clientY/window.innerHeight-.5;
    targetX=x*MAX_TILT*4;
    targetY=-y*MAX_TILT*2;
    kick();
  });
  window.addEventListener('mouseleave',()=>{
    targetX=0;targetY=0;
    kick();
  });
}

(function initHeroSlideshow(){
  const hero=document.querySelector('.hero#home,.hero');
  const bg=hero&&hero.querySelector('.hero-bg');
  if(!hero||!bg)return;
  const images=[
    'https://cdn.techgroupkenya.co.ke/images/hero1.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero1.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero2.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero2.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero3.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero3.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero4.png',
    'https://cdn.techgroupkenya.co.ke/images/hero4.png',
    'https://cdn.techgroupkenya.co.ke/images/hero5.png',
    'https://cdn.techgroupkenya.co.ke/images/hero5.png',
  ];
  let currentIndex=0;
  const updateBg=()=>{
    hero.classList.add('transitioning');
    bg.style.setProperty('--hero-bg',`url("${images[currentIndex]}")`);
    setTimeout(()=>hero.classList.remove('transitioning'),1200);
  };
  updateBg();
  setInterval(()=>{
    currentIndex=(currentIndex+1)%images.length;
    updateBg();
  },5000);
})();

(function initHeroTypewriter(){
  const line=document.querySelector('.hero-typewriter-line');
  const el=document.querySelector('.hero .typewriter');
  if(!el||!line)return;
  const raw=el.getAttribute('data-words');
  if(!raw)return;
  const words=raw.split(',');
  const CURSOR_PX=14;
  const MIN_FONT_PX=18;

  function measureMaxWordWidth(fontPx){
    const probe=document.createElement('span');
    probe.setAttribute('aria-hidden','true');
    probe.className='typewriter';
    probe.style.cssText='position:absolute;left:-9999px;top:0;white-space:nowrap;visibility:hidden;pointer-events:none';
    const base=getComputedStyle(el);
    probe.style.font=`${base.fontWeight} ${fontPx}px ${base.fontFamily}`;
    probe.style.letterSpacing=base.letterSpacing;
    document.body.appendChild(probe);
    let maxW=0;
    words.forEach(w=>{
      probe.textContent=w;
      maxW=Math.max(maxW,probe.offsetWidth);
    });
    document.body.removeChild(probe);
    return maxW;
  }

  function layoutTypewriterSlot(){
    const content=line.closest('.hero-content');
    const maxAllowed=Math.max(200,(content?content.clientWidth:line.clientWidth)-4);
    let fontPx=parseFloat(getComputedStyle(line).fontSize)||40;
    let maxW=measureMaxWordWidth(fontPx);
    if(maxW+CURSOR_PX>maxAllowed&&maxW>0){
      fontPx=Math.max(MIN_FONT_PX,fontPx*((maxAllowed-CURSOR_PX)/maxW));
      line.style.setProperty('--typewriter-font-size',fontPx+'px');
      maxW=measureMaxWordWidth(fontPx);
    }else{
      line.style.removeProperty('--typewriter-font-size');
    }
    const slot=Math.min(maxW+CURSOR_PX,maxAllowed);
    line.style.setProperty('--typewriter-slot',slot+'px');
  }

  let resizeTimer;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(layoutTypewriterSlot,120);
  });
  layoutTypewriterSlot();
  if(document.fonts&&document.fonts.ready){
    document.fonts.ready.then(layoutTypewriterSlot);
  }

  let wordIndex=0;
  let charIndex=0;
  let deleting=false;
  function tick(){
    const word=words[wordIndex];
    if(deleting){
      el.textContent=word.substring(0,charIndex-1);
      charIndex--;
    }else{
      el.textContent=word.substring(0,charIndex+1);
      charIndex++;
    }
    let delay=deleting?50:100;
    if(!deleting&&charIndex===word.length){
      delay=2000;
      deleting=true;
    }else if(deleting&&charIndex===0){
      deleting=false;
      wordIndex=(wordIndex+1)%words.length;
      delay=500;
    }
    setTimeout(tick,delay);
  }
  tick();
})();
