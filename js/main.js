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

// Bandeau cookies : Google Analytics n'est chargé qu'après accord du visiteur
(function () {
  const GA_ID = "G-T6ZNGHT0SW";
  const KEY = "mf-consent";
  const MAX_AGE = 340e8; // environ 13 mois
  const read = () => { try { const c = JSON.parse(localStorage.getItem(KEY) || "null"); return c && Date.now() - c.t < MAX_AGE ? c.v : null; } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() })); } catch (e) {} };

  const loadGA = () => {
    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
    const s = document.createElement("script");
    s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    gtag("js", new Date()); gtag("config", GA_ID);
  };
  const clearGA = () => {
    document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => n.startsWith("_ga"))
      .forEach((n) => { [location.hostname, "." + location.hostname.replace(/^www\./, "")].forEach((d) => {
        document.cookie = n + "=; Max-Age=0; path=/; domain=" + d; });
        document.cookie = n + "=; Max-Age=0; path=/"; });
  };

  const banner = document.createElement("div");
  banner.className = "cookie-banner"; banner.hidden = true;
  banner.setAttribute("role", "dialog"); banner.setAttribute("aria-label", "Préférences cookies");
  banner.innerHTML =
    '<h2>Vos préférences cookies</h2>' +
    '<p>Avec votre accord, nous utilisons Google Analytics pour mesurer l\'audience du site et l\'améliorer. ' +
    'Vous pouvez changer d\'avis à tout moment via « Gérer les cookies » en bas de page. ' +
    '<a href="/politique-confidentialite.html">En savoir plus</a></p>' +
    '<div class="cookie-actions"><button type="button" class="cookie-refuse">Refuser</button>' +
    '<button type="button" class="cookie-accept">Accepter</button></div>';
  document.body.appendChild(banner);

  const close = () => { banner.hidden = true; };
  banner.querySelector(".cookie-accept").addEventListener("click", () => {
    save("granted"); gtag("consent", "update", { analytics_storage: "granted" }); loadGA(); close();
  });
  banner.querySelector(".cookie-refuse").addEventListener("click", () => {
    save("denied"); gtag("consent", "update", { analytics_storage: "denied" }); clearGA(); close();
  });
  document.querySelectorAll("[data-cookie-manage]").forEach((b) =>
    b.addEventListener("click", () => { banner.hidden = false; banner.querySelector(".cookie-accept").focus(); }));

  const choice = read();
  if (choice === "granted") loadGA();
  else if (choice === null) banner.hidden = false;
})();
