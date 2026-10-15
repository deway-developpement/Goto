// Original vertical photo carousel, without a slider library.
const carousel = document.querySelector('.carousel');
const viewport = carousel.querySelector('.carousel-viewport');
const slides = [...carousel.querySelectorAll('.slide')];
const dots = [...carousel.querySelectorAll('[data-slide]')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let index = 0;
let playing = !reducedMotion.matches;
let hovering = false;
let timer;
function showSlide(next) {
  index = (next + slides.length) % slides.length;
  carousel.dataset.active = index;
  slides.forEach((slide, n) => slide.setAttribute('aria-hidden', String(n !== index)));
  dots.forEach((dot, n) => n === index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current'));
}
function schedule() {
  clearInterval(timer);
  if (playing && !hovering && !document.hidden && !carousel.contains(document.activeElement)) {
    timer = setInterval(() => showSlide(index + 1), 3000);
  }
}
carousel.querySelector('.carousel-controls').hidden = false;
dots.forEach(dot => dot.addEventListener('click', () => {
  showSlide(Number(dot.dataset.slide));
  schedule();
}));
carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
carousel.addEventListener('focusin', schedule);
carousel.addEventListener('focusout', () => setTimeout(schedule, 0));
document.addEventListener('visibilitychange', schedule);
reducedMotion.addEventListener('change', () => { playing = !reducedMotion.matches; schedule(); });
viewport.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showSlide(index + (event.key === 'ArrowRight' ? 1 : -1));
});
let touchStart;
viewport.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
viewport.addEventListener('touchend', event => {
  if (touchStart === undefined) return;
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 45) showSlide(index + (distance < 0 ? 1 : -1));
  touchStart = undefined;
}, { passive: true });
schedule();
// Original before/after landscape comparison. Native range supports touch and keyboard.
const range = document.querySelector('#comparison-range');
const comparison = range.closest('.comparison');
range.hidden = false;
range.addEventListener('input', () => {
  comparison.style.setProperty('--split', `${range.value}%`);
  range.setAttribute('aria-valuetext', `${range.value} percent route overlay`);
});

// App journey: a pinned desktop scene, or a vertical story on compact viewports.
const appSection = document.querySelector('#app');
const appStage = appSection.querySelector('.app-scroll-stage');
const appPanels = appSection.querySelector('.app-panels');
const appTabs = [...appSection.querySelectorAll('[role="tab"]')];
const appStops = appTabs.map(tab => tab.closest('.journey-stop'));
const compactJourney = matchMedia('(max-width: 960px), (max-height: 649px)');
let selectedApp = 0;
let manualScrollY = null;
let appFrame = 0;
let leavingScreen;
function selectAppTab(tab, animate = true) {
  const next = appTabs.indexOf(tab);
  if (next === selectedApp) return;
  const positions = appStops.map(stop => stop.getBoundingClientRect().top);
  const previous = document.getElementById(appTabs[selectedApp].getAttribute('aria-controls'));
  leavingScreen?.remove();
  if (animate && !reducedMotion.matches) {
    leavingScreen = previous.querySelector('.app-visual').cloneNode(true);
    leavingScreen.classList.add('app-transition');
    leavingScreen.setAttribute('aria-hidden', 'true');
    appPanels.append(leavingScreen);
    const old = leavingScreen;
    old.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-14px) scale(.985)'}],
      {duration:460,easing:'cubic-bezier(.22,.68,.2,1)',fill:'forwards'}).finished.then(() => old.remove()).catch(() => old.remove());
  }
  selectedApp = next;
  appTabs.forEach((button, i) => {
    const selected = i === next;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    document.getElementById(button.getAttribute('aria-controls')).hidden = !selected;
    document.getElementById(`desc-${button.dataset.app}`).hidden = !selected && !compactJourney.matches;
    appStops[i].dataset.active = String(selected);
  });
  if (animate && !reducedMotion.matches) {
    const visual = document.getElementById(tab.getAttribute('aria-controls')).querySelector('.app-visual');
    visual.animate([{opacity:0,transform:'translateY(22px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)'}],
      {duration:680,easing:'cubic-bezier(.16,1,.3,1)'});
    if (!compactJourney.matches) {
      appStops.forEach((stop,i) => {
        const offset = positions[i] - stop.getBoundingClientRect().top;
        if (offset) stop.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
      });
      document.getElementById(`desc-${tab.dataset.app}`).animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'ease-out'});
    }
  }
}
function chooseApp(tab) {
  manualScrollY = scrollY;
  selectAppTab(tab);
  if (compactJourney.matches) {
    const stop = tab.closest('.journey-stop');
    const offset = reducedMotion.matches ? 24 : appPanels.getBoundingClientRect().height + 38;
    scrollTo({top:scrollY + stop.getBoundingClientRect().top - offset,behavior:reducedMotion.matches?'instant':'smooth'});
  }
}
appTabs.forEach((tab,index) => {
  tab.addEventListener('click', () => chooseApp(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index+1)%appTabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index+appTabs.length-1)%appTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = appTabs.length-1;
    else return;
    event.preventDefault();
    chooseApp(appTabs[next]);
    appTabs[next].focus({preventScroll:true});
  });
});
function updateAppScroll() {
  appFrame = 0;
  const bounds = appSection.getBoundingClientRect();
  if (bounds.bottom < 0 || bounds.top > innerHeight || reducedMotion.matches) return;
  if (manualScrollY !== null) {
    if (Math.abs(scrollY-manualScrollY)<80) return;
    manualScrollY = null;
  }
  let next = 0;
  if (compactJourney.matches) {
    const line = appPanels.getBoundingClientRect().bottom + Math.min(140,innerHeight*.16);
    appStops.forEach((stop,i) => { if (stop.getBoundingClientRect().top <= line) next=i; });
  } else if (!reducedMotion.matches) {
    const travel = appSection.offsetHeight - appStage.offsetHeight - 85;
    const progress = Math.max(0,Math.min(1,(24-bounds.top)/Math.max(1,travel)));
    next = Math.min(3,Math.floor(progress*4));
    appSection.style.setProperty('--journey-drift',`${(progress-.5)*32}px`);
  } else return;
  selectAppTab(appTabs[next]);
}
function requestAppFrame() {
  if (!appFrame) appFrame=requestAnimationFrame(updateAppScroll);
}
function configureAppScroll() {
  manualScrollY = null;
  leavingScreen?.remove();
  if (reducedMotion.matches) appSection.getAnimations({subtree:true}).forEach(animation => animation.cancel());
  appSection.classList.toggle('app-scroll-enabled',!compactJourney.matches && !reducedMotion.matches);
  appSection.classList.toggle('app-scroll-stacked',compactJourney.matches);
  appSection.style.removeProperty('--journey-drift');
  appTabs.forEach((tab,i) => {document.getElementById(`desc-${tab.dataset.app}`).hidden = !compactJourney.matches && i !== selectedApp;});
  requestAppFrame();
}
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) appSection.classList.add('app-arrived');
},{threshold:0}).observe(appSection);
addEventListener('scroll',requestAppFrame,{passive:true});
addEventListener('resize',requestAppFrame,{passive:true});
compactJourney.addEventListener('change',configureAppScroll);
reducedMotion.addEventListener('change',configureAppScroll);
configureAppScroll();
