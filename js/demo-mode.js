(() => {
    "use strict";

    const CONFIG = window.ROYAL_DINER_DEMO_CONFIG || {};
    const STORAGE_KEY = CONFIG.STORAGE_KEY || "royalDinerDemoConfirmedAt";
    const CONFIRMATION_DAYS = Number(CONFIG.CONFIRMATION_DAYS) || 7;
    const MAX_LOADING_WAIT_MS = Number(CONFIG.MAX_LOADING_WAIT_MS) || 12000;
    const DAY_MS = 24 * 60 * 60 * 1000;

    const copy = {
        en: {
            kicker: "A NOTE BEFORE YOU EXPLORE",
            languageLabel: "Language",
            title: "Welcome to ROYAL DINER",
            intro: "Before you explore, please note that this is a demonstration website created for presentation purposes.",
            detailsHeading: "About this website",
            detailOne: "ROYAL DINER is fictional. Restaurant information, menu items, descriptions, photos and prices were created for this demonstration.",
            detailTwo: "Orders, delivery and pickup requests, and table reservations are simulations only. Nothing is sent to a restaurant or fulfilled.",
            detailThree: "No payment is collected.",
            detailFour: "Information entered into forms, along with cart, order and reservation details, is stored only in this browser. It is not sent to a server.",
            thanks: "Thank you for taking the time to explore ROYAL DINER.",
            confirm: "I Understand & Continue"
        },
        ja: {
            kicker: "ご利用前にご確認ください",
            languageLabel: "表示言語",
            title: "ROYAL DINERへようこそ",
            intro: "こちらは、作品の紹介と操作体験を目的として制作されたデモサイトです。ご利用前に、以下の内容をご確認ください。",
            detailsHeading: "このサイトについて",
            detailOne: "ROYAL DINERは架空のレストランです。店舗情報、メニュー、商品説明、写真、価格などは、すべてこのデモのために作成したものです。",
            detailTwo: "ご注文、配達・テイクアウトの申し込み、テーブル予約は操作体験用の模擬機能です。実際の店舗には送信されず、商品やサービスの提供も行われません。",
            detailThree: "実際のお支払いは発生しません。",
            detailFour: "フォームへの入力内容や、カート・注文・予約の情報は、このブラウザ内にのみ保存されます。サーバーへ送信されることはありません。",
            thanks: "ROYAL DINERをご覧いただき、ありがとうございます。",
            confirm: "確認してサイトを見る"
        }
    };

    let gate;
    let loader;
    let modal;
    let languageSelect;
    let confirmButton;
    let previousFocus = null;
    let currentModalLanguage = "en";
    let loadingFinished = false;
    let loadFallbackTimer = null;
    const pageState = new Map();

    function getStoredTimestamp() {
        try {
            const value = Number(localStorage.getItem(STORAGE_KEY));
            return Number.isFinite(value) ? value : 0;
        } catch (error) {
            return 0;
        }
    }

    function isConfirmationValid() {
        const confirmedAt = getStoredTimestamp();
        const age = Date.now() - confirmedAt;
        return confirmedAt > 0 && age >= 0 && age < CONFIRMATION_DAYS * DAY_MS;
    }

    function saveConfirmation() {
        try {
            localStorage.setItem(STORAGE_KEY, String(Date.now()));
            return true;
        } catch (error) {
            console.warn("Demo confirmation could not be saved in this browser:", error);
            return false;
        }
    }

    function getInitialModalLanguage() {
        const saved = typeof window.getSiteLanguage === "function" ? window.getSiteLanguage() : "";
        if (saved === "ja" || saved === "en") return saved;

        const browserLanguage = String(navigator.languages?.[0] || navigator.language || "").toLowerCase();
        return browserLanguage.startsWith("en") ? "en" : "ja";
    }

    function setText(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function renderModalLanguage(language) {
        currentModalLanguage = language === "ja" ? "ja" : "en";
        const t = copy[currentModalLanguage];

        setText("demoModalKicker", t.kicker);
        setText("demoLanguageLabel", t.languageLabel);
        setText("demoConfirmationTitle", t.title);
        setText("demoConfirmationIntro", t.intro);
        setText("demoDetailsHeading", t.detailsHeading);
        setText("demoDetailOne", t.detailOne);
        setText("demoDetailTwo", t.detailTwo);
        setText("demoDetailThree", t.detailThree);
        setText("demoDetailFour", t.detailFour);
        setText("demoConfirmationThanks", t.thanks);
        setText("demoConfirmButtonText", t.confirm);

        if (languageSelect) {
            languageSelect.value = currentModalLanguage;
            languageSelect.setAttribute("aria-label", t.languageLabel);
        }
        document.documentElement.setAttribute("data-demo-language", currentModalLanguage);
    }

    function setUnderlyingPageInert(inert) {
        [...document.body.children].forEach(child => {
            if (child.id === "demo-gate") return;

            if (inert) {
                if (!pageState.has(child)) {
                    pageState.set(child, {
                        hadInert: child.hasAttribute("inert"),
                        inertValue: child.getAttribute("inert"),
                        hadAriaHidden: child.hasAttribute("aria-hidden"),
                        ariaHiddenValue: child.getAttribute("aria-hidden")
                    });
                }
                child.inert = true;
                child.setAttribute("aria-hidden", "true");
                return;
            }

            const previous = pageState.get(child);
            if (!previous) return;
            child.inert = previous.hadInert;
            if (previous.hadInert) child.setAttribute("inert", previous.inertValue ?? "");
            else child.removeAttribute("inert");
            if (previous.hadAriaHidden) child.setAttribute("aria-hidden", previous.ariaHiddenValue ?? "");
            else child.removeAttribute("aria-hidden");
            pageState.delete(child);
        });
    }

    function trapFocus(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        if (event.key !== "Tab" || !modal) return;

        const focusable = [...modal.querySelectorAll('button:not([disabled]), select:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter(element => !element.hidden && element.getAttribute("aria-hidden") !== "true");
        if (!focusable.length) {
            event.preventDefault();
            modal.focus();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function showConfirmation() {
        if (loadingFinished || !gate || !document.documentElement.classList.contains("demo-gate-pending")) return;
        loadingFinished = true;
        if (loadFallbackTimer !== null) window.clearTimeout(loadFallbackTimer);

        const revealModal = () => {
            if (!gate || !document.documentElement.classList.contains("demo-gate-pending")) return;
            if (loader) { loader.setAttribute("aria-hidden", "true"); window.setTimeout(() => loader?.remove(), 540); }
            document.documentElement.classList.add("demo-gate-showing-confirmation");

            // First clear the logo animation; then bring the confirmation into the same background.
            window.setTimeout(() => {
                if (!gate || !document.documentElement.classList.contains("demo-gate-pending")) return;
                if (modal) {
                    modal.hidden = false;
                    modal.setAttribute("aria-hidden", "false");
                }
                window.requestAnimationFrame(() => {
                    document.documentElement.classList.add("demo-gate-modal-visible");
                    window.setTimeout(() => languageSelect?.focus({ preventScroll: true }), 140);
                    document.addEventListener("keydown", trapFocus, true);
                });
            }, 540);
        };

        // Let local fonts settle, but never keep the first-visit screen waiting indefinitely.
        if (document.fonts?.ready) {
            Promise.race([
                document.fonts.ready.catch(() => {}),
                new Promise(resolve => window.setTimeout(resolve, 1100))
            ]).then(revealModal);
        } else {
            revealModal();
        }
    }

    function releaseGate() {
        if (!gate || !document.documentElement.classList.contains("demo-gate-pending")) return;

        saveConfirmation();
        if (typeof window.setSiteLanguage === "function") {
            window.setSiteLanguage(currentModalLanguage, true);
        }

        document.removeEventListener("keydown", trapFocus, true);
        if (modal) modal.setAttribute("aria-hidden", "true");
        document.documentElement.classList.add("demo-gate-releasing");
        document.documentElement.classList.remove("demo-gate-pending", "demo-gate-showing-confirmation", "demo-gate-modal-visible");
        setUnderlyingPageInert(false);
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";

        window.dispatchEvent(new CustomEvent("demo:confirmed", {
            detail: { language: currentModalLanguage, confirmationDays: CONFIRMATION_DAYS }
        }));

        const finished = () => {
            gate?.remove();
            gate = null;
            document.documentElement.classList.remove("demo-gate-releasing");
            if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
        };
        window.setTimeout(finished, 680);
    }

    function bindEvents() {
        languageSelect?.addEventListener("change", () => renderModalLanguage(languageSelect.value));
        confirmButton?.addEventListener("click", releaseGate);
    }

    function init() {
        gate = document.getElementById("demo-gate");
        if (!gate) return;

        // A recent confirmation is checked in the document head to avoid a visible flash.
        if (!document.documentElement.classList.contains("demo-gate-pending") || isConfirmationValid()) {
            document.documentElement.classList.remove("demo-gate-pending");
            gate.remove();
            return;
        }

        loader = document.getElementById("demoLoader");
        modal = document.getElementById("demoConfirmation");
        languageSelect = document.getElementById("demoLanguageSelect");
        confirmButton = document.getElementById("demoConfirmButton");
        previousFocus = document.activeElement;

        setUnderlyingPageInert(true);
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";

        renderModalLanguage(getInitialModalLanguage());
        bindEvents();

        if (document.readyState === "complete") {
            showConfirmation();
        } else {
            window.addEventListener("load", showConfirmation, { once: true });
            loadFallbackTimer = window.setTimeout(showConfirmation, MAX_LOADING_WAIT_MS);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
