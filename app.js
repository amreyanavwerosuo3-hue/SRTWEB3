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
    // 2. MOBILE HAMBURGER MENU
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
    // 3. PRICING CALCULATOR LOGIC
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
    // 4. BOOKING SUBMISSION & GENERATION
    // ==========================================
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault(); 

            const senderName = document.getElementById("senderName").value;
            const pickupAddress = document.getElementById("pickupAddress").value;
            const receiverName = document.getElementById("receiverName").value;
            const deliveryAddress = document.getElementById("deliveryAddress").value;
            const finalCost = priceDisplay.textContent;

            // Generate tracking code
            const randomDigits = Math.floor(10000 + Math.random() * 90000);
            const uniqueTrackingID = `MJD-${randomDigits}`;

            const orderData = {
                trackingID: uniqueTrackingID,
                sender: senderName,
                pickup: pickupAddress,
                receiver: receiverName,
                delivery: deliveryAddress,
                cost: finalCost,
                status: "Rider Assigned"
            };

            // Save order to LocalStorage
            localStorage.setItem(uniqueTrackingID, JSON.stringify(orderData));

            alert(`🎉 Booking Confirmed!\n\nYour Mummy J Rider is on the way.\nYour Tracking ID is: ${uniqueTrackingID}\n\nPlease copy this code to track your parcel.`);
            
            bookingForm.reset();
            priceDisplay.textContent = "₦0.00";
        });
    }


    // ==========================================
    // 5. CLIENT TRACKING WIDGET
    // ==========================================
    if (trackingForm) {
        trackingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const searchID = trackingInput.value.trim().toUpperCase();

            if (!searchID) {
                alert("Please enter a valid Tracking ID.");
                return;
            }

            const savedOrder = localStorage.getItem(searchID);

            if (savedOrder) {
                const order = JSON.parse(savedOrder);
                alert(`📦 Order Found!\n\nTracking ID: ${order.trackingID}\nStatus: [ ${order.status} ]\nFrom: ${order.pickup}\nTo: ${order.delivery}\nTotal Cost: ${order.cost}`);
            } else {
                alert("❌ Tracking ID not found. Please check the code and try again.");
            }
        });
    }


    // ==========================================
    // 6. AUTHENTICATION (LOGIN & SIGNUP)
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

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim().toLowerCase();
            const password = document.getElementById("signupPassword").value;

            if (password.length < 6) {
                alert("Security Warning: Password must be at least 6 characters long.");
                return;
            }

            if (localStorage.getItem(email)) {
                alert("An account with this email already exists! Please log in.");
                return;
            }

            const userData = { name, email, password };
            localStorage.setItem(email, JSON.stringify(userData));

            alert("🎉 Registration Successful! You can now log in.");
            signupForm.reset();
            
            signupFormPane.classList.add("hidden-pane");
            loginFormPane.classList.remove("hidden-pane");
        });
    }

    // Unified Login handler (Processes both Users and Master Admin)
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;

            // Check Admin Routing First
            if (email === MASTER_ADMIN_EMAIL && password === MASTER_ADMIN_PASSWORD) {
                alert("🛡️ Access Granted: Welcome to the Mummy J Control Center.");
                
                authModal.classList.remove("active");
                loginForm.reset();
                
                loginBtn.textContent = "Admin Mode";
                loginBtn.style.backgroundColor = "#ff5500";
                
                adminDashboard.classList.remove("hidden-pane");
                renderAdminOrders();
                adminDashboard.scrollIntoView({ behavior: 'smooth' });
                return; 
            }

            // Otherwise, process normal User Login
            const storedAccount = localStorage.getItem(email);

            if (!storedAccount) {
                alert("No account found with this email. Please sign up first.");
                return;
            }

            const user = JSON.parse(storedAccount);

            if (user.password === password) {
                alert(`👋 Welcome back, ${user.name}! Login successful.`);
                loginBtn.textContent = `Hi, ${user.name.split(' ')[0]}`;
                loginBtn.style.backgroundColor = "#28a745"; 
                loginBtn.style.color = "white";
                authModal.classList.remove("active");
                loginForm.reset();
            } else {
                alert("❌ Incorrect password. Please try again.");
            }
        });
    }


    // ==========================================
    // 7. ADMIN DASHBOARD OPERATIONS
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
                    <td>${order.sender}<br><small style="color:#aaa">${order.pickup}</small></td>
                    <td>${order.receiver}<br><small style="color:#aaa">${order.delivery}</small></td>
                    <td>${order.cost}</td>
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

        // Attach layout status updater events
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
            adminDashboard.classList.add("hidden-pane");
            loginBtn.textContent = "Login / Signup";
            loginBtn.style.backgroundColor = "";
            loginBtn.style.color = "";
            alert("Logged out securely from Admin Control Center.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});