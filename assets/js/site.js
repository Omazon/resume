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

  /* ---------- Work detail modal (fullscreen + animated slides) ---------- */
  const initWorkModal = (canAnimate) => {
    const modal = document.getElementById("work-modal");
    const grid = document.querySelector(".work-grid");
    if (!modal || !grid) return;

    const shell = modal.querySelector(".work-modal__shell");
    const track = document.getElementById("work-modal-track");
    const closeBtn = modal.querySelector(".work-modal__close");
    const indexEl = document.getElementById("work-modal-index");
    const totalEl = document.getElementById("work-modal-total");
    const liveTitle = document.getElementById("work-modal-live-title");
    const chrome = modal.querySelector(".work-modal__chrome");
    const items = Array.from(grid.querySelectorAll(".work-item"));

    let open = false;
    let trigger = null;
    let activeTween = null;
    let slideTween = null;
    let currentIndex = 0;
    let built = false;
    let animatingSlide = false;
    let touchStartY = 0;
    const EASE_MODAL = "expo.out";

    const pad = (n) => String(n).padStart(2, "0");
    const slides = () => Array.from(track.querySelectorAll(".work-modal__slide"));

    const escapeHtml = (str) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const bindCursorTargets = (root) => {
      if (!document.documentElement.classList.contains("has-custom-cursor")) return;
      const cursor = document.querySelector(".cursor");
      const label = cursor?.querySelector(".cursor__label");
      root.querySelectorAll("a, button, [data-cursor]").forEach((target) => {
        target.addEventListener("pointerenter", () => {
          if (!label || !cursor) return;
          label.textContent = target.getAttribute("data-cursor") || (target.matches("a") ? "OPEN" : "");
          cursor.classList.add("is-active");
          cursor.classList.toggle(
            "is-on-primary",
            target.matches(".btn-solid") || Boolean(target.closest(".btn-solid"))
          );
        });
        target.addEventListener("pointerleave", () => {
          cursor?.classList.remove("is-active", "is-on-primary");
        });
      });
    };

    const splitPipe = (value) =>
      (value || "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);

    const buildSlides = () => {
      if (built) return;
      track.innerHTML = items
        .map((item, i) => {
          const title = item.getAttribute("data-title") || "";
          const blurb = item.getAttribute("data-blurb") || "";
          const overview = item.getAttribute("data-overview") || blurb;
          const img = item.getAttribute("data-img") || "";
          const fit = item.getAttribute("data-img-fit") || "";
          const url = item.getAttribute("data-url") || "";
          const isFlat = item.getAttribute("data-flat") === "true";
          const flatLabel = (item.getAttribute("data-flat-label") || "")
            .split("|")
            .map((line) => escapeHtml(line.trim()))
            .filter(Boolean)
            .join("<br>");
          const stack = splitPipe(item.getAttribute("data-stack"));
          const highlights = splitPipe(item.getAttribute("data-highlights"));

          const frameClass = isFlat ? "frame frame--flat" : "frame";
          const mediaClass = fit === "contain" && !isFlat ? "frame__media is-contain" : "frame__media";
          const mediaInner = isFlat
            ? `<p class="display-md text-center">${flatLabel}</p>`
            : `<img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" loading="lazy">`;
          const cta = url
            ? `<a class="btn btn-solid" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" data-cursor="OPEN">Visit site</a>`
            : "";
          const stackHtml = stack
            .map((tag) => `<span>${escapeHtml(tag)}</span>`)
            .join("");
          const highlightsHtml = highlights
            .map((line) => `<li>${escapeHtml(line)}</li>`)
            .join("");

          return `
            <article class="work-modal__slide" data-index="${i}" aria-hidden="true" aria-label="${escapeHtml(title)}">
              <div class="work-modal__layout">
                <div class="work-modal__media" data-anim>
                  <div class="${frameClass}">
                    <div class="frame__bar" aria-hidden="true"><span></span><span></span><span></span></div>
                    <div class="${mediaClass}">${mediaInner}</div>
                  </div>
                </div>
                <div class="work-modal__body">
                  <p class="label" data-anim>Project</p>
                  <h2 class="display-md" data-anim>${escapeHtml(title)}</h2>
                  <p class="work-modal__blurb text-muted" data-anim>${escapeHtml(blurb)}</p>
                  <div class="work-modal__details" data-anim>
                    <div class="work-modal__block">
                      <p class="label">Overview</p>
                      <p class="work-modal__overview text-muted">${escapeHtml(overview)}</p>
                    </div>
                    <div class="work-modal__block">
                      <p class="label">Stack</p>
                      <div class="work-modal__chips meta-list">${stackHtml}</div>
                    </div>
                    <div class="work-modal__block">
                      <p class="label">Highlights</p>
                      <ul class="work-modal__list">${highlightsHtml}</ul>
                    </div>
                  </div>
                  ${cta ? `<div data-anim>${cta}</div>` : ""}
                </div>
              </div>
            </article>`;
        })
        .join("");

      totalEl.textContent = pad(items.length);
      built = true;
      bindCursorTargets(modal);
    };

    const setIndex = (i) => {
      currentIndex = i;
      indexEl.textContent = pad(i + 1);
      const title = items[i]?.getAttribute("data-title") || "";
      if (liveTitle) liveTitle.textContent = title;
    };

    const activateSlide = (i, { instant = false, direction = 1 } = {}) => {
      const list = slides();
      const next = list[i];
      if (!next) return;

      const prev = list[currentIndex];
      const same = i === currentIndex && prev?.classList.contains("is-active");

      if (same && !instant) return;

      setIndex(i);

      list.forEach((slide, idx) => {
        const active = idx === i;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      if (!canAnimate || typeof gsap === "undefined" || instant) {
        if (typeof gsap !== "undefined") {
          gsap.set(list, { clearProps: "opacity,visibility,transform,clipPath,filter" });
          gsap.set(next, { opacity: 1, visibility: "visible", y: 0, clipPath: "none", filter: "none" });
          list.forEach((slide, idx) => {
            if (idx !== i) gsap.set(slide, { opacity: 0, visibility: "hidden" });
          });
        }
        animatingSlide = false;
        return;
      }

      if (slideTween) slideTween.kill();
      animatingSlide = true;

      const nextAnim = next.querySelectorAll("[data-anim]");
      const prevAnim = prev && prev !== next ? prev.querySelectorAll("[data-anim]") : [];

      gsap.set(next, {
        opacity: 1,
        visibility: "visible",
        zIndex: 2,
        y: 0,
        clipPath: "none",
      });
      gsap.set(nextAnim, { opacity: 0, y: 36 * direction, filter: "blur(8px)" });

      slideTween = gsap.timeline({
        defaults: { overwrite: true },
        onComplete: () => {
          animatingSlide = false;
          list.forEach((slide, idx) => {
            if (idx === i) return;
            gsap.set(slide, {
              opacity: 0,
              visibility: "hidden",
              zIndex: 0,
              y: 0,
              clipPath: "none",
              filter: "none",
            });
          });
          gsap.set(next, { zIndex: 1 });
        },
      });

      if (prev && prev !== next) {
        slideTween.to(
          prevAnim,
          {
            opacity: 0,
            y: -28 * direction,
            filter: "blur(6px)",
            duration: 0.35,
            stagger: 0.03,
            ease: "power2.in",
          },
          0
        );
        slideTween.to(
          prev,
          {
            opacity: 0,
            y: -48 * direction,
            clipPath: direction > 0 ? "inset(0 0 18% 0)" : "inset(18% 0 0 0)",
            duration: 0.45,
            ease: "power2.in",
          },
          0
        );
      }

      slideTween.fromTo(
        next,
        {
          opacity: 0,
          y: 56 * direction,
          clipPath: direction > 0 ? "inset(14% 0 0 0)" : "inset(0 0 14% 0)",
        },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.75,
          ease: EASE_MODAL,
        },
        prev && prev !== next ? 0.18 : 0
      );

      slideTween.to(
        nextAnim,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.65,
          stagger: 0.06,
          ease: EASE_MODAL,
        },
        prev && prev !== next ? 0.28 : 0.05
      );
    };

    const goToSlide = (i, direction) => {
      if (!open || animatingSlide) return;
      const clamped = Math.max(0, Math.min(items.length - 1, i));
      if (clamped === currentIndex) return;
      const dir = direction ?? (clamped > currentIndex ? 1 : -1);
      activateSlide(clamped, { direction: dir });
    };

    const focusables = () => {
      const active = track.querySelector(".work-modal__slide.is-active");
      const nodes = [closeBtn];
      if (active) nodes.push(...active.querySelectorAll("a[href], button"));
      return nodes.filter(Boolean);
    };

    const showShell = () => {
      modal.hidden = false;
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-modal-open");
    };

    const hideShell = () => {
      modal.hidden = true;
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-modal-open");
      if (trigger && typeof trigger.focus === "function") trigger.focus();
      trigger = null;
      open = false;
      animatingSlide = false;
    };

    const openModal = (item) => {
      if (open) return;
      open = true;
      trigger = item;
      buildSlides();
      const startIndex = Math.max(0, items.indexOf(item));
      showShell();

      /* Reset all slides, then reveal the selected one */
      currentIndex = startIndex;
      activateSlide(startIndex, { instant: true });

      if (!canAnimate || typeof gsap === "undefined") {
        gsap?.set?.([shell, chrome], { clearProps: "all" });
        closeBtn.focus();
        return;
      }

      if (activeTween) activeTween.kill();

      const active = track.querySelector(`.work-modal__slide[data-index="${startIndex}"]`);
      const animEls = active ? active.querySelectorAll("[data-anim]") : [];

      gsap.set(shell, {
        clipPath: "inset(100% 0 0 0)",
        scale: 1.04,
        transformOrigin: "50% 100%",
      });
      gsap.set(chrome, { opacity: 0, y: -12 });
      gsap.set(animEls, { opacity: 0, y: 40, filter: "blur(8px)" });

      activeTween = gsap
        .timeline({
          defaults: { ease: EASE_MODAL, overwrite: true },
          onComplete: () => {
            closeBtn.focus();
            track.focus({ preventScroll: true });
          },
        })
        .to(
          shell,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.05,
          },
          0
        )
        .to(chrome, { opacity: 1, y: 0, duration: 0.55 }, 0.45)
        .to(
          animEls,
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.07 },
          0.42
        );
    };

    const closeModal = () => {
      if (!open) return;

      if (!canAnimate || typeof gsap === "undefined") {
        hideShell();
        return;
      }

      if (activeTween) activeTween.kill();
      if (slideTween) slideTween.kill();

      activeTween = gsap
        .timeline({
          defaults: { ease: "power3.in", overwrite: true },
          onComplete: hideShell,
        })
        .to(chrome, { opacity: 0, y: -10, duration: 0.25 }, 0)
        .to(
          shell,
          {
            clipPath: "inset(0 0 100% 0)",
            scale: 1.03,
            transformOrigin: "50% 0%",
            duration: 0.75,
          },
          0.05
        );
    };

    grid.addEventListener("click", (e) => {
      const item = e.target.closest(".work-item");
      if (!item || !grid.contains(item)) return;
      openModal(item);
    });

    modal.querySelectorAll("[data-close]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    /* Wheel / trackpad: one project per gesture (unless slide itself is scrolling) */
    const onWheel = (e) => {
      if (!open) return;
      const active = track.querySelector(".work-modal__slide.is-active");
      if (active && active.scrollHeight > active.clientHeight + 2) {
        const atTop = active.scrollTop <= 0;
        const atBottom = active.scrollTop + active.clientHeight >= active.scrollHeight - 2;
        if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) return;
      }
      e.preventDefault();
      if (animatingSlide || Math.abs(e.deltaY) < 8) return;
      if (e.deltaY > 0) goToSlide(currentIndex + 1, 1);
      else goToSlide(currentIndex - 1, -1);
    };

    shell.addEventListener("wheel", onWheel, { passive: false });

    shell.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0]?.clientY || 0;
      },
      { passive: true }
    );

    shell.addEventListener(
      "touchend",
      (e) => {
        if (!open || animatingSlide) return;
        const endY = e.changedTouches[0]?.clientY || 0;
        const delta = touchStartY - endY;
        if (Math.abs(delta) < 48) return;
        if (delta > 0) goToSlide(currentIndex + 1, 1);
        else goToSlide(currentIndex - 1, -1);
      },
      { passive: true }
    );

    document.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSlide(currentIndex + 1, 1);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSlide(currentIndex - 1, -1);
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = focusables();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  };

  if (reduced || typeof gsap === "undefined") {
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
    document.querySelectorAll(".hero-line > span").forEach((el) => (el.style.transform = "none"));
    document.querySelectorAll(".portrait").forEach((el) => (el.style.clipPath = "none"));
    document.querySelectorAll(".statement .w").forEach((el) => el.classList.add("is-on"));
    initWorkModal(false);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const EASE = "expo.out";
  initWorkModal(true);

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
