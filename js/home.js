(function () {
  var body = document.body;
  var hero = document.querySelector('.signal-hero');
  var motionButton = document.querySelector('.signal-motion-toggle');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pointerFrame = 0;

  if (hero && !reducedMotion.matches) {
    hero.addEventListener('pointermove', function (event) {
      if (body.classList.contains('motion-paused') || event.pointerType === 'touch') return;
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(function () {
        var bounds = hero.getBoundingClientRect();
        hero.style.setProperty('--hero-x', ((event.clientX - bounds.left) / bounds.width - 0.5) * -14 + 'px');
        hero.style.setProperty('--hero-y', ((event.clientY - bounds.top) / bounds.height - 0.5) * -10 + 'px');
      });
    });
    hero.addEventListener('pointerleave', function () {
      hero.style.setProperty('--hero-x', '0px');
      hero.style.setProperty('--hero-y', '0px');
    });
  }

  if (motionButton) {
    motionButton.addEventListener('click', function () {
      var paused = body.classList.toggle('motion-paused');
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.innerHTML = paused ? '播放动画 <span aria-hidden="true">▶</span>' : '暂停动画 <span aria-hidden="true">Ⅱ</span>';
      if (paused && hero) {
        hero.style.setProperty('--hero-x', '0px');
        hero.style.setProperty('--hero-y', '0px');
      }
    });
  }

  var revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    body.classList.add('has-reveal');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }
})();
