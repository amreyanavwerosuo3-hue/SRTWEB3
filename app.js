document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. ELEMENT SELECTORS
    // ==========================================
    const bookingForm = document.getElementById("dispatchBookingForm");
    const itemTypeSelect = document.getElementById("itemType");
    const weightSelect = document.getElementById("packageWeight");
    const priceDisplay = document.getElementById("calculatedPrice");
    
    const trackingForm = document.querySelector("#tracking form");
    const trackingInput = document.querySelector("#tracking input");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinksList = document.getElementById("navLinksList");

    const authModal = document.getElementById("authModal");
    const loginBtn = document.querySelector(".login-btn");
    const closeModalBtn = document.querySelector(".close-modal-btn");
    
    const loginFormPane = document.getElementById("loginFormPane");
    const signupFormPane = document.getElementById("signupFormPane");
    const switchToSignup = document.getElementById("switchToSignup");
    const switchToLogin = document.getElementById("switchToLogin");

    const signupForm = document.getElementById("userSignupForm");
    const loginForm = document.getElementById("userLoginForm");

    const adminDashboard = document.getElementById("adminDashboard");
    const adminOrderTableBody = document.getElementById("adminOrderTableBody");
    const logoutAdminBtn = document.getElementById("logoutAdminBtn");

    // Master Credentials for Admin
    const MASTER_ADMIN_EMAIL = "admin@mummyj.com";
    const MASTER_ADMIN_PASSWORD = "mummyj2026";

    // ==========================================
    // 2. RETIREVE ADMIN SESSION ON RELOAD
    // ==========================================
    if (localStorage.getItem("currentAdminMode") === "true") {
        if(adminDashboard) adminDashboard.classList.remove("hidden-pane");
        if(loginBtn) {
            loginBtn.textContent = "Admin Mode";
            loginBtn.style.backgroundColor = "#ff5500";
        }
        renderAdminOrders();
    }

    // ==========================================
    // 3. MOBILE HAMBURGER MENU
    // ==========================================
    if (mobileMenuBtn && navLinksList) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenuBtn.classList.toggle("open");
            navLinksList.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenuBtn.classList.remove("open");
                navLinksList.classList.remove("active");
            });
        });
    }

    // ==========================================
    // 4. PRICING CALCULATOR LOGIC
    // ==========================================
    const basePrices = {
        documents: 1500,
        food: 2000,
        clothes: 1800,
        electronics: 2500,
        other: 2000
    };

    const weightMultipliers = {
        light: 1.0,
        medium: 1.3,
        heavy: 1.6
    };

    function updateEstimatedPrice() {
        const selectedType = itemTypeSelect.value;
        const selectedWeight = weightSelect.value;

        if (!selectedType) {
            priceDisplay.textContent = "₦0.00";
            return;
        }

        const base = basePrices[selectedType];
        const multiplier = weightMultipliers[selectedWeight];
        const finalPrice = Math.round(base * multiplier);

        priceDisplay.textContent = "₦" + finalPrice.toLocaleString();
    }

    if (itemTypeSelect && weightSelect) {
        itemTypeSelect.addEventListener("change", updateEstimatedPrice);
        weightSelect.addEventListener("change", updateEstimatedPrice);
    }

    // ==========================================
    // 5. BOOKING SUBMISSION
    // ==========================================
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const senderName = document.getElementById("senderName").value;
            const senderPhone = document.getElementById("senderPhone").value;
            const pickupAddress = document.getElementById("pickupAddress").value;
            const receiverName = document.getElementById("receiverName").value;
            const receiverPhone = document.getElementById("receiverPhone").value;
            const deliveryAddress = document.getElementById("deliveryAddress").value;
            const finalCost = priceDisplay.textContent;

            const randomDigits = Math.floor(10000 + Math.random() * 90000);
            const uniqueTrackingID = `MJD-${randomDigits}`;

            const orderData = {
                trackingID: uniqueTrackingID,
                sender: senderName,
                senderPhone: senderPhone,
                pickup: pickupAddress,
                receiver: receiverName,
                receiverPhone: receiverPhone,
                delivery: deliveryAddress,
                cost: finalCost,
                status: "Rider Assigned"
            };

            localStorage.setItem(uniqueTrackingID, JSON.stringify(orderData));

            alert(`🎉 Booking Confirmed!\n\nYour Tracking ID is: ${uniqueTrackingID}\n\nRider assigned shortly.`);
            
            bookingForm.reset();
            priceDisplay.textContent = "₦0.00";
            
            if(localStorage.getItem("currentAdminMode") === "true") {
                renderAdminOrders();
            }
        });
    }

    // ==========================================
    // 6. CLIENT TRACKING WITH DIRECT ADMIN CHAT
    // ==========================================
    if (trackingForm) {
        trackingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const searchID = trackingInput.value.trim().toUpperCase();
            if (!searchID) return;

            const savedOrder = localStorage.getItem(searchID);

            if (savedOrder) {
                const order = JSON.parse(savedOrder);
                
                // Professional WhatsApp text routing line
                const adminWhatsAppNumber = "2348031234567"; // Replace with real Mummy J business phone line
                const message = encodeURIComponent(`Hello Mummy J Admin, I need support with my package order. Tracking ID: ${order.trackingID}. Status is currently [${order.status}].`);
                const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${message}`;

                alert(`📦 Order Found!\n\nTracking ID: ${order.trackingID}\nStatus: [ ${order.status} ]\nFrom: ${order.pickup}\nTo: ${order.delivery}\nTotal Cost: ${order.cost}\n\nNeed to speak with us? Click OK to chat with Admin instantly on WhatsApp.`);
                
                window.open(whatsappUrl, '_blank');
            } else {
                alert("❌ Tracking ID not found. Please check the code and try again.");
            }
        });
    }

    // ==========================================
    // 7. AUTHENTICATION MODULE
    // ==========================================
    if (loginBtn && authModal) {
        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();
            authModal.classList.add("active");
        });

        closeModalBtn.addEventListener("click", () => {
            authModal.classList.remove("active");
        });

        switchToSignup.addEventListener("click", () => {
            loginFormPane.classList.add("hidden-pane");
            signupFormPane.classList.remove("hidden-pane");
        });

        switchToLogin.addEventListener("click", () => {
            signupFormPane.classList.add("hidden-pane");
            loginFormPane.classList.remove("hidden-pane");
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim().toLowerCase();
            const password = document.getElementById("signupPassword").value;

            if (password.length < 6) {
                alert("Password must be at least 6 characters.");
                return;
            }

            if (localStorage.getItem(email)) {
                alert("Account already exists.");
                return;
            }

            localStorage.setItem(email, JSON.stringify({ name, email, password }));
            alert("🎉 Registration Successful!");
            signupForm.reset();
            signupFormPane.classList.add("hidden-pane");
            loginFormPane.classList.remove("hidden-pane");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;

            if (email === MASTER_ADMIN_EMAIL && password === MASTER_ADMIN_PASSWORD) {
                alert("🛡️ Access Granted: Welcome Admin.");
                authModal.classList.remove("active");
                loginForm.reset();
                loginBtn.textContent = "Admin Mode";
                loginBtn.style.backgroundColor = "#ff5500";
                localStorage.setItem("currentAdminMode", "true");
                adminDashboard.classList.remove("hidden-pane");
                renderAdminOrders();
                adminDashboard.scrollIntoView({ behavior: 'smooth' });
                return; 
            }

            const storedAccount = localStorage.getItem(email);
            if (!storedAccount) {
                alert("No account found.");
                return;
            }

            const user = JSON.parse(storedAccount);
            if (user.password === password) {
                alert(`👋 Welcome, ${user.name}!`);
                loginBtn.textContent = `Hi, ${user.name.split(' ')[0]}`;
                loginBtn.style.backgroundColor = "#28a745"; 
                loginBtn.style.color = "white";
                authModal.classList.remove("active");
                loginForm.reset();
            } else {
                alert("❌ Incorrect password.");
            }
        });
    }

    // ==========================================
    // 8. ADMIN DASHBOARD WITH COMMUNICATIONS
    // ==========================================
    function renderAdminOrders() {
        if (!adminOrderTableBody) return;
        adminOrderTableBody.innerHTML = ""; 
        let ordersFound = false;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("MJD-")) {
                ordersFound = true;
                const order = JSON.parse(localStorage.getItem(key));

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><strong>${order.trackingID}</strong></td>
                    <td>
                        <strong>${order.sender}</strong><br>
                        <a href="tel:${order.senderPhone}" class="admin-call-link">📞 ${order.senderPhone}</a><br>
                        <small style="color:#aaa">${order.pickup}</small>
                    </td>
                    <td>
                        <strong>${order.receiver}</strong><br>
                        <a href="tel:${order.receiverPhone}" class="admin-call-link">📞 ${order.receiverPhone}</a><br>
                        <small style="color:#aaa">${order.delivery}</small>
                    </td>
                    <td><span style="color:#ff9900; font-weight:bold;">${order.cost}</span></td>
                    <td><span class="status-badge" id="badge-${order.trackingID}">${order.status}</span></td>
                    <td>
                        <select class="status-updater" data-id="${order.trackingID}">
                            <option value="Rider Assigned" ${order.status === 'Rider Assigned' ? 'selected' : ''}>Rider Assigned</option>
                            <option value="In Transit" ${order.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </td>
                `;
                adminOrderTableBody.appendChild(row);
            }
        }

        if (!ordersFound) {
            adminOrderTableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888;">No active dispatch requests available.</td></tr>`;
        }

        document.querySelectorAll(".status-updater").forEach(selectElement => {
            selectElement.addEventListener("change", (event) => {
                const targetTrackingID = event.target.getAttribute("data-id");
                const newStatusValue = event.target.value;
                const updatedOrder = JSON.parse(localStorage.getItem(targetTrackingID));
                updatedOrder.status = newStatusValue;
                localStorage.setItem(targetTrackingID, JSON.stringify(updatedOrder));
                document.getElementById(`badge-${targetTrackingID}`).textContent = newStatusValue;
            });
        });
    }

    if (logoutAdminBtn) {
        logoutAdminBtn.addEventListener("click", () => {
            localStorage.removeItem("currentAdminMode");
            adminDashboard.classList.add("hidden-pane");
            loginBtn.textContent = "Login / Signup";
            loginBtn.style.backgroundColor = "";
            loginBtn.style.color = "";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});