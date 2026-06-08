// Taste Haven - Cart Controller

document.addEventListener('DOMContentLoaded', () => {
    const cartWrapper = document.getElementById('cart-page-content');
    if (!cartWrapper) return; // Exit if not on cart page

    // Listen to custom event when cart is modified
    window.addEventListener('cartUpdated', renderCartPage);

    // Initial render
    renderCartPage();

    function renderCartPage() {
        const cart = getCart();

        if (cart.length === 0) {
            renderEmptyState();
            return;
        }

        // Render Cart Layout
        cartWrapper.innerHTML = `
            <div class="cart-layout">
                <!-- Left: Cart Items Table -->
                <div class="cart-items-wrapper">
                    <div class="cart-table-container">
                        <table class="cart-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th style="width: 50px;"></th>
                                </tr>
                            </thead>
                            <tbody id="cart-table-body">
                            </tbody>
                        </table>
                    </div>
                    <div class="cart-actions">
                        <a href="menu.html" class="btn btn-secondary btn-small">Continue Shopping</a>
                        <button id="clear-cart-btn" class="btn btn-dark btn-small">Clear Cart</button>
                    </div>
                </div>

                <!-- Right: Summary Panel -->
                <div class="cart-summary">
                    <h3 class="summary-title">Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="summary-subtotal">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (8%)</span>
                        <span id="summary-tax">$0.00</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery</span>
                        <span class="text-gold">Free</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span id="summary-total" class="text-gold">$0.00</span>
                    </div>
                    <button id="checkout-btn" class="btn btn-primary" style="width: 100%; margin-top: 20px;">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;

        // Populate Table Body
        const tbody = document.getElementById('cart-table-body');
        let subtotal = 0;

        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="cart-item-info">
                        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                        <div>
                            <h4 class="cart-item-name">${item.name}</h4>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 500;">$${item.price.toFixed(2)}</td>
                <td>
                    <div class="qty-counter">
                        <button class="qty-btn dec-qty" data-id="${item.id}">&minus;</button>
                        <input type="text" class="qty-input" value="${item.quantity}" readonly>
                        <button class="qty-btn inc-qty" data-id="${item.id}">&plus;</button>
                    </div>
                </td>
                <td style="font-weight: 600; color: var(--color-gold);">$${itemSubtotal.toFixed(2)}</td>
                <td>
                    <span class="cart-remove-btn remove-item" data-id="${item.id}">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Calculate Totals
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('summary-tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('summary-total').textContent = `$${total.toFixed(2)}`;

        // Hook up Table Interactive Events
        tbody.querySelectorAll('.dec-qty').forEach(btn => {
            btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), -1));
        });

        tbody.querySelectorAll('.inc-qty').forEach(btn => {
            btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), 1));
        });

        tbody.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id)));
        });

        // Clear Cart Button Event
        document.getElementById('clear-cart-btn').addEventListener('click', () => {
            saveCart([]);
            showToast("Your shopping cart has been cleared.", "success");
        });

        // Checkout Button Event
        document.getElementById('checkout-btn').addEventListener('click', () => {
            openCheckoutModal(total);
        });
    }

    function renderEmptyState() {
        cartWrapper.innerHTML = `
            <div class="cart-empty-state">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.9 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                <h2>Your Cart is Empty</h2>
                <p>Add some exquisite culinary dishes from our menu to begin your dining experience.</p>
                <a href="menu.html" class="btn btn-primary">Explore Our Menu</a>
            </div>
        `;
    }

    function changeQuantity(id, delta) {
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity < 1) {
                // If it goes below 1, remove item
                removeFromCart(id);
                return;
            }
            saveCart(cart);
        }
    }

    function removeFromCart(id) {
        let cart = getCart();
        const item = cart.find(i => i.id === id);
        const itemName = item ? item.name : 'Item';
        cart = cart.filter(i => i.id !== id);
        saveCart(cart);
        showToast(`Removed ${itemName} from cart.`, "error");
    }

    // --- Checkout Modal Logic ---
    function openCheckoutModal(orderTotal) {
        const user = getCurrentUser();
        
        let modal = document.getElementById('checkout-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'checkout-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <h3 class="modal-title">Complete Your Order</h3>
                <form id="checkout-form" style="margin-top: 25px;">
                    <div class="form-group">
                        <label class="form-label" for="chk-name">Full Name</label>
                        <input type="text" id="chk-name" class="form-control" required value="${user ? user.name : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="chk-phone">Phone Number</label>
                        <input type="tel" id="chk-phone" class="form-control" required value="${user ? user.phone : ''}">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="chk-address">Delivery Address</label>
                        <textarea id="chk-address" class="form-control" rows="3" required>${user ? user.address : ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="chk-notes">Special Culinary Requests</label>
                        <textarea id="chk-notes" class="form-control" rows="2" placeholder="Dietary requests, allergies, delivery instructions..."></textarea>
                    </div>
                    <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-size: 0.85rem; color: var(--color-grey-text-muted);">Amount Due</span>
                            <div style="font-size: 1.5rem; font-family: var(--font-heading); font-weight: 700; color: var(--color-gold);">$${orderTotal.toFixed(2)}</div>
                        </div>
                        <button type="submit" class="btn btn-primary">Place Order</button>
                    </div>
                </form>
            </div>
        `;

        modal.classList.add('active');

        // Close events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Form Submission
        const chkForm = document.getElementById('checkout-form');
        chkForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('chk-name').value.trim();
            const phone = document.getElementById('chk-phone').value.trim();
            const address = document.getElementById('chk-address').value.trim();
            const notes = document.getElementById('chk-notes').value.trim();

            const cart = getCart();
            const orderId = 'TH-' + Math.floor(1000 + Math.random() * 9000);
            
            // Format current date
            const options = { year: 'numeric', month: 'long', day: '2-digit' };
            const formattedDate = new Date().toLocaleDateString('en-US', options);

            const newOrder = {
                id: orderId,
                email: user ? user.email : 'guest_order@tastehaven.com',
                date: formattedDate,
                status: 'processing',
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: orderTotal,
                deliveryInfo: { name, phone, address, notes }
            };

            // Save order
            const allOrders = JSON.parse(localStorage.getItem('taste_haven_orders') || '[]');
            allOrders.push(newOrder);
            localStorage.setItem('taste_haven_orders', JSON.stringify(allOrders));

            // Clear Cart
            saveCart([]);
            modal.classList.remove('active');

            // Feedback
            showToast(`Order ${orderId} placed successfully!`, "success");

            // Redirect
            setTimeout(() => {
                if (user) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert(`Thank you for dining with Taste Haven! Your guest order ID is ${orderId}. Track it by registering or contacting us.`);
                    window.location.href = 'index.html';
                }
            }, 1500);
        });
    }
});
