// =============================================
// SMOOTH SCROLLING FOR NAV LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// =============================================
// FADE-IN ANIMATIONS ON SCROLL
// =============================================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(section);
});

// =============================================
// --- BACKGROUND MUSIC ---
// =============================================
const music = document.getElementById('background-music');
const toggleBtn = document.getElementById('music-toggle');
const heroVisual = document.querySelector('.hero-visual');

// Set background volume (30%)
music.volume = 0.3;

// Update button icon
function updateButton() {
  if (music.paused) {
    toggleBtn.textContent = '🔇';
  } else {
    toggleBtn.textContent = '🔊';
  }
}

// --- 1. Play/Pause when the animation is viewed ---
if (heroVisual) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Section is visible: try to play
        const playPromise = music.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            updateButton();
          }).catch(() => {
            // Autoplay blocked. Mute and wait for user click.
            music.muted = true;
            music.play().catch(() => {});
            updateButton();
          });
        }
      } else {
        // Section is out of view: pause music
        music.pause();
        updateButton();
      }
    });
  }, { threshold: 0.5 }); // Triggers when 50% of the section is visible

  observer.observe(heroVisual);
}

// --- 2. Unmute on first user interaction (bypasses browser restrictions) ---
document.addEventListener('click', function unmuteOnFirstInteraction() {
  if (music.muted) {
    music.muted = false;
    music.play().catch(() => {});
    updateButton();
  }
  document.removeEventListener('click', unmuteOnFirstInteraction);
}, { once: true });

// --- 3. Manual Toggle Button ---
toggleBtn.addEventListener('click', () => {
  if (music.paused) {
    music.muted = false;
    music.play();
  } else {
    music.pause();
  }
  updateButton();
});
