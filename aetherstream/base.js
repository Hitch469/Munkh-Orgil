
(function(){


  const CATALOGUE = [
    {id:1,title:"Neon Ronin",genre:"scifi",rating:9.2,eps:24,badge:"NEW EP",c:["#00e5ff","#7a5cff","#ff4fd8"]},
    {id:2,title:"Ashfall Chronicles",genre:"action",rating:8.8,eps:12,badge:"SUB",c:["#ff5a36","#ff9a3d","#ffce54"]},
    {id:3,title:"Petals in the Wind",genre:"romance",rating:9.0,eps:12,badge:"DUB",c:["#ff9ecb","#ffc9e0","#fff0f5"]},
    {id:4,title:"Hollow Requiem",genre:"horror",rating:8.5,eps:13,badge:"18+",c:["#8b0f2c","#2b0a12","#4a0d1f"]},
    {id:5,title:"Voidwalker Saga",genre:"fantasy",rating:9.4,eps:24,badge:"TRENDING",c:["#6b3cff","#3c7dff","#00d4ff"]},
    {id:6,title:"Circuit Heart",genre:"scifi",rating:8.7,eps:10,badge:"NEW EP",c:["#00e5ff","#b46bff","#ff5fae"]},
    {id:7,title:"Ember & Iron",genre:"action",rating:8.9,eps:26,badge:"SUB",c:["#ff3d1c","#ff7a1c","#ffb703"]},
    {id:8,title:"Sakura Diaries",genre:"romance",rating:8.6,eps:12,badge:"NEW EP",c:["#ffb6d9","#ffd6e8","#fff5f9"]},
    {id:9,title:"Ghost Static",genre:"horror",rating:8.3,eps:8,badge:"DUB",c:["#a30f2b","#1c0509","#5c0f22"]},
    {id:10,title:"The Last Ember",genre:"fantasy",rating:9.1,eps:22,badge:"TRENDING",c:["#7a3cff","#4f7cff","#4fd8ff"]},
    {id:11,title:"Skyline Drifters",genre:"action",rating:8.4,eps:24,badge:"SUB",c:["#ff5a36","#ffce54","#ff9a3d"]},
    {id:12,title:"Glass Garden",genre:"romance",rating:8.9,eps:12,badge:"NEW EP",c:["#ffc9e0","#ffe4ee","#fff8fb"]},
    {id:13,title:"Static Hunters",genre:"scifi",rating:8.5,eps:24,badge:"DUB",c:["#4fd8ff","#7a5cff","#ff5fae"]},
    {id:14,title:"Wraithlight", genre:"horror",rating:8.1,eps:13,badge:"18+",c:["#7a0f2b","#22060c","#40101f"]},
    {id:15,title:"Moonpetal Requiem",genre:"fantasy",rating:9.3,eps:24,badge:"TRENDING",c:["#5c3cff","#3d8bff","#4fd8ff"]},
    {id:16,title:"Iron Bloom",genre:"action",rating:8.6,eps:12,badge:"NEW EP",c:["#ff6a3d","#ffb703","#ff3d1c"]},
    {id:17,title:"Paper Cranes",genre:"romance",rating:8.8,eps:12,badge:"SUB",c:["#ffb6d9","#ffe0ec","#fff"]},
    {id:18,title:"Nightcode",genre:"scifi",rating:9.0,eps:24,badge:"NEW EP",c:["#00e5ff","#8b5cff","#ff5fae"]},
    {id:19,title:"The Quiet Rot",genre:"horror",rating:7.9,eps:10,badge:"DUB",c:["#8b0f2c","#20060b","#4a0d1f"]},
    {id:20,title:"Aetherfall Islands",genre:"fantasy",rating:9.2,eps:24,badge:"TRENDING",c:["#6b3cff","#4fd8ff","#b46bff"]}
  ];
  window.AETHER_DATA = CATALOGUE;

  const state = {
    watchlist:new Set(),
    continueWatching:[
      {id:1,progress:64},{id:5,progress:32},{id:11,progress:88}
    ],
    loggedIn:false
  };
  window.AETHER_STATE = state;

  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if(loader){
      setTimeout(() => loader.classList.add('hidden'), 900);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[data-transition]').forEach(link => {
      link.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if(!href || href.startsWith('#')) return;
        e.preventDefault();
        const veil = document.getElementById('veil');
        veil.classList.add('leaving');
        setTimeout(() => { window.location.href = href; }, 480);
      });
    });
  });

  const nav = document.querySelector('header.nav');
  if(nav){
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, {passive:true});
  }

  const glow = document.getElementById('cursor-glow');
  if(glow){
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  }

  function attachTilt(el){
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left)/r.width - 0.5;
      const py = (e.clientY - r.top)/r.height - 0.5;
      el.style.transform = `rotateY(${px*14}deg) rotateX(${-py*14}deg) translateY(-6px) scale(1.03)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  }
  document.querySelectorAll('.anime-card, .cat-tile').forEach(attachTilt);

  document.querySelectorAll('.carousel-wrap').forEach(wrap => {
    const track = wrap.querySelector('.carousel');
    const prev = wrap.querySelector('.prev');
    const next = wrap.querySelector('.next');
    const scrollAmt = () => track.clientWidth * 0.8;
    if(prev) prev.addEventListener('click', () => track.scrollBy({left:-scrollAmt(), behavior:'smooth'}));
    if(next) next.addEventListener('click', () => track.scrollBy({left:scrollAmt(), behavior:'smooth'}));
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('.fav-btn');
    if(!btn) return;
    e.stopPropagation();
    const id = btn.getAttribute('data-id');
    btn.classList.toggle('active');
    if(state.watchlist.has(id)) state.watchlist.delete(id); else state.watchlist.add(id);
    showToast(btn.classList.contains('active') ? 'Added to your watchlist' : 'Removed from your watchlist');
  });

  let toastTimer;
  window.showToast = function(msg){
    let toast = document.getElementById('toast');
    if(!toast){
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast glass';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  const searchInput = document.querySelector('.search-box input');
  const suggestBox = document.querySelector('.suggestions');
  if(searchInput && suggestBox){
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if(!q){ suggestBox.classList.remove('open'); suggestBox.innerHTML=''; return; }
      const results = CATALOGUE.filter(a => a.title.toLowerCase().includes(q)).slice(0,6);
      if(!results.length){
        suggestBox.innerHTML = `<div class="suggestion-item"><div class="suggestion-title" style="color:var(--ink-faint)">No matches for "${escapeHtml(searchInput.value)}"</div></div>`;
      } else {
        suggestBox.innerHTML = results.map(r => `
          <div class="suggestion-item" data-id="${r.id}">
            <div class="suggestion-thumb" style="background:linear-gradient(135deg, ${r.c[0]}, ${r.c[2]})"></div>
            <div>
              <div class="suggestion-title">${escapeHtml(r.title)}</div>
              <div class="suggestion-meta">${r.genre.toUpperCase()} · ${r.eps} EPS · ★ ${r.rating}</div>
            </div>
          </div>`).join('');
      }
      suggestBox.classList.add('open');
    });
    document.addEventListener('click', e => {
      if(!searchInput.contains(e.target) && !suggestBox.contains(e.target)){
        suggestBox.classList.remove('open');
      }
    });
    suggestBox.addEventListener('click', e => {
      const item = e.target.closest('.suggestion-item');
      if(item && item.dataset.id){
        showToast('Opening title…');
        suggestBox.classList.remove('open');
      }
    });
  }
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  const bannerSlides = document.querySelectorAll('.banner-slide');
  const bannerDots = document.querySelectorAll('.banner-dots button');
  if(bannerSlides.length){
    let bi = 0;
    function showBanner(i){
      bannerSlides.forEach((s,idx) => s.classList.toggle('active', idx===i));
      bannerDots.forEach((d,idx) => d.classList.toggle('active', idx===i));
      bi = i;
    }
    bannerDots.forEach((d,idx) => d.addEventListener('click', () => showBanner(idx)));
    setInterval(() => showBanner((bi+1) % bannerSlides.length), 5000);
  }

  const loginBtn = document.getElementById('login-trigger');
  const loginModal = document.getElementById('login-modal');
  if(loginBtn && loginModal){
    loginBtn.addEventListener('click', () => loginModal.classList.add('open'));
    loginModal.addEventListener('click', e => { if(e.target === loginModal) loginModal.classList.remove('open'); });
    loginModal.querySelector('.modal-close')?.addEventListener('click', () => loginModal.classList.remove('open'));
    loginModal.querySelector('form')?.addEventListener('submit', e => {
      e.preventDefault();
      state.loggedIn = true;
      loginModal.classList.remove('open');
      document.getElementById('login-trigger')?.classList.add('hidden-el');
      document.getElementById('profile-trigger')?.classList.remove('hidden-el');
      showToast('Welcome back, Hunter');
    });
  }

  const profileBtn = document.getElementById('profile-trigger');
  const drawer = document.getElementById('profile-drawer');
  if(profileBtn && drawer){
    profileBtn.addEventListener('click', () => {
      renderDrawer('watchlist');
      drawer.classList.add('open');
    });
    drawer.addEventListener('click', e => { if(e.target === drawer) drawer.classList.remove('open'); });
    drawer.querySelector('.modal-close')?.addEventListener('click', () => drawer.classList.remove('open'));
    drawer.querySelectorAll('.drawer-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        drawer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderDrawer(tab.dataset.tab);
      });
    });
  }
  function renderDrawer(tab){
    const list = document.getElementById('drawer-list');
    if(!list) return;
    if(tab === 'watchlist'){
      const items = CATALOGUE.filter(a => state.watchlist.has(String(a.id)));
      list.innerHTML = items.length ? items.map(drawerRow).join('') : `<div class="drawer-empty">Nothing saved yet. Tap the heart on any title to add it here.</div>`;
    } else if(tab === 'continue'){
      const items = state.continueWatching.map(cw => ({...CATALOGUE.find(a=>a.id===cw.id), progress:cw.progress}));
      list.innerHTML = items.length ? items.map(a => drawerRow(a, a.progress)).join('') : `<div class="drawer-empty">You haven't started anything yet.</div>`;
    } else if(tab === 'recs'){
      const shuffled = [...CATALOGUE].sort(() => Math.random()-0.5).slice(0,5);
      list.innerHTML = shuffled.map(drawerRow).join('');
    }
  }
  function drawerRow(a, progress){
    return `<div class="drawer-item">
      <div class="drawer-thumb" style="background:linear-gradient(135deg, ${a.c[0]}, ${a.c[2]})"></div>
      <div class="drawer-info">
        <div class="t">${a.title}</div>
        <div class="m">${a.genre.toUpperCase()} · ★ ${a.rating}${progress ? ' · ' + progress + '% watched' : ''}</div>
      </div>
    </div>`;
  }

  document.querySelector('.newsletter-form')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast('You\'re on the list.');
    e.target.reset();
  });

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      window.dispatchEvent(new CustomEvent('filterchange', {detail:chip.dataset.filter}));
    });
  });

  const sentinel = document.querySelector('.sentinel');
  const grid = document.querySelector('.grid-cards[data-infinite]');
  if(sentinel && grid && window.renderCard){
    let page = 1;
    const io = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && page < 4){
        page++;
        const pool = window.AETHER_POOL || CATALOGUE;
        const batch = [...pool].sort(() => Math.random()-0.5).slice(0,6);
        batch.forEach(a => grid.insertAdjacentHTML('beforeend', window.renderCard(a)));
        document.querySelectorAll('.anime-card').forEach(attachTilt);
      }
      if(page >= 4){ sentinel.textContent=''; io.disconnect(); }
    }, {rootMargin:'400px'});
    io.observe(sentinel);
  }

  const canvas = document.getElementById('fx-canvas');
  if(canvas){
    const ctx = canvas.getContext('2d');
    let w,h,particles;
    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function getAccentColors(){
      const styles = getComputedStyle(document.body);
      return [styles.getPropertyValue('--blue').trim() || '#4fd8ff',
              styles.getPropertyValue('--purple').trim() || '#b46bff',
              styles.getPropertyValue('--pink').trim() || '#ff5fae'];
    }
    function initParticles(){
      const colors = getAccentColors();
      const count = window.AETHER_PARTICLE_COUNT || 70;
      particles = Array.from({length:count}, () => ({
        x:Math.random()*w, y:Math.random()*h,
        r:Math.random()*1.8+0.4,
        vy:-(Math.random()*0.35+0.06),
        vx:(Math.random()-0.5)*0.15,
        c:colors[Math.floor(Math.random()*colors.length)],
        a:Math.random()*0.6+0.15
      }));
    }
    function tick(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10){ p.y = h+10; p.x = Math.random()*w; }
        if(p.x < -10) p.x = w+10;
        if(p.x > w+10) p.x = -10;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    resize(); initParticles(); tick();
    window.addEventListener('resize', () => { resize(); initParticles(); });
  }

  const stage = document.querySelector('.hero-stage');
  if(stage){
    window.addEventListener('mousemove', e => {
      const px = (e.clientX/window.innerWidth - 0.5);
      const py = (e.clientY/window.innerHeight - 0.5);
      stage.style.transform = `rotateY(${px*8}deg) rotateX(${-py*8}deg)`;
    });
  }

  const heroEl = document.querySelector('.hero');
  if(heroEl){
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if(y < window.innerHeight){
        heroEl.style.transform = `translateY(${y*0.18}px)`;
        heroEl.style.opacity = Math.max(1 - y/700, 0);
      }
    }, {passive:true});
  }

})();
