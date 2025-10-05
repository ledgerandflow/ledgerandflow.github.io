/**
  File: main.js
  Project: Ledger & Flow | Coming Soon
  Created: 10.05.2025
  Updated: 10.05.2025
  Author: Faro Digital Studio
*/

(function () {
  "use strict";

  /* ================================
     Helpers
     ================================ */

  // Parse dates safely across browsers (incl. Safari)
  function parseDateSafe(str) {
    // Try native first
    let d = new Date(str);
    if (!isNaN(d.getTime())) return d;

    // Normalize common "YYYY/MM/DD HH:MM:SS"
    const norm = str.replace(/\//g, "-").replace(" ", "T");
    d = new Date(norm);
    if (!isNaN(d.getTime())) return d;

    // Manual parse as local time: YYYY-MM-DD[ T]HH:MM:SS
    const m = str
      .trim()
      .replace(/\//g, "-")
      .match(
        /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
      );
    if (m) {
      const [_, y, mo, da, hh = "0", mm = "0", ss = "0"] = m;
      return new Date(
        Number(y),
        Number(mo) - 1,
        Number(da),
        Number(hh),
        Number(mm),
        Number(ss)
      );
    }

    // Fallback to now if all else fails
    return new Date();
  }

  // Throttle via rAF for scroll handlers
  function withRaf(fn) {
    let ticking = false;
    return function (...args) {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          fn.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  }

  /* ================================
     Body scrolled flag (kept)
     ================================ */
  function toggleScrolled() {
    const body = document.querySelector("body");
    const header = document.querySelector("#header");
    if (
      !header ||
      !(
        header.classList.contains("scroll-up-sticky") ||
        header.classList.contains("sticky-top") ||
        header.classList.contains("fixed-top")
      )
    )
      return;
    if (window.scrollY > 100) body.classList.add("scrolled");
    else body.classList.remove("scrolled");
  }

  document.addEventListener("scroll", withRaf(toggleScrolled), { passive: true });
  window.addEventListener("load", toggleScrolled);

  /* ================================
     Mobile nav toggle
     ================================ */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    if (!mobileNavToggleBtn) return;
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  // Hide mobile nav on same-page/hash nav
  document.querySelectorAll("#navmenu a").forEach((a) => {
    a.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) mobileNavToogle();
    });
  });

  // Toggle mobile nav dropdowns (only if such toggles exist)
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((t) => {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      if (this.parentNode.nextElementSibling) {
        this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      }
      e.stopImmediatePropagation();
    });
  });

  /* ================================
     Preloader
     ================================ */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => preloader.remove());
  }

  /* ================================
     Scroll top button
     ================================ */
  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTop) return;
    if (window.scrollY > 100) scrollTop.classList.add("active");
    else scrollTop.classList.remove("active");
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", withRaf(toggleScrollTop), { passive: true });

  /* ================================
     AOS (defensive init)
     ================================ */
  function aosInit() {
    if (typeof AOS !== "undefined" && AOS && typeof AOS.init === "function") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /* ================================
     Countdown timer (safe parsing + stop at 0)
     ================================ */
  function updateCountDown(countDownItem) {
    const raw = countDownItem.getAttribute("data-count") || "";
    const target = parseDateSafe(raw).getTime();
    const now = Date.now();
    let timeleft = target - now;

    if (timeleft <= 0) {
      countDownItem.querySelector(".count-days").textContent = 0;
      countDownItem.querySelector(".count-hours").textContent = 0;
      countDownItem.querySelector(".count-minutes").textContent = 0;
      countDownItem.querySelector(".count-seconds").textContent = 0;
      return false; // signal finished
    }

    const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

    countDownItem.querySelector(".count-days").textContent = days;
    countDownItem.querySelector(".count-hours").textContent = hours;
    countDownItem.querySelector(".count-minutes").textContent = minutes;
    countDownItem.querySelector(".count-seconds").textContent = seconds;

    return true;
  }

  document.querySelectorAll(".countdown").forEach(function (countDownItem) {
    // Prime immediately
    let running = updateCountDown(countDownItem);

    // Tick every second; auto-stop at 0
    const id = setInterval(function () {
      running = updateCountDown(countDownItem);
      if (!running) clearInterval(id);
    }, 1000);
  });

  /* ================================
     Sticky header background toggle
     ================================ */
  document.addEventListener(
    "scroll",
    withRaf(function () {
      const header = document.getElementById("header");
      if (!header) return;
      if (window.scrollY > 10) header.classList.add("header-scrolled");
      else header.classList.remove("header-scrolled");
    }),
    { passive: true }
  );
})();
