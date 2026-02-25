// Theme toggle with saved preference — defaults to dark mode
(function () {
  var STORAGE_KEY = "theme";
  var root = document.documentElement;

  function setTheme(theme, persist) {
    if (persist === undefined) persist = true;
    root.classList.toggle("dark", theme === "dark");
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
    updateButton(theme);
  }

  function getPreferredTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
    return "light";
  }

  function updateButton(theme) {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(theme === "dark"));
    btn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    // Sun icon for dark mode (click to go light), moon icon for light mode (click to go dark)
    btn.innerHTML = theme === "dark"
      ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  // Apply theme immediately to prevent flash
  setTheme(getPreferredTheme(), false);

  document.addEventListener("DOMContentLoaded", function () {
    setTheme(getPreferredTheme());

    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        setTheme(root.classList.contains("dark") ? "light" : "dark");
      });
    }

    // ── Cursor spotlight tracking ──
    // Updates CSS custom properties so radial-gradient follows the mouse
    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Scroll-triggered fade-in ──
    var scrollElements = document.querySelectorAll('.fade-in-scroll');
    if (scrollElements.length > 0) {
      if (!prefersReducedMotion) {
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15 });

        scrollElements.forEach(function (el) {
          observer.observe(el);
        });
      } else {
        scrollElements.forEach(function (el) {
          el.classList.add('visible');
        });
      }
    }

    if (!prefersReducedMotion) {
      document.addEventListener("mousemove", function (e) {
        var targets = document.querySelectorAll(".card, .project-card:not(.placeholder-card)");
        for (var i = 0; i < targets.length; i++) {
          var rect = targets[i].getBoundingClientRect();
          targets[i].style.setProperty("--mouse-x", (e.clientX - rect.left) + "px");
          targets[i].style.setProperty("--mouse-y", (e.clientY - rect.top) + "px");
        }
      });

      // ── 3D tilt on hero photo ──
      var photo = document.querySelector(".hero-photo");
      if (photo) {
        photo.addEventListener("mousemove", function (e) {
          var rect = photo.getBoundingClientRect();
          var x = (e.clientX - rect.left) / rect.width - 0.5;
          var y = (e.clientY - rect.top) / rect.height - 0.5;
          photo.style.transform =
            "perspective(800px) rotateY(" + (x * 10) + "deg) rotateX(" + (-y * 10) + "deg) scale(1.02)";
          photo.style.boxShadow =
            "0 20px 40px rgba(0,0,0,0.15), 0 0 80px rgba(99,102,241," + (0.08 + Math.abs(x) * 0.08) + ")";
        });

        photo.addEventListener("mouseleave", function () {
          photo.style.transform = "";
          photo.style.boxShadow = "";
        });
      }
    }
  });
})();
