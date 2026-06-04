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
  }, { passive: true });

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

  // As animações do gráfico (traçado da linha + pulso do ponto) e o fade-in dos
  // cards agora são feitos por CSS (keyframes + .reveal). Isso eliminou a
  // dependência de three.js, tsParticles e GSAP, que carregavam ~940 KB de
  // JavaScript para alimentar elementos que o CSS já deixa ocultos.

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

  // ================================================================
  // POPUP DE STATUS — feedback central do envio do formulário
  // ================================================================
  const statusModal = document.getElementById("statusModal");
  const statusModalTitle = document.getElementById("statusModalTitle");
  const statusModalText = document.getElementById("statusModalText");
  const statusModalIcon = statusModal?.querySelector("[data-status-icon]");
  const statusCloseEls = statusModal?.querySelectorAll("[data-status-close]");

  const STATUS_ICONS = { success: "✓", error: "✕", warning: "!" };

  const showStatus = (state, title, message) => {
    if (!statusModal) return;
    statusModal.setAttribute("data-status-state", state);
    if (statusModalIcon) statusModalIcon.textContent = STATUS_ICONS[state] || "!";
    if (statusModalTitle) statusModalTitle.textContent = title;
    if (statusModalText) statusModalText.textContent = message;
    statusModal.classList.add("is-open");
    statusModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeStatus = () => {
    if (!statusModal) return;
    statusModal.classList.remove("is-open");
    statusModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  statusCloseEls?.forEach((el) => el.addEventListener("click", closeStatus));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (statusModal?.classList.contains("is-open")) closeStatus();
    if (leadModal?.classList.contains("is-open")) closeModal();
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
    const submitBtn = leadForm?.querySelector(".submit-btn");
    if (formFeedback) {
      formFeedback.textContent = "Enviando suas informações...";
      formFeedback.style.color = "var(--color-cyan)";
    }
    if (submitBtn) submitBtn.disabled = true;

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

      let result = {};
      try {
        result = await response.json();
      } catch (_) {
        // resposta sem JSON válido — tratamos pelo status HTTP abaixo
      }

      if (response.ok && result.success) {
        if (formFeedback) formFeedback.textContent = "";
        leadForm.reset();
        showStatus(
          "success",
          "Dados enviados com sucesso!",
          "Recebemos suas informações. Nossa equipe entrará em contato em breve."
        );
      } else {
        const motivo = result && result.message
          ? result.message
          : `O servidor respondeu com o status ${response.status} (${response.statusText || "erro"}).`;
        if (formFeedback) formFeedback.textContent = "";
        showStatus(
          "error",
          "Não foi possível enviar",
          `Ocorreu um erro ao enviar seus dados. Motivo: ${motivo} Por favor, tente novamente.`
        );
      }
    } catch (error) {
      const motivo = error?.name === "TimeoutError"
        ? "o tempo de conexão se esgotou (sem resposta do servidor)."
        : (error?.message || "falha na conexão de rede.");
      if (formFeedback) formFeedback.textContent = "";
      showStatus(
        "error",
        "Erro de conexão",
        `Não conseguimos enviar seus dados porque ${motivo} Verifique sua internet e tente novamente.`
      );
      console.error("[Webhook] Erro:", error);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
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

    const problems = [];

    // 1) Campos obrigatórios
    Object.keys(FIELD_LABELS).forEach((name) => {
      if (!leadData[name]) {
        setFieldInvalid(name, "Este campo é obrigatório.");
        problems.push(`${FIELD_LABELS[name]}: não preenchido`);
      }
    });

    // 2) Formato do e-mail (só valida se foi preenchido)
    if (leadData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadData.email)) {
      setFieldInvalid("email", "Informe um e-mail válido (ex.: nome@empresa.com).");
      problems.push("E-mail: formato inválido");
    }

    // 3) WhatsApp precisa ter ao menos 10 dígitos (DDD + número)
    const whatsappDigits = leadData.whatsapp.replace(/\D/g, "");
    if (leadData.whatsapp && whatsappDigits.length < 10) {
      setFieldInvalid("whatsapp", "Informe um WhatsApp válido com DDD.");
      problems.push("WhatsApp: número incompleto");
    }

    if (problems.length > 0) {
      formFeedback.textContent = "";
      showStatus(
        "warning",
        "Revise os dados do formulário",
        `Antes de enviar, corrija os seguintes pontos — ${problems.join("; ")}.`
      );
      return;
    }

    if (leadData.faturamento === "Até 29 mil") {
      openModal();
      return;
    }

    submitLead(leadData);
  });
});