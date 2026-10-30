document.addEventListener("DOMContentLoaded", () => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const menu = document.querySelector(".main-nav");
    const menuButton = document.querySelector(".menu-toggle");

    function closeMenu() {
        menu.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Abrir menú");
    }

    menuButton.addEventListener("click", () => {
        const open = menu.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(open));
        menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

    // Contenido visible sin JavaScript; la animación se activa al observarlo.
    if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle("is-visible", entry.isIntersecting);
            });
        }, { threshold: 0.08 });
        document.querySelectorAll(".reveal").forEach(element => {
            element.classList.add("animate-reveal");
            observer.observe(element);
        });
    }

    const techPause = document.querySelector(".tech-pause");
    if (techPause) {
        techPause.addEventListener("click", () => {
            const paused = document.querySelector(".tech-track").classList.toggle("is-paused");
            techPause.setAttribute("aria-pressed", String(paused));
            techPause.textContent = paused ? "Reanudar carrusel" : "Pausar carrusel";
        });
    }

    const track = document.querySelector(".package-track");
    if (track) {
        const cards = [...track.querySelectorAll(".package-card")];
        const dots = [...document.querySelectorAll("[data-slide]")];
        let current = 0;

        function goTo(index) {
            current = (index + cards.length) % cards.length;
            track.scrollTo({
                left: cards[current].offsetLeft - cards[0].offsetLeft,
                behavior: reducedMotion.matches ? "instant" : "smooth"
            });
        }

        document.querySelectorAll("[data-direction]").forEach(button => {
            button.addEventListener("click", () => goTo(current + Number(button.dataset.direction)));
        });
        dots.forEach(button => button.addEventListener("click", () => goTo(Number(button.dataset.slide))));
        track.addEventListener("scroll", () => {
            const step = cards[1].offsetLeft - cards[0].offsetLeft;
            current = Math.min(cards.length - 1, Math.round(track.scrollLeft / step));
            dots.forEach((button, index) => button.setAttribute("aria-pressed", String(index === current)));
        }, { passive: true });
        document.querySelectorAll(".package-choice").forEach(link => {
            link.addEventListener("click", () => {
                const name = link.closest(".package-card").querySelector("h3").textContent.trim();
                document.querySelector('[name="mensaje"]').value = `Me interesa el paquete ${name}. Mi proyecto es: `;
            });
        });
    }

    // La selección de una póliza se conserva al bajar al formulario.
    document.querySelectorAll(".policy-choice").forEach(link => {
        link.addEventListener("click", () => {
            const policy = link.dataset.policy;
            document.querySelector('[name="poliza"]').value = policy;
            document.querySelector("#policy-status").textContent = `Póliza ${policy} seleccionada.`;
        });
    });

    const phone = "525535114536";
    function openWhatsApp(message) {
        window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    }

    document.querySelector("#contact-form").addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const message = [
            `Hola, soy ${data.get("nombre")}.`,
            `Servicio: ${data.get("servicio")}`,
            `Tipo: ${data.get("tipo")}`,
            ...(data.has("poliza") ? [`Póliza: ${data.get("poliza")}`] : []),
            `Correo: ${data.get("correo")}`,
            `Teléfono: ${data.get("telefono") || "No indicado"}`,
            `Empresa o proyecto: ${data.get("empresa") || "No indicado"}`,
            "",
            data.get("mensaje")
        ].join("\n");
        openWhatsApp(message);
    });

    const chatButton = document.querySelector(".chat-toggle");
    const chatPanel = document.querySelector("#chat-panel");
    chatButton.addEventListener("click", () => {
        chatPanel.hidden = !chatPanel.hidden;
        chatButton.setAttribute("aria-expanded", String(!chatPanel.hidden));
        chatButton.setAttribute("aria-label", chatPanel.hidden ? "Abrir contacto por WhatsApp" : "Cerrar contacto por WhatsApp");
        if (!chatPanel.hidden) document.querySelector("#chat-message").focus();
    });
    document.querySelector("#chat-form").addEventListener("submit", event => {
        event.preventDefault();
        openWhatsApp(document.querySelector("#chat-message").value);
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (menu.classList.contains("is-open")) {
                closeMenu();
                menuButton.focus();
            }
            if (!chatPanel.hidden) {
                chatPanel.hidden = true;
                chatButton.setAttribute("aria-expanded", "false");
                chatButton.focus();
            }
        }
    });
    document.querySelector("[data-year]").textContent = new Date().getFullYear();
});
