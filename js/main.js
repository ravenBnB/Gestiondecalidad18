document.addEventListener('DOMContentLoaded', () => {

  /* Barra de progreso */
  const progress = document.getElementById('scrollProgress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (scrollTop / docHeight) * 100 + '%';
  });

  /* Animaciones scroll */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));

  /* Partículas */
  const particlesBox = document.getElementById('particles');
  if (particlesBox) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = Math.random() * 3 + 1;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = '-' + (Math.random() * 20) + 'px';
      p.style.animationDuration = (Math.random() * 20 + 25) + 's';
      p.style.animationDelay = (Math.random() * 20) + 's';
      p.style.opacity = (Math.random() * 0.5 + 0.3).toFixed(2);
      particlesBox.appendChild(p);
    }
  }

  /* Contador animado */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    function step(now) {
      const prog = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(prog * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat .num').forEach(el => statObserver.observe(el));

  /* Botón volver arriba */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== PESTAÑAS ===== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabButtons.length && tabPanels.length) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
          targetPanel.querySelectorAll('.reveal, .reveal-left, .reveal-right')
            .forEach(el => el.classList.add('visible'));
        }
      });
    });
  }

  /* ===== SUB-PESTAÑAS ===== */
  const subtabButtons = document.querySelectorAll('.subtab-btn');
  const subtabPanels = document.querySelectorAll('.subtab-panel');

  if (subtabButtons.length && subtabPanels.length) {
    subtabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.subtab;
        subtabButtons.forEach(b => b.classList.remove('active'));
        subtabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

   /* ============================================================
     MODAL CON HISTORIAL (permite navegación anidada)
     ============================================================ */
  const overlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  let modalHistory = [];

  function renderModal(sourceId) {
    if (!modalBody) return;
    const source = document.getElementById(sourceId);
    if (!source) return;

    modalBody.innerHTML = '';

    // Botón volver (solo si hay historial previo)
    if (modalHistory.length > 1) {
      const backBtn = document.createElement('button');
      backBtn.className = 'modal-back';
      backBtn.type = 'button';
      backBtn.innerHTML = '← Volver';
      backBtn.addEventListener('click', goBackModal);
      modalBody.appendChild(backBtn);
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = source.innerHTML;
    modalBody.appendChild(wrapper);
  }

  function openModal(sourceId) {
    const source = document.getElementById(sourceId);
    if (!source || !overlay || !modalBody) return;
    modalHistory.push(sourceId);
    renderModal(sourceId);
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function goBackModal() {
    if (modalHistory.length > 1) {
      modalHistory.pop();
      renderModal(modalHistory[modalHistory.length - 1]);
      modalBody.scrollTop = 0;
    }
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalHistory = [];
    setTimeout(() => { if (modalBody) modalBody.innerHTML = ''; }, 300);
  }

  // Delegación global: maneja clicks en [data-modal] y [data-fill]
  // incluso cuando el contenido es dinámico (dentro de modales)
  document.addEventListener('click', (e) => {
    const modalTarget = e.target.closest('[data-modal]');
    const fillTarget = e.target.closest('[data-fill]');

    if (modalTarget) {
      e.preventDefault();
      const isOpen = overlay && overlay.classList.contains('open');
      if (isOpen) {
        // Click anidado: agregar al historial
        modalHistory.push(modalTarget.dataset.modal);
        renderModal(modalTarget.dataset.modal);
        modalBody.scrollTop = 0;
      } else {
        modalHistory = [];
        openModal(modalTarget.dataset.modal);
      }
    } else if (fillTarget) {
      e.preventDefault();
      const isOpen = overlay && overlay.classList.contains('open');
      if (isOpen) {
        modalHistory.push(fillTarget.dataset.fill);
        renderModal(fillTarget.dataset.fill);
        modalBody.scrollTop = 0;
      } else {
        modalHistory = [];
        openModal(fillTarget.dataset.fill);
      }
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      if (modalHistory.length > 1) {
        goBackModal();
      } else {
        closeModal();
      }
    }
  });
});
// ===== MODALES DE LAS SUPER INFOGRAFÍAS =====
(function initSuperModals() {
  const overlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  
  if (!overlay || !modalBody) return;

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-modal');
      const source = document.getElementById(id);
      if (!source) return;
      
      modalBody.innerHTML = source.innerHTML;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();

// ===== ANIMACIÓN DE BARRA DE PROGRESO =====
(function initFlowBar() {
  const bar = document.getElementById('flowBar');
  const marks = document.querySelectorAll('.fp-mark');
  if (!bar) return;
  
  let progress = 0;
  let phase = 1;
  
  // Anima la barra al entrar en vista
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bar.style.width = '100%';
        marks.forEach(m => m.classList.add('active'));
      }
    });
  }, { threshold: 0.3 });
  
  const container = bar.closest('.flow-progress');
  if (container) observer.observe(container);
})();
