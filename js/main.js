// MoonFlow Agency — interactions globales

document.addEventListener("DOMContentLoaded", () => {
  // Header : fond au scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Menu mobile
  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("open");
      nav.classList.toggle("open");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        burger.classList.remove("open");
        nav.classList.remove("open");
      })
    );
  }

  // Reveal au scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Compteurs animés (page d'accueil)
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const cObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          let cur = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const tick = () => {
            cur += step;
            if (cur >= target) { el.textContent = target + "+"; }
            else { el.textContent = cur + "+"; requestAnimationFrame(tick); }
          };
          tick();
          cObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => cObs.observe(c));
  }
});
