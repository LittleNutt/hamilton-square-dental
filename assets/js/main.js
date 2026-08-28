const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav__links a");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const currentPage = document.body.dataset.page || "home";
document.querySelectorAll("[data-nav]").forEach((link) => {
  if (link.dataset.nav === currentPage) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    document.querySelectorAll("[data-service-group]").forEach((card) => {
      card.hidden = group !== "all" && card.dataset.serviceGroup !== group;
    });
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".faq-item");
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll("[data-before-after]").forEach((card) => {
  const slider = card.querySelector(".before-after-slider");
  const range = card.querySelector(".before-after-slider__range");
  if (!slider || !range) return;

  const updateSlider = () => {
    const value = Math.min(100, Math.max(0, Number(range.value) || 0));
    slider.style.setProperty("--position", `${value}%`);
  };

  range.addEventListener("input", updateSlider);
  range.addEventListener("change", updateSlider);
  updateSlider();
});

const techStory = document.querySelector("[data-tech-story]");
if (techStory) {
  const techImage = techStory.querySelector("[data-tech-image]");
  const techKicker = techStory.querySelector("[data-tech-kicker]");
  const techTitle = techStory.querySelector("[data-tech-title]");
  const techCopy = techStory.querySelector("[data-tech-copy]");
  const techTriggers = techStory.querySelectorAll("[data-tech-trigger]");

  const setActiveTech = (trigger) => {
    techTriggers.forEach((item) => {
      const isActive = item === trigger;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    if (techImage) {
      swapImage(techImage, trigger.dataset.techSrc, { fade: true });
      techImage.alt = trigger.dataset.techAlt || techImage.alt;
    }
    if (techKicker) techKicker.textContent = trigger.dataset.techKicker || "";
    if (techTitle) techTitle.textContent = trigger.dataset.techTitle || "";
    if (techCopy) techCopy.textContent = trigger.dataset.techCopy || "";
  };

  techTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-pressed", String(trigger.classList.contains("is-active")));
    trigger.addEventListener("click", () => setActiveTech(trigger));
  });
}

const contactForm = document.querySelector("[data-contact-form]");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const name = `${data.get("firstName") || ""} ${data.get("lastName") || ""}`.trim();
    const phone = data.get("phone") || "";
    const email = data.get("email") || "";
    const interest = data.get("interest") || "Appointment request";
    const message = data.get("message") || "";
    const status = contactForm.querySelector(".form-status");

    if (!name || !phone || !email) {
      status.textContent = "Please complete your name, phone number, and email.";
      return;
    }

    const subject = encodeURIComponent(`Hamilton Square Dental: ${interest}`);
    const bodyText = encodeURIComponent(
      `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nInterest: ${interest}\n\nMessage:\n${message}`
    );
    status.textContent = "Opening your email app with the appointment details.";
    window.location.href = `mailto:dr.tsai@hamiltonsquaredental.com?subject=${subject}&body=${bodyText}`;
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

function swapImage(image, src, options = {}) {
  if (!image || !src || image.getAttribute("src") === src) return;
  if (options.fade && hasGSAP && !prefersReducedMotion) {
    gsap.killTweensOf(image, "autoAlpha,opacity,visibility");
    gsap.to(image, {
      autoAlpha: 0,
      duration: 0.16,
      ease: "power2.out",
      onComplete: () => {
        image.setAttribute("src", src);
        gsap.to(image, {
          autoAlpha: options.opacity ?? 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
    return;
  }
  image.setAttribute("src", src);
}

if (document.body.dataset.page === "home" && hasGSAP && !prefersReducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".hero .eyebrow, .hero h1, .hero__lead, .hero__actions", {
    y: 28,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.08
  });

  gsap.to("[data-hero-parallax]", {
    yPercent: -8,
    scale: 1.045,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true
    }
  });

  const storySteps = gsap.utils.toArray("[data-story-step]");
  storySteps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 58%",
      end: "bottom 42%",
      onEnter: () => setActiveStoryStep(step),
      onEnterBack: () => setActiveStoryStep(step)
    });

    const panel = step.querySelector("[data-story-panel]");
    const panelImage = panel?.querySelector("img");

    if (panel && panelImage) {
      gsap.fromTo(
        panel,
        { clipPath: "inset(10% 0 10% 0)", y: 44 },
        {
          clipPath: "inset(0% 0 0% 0)",
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: step,
            start: "top 82%",
            end: "center 46%",
            scrub: true
          }
        }
      );

      gsap.fromTo(
        panelImage,
        { scale: 1.14, yPercent: 8 },
        {
          scale: 1.02,
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: step,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }
  });

  gsap.from(".home-service-line", {
    x: 32,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.08,
    scrollTrigger: {
      trigger: ".home-services-showcase",
      start: "top 62%"
    }
  });

  gsap.from("[data-doctor-reveal] img", {
    clipPath: "inset(12% 0 12% 0)",
    scale: 1.08,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".home-doctor-scene",
      start: "top 62%"
    }
  });

  const quotes = gsap.utils.toArray("[data-review-quote]");
  let activeQuoteIndex = 0;
  if (quotes.length) {
    setActiveQuote(quotes, quotes[0]);
  }
  ScrollTrigger.create({
    trigger: ".home-review-stage",
    start: "top 70%",
    end: "bottom 30%",
    onUpdate: (self) => {
      const nextIndex = Math.min(quotes.length - 1, Math.floor(self.progress * quotes.length));
      if (nextIndex !== activeQuoteIndex) {
        activeQuoteIndex = nextIndex;
        setActiveQuote(quotes, quotes[nextIndex]);
      }
    }
  });
}

function setActiveStoryStep(step) {
  document.querySelectorAll("[data-story-step]").forEach((item) => {
    item.classList.toggle("is-active", item === step);
  });
}

function setActiveQuote(quotes, activeQuote) {
  quotes.forEach((quote) => {
    const isActive = quote === activeQuote;
    quote.classList.toggle("is-active", isActive);
    if (hasGSAP && !prefersReducedMotion) {
      gsap.to(quote, {
        autoAlpha: isActive ? 1 : 0,
        y: isActive ? 0 : 24,
        duration: 0.45,
        ease: "power2.out"
      });
    }
  });
}

const serviceLines = document.querySelectorAll("[data-service-line]");

function setActiveServiceLine(line) {
  serviceLines.forEach((item) => {
    item.classList.toggle("is-active", item === line);
  });
}

serviceLines.forEach((line) => {
  line.addEventListener("mouseenter", () => {
    setActiveServiceLine(line);
  });

  line.addEventListener("focus", () => {
    setActiveServiceLine(line);
  });
});

if (document.body.dataset.page === "home" && hasGSAP && !prefersReducedMotion) {
  serviceLines.forEach((line) => {
    ScrollTrigger.create({
      trigger: line,
      start: "top 58%",
      end: "bottom 42%",
      onEnter: () => setActiveServiceLine(line),
      onEnterBack: () => setActiveServiceLine(line)
    });
  });

}
