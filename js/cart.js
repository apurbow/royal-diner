(() => {
    "use strict";

    const CART_KEY = "cart";
    const MAX_QUANTITY = 99;
    let returnFocusElement = null;
    let undoSnapshot = null;
    let toastTimer = null;
    let backdropTimer = null;
    let drawerIsOpen = false;

    const byId = id => document.getElementById(id);
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const money = value => `¥${Math.max(0, Number(value) || 0).toLocaleString("ja-JP")}`;

    function readCart() {
        const stored = typeof getFromStorage === "function"
            ? getFromStorage(CART_KEY, [])
            : readStorageFallback(CART_KEY, []);
        if (!Array.isArray(stored)) return [];

        return stored.filter(item => item && typeof item.id === "string" && typeof item.name === "string")
            .map(item => ({
                ...item,
                price: Number.isFinite(Number(item.price)) ? Math.max(0, Number(item.price)) : 0,
                quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(item.quantity) || 1)))
            }));
    }

    function readStorageFallback(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error("Unable to read cart storage:", error);
            return fallback;
        }
    }

    function writeCart(cart, announce = true) {
        const saved = typeof saveToStorage === "function"
            ? saveToStorage(CART_KEY, cart)
            : writeStorageFallback(CART_KEY, cart);
        if (!saved) {
            showCartToast("We could not save your cart. Please try again.");
            return false;
        }
        undoSnapshot = null;
        byId("cartToastUndo")?.setAttribute("hidden", "");
        renderCartDrawer();
        if (typeof refreshCartCount === "function") refreshCartCount();
        if (announce) {
            window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart, source: "cart-drawer" } }));
        }
        return true;
    }

    function writeStorageFallback(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Unable to save cart storage:", error);
            return false;
        }
    }

    function cartTotals(cart = readCart()) {
        return {
            count: cart.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };
    }

    function safeImagePath(value) {
        const path = String(value ?? "");
        return /^img\/menu\/[a-z0-9_-]+\.(?:jpg|jpeg|png|webp)$/i.test(path) ? path : "";
    }

    function renderCartDrawer() {
        const drawer = byId("cartDrawer");
        const itemsRoot = byId("cartItems");
        const emptyState = byId("cartEmptyState");
        const footer = byId("cartDrawerFooter");
        if (!drawer || !itemsRoot || !emptyState || !footer) return;

        const cart = readCart();
        const { count, subtotal } = cartTotals(cart);
        byId("cartDrawerCount").textContent = `${count} ${count === 1 ? "item" : "items"}`;
        byId("cartSubtotal").textContent = money(subtotal);
        emptyState.hidden = cart.length > 0;
        itemsRoot.hidden = cart.length === 0;
        footer.hidden = cart.length === 0;
        byId("cartClearConfirm").hidden = true;

        itemsRoot.innerHTML = cart.map((item, index) => {
            const image = safeImagePath(item.image);
            const itemId = escapeHTML(item.id);
            const name = escapeHTML(item.name);
            return `<article class="cart-item" data-cart-id="${itemId}">
                <div class="cart-item-image-wrap${image ? " has-image" : ""}">
                    <i class="bi bi-egg-fried cart-item-placeholder" aria-hidden="true"></i>
                    ${image ? `<img class="cart-item-image" src="${escapeHTML(image)}" alt="" loading="lazy">` : ""}
                </div>
                <div class="cart-item-main">
                    <div class="cart-item-heading">
                        <div><h3 class="cart-item-name">${name}</h3><p class="cart-item-unit-price">${money(item.price)} each</p></div>
                        <span class="cart-item-line-total">${money(item.price * item.quantity)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-control" role="group" aria-label="Quantity for ${name}">
                            <button type="button" data-cart-action="decrease" data-cart-index="${index}" aria-label="Decrease quantity of ${name}"><i class="bi bi-dash-lg" aria-hidden="true"></i></button>
                            <output aria-live="polite">${item.quantity}</output>
                            <button type="button" data-cart-action="increase" data-cart-index="${index}" aria-label="Increase quantity of ${name}"${item.quantity >= MAX_QUANTITY ? " disabled" : ""}><i class="bi bi-plus-lg" aria-hidden="true"></i></button>
                        </div>
                        <button class="cart-remove-button" type="button" data-cart-action="remove" data-cart-index="${index}">Remove</button>
                    </div>
                </div>
            </article>`;
        }).join("");

        itemsRoot.querySelectorAll(".cart-item-image").forEach(image => {
            image.addEventListener("error", () => {
                const wrap = image.closest(".cart-item-image-wrap");
                wrap?.classList.remove("has-image");
                image.remove();
            }, { once: true });
        });
    }

    function setBackgroundInert(value) {
        document.querySelectorAll("body > header, body > main, body > footer").forEach(element => {
            element.inert = value;
        });
    }

    function openCartDrawer(trigger = byId("cartOpenButton")) {
        const drawer = byId("cartDrawer");
        const backdrop = byId("cartBackdrop");
        if (!drawer || !backdrop) return;
        if (drawerIsOpen) return;

        returnFocusElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
        drawerIsOpen = true;
        renderCartDrawer();
        backdrop.hidden = false;
        window.clearTimeout(backdropTimer);
        requestAnimationFrame(() => backdrop.classList.add("is-visible"));
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        drawer.removeAttribute("inert");
        byId("cartOpenButton")?.setAttribute("aria-expanded", "true");
        document.body.classList.add("cart-drawer-open");
        setBackgroundInert(true);
        window.setTimeout(() => byId("cartDrawerClose")?.focus(), 30);
    }

    function closeCartDrawer(restoreFocus = true) {
        const drawer = byId("cartDrawer");
        const backdrop = byId("cartBackdrop");
        if (!drawer || !backdrop || !drawerIsOpen) return;
        drawerIsOpen = false;
        drawer.classList.remove("is-open");
        drawer.setAttribute("aria-hidden", "true");
        drawer.setAttribute("inert", "");
        backdrop.classList.remove("is-visible");
        byId("cartOpenButton")?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("cart-drawer-open");
        setBackgroundInert(false);
        backdropTimer = window.setTimeout(() => { backdrop.hidden = true; }, 240);
        if (restoreFocus && returnFocusElement instanceof HTMLElement && returnFocusElement.isConnected) {
            window.setTimeout(() => returnFocusElement.focus(), 0);
        }
    }

    function handleCartAction(button) {
        const cart = readCart();
        const index = Number(button.dataset.cartIndex);
        if (!Number.isInteger(index) || index < 0 || index >= cart.length) return;
        const item = cart[index];
        const action = button.dataset.cartAction;
        const itemId = item.id;

        if (action === "increase") {
            if (item.quantity >= MAX_QUANTITY) return;
            item.quantity += 1;
            if (writeCart(cart)) focusCartAction(itemId, action);
            return;
        }

        if (action === "decrease") {
            if (item.quantity > 1) {
                item.quantity -= 1;
                if (writeCart(cart)) focusCartAction(itemId, action);
                return;
            }
            removeItemAt(index, cart, item.name);
            return;
        }

        if (action === "remove") removeItemAt(index, cart, item.name);
    }

    function focusCartAction(itemId, action) {
        window.requestAnimationFrame(() => {
            const item = [...(byId("cartItems")?.querySelectorAll(".cart-item") || [])]
                .find(element => element.dataset.cartId === itemId);
            item?.querySelector(`[data-cart-action="${action}"]`)?.focus();
        });
    }

    function focusAfterRemoval(index) {
        window.requestAnimationFrame(() => {
            const remaining = [...(byId("cartItems")?.querySelectorAll(".cart-item") || [])];
            const nextItem = remaining[Math.min(index, remaining.length - 1)];
            const target = nextItem?.querySelector('[data-cart-action="decrease"]')
                || byId("cartEmptyState")?.querySelector("a[href]");
            target?.focus();
        });
    }

    function removeItemAt(index, currentCart, name) {
        const snapshot = currentCart.map(item => ({ ...item }));
        const nextCart = currentCart.filter((_, itemIndex) => itemIndex !== index);
        if (writeCart(nextCart)) {
            showCartToast(`${name} removed from your cart.`, snapshot);
            focusAfterRemoval(index);
        }
    }

    function clearCart() {
        const cart = readCart();
        if (!cart.length) return;
        if (writeCart([])) {
            showCartToast("Your cart has been cleared.", cart.map(item => ({ ...item })));
            window.requestAnimationFrame(() => byId("cartEmptyState")?.querySelector("a[href]")?.focus());
        }
    }

    function showCartToast(message, snapshot = null) {
        const toast = byId("cartToast");
        if (!toast) return;
        undoSnapshot = snapshot;
        byId("cartToastMessage").textContent = message;
        byId("cartToastUndo").hidden = !snapshot;
        toast.classList.add("is-visible");
        toast.setAttribute("aria-hidden", "false");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => {
            toast.classList.remove("is-visible");
            toast.setAttribute("aria-hidden", "true");
            undoSnapshot = null;
        }, 5500);
    }

    function setupCartDrawer() {
        if (!byId("cartDrawer")) return;
        byId("cartOpenButton")?.addEventListener("click", event => openCartDrawer(event.currentTarget));
        window.addEventListener("cart:open", event => openCartDrawer(event.detail?.trigger || document.activeElement));
        byId("cartDrawerClose")?.addEventListener("click", () => closeCartDrawer());
        byId("cartBackdrop")?.addEventListener("click", () => closeCartDrawer());
        byId("cartItems")?.addEventListener("click", event => {
            const button = event.target.closest("button[data-cart-action]");
            if (button) handleCartAction(button);
        });
        byId("cartClearButton")?.addEventListener("click", () => {
            byId("cartClearConfirm").hidden = false;
            byId("cartClearConfirmNo")?.focus();
        });
        byId("cartClearConfirmNo")?.addEventListener("click", () => {
            byId("cartClearConfirm").hidden = true;
            byId("cartClearButton")?.focus();
        });
        byId("cartClearConfirmYes")?.addEventListener("click", clearCart);
        byId("cartToastUndo")?.addEventListener("click", () => {
            if (!undoSnapshot) return;
            const snapshot = undoSnapshot.map(item => ({ ...item }));
            if (writeCart(snapshot)) showCartToast("Cart restored.");
        });
        byId("cartContinueShopping")?.addEventListener("click", () => closeCartDrawer());
        byId("cartCheckoutButton")?.addEventListener("click", event => {
            if (window.location.pathname.toLowerCase().endsWith("order.html")) {
                event.preventDefault();
                closeCartDrawer(false);
                window.dispatchEvent(new CustomEvent("order:show-checkout"));
                return;
            }
            closeCartDrawer(false);
        });

        document.addEventListener("keydown", event => {
            if (!drawerIsOpen) return;
            if (event.key === "Escape") {
                event.preventDefault();
                closeCartDrawer();
                return;
            }
            if (event.key !== "Tab") return;
            const drawer = byId("cartDrawer");
            const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
                .filter(element => !element.hidden && element.offsetParent !== null);
            if (!focusable.length) {
                event.preventDefault();
                byId("cartDrawerClose")?.focus();
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
        });

        window.addEventListener("storage", event => {
            if (event.key === CART_KEY || event.key === null) {
                undoSnapshot = null;
                byId("cartToastUndo")?.setAttribute("hidden", "");
                renderCartDrawer();
            }
        });
        window.addEventListener("cart:updated", event => {
            if (event.detail?.source !== "cart-drawer") {
                undoSnapshot = null;
                byId("cartToastUndo")?.setAttribute("hidden", "");
            }
            renderCartDrawer();
        });
        renderCartDrawer();
    }

    window.addEventListener("language:changed", () => {
        if (byId("cartDrawer")) renderCartDrawer();
    });
    document.addEventListener("DOMContentLoaded", setupCartDrawer);
})();
