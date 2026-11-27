document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".current-year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });
    setActiveNavigation();
    updateCartCount();
    setupMobileNavigation();
});

window.addEventListener("storage", event => {
    if (event.key === "cart" || event.key === null) updateCartCount();
});
window.addEventListener("cart:updated", updateCartCount);

function setActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
    document.querySelectorAll("[data-page]").forEach(link => {
        const linkPage = link.getAttribute("href").split("/").pop().toLowerCase();
        link.classList.toggle("active", linkPage === currentPage);
    });
}

function updateCartCount() {
    const badge = document.getElementById("cartCount");
    if (!badge) return;
    const cart = getFromStorage("cart", []);
    const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0) : 0;
    badge.textContent = total;
    badge.style.display = total > 0 ? "flex" : "none";
}

function refreshCartCount() {
    updateCartCount();
}

function setupMobileNavigation() {
    const navigation = document.getElementById("mainNavigation");
    if (!navigation) return;
    navigation.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth >= 992 || !window.bootstrap?.Collapse) return;
            window.bootstrap.Collapse.getInstance(navigation)?.hide();
        });
    });
}

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error("Unable to save browser storage data:", error);
        return false;
    }
}

function getFromStorage(key, defaultValue = null) {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue === null ? defaultValue : JSON.parse(storedValue);
    } catch (error) {
        console.error("Unable to read browser storage data:", error);
        return defaultValue;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Unable to remove browser storage data:", error);
        return false;
    }
}
