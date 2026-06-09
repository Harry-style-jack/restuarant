// Taste Haven - Global Script

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header scroll effect
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            document.body.classList.toggle('mobile-hamburger-active');
            mobileNav.classList.toggle('active');
        });

        // Close mobile menu when clicking outside or on links
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('mobile-hamburger-active');
                mobileNav.classList.remove('active');
            });
        });
    }

    // Initialize Global Navbar updates
    updateCartBadge();
    updateUserHeader();
    updateFavoritesBadge();
});

// --- Shopping Cart Shared Utilities ---
function getCart() {
    try {
        const cartData = localStorage.getItem('taste_haven_cart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (e) {
        console.error("Error loading cart from localStorage", e);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem('taste_haven_cart', JSON.stringify(cart));
        updateCartBadge();
        // Dispatch custom event to let cart page know it needs to re-render
        window.dispatchEvent(new Event('cartUpdated'));
    } catch (e) {
        console.error("Error saving cart to localStorage", e);
    }
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    badges.forEach(badge => {
        if (totalCount > 0) {
            badge.textContent = totalCount;
            badge.style.display = 'flex';
        } else {
            badge.textContent = '0';
            badge.style.display = 'none'; // Or keep it hidden
        }
    });
}

function getFavorites() {
    try {
        const favData = localStorage.getItem('taste_haven_favorites');
        return favData ? JSON.parse(favData) : [];
    } catch (e) {
        console.error("Error loading favorites", e);
        return [];
    }
}

function toggleFavoriteGlobal(productId) {
    let favorites = getFavorites();
    const index = favorites.indexOf(productId);
    let added = false;

    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(productId);
        added = true;
    }

    localStorage.setItem('taste_haven_favorites', JSON.stringify(favorites));
    updateFavoritesBadge();
    window.dispatchEvent(new Event('favoritesUpdated'));
    return added;
}

function updateFavoritesBadge() {
    const badges = document.querySelectorAll('.fav-count');
    const favorites = getFavorites();
    badges.forEach(badge => {
        if (favorites.length > 0) {
            badge.textContent = favorites.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

function addToCartGlobal(productId, productName, productPrice, productImage, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: quantity
        });
    }

    saveCart(cart);
    showToast(`Added ${productName} to cart!`, 'success');
}

// --- Toast Notification Engine ---
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let svgIcon = '';
    if (type === 'success') {
        svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2ecc71" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;
    } else if (type === 'error') {
        svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#e74c3c" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
    }

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            ${svgIcon}
            <span class="toast-message">${message}</span>
        </div>
        <span class="toast-close">&times;</span>
    `;

    container.appendChild(toast);

    // Close button event listener
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        closeToast(toast);
    });

    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
        closeToast(toast);
    }, 3500);
}

function closeToast(toast) {
    if (toast.parentNode) {
        toast.classList.add('toast-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// --- Authentication Status Navbar Integrator ---
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('taste_haven_session');
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error("Error reading session from localStorage", e);
        return null;
    }
}

function updateUserHeader() {
    const user = getCurrentUser();
    const navUserBtnContainers = document.querySelectorAll('.nav-user-btn-container');

    navUserBtnContainers.forEach(container => {
        if (user) {
            const firstName = user.name.split(' ')[0];
            let avatarHtml = '';

            if (user.profileImage && (user.profileImage.startsWith('http') || user.profileImage.startsWith('data:'))) {
                avatarHtml = `<img src="${user.profileImage}" alt="${user.name}" class="profile-avatar">`;
            } else {
                avatarHtml = `<span class="profile-initials">${user.name.charAt(0).toUpperCase()}</span>`;
            }

            container.innerHTML = `
                <a href="dashboard.html" class="nav-user-btn user-logged-in">
                    ${avatarHtml}
                    <span class="user-greeting">Hi, ${firstName}</span>
                </a>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html" class="nav-user-btn user-logged-out">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Login</span>
                </a>
            `;
        }
    });
}
