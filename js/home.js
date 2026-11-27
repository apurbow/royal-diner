(() => {
    "use strict";

    const CART_KEY = "cart";
    const MAX_QUANTITY = 99;
    const FEATURED_IDS = [
        "royal-mixed-plate",
        "royal-demi-glace-omurice",
        "slow-cooked-beef-stew",
        "garlic-butter-beef-steak",
        "royal-seafood-plate",
        "classic-omurice",
        "classic-hamburg-steak",
        "napolitan-pasta"
    ];
    const CATEGORY_SHORTCUTS = [
        { category: "Rice & Omurice", itemId: "royal-demi-glace-omurice" },
        { category: "Steak & Hamburg", itemId: "garlic-butter-beef-steak" },
        { category: "Pasta & Oven-Baked", itemId: "napolitan-pasta" },
        { category: "Curry & Stews", itemId: "japanese-beef-curry" },
        { category: "Desserts", itemId: "vanila-swiss-roll" }
    ];
    let toastTimer = null;

    const byId = id => document.getElementById(id);
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const money = value => `¥${Math.max(0, Number(value) || 0).toLocaleString("ja-JP")}`;

    document.addEventListener("DOMContentLoaded", initHomePage);
    window.addEventListener("cart:updated", updateHomeCartReminder);
    window.addEventListener("language:changed", () => {
        if (!byId("homeFeaturedTrack")) return;
        renderFeaturedItems();
        renderCategoryShortcuts();
        updateHomeCartReminder();
    });
    window.addEventListener("storage", event => {
        if (event.key === CART_KEY || event.key === null) updateHomeCartReminder();
    });

    function initHomePage() {
        if (!byId("homeFeaturedTrack")) return;
        renderFeaturedItems();
        renderCategoryShortcuts();
        setupCarouselControls();
        setupHomeActions();
        updateHomeCartReminder();
    }

    function getMenuItems() {
        return typeof MENU_ITEMS !== "undefined" && Array.isArray(MENU_ITEMS) ? MENU_ITEMS : [];
    }

    function renderFeaturedItems() {
        const track = byId("homeFeaturedTrack");
        const items = getMenuItems();
        const featured = FEATURED_IDS.map(id => items.find(item => item.id === id)).filter(Boolean);
        if (!featured.length) {
            track.innerHTML = '<p class="home-empty-message">Explore our complete menu to find your next favourite.</p>';
            return;
        }

        track.innerHTML = featured.map(item => {
            const signature = Boolean(item.royalSelection);
            return `<article class="home-food-card" data-home-item="${escapeHTML(item.id)}">
                <figure class="home-food-photo">
                    <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy">
                    <span class="home-food-tag">${signature ? "Royal Selection" : "Popular Pick"}</span>
                </figure>
                <div class="home-food-body">
                    <p class="home-food-category">${escapeHTML(item.category)}</p>
                    <h3 class="home-food-name">${escapeHTML(item.name)}</h3>
                    <p class="home-food-description">${escapeHTML(item.description)}</p>
                    <div class="home-food-bottom">
                        <strong class="home-food-price">${money(item.price)}</strong>
                        <button class="home-add-button" type="button" data-home-add="${escapeHTML(item.id)}" aria-label="Add ${escapeHTML(item.name)} to cart"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add to Cart</button>
                    </div>
                </div>
            </article>`;
        }).join("");

        track.querySelectorAll("img").forEach(image => {
            image.addEventListener("error", () => image.closest(".home-food-photo")?.classList.add("is-image-missing"), { once: true });
        });
        updateCarouselControls();
    }

    function renderCategoryShortcuts() {
        const root = byId("homeCategoryGrid");
        const items = getMenuItems();
        const categories = CATEGORY_SHORTCUTS.map(entry => ({
            ...entry,
            item: items.find(item => item.id === entry.itemId)
        })).filter(entry => entry.item);

        if (!categories.length) {
            root.innerHTML = '<p class="home-empty-message">Browse the full menu to explore every category.</p>';
            return;
        }

        root.innerHTML = categories.map(entry => {
            const query = `?category=${encodeURIComponent(entry.category)}#menuCategories`;
            return `<a class="home-category-card" href="menu.html${escapeHTML(query)}" aria-label="Browse ${escapeHTML(entry.category)}">
                <figure class="home-category-photo"><img src="${escapeHTML(entry.item.image)}" alt="" loading="lazy"></figure>
                <span class="home-category-name">${escapeHTML(entry.category)} <i class="bi bi-arrow-up-right" aria-hidden="true"></i></span>
            </a>`;
        }).join("");

        root.querySelectorAll("img").forEach(image => {
            image.addEventListener("error", () => image.closest(".home-category-photo")?.classList.add("is-image-missing"), { once: true });
        });
    }

    function setupCarouselControls() {
        const track = byId("homeFeaturedTrack");
        byId("homeCarouselPrev")?.addEventListener("click", () => scrollFeatured(-1));
        byId("homeCarouselNext")?.addEventListener("click", () => scrollFeatured(1));
        track?.addEventListener("scroll", updateCarouselControls, { passive: true });
        window.addEventListener("resize", updateCarouselControls, { passive: true });
    }

    function scrollFeatured(direction) {
        const track = byId("homeFeaturedTrack");
        if (!track) return;
        const card = track.querySelector(".home-food-card");
        const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 20;
        const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth * .8;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        track.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function updateCarouselControls() {
        const track = byId("homeFeaturedTrack");
        const previous = byId("homeCarouselPrev");
        const next = byId("homeCarouselNext");
        if (!track || !previous || !next) return;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        previous.disabled = track.scrollLeft <= 3;
        next.disabled = track.scrollLeft >= maxScroll - 3 || maxScroll <= 3;
    }

    function setupHomeActions() {
        byId("homeFeaturedTrack")?.addEventListener("click", event => {
            const button = event.target.closest("[data-home-add]");
            if (button) addHomeItemToCart(button.dataset.homeAdd, button);
        });
        byId("homeOpenCart")?.addEventListener("click", () => {
            const cartButton = byId("cartOpenButton");
            if (cartButton) cartButton.click();
            else window.location.href = "order.html#checkout";
        });
    }

    function readCart() {
        let cart = [];
        if (typeof getFromStorage === "function") cart = getFromStorage(CART_KEY, []);
        else {
            try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
            catch { cart = []; }
        }
        return Array.isArray(cart) ? cart.filter(item => item && typeof item.id === "string") : [];
    }

    function addHomeItemToCart(itemId, button) {
        const item = getMenuItems().find(menuItem => menuItem.id === itemId);
        if (!item) return;
        const cart = readCart();
        const existing = cart.find(cartItem => cartItem.id === item.id);
        if (existing) {
            existing.quantity = Math.min(MAX_QUANTITY, Math.max(1, Number(existing.quantity) || 1) + 1);
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                category: item.category,
                description: item.description,
                details: item.details,
                price: Number(item.price) || 0,
                image: item.image,
                quantity: 1
            });
        }

        const saved = typeof saveToStorage === "function"
            ? saveToStorage(CART_KEY, cart)
            : fallbackSaveCart(cart);
        if (!saved) {
            showHomeToast("Your cart could not be saved. Please try again.");
            return;
        }

        if (typeof refreshCartCount === "function") refreshCartCount();
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart, source: "home" } }));
        showHomeToast(`${item.name} added to your cart.`);
        if (button) {
            const original = button.innerHTML;
            button.innerHTML = '<i class="bi bi-check2" aria-hidden="true"></i> Added';
            button.disabled = true;
            window.setTimeout(() => {
                if (!button.isConnected) return;
                button.innerHTML = original;
                button.disabled = false;
            }, 900);
        }
    }

    function fallbackSaveCart(cart) {
        try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); return true; }
        catch (error) { console.error("Unable to save cart:", error); return false; }
    }

    function updateHomeCartReminder() {
        const root = byId("homeCartCount");
        if (!root) return;
        const quantity = readCart().reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
        root.textContent = quantity;
        const reminder = byId("homeOpenCart");
        if (reminder) reminder.setAttribute("aria-label", `Open your shopping cart, ${quantity} ${quantity === 1 ? "item" : "items"} selected`);
    }

    function showHomeToast(message) {
        const toast = byId("homeToast");
        if (!toast) return;
        toast.textContent = message;
        toast.hidden = false;
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2800);
    }
})();
