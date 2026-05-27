document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const header = document.querySelector(".site-header");
  const cursorGlow = document.querySelector(".cursor-glow");
  const magneticButtons = document.querySelectorAll(".magnetic");
  const revealItems = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll("[data-counter]");
  const leadForm = document.getElementById("leadForm");
  const formFeedback = document.getElementById("formFeedback");

  let currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.setAttribute("data-theme", currentTheme);

  const updateThemeIcon = () => {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      "aria-label",
      currentTheme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"
    );
    themeToggle.querySelector(".toggle-icon").textContent = currentTheme === "dark" ? "◐" : "◑";
  };

  updateThemeIcon();

  themeToggle?.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", currentTheme);
    updateThemeIcon();
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
    });
  });

  window.addEventListener("scroll", () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  });

  if (cursorGlow && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", (event) => {
      cursorGlow.style.opacity = "1";
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    });

    window.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
    });
  }

  magneticButtons.forEach((button) => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const moveX = (event.clientX - rect.left - rect.width / 2) * 0.12;
      const moveY = (event.clientY - rect.top - rect.height / 2) * 0.18;
      button.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0)";
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const decimals = Number(element.dataset.decimals || 0);
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  if (typeof tsParticles !== "undefined") {
    tsParticles.load("particles-bg", {
      background: { color: "transparent" },
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 48, density: { enable: true, area: 900 } },
        color: { value: ["#56f0ff", "#7b5cff", "#ff4fd8"] },
        shape: { type: "circle" },
        opacity: { value: { min: 0.08, max: 0.34 } },
        size: { value: { min: 1, max: 3.5 } },
        move: {
          enable: true,
          speed: 0.6,
          direction: "none",
          random: true,
          straight: false,
          outModes: { default: "out" }
        },
        links: {
          enable: true,
          distance: 120,
          color: "#7b5cff",
          opacity: 0.12,
          width: 1
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
          resize: { enable: true }
        },
        modes: {
          grab: {
            distance: 140,
            links: { opacity: 0.2 }
          }
        }
      },
      detectRetina: true
    });
  }

  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, heroVisual.clientWidth / heroVisual.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(heroVisual.clientWidth, heroVisual.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.zIndex = "-1";
    renderer.domElement.style.opacity = "0.88";
    heroVisual.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(4.8, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7b5cff,
      emissive: 0x24114a,
      metalness: 0.7,
      roughness: 0.22,
      wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0x66ccff, 1.1);
    const pointLight = new THREE.PointLight(0xff4fd8, 1.8, 100);
    pointLight.position.set(10, 8, 12);

    const pointLightTwo = new THREE.PointLight(0x56f0ff, 1.5, 100);
    pointLightTwo.position.set(-8, -5, 10);

    scene.add(ambientLight, pointLight, pointLightTwo);
    camera.position.z = 12;

    const animateMesh = () => {
      requestAnimationFrame(animateMesh);
      mesh.rotation.x += 0.0032;
      mesh.rotation.y += 0.0046;
      renderer.render(scene, camera);
    };

    animateMesh();

    window.addEventListener("resize", () => {
      const { clientWidth, clientHeight } = heroVisual;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    });
  }

  if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(".graph-path", {
      strokeDashoffset: 0,
      duration: 2.4,
      ease: "power3.out",
      delay: 0.4
    });

    gsap.to(".pulse", {
      scale: 1.35,
      transformOrigin: "center center",
      duration: 0.9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.utils.toArray(".service-card, .problem-card, .diff-item, .process-step, .testimonial-card").forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, filter: "blur(12px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true
          }
        }
      );
    });
  }

  const leadModal = document.getElementById("leadModal");
  const modalConfirmBtn = leadModal?.querySelector("[data-modal-confirm]");
  const modalDeclineBtn = leadModal?.querySelector("[data-modal-decline]");
  const modalCloseEls = leadModal?.querySelectorAll("[data-modal-close]");
  const modalViews = leadModal?.querySelectorAll("[data-modal-view]");

  const showModalView = (viewName) => {
    modalViews?.forEach((view) => {
      view.hidden = view.dataset.modalView !== viewName;
    });
  };

  const openModal = () => {
    if (!leadModal) return;
    showModalView("confirm");
    leadModal.classList.add("is-open");
    leadModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    if (!leadModal) return;
    leadModal.classList.remove("is-open");
    leadModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  modalCloseEls?.forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && leadModal?.classList.contains("is-open")) {
      closeModal();
    }
  });

  // ================================================================
  // WEBHOOK — Captura de leads para o dashboard
  // ================================================================
  const WEBHOOK_URL = "https://n8n.kaironcompany.com.br/webhook/kairon-leads";
  const WEBHOOK_API_KEY = "KaironCompany123@!";

  const getLeadData = () => {
    const formData = new FormData(leadForm);
    return {
      nome:        String(formData.get("nome")        || "").trim(),
      empresa:     String(formData.get("empresa")     || "").trim(),
      email:       String(formData.get("email")       || "").trim(),
      whatsapp:    String(formData.get("whatsapp")    || "").trim(),
      segmento:    String(formData.get("segmento")    || "").trim(),
      faturamento: String(formData.get("faturamento") || "").trim(),
      objetivo:    String(formData.get("objetivo")    || "").trim()
    };
  };

  const submitLead = async (leadData) => {
    if (formFeedback) {
      formFeedback.textContent = "Enviando suas informações...";
      formFeedback.style.color = "var(--color-cyan)";
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": WEBHOOK_API_KEY
        },
        body: JSON.stringify({
          name:    leadData.nome,
          company: leadData.empresa,
          email:   leadData.email,
          phone:   leadData.whatsapp,
          service: leadData.segmento,
          revenue: leadData.faturamento,
          message: leadData.objetivo,
          source:  "landing_page"
        }),
        signal: AbortSignal.timeout(15000)
      });

      const result = await response.json();

      if (result.success) {
        if (formFeedback) {
          formFeedback.textContent = "✅ Recebemos suas informações! Nossa equipe entrará em contato em breve.";
          formFeedback.style.color = "var(--color-cyan)";
        }
        leadForm.reset();
      } else {
        if (formFeedback) {
          formFeedback.textContent = "Ocorreu um erro ao enviar. Por favor, tente novamente.";
          formFeedback.style.color = "var(--color-error)";
        }
      }
    } catch (error) {
      if (formFeedback) {
        formFeedback.textContent = "Erro de conexão. Verifique sua internet e tente novamente.";
        formFeedback.style.color = "var(--color-error)";
      }
      console.error("[Webhook] Erro:", error);
    }
  };

  // Botão confirmar do modal
  modalConfirmBtn?.addEventListener("click", () => {
    closeModal();
    if (!leadForm) return;
    submitLead(getLeadData());
  });

  // Botão recusar do modal
  modalDeclineBtn?.addEventListener("click", () => {
    showModalView("decline");
  });

  // Rótulos amigáveis para mensagens de validação
  const FIELD_LABELS = {
    nome: "Nome",
    empresa: "Empresa / Marca",
    email: "E-mail",
    whatsapp: "WhatsApp",
    segmento: "Qual o seu momento?",
    faturamento: "Qual o faturamento mensal da sua empresa?",
    objetivo: "Objetivo principal"
  };

  const setFieldInvalid = (name, message) => {
    const input = leadForm?.querySelector(`[name="${name}"]`);
    if (!input) return;
    const field = input.closest(".field");
    if (!field) return;
    field.classList.add("is-invalid");
    const errorEl = field.querySelector(`.field-error[data-error-for="${name}"]`);
    if (errorEl) errorEl.textContent = message;
  };

  const clearFieldInvalid = (name) => {
    const input = leadForm?.querySelector(`[name="${name}"]`);
    if (!input) return;
    const field = input.closest(".field");
    if (!field) return;
    field.classList.remove("is-invalid");
    const errorEl = field.querySelector(`.field-error[data-error-for="${name}"]`);
    if (errorEl) errorEl.textContent = "";
  };

  const clearAllFieldErrors = () => {
    Object.keys(FIELD_LABELS).forEach(clearFieldInvalid);
  };

  // Limpa o erro de cada campo quando o usuário começa a digitar/alterar
  Object.keys(FIELD_LABELS).forEach((name) => {
    const input = leadForm?.querySelector(`[name="${name}"]`);
    if (!input) return;
    const events = input.tagName === "SELECT" ? ["change"] : ["input", "change"];
    events.forEach((evt) => input.addEventListener(evt, () => clearFieldInvalid(name)));
  });

  // Submissão do formulário
  leadForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!formFeedback) return;

    const leadData = getLeadData();

    clearAllFieldErrors();

    const missingFields = [];
    Object.keys(FIELD_LABELS).forEach((name) => {
      if (!leadData[name]) {
        setFieldInvalid(name, "Este campo é obrigatório.");
        missingFields.push(FIELD_LABELS[name]);
      }
    });

    if (missingFields.length > 0) {
      const lista = missingFields.length === 1
        ? `o campo "${missingFields[0]}"`
        : `os campos: ${missingFields.map((f) => `"${f}"`).join(", ")}`;
      formFeedback.textContent = `Faltou preencher ${lista}. Por favor, complete antes de enviar.`;
      formFeedback.style.color = "var(--color-error)";

      const firstInvalid = leadForm.querySelector(".field.is-invalid input, .field.is-invalid select, .field.is-invalid textarea");
      if (firstInvalid) {
        firstInvalid.focus({ preventScroll: false });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    if (leadData.faturamento === "Até 29 mil") {
      openModal();
      return;
    }

    submitLead(leadData);
  });
});