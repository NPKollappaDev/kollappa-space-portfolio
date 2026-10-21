
/* =========================================
   NPKOLLAPPA — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // 1. MOBILE NAVIGATION
  // =========================================

  const menuButton = document.querySelector(".menu-btn");
  const navigation = document.querySelector(".navbar nav");
  const navigationLinks = document.querySelectorAll(".navbar nav a");

  if (menuButton && navigation) {
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Toggle navigation"
      );
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Toggle navigation");
        menuButton.textContent = "☰";
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Toggle navigation");
        menuButton.textContent = "☰";
      }
    });
  }

  // =========================================
  // 2. SMOOTH SCROLLING
  // =========================================

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      }
    });
  });

  // =========================================
  // 3. ACTIVE NAVIGATION LINK
  // =========================================

  const pageSections = document.querySelectorAll(
    "main#home, #about, #skills, #projects, #education, #contact"
  );

  function updateActiveLink() {
    let currentSection = "home";

    pageSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 140) {
        currentSection = section.id || "home";
      }
    });

    navigationLinks.forEach((link) => {
      const target = link.getAttribute("href");

      link.classList.toggle(
        "active",
        target === `#${currentSection}`
      );
    });
  }

  window.addEventListener("scroll", updateActiveLink, {
    passive: true,
  });

  updateActiveLink();

  // =========================================
  // 4. SCROLL REVEAL ANIMATIONS
  // =========================================

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealElements = document.querySelectorAll(
    "#about, #skills, #projects, #education, #contact, " +
    ".skill-tile, .project-card, .about-highlight, .planet-card"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // =========================================
  // 5. ANIMATED STAR BACKGROUND
  // =========================================

  const starCanvas = document.getElementById("stars");

  if (starCanvas) {
    const context = starCanvas.getContext("2d");

    if (context) {
      let stars = [];
      let animationFrame = null;
      let canvasWidth = 0;
      let canvasHeight = 0;

      function createStars() {
        const pixelRatio = Math.min(
          window.devicePixelRatio || 1,
          2
        );

        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;

        starCanvas.width = canvasWidth * pixelRatio;
        starCanvas.height = canvasHeight * pixelRatio;

        starCanvas.style.width = `${canvasWidth}px`;
        starCanvas.style.height = `${canvasHeight}px`;

        context.setTransform(
          pixelRatio,
          0,
          0,
          pixelRatio,
          0,
          0
        );

        const starCount = Math.min(
          Math.floor(
            (canvasWidth * canvasHeight) / 3500
          ),
          220
        );

        stars = Array.from(
          { length: starCount },
          () => ({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            radius: Math.random() * 1.4 + 0.3,
            opacity: Math.random() * 0.6 + 0.2,
            speed: Math.random() * 0.008 + 0.002,
            phase: Math.random() * Math.PI * 2,
          })
        );

        drawStars(0);
      }

      function drawStars(time) {
        context.clearRect(
          0,
          0,
          canvasWidth,
          canvasHeight
        );

        stars.forEach((star) => {
          const twinkle = reduceMotion
            ? 1
            : 0.65 +
              Math.sin(time * star.speed + star.phase) *
                0.35;

          context.beginPath();

          context.arc(
            star.x,
            star.y,
            star.radius,
            0,
            Math.PI * 2
          );

          context.fillStyle = `rgba(205, 215, 255, ${
            star.opacity * twinkle
          })`;

          context.fill();
        });

        if (!reduceMotion) {
          animationFrame = requestAnimationFrame(drawStars);
        }
      }

      createStars();

      window.addEventListener("resize", () => {
        if (animationFrame !== null) {
          cancelAnimationFrame(animationFrame);
        }

        createStars();
      });
    }
  }

  // =========================================
  // 6. CONSOLE MESSAGE
  // =========================================

  console.log(
    "%c🚀 NPKOLLAPPA PORTFOLIO",
    "color: #69e8ff; font-size: 18px; font-weight: bold;"
  );

  console.log(
    "Mission ready. Welcome to Kollappa's digital universe!"
  );
});
