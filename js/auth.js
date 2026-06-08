// Taste Haven - Authentication and Dashboard Manager

// Initialize default users and orders database in localStorage
(function initDatabase() {
    const defaultUser = {
        name: "Arthur Pendragon",
        email: "guest@tastehaven.com",
        phone: "+2347062345820",
        address: "123 Camelot Way, Avalon, NY 10001",
        password: "password123"
    };

    let users = [];
    try {
        const existingUsers = localStorage.getItem('taste_haven_users');
        if (!existingUsers) {
            users.push(defaultUser);
            localStorage.setItem('taste_haven_users', JSON.stringify(users));
        } else {
            users = JSON.parse(existingUsers);
            // Ensure guest is there
            if (!users.some(u => u.email === defaultUser.email)) {
                users.push(defaultUser);
                localStorage.setItem('taste_haven_users', JSON.stringify(users));
            }
        }
    } catch (e) {
        console.error("Database initialization failed", e);
    }

    // Initialize mock order history for the guest user
    try {
        const existingOrders = localStorage.getItem('taste_haven_orders');
        if (!existingOrders) {
            const mockOrders = [
                {
                    id: "TH-9842",
                    email: "guest@tastehaven.com",
                    date: "June 02, 2026",
                    status: "delivered",
                    items: [
                        { name: "Royal Eggs Benedict", quantity: 2, price: 18.50 },
                        { name: "Taste Haven Premium Espresso", quantity: 2, price: 6.50 }
                    ],
                    total: 50.00
                },
                {
                    id: "TH-9701",
                    email: "guest@tastehaven.com",
                    date: "May 20, 2026",
                    status: "delivered",
                    items: [
                        { name: "Prime Gold-Leaf Ribeye Steak", quantity: 1, price: 58.00 },
                        { name: "Smoked Rosemary Old Fashioned", quantity: 2, price: 18.00 },
                        { name: "Gold Dust Chocolate Soufflé", quantity: 1, price: 16.50 }
                    ],
                    total: 110.50
                }
            ];
            localStorage.setItem('taste_haven_orders', JSON.stringify(mockOrders));
        }
    } catch (e) {
        console.error("Order database initialization failed", e);
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);

    // --- LOGIN / REGISTER PAGE ---
    if (page === 'login.html') {
        const session = getCurrentUser();
        if (session) {
            window.location.href = 'dashboard.html';
            return;
        }

        setupAuthPageTabs();
        setupAuthForms();
    }

    // --- DASHBOARD PAGE ---
    if (page === 'dashboard.html') {
        const session = getCurrentUser();
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        setupDashboard(session);
    }
});

// --- Auth Page Navigation Tab Controls ---
function setupAuthPageTabs() {
    const tabs = document.querySelectorAll('.auth-tab');
    const panels = document.querySelectorAll('.auth-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(`${target}-panel`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Password Visibility Toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                toggle.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                `;
            } else {
                input.type = 'password';
                toggle.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.29 2.67-3.08 3.3-5.06-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.43-1.47.68-2.33.68-2.49 0-4.5-2.01-4.5-4.5 0-.86.25-1.66.68-2.33zM11.83 9l2.84 2.84-.28-.68c-.18-.43-.53-.78-.96-.96l-.68-.28-.92-.92z"/>
                    </svg>
                `;
            }
        });
    });
}

// --- Setup Form Submission & Validation ---
function setupAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');
            let isValid = true;

            // Simple validation
            if (!validateEmail(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            if (passwordInput.value.trim().length < 6) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
            }

            if (!isValid) return;

            // Attempt Login
            const users = JSON.parse(localStorage.getItem('taste_haven_users') || '[]');
            const user = users.find(u => u.email.toLowerCase() === emailInput.value.toLowerCase().trim() && u.password === passwordInput.value);

            if (user) {
                // Set session
                localStorage.setItem('taste_haven_session', JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '',
                    address: user.address || ''
                }));
                showToast("Login Successful! Redirecting...", "success");
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                showToast("Invalid email or password.", "error");
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('reg-name');
            const emailInput = document.getElementById('reg-email');
            const phoneInput = document.getElementById('reg-phone');
            const passwordInput = document.getElementById('reg-password');
            const termsCheck = document.getElementById('reg-terms');
            let isValid = true;

            if (nameInput.value.trim().length < 3) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
            }

            if (!validateEmail(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
            }

            if (phoneInput.value.trim().length < 8) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            } else {
                phoneInput.classList.remove('is-invalid');
            }

            if (passwordInput.value.trim().length < 6) {
                passwordInput.classList.add('is-invalid');
                isValid = false;
            } else {
                passwordInput.classList.remove('is-invalid');
            }

            if (termsCheck && !termsCheck.checked) {
                showToast("You must agree to the Terms & Conditions.", "error");
                isValid = false;
            }

            if (!isValid) return;

            const users = JSON.parse(localStorage.getItem('taste_haven_users') || '[]');
            
            // Check duplicate
            if (users.some(u => u.email.toLowerCase() === emailInput.value.toLowerCase().trim())) {
                showToast("Email address already registered.", "error");
                emailInput.classList.add('is-invalid');
                return;
            }

            // Save user
            const newUser = {
                name: nameInput.value.trim(),
                email: emailInput.value.toLowerCase().trim(),
                phone: phoneInput.value.trim(),
                address: "", // filled in dashboard later
                password: passwordInput.value
            };
            
            users.push(newUser);
            localStorage.setItem('taste_haven_users', JSON.stringify(users));

            showToast("Registration Successful! Please log in.", "success");
            
            // Switch tabs to login
            setTimeout(() => {
                const loginTab = document.querySelector('.auth-tab[data-tab="login"]');
                if (loginTab) {
                    loginTab.click();
                    // Auto fill registration email in login
                    document.getElementById('login-email').value = newUser.email;
                    document.getElementById('login-password').value = '';
                }
            }, 1000);
        });
    }
}

// Helper validation function
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// --- SETUP DASHBOARD INTERFACE ---
function setupDashboard(userSession) {
    // Fill Sidebar info
    const sidebarName = document.getElementById('db-user-name');
    const sidebarEmail = document.getElementById('db-user-email');
    if (sidebarName) sidebarName.textContent = userSession.name;
    if (sidebarEmail) sidebarEmail.textContent = userSession.email;

    // Load initial panel data
    loadProfilePanel(userSession);
    loadOrdersPanel(userSession);

    // Setup Sidebar Tab Navigation
    const links = document.querySelectorAll('.dashboard-menu-link:not(.logout)');
    const panels = document.querySelectorAll('.dashboard-content-panel');

    links.forEach(link => {
        link.addEventListener('click', () => {
            const targetPanelId = link.dataset.panel;

            links.forEach(l => l.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });

    // Setup profile form update handler
    const profileForm = document.getElementById('db-profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameVal = document.getElementById('db-name').value.trim();
            const phoneVal = document.getElementById('db-phone').value.trim();
            const addressVal = document.getElementById('db-address').value.trim();

            if (nameVal.length < 3) {
                showToast("Please enter a valid name.", "error");
                return;
            }

            // Update user in users database
            const users = JSON.parse(localStorage.getItem('taste_haven_users') || '[]');
            const userIndex = users.findIndex(u => u.email.toLowerCase() === userSession.email.toLowerCase());

            if (userIndex !== -1) {
                users[userIndex].name = nameVal;
                users[userIndex].phone = phoneVal;
                users[userIndex].address = addressVal;
                localStorage.setItem('taste_haven_users', JSON.stringify(users));
            }

            // Update session
            userSession.name = nameVal;
            userSession.phone = phoneVal;
            userSession.address = addressVal;
            localStorage.setItem('taste_haven_session', JSON.stringify(userSession));

            // Refresh visuals
            if (sidebarName) sidebarName.textContent = nameVal;
            updateUserHeader();

            showToast("Profile updated successfully!", "success");
        });
    }

    // Setup logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }
}

function loadProfilePanel(user) {
    const nameInput = document.getElementById('db-name');
    const emailInput = document.getElementById('db-email');
    const phoneInput = document.getElementById('db-phone');
    const addressInput = document.getElementById('db-address');

    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
}

function loadOrdersPanel(user) {
    const ordersListContainer = document.getElementById('db-orders-list');
    if (!ordersListContainer) return;

    const allOrders = JSON.parse(localStorage.getItem('taste_haven_orders') || '[]');
    const userOrders = allOrders.filter(o => o.email.toLowerCase() === user.email.toLowerCase());

    if (userOrders.length === 0) {
        ordersListContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 0; color: var(--color-grey-text-muted);">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor" style="margin-bottom: 15px;">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                <p>No orders placed yet. Visit our <a href="menu.html" style="color: var(--color-gold); text-decoration: underline;">Menu</a> to place your first order!</p>
            </div>
        `;
        return;
    }

    // Sort orders from newest to oldest
    userOrders.reverse();

    let ordersHtml = '<div class="order-history-list">';
    userOrders.forEach(order => {
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item-row">
                    <span>${item.name} <span class="text-muted">x${item.quantity}</span></span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });

        ordersHtml += `
            <div class="order-card">
                <div class="order-card-header">
                    <div>
                        <span class="order-id">${order.id}</span>
                        <span class="order-date" style="margin-left: 15px;">${order.date}</span>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items-grid">
                    ${itemsHtml}
                    <div class="order-total-row">
                        <span>Total Paid</span>
                        <span class="text-gold">$${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
    });
    ordersHtml += '</div>';

    ordersListContainer.innerHTML = ordersHtml;
}

function logoutUser() {
    localStorage.removeItem('taste_haven_session');
    showToast("Logged out successfully.", "success");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}
