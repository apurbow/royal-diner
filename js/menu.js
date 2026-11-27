let activeMenuCategory = "All";
let menuSearchTerm = "";
let menuToastTimer = null;
let lastZoomTrigger = null;

window.addEventListener("DOMContentLoaded", initMenuPage);
window.addEventListener("language:changed", () => {
    if (!document.getElementById("menuGrid")) return;
    renderMenuCategories();
    renderMenuItems();
});

function initMenuPage() {
    const grid = document.getElementById("menuGrid");
    if (!grid || !Array.isArray(MENU_ITEMS) || !Array.isArray(MENU_CATEGORIES)) return;
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory && MENU_CATEGORIES.includes(requestedCategory)) activeMenuCategory = requestedCategory;
    renderMenuCategories();
    renderMenuItems();
    setupMenuSearch();
    setupMenuActions();
    setupImageZoom();
}

function renderMenuCategories() {
    const container = document.getElementById("menuCategories");
    container.innerHTML = MENU_CATEGORIES.map(category => {
        const active = category === activeMenuCategory;
        return `<button class="menu-category-btn${active ? " is-active" : ""}" type="button" data-category="${escapeMenuHTML(category)}" aria-pressed="${active}">${escapeMenuHTML(category)}</button>`;
    }).join("");

    container.querySelectorAll("[data-category]").forEach(button => {
        button.addEventListener("click", () => {
            activeMenuCategory = button.dataset.category;
            renderMenuCategories();
            renderMenuItems();
        });
    });
}

function renderMenuItems() {
    const grid = document.getElementById("menuGrid");
    const emptyState = document.getElementById("menuEmptyState");
    const query = menuSearchTerm.trim().toLocaleLowerCase();
    const filteredItems = MENU_ITEMS.filter(item => {
        const matchesCategory = activeMenuCategory === "All"
            || (activeMenuCategory === "Royal Selection" ? item.royalSelection : item.category === activeMenuCategory);
        const localized = typeof getLocalizedMenuField === "function" ? {
            name: getLocalizedMenuField(item.id, "name", item.name),
            description: getLocalizedMenuField(item.id, "description", item.description),
            details: getLocalizedMenuField(item.id, "details", item.details),
            category: typeof getLocalizedMenuCategory === "function" ? getLocalizedMenuCategory(item.category) : item.category
        } : item;
        const searchableText = `${item.name} ${item.category} ${item.description} ${item.details} ${localized.name} ${localized.category} ${localized.description} ${localized.details}`;
        const matchesSearch = !query || searchableText.toLocaleLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (activeMenuCategory === "All") {
        filteredItems.sort((first, second) => Number(Boolean(second.royalSelection)) - Number(Boolean(first.royalSelection)));
    }

    grid.innerHTML = filteredItems.map(createMenuCard).join("");
    document.getElementById("menuResultCount").textContent = `${filteredItems.length} ${filteredItems.length === 1 ? "item" : "items"}`;
    emptyState.hidden = filteredItems.length !== 0;
    grid.hidden = filteredItems.length === 0;

    grid.querySelectorAll(".menu-card-image").forEach(image => {
        const photo = image.closest(".menu-card-photo");
        image.addEventListener("load", () => photo.classList.add("image-ready"), { once: true });
        image.addEventListener("error", () => photo.classList.add("image-missing"), { once: true });
        if (image.complete && image.naturalWidth > 0) photo.classList.add("image-ready");
        else if (image.complete && image.naturalWidth === 0) photo.classList.add("image-missing");
    });
}

function createMenuCard(item) {
    const id = escapeMenuHTML(item.id);
    const name = escapeMenuHTML(item.name);
    const category = escapeMenuHTML(item.category);
    const description = escapeMenuHTML(item.description);
    const details = escapeMenuHTML(item.details);
    const image = escapeMenuHTML(item.image);
    const price = formatMenuPrice(item.price);
    const royalBadge = item.royalSelection ? '<span class="menu-signature-label">Royal Selection</span>' : "";

    return `<article class="menu-card" data-item-id="${id}">
        <div class="menu-card-photo">
            <img class="menu-card-image" src="${image}" alt="${name}" loading="lazy">
            <button class="menu-zoom-button" type="button" data-action="zoom" data-id="${id}" aria-label="Enlarge photo of ${name}" title="Enlarge photo"><i class="bi bi-zoom-in" aria-hidden="true"></i></button>
        </div>
        <div class="menu-card-body">
            ${royalBadge}
            <h2 class="menu-card-title">${name}</h2>
            <p class="menu-card-description">${description}</p>
            <p class="menu-card-price">${price}</p>
            <div class="menu-card-actions">
                <button class="menu-add-button" type="button" data-action="add" data-id="${id}"><i class="bi bi-plus-lg" aria-hidden="true"></i><span>Add to Cart</span></button>
                <button class="menu-info-button" type="button" data-action="info" data-id="${id}" aria-label="More information about ${name}" aria-expanded="false" aria-controls="food-info-${id}"><i class="bi bi-info-lg" aria-hidden="true"></i></button>
            </div>
        </div>
        <section class="menu-info-panel" id="food-info-${id}" data-info-panel="${id}" aria-hidden="true" aria-label="Details for ${name}">
            <span class="menu-info-category">${category}</span>
            <h2 class="menu-info-title">${name}</h2>
            <p class="menu-info-description">${description}</p>
            <h3 class="menu-info-subheading">Dish details</h3>
            <p class="menu-info-details">${details}</p>
            <p class="menu-info-price">${price}</p>
            <button class="menu-info-close" type="button" data-action="close-info" data-id="${id}"><i class="bi bi-x-lg" aria-hidden="true"></i> Close</button>
        </section>
    </article>`;
}

function setupMenuSearch() {
    const search = document.getElementById("menuSearch");
    const clearButton = document.getElementById("clearMenuSearch");
    const resetButton = document.getElementById("resetMenuFilters");

    search.addEventListener("input", () => {
        menuSearchTerm = search.value;
        clearButton.hidden = !search.value;
        renderMenuItems();
    });

    clearButton.addEventListener("click", () => {
        search.value = "";
        menuSearchTerm = "";
        clearButton.hidden = true;
        renderMenuItems();
        search.focus();
    });

    resetButton.addEventListener("click", () => {
        activeMenuCategory = "All";
        menuSearchTerm = "";
        search.value = "";
        clearButton.hidden = true;
        renderMenuCategories();
        renderMenuItems();
        search.focus();
    });
}

function setupMenuActions() {
    document.getElementById("menuGrid").addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const { action, id } = button.dataset;

        if (action === "add") addMenuItemToCart(id);
        if (action === "info") openFoodInfo(id);
        if (action === "close-info") closeFoodInfo(id);
        if (action === "zoom") openFoodImageZoom(id, button);
    });
}

function addMenuItemToCart(itemId) {
    const item = MENU_ITEMS.find(menuItem => menuItem.id === itemId);
    if (!item) return;

    const storedCart = getFromStorage("cart", []);
    const cart = Array.isArray(storedCart) ? storedCart : [];
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity = Math.max(1, Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            category: item.category,
            description: item.description,
            details: item.details,
            price: item.price,
            image: item.image,
            quantity: 1
        });
    }

    if (!saveToStorage("cart", cart)) {
        showMenuToast("We could not save your cart. Please try again.");
        return;
    }

    refreshCartCount();
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart } }));
    showMenuToast(`${item.name} added to your cart.`);
}

function openFoodInfo(itemId) {
    document.querySelectorAll(".menu-info-panel.is-open").forEach(panel => {
        const openId = panel.dataset.infoPanel;
        if (openId !== itemId) closeFoodInfo(openId, false);
    });

    const card = document.querySelector(`.menu-card[data-item-id="${CSS.escape(itemId)}"]`);
    const panel = card?.querySelector(`[data-info-panel="${CSS.escape(itemId)}"]`);
    const trigger = card?.querySelector(`[data-action="info"][data-id="${CSS.escape(itemId)}"]`);
    if (!panel || !trigger) return;

    const isOpen = panel.classList.contains("is-open");
    if (isOpen) {
        closeFoodInfo(itemId);
        return;
    }

    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    panel.querySelector(".menu-info-close")?.focus();
}

function closeFoodInfo(itemId, returnFocus = true) {
    const card = document.querySelector(`.menu-card[data-item-id="${CSS.escape(itemId)}"]`);
    const panel = card?.querySelector(`[data-info-panel="${CSS.escape(itemId)}"]`);
    const trigger = card?.querySelector(`[data-action="info"][data-id="${CSS.escape(itemId)}"]`);
    if (!panel) return;

    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    trigger?.setAttribute("aria-expanded", "false");
    if (returnFocus) trigger?.focus();
}

function setupImageZoom() {
    const dialog = document.getElementById("imageZoomDialog");
    const closeButton = document.getElementById("closeImageZoom");
    const zoomImage = document.getElementById("imageZoomImage");

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => {
        zoomImage.hidden = true;
        zoomImage.removeAttribute("src");
        lastZoomTrigger?.focus();
    });
    zoomImage.addEventListener("error", () => {
        zoomImage.hidden = true;
        if (dialog.open) dialog.close();
    });
}

function openFoodImageZoom(itemId, trigger) {
    const item = MENU_ITEMS.find(menuItem => menuItem.id === itemId);
    const card = trigger.closest(".menu-card");
    const sourceImage = card?.querySelector(".menu-card-image");
    const photo = sourceImage?.closest(".menu-card-photo");
    const dialog = document.getElementById("imageZoomDialog");
    const zoomImage = document.getElementById("imageZoomImage");
    if (!item || !sourceImage || !photo?.classList.contains("image-ready")) return;

    lastZoomTrigger = trigger;
    zoomImage.alt = item.name;
    zoomImage.src = sourceImage.currentSrc || sourceImage.src;
    zoomImage.hidden = false;
    document.getElementById("imageZoomCaption").textContent = item.name;
    if (!dialog.open) dialog.showModal();
}

function showMenuToast(message) {
    const toast = document.getElementById("menuToast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(menuToastTimer);
    menuToastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function formatMenuPrice(price) {
    return `¥${Number(price).toLocaleString("ja-JP")}`;
}

function escapeMenuHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
