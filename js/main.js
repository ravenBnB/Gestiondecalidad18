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

  /* ===== MODAL ===== */
  const overlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');

  function openModal(sourceId) {
    const source = document.getElementById(sourceId);
    if (!source || !overlay || !modalBody) return;
    modalBody.innerHTML = source.innerHTML;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { if (modalBody) modalBody.innerHTML = ''; }, 300);
  }

  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el.dataset.modal);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* ===== SOPA DE LETRAS ===== */
  const sopaGrid = document.getElementById('sopaGrid');
  if (sopaGrid) {
    const gridRows = [
      "LIDERAZGOABC", "DEFGHIJKLMNO", "MEJORAPQRSTU", "VWXYZABCDEFG",
      "CLIENTEHIJKL", "MNOPQRSTUVWX", "PROCESOSYZAB", "CDEFGHIJKLMN",
      "HECHOSOPQRST", "UVWXYZABCDEF", "PERSONALGHIJ", "RELACIONESKL"
    ];

    const wordPositions = {
      liderazgo:  [0,1,2,3,4,5,6,7,8],
      mejora:     [24,25,26,27,28,29],
      cliente:    [48,49,50,51,52,53,54],
      procesos:   [72,73,74,75,76,77,78,79],
      hechos:     [96,97,98,99,100,101],
      personal:   [120,121,122,123,124,125,126,127],
      relaciones: [132,133,134,135,136,137,138,139,140,141]
    };

    let cellIndex = 0;
    gridRows.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'sopa-cell';
        cell.textContent = row[i];
        cell.dataset.index = cellIndex;
        sopaGrid.appendChild(cell);
        cellIndex++;
      }
    });

    const wordButtons = document.querySelectorAll('.sopa-word');
    wordButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const word = btn.dataset.word;
        const isActive = btn.classList.contains('active');
        document.querySelectorAll('.sopa-cell.highlight').forEach(c => c.classList.remove('highlight'));
        wordButtons.forEach(b => b.classList.remove('active'));
        if (!isActive && wordPositions[word]) {
          btn.classList.add('active');
          wordPositions[word].forEach(idx => {
            const cell = sopaGrid.children[idx];
            if (cell) cell.classList.add('highlight');
          });
        }
      });
    });
  }

  /* ===== DATA-FILL ===== */
  document.querySelectorAll('[data-fill]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const source = document.getElementById(el.dataset.fill);
      if (!source || !overlay || !modalBody) return;
      modalBody.innerHTML = source.innerHTML;
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });
});
