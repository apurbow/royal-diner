(() => {
    "use strict";

    const RESERVATIONS_KEY = "reservations";
    const MAX_GUESTS = 12;
    const LARGE_PARTY_MIN = 7;
    const LARGE_PARTY_NOTICE_HOURS = 48;
    const SEATS_PER_TIME_SLOT = 24;
    const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", 
        "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
    const CLOSED_DATES = [];
    let currentStep = 1;
    let currentFilter = "upcoming";
    let selectedTime = "";
    let editingReservationId = null;
    let currentReservationId = null;
    let pendingCancelId = null;
    let previousDetailsTrigger = null;
    let previousCancelTrigger = null;
    let isSubmitting = false;

    const byId = id => document.getElementById(id);
    const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);

    function readStored(key, fallback) {
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

    function getReservations() {
        const stored = readStored(RESERVATIONS_KEY, []);
        return Array.isArray(stored) ? stored.filter(item => item && typeof item.id === "string" && item.date && item.time) : [];
    }

    function localDateString(date = new Date()) {
        const pad = number => String(number).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function parseReservationDateTime(reservationOrDate, time = "") {
        const date = typeof reservationOrDate === "object" ? reservationOrDate.date : reservationOrDate;
        const clock = typeof reservationOrDate === "object" ? reservationOrDate.time : time;
        if (!date || !clock) return new Date(NaN);
        return new Date(`${date}T${clock}:00`);
    }

    function formatDate(dateValue, options = {}) {
        const date = typeof dateValue === "object" && dateValue instanceof Date
            ? dateValue
            : parseReservationDateTime(dateValue, "12:00");
        if (!Number.isFinite(date.getTime())) return "Date unavailable";
        return date.toLocaleDateString(window.getSiteLocale?.() || "en-GB", options);
    }

    function formatDateTime(reservation) {
        const date = parseReservationDateTime(reservation);
        if (!Number.isFinite(date.getTime())) return "Date unavailable";
        return date.toLocaleString(window.getSiteLocale?.() || "en-GB", {
            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
        });
    }

    function formatReadableDate(dateValue) {
        if (!dateValue) return "Choose a date";
        const date = parseReservationDateTime(dateValue, "12:00");
        if (!Number.isFinite(date.getTime())) return "Choose a date";
        return date.toLocaleDateString(window.getSiteLocale?.() || "en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    }

    function guestCount() {
        const value = Number.parseInt(byId("reservationGuestCount").value, 10);
        return Number.isInteger(value) ? Math.max(1, Math.min(MAX_GUESTS, value)) : 2;
    }

    function isLargeParty(count = guestCount()) {
        return count >= LARGE_PARTY_MIN;
    }

    function getReservationCategory(reservation, now = new Date()) {
        if (reservation.status === "cancelled") return "cancelled";
        return parseReservationDateTime(reservation).getTime() < now.getTime() ? "past" : "upcoming";
    }

    function seatsBooked(date, time, excludeId = null) {
        return getReservations().reduce((sum, reservation) => {
            if (reservation.id === excludeId || reservation.status === "cancelled") return sum;
            if (reservation.date !== date || reservation.time !== time) return sum;
            return sum + Math.max(1, Number(reservation.guestCount) || 1);
        }, 0);
    }

    function availabilityFor(date, time, count = guestCount(), excludeId = editingReservationId) {
        if (!date || CLOSED_DATES.includes(date)) return { available: false, reason: "Unavailable" };
        const dateTime = parseReservationDateTime(date, time);
        const now = new Date();
        if (!Number.isFinite(dateTime.getTime()) || dateTime.getTime() <= now.getTime()) {
            return { available: false, reason: "Past time" };
        }
        if (isLargeParty(count) && dateTime.getTime() - now.getTime() < LARGE_PARTY_NOTICE_HOURS * 60 * 60 * 1000) {
            return { available: false, reason: "48h notice" };
        }
        const availableSeats = Math.max(0, SEATS_PER_TIME_SLOT - seatsBooked(date, time, excludeId));
        if (availableSeats < count) {
            return { available: false, reason: availableSeats === 0 ? "Full" : "Not enough seats", availableSeats };
        }
        return { available: true, reason: "Available", availableSeats };
    }

    function setMinimumDate() {
        byId("reservationDate").min = localDateString();
    }

    function renderTimeSlots() {
        const date = byId("reservationDate").value;
        const count = guestCount();
        const root = byId("reservationTimeSlots");
        const message = byId("reservationAvailabilityMessage");
        byId("largePartyNotice").hidden = !isLargeParty(count);
        root.innerHTML = "";
        message.classList.remove("is-warning");

        if (!date) {
            root.innerHTML = '<p class="reservation-time-placeholder">Choose a date to see available times.</p>';
            selectedTime = "";
            message.textContent = "";
            updateLiveSummary();
            return;
        }

        const day = new Date(`${date}T12:00:00`);
        if (!Number.isFinite(day.getTime()) || date < localDateString()) {
            root.innerHTML = '<p class="reservation-time-placeholder">Choose today or a future date.</p>';
            selectedTime = "";
            message.textContent = "Past dates cannot be selected.";
            message.classList.add("is-warning");
            updateLiveSummary();
            return;
        }
        if (CLOSED_DATES.includes(date)) {
            root.innerHTML = '<p class="reservation-time-placeholder">The restaurant is unavailable on this date. Choose another day.</p>';
            selectedTime = "";
            message.textContent = "No reservation times are available for this date.";
            message.classList.add("is-warning");
            updateLiveSummary();
            return;
        }

        const slotStates = TIME_SLOTS.map(time => ({ time, ...availabilityFor(date, time, count) }));
        if (!slotStates.some(slot => slot.available)) selectedTime = "";
        else if (selectedTime && !slotStates.some(slot => slot.time === selectedTime && slot.available)) selectedTime = "";

        slotStates.forEach(slot => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "reservation-time-option";
            button.disabled = !slot.available;
            button.dataset.reservationTime = slot.time;
            button.setAttribute("aria-pressed", String(selectedTime === slot.time));
            button.setAttribute("aria-label", `${slot.time}, ${slot.available ? "available" : slot.reason}`);
            button.innerHTML = `<span class="reservation-time-label">${escapeHTML(slot.time)}</span><span class="reservation-time-status">${escapeHTML(slot.available ? "Available" : slot.reason)}</span>`;
            root.appendChild(button);
        });

        if (!slotStates.some(slot => slot.available)) {
            message.textContent = isLargeParty(count)
                ? "No times are available for this party size. Large parties need at least 48 hours' notice. Try another date."
                : "No times are available for this date and party size. Please choose another date.";
            message.classList.add("is-warning");
        } else if (isLargeParty(count)) {
            message.textContent = "Large-party reservations require at least 48 hours' notice.";
        } else {
            message.textContent = "Times update based on saved bookings and the selected party size.";
        }
        clearFieldError(byId("reservationDate"));
        clearTimeError();
        updateLiveSummary();
    }

    function updateLiveSummary() {
        byId("summaryGuestCount").textContent = `${guestCount()} ${guestCount() === 1 ? "guest" : "guests"}`;
        byId("summaryReservationDate").textContent = formatReadableDate(byId("reservationDate").value);
        byId("summaryReservationTime").textContent = selectedTime || "Choose a time";
        byId("summaryReservationOccasion").textContent = byId("reservationOccasion").value || "None selected";
    }

    function clearFieldError(input) {
        if (!input) return;
        input.removeAttribute("aria-invalid");
        const error = byId(`${input.id}Error`);
        if (error) {
            error.hidden = true;
            error.textContent = "";
        }
    }

    function setFieldError(input, message) {
        if (!input) return;
        input.setAttribute("aria-invalid", "true");
        const error = byId(`${input.id}Error`);
        if (error) {
            error.textContent = message;
            error.hidden = false;
        }
    }

    function setTimeError(message) {
        const error = byId("reservationTimeError");
        error.textContent = message;
        error.hidden = !message;
        if (message) byId("reservationTimeSlots").setAttribute("aria-invalid", "true");
        else byId("reservationTimeSlots").removeAttribute("aria-invalid");
    }

    function clearTimeError() { setTimeError(""); }

    function validateVisit() {
        clearFieldError(byId("reservationGuestCount"));
        clearFieldError(byId("reservationDate"));
        clearTimeError();
        const guests = Number.parseInt(byId("reservationGuestCount").value, 10);
        const date = byId("reservationDate").value;
        let firstInvalid = null;

        if (!Number.isInteger(guests) || guests < 1 || guests > MAX_GUESTS) {
            setFieldError(byId("reservationGuestCount"), `Choose between 1 and ${MAX_GUESTS} guests.`);
            firstInvalid ||= byId("reservationGuestCount");
        }
        if (!date) {
            setFieldError(byId("reservationDate"), "Choose a reservation date.");
            firstInvalid ||= byId("reservationDate");
        } else if (date < localDateString()) {
            setFieldError(byId("reservationDate"), "Choose today or a future date.");
            firstInvalid ||= byId("reservationDate");
        } else if (CLOSED_DATES.includes(date)) {
            setFieldError(byId("reservationDate"), "The restaurant is unavailable on this date. Choose another day.");
            firstInvalid ||= byId("reservationDate");
        }
        if (!firstInvalid && !selectedTime) {
            setTimeError("Choose an available reservation time.");
            firstInvalid = byId("reservationTimeSlots").querySelector("button:not(:disabled)") || byId("reservationDate");
        } else if (!firstInvalid) {
            const availability = availabilityFor(date, selectedTime, guests);
            if (!availability.available) {
                setTimeError(availability.reason === "48h notice"
                    ? "Groups of 7–12 must book at least 48 hours ahead. Choose a later date and time."
                    : "That time is no longer available. Please choose another time.");
                renderTimeSlots();
                firstInvalid = byId("reservationTimeSlots").querySelector("button:not(:disabled)") || byId("reservationDate");
            }
        }
        if (firstInvalid) {
            firstInvalid.focus?.();
            return false;
        }
        return true;
    }

    function validateContactDetails() {
        const fields = [byId("reservationName"), byId("reservationPhone"), byId("reservationEmail")];
        fields.forEach(clearFieldError);
        byId("reservationFormGeneralError").hidden = true;
        let firstInvalid = null;
        const name = byId("reservationName").value.trim();
        const phone = byId("reservationPhone").value.trim();
        const email = byId("reservationEmail").value.trim();
        const normalizedPhone = phone.normalize("NFKC");
        const phoneDigits = normalizedPhone.replace(/\D/g, "");

        if (name.length < 2) {
            setFieldError(byId("reservationName"), "Enter your name using at least two characters.");
            firstInvalid ||= byId("reservationName");
        }
        if (!phone) {
            setFieldError(byId("reservationPhone"), "Enter a telephone number.");
            firstInvalid ||= byId("reservationPhone");
        } else if (!/^[0-9+()\s.-]+$/.test(normalizedPhone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
            setFieldError(byId("reservationPhone"), "Enter a valid telephone number.");
            firstInvalid ||= byId("reservationPhone");
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setFieldError(byId("reservationEmail"), "Enter a valid email address or leave this field blank.");
            firstInvalid ||= byId("reservationEmail");
        }
        if (firstInvalid) {
            byId("reservationFormGeneralError").hidden = false;
            firstInvalid.focus();
            return false;
        }
        return true;
    }

    function setStep(step, focus = true) {
        currentStep = Math.max(1, Math.min(3, step));
        document.querySelectorAll("[data-res-step-panel]").forEach(panel => {
            panel.hidden = Number(panel.dataset.resStepPanel) !== currentStep;
        });
        document.querySelectorAll("[data-res-step-indicator]").forEach(indicator => {
            const index = Number(indicator.dataset.resStepIndicator);
            indicator.classList.toggle("is-current", index === currentStep);
            indicator.classList.toggle("is-complete", index < currentStep);
            if (index === currentStep) indicator.setAttribute("aria-current", "step");
            else indicator.removeAttribute("aria-current");
        });
        if (focus) {
            const heading = byId(`reservationStep${currentStep}`)?.querySelector("h2");
            heading?.setAttribute("tabindex", "-1");
            heading?.focus();
        }
    }

    function setActiveTab(tab, updateHash = true) {
        const showHistory = tab === "history";
        byId("makeReservationTab").setAttribute("aria-selected", String(!showHistory));
        byId("makeReservationTab").tabIndex = showHistory ? -1 : 0;
        byId("myReservationsTab").setAttribute("aria-selected", String(showHistory));
        byId("myReservationsTab").tabIndex = showHistory ? 0 : -1;
        byId("bookingPanel").hidden = showHistory;
        byId("reservationsPanel").hidden = !showHistory;
        if (updateHash) {
            const hash = showHistory ? "#my-reservations" : "#make-reservation";
            if (window.location.hash !== hash) {
                try { history.replaceState(null, "", hash); } catch (error) { console.warn("Unable to update reservation tab URL fragment:", error); }
            }
        }
        if (showHistory) renderHistory();
        else updateLiveSummary();
    }

    function buildReviewContent(reservation, includeStatus = false) {
        const status = includeStatus ? `<div><dt>Status</dt><dd>${escapeHTML(statusLabel(reservation))}</dd></div>` : "";
        const customer = reservation.customer || {};
        const details = [
            ["Name", customer.name], ["Telephone", customer.phone], ["Email", customer.email || "Not provided"],
            ["Occasion", reservation.occasion || "None"], ["Seating preference", reservation.seatingPreference || "No preference"],
            ["Special requests", reservation.notes || "None"]
        ];
        return `
            <section class="reservation-review-block">
                <h3>Visit details</h3>
                <dl class="reservation-review-dl">
                    <div><dt>Guests</dt><dd>${Math.max(1, Number(reservation.guestCount) || 1)} ${(Number(reservation.guestCount) || 1) === 1 ? "guest" : "guests"}</dd></div>
                    <div><dt>Date</dt><dd>${escapeHTML(formatReadableDate(reservation.date))}</dd></div>
                    <div><dt>Time</dt><dd>${escapeHTML(reservation.time)}</dd></div>
                    ${status}
                </dl>
            </section>
            <section class="reservation-review-block">
                <h3>Contact and preferences</h3>
                <dl class="reservation-review-dl">${details.map(([label, value]) => `<div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value || "Not provided")}</dd></div>`).join("")}</dl>
            </section>`;
    }

    function currentFormData() {
        return {
            date: byId("reservationDate").value,
            time: selectedTime,
            guestCount: guestCount(),
            customer: {
                name: byId("reservationName").value.trim(),
                phone: byId("reservationPhone").value.trim(),
                email: byId("reservationEmail").value.trim()
            },
            occasion: byId("reservationOccasion").value,
            seatingPreference: byId("reservationSeating").value || "No preference",
            notes: byId("reservationNotes").value.trim()
        };
    }

    function buildReview() {
        byId("reservationReviewContent").innerHTML = buildReviewContent(currentFormData());
        byId("reservationSubmitError").hidden = true;
    }

    function generateReservationId() {
        const now = new Date();
        const part = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
        const random = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
        return `RD-R-${part}-${random}`;
    }

    function makeReservationRecord(existing = null) {
        const formData = currentFormData();
        return {
            id: existing?.id || generateReservationId(),
            createdAt: existing?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "confirmed",
            date: formData.date,
            time: formData.time,
            guestCount: formData.guestCount,
            customer: formData.customer,
            occasion: formData.occasion,
            seatingPreference: formData.seatingPreference,
            notes: formData.notes
        };
    }

    function generateQRCode(containerId, fallbackId, reservationId) {
        const container = byId(containerId);
        const fallback = byId(fallbackId);
        if (!container || !fallback) return;
        container.innerHTML = "";
        fallback.hidden = true;
        fallback.textContent = `Reservation reference: ${reservationId}`;
        try {
            if (typeof window.QRCode !== "function") throw new Error("QR library unavailable");
            new window.QRCode(container, {
                text: `ROYAL DINER RESERVATION ${reservationId}`,
                width: 148,
                height: 148,
                colorDark: "#5E3023",
                colorLight: "#FFFFFF",
                correctLevel: window.QRCode.CorrectLevel?.M ?? 0
            });
        } catch (error) {
            console.warn("Reservation QR code could not be generated:", error);
            fallback.hidden = false;
        }
    }

    function showConfirmation(reservation, wasEdit) {
        currentReservationId = reservation.id;
        byId("reservationWorkflow").hidden = true;
        byId("reservationConfirmation").hidden = false;
        byId("reservationConfirmationTitle").textContent = wasEdit ? "Reservation updated" : "Reservation confirmed";
        byId("reservationConfirmationLead").textContent = wasEdit
            ? "Your updated reservation details are ready."
            : "Your table details are ready. We look forward to your visit.";
        byId("confirmedReservationNumber").textContent = reservation.id;
        byId("reservationConfirmationSummary").innerHTML = buildReviewContent(reservation, true);
        generateQRCode("reservationConfirmationQr", "reservationConfirmationQrFallback", reservation.id);
        byId("reservationConfirmation").focus();
    }

    function submitReservation(event) {
        event.preventDefault();
        if (isSubmitting) return;
        if (currentStep < 3) {
            if (currentStep === 1 && validateVisit()) setStep(2);
            else if (currentStep === 2 && validateContactDetails()) { buildReview(); setStep(3); }
            return;
        }
        if (!validateVisit()) {
            setStep(1, false);
            window.requestAnimationFrame(() => (byId("reservationDate").getAttribute("aria-invalid") === "true"
                ? byId("reservationDate")
                : byId("reservationGuestCount").getAttribute("aria-invalid") === "true"
                    ? byId("reservationGuestCount")
                    : byId("reservationTimeSlots").querySelector("button:not(:disabled)"))?.focus());
            return;
        }
        if (!validateContactDetails()) {
            setStep(2, false);
            window.requestAnimationFrame(() => byId("reservationStep2").querySelector('[aria-invalid="true"]')?.focus());
            return;
        }

        const all = getReservations();
        const existing = editingReservationId ? all.find(item => item.id === editingReservationId) : null;
        if (editingReservationId && (!existing || existing.status === "cancelled" || getReservationCategory(existing) !== "upcoming")) {
            byId("reservationSubmitError").textContent = "This reservation can no longer be edited. Return to My Reservations and choose an upcoming booking.";
            byId("reservationSubmitError").hidden = false;
            return;
        }
        const record = makeReservationRecord(existing);
        const idSet = new Set(all.map(item => item.id));
        if (!existing) while (idSet.has(record.id)) record.id = generateReservationId();
        const capacity = availabilityFor(record.date, record.time, record.guestCount, existing?.id || null);
        if (!capacity.available) {
            const unavailableMessage = capacity.reason === "48h notice"
                ? "Groups of 7–12 must be booked at least 48 hours ahead. Choose another time."
                : "That date and time are no longer available. Please choose another time.";
            byId("reservationSubmitError").hidden = true;
            setStep(1, false);
            renderTimeSlots();
            byId("reservationAvailabilityMessage").textContent = unavailableMessage;
            byId("reservationAvailabilityMessage").classList.add("is-warning");
            window.requestAnimationFrame(() => {
                const nextAvailable = byId("reservationTimeSlots").querySelector("button:not(:disabled)");
                if (nextAvailable) nextAvailable.focus();
                else byId("reservationDate").focus();
            });
            return;
        }

        isSubmitting = true;
        const button = byId("confirmReservationButton");
        button.disabled = true;
        button.innerHTML = '<i class="bi bi-hourglass-split" aria-hidden="true"></i> Saving…';
        const nextRecords = existing
            ? all.map(item => item.id === existing.id ? record : item)
            : [record, ...all];
        const saved = saveStored(RESERVATIONS_KEY, nextRecords);
        isSubmitting = false;
        button.disabled = false;
        button.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Confirm Reservation';
        if (!saved) {
            byId("reservationSubmitError").textContent = "We could not save your reservation. Please try again.";
            byId("reservationSubmitError").hidden = false;
            return;
        }

        editingReservationId = null;
        showConfirmation(record, Boolean(existing));
        renderHistory();
        renderTimeSlots();
    }

    function statusLabel(reservation) {
        const category = getReservationCategory(reservation);
        if (category === "cancelled") return "Cancelled";
        if (category === "past") return "Past visit";
        return "Confirmed";
    }

    function statusClass(reservation) {
        const category = getReservationCategory(reservation);
        if (category === "cancelled") return "is-cancelled";
        if (category === "past") return "is-past";
        return "";
    }

    function filteredReservations() {
        const all = getReservations().sort((a, b) => parseReservationDateTime(a).getTime() - parseReservationDateTime(b).getTime());
        if (currentFilter === "all") return all.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        return all.filter(item => getReservationCategory(item) === currentFilter).sort((a, b) => {
            const timeA = parseReservationDateTime(a).getTime();
            const timeB = parseReservationDateTime(b).getTime();
            return currentFilter === "past" ? timeB - timeA : timeA - timeB;
        });
    }

    function renderHistory() {
        const all = getReservations();
        const reservations = filteredReservations();
        const root = byId("reservationHistoryList");
        root.innerHTML = reservations.map(reservation => {
            const category = getReservationCategory(reservation);
            const isUpcoming = category === "upcoming";
            const guestCountValue = Math.max(1, Number(reservation.guestCount) || 1);
            const preferences = [reservation.occasion, reservation.seatingPreference && reservation.seatingPreference !== "No preference" ? reservation.seatingPreference : ""]
                .filter(Boolean).map(value => window.translateSiteText?.(value) || value).join(" · ");
            return `<article class="reservation-history-card" data-reservation-id="${escapeHTML(reservation.id)}">
                <div class="reservation-history-card-header">
                    <div><p class="reservation-history-id">RESERVATION #${escapeHTML(reservation.id)}</p><p class="reservation-history-date">${escapeHTML(formatDateTime(reservation))}</p></div>
                    <span class="reservation-status-badge ${statusClass(reservation)}">${escapeHTML(statusLabel(reservation))}</span>
                </div>
                <div class="reservation-history-main">
                    <h3>${guestCountValue} ${guestCountValue === 1 ? "guest" : "guests"}</h3>
                    <p>${escapeHTML(reservation.customer?.name || "Guest")}${reservation.customer?.phone ? ` · ${escapeHTML(reservation.customer.phone)}` : ""}</p>
                    <p>Time: ${escapeHTML(reservation.time)}</p>
                    ${preferences ? `<p>${escapeHTML(preferences)}</p>` : ""}
                </div>
                <div class="reservation-history-actions">
                    <button type="button" data-res-action="details" data-reservation-id="${escapeHTML(reservation.id)}"><i class="bi bi-qr-code" aria-hidden="true"></i> Details &amp; QR</button>
                    ${isUpcoming ? `<button type="button" data-res-action="edit" data-reservation-id="${escapeHTML(reservation.id)}"><i class="bi bi-pencil-square" aria-hidden="true"></i> Edit</button><button class="reservation-action-cancel" type="button" data-res-action="cancel" data-reservation-id="${escapeHTML(reservation.id)}"><i class="bi bi-x-circle" aria-hidden="true"></i> Cancel</button>` : ""}
                </div>
            </article>`;
        }).join("");

        const empty = reservations.length === 0;
        byId("reservationHistoryEmpty").hidden = !empty;
        root.hidden = empty;
        if (empty) {
            const allEmpty = all.length === 0;
            const labels = { upcoming: "upcoming", past: "past", cancelled: "cancelled", all: "" };
            byId("reservationHistoryEmptyTitle").textContent = allEmpty ? "No reservations yet" : `No ${labels[currentFilter] || "matching"} reservations`;
            byId("reservationHistoryEmptyText").textContent = allEmpty
                ? "Your bookings will appear here after you make a reservation."
                : "There are no reservations in this category. Try another filter or make a new booking.";
            byId("makeReservationFromEmpty").hidden = !allEmpty;
        }
        document.querySelectorAll("[data-res-filter]").forEach(button => {
            button.setAttribute("aria-pressed", String(button.dataset.resFilter === currentFilter));
        });
    }

    function getReservationById(id) {
        return getReservations().find(item => item.id === id) || null;
    }

    function openReservationDetails(id, trigger = null) {
        const reservation = getReservationById(id);
        if (!reservation) return;
        currentReservationId = reservation.id;
        previousDetailsTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
        byId("reservationDetailTitle").textContent = `Reservation ${reservation.id}`;
        byId("reservationDetailSubtitle").textContent = `${formatDateTime(reservation)} · ${statusLabel(reservation)}`;
        byId("reservationDetailContent").innerHTML = buildReviewContent(reservation, true);
        generateQRCode("reservationDetailQr", "reservationDetailQrFallback", reservation.id);
        const dialog = byId("reservationDetailDialog");
        if (!dialog.open) dialog.showModal();
        byId("reservationDetailClose").focus();
    }

    function startEditingReservation(id, trigger = null) {
        const reservation = getReservationById(id);
        if (!reservation || getReservationCategory(reservation) !== "upcoming") return;
        editingReservationId = reservation.id;
        currentReservationId = reservation.id;
        byId("reservationDate").value = reservation.date;
        byId("reservationGuestCount").value = String(reservation.guestCount || 2);
        byId("reservationName").value = reservation.customer?.name || "";
        byId("reservationPhone").value = reservation.customer?.phone || "";
        byId("reservationEmail").value = reservation.customer?.email || "";
        byId("reservationOccasion").value = reservation.occasion || "";
        byId("reservationSeating").value = reservation.seatingPreference || "No preference";
        byId("reservationNotes").value = reservation.notes || "";
        selectedTime = reservation.time;
        byId("reservationWorkflow").hidden = false;
        byId("reservationConfirmation").hidden = true;
        byId("reservationSubmitError").hidden = true;
        byId("confirmReservationButton").innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Save Changes';
        renderTimeSlots();
        setActiveTab("make");
        setStep(1);
        window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }

    function openCancelDialog(id, trigger) {
        const reservation = getReservationById(id);
        if (!reservation || getReservationCategory(reservation) !== "upcoming") return;
        pendingCancelId = id;
        previousCancelTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
        byId("reservationCancelMessage").textContent = `Cancel the reservation for ${formatDateTime(reservation)} for ${reservation.guestCount} ${Number(reservation.guestCount) === 1 ? "guest" : "guests"}?`;
        const dialog = byId("reservationCancelDialog");
        if (!dialog.open) dialog.showModal();
        byId("reservationCancelKeep").focus();
    }

    function cancelReservation() {
        if (!pendingCancelId) return;
        const reservations = getReservations();
        const target = reservations.find(item => item.id === pendingCancelId);
        if (!target || getReservationCategory(target) !== "upcoming") {
            byId("reservationCancelDialog").close();
            pendingCancelId = null;
            return;
        }
        target.status = "cancelled";
        target.cancelledAt = new Date().toISOString();
        if (!saveStored(RESERVATIONS_KEY, reservations)) {
            byId("reservationCancelMessage").textContent = "The reservation could not be cancelled because it could not be saved. Please try again.";
            return;
        }
        const targetId = pendingCancelId;
        pendingCancelId = null;
        byId("reservationCancelDialog").close();
        renderHistory();
        renderTimeSlots();
        if (byId("reservationDetailDialog").open && currentReservationId === targetId) openReservationDetails(targetId, previousDetailsTrigger);
        const fallback = [...byId("reservationHistoryList").querySelectorAll(".reservation-history-card")]
            .find(card => card.dataset.reservationId === targetId)?.querySelector('[data-res-action="details"]');
        window.requestAnimationFrame(() => {
            if (fallback) fallback.focus();
            else if (previousCancelTrigger instanceof HTMLElement && previousCancelTrigger.isConnected) previousCancelTrigger.focus();
            else byId("myReservationsTab").focus();
        });
    }

    function resetForm() {
        editingReservationId = null;
        currentReservationId = null;
        selectedTime = "";
        byId("reservationForm").reset();
        byId("reservationGuestCount").value = "2";
        byId("reservationWorkflow").hidden = false;
        byId("reservationConfirmation").hidden = true;
        byId("confirmReservationButton").disabled = false;
        byId("confirmReservationButton").innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Confirm Reservation';
        byId("reservationSubmitError").hidden = true;
        byId("reservationFormGeneralError").hidden = true;
        document.querySelectorAll(".reservation-field input, .reservation-field select, .reservation-field textarea").forEach(clearFieldError);
        clearTimeError();
        renderTimeSlots();
        setStep(1, false);
        updateLiveSummary();
    }

    function setupEvents() {
        byId("makeReservationTab").addEventListener("click", () => setActiveTab("make"));
        byId("myReservationsTab").addEventListener("click", () => setActiveTab("history"));
        [byId("makeReservationTab"), byId("myReservationsTab")].forEach((tab, index, tabs) => {
            tab.addEventListener("keydown", event => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + 2) % 2;
                tabs[next].focus();
                tabs[next].click();
            });
        });

        byId("reservationGuestCount").addEventListener("change", () => {
            clearFieldError(byId("reservationGuestCount"));
            renderTimeSlots();
        });
        byId("reservationDate").addEventListener("change", () => {
            selectedTime = "";
            clearFieldError(byId("reservationDate"));
            renderTimeSlots();
        });
        byId("reservationTimeSlots").addEventListener("click", event => {
            const button = event.target.closest("button[data-reservation-time]");
            if (!button || button.disabled) return;
            selectedTime = button.dataset.reservationTime;
            clearTimeError();
            renderTimeSlots();
            const active = byId("reservationTimeSlots").querySelector(`[data-reservation-time="${selectedTime}"]`);
            active?.focus();
        });
        byId("reservationOccasion").addEventListener("change", updateLiveSummary);
        byId("reservationSeating").addEventListener("change", updateLiveSummary);

        byId("reservationNextToDetails").addEventListener("click", () => {
            if (validateVisit()) setStep(2);
        });
        byId("reservationBackToVisit").addEventListener("click", () => setStep(1));
        byId("reservationNextToReview").addEventListener("click", () => {
            if (!validateContactDetails()) return;
            buildReview();
            setStep(3);
        });
        byId("reservationBackToDetails").addEventListener("click", () => setStep(2));
        byId("reservationForm").addEventListener("submit", submitReservation);

        ["reservationName", "reservationPhone", "reservationEmail"].forEach(id => {
            byId(id).addEventListener("input", () => clearFieldError(byId(id)));
            byId(id).addEventListener("change", () => clearFieldError(byId(id)));
        });

        byId("reservationHistoryList").addEventListener("click", event => {
            const button = event.target.closest("button[data-res-action]");
            if (!button) return;
            const id = button.dataset.reservationId;
            const action = button.dataset.resAction;
            if (action === "details") openReservationDetails(id, button);
            if (action === "edit") startEditingReservation(id, button);
            if (action === "cancel") openCancelDialog(id, button);
        });
        document.querySelectorAll("[data-res-filter]").forEach(button => {
            button.addEventListener("click", () => {
                currentFilter = button.dataset.resFilter;
                renderHistory();
            });
        });

        byId("reservationCancelKeep").addEventListener("click", () => byId("reservationCancelDialog").close());
        byId("reservationCancelConfirm").addEventListener("click", cancelReservation);
        byId("reservationCancelDialog").addEventListener("close", () => {
            if (pendingCancelId) pendingCancelId = null;
            if (previousCancelTrigger instanceof HTMLElement && previousCancelTrigger.isConnected) previousCancelTrigger.focus();
        });
        byId("reservationDetailClose").addEventListener("click", () => byId("reservationDetailDialog").close());
        byId("reservationDetailCloseFooter").addEventListener("click", () => byId("reservationDetailDialog").close());
        byId("reservationDetailDialog").addEventListener("click", event => {
            if (event.target === byId("reservationDetailDialog")) byId("reservationDetailDialog").close();
        });
        byId("reservationDetailDialog").addEventListener("close", () => {
            if (previousDetailsTrigger instanceof HTMLElement && previousDetailsTrigger.isConnected) previousDetailsTrigger.focus();
        });

        byId("viewMyReservationsButton").addEventListener("click", () => {
            currentFilter = "upcoming";
            setActiveTab("history");
            renderHistory();
            const trigger = byId("reservationHistoryList").querySelector(`[data-reservation-id="${currentReservationId}"] [data-res-action="details"]`);
            if (trigger) openReservationDetails(currentReservationId, trigger);
        });
        byId("makeAnotherReservationButton").addEventListener("click", () => {
            resetForm();
            setActiveTab("make");
            setStep(1);
        });
        byId("startNewReservationButton").addEventListener("click", () => {
            resetForm();
            setActiveTab("make");
            setStep(1);
        });
        byId("makeReservationFromEmpty").addEventListener("click", () => {
            resetForm();
            setActiveTab("make");
            setStep(1);
        });

        window.addEventListener("storage", event => {
            if (event.key === RESERVATIONS_KEY || event.key === null) {
                renderHistory();
                renderTimeSlots();
            }
        });
        window.addEventListener("hashchange", () => {
            if (window.location.hash === "#my-reservations") setActiveTab("history", false);
            if (window.location.hash === "#make-reservation") setActiveTab("make", false);
        });
    }

    function initReservationPage() {
        if (!byId("reservationForm")) return;
        setMinimumDate();
        setupEvents();
        renderTimeSlots();
        renderHistory();
        updateLiveSummary();
        setStep(1, false);
        if (window.location.hash === "#my-reservations") setActiveTab("history", false);
        else setActiveTab("make", false);
        window.addEventListener("language:changed", () => {
            renderTimeSlots();
            renderHistory();
            updateLiveSummary();
            if (currentReservationId && byId("reservationDetailDialog")?.open) openReservationDetails(currentReservationId, previousDetailsTrigger);
        });
    }

    document.addEventListener("DOMContentLoaded", initReservationPage);
})();
