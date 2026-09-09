(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) document.documentElement.classList.add("reduced-motion");

  /* ---------- Nav: hide on scroll down, show on up ---------- */
  const nav = document.getElementById("navbar");
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    if (!nav) return;
    nav.classList.toggle("is-scrolled", y > 40);
    if (y > 200 && y > lastY + 4) nav.classList.add("is-hidden");
    else if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileBtn && mobileMenu) {
    const toggle = () => {
      const open = mobileMenu.classList.toggle("is-open");
      mobileBtn.setAttribute("aria-expanded", open ? "true" : "false");
      mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
      mobileMenu.toggleAttribute("inert", !open);
      mobileMenu.style.maxHeight = open ? "400px" : "0px";
      mobileMenu.style.opacity = open ? "1" : "0";
      mobileMenu.style.pointerEvents = open ? "auto" : "none";
    };
    mobileBtn.addEventListener("click", toggle);
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        if (mobileMenu.classList.contains("is-open")) toggle();
      })
    );
  }

  /* ---------- Statement: wrap words ---------- */
  document.querySelectorAll(".statement [data-words]").forEach((el) => {
    const accents = (el.getAttribute("data-accent") || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
    const text = el.textContent.trim();
    el.textContent = "";
    text.split(/\s+/).forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "w";
      if (accents.some((a) => word.replace(/[.,;:()]/g, "") === a)) span.classList.add("accent");
      span.textContent = word;
      el.appendChild(span);
      el.appendChild(document.createTextNode(" "));
    });
  });

  if (reduced || typeof gsap === "undefined") {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".hero-line > span").forEach((el) => (el.style.transform = "none"));
    document.querySelectorAll(".portrait").forEach((el) => (el.style.clipPath = "none"));
    document.querySelectorAll(".statement .w").forEach((el) => el.classList.add("is-on"));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const EASE = "expo.out";

  /* Set animation starts only after GSAP is confirmed. */
  gsap.set(".hero-line > span", { yPercent: 110 });
  gsap.set(".portrait", { clipPath: "inset(0 0 100% 0)" });
  const revealItems = gsap.utils.toArray("[data-reveal]:not(.work-item):not(.case__body)");
  gsap.set(revealItems, { opacity: 0, y: 28 });

  /* ---------- Global scroll progress ---------- */
  gsap.to(".scroll-progress span", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      scrub: 0.15,
    },
  });

  /* ---------- Contextual cursor ---------- */
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.querySelector(".cursor");
    const dot = cursor?.querySelector(".cursor__dot");
    const ring = cursor?.querySelector(".cursor__ring");
    const label = cursor?.querySelector(".cursor__label");

    if (cursor && dot && ring && label) {
      document.documentElement.classList.add("has-custom-cursor");

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

      window.addEventListener("pointermove", (e) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
        cursor.classList.add("is-visible");
      }, { passive: true });

      document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("is-visible"));
      document.documentElement.addEventListener("mouseenter", () => cursor.classList.add("is-visible"));

      document.querySelectorAll("a, button, [data-cursor]").forEach((target) => {
        target.addEventListener("pointerenter", () => {
          label.textContent = target.getAttribute("data-cursor") || (target.matches("a") ? "OPEN" : "");
          cursor.classList.add("is-active");
          cursor.classList.toggle(
            "is-on-primary",
            target.matches(".btn-solid") || Boolean(target.closest(".btn-solid"))
          );
        });
        target.addEventListener("pointerleave", () => {
          cursor.classList.remove("is-active", "is-on-primary");
        });
      });
    }
  }

  /* ---------- Hero intro ---------- */
  const intro = gsap.timeline({ defaults: { ease: EASE } });
  intro
    .to(".hero-line > span", { yPercent: 0, duration: 1.3, stagger: 0.12 }, 0.15)
    .from(".hero [data-intro]", { y: 20, opacity: 0, duration: 1, stagger: 0.1 }, 0.7)
    .from(".scroll-cue", { opacity: 0, duration: 1 }, 1.2);

  gsap.to(".hero-content", {
    y: -80,
    opacity: 0.35,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  /* ---------- Generic reveals ---------- */
  revealItems.forEach((el) => {
    const delay = parseFloat(el.getAttribute("data-delay") || "0");
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      delay,
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  /* ---------- Statement word reveal (scrub) ---------- */
  document.querySelectorAll(".statement").forEach((block) => {
    const words = block.querySelectorAll(".w");
    if (!words.length) return;
    const proxy = { p: 0 };
    gsap.to(proxy, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: block,
        start: "top 75%",
        end: "bottom 45%",
        scrub: 0.3,
      },
      onUpdate() {
        const n = Math.round(proxy.p * words.length);
        words.forEach((w, i) => w.classList.toggle("is-on", i < n));
      },
    });
  });

  /* ---------- Case frames: parallax + inner scale ---------- */
  gsap.utils.toArray(".case .frame").forEach((frame) => {
    gsap.fromTo(
      frame,
      { y: 60 },
      {
        y: -60,
        ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    const img = frame.querySelector("img");
    if (img) {
      gsap.fromTo(
        img,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "center center", scrub: true },
        }
      );
    }
  });

  /* ---------- Case copy enters from its relationship to the frame ---------- */
  gsap.utils.toArray(".case").forEach((item) => {
    const body = item.querySelector(".case__body");
    if (!body) return;
    const from = item.classList.contains("case--flip") ? -48 : 48;
    gsap.fromTo(body,
      { x: from, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.05,
        ease: EASE,
        scrollTrigger: { trigger: item, start: "top 72%", once: true },
      }
    );
  });

  /* ---------- Approach: pinned horizontal scroll (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 1024px)", () => {
    const section = document.querySelector(".approach");
    const track = document.querySelector(".approach__track");
    const bar = document.querySelector(".approach__progress span");
    if (!section || !track) return;

    const getDistance = () => track.scrollWidth - section.clientWidth + 96;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => "+=" + getDistance(),
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    tl.to(track, { x: () => -getDistance(), ease: "none" }, 0);
    if (bar) tl.to(bar, { scaleX: 1, ease: "none" }, 0);
  });

  /* ---------- Numbers count-up ---------- */
  gsap.utils.toArray("[data-count]").forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count"));
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const from = parseFloat(el.getAttribute("data-from") || "0");
    const obj = { v: from };
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate() {
        el.textContent = prefix + Math.round(obj.v) + suffix;
      },
    });
  });

  /* ---------- Portrait clip reveal ---------- */
  gsap.utils.toArray(".portrait").forEach((el) => {
    gsap.to(el, {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.4,
      ease: EASE,
      scrollTrigger: { trigger: el, start: "top 80%", once: true },
    });
  });

  /* ---------- Experience rows stagger ---------- */
  gsap.utils.toArray(".xp-group").forEach((group) => {
    const rows = group.querySelectorAll(".xp-row");
    gsap.from(rows, {
      opacity: 0,
      y: 24,
      duration: 0.9,
      stagger: 0.08,
      ease: EASE,
      scrollTrigger: { trigger: group, start: "top 80%", once: true },
    });
  });

  /* ---------- Section headings: masked composition reveal ---------- */
  gsap.utils.toArray("[data-lines]").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 52, clipPath: "inset(0 0 100% 0)", filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0 0 0% 0)",
        filter: "blur(0px)",
        duration: 1.15,
        ease: EASE,
        scrollTrigger: { trigger: el, start: "top 86%", once: true },
      }
    );
  });

  /* ---------- More work: cards arrive as a collection ---------- */
  ScrollTrigger.batch(".work-item", {
    start: "top 92%",
    once: true,
    onEnter: (items) => gsap.fromTo(items,
      { opacity: 0, y: 52, rotateX: 8, clipPath: "inset(0 0 18% 0 round 12px)" },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        clipPath: "inset(0 0 0% 0 round 12px)",
        duration: 0.95,
        stagger: 0.08,
        ease: EASE,
        overwrite: true,
      }
    ),
  });

  /* ---------- Pointer depth on featured work ---------- */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".case .frame").forEach((frame) => {
      frame.addEventListener("pointermove", (e) => {
        const r = frame.getBoundingClientRect();
        const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
        const ry = ((e.clientX - r.left) / r.width - 0.5) * 6;
        gsap.to(frame, {
          rotateX: rx,
          rotateY: ry,
          scale: 1.015,
          duration: 0.35,
          ease: "power2.out",
          transformPerspective: 900,
          overwrite: "auto",
        });
      });
      frame.addEventListener("pointerleave", () => {
        gsap.to(frame, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55,
          ease: "power3.out",
          overwrite: "auto",
        });
      });
    });
  }

  /* ---------- Magnetic buttons (subtle) ---------- */
  if (window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".btn").forEach((btn) => {
      const strength = 0.25;
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength;
        gsap.to(btn, { x, y, duration: 0.4, ease: "power2.out" });
      });
      btn.addEventListener("pointerleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "power3.out" });
      });
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh());
})();
