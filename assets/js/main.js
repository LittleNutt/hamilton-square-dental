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
