// Initialize Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let categories = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const categoryGrid = document.getElementById('categoryGrid');
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const searchInput = document.getElementById('searchInput');
const checkoutBtn = document.getElementById('checkoutBtn');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchInput.addEventListener('input', debounce(handleSearch, 300));
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('active');
});
closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
});
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    // Add checkout logic here
    showNotification('Proceeding to checkout...');
});

// Add event listener to checkout button
document.getElementById('checkoutBtn').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Cart is empty!', 'error');
        return;
    }
    window.location.href = '/payment.html';
});

// Initialize App
async function initializeApp() {
    await Promise.all([
        loadCategories(),
        loadProducts()
    ]);
    updateCart();
    updateCartUI();
}

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load Products
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render Categories
function renderCategories() {
    const categoryImages = {
        'Electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=500',
        'Fashion': 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=500',
        'Home & Living': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=500',
        'Sports & Outdoors': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=500',
        'Books': 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=500',
        'Beauty & Health': 'https://images.unsplash.com/photo-1512207846876-bb54ef5056fe?auto=format&fit=crop&w=500',
        'Toys & Games': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=500',
        'Automotive': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=500'
    };

    categoryGrid.innerHTML = categories.map(category => `
        <div class="category-card" onclick="filterByCategory(${category.id})">
            <img src="${categoryImages[category.name] || 'https://via.placeholder.com/500'}" alt="${category.name}">
            <div class="category-overlay">
                <h3>${category.name}</h3>
            </div>
        </div>
    `).join('');
}

// Render Products
function renderProducts(productsToRender) {
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Filter Products by Category
function filterByCategory(categoryId) {
    const filteredProducts = categoryId 
        ? products.filter(product => product.category_id === categoryId)
        : products;
    renderProducts(filteredProducts);
}

// Search functionality
let searchTimeout;
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
document.querySelector('.search-container').appendChild(searchResults);

async function handleSearch(event) {
    const searchTerm = event.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }

    // Hide results if search is empty
    if (!searchTerm) {
        searchResults.classList.remove('active');
        return;
    }

    // Set new timeout
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchTerm)}`);
            const results = await response.json();

            // Display results
            if (results.length > 0) {
                searchResults.innerHTML = results.map(product => `
                    <div class="search-result-item" onclick="handleSearchResultClick(${product.id})">
                        <img src="${product.image_url}" alt="${product.name}">
                        <div class="search-result-info">
                            <div class="search-result-title">${product.name}</div>
                            <div class="search-result-price">$${product.price.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('');
            } else {
                searchResults.innerHTML = '<div class="no-results">No products found</div>';
            }
            searchResults.classList.add('active');
        } catch (error) {
            console.error('Error searching products:', error);
            searchResults.innerHTML = '<div class="no-results">Error searching products</div>';
            searchResults.classList.add('active');
        }
    }, 300);
}

function handleSearchResultClick(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Add to cart and show notification
        addToCart(product);
        // Clear search
        searchInput.value = '';
        searchResults.classList.remove('active');
    }
}

// Close search results when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
        searchResults.classList.remove('active');
    }
});

// Cart Functions
function updateCart() {
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart items display
    cartItems.innerHTML = cart.length ? cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image_url}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="quantity-btn remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('') : '<div class="empty-cart">Your cart is empty</div>';

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification('Product added to cart');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCartUI() {
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image_url}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total.toFixed(2);

    // Update cart count
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
