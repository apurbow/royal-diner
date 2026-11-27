(() => {
    "use strict";

    const CART_KEY = "cart";
    const ORDERS_KEY = "orders";
    const DELIVERY_FEE = 300;
    const MAX_QUANTITY = 99;
    let currentStep = 1;
    let currentOrderId = null;
    let currentFilter = "all";
    let isSubmitting = false;
    let previousDetailTrigger = null;

    const byId = id => document.getElementById(id);
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
    const money = value => `¥${Math.max(0, Number(value) || 0).toLocaleString("ja-JP")}`;

    function getStored(key, fallback) {
        if (typeof getFromStorage === "function") return getFromStorage(key, fallback);
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error(`Unable to read ${key}:`, error);
            return fallback;
        }
    }

    function saveStored(key, value) {
        if (typeof saveToStorage === "function") return saveToStorage(key, value);
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Unable to save ${key}:`, error);
            return false;
        }
    }

    function getCart() {
        const stored = getStored(CART_KEY, []);
        if (!Array.isArray(stored)) return [];
        return stored.filter(item => item && typeof item.id === "string" && typeof item.name === "string")
            .map(item => ({
                id: item.id,
                name: item.name,
                category: String(item.category ?? ""),
                description: String(item.description ?? ""),
                details: String(item.details ?? ""),
                price: Number.isFinite(Number(item.price)) ? Math.max(0, Number(item.price)) : 0,
                image: String(item.image ?? ""),
                quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(Number(item.quantity) || 1)))
            }));
    }

    function getOrders() {
        const orders = getStored(ORDERS_KEY, []);
        return Array.isArray(orders) ? orders.filter(order => order && typeof order.id === "string") : [];
    }

    function selectedOrderType() {
        return document.querySelector('input[name="orderType"]:checked')?.value || "pickup";
    }

    function selectedTimeMode() {
        return document.querySelector('input[name="requestedTimeMode"]:checked')?.value || "asap";
    }

    function calculateTotals(cart = getCart(), orderType = selectedOrderType()) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const deliveryFee = orderType === "delivery" && cart.length ? DELIVERY_FEE : 0;
        return { itemCount, subtotal, deliveryFee, total: subtotal + deliveryFee };
    }

    function renderOrderSummary() {
        const cart = getCart();
        const totals = calculateTotals(cart);
        byId("orderSummaryCount").textContent = `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"} selected`;
        byId("orderSummarySubtotal").textContent = money(totals.subtotal);
        byId("orderSummaryFee").textContent = money(totals.deliveryFee);
        byId("orderSummaryTotal").textContent = money(totals.total);
        byId("orderSummaryFeeLabel").textContent = selectedOrderType() === "delivery" ? "Delivery fee" : "Delivery fee";

        byId("orderSummaryItems").innerHTML = cart.map(item => `<div class="order-summary-item">
            <div class="order-summary-item-name"><strong>${escapeHTML(item.name)}</strong><span>Qty ${item.quantity} · ${money(item.price)} each</span></div>
            <span class="order-summary-item-price">${money(item.price * item.quantity)}</span>
        </div>`).join("") || '<p class="checkout-review-muted">No items in the cart yet.</p>';

        const workflow = byId("checkoutWorkflow");
        const emptyState = byId("checkoutEmptyState");
        const confirmation = byId("orderConfirmation");
        if (!confirmation.hidden) {
            workflow.hidden = true;
            emptyState.hidden = true;
        } else {
            const hasItems = cart.length > 0;
            workflow.hidden = !hasItems;
            emptyState.hidden = hasItems;
            if (!hasItems) currentStep = 1;
        }
    }

    function setActiveTab(tabName, updateHash = true) {
        const showOrders = tabName === "orders";
        byId("placeOrderTab").setAttribute("aria-selected", String(!showOrders));
        byId("placeOrderTab").tabIndex = showOrders ? -1 : 0;
        byId("myOrdersTab").setAttribute("aria-selected", String(showOrders));
        byId("myOrdersTab").tabIndex = showOrders ? 0 : -1;
        byId("checkoutPanel").hidden = showOrders;
        byId("ordersPanel").hidden = !showOrders;

        if (updateHash) {
            const targetHash = showOrders ? "#orders" : "#checkout";
            if (window.location.hash !== targetHash) {
                try { history.replaceState(null, "", targetHash); }
                catch (error) { console.warn("Unable to update order tab URL fragment:", error); }
            }
        }
        if (showOrders) renderOrderHistory();
        else renderOrderSummary();
    }

    function setCheckoutStep(step, focus = true) {
        currentStep = Math.min(3, Math.max(1, step));
        document.querySelectorAll("[data-step-panel]").forEach(panel => {
            panel.hidden = Number(panel.dataset.stepPanel) !== currentStep;
        });
        document.querySelectorAll("[data-step-indicator]").forEach(indicator => {
            const indicatorStep = Number(indicator.dataset.stepIndicator);
            indicator.classList.toggle("is-current", indicatorStep === currentStep);
            indicator.classList.toggle("is-complete", indicatorStep < currentStep);
            if (indicatorStep === currentStep) indicator.setAttribute("aria-current", "step");
            else indicator.removeAttribute("aria-current");
        });
        clearGeneralErrors();
        if (focus) {
            const panel = byId(`checkoutStep${currentStep}`);
            const heading = panel?.querySelector("h2");
            heading?.setAttribute("tabindex", "-1");
            heading?.focus();
        }
    }

    function setConditionalFields() {
        const type = selectedOrderType();
        const isDelivery = type === "delivery";
        const isEatIn = type === "eat-in";
        byId("deliveryAddressFields").hidden = !isDelivery;
        byId("deliveryPostalCodeField").hidden = !isDelivery;
        byId("eatInTableField").hidden = !isEatIn;
        const address = byId("deliveryAddress");
        address.required = isDelivery;
        if (!isDelivery) {
            clearFieldError(address);
        }
        const scheduled = selectedTimeMode() === "scheduled";
        byId("scheduledTimeField").hidden = !scheduled;
        byId("requestedDateTime").disabled = !scheduled;
        byId("requestedDateTime").required = scheduled;
        if (!scheduled) clearFieldError(byId("requestedDateTime"));
        renderOrderSummary();
    }

    function getLocalDateTimeString(date) {
        const pad = number => String(number).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }

    function setDateTimeMinimum() {
        const minimum = new Date(Date.now() + 15 * 60 * 1000);
        byId("requestedDateTime").min = getLocalDateTimeString(minimum);
    }

    function clearFieldError(input) {
        if (!input) return;
        input.removeAttribute("aria-invalid");
        const error = byId(`${input.id}Error`);
        if (error) {
            error.textContent = "";
            error.hidden = true;
        }
    }

    function setFieldError(input, message) {
        input.setAttribute("aria-invalid", "true");
        const error = byId(`${input.id}Error`);
        if (error) {
            error.textContent = message;
            error.hidden = false;
        }
    }

    function clearGeneralErrors() {
        ["customerFormGeneralError", "orderSubmitError"].forEach(id => {
            const element = byId(id);
            if (element) element.hidden = true;
        });
    }

    function validateOrderType() {
        const selected = document.querySelector('input[name="orderType"]:checked');
        const error = byId("orderTypeError");
        if (!selected) {
            error.hidden = false;
            return false;
        }
        error.hidden = true;
        return true;
    }

    function validateCustomerDetails() {
        const fields = [
            byId("customerName"), byId("customerPhone"), byId("customerEmail"),
            byId("deliveryAddress"), byId("requestedDateTime")
        ];
        fields.forEach(clearFieldError);
        clearGeneralErrors();
        const invalid = [];
        const name = byId("customerName");
        const phone = byId("customerPhone");
        const email = byId("customerEmail");
        const address = byId("deliveryAddress");
        const requestedDateTime = byId("requestedDateTime");

        if (!name.value.trim()) {
            setFieldError(name, "Enter your full name.");
            invalid.push(name);
        } else if (name.value.trim().length < 2) {
            setFieldError(name, "Enter at least two characters.");
            invalid.push(name);
        }

        const phoneValue = phone.value.trim();
        const normalizedPhone = phoneValue.normalize("NFKC");
        const phoneDigits = normalizedPhone.replace(/\D/g, "");
        if (!phoneValue) {
            setFieldError(phone, "Enter a telephone number.");
            invalid.push(phone);
        } else if (!/^[0-9+()\s.-]+$/.test(normalizedPhone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
            setFieldError(phone, "Enter a valid telephone number with 8–15 digits.");
            invalid.push(phone);
        }

        if (email.value.trim() && !email.validity.valid) {
            setFieldError(email, "Enter a valid email address or leave this field blank.");
            invalid.push(email);
        }

        if (selectedOrderType() === "delivery" && !address.value.trim()) {
            setFieldError(address, "Enter the delivery address.");
            invalid.push(address);
        }

        if (selectedTimeMode() === "scheduled") {
            if (!requestedDateTime.value) {
                setFieldError(requestedDateTime, "Choose a requested date and time.");
                invalid.push(requestedDateTime);
            } else {
                const requested = new Date(requestedDateTime.value);
                if (!Number.isFinite(requested.getTime()) || requested.getTime() < Date.now() + 15 * 60 * 1000) {
                    setFieldError(requestedDateTime, "Choose a time at least 15 minutes from now.");
                    invalid.push(requestedDateTime);
                }
            }
        }

        if (invalid.length) {
            byId("customerFormGeneralError").hidden = false;
            invalid[0].focus();
            return false;
        }
        return true;
    }

    function orderTypeLabel(type) {
        return ({ delivery: "Delivery", pickup: "Pickup", "eat-in": "Eat-in" })[type] || "Pickup";
    }

    function requestedTimeLabel(order) {
        if (!order.customer || order.customer.requestedTimeMode !== "scheduled" || !order.customer.requestedDateTime) {
            return "As soon as possible";
        }
        const date = new Date(order.customer.requestedDateTime);
        return Number.isFinite(date.getTime()) ? date.toLocaleString(window.getSiteLocale?.() || "en-GB", { dateStyle: "medium", timeStyle: "short", hourCycle: "h23" }) : "Scheduled time selected";
    }

    function formatDate(dateValue) {
        const date = new Date(dateValue);
        if (!Number.isFinite(date.getTime())) return "Date unavailable";
        return date.toLocaleString(window.getSiteLocale?.() || "en-GB", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
        });
    }

    function buildReview() {
        const cart = getCart();
        const totals = calculateTotals(cart);
        const type = selectedOrderType();
        const name = byId("customerName").value.trim();
        const phone = byId("customerPhone").value.trim();
        const email = byId("customerEmail").value.trim();
        const address = byId("deliveryAddress").value.trim();
        const postal = byId("deliveryPostalCode").value.trim();
        const table = byId("tableNumber").value.trim();
        const notes = byId("orderNotes").value.trim();
        const scheduleMode = selectedTimeMode();
        const requestedDateTime = scheduleMode === "scheduled" ? byId("requestedDateTime").value : "";
        const customerRows = [
            ["Name", name], ["Telephone", phone], ["Email", email || "Not provided"],
            ["Order type", orderTypeLabel(type)],
            ["Requested time", scheduleMode === "scheduled" ? formatDate(requestedDateTime) : "As soon as possible"]
        ];
        if (type === "delivery") customerRows.push(["Delivery address", [postal, address].filter(Boolean).join(" ")]);
        if (type === "eat-in" && table) customerRows.push(["Table number", table]);
        if (notes) customerRows.push(["Order notes", notes]);

        byId("checkoutReviewContent").innerHTML = `
            <section class="checkout-review-block">
                <h3 class="checkout-review-heading">Items</h3>
                <div class="checkout-review-list">${cart.map(item => `<div class="checkout-review-item">
                    <div><p class="checkout-review-item-name">${escapeHTML(item.name)}</p><p class="checkout-review-item-meta">Quantity ${item.quantity} × ${money(item.price)}</p></div>
                    <span class="checkout-review-item-price">${money(item.price * item.quantity)}</span>
                </div>`).join("")}</div>
            </section>
            <section class="checkout-review-block">
                <h3 class="checkout-review-heading">Order and customer details</h3>
                <dl class="checkout-review-customer">${customerRows.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join("")}</dl>
            </section>
            <section class="checkout-review-block">
                <h3 class="checkout-review-heading">Price breakdown</h3>
                <div class="order-summary-total-row"><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
                <div class="order-summary-total-row"><span>Delivery fee</span><strong>${money(totals.deliveryFee)}</strong></div>
                <div class="order-summary-total-row final"><span>Total</span><strong>${money(totals.total)}</strong></div>
            </section>`;
    }

    function generateOrderId() {
        const now = new Date();
        const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
        return `RD-${datePart}-${randomPart}`;
    }

    function createOrderSnapshot() {
        const cart = getCart();
        const type = selectedOrderType();
        const totals = calculateTotals(cart, type);
        const order = {
            id: generateOrderId(),
            createdAt: new Date().toISOString(),
            status: "received",
            type,
            customer: {
                name: byId("customerName").value.trim(),
                phone: byId("customerPhone").value.trim(),
                email: byId("customerEmail").value.trim(),
                address: type === "delivery" ? byId("deliveryAddress").value.trim() : "",
                postalCode: type === "delivery" ? byId("deliveryPostalCode").value.trim() : "",
                tableNumber: type === "eat-in" ? byId("tableNumber").value.trim() : "",
                requestedTimeMode: selectedTimeMode(),
                requestedDateTime: selectedTimeMode() === "scheduled" ? byId("requestedDateTime").value : "",
                notes: byId("orderNotes").value.trim()
            },
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            })),
            subtotal: totals.subtotal,
            deliveryFee: totals.deliveryFee,
            total: totals.total,
        };
        return order;
    }

    function generateQRCode(containerId, fallbackId, orderId) {
        const container = byId(containerId);
        const fallback = byId(fallbackId);
        if (!container || !fallback) return;
        container.innerHTML = "";
        fallback.hidden = true;
        fallback.textContent = `Order reference: ${orderId}`;
        try {
            if (typeof window.QRCode !== "function") throw new Error("QR library unavailable");
            new window.QRCode(container, {
                text: `ROYAL DINER ORDER ${orderId}`,
                width: 144,
                height: 144,
                colorDark: "#5E3023",
                colorLight: "#FFFFFF",
                correctLevel: window.QRCode.CorrectLevel?.M ?? 0
            });
        } catch (error) {
            console.warn("QR code could not be generated:", error);
            fallback.hidden = false;
        }
    }

    function showConfirmation(order) {
        currentOrderId = order.id;
        byId("checkoutWorkflow").hidden = true;
        byId("checkoutEmptyState").hidden = true;
        byId("orderConfirmation").hidden = false;
        byId("confirmationOrderNumber").textContent = order.id;
        byId("confirmationSummary").innerHTML = `
            <h3 class="checkout-review-heading">Order summary</h3>
            <div class="order-detail-two-column">
                <div class="order-detail-field"><span>Order type</span><strong>${escapeHTML(orderTypeLabel(order.type))}</strong></div>
                <div class="order-detail-field"><span>Total</span><strong>${money(order.total)}</strong></div>
                <div class="order-detail-field"><span>Requested time</span><strong>${escapeHTML(requestedTimeLabel(order))}</strong></div>
                <div class="order-detail-field"><span>Items</span><strong>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
            </div>`;
        generateQRCode("confirmationQrCode", "confirmationQrFallback", order.id);
        byId("orderConfirmation").focus();
    }

    function submitOrder() {
        if (isSubmitting) return;
        const cart = getCart();
        if (!cart.length) {
            renderOrderSummary();
            return;
        }
        isSubmitting = true;
        const button = byId("confirmOrderButton");
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Saving order…';

        const order = createOrderSnapshot();
        const orders = getOrders();
        while (orders.some(existingOrder => existingOrder.id === order.id)) order.id = generateOrderId();
        orders.unshift(order);
        const ordersSaved = saveStored(ORDERS_KEY, orders);
        if (!ordersSaved) {
            isSubmitting = false;
            button.disabled = false;
            button.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Place Order';
            byId("orderSubmitError").textContent = "We could not save your order. Your cart has been kept; please try again.";
            byId("orderSubmitError").hidden = false;
            return;
        }

        const cartCleared = saveStored(CART_KEY, []);
        if (cartCleared) {
            if (typeof refreshCartCount === "function") refreshCartCount();
            window.dispatchEvent(new CustomEvent("cart:updated", { detail: { cart: [] } }));
        }
        isSubmitting = false;
        showConfirmation(order);
        renderOrderHistory();
        if (!cartCleared) {
            byId("confirmationSummary").insertAdjacentHTML("beforeend", '<p class="order-general-error">Your order was placed, but the cart could not be cleared automatically. Remove its items before placing another order.</p>');
        }
    }

    function statusLabel(status) {
        return ({
            received: "Order placed",
            preparing: "Preparing",
            ready: "Ready for pickup",
            completed: "Completed",
            cancelled: "Cancelled"
        })[status] || "Order recorded";
    }

    function statusClass(status) {
        if (status === "cancelled") return "is-cancelled";
        if (status === "completed") return "is-completed";
        return "";
    }

    function orderMatchesFilter(order) {
        if (currentFilter === "active") return !["completed", "cancelled"].includes(order.status);
        return currentFilter === "all" || order.status === currentFilter;
    }

    function renderOrderHistory() {
        const allOrders = getOrders();
        const orders = allOrders.filter(orderMatchesFilter);
        byId("orderHistoryList").innerHTML = orders.map(order => {
            const count = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0) : 0;
            const itemNames = Array.isArray(order.items) ? order.items.slice(0, 2).map(item => window.getLocalizedMenuField?.(item.id, "name", item.name) || item.name).filter(Boolean).join("、") : "Order details";
            const extraItems = Array.isArray(order.items) && order.items.length > 2 ? ` + ${order.items.length - 2} more` : "";
            const showCancel = order.status === "received";
            return `<article class="order-history-card" data-order-id="${escapeHTML(order.id)}">
                <div class="order-history-card-header">
                    <div><p class="order-history-id">ORDER #${escapeHTML(order.id)}</p><p class="order-history-date">${escapeHTML(formatDate(order.createdAt))}</p></div>
                    <span class="order-status-badge ${statusClass(order.status)}">${escapeHTML(statusLabel(order.status))}</span>
                </div>
                <div class="order-history-main">
                    <div><h3>${escapeHTML(orderTypeLabel(order.type))}</h3><p>${escapeHTML(itemNames + extraItems)}</p><p>${count} ${count === 1 ? "item" : "items"}</p></div>
                    <strong class="order-history-total">${money(order.total)}</strong>
                </div>
                <div class="order-history-card-actions">
                    <button type="button" data-history-action="details" data-order-id="${escapeHTML(order.id)}"><i class="bi bi-receipt" aria-hidden="true"></i> View Details & QR</button>
                    ${showCancel ? `<button class="cancel-order-button" type="button" data-history-action="cancel" data-order-id="${escapeHTML(order.id)}"><i class="bi bi-x-circle" aria-hidden="true"></i> Cancel Order</button>` : ""}
                </div>
            </article>`;
        }).join("");

        const empty = orders.length === 0;
        byId("orderHistoryEmpty").hidden = !empty;
        byId("orderHistoryList").hidden = empty;
        if (empty) {
            const allEmpty = allOrders.length === 0;
            byId("orderHistoryEmptyTitle").textContent = allEmpty ? "No orders yet" : `No ${currentFilter === "all" ? "matching" : currentFilter} orders`;
            byId("orderHistoryEmptyText").textContent = allEmpty
                ? "Your orders will appear here after you place an order."
                : "There are no orders in this category. Try another filter to see your saved history.";
            byId("startOrderFromHistory").hidden = !allEmpty;
        }
        document.querySelectorAll("[data-order-filter]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.orderFilter === currentFilter));
        });
    }

    function getOrderById(orderId) {
        return getOrders().find(order => order.id === orderId) || null;
    }

    function openOrderDetails(orderId, trigger = null) {
        const order = getOrderById(orderId);
        if (!order) return;
        currentOrderId = order.id;
        previousDetailTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
        byId("orderDetailTitle").textContent = `Order ${order.id}`;
        byId("orderDetailSubtitle").textContent = `${formatDate(order.createdAt)} · ${statusLabel(order.status)}`;
        const customer = order.customer || {};
        const customerDetails = [
            ["Name", customer.name], ["Telephone", customer.phone], ["Email", customer.email || "Not provided"],
            ["Order type", orderTypeLabel(order.type)], ["Requested time", requestedTimeLabel(order)]
        ];
        if (order.type === "delivery") customerDetails.push(["Delivery address", [customer.postalCode, customer.address].filter(Boolean).join(" ")]);
        if (order.type === "eat-in" && customer.tableNumber) customerDetails.push(["Table number", customer.tableNumber]);
        if (customer.notes) customerDetails.push(["Order notes", customer.notes]);

        const items = Array.isArray(order.items) ? order.items : [];
        byId("orderDetailContent").innerHTML = `
            <section class="checkout-review-block">
                <h3>Items</h3>
                <div class="order-detail-items">${items.map(item => `<div class="order-detail-item"><span>${escapeHTML(item.name)} × ${Math.max(1, Number(item.quantity) || 1)}</span><span>${money((Number(item.price) || 0) * (Number(item.quantity) || 1))}</span></div>`).join("")}</div>
                <div class="order-detail-total"><div class="order-summary-total-row"><span>Subtotal</span><strong>${money(order.subtotal)}</strong></div><div class="order-summary-total-row"><span>Delivery fee</span><strong>${money(order.deliveryFee)}</strong></div><div class="order-summary-total-row final"><span>Total</span><strong>${money(order.total)}</strong></div></div>
            </section>
            <section class="checkout-review-block"><h3>Order details</h3><dl class="order-detail-two-column">${customerDetails.map(([label, value]) => `<div class="order-detail-field"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value || "Not provided")}</strong></div>`).join("")}<div class="order-detail-field"><span>Status</span><strong>${escapeHTML(statusLabel(order.status))}</strong></div></dl></section>
`;
        generateQRCode("orderDetailQrCode", "orderDetailQrFallback", order.id);
        const dialog = byId("orderDetailDialog");
        if (!dialog.open) dialog.showModal();
        byId("orderDetailClose").focus();
    }

    function cancelOrder(orderId) {
        const order = getOrderById(orderId);
        if (!order || order.status !== "received") return;
        const accepted = window.confirm(`Cancel order ${order.id}?`);
        if (!accepted) return;
        const orders = getOrders();
        const target = orders.find(item => item.id === orderId);
        if (!target) return;
        target.status = "cancelled";
        target.cancelledAt = new Date().toISOString();
        if (!saveStored(ORDERS_KEY, orders)) {
            window.alert("We could not update the order. Please try again.");
            return;
        }
        renderOrderHistory();
        if (byId("orderDetailDialog").open && currentOrderId === orderId) {
            openOrderDetails(orderId, previousDetailTrigger);
        } else {
            window.requestAnimationFrame(() => {
                const updatedCard = [...byId("orderHistoryList").querySelectorAll(".order-history-card")]
                    .find(card => card.dataset.orderId === orderId);
                const target = updatedCard?.querySelector('[data-history-action="details"]')
                    || document.querySelector('.order-filter-button[aria-pressed="true"]');
                target?.focus();
            });
        }
    }

    function continueToDetails() {
        if (!getCart().length) {
            renderOrderSummary();
            return;
        }
        if (!validateOrderType()) {
            document.querySelector('input[name="orderType"]')?.focus();
            return;
        }
        setConditionalFields();
        setCheckoutStep(2);
    }

    function continueToReview() {
        if (!validateCustomerDetails()) return;
        buildReview();
        renderOrderSummary();
        setCheckoutStep(3);
    }

    function setupEvents() {
        byId("editOrderCartButton")?.addEventListener("click", event => {
            window.dispatchEvent(new CustomEvent("cart:open", { detail: { trigger: event.currentTarget } }));
        });
        byId("placeOrderTab").addEventListener("click", () => setActiveTab("checkout"));
        byId("myOrdersTab").addEventListener("click", () => setActiveTab("orders"));
        window.addEventListener("order:show-checkout", () => setActiveTab("checkout"));
        [byId("placeOrderTab"), byId("myOrdersTab")].forEach((tab, index, tabs) => {
            tab.addEventListener("keydown", event => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + 2) % 2;
                tabs[nextIndex].focus();
                tabs[nextIndex].click();
            });
        });

        document.querySelectorAll('input[name="orderType"]').forEach(input => {
            input.addEventListener("change", () => {
                byId("orderTypeError").hidden = true;
                setConditionalFields();
            });
        });
        document.querySelectorAll('input[name="requestedTimeMode"]').forEach(input => input.addEventListener("change", setConditionalFields));

        byId("nextToDetails").addEventListener("click", continueToDetails);
        byId("backToType").addEventListener("click", () => setCheckoutStep(1));
        byId("nextToReview").addEventListener("click", continueToReview);
        byId("checkoutForm").addEventListener("submit", event => {
            event.preventDefault();
            if (currentStep === 1) continueToDetails();
            else if (currentStep === 2) continueToReview();
            else submitOrder();
        });
        byId("backToDetails").addEventListener("click", () => setCheckoutStep(2));
        byId("confirmOrderButton").addEventListener("click", submitOrder);

        ["customerName", "customerPhone", "customerEmail", "deliveryAddress", "requestedDateTime"].forEach(id => {
            byId(id).addEventListener("input", () => clearFieldError(byId(id)));
            byId(id).addEventListener("change", () => clearFieldError(byId(id)));
        });
        byId("orderHistoryList").addEventListener("click", event => {
            const button = event.target.closest("button[data-history-action]");
            if (!button) return;
            const { historyAction, orderId } = { historyAction: button.dataset.historyAction, orderId: button.dataset.orderId };
            if (historyAction === "details") openOrderDetails(orderId, button);
            if (historyAction === "cancel") cancelOrder(orderId);
        });
        document.querySelectorAll("[data-order-filter]").forEach(button => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.orderFilter;
                renderOrderHistory();
            });
        });

        byId("viewSavedOrderButton").addEventListener("click", () => {
            setActiveTab("orders");
            renderOrderHistory();
            if (currentOrderId) openOrderDetails(currentOrderId, byId("viewSavedOrderButton"));
        });
        ["orderDetailClose", "orderDetailCloseFooter"].forEach(id => byId(id).addEventListener("click", () => byId("orderDetailDialog").close()));
        byId("orderDetailDialog").addEventListener("click", event => {
            if (event.target === byId("orderDetailDialog")) byId("orderDetailDialog").close();
        });
        byId("orderDetailDialog").addEventListener("close", () => {
            if (previousDetailTrigger instanceof HTMLElement && previousDetailTrigger.isConnected) previousDetailTrigger.focus();
        });
        window.addEventListener("cart:updated", () => {
            renderOrderSummary();
            const cart = getCart();
            if (currentStep === 3 && cart.length && byId("orderConfirmation").hidden) buildReview();
            if (currentStep > 1 && !cart.length && byId("orderConfirmation").hidden) setCheckoutStep(1);
        });
        window.addEventListener("storage", event => {
            if (event.key === CART_KEY || event.key === null) {
                renderOrderSummary();
                if (currentStep > 1 && !getCart().length && byId("orderConfirmation").hidden) setCheckoutStep(1, false);
            }
            if (event.key === ORDERS_KEY || event.key === null) renderOrderHistory();
        });
        window.addEventListener("hashchange", () => {
            if (window.location.hash === "#orders") setActiveTab("orders", false);
            if (window.location.hash === "#checkout") setActiveTab("checkout", false);
        });
    }

    function initOrderPage() {
        if (!byId("checkoutForm")) return;
        setDateTimeMinimum();
        setupEvents();
        setConditionalFields();
        setCheckoutStep(1, false);
        renderOrderSummary();
        renderOrderHistory();
        if (window.location.hash === "#orders") setActiveTab("orders", false);
        else setActiveTab("checkout", false);
        window.addEventListener("language:changed", () => {
            renderOrderSummary();
            renderOrderHistory();
            if (currentStep === 3 && getCart().length && byId("orderConfirmation").hidden) buildReview();
            if (currentOrderId && byId("orderDetailDialog")?.open) openOrderDetails(currentOrderId, previousDetailTrigger);
        });
    }

    document.addEventListener("DOMContentLoaded", initOrderPage);
})();
