
    (function() {
      'use strict';

      // ===== ELEMENTS =====
      const envelope = document.getElementById('envelope');
      const seal = document.getElementById('seal');
      const stage = document.getElementById('stage');
      const landing = document.getElementById('landing');
      const resetBtn = document.getElementById('resetBtn');
      const confettiCanvas = document.getElementById('confettiCanvas');
      const scratchCanvas = document.getElementById('scratchCanvas');
      const scratchHint = document.getElementById('scratchHint');
      const progressCircle = document.getElementById('progressCircle');
      const body = document.body;
      const bgMusic = document.getElementById('bgMusic');
      const musicToggle = document.getElementById('musicToggle');
     const openingVideoScreen = document.getElementById('openingVideoScreen');
      const openingVideo = document.getElementById('openingVideo');

        // ===== COUNTDOWN TIMER =====
      const targetDate = new Date('2026-10-14T10:30:00+05:30').getTime();
      const cdDays    = document.getElementById('cd-days');
      const cdHours   = document.getElementById('cd-hours');
      const cdMinutes = document.getElementById('cd-minutes');
      const cdSeconds = document.getElementById('cd-seconds');

            // ===== OPENING VIDEO =====
      function playOpeningVideo() {
        openingVideoScreen.classList.add('active');
        openingVideo.currentTime = 0;

        openingVideo.play().catch(() => {
          // Autoplay blocked (rare since this follows a user tap)
          openingVideo.controls = true;
        });

        openingVideo.onended = () => {
          openingVideoScreen.classList.remove('active');
          showLandingPage();
        };
      }

      function showLandingPage() {
        stage.classList.add('hidden');
        landing.classList.add('visible');
        body.classList.remove('no-scroll');
        body.style.overflowY = 'auto';

        createLandingButterflies();

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        createConfettiBurst(centerX, centerY);

        setTimeout(() => {
          createConfettiBurst(centerX - 150, centerY - 80);
          createConfettiBurst(centerX + 150, centerY - 80);
        }, 500);

        resetBtn.classList.add('show');
        musicToggle.classList.add('show');

        setTimeout(() => {
          initScratch();
        }, 800);
      }

      function pad(n) { return n < 10 ? '0' + n : '' + n; }

      function updateCountdown() {
        const now = Date.now();
        let diff = targetDate - now;

        if (diff <= 0) {
          cdDays.textContent    = '00';
          cdHours.textContent   = '00';
          cdMinutes.textContent = '00';
          cdSeconds.textContent = '00';
          return;
        }

        const days    = Math.floor(diff / 86400000);
        const hours   = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        cdDays.textContent    = pad(days);
        cdHours.textContent   = pad(hours);
        cdMinutes.textContent = pad(minutes);
        cdSeconds.textContent = pad(seconds);
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);


      let opened = false;
      let confettiActive = false;
      let confettiParticles = [];
      let animationFrameId = null;
      let isMobile = window.matchMedia('(max-width: 768px)').matches;
      let isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // ===== BUTTERFLY MANAGER =====
      const butterflyEmojis = ['🦋', '🦋', '🦋', '🦋', '🦋', '🦋', '🦋'];
      const butterflyColors = ['#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#e91e63', '#ff5722', '#00bcd4', '#8e44ad', '#16a085'];

      let stageButterflies = [];
      let landingButterflies = [];

      function createButterfly(container, options) {
        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';

        const emoji = butterflyEmojis[Math.floor(Math.random() * butterflyEmojis.length)];
        const color = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];

        butterfly.innerHTML = `<span style="color: ${color}; filter: hue-rotate(${Math.random() * 360}deg);">${emoji}</span>`;

        butterfly.style.left = (Math.random() * 90 + 5) + '%';
        butterfly.style.top = (options && options.startFromBottom)
          ? (Math.random() * 40 + 60) + '%'
          : (Math.random() * 80 + 10) + '%';

        const duration = 10 + Math.random() * 15;
        const delay = Math.random() * 8;

        butterfly.style.animationDuration = duration + 's';
        butterfly.style.animationDelay = delay + 's';

        if (options && options.randomizeStart) {
          butterfly.style.animationDelay = (-Math.random() * duration) + 's';
        }

        const size = 18 + Math.random() * 20;
        butterfly.style.fontSize = size + 'px';

        container.appendChild(butterfly);
        return butterfly;
      }

      function createStageButterflies() {
        const count = isMobile ? 10 : 16;
        stageButterflies = [];
        for (let i = 0; i < count; i++) {
          const b = createButterfly(document.body, { randomizeStart: true });
          stageButterflies.push(b);
        }
      }

      function createLandingButterflies() {
        landingButterflies.forEach(b => b.remove());
        landingButterflies = [];

        const count = isMobile ? 14 : 22;
        for (let i = 0; i < count; i++) {
          const b = createButterfly(document.body, {
            randomizeStart: false,
            startFromBottom: true
          });
          b.style.animationDelay = (i * 0.4 + Math.random() * 1.5) + 's';
          landingButterflies.push(b);
        }
      }

      createStageButterflies();

      // ===== FLOATING PARTICLES =====
      const particleContainer = document.getElementById('particles');
      const particleCount = isMobile ? 20 : 40;
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = 8 + Math.random() * 14 + 's';
        p.style.animationDelay = Math.random() * 10 + 's';
        p.style.width = 2 + Math.random() * 5 + 'px';
        p.style.height = p.style.width;
        particleContainer.appendChild(p);
      }

      // ===== ROSE PETALS (Dark Red) =====
      function createRosePetals() {
        const petalCount = isMobile ? 18 : 40;
        for (let i = 0; i < petalCount; i++) {
          const petal = document.createElement('div');
          petal.className = 'petal';

          petal.style.left = Math.random() * 100 + '%';
          petal.style.top = '-20px';

          petal.style.animationDuration = (8 + Math.random() * 12) + 's';
          petal.style.animationDelay = (Math.random() * 20) + 's';

          const size = 10 + Math.random() * 14;
          petal.style.width = size + 'px';
          petal.style.height = size + 'px';

          petal.style.transform = `rotate(${Math.random() * 360}deg)`;

          document.body.appendChild(petal);
        }
      }
      createRosePetals();

      // ===== CONFETTI =====
      const ctx = confettiCanvas.getContext('2d');
      let canvasW, canvasH;

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvasW = confettiCanvas.width = window.innerWidth * dpr;
        canvasH = confettiCanvas.height = window.innerHeight * dpr;
        confettiCanvas.style.width = window.innerWidth + 'px';
        confettiCanvas.style.height = window.innerHeight + 'px';
        ctx.scale(dpr, dpr);
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      const confettiColors = ['#d4af7a', '#e8c9a0', '#b8895e', '#f5e6ce', '#c9a87c', '#a0724a', '#f0d9b5', '#e0b88a', '#ffb6c1', '#e05a6d'];

      function createConfettiBurst(x, y) {
        const count = isMobile ? 40 : 70;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = Math.random() * (isMobile ? 10 : 14) + 4;
          confettiParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity - 5,
            size: Math.random() * 9 + 4,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 14,
            life: 1,
            decay: Math.random() * 0.012 + 0.007,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
          });
        }

        if (!confettiActive) {
          confettiActive = true;
          confettiCanvas.classList.add('active');
          animateConfetti();
        }
      }

      function animateConfetti() {
        ctx.clearRect(0, 0, canvasW, canvasH);

        for (let i = confettiParticles.length - 1; i >= 0; i--) {
          const p = confettiParticles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.18;
          p.vx *= 0.99;
          p.rotation += p.rotSpeed;
          p.life -= p.decay;

          if (p.life <= 0 || p.y > canvasH + 50) {
            confettiParticles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        if (confettiParticles.length > 0) {
          animationFrameId = requestAnimationFrame(animateConfetti);
        } else {
          confettiActive = false;
          confettiCanvas.classList.remove('active');
          ctx.clearRect(0, 0, canvasW, canvasH);
        }
      }

      // ===== SPARKLES =====
      function createSparkles() {
        const count = isMobile ? 25 : 45;
        for (let i = 0; i < count; i++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';

          const rect = envelope.getBoundingClientRect();
          sparkle.style.left = (rect.left + rect.width / 2) + 'px';
          sparkle.style.top = (rect.top + rect.height / 2) + 'px';

          sparkle.style.setProperty('--x', `${(Math.random() - .5) * (isMobile ? 400 : 600)}px`);
          sparkle.style.setProperty('--y', `${(Math.random() - .5) * (isMobile ? 350 : 500)}px`);

          sparkle.style.animationDelay = Math.random() * .35 + 's';
          sparkle.style.width = 3 + Math.random() * 6 + 'px';
          sparkle.style.height = sparkle.style.width;

          const sparkleColors = ['#fff', '#ffe9c4', '#ffd700', '#ffb6c1', '#fff0f5'];
          sparkle.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];

          document.body.appendChild(sparkle);

          setTimeout(() => {
            sparkle.remove();
          }, 1400);
        }
      }

      // ===== SCRATCH TO REVEAL =====
      let scratchInitialized = false;
      let scratchCtx = null;
      let isDrawing = false;
      let lastX = 0, lastY = 0;
      let scratchPercent = 0;
      let scratchRevealed = false;
      let canvasRect = null;

      function initScratch() {
        if (scratchInitialized) return;
        scratchInitialized = true;

        canvasRect = scratchCanvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        scratchCanvas.width = canvasRect.width * dpr;
        scratchCanvas.height = canvasRect.height * dpr;
        scratchCanvas.style.width = canvasRect.width + 'px';
        scratchCanvas.style.height = canvasRect.height + 'px';

        scratchCtx = scratchCanvas.getContext('2d');
        scratchCtx.scale(dpr, dpr);

        const gradient = scratchCtx.createLinearGradient(0, 0, canvasRect.width, canvasRect.height);
        gradient.addColorStop(0, '#d4b483');
        gradient.addColorStop(0.3, '#e8c9a0');
        gradient.addColorStop(0.5, '#c9a87c');
        gradient.addColorStop(0.7, '#b8895e');
        gradient.addColorStop(1, '#a0724a');

        scratchCtx.fillStyle = gradient;
        scratchCtx.fillRect(0, 0, canvasRect.width, canvasRect.height);

        for (let i = 0; i < 500; i++) {
          const x = Math.random() * canvasRect.width;
          const y = Math.random() * canvasRect.height;
          const r = Math.random() * 2 + 0.5;
          scratchCtx.beginPath();
          scratchCtx.arc(x, y, r, 0, Math.PI * 2);
          scratchCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
          scratchCtx.fill();
        }

        scratchCtx.save();
        scratchCtx.globalAlpha = 0.15;
        scratchCtx.strokeStyle = '#fff8ed';
        scratchCtx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          scratchCtx.beginPath();
          scratchCtx.moveTo(0, i * (canvasRect.height / 20));
          scratchCtx.lineTo(canvasRect.width, i * (canvasRect.height / 20));
          scratchCtx.stroke();
        }
        scratchCtx.restore();

        scratchCtx.globalCompositeOperation = 'destination-out';

        // Only attach listeners once
        if (!scratchCanvas.dataset.listenersAttached) {
          scratchCanvas.addEventListener('mousedown', startScratch);
          scratchCanvas.addEventListener('mousemove', scratch);
          scratchCanvas.addEventListener('mouseup', endScratch);
          scratchCanvas.addEventListener('mouseleave', endScratch);
          scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });
          scratchCanvas.addEventListener('touchmove', scratch, { passive: false });
          scratchCanvas.addEventListener('touchend', endScratch);
          window.addEventListener('resize', onScratchResize);
          scratchCanvas.dataset.listenersAttached = 'true';
        }
      }

      function onScratchResize() {
        if (scratchRevealed) return;
        canvasRect = scratchCanvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        scratchCanvas.width = canvasRect.width * dpr;
        scratchCanvas.height = canvasRect.height * dpr;
        scratchCanvas.style.width = canvasRect.width + 'px';
        scratchCanvas.style.height = canvasRect.height + 'px';

        scratchCtx = scratchCanvas.getContext('2d');
        scratchCtx.scale(dpr, dpr);

        const gradient = scratchCtx.createLinearGradient(0, 0, canvasRect.width, canvasRect.height);
        gradient.addColorStop(0, '#d4b483');
        gradient.addColorStop(0.3, '#e8c9a0');
        gradient.addColorStop(0.5, '#c9a87c');
        gradient.addColorStop(0.7, '#b8895e');
        gradient.addColorStop(1, '#a0724a');
        scratchCtx.fillStyle = gradient;
        scratchCtx.fillRect(0, 0, canvasRect.width, canvasRect.height);

        scratchCtx.globalCompositeOperation = 'destination-out';
      }

      function getPos(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        let x, y;
        if (e.touches && e.touches.length > 0) {
          x = e.touches[0].clientX - rect.left;
          y = e.touches[0].clientY - rect.top;
        } else {
          x = e.clientX - rect.left;
          y = e.clientY - rect.top;
        }
        return { x, y };
      }

      function startScratch(e) {
        e.preventDefault();
        isDrawing = true;
        const pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;

        scratchCtx.beginPath();
        scratchCtx.arc(pos.x, pos.y, 25, 0, Math.PI * 2);
        scratchCtx.fill();

        scratchHint.classList.add('hidden');
      }

      function scratch(e) {
        if (!isDrawing) return;
        e.preventDefault();

        const pos = getPos(e);

        scratchCtx.beginPath();
        scratchCtx.lineWidth = 50;
        scratchCtx.lineCap = 'round';
        scratchCtx.lineJoin = 'round';
        scratchCtx.moveTo(lastX, lastY);
        scratchCtx.lineTo(pos.x, pos.y);
        scratchCtx.stroke();

        lastX = pos.x;
        lastY = pos.y;

        updateScratchProgress();
      }

      function endScratch() {
        isDrawing = false;
      }

      function updateScratchProgress() {
        const imageData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
        const pixels = imageData.data;
        let transparent = 0;
        const total = pixels.length / 4;

        for (let i = 3; i < pixels.length; i += 16) {
          if (pixels[i] < 128) transparent++;
        }

        scratchPercent = (transparent / (total / 4)) * 100;

        const circumference = 2 * Math.PI * 16;
        const offset = circumference - (scratchPercent / 100) * circumference;
        progressCircle.style.strokeDashoffset = Math.max(0, offset);

        if (scratchPercent > 50 && !scratchRevealed) {
          scratchRevealed = true;
          revealFullDate();
        }
      }

      function revealFullDate() {
        scratchCanvas.style.transition = 'opacity 0.8s ease';
        scratchCanvas.style.opacity = '0';
        scratchHint.style.opacity = '0';

        // Reveal the hidden date content with staggered animation
        const scratchRevealEl = document.getElementById('scratchReveal');
        if (scratchRevealEl) {
          scratchRevealEl.classList.add('revealed');
        }

        setTimeout(() => {
          scratchCanvas.style.display = 'none';
        }, 800);

        const rect = scratchCanvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createConfettiBurst(centerX, centerY);

        setTimeout(() => {
          createConfettiBurst(centerX - 100, centerY - 50);
          createConfettiBurst(centerX + 100, centerY - 50);
        }, 300);
      }

            // ===== OPEN ENVELOPE =====
      function openEnvelope() {
        if (opened) return;
        opened = true;

        envelope.classList.add('open');
        createSparkles();

        setTimeout(() => {
          // Fade out stage butterflies
          stageButterflies.forEach(b => {
            b.style.transition = 'opacity 0.8s ease';
            b.style.opacity = '0';
          });

          // Play the opening video → when it ends, showLandingPage() runs
          playOpeningVideo();

        }, 1300);
      }
      // ===== RESET =====
      function resetAll() {
        opened = false;
        scratchRevealed = false;
        scratchInitialized = false;
        scratchPercent = 0;

        confettiParticles = [];
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        confettiActive = false;
        confettiCanvas.classList.remove('active');
        ctx.clearRect(0, 0, canvasW, canvasH);

        landingButterflies.forEach(b => b.remove());
        landingButterflies = [];

        stageButterflies.forEach(b => {
          b.style.transition = 'none';
          b.style.opacity = '';
          b.style.animation = 'none';
          void b.offsetWidth;
          b.style.animation = '';
        });

        envelope.classList.remove('open');
        stage.classList.remove('hidden');
        landing.classList.remove('visible');
        resetBtn.classList.remove('show');
        musicToggle.classList.remove('show');
        body.classList.add('no-scroll');
        body.style.overflowY = '';
        landing.scrollTop = 0;

        scratchCanvas.style.display = 'block';
        scratchCanvas.style.opacity = '1';
        scratchCanvas.style.transition = 'none';
        scratchHint.classList.remove('hidden');
        scratchHint.style.opacity = '1';
        progressCircle.style.strokeDashoffset = '100.5';

        // Reset the revealed date state
        const scratchRevealEl = document.getElementById('scratchReveal');
        if (scratchRevealEl) {
          scratchRevealEl.classList.remove('revealed');
        }

        if (!bgMusic.paused) {
          bgMusic.pause();
          musicToggle.classList.remove('playing');
        }

        void landing.offsetWidth;
      }

      // ===== MUSIC TOGGLE =====
      musicToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (bgMusic.paused) {
          bgMusic.play().catch(() => {});
          musicToggle.classList.add('playing');
        } else {
          bgMusic.pause();
          musicToggle.classList.remove('playing');
        }
      });

      // ===== GALLERY LIGHTBOX =====
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightboxImg');
      const lightboxClose = document.getElementById('lightboxClose');

      document.querySelectorAll('.gallery-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const img = this.querySelector('img');
          if (!img) return;
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt;
          lightbox.classList.add('open');
          landing.style.overflowY = 'hidden';
        });
      });

      function closeLightbox() {
        lightbox.classList.remove('open');
        landing.style.overflowY = 'auto';
        setTimeout(function() {
          lightboxImg.src = '';
        }, 400);
      }

      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
      });

      // ===== EVENTS =====
      seal.addEventListener('click', function(e) {
        e.stopPropagation();
        openEnvelope();
      });

      envelope.addEventListener('click', function(e) {
        if (!opened) {
          openEnvelope();
        }
      });

      resetBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        resetAll();
      });

      document.getElementById('rsvpBtn').addEventListener('click', function(e) {
        e.stopPropagation();

        const rect = this.getBoundingClientRect();
        createConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);

        const originalHTML = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check-circle"></i> Thank You!';
        this.style.background = 'linear-gradient(145deg, #6f9e7c, #4a7a5a)';
        this.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25), 0 5px 0 #2a4a3a';
        this.disabled = true;

        setTimeout(() => {
          this.innerHTML = originalHTML;
          this.style.background = 'linear-gradient(145deg, #b8895e, #8a5e38)';
          this.style.boxShadow = '0 12px 24px rgba(0,0,0,0.25), 0 5px 0 #5e3e2b';
          this.disabled = false;
        }, 2500);
      });

      landing.addEventListener('click', function(e) {
        e.stopPropagation();
      });

      // ===== KEYBOARD SUPPORT =====
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!opened) {
            e.preventDefault();
            openEnvelope();
          }
        }
        if (e.key === 'Escape') {
          if (lightbox.classList.contains('open')) {
            closeLightbox();
          } else if (opened) {
            resetAll();
          }
        }
      });

      // ===== TOUCH SUPPORT =====
      if (isTouch) {
        seal.addEventListener('touchstart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          openEnvelope();
        }, { passive: false });

        envelope.addEventListener('touchstart', function(e) {
          if (!opened) {
            e.preventDefault();
            e.stopPropagation();
            openEnvelope();
          }
        }, { passive: false });
      }

      

      // ===== RESIZE =====
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          isMobile = window.matchMedia('(max-width: 768px)').matches;
          resizeCanvas();
        }, 200);
      });

      // ===== PREVENT SCROLL DURING ENVELOPE STAGE =====
      document.addEventListener('touchmove', function(e) {
        if (!opened && e.target.closest('.stage')) {
          e.preventDefault();
        }
      }, { passive: false });

    })();
