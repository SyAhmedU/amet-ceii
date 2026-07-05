/* Shared script for every page.
   Builds the top navigation bar and the footer so we only write them
   once, and runs the small things: mobile menu, scroll reveals and the
   number counters on the home page. */
(function () {
  "use strict";

  var NAV = [
    { href: "index.html",     label: "Home" },
    { href: "about.html",     label: "About" },
    { href: "programs.html",  label: "Programs" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "events.html",    label: "Events" },
    { href: "team.html",      label: "Team" },
    { href: "resources.html", label: "Resources" },
    { href: "blog.html",      label: "Journal" }
  ];

  // AMET CEII logo
  var MARK = '<img src="assets/brand/ceii-logo.png" alt="AMET CEII logo" width="42" height="42">';

  function current() {
    var p = location.pathname.split("/").pop();
    return (!p || p === "") ? "index.html" : p;
  }

  function svgIcon(name) {
    var icons = {
      linkedin: '<path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.26-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z"/>',
      facebook: '<path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1z"/>',
      twitter: '<path d="M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.7-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3.6 4.7a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.7-.5a4 4 0 0 0 3.2 4c-.5.1-1.1.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 22a11.3 11.3 0 0 0 6.1 1.8c7.3 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2z"/>',
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' + (icons[name] || "") + '</svg>';
  }

  function buildHeader() {
    var cur = current();
    var links = NAV.map(function (n) {
      var active = n.href === cur ? ' aria-current="page"' : "";
      return '<a href="' + n.href + '"' + active + '>' + n.label + '</a>';
    }).join("");

    var header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML =
      '<div class="wrap-wide"><nav class="nav">' +
        '<a class="brand" href="index.html" aria-label="AMET CEII home">' +
          '<span class="mark">' + MARK + '</span>' +
          '<span class="word"><b>AMET&nbsp;CEII</b><span>Entrepreneurship · Innovation · Incubation</span></span>' +
        '</a>' +
        '<div class="nav-links">' + links + '</div>' +
        '<div class="nav-cta">' +
          '<a class="btn btn-ghost ghost-hide" href="contact.html">Contact</a>' +
          '<a class="btn btn-primary" href="apply.html">Apply <span class="arrow">→</span></a>' +
        '</div>' +
        '<button class="nav-toggle" aria-label="Menu" aria-expanded="false"><span></span></button>' +
      '</nav></div>';

    var drawer = document.createElement("div");
    drawer.className = "mobile-menu";
    drawer.innerHTML =
      NAV.map(function (n) {
        var active = n.href === cur ? ' aria-current="page"' : "";
        return '<a href="' + n.href + '"' + active + '>' + n.label + '</a>';
      }).join("") +
      '<a href="contact.html">Contact</a>' +
      '<a class="btn btn-primary" href="apply.html">Apply to CEII →</a>';

    return { header: header, drawer: drawer };
  }

  function buildFooter() {
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="wrap-wide">' +
        '<div class="footer-top">' +
          '<div class="footer-brand">' +
            '<div class="brand"><span class="mark">' + MARK + '</span>' +
            '<span class="word"><b>AMET&nbsp;CEII</b><span class="coord">12.8339° N · 80.2436° E</span></span></div>' +
            '<p>The Centre for Entrepreneurship, Innovation &amp; Incubation of AMET University — where ideas from every department find mentorship, capital and support.</p>' +
            '<div class="social" style="margin-top:22px">' +
              '<a href="https://www.linkedin.com/" aria-label="LinkedIn" rel="noopener" target="_blank">' + svgIcon("linkedin") + '</a>' +
              '<a href="https://www.facebook.com/" aria-label="Facebook" rel="noopener" target="_blank">' + svgIcon("facebook") + '</a>' +
              '<a href="https://twitter.com/" aria-label="Twitter" rel="noopener" target="_blank">' + svgIcon("twitter") + '</a>' +
              '<a href="https://www.instagram.com/" aria-label="Instagram" rel="noopener" target="_blank">' + svgIcon("instagram") + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h4>Explore</h4>' +
            '<a href="about.html">About CEII</a><a href="programs.html">Programs</a><a href="portfolio.html">Portfolio</a><a href="events.html">Events</a>' +
          '</div>' +
          '<div class="footer-col"><h4>Engage</h4>' +
            '<a href="team.html">Team &amp; Mentors</a><a href="resources.html">Resources</a><a href="blog.html">Journal</a><a href="apply.html">Apply</a>' +
          '</div>' +
          '<div class="footer-col"><h4>Contact</h4>' +
            '<a href="mailto:aceii@ametuniv.ac.in">aceii@ametuniv.ac.in</a>' +
            '<a href="tel:+919486303654">+91 94863 03654</a>' +
            '<a href="tel:+919629695776">+91 96296 95776</a>' +
            '<a href="https://maps.google.com/?q=AMET+University+Kanathur" target="_blank" rel="noopener">135, SH 49, Kanathur Reddykuppam,<br>Tamil Nadu 603112</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span class="coord">© ' + "2026" + ' AMET Centre for Entrepreneurship, Innovation &amp; Incubation</span>' +
          '<span class="coord">A unit of AMET University · <a href="https://www.ametuniv.ac.in" target="_blank" rel="noopener" style="color:var(--mist)">ametuniv.ac.in ↗</a></span>' +
        '</div>' +
      '</div>';
    return footer;
  }

  function mountChrome() {
    var built = buildHeader();
    document.body.insertBefore(built.drawer, document.body.firstChild);
    document.body.insertBefore(built.header, document.body.firstChild);
    document.body.appendChild(buildFooter());

    // Link to the alternate design direction (two-site proposal)
    var vs = document.createElement("a");
    vs.href = "maritime/index.html";
    vs.textContent = "⚓ Maritime-focused version →";
    vs.setAttribute("style", "position:fixed;left:16px;bottom:16px;z-index:120;font-family:var(--mono);font-size:.72rem;letter-spacing:.04em;color:#4838D1;background:#fff;border:1px solid rgba(72,56,209,.35);padding:.55em .9em;border-radius:100px;text-decoration:none;box-shadow:0 8px 24px -10px rgba(20,20,30,.28)");
    document.body.appendChild(vs);

    // Mobile toggle
    var toggle = built.header.querySelector(".nav-toggle");
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    built.drawer.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); }
    });

    // Scrolled state
    var header = built.header;
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 24); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function reveals() {
    var els = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  function countUps() {
    var els = document.querySelectorAll("[data-count]");
    els.forEach(function (el) {
      var finalText = el.textContent;           // preserve VERBATIM
      if (reduce || !("IntersectionObserver" in window)) return; // leave as-is
      var target = parseFloat(el.getAttribute("data-count"));
      if (isNaN(target)) return;
      var decimals = (el.getAttribute("data-count").split(".")[1] || "").length;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      var started = false;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || started) return;
          started = true; io.unobserve(el);
          var dur = 1300, t0 = null;
          function step(ts) {
            if (t0 === null) t0 = ts;
            var p = Math.min((ts - t0) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = (target * eased).toFixed(decimals);
            el.textContent = prefix + val + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = finalText; // restore exact original
          }
          el.textContent = prefix + (0).toFixed(decimals) + suffix;
          requestAnimationFrame(step);
        });
      }, { threshold: 0.6 });
      io.observe(el);
    });
  }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    mountChrome();
    reveals();
    countUps();
    // Set year everywhere it's marked
    document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = "2026"; });
  });
})();
