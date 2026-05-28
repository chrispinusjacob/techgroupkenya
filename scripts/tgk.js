(function () {
  'use strict';

  function hidePageLoader() {
    var loader = document.getElementById('loader');
    if (!loader || loader.dataset.dismissed === '1') return;
    loader.dataset.dismissed = '1';
    setTimeout(function () {
      loader.style.transition = 'opacity 1s ease-out';
      loader.style.opacity = '0';
      setTimeout(function () {
        loader.style.display = 'none';
      }, 1000);
    }, 2000);
  }

  if (document.readyState === 'complete') {
    hidePageLoader();
  } else {
    window.addEventListener('load', hidePageLoader);
  }

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) hidePageLoader();
  });

  window.TGK_LOADER = {
    hidePageLoader: hidePageLoader,
    setFormLoading: function (form, isLoading) {
      if (!form) return;
      var card = form.closest('.tgk-contact-form-card');
      if (!card) return;
      var btn = form.querySelector('[data-fs-submit-btn]');
      var loader = card.querySelector('.tgk-form-loader');

      if (isLoading) {
        card.classList.add('is-submitting');
        if (loader) {
          loader.hidden = false;
          loader.setAttribute('aria-hidden', 'false');
        }
        if (btn) {
          if (!btn.dataset.defaultLabel) {
            btn.dataset.defaultLabel = btn.textContent.trim();
          }
          btn.textContent = 'Sending...';
        }
      } else {
        card.classList.remove('is-submitting');
        if (loader) {
          loader.hidden = true;
          loader.setAttribute('aria-hidden', 'true');
        }
        if (btn && btn.dataset.defaultLabel) {
          btn.textContent = btn.dataset.defaultLabel;
        }
      }
    },
  };
})();

(function initTgkEmailLinks(){
  'use strict';
  var DEFAULT_CODES='101,99,104,111,64,116,101,99,104,103,114,111,117,112,107,101,110,121,97,46,99,111,46,107,101';
  function decode(codes){
    return codes.split(',').map(function(n){return String.fromCharCode(parseInt(n,10));}).join('');
  }
  function apply(el){
    var email=decode(el.getAttribute('data-tgk-e')||DEFAULT_CODES);
    var label=el.getAttribute('data-tgk-email-label')||email;
    el.href='mailto:'+email;
    el.textContent=label;
    el.setAttribute('aria-label','Email '+email);
    el.classList.remove('tgk-email-pending');
  }
  document.querySelectorAll('.tgk-email').forEach(apply);
})();

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
    '7d':{val:'12K+',change:'â–² Community members engaging this week'},
    '1m':{val:'48+',change:'â–² Articles & resources published this month'},
    '3m':{val:'24+',change:'â–² Events & workshops this quarter'},
    '1y':{val:'Kenya',change:'â–² Nationwide tech community growth'},
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
  card.addEventListener('click',(e)=>{
    if(e.target.closest('.sticky-card-cta'))return;
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
  {q:'Tech Group Kenya is more than a community â€” it\'s a movement. The events and collaborations have helped our startup connect with investors and talented developers.',name:'Sarah N.',role:'Startup Founder',init:'SN'},
];
const tt=document.getElementById('testiTrack');
testimonials.forEach(t=>{
  const el=document.createElement('div');
  el.className='testi-card';
  el.innerHTML=`<div class="testi-stars">${[...Array(5)].map(()=>'<svg viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>').join('')}</div><p class="testi-quote">"${t.q}"</p><div class="testi-author"><div class="testi-avatar">${t.init}</div><div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div>`;
  tt.appendChild(el);
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
    'https://cdn.techgroupkenya.co.ke/images/hero2.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero3.jpg',
    'https://cdn.techgroupkenya.co.ke/images/hero4.png',
    'https://cdn.techgroupkenya.co.ke/images/hero5.png',
  ];
  const preloaded=new Set();
  function preloadHero(url){
    if(preloaded.has(url))return;
    preloaded.add(url);
    const img=new Image();
    img.src=url;
  }
  let currentIndex=0;
  const updateBg=()=>{
    hero.classList.add('transitioning');
    bg.style.setProperty('--hero-bg',`url("${images[currentIndex]}")`);
    preloadHero(images[(currentIndex+1)%images.length]);
    setTimeout(()=>hero.classList.remove('transitioning'),1200);
  };
  preloadHero(images[0]);
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

(function initPhonePreviewAlternator(){
  const img=document.getElementById('phonePreview');
  if(!img)return;

  const sources=[
    'https://cdn.techgroupkenya.co.ke/images/skillmescreenshot.jpg',
    'https://cdn.techgroupkenya.co.ke/images/skillmepreview.jpg',
  ];

  // If the first one was changed in HTML, keep it as the starting source.
  if(img.src){
    const normalized=String(img.src);
    const idx=sources.findIndex(u=>normalized.indexOf(u)===0);
    if(idx>0){
      sources.unshift(sources.splice(idx,1)[0]);
    }
  }

  const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL_MS=4200;
  const FADE_MS=450;
  let current=0;

  function preload(url){
    const p=new Image();
    p.src=url;
  }

  preload(sources[0]);
  preload(sources[1]);

  function swap(){
    const next=(current+1)%sources.length;

    if(reduceMotion){
      img.src=sources[next];
      current=next;
      return;
    }

    img.style.opacity='0';
    window.setTimeout(()=>{
      img.src=sources[next];
      img.alt='TGK Hub app preview';
      img.style.opacity='1';
      current=next;
      preload(sources[(current+1)%sources.length]);
    },FADE_MS);
  }

  window.setInterval(swap,INTERVAL_MS);
})();
(function () {
  'use strict';

  var MIN_SUBMIT_MS = 3000;
  var RATE_LIMIT_MS = 60000;
  var RATE_LIMIT_KEY = 'tgk_contact_last_submit';
  var HOURLY_COUNT_KEY = 'tgk_contact_hourly';
  var MAX_PER_HOUR = 8;

  var LIMITS = {
    name: { min: 2, max: 100 },
    email: { max: 254 },
    subject: { min: 2, max: 200 },
    message: { min: 10, max: 5000 },
  };

  var SUSPICIOUS = /<script|javascript:|on\w+\s*=|data:text\/html/i;

  function $(id) {
    return document.getElementById(id);
  }

  function trim(val) {
    return String(val == null ? '' : val).trim();
  }

  function stripControlChars(val) {
    return val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  }

  function isValidEmail(email) {
    if (email.length > LIMITS.email.max) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function isValidName(name) {
    if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) return false;
    return /^[\p{L}\p{M}\s'.-]+$/u.test(name);
  }

  function hasSuspiciousContent(val) {
    return SUSPICIOUS.test(val);
  }

  function getHourlyCount() {
    try {
      var raw = sessionStorage.getItem(HOURLY_COUNT_KEY);
      if (!raw) return { count: 0, windowStart: Date.now() };
      var data = JSON.parse(raw);
      if (Date.now() - data.windowStart > 3600000) {
        return { count: 0, windowStart: Date.now() };
      }
      return data;
    } catch (e) {
      return { count: 0, windowStart: Date.now() };
    }
  }

  function recordSubmit() {
    try {
      sessionStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      var hourly = getHourlyCount();
      hourly.count += 1;
      sessionStorage.setItem(HOURLY_COUNT_KEY, JSON.stringify(hourly));
    } catch (e) { /* private mode */ }
  }

  function checkRateLimit() {
    try {
      var last = parseInt(sessionStorage.getItem(RATE_LIMIT_KEY) || '0', 10);
      if (last && Date.now() - last < RATE_LIMIT_MS) {
        return 'Please wait a minute before sending another message.';
      }
      var hourly = getHourlyCount();
      if (hourly.count >= MAX_PER_HOUR) {
        return 'Too many messages sent recently. Please try again later.';
      }
    } catch (e) { /* allow if storage blocked */ }
    return null;
  }

  function checkHoneypot(form) {
    var gotcha = form.querySelector('[name="_gotcha"]');
    if (gotcha && trim(gotcha.value) !== '') {
      return false;
    }
    var trap = form.querySelector('[name="website"]');
    if (trap && trim(trap.value) !== '') {
      return false;
    }
    return true;
  }

  function checkTiming(form) {
    var loaded = form.querySelector('[name="form_loaded_at"]');
    if (!loaded || !loaded.value) return false;
    var loadedAt = parseInt(loaded.value, 10);
    if (!loadedAt || Date.now() - loadedAt < MIN_SUBMIT_MS) {
      return false;
    }
    return true;
  }

  function setFieldError(form, fieldName, message) {
    var span = form.querySelector('[data-fs-error="' + fieldName + '"]');
    if (span) span.textContent = message;
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('[data-fs-error]').forEach(function (span) {
      if (span.getAttribute('data-fs-error')) {
        span.textContent = '';
      }
    });
    form.querySelectorAll('[data-fs-field]').forEach(function (field) {
      field.setAttribute('aria-invalid', 'false');
    });
  }

  function showFormError(form, message) {
    var banner = form.closest('.tgk-contact-form-card');
    if (!banner) return;
    var el = banner.querySelector('.tgk-formspree-error[data-fs-error]');
    if (el) {
      var text = el.querySelector('span');
      if (text) text.textContent = message;
      el.hidden = false;
    }
  }

  function hideFormError(form) {
    var banner = form.closest('.tgk-contact-form-card');
    if (!banner) return;
    var el = banner.querySelector('.tgk-formspree-error[data-fs-error]');
    if (el) el.hidden = true;
  }

  function validateContactForm(form) {
    clearFieldErrors(form);
    hideFormError(form);

    if (!checkHoneypot(form)) {
      return { ok: false, silent: true };
    }

    if (!checkTiming(form)) {
      showFormError(form, 'Please take a moment to complete the form before sending.');
      return { ok: false };
    }

    var rateMsg = checkRateLimit();
    if (rateMsg) {
      showFormError(form, rateMsg);
      return { ok: false };
    }

    var nameEl = form.querySelector('[name="name"]');
    var emailEl = form.querySelector('[name="email"]');
    var subjectEl = form.querySelector('[name="_subject"]');
    var messageEl = form.querySelector('[name="message"]');
    var name = stripControlChars(trim(nameEl && nameEl.value));
    var email = stripControlChars(trim(emailEl && emailEl.value)).toLowerCase();
    var subject = stripControlChars(trim(subjectEl && subjectEl.value));
    var message = stripControlChars(trim(messageEl && messageEl.value));

    var errors = {};

    if (!isValidName(name)) {
      errors.name = 'Enter your name (2â€“100 letters).';
    }
    if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address.';
    }
    if (subject.length < LIMITS.subject.min || subject.length > LIMITS.subject.max) {
      errors._subject = 'Subject must be between 2 and 200 characters.';
    }
    if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
      errors.message = 'Message must be between 10 and 5,000 characters.';
    }

    [name, email, subject, message].forEach(function (val, i) {
      if (val && hasSuspiciousContent(val)) {
        var keys = ['name', 'email', '_subject', 'message'];
        errors[keys[i]] = 'Invalid characters detected. Please revise your entry.';
      }
    });

    Object.keys(errors).forEach(function (key) {
      setFieldError(form, key, errors[key]);
    });

    if (Object.keys(errors).length) {
      return { ok: false };
    }

    var nameInput = form.querySelector('[name="name"]');
    var emailInput = form.querySelector('[name="email"]');
    var subjectInput = form.querySelector('[name="_subject"]');
    var messageInput = form.querySelector('[name="message"]');
    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (subjectInput) subjectInput.value = subject;
    if (messageInput) messageInput.value = message;

    return { ok: true };
  }

  function initLoadedTimestamp(form) {
    var loaded = form.querySelector('[name="form_loaded_at"]');
    if (loaded) loaded.value = String(Date.now());
  }

  function bindGuards(form) {
    if (!form || form.dataset.tgkGuardsBound === '1') return;
    form.dataset.tgkGuardsBound = '1';
    initLoadedTimestamp(form);

    form.addEventListener(
      'submit',
      function (e) {
        var result = validateContactForm(form);
        if (!result.ok) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      },
      true
    );
  }

  function setFormLoading(form, isLoading) {
    if (window.TGK_LOADER && window.TGK_LOADER.setFormLoading) {
      window.TGK_LOADER.setFormLoading(form, isLoading);
    }
  }

  window.TGK_CONTACT = {
    validateContactForm: validateContactForm,
    recordSubmit: recordSubmit,
    bindGuards: bindGuards,
    setFormLoading: setFormLoading,
  };
})();

/* --- deferred third-party (formspree, analytics, chat) --- */
(function initTgkDeferredThirdParty(){
  "use strict";
  var loaded=false;
  function loadScript(src,opts){
    return new Promise(function(resolve,reject){
      var s=document.createElement("script");
      s.src=src;
      if(opts&&opts.async)s.async=true;
      if(opts&&opts.defer)s.defer=true;
      s.onload=function(){resolve(s);};
      s.onerror=reject;
      document.head.appendChild(s);
    });
  }
  function initFormspree(){
    window.formspree=window.formspree||function(){(formspree.q=formspree.q||[]).push(arguments);};
    formspree("initForm",{
      formElement:"#tgk-contact-form",
      formId:"xaqknboz",
      onInit:function(ctx){if(window.TGK_CONTACT)window.TGK_CONTACT.bindGuards(ctx.form);},
      onSubmit:function(ctx){
        if(!window.TGK_CONTACT)return;
        var result=window.TGK_CONTACT.validateContactForm(ctx.form);
        if(result.ok)window.TGK_CONTACT.setFormLoading(ctx.form,true);
      },
      onSuccess:function(ctx){
        if(window.TGK_CONTACT){
          window.TGK_CONTACT.setFormLoading(ctx.form,false);
          window.TGK_CONTACT.recordSubmit();
        }
      },
      onError:function(ctx){if(window.TGK_CONTACT)window.TGK_CONTACT.setFormLoading(ctx.form,false);},
      onFailure:function(ctx){if(window.TGK_CONTACT)window.TGK_CONTACT.setFormLoading(ctx.form,false);}
    });
  }
  function initGtag(){
    window.dataLayer=window.dataLayer||[];
    function gtag(){dataLayer.push(arguments);}
    window.gtag=gtag;
    gtag("js",new Date());
    gtag("config","G-V6229JLDXD");
  }
  function initBrevo(){
    window.BrevoConversationsID="68d578416ba9efa18304da65";
    window.BrevoConversations=window.BrevoConversations||function(){(BrevoConversations.q=BrevoConversations.q||[]).push(arguments);};
    loadScript("https://conversations-widget.brevo.com/brevo-conversations.js",{async:true});
  }
  function load(){
    if(loaded)return;
    loaded=true;
    loadScript("https://unpkg.com/@formspree/ajax@1",{defer:true})
      .then(initFormspree)
      .catch(function(){});
    loadScript("https://www.googletagmanager.com/gtag/js?id=G-V6229JLDXD",{async:true})
      .then(initGtag)
      .catch(function(){});
    initBrevo();
  }
  var contact=document.getElementById("contact");
  if(contact&&"IntersectionObserver"in window){
    var io=new IntersectionObserver(function(entries){
      if(entries.some(function(e){return e.isIntersecting;})){
        load();
        io.disconnect();
      }
    },{rootMargin:"200px"});
    io.observe(contact);
  }
  var form=document.getElementById("tgk-contact-form");
  if(form)form.addEventListener("focusin",load,{once:true,capture:true});
  if("requestIdleCallback"in window){requestIdleCallback(load,{timeout:5000});}
  else{window.addEventListener("load",function(){setTimeout(load,3000);});}
})();
