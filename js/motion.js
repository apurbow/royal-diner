(() => {
    "use strict";

    const STORAGE_KEY = "royalDinerMotion";
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const revealSelectors = [
        // Home
        [".home-hero-copy > .home-eyebrow, .home-hero-copy > .home-hero-title, .home-hero-copy > .home-hero-tagline, .home-hero-copy > .home-hero-cta", "rise"],
        [".home-section-heading", "rise"],
        [".home-food-card, .home-category-card", "rise"],
        [".home-highlight-card", "rise"],
        [".home-order-panel", "rise"],
        [".home-order-option, .home-cart-reminder", "rise"],
        [".home-review-card", "rise"],
        [".home-faq-heading", "left"],
        [".home-faq-item", "rise"],
        [".home-about-link-row", "fade"],
        [".home-visit-panel", "rise"],

        // Menu
        [".menu-page-heading, .page-heading", "rise"],
        [".menu-categories", "fade"],
        [".menu-result-line", "fade"],
        [".menu-card", "rise"],

        // About
        [".about-hero-copy > .about-eyebrow, .about-hero-copy > .about-hero-title, .about-hero-copy > .about-hero-subtitle, .about-hero-copy > .about-hero-description, .about-hero-copy > .about-hero-actions", "rise"],
        [".about-story-block", "left"],
        [".about-concept-block", "right"],
        [".about-atmosphere-copy", "left"],
        [".about-section-heading, .about-gallery-heading, .about-visit-heading", "rise"],
        [".about-signature-photo", "image"],
        [".about-signature-item", "rise"],
        [".about-menu-button", "rise"],
        [".about-ingredients-panel", "rise"],
        [".about-gallery-card", "rise"],
        [".about-info-card", "rise"],
        [".about-final-cta", "rise"],

        // Checkout and reservations
        [".order-page-heading, .reservation-page-heading", "rise"],
        [".order-tabs, .reservation-tabs", "fade"],
        [".checkout-card, .reservation-card", "rise"],
        [".order-summary-card, .reservation-summary-card, .reservation-rules-card", "rise"],
        [".order-confirmation-card, .reservation-confirmation-card", "rise"],
        [".order-history-card, .reservation-history-card", "rise"],

        // Shared footer
        [".footer-main .row > div", "rise"]
    ];

    let manualPreference = readPreference();
    let motionEnabled = false;
    let observer = null;
    let mutationObserver = null;

    function readPreference() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved === "on" || saved === "off" ? saved : null;
        } catch (error) {
            return null;
        }
    }

    function savePreference(value) {
        manualPreference = value;
        try {
            localStorage.setItem(STORAGE_KEY, value);
        } catch (error) {
            console.warn("Motion preference could not be saved:", error);
        }
    }

    function systemRequiresReducedMotion() {
        return reduceMotionQuery.matches;
    }

    function updateMotionControls(systemReduced) {
        document.querySelectorAll("[data-motion-toggle]").forEach(button => {
            const label = button.querySelector("[data-motion-label]");
            const icon = button.querySelector("i");

            if (label) label.textContent = motionEnabled ? "Motion: On" : "Motion: Off";
            button.setAttribute("aria-pressed", String(motionEnabled));
            button.setAttribute("aria-label", systemReduced
                ? "Motion effects are disabled by your system setting"
                : motionEnabled ? "Turn motion effects off" : "Turn motion effects on");
            button.title = systemReduced
                ? "Motion effects are disabled by your system setting"
                : motionEnabled ? "Turn motion effects off" : "Turn motion effects on";
            button.disabled = systemReduced;

            if (icon) {
                icon.className = (motionEnabled || systemReduced)
                    ? "bi bi-pause-circle"
                    : "bi bi-play-circle";
            }
        });
    }

    function collectMatches(root, selector) {
        const matches = [];
        if (root instanceof Element && root.matches(selector)) matches.push(root);
        if (root.querySelectorAll) matches.push(...root.querySelectorAll(selector));
        return matches;
    }

    function createObserver() {
        if (!("IntersectionObserver" in window)) {
            observer = null;
            return;
        }

        try {
            observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    if (observer) observer.unobserve(entry.target);
                });
            }, {
                root: null,
                rootMargin: "-100px",
                threshold: 0.01
            });
        } catch (error) {
            observer = null;
        }
    }

    function prepareReveals(root = document.body) {
        if (!root || !motionEnabled) return;

        revealSelectors.forEach(([selector, type]) => {
            collectMatches(root, selector).forEach((element, index) => {
                if (!element.hasAttribute("data-motion-reveal")) {
                    element.setAttribute("data-motion-reveal", "");
                    element.setAttribute("data-motion-type", type);
                    element.style.setProperty("--motion-delay", `${Math.min(index % 6, 4) * 75}ms`);
                }

                // Re-observe existing elements too. This is required when Motion is turned off and on again.
                if (element.classList.contains("is-visible")) return;
                if (observer) observer.observe(element);
                else element.classList.add("is-visible");
            });
        });
    }

    function applyMotionState() {
        const systemReduced = systemRequiresReducedMotion();
        const wasEnabled = motionEnabled;
        motionEnabled = !systemReduced && manualPreference !== "off";

        document.body.classList.toggle("motion-ready", motionEnabled);
        document.body.classList.toggle("motion-disabled", !motionEnabled);
        document.documentElement.classList.toggle("motion-disabled", !motionEnabled);
        document.body.classList.toggle("motion-system-reduced", systemReduced);

        if (motionEnabled) {
            if (!wasEnabled || !observer) createObserver();
            prepareReveals(document.body);
        } else if (wasEnabled && observer) {
            observer.disconnect();
            observer = null;
        }

        updateMotionControls(systemReduced);
    }

    function bindMotionControls() {
        document.querySelectorAll("[data-motion-toggle]").forEach(button => {
            button.addEventListener("click", () => {
                if (systemRequiresReducedMotion()) return;
                savePreference(motionEnabled ? "off" : "on");
                applyMotionState();
            });
        });
    }

    function initMutationObserver() {
        if (!("MutationObserver" in window)) return;

        mutationObserver = new MutationObserver(records => {
            if (!motionEnabled) return;
            records.forEach(record => {
                record.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) prepareReveals(node);
                });
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    function startMotionSystem() {
        bindMotionControls();
        applyMotionState();
        initMutationObserver();

        if (typeof reduceMotionQuery.addEventListener === "function") {
            reduceMotionQuery.addEventListener("change", applyMotionState);
        } else if (typeof reduceMotionQuery.addListener === "function") {
            reduceMotionQuery.addListener(applyMotionState);
        }
    }

    function init() {
        if (document.documentElement.classList.contains("demo-gate-pending")) {
            document.addEventListener("demo:confirmed", startMotionSystem, { once: true });
            return;
        }
        startMotionSystem();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
