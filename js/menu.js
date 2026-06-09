// Taste Haven - Menu Controller

document.addEventListener('DOMContentLoaded', () => {
    const menuGrid = document.getElementById('menu-grid');
    if (!menuGrid) return; // Exit if not on menu page (or home page menu element)

    const searchInput = document.getElementById('search-food');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let activeCategory = 'all';
    let searchQuery = '';

    // Initial Render
    renderMenu(menuItems);

    // Setup Category Filter Click Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state in UI
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter
            activeCategory = btn.dataset.category;
            filterAndRender();
        });
    });

    // Setup Search Input Event Listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            filterAndRender();
        });
    }

    // Filter Logic
    function filterAndRender() {
        const filtered = menuItems.filter(item => {
            const matchesCategory = (activeCategory === 'all' || item.category === activeCategory);
            const matchesSearch = (
                item.name.toLowerCase().includes(searchQuery) ||
                item.description.toLowerCase().includes(searchQuery)
            );
            return matchesCategory && matchesSearch;
        });

        renderMenu(filtered);
    }

    // Dynamic Render Function
    function renderMenu(items) {
        menuGrid.innerHTML = '';

        if (items.length === 0) {
            menuGrid.innerHTML = `
                <div class="no-results">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <h3>No Culinary Delights Found</h3>
                    <p>Try adjusting your search criteria or category filter.</p>
                </div>
            `;
            return;
        }

        items.forEach(item => {
            const favorites = getFavorites();
            const isFavorited = favorites.includes(item.id);

            const card = document.createElement('div');
            card.className = 'premium-card';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';

            card.innerHTML = `
                <div class="dish-img-container">
                    <img class="dish-img" src="${item.image}" alt="${item.name}" loading="lazy">
                    <span class="dish-category-tag">${item.category}</span>
                    <button class="favorite-btn ${isFavorited ? 'active' : ''}" data-id="${item.id}">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                </div>
                <div class="dish-content">
                    <div class="dish-header">
                        <h3 class="dish-title">${item.name}</h3>
                        <span class="dish-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <p class="dish-desc">${item.description}</p>
                    <div class="dish-footer">
                        <button class="btn btn-primary btn-small add-to-cart-btn" data-id="${item.id}" style="width: 100%;">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;

            menuGrid.appendChild(card);

            // Subtle fade-in animation
            setTimeout(() => {
                card.style.transition = 'all 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);

            // Add to Cart Event Listener
            const addToCartBtn = card.querySelector('.add-to-cart-btn');
            addToCartBtn.addEventListener('click', () => {
                addToCartGlobal(item.id, item.name, item.price, item.image);
            });

            // Favorite Toggle Event
            const favBtn = card.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isAdded = toggleFavoriteGlobal(item.id);
                favBtn.classList.toggle('active', isAdded);
                showToast(isAdded ? `Added ${item.name} to favorites` : `Removed ${item.name}`, isAdded ? 'success' : 'error');
            });
        });
    }
});
