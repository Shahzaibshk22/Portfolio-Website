// 1. TYPEWRITER EFFECT (HERO SUBTITLE)
const typingElement = document.querySelector(".typing-text");
const professionalRoles = [
  "Frontend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Creative Technologist"
];

let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeletingRole = false;

function runTypewriterEffect() {
  if (!typingElement) return;

  const currentRole = professionalRoles[currentRoleIndex];

  if (isDeletingRole) {
    currentCharIndex--;
    typingElement.textContent = currentRole.substring(0, currentCharIndex);
  } else {
    currentCharIndex++;
    typingElement.textContent = currentRole.substring(0, currentCharIndex);
  }

  let typingDelay = isDeletingRole ? 45 : 90;

  // Finished typing current role
  if (!isDeletingRole && currentCharIndex === currentRole.length) {
    typingDelay = 1600; // Pause at end of word
    isDeletingRole = true;
  }
  // Finished deleting current role
  else if (isDeletingRole && currentCharIndex === 0) {
    isDeletingRole = false;
    currentRoleIndex = (currentRoleIndex + 1) % professionalRoles.length;
    typingDelay = 400; // Pause before typing next word
  }

  setTimeout(runTypewriterEffect, typingDelay);
}

// 2. STAR PARTICLES BACKGROUND (FAST, SMOOTH & HARDWARE-ACCELERATED)
function initializeStarParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let canvasWidth = (canvas.width = window.innerWidth);
  let canvasHeight = (canvas.height = window.innerHeight);

  const starColors = [
    "rgba(0, 242, 254, ",   // Turquoise Cyan
    "rgba(56, 189, 248, ",  // Sky Blue
    "rgba(34, 211, 238, ",  // Electric Cyan
    "rgba(20, 184, 166, ",  // Teal
    "rgba(255, 255, 255, "  // White
  ];

  let starParticles = [];
  const totalStars = Math.min(80, Math.max(40, Math.floor((canvasWidth * canvasHeight) / 16000)));

  function createStarParticles() {
    starParticles = [];
    for (let i = 0; i < totalStars; i++) {
      starParticles.push({
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        radius: Math.random() * 1.5 + 0.6,
        colorPrefix: starColors[Math.floor(Math.random() * starColors.length)],
        opacity: Math.random() * 0.7 + 0.2,
        pulseSpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        speedX: (Math.random() - 0.5) * 0.12,
        speedY: (Math.random() - 0.5) * 0.12
      });
    }
  }

  // Pre-render a glowing star sprite for maximum 60FPS GPU performance
  const glowSprite = document.createElement("canvas");
  glowSprite.width = 16;
  glowSprite.height = 16;
  const glowContext = glowSprite.getContext("2d");
  const glowGradient = glowContext.createRadialGradient(8, 8, 1, 8, 8, 8);
  glowGradient.addColorStop(0, "rgba(0, 242, 254, 1)");
  glowGradient.addColorStop(0.4, "rgba(0, 242, 254, 0.4)");
  glowGradient.addColorStop(1, "rgba(0, 242, 254, 0)");
  glowContext.fillStyle = glowGradient;
  glowContext.beginPath();
  glowContext.arc(8, 8, 8, 0, Math.PI * 2);
  glowContext.fill();

  function animateStars() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < starParticles.length; i++) {
      const star = starParticles[i];

      // Twinkle pulsation
      star.opacity += star.pulseSpeed;
      if (star.opacity > 0.95 || star.opacity < 0.15) {
        star.pulseSpeed = -star.pulseSpeed;
      }

      // Smooth floating motion with screen edge wrap
      star.x = (star.x + star.speedX + canvasWidth) % canvasWidth;
      star.y = (star.y + star.speedY + canvasHeight) % canvasHeight;

      // Draw star core
      context.beginPath();
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fillStyle = star.colorPrefix + star.opacity + ")";
      context.fill();

      // Soft glow for larger stars (hardware-accelerated via sprite)
      if (star.radius > 1.2) {
        context.globalAlpha = star.opacity * 0.5;
        context.drawImage(glowSprite, star.x - 8, star.y - 8);
        context.globalAlpha = 1;
      }
    }

    requestAnimationFrame(animateStars);
  }

  window.addEventListener("resize", () => {
    canvasWidth = canvas.width = window.innerWidth;
    canvasHeight = canvas.height = window.innerHeight;
    createStarParticles();
  }, { passive: true });

  createStarParticles();
  animateStars();
}

// 3. NAVIGATION, MOBILE MENU & SMOOTH SCROLLSPY
function initializeNavigation() {
  const menuButton = document.getElementById("menu-btn");
  const navigationBar = document.getElementById("navbar");
  const navigationLinks = document.querySelectorAll(".nav-link");
  const contentSections = document.querySelectorAll("section[id]");

  // Toggle mobile drawer
  if (menuButton && navigationBar) {
    menuButton.addEventListener("click", () => {
      navigationBar.classList.toggle("open");
    });
  }

  // Smooth scroll click handler
  navigationLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      const targetSectionId = link.getAttribute("href");
      const targetSection = document.querySelector(targetSectionId);

      if (targetSection) {
        event.preventDefault();
        targetSection.scrollIntoView({ behavior: "smooth" });

        navigationLinks.forEach(navItem => navItem.classList.remove("active"));
        link.classList.add("active");

        if (navigationBar) {
          navigationBar.classList.remove("open");
        }
      }
    });
  });

  // Smooth throttled scrollspy using requestAnimationFrame & passive event
  let isScrollScheduled = false;

  function updateActiveNavigationOnScroll() {
    const scrollPosition = window.scrollY + 140;

    contentSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navigationLinks.forEach(link => {
          const isMatchingLink = link.getAttribute("href") === `#${sectionId}`;
          link.classList.toggle("active", isMatchingLink);
        });
      }
    });

    isScrollScheduled = false;
  }

  window.addEventListener("scroll", () => {
    if (!isScrollScheduled) {
      window.requestAnimationFrame(updateActiveNavigationOnScroll);
      isScrollScheduled = true;
    }
  }, { passive: true });
}

// 4. TECHNICAL SKILLS "MORE" BUTTON TOGGLE
function initializeTechnicalSkillsToggle() {
  const moreSkillsButton = document.getElementById("skills-more-btn");
  const hiddenSkillsContainer = document.getElementById("skills-extra");

  if (moreSkillsButton && hiddenSkillsContainer) {
    moreSkillsButton.addEventListener("click", () => {
      hiddenSkillsContainer.classList.add("show");
      moreSkillsButton.style.display = "none";
    });
  }
}

// APPLICATION INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  runTypewriterEffect();
  initializeStarParticles();
  initializeNavigation();
  initializeTechnicalSkillsToggle();
});
