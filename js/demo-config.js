(() => {
    "use strict";

    const CONFIG = Object.freeze({
        STORAGE_KEY: "royalDinerDemoConfirmedAt",
        CONFIRMATION_DAYS: 7,
        MAX_LOADING_WAIT_MS: 12000
    });

    window.ROYAL_DINER_DEMO_CONFIG = CONFIG;

    const validFor = CONFIG.CONFIRMATION_DAYS * 24 * 60 * 60 * 1000;
    try {
        const confirmedAt = Number(localStorage.getItem(CONFIG.STORAGE_KEY));
        const age = Date.now() - confirmedAt;
        if (confirmedAt > 0 && age >= 0 && age < validFor) {
            document.documentElement.classList.remove("demo-gate-pending");
        }
    } catch (error) {
        // Keep the first-visit gate active when browser storage is unavailable.
    }
})();
