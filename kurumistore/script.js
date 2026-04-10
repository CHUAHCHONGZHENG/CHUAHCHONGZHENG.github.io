// --- Toast Notification System ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.error("Toast container not found! Please add <div id='toastContainer' class='toast-container'></div> to your HTML.");
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = '';
    if (type === 'success') icon = '<i class="fas fa-check-circle"></i>';
    else if (type === 'error') icon = '<i class="fas fa-exclamation-circle"></i>';
    else if (type === 'info') icon = '<i class="fas fa-info-circle"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

// --- Product Data ---
let products = [
    { 
        id: 1, 
        name: "Date A Live Fragment Date A Bullet", 
        price: 35.00, 
        originalPrice: 45.00, 
        img: "kurumiEBOOK2.jpg", 
        description: "The official spin-off light novel series focusing on Kurumi Tokisaki. Dive deeper into the Empty Realm in this must-read addition to the Date A Live universe.", 
        status: "normal" 
    },
    { 
        id: 2, 
        name: "Date A Live III Acrylic Pinch Strap - Kurumi Tokisaki", 
        price: 105.00, 
        originalPrice: 120.00, 
        img: "kurumiStrap.jpg", 
        description: "Cute acrylic pinch strap featuring Kurumi Tokisaki from Date A Live III. Perfect for attaching to your ita-bag, backpack, or keys!", 
        status: "normal" 
    },
    { 
        id: 3, 
        name: "Date A Live Kurumi Tokisaki Fantasia 30th Anniversary Ver. 1/7 Scale Figure", 
        price: 625.00, 
        originalPrice: 630.00, 
        img: "kurumi1.jpg", 
        description: "Exquisite 1/7 scale figure of Kurumi Tokisaki, specially designed to commemorate the Fantasia 30th Anniversary. Features stunning details and an elegant pose.", 
        status: "normal" 
    },
    { 
        id: 4, 
        name: "Fantasia Rebuild Acrylic Stand Date A Live Kurumi Tokisaki", 
        price: 89.99, 
        originalPrice: 99.99, 
        img: "kurumiStand.jpg", 
        description: "Beautiful acrylic stand of Kurumi Tokisaki featuring her unique artwork from the crossover RPG 'Fantasia Rebuild'. Great for desk display.", 
        status: "normal" 
    },
    { 
        id: 5, 
        name: "Date A Live Trading Hologram Can Badge ~Lots of Kurumi~", 
        price: 22.00,
        originalPrice: 25.00, 
        img: "kurumibadge.jpg", 
        description: "A gorgeous holographic can badge from the 'Lots of Kurumi' collection. Shines beautifully in the light and is highly collectible.", 
        status: "normal" 
    },
    { 
        id: 6, 
        name: "The Case Files of Magical Detective Kurumi Tokisaki", 
        price: 35.00, 
        originalPrice: 40.00, 
        img: "kurumiEbook.jpg", 
        description: "Follow the thrilling mysteries in this spin-off novel, featuring Kurumi Tokisaki as a magical detective! A unique addition to your reading collection.", 
        status: "normal" 
    },
    { 
        id: 7, 
        name: "Date A Live Acrylic Panel: Kurumi Tokisaki (Dragon Magazine Ver.)", 
        price: 220.00, 
        originalPrice: 250.00, 
        img: "KurumiAcrylicPanel.jpg", 
        description: "High-quality premium acrylic panel showcasing an exclusive Dragon Magazine illustration of Kurumi Tokisaki. Includes metal stand pegs for easy display.", 
        status: "normal" 
    },
    { 
        id: 8, 
        name: "Date A Bullet Anime Adaptation Commemorative Fair: Kurumi Tokisaki Canvas Art", 
        price: 220.00, 
        originalPrice: 250.00, 
        img: "kurumiArt.jpg", 
        description: "Premium canvas art released to commemorate the Date A Bullet anime adaptation. Features high-resolution printing on authentic canvas material.", 
        status: "normal" 
    },
    { 
        id: 9, 
        name: "Date A Live Trading Hologram Can Badge ~Kurumi Valentine~", 
        price: 25.00, 
        originalPrice: 30.00, 
        img: "kurumi badge2.jpg", 
        description: "Hologram can badges featuring illustrations from the Kurumi Valentine illustration in Date A Live are now available! (6 types in total).", 
        status: "sold-out" 
    },
    { 
        id: 10, 
        name: "Date A Live Square Acrylic Stand Valentine Ver. Kurumi", 
        price: 85.00, 
        originalPrice: 95.00, 
        img: "kurumivanlentinestand.jpg", 
        description: "A square acrylic stand featuring Kurumi from Date A Live in a Valentine's Day color illustration is now available! This product was previously sold at an event from February 13, 2026 to March 1, 2026.", 
        status: "pre-order" 
    },
    { 
        id: 11, 
        name: "Date A Live Kurumi Valentine 2026 Original Illustration Desk Mat", 
        price: 150.00, 
        originalPrice: 180.00, 
        img: "kurumimat.jpg", 
        description: "A desk mat featuring an original illustration by Tsunako-sensei from Date A Live is now available! This product was previously sold at an event held from February 13, 2026 to March 1, 2026.", 
        status: "pre-order" 
    },
    { 
        id: 12, 
        name: "DATE A LIVE 10th ANNIVERSARY FAIR Kurumi Book Cover", 
        price: 350.00, 
        originalPrice: 400.00, 
        img: "kurumibookcover.jpg", 
        description: "This book cover features an original illustration of Kurumi drawn by Tsunako to commemorate the 10th anniversary of the publication of Date A Live! ", 
        status: "pre-order" 
    }
];

let cart = []; 
let favorites = [];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartBadge = document.getElementById('cartBadge');
const favBadge = document.getElementById('favBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const favItemsContainer = document.getElementById('favItemsContainer');
const productDetailsContent = document.getElementById('productDetailsContent');

// Render Products
function renderProducts(items) {
    productGrid.innerHTML = '';
    items.forEach(product => {
        const isFav = favorites.includes(product.id) ? 'active' : '';
        const status = product.status || 'normal'; 
        
        let badgeHtml = '';
        let btnHtml = '';
        let imgClass = '';
        let clickAction = `onclick="openProductModal(${product.id})"`; 

        if (status === 'sold-out') {
            badgeHtml = '<div class="status-badge sold-out">Sold Out</div>';
            btnHtml = '<button class="btn btn-disabled" disabled>Out of Stock</button>';
            imgClass = 'img-sold-out';
            clickAction = ''; 
        } else if (status === 'pre-order') {
            badgeHtml = '<div class="status-badge pre-order">Pre-Order</div>';
            btnHtml = `<button class="btn btn-preorder" onclick="addToCart(${product.id}, 1)">Pre-Order Now</button>`;
        } else {
            btnHtml = `<button class="btn btn-add" onclick="addToCart(${product.id}, 1)">Add to Cart</button>`;
        }

        productGrid.innerHTML += `
            <div class="card">
                ${badgeHtml}
                <img src="${product.img}" alt="${product.name}" class="${imgClass}" ${clickAction}>
                <div class="card-info">
                    <div class="card-title" ${clickAction}>${product.name}</div>
                    <div class="price-container">
                        <div class="discount-price">RM${product.price.toFixed(2)}</div>
                        <div class="original-price">RM${product.originalPrice.toFixed(2)}</div>
                    </div>
                    <div class="card-actions">
                        ${btnHtml}
                        <button class="btn btn-fav ${isFav}" onclick="toggleFavorite(${product.id}, this)">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    const isFav = favorites.includes(id) ? 'active' : '';
    const status = product.status || 'normal';
    
    let modalBtnHtml = '';
    if (status === 'sold-out') {
        modalBtnHtml = '<button class="btn btn-disabled" disabled>Out of Stock</button>';
    } else if (status === 'pre-order') {
        modalBtnHtml = `<button class="btn btn-preorder" onclick="addToCartFromModal(${product.id})">Pre-Order Now</button>`;
    } else {
        modalBtnHtml = `<button class="btn btn-add" onclick="addToCartFromModal(${product.id})">Add to Cart</button>`;
    }
    
    productDetailsContent.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <div class="product-info">
            <h2>${product.name}</h2>
            <div class="price-container">
                <div class="discount-price">RM${product.price.toFixed(2)}</div>
                <div class="original-price">RM${product.originalPrice.toFixed(2)}</div>
            </div>
            <p class="product-description">${product.description}</p>
            
            <label style="font-size: 14px; color: #666; margin-bottom: 5px; display:block;">Quantity:</label>
            <div class="quantity-selector">
                <button class="qty-btn" onclick="changeQty(-1)">-</button>
                <input type="number" id="modalQty" class="qty-input" value="1" min="1" readonly>
                <button class="qty-btn" onclick="changeQty(1)">+</button>
            </div>

            <div class="card-actions">
                ${modalBtnHtml}
                <button class="btn btn-fav ${isFav}" id="modalFavBtn" onclick="toggleFavorite(${product.id}, this, true)">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    openModal('productModal');
}

function changeQty(delta) {
    const qtyInput = document.getElementById('modalQty');
    let newQty = parseInt(qtyInput.value) + delta;
    if (newQty < 1) newQty = 1; 
    qtyInput.value = newQty;
}

function addToCartFromModal(id) {
    const qty = parseInt(document.getElementById('modalQty').value);
    addToCart(id, qty);
    closeModal('productModal');
}

// --- Search and Sort Products ---
function filterAndSortProducts() {

    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const sortVal = document.getElementById('sortSelect').value;

    let filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery) || 
        p.description.toLowerCase().includes(searchQuery)
    );

    if (sortVal === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'name-asc') {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    renderProducts(filteredProducts);

    if (filteredProducts.length === 0) {
        document.getElementById('productGrid').innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px 0; color: #888;">
                <i class="fas fa-search" style="font-size: 40px; color: #ccc; margin-bottom: 15px; display: block;"></i>
                <h3>No merchandise found</h3>
                <p>Try searching with different keywords like "Kurumi" or "Badge".</p>
            </div>
        `;
    }
}

// Cart Functions
function addToCart(id, qty = 1) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...product, qty: qty, selected: true }); 
    }
    
    updateCartUI();
    let actionText = product.status === 'pre-order' ? 'pre-ordered' : 'added to cart';
    showToast(`${qty}x ${product.name} ${actionText}!`, 'success');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleSelectItem(index) {
    cart[index].selected = !cart[index].selected;
    updateCartUI();
}

function toggleSelectAll(isChecked) {
    cart.forEach(item => item.selected = isChecked);
    updateCartUI();
}

function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotal = document.getElementById('cartTotal');
    const cartControls = document.getElementById('cartControls');
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    const checkoutBtn = document.querySelector('.btn-checkout');

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.innerText = totalItems;
    
    cartItemsContainer.innerHTML = '';
    let selectedTotalValue = 0;
    let selectedCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin: 20px 0;">Your cart is empty.</p>';
        cartControls.style.display = 'none'; 
    } else {
        cartControls.style.display = 'flex'; 
        
        cart.forEach((item, index) => {
            if (item.selected) {
                selectedTotalValue += item.price * item.qty;
                selectedCount++;
            }
            
            let statusTag = item.status === 'pre-order' ? '<span style="color:#e67e22; font-size:12px; font-weight:bold; margin-left:8px;">[Pre-Order]</span>' : '';

            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <input type="checkbox" class="cart-item-checkbox" 
                           ${item.selected ? 'checked' : ''} 
                           onchange="toggleSelectItem(${index})">
                    
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name} ${statusTag}</div>
                        <div class="cart-item-qty">Qty: ${item.qty} | Unit: RM${item.price.toFixed(2)}</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap: 15px;">
                        <span class="cart-item-price">RM${(item.price * item.qty).toFixed(2)}</span>
                        <i class="fas fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${index})"></i>
                    </div>
                </div>
            `;
        });

        selectAllCheckbox.checked = (selectedCount === cart.length && cart.length > 0);
    }
    
    cartTotal.innerText = `Selected Total: RM${selectedTotalValue.toFixed(2)}`;
    
    if (selectedCount === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerText = "Select items to checkout";
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.innerText = `Checkout (${selectedCount} items)`;
    }
}

// --- Checkout & Payment Variables ---
let currentSubtotal = 0;
const shippingFee = 5.00; 
let currentDiscount = 0;

function checkout() {
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
        showToast('Please select at least one item to checkout.', 'error');
        return;
    }
    
    const checkoutItemsList = document.getElementById('checkoutItemsList');
    currentSubtotal = 0;
    
    checkoutItemsList.innerHTML = '';
    
    selectedItems.forEach(item => {
        const itemTotal = item.price * item.qty;
        currentSubtotal += itemTotal;
        let statusTag = item.status === 'pre-order' ? '<span style="color:#e67e22;">[Pre-Order]</span> ' : '';
        
        checkoutItemsList.innerHTML += `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.name}" class="checkout-item-img">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${statusTag}${item.name}</div>
                    <div class="checkout-item-qty">Qty: ${item.qty}</div>
                </div>
                <div class="checkout-item-price">RM${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });
    
    currentDiscount = 0; 
    document.getElementById('voucherCode').value = '';
    document.getElementById('discountLine').style.display = 'none';
    document.getElementById('shippingAddress').value = '';
    document.getElementById('orderRemarks').value = '';
    
    updateCheckoutTotals();
    
    closeModal('cartModal');
    openModal('checkoutModal');
}

function updateCheckoutTotals() {
    document.getElementById('checkoutSubtotal').innerText = `RM${currentSubtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').innerText = `RM${shippingFee.toFixed(2)}`;
    
    let finalTotal = currentSubtotal + shippingFee - currentDiscount;
    if (finalTotal < 0) finalTotal = 0; 
    
    document.getElementById('checkoutFinalTotal').innerText = `RM${finalTotal.toFixed(2)}`;
}

function applyVoucher() {
    const code = document.getElementById('voucherCode').value.trim().toUpperCase();
    if (code === 'SEGA10') {
        currentDiscount = 10.00;
        document.getElementById('checkoutDiscount').innerText = `-RM${currentDiscount.toFixed(2)}`;
        document.getElementById('discountLine').style.display = 'flex';
        updateCheckoutTotals();
        showToast('Voucher applied! You got RM10.00 off.', 'success');
    } else if (code === '') {
        showToast('Please enter a voucher code.', 'info');
    } else {
        showToast('Invalid voucher code. Try using "SEGA10".', 'error');
    }
}

function processPayment() {
    const address = document.getElementById('shippingAddress').value.trim();
    if (!address) {
        showToast('Please enter your shipping address to proceed.', 'error');
        document.getElementById('shippingAddress').focus();
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    let finalTotal = currentSubtotal + shippingFee - currentDiscount;
    if (finalTotal < 0) finalTotal = 0;

    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    document.getElementById('successDetails').innerHTML = `
        <div style="margin-bottom: 5px;"><strong>Order ID:</strong> ${orderId}</div>
        <div style="margin-bottom: 5px;"><strong>Amount:</strong> RM${finalTotal.toFixed(2)}</div>
        <div style="margin-bottom: 5px;"><strong>Method:</strong> ${paymentMethod}</div>
        <div><strong>Ship To:</strong> ${address}</div>
    `;
    
    cart = cart.filter(item => !item.selected);
    updateCartUI(); 
    
    closeModal('checkoutModal');
    openModal('successModal');
}

function backToHome() {
    closeModal('successModal');
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
}

// Favorites Functions
function toggleFavorite(id, btnElement, fromModal = false) {
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        btnElement.classList.remove('active');
        showToast('Removed from favorites', 'info');
    } else {
        favorites.push(id);
        btnElement.classList.add('active');
        showToast('Added to favorites', 'success');
    }
    updateFavUI();
    if(fromModal) sortProducts(); 
}

function updateFavUI() {
    const favBadge = document.getElementById('favBadge');
    const favItemsContainer = document.getElementById('favItemsContainer');
    favBadge.innerText = favorites.length;
    favItemsContainer.innerHTML = '';

    if (favorites.length === 0) {
        favItemsContainer.innerHTML = '<p style="text-align:center; color:#888; margin: 20px 0;">No favorites yet.</p>';
    } else {
        favorites.forEach(id => {
            const item = products.find(p => p.id === id);
            let btnAction = item.status === 'sold-out' 
                ? '<button class="btn btn-disabled" style="padding: 5px 10px; width: auto;" disabled>Sold Out</button>'
                : `<button class="btn ${item.status === 'pre-order' ? 'btn-preorder' : 'btn-add'}" style="padding: 5px 10px; width: auto;" onclick="addToCart(${item.id}, 1)">${item.status === 'pre-order' ? 'Pre-Order' : 'Add to Cart'}</button>`;
            
            favItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img" style="width:40px; height:40px; ${item.status === 'sold-out' ? 'filter: grayscale(100%); opacity: 0.6;' : ''}">
                    <span style="flex:1; font-size:14px; font-weight:bold;">${item.name}</span>
                    ${btnAction}
                </div>
            `;
        });
    }
}

// Modal Controls
function openModal(id) { 
    document.getElementById(id).classList.add('show'); 
}
function closeModal(id) { 
    document.getElementById(id).classList.remove('show'); 
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('show');
    }
}

// Initial Render
renderProducts(products);
updateCartUI();
updateFavUI();

// --- Hero Banner Carousel Logic ---
let slideIndex = 0;
let slideInterval;
const totalSlides = 3; 

function showSlides(index) {
    const container = document.getElementById('carouselContainer');
    const dots = document.querySelectorAll('.dot');
    
    if (index >= totalSlides) slideIndex = 0;
    if (index < 0) slideIndex = totalSlides - 1;
    
    container.style.transform = `translateX(-${slideIndex * 100}%)`;
    
    dots.forEach(dot => dot.classList.remove('active'));
    if(dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function moveSlide(n) {
    slideIndex += n;
    showSlides(slideIndex);
    resetInterval(); 
}

function currentSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
    resetInterval();
}

function startInterval() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlides(slideIndex);
    }, 5000); 
}

function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
}

startInterval();
// --- User Authentication Logic ---
let currentUser = null;

function handleLogin(event) {
    event.preventDefault(); 

    const emailInput = document.getElementById('loginEmail').value;

    const username = emailInput.split('@')[0];
    
    currentUser = {
        name: username,
        email: emailInput
    };

    showToast(`Welcome back, ${currentUser.name}!`, 'success');
    closeModal('loginModal');

    updateUserUI();

    event.target.reset();
}

function logout() {
    currentUser = null;
    showToast('Logged out successfully.', 'info');
    updateUserUI();
}

function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    
    if (currentUser) {

        loginBtn.style.display = 'none';
        userProfile.style.display = 'flex';
  
        userName.innerText = currentUser.name;
        userAvatar.innerText = currentUser.name.charAt(0).toUpperCase();
    } else {
        loginBtn.style.display = 'block';
        userProfile.style.display = 'none';
    }
}

updateUserUI();