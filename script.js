/* ============================================================
   SIMULATIC AXIS — SCRIPT.JS
   ============================================================ */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}

// ---- HERO CANVAS GRID ----
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initParticles() {
  particles = [];
  const count = Math.floor((canvas.width * canvas.height) / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    });
  }
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  const gridSize = 60;
  ctx.strokeStyle = 'rgba(0, 210, 180, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Draw particles
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 210, 180, ${p.alpha})`;
    ctx.fill();

    // Update
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
  });

  // Draw connections
  ctx.strokeStyle = 'rgba(0, 210, 180, 0.04)';
  ctx.lineWidth = 0.8;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const alpha = (1 - dist / 120) * 0.08;
        ctx.strokeStyle = `rgba(0, 210, 180, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  animFrame = requestAnimationFrame(drawGrid);
}

resizeCanvas();
initParticles();
drawGrid();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ---- INTERSECTION OBSERVER — SERVICE CARDS ----
const serviceCards = document.querySelectorAll('.service-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

serviceCards.forEach(card => observer.observe(card));

// ---- PROJECT FILTER ----
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.cat;
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ---- CONTACT FORM — EmailJS ----

// Initialize EmailJS
emailjs.init('gXNyxaFUEYM3GWxuc');

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");
const formError   = document.getElementById("formError");
const submitBtn   = document.getElementById("submitBtn");

if (contactForm) {

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Reset messages
    if (formSuccess) formSuccess.classList.remove("show");
    if (formError) formError.classList.remove("show");

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    // Collect form data
    const templateParams = {
      from_name: contactForm.querySelector('[name="from_name"]').value,
      company: contactForm.querySelector('[name="company"]').value,
      from_email: contactForm.querySelector('[name="from_email"]').value,
      phone: contactForm.querySelector('[name="phone"]').value,
      industry: contactForm.querySelector('[name="industry"]').value,
      message: contactForm.querySelector('[name="message"]').value
    };

    // Send email
    emailjs.send("service_dbjqecr", "template_zpzk2h7", templateParams)
      .then(function (response) {

        console.log("SUCCESS!", response.status, response.text);

        submitBtn.style.display = "none";
        if (formSuccess) formSuccess.classList.add("show");

        contactForm.reset();

      })
      .catch(function (error) {

        console.log("FAILED...", error);

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <span class="btn-arrow">→</span>';

        if (formError) formError.classList.add("show");

      });

  });

}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- NUMBER COUNTER ANIMATION ----
function animateCount(el, end, duration = 1500) {
  let start = 0;
  const step = end / (duration / 16);
  const update = () => {
    start += step;
    if (start < end) {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
      requestAnimationFrame(update);
    } else {
      el.textContent = end + (el.dataset.suffix || '');
    }
  };
  update();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(el => {
        const val = parseInt(el.textContent);
        const suffix = el.textContent.replace(/[0-9]/g, '');
        el.dataset.suffix = suffix;
        animateCount(el, val);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ---- FADE-IN KEYFRAME (injected) ----
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
