// 初始化变量
let checkoutItems = [];
let currentSubtotal = 0;
const shippingFee = 5.00;
let currentDiscount = 0;

// 从 localStorage 加载选中的商品
document.addEventListener('DOMContentLoaded', () => {
    const storedItems = localStorage.getItem('checkoutItems');
    if (storedItems) {
        checkoutItems = JSON.parse(storedItems);
        renderCheckoutItems();
    } else {
        // 如果没有数据，踢回主页
        window.location.href = 'index.html';
    }
});

// 渲染商品列表（包含美化版的数量加减器）
function renderCheckoutItems() {
    const listContainer = document.getElementById('checkoutItemsList');
    listContainer.innerHTML = '';
    currentSubtotal = 0;

    checkoutItems.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        currentSubtotal += itemTotal;
        let statusTag = item.status === 'pre-order' ? '<span style="color:#e67e22; font-size:12px;">[Pre-Order]</span> ' : '';

        listContainer.innerHTML += `
            <div class="checkout-item-full">
                <img src="${item.img}" alt="${item.name}">
                <div class="item-details">
                    <div class="item-name">${statusTag}${item.name}</div>
                    <div class="item-price">RM${item.price.toFixed(2)} / unit</div>
                    
                    <div class="checkout-qty-control">
                        <button onclick="changeQty(${index}, -1)"><i class="fas fa-minus"></i></button>
                        <input type="text" value="${item.qty}" readonly>
                        <button onclick="changeQty(${index}, 1)"><i class="fas fa-plus"></i></button>
                    </div>
                </div>
                <div class="item-total-price">RM${itemTotal.toFixed(2)}</div>
            </div>
        `;
    });

    updateCheckoutTotals();
}

// 在 Checkout 页面改变数量
function changeQty(index, delta) {
    let newQty = checkoutItems[index].qty + delta;
    if (newQty < 1) newQty = 1; // 最小数量为1
    checkoutItems[index].qty = newQty;
    
    // 重新渲染UI并保存回 localStorage（以防刷新）
    localStorage.setItem('checkoutItems', JSON.stringify(checkoutItems));
    renderCheckoutItems();
}

function updateCheckoutTotals() {
    document.getElementById('checkoutSubtotal').innerText = `RM${currentSubtotal.toFixed(2)}`;
    document.getElementById('checkoutShipping').innerText = `RM${shippingFee.toFixed(2)}`;
    
    let finalTotal = currentSubtotal + shippingFee - currentDiscount;
    if (finalTotal < 0) finalTotal = 0;
    
    document.getElementById('checkoutFinalTotal').innerText = `RM${finalTotal.toFixed(2)}`;
}

// Voucher 和 Payment 逻辑
function applyVoucher() {
    const code = document.getElementById('voucherCode').value.trim().toUpperCase();
    if (code === 'SEGA10') {
        currentDiscount = 10.00;
        document.getElementById('checkoutDiscount').innerText = `-RM${currentDiscount.toFixed(2)}`;
        document.getElementById('discountLine').style.display = 'flex';
        updateCheckoutTotals();
        showToast('Voucher applied! You got RM10.00 off.', 'success');
    } else {
        showToast('Invalid voucher code.', 'error');
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
    
    const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
    document.getElementById('successDetails').innerHTML = `
        <div style="margin-bottom: 5px;"><strong>Order ID:</strong> ${orderId}</div>
        <div style="margin-bottom: 5px;"><strong>Amount:</strong> RM${finalTotal.toFixed(2)}</div>
        <div style="margin-bottom: 5px;"><strong>Method:</strong> ${paymentMethod}</div>
        <div><strong>Ship To:</strong> ${address}</div>
    `;
    
    // 标记支付成功
    localStorage.setItem('paymentSuccess', 'true');
    
    // 显示成功弹窗
    document.getElementById('successModal').classList.add('show');
}

function returnToHome() {
    window.location.href = 'index.html';
}

// 借用你在 script.js 里的 Toast 函数
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    let icon = type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>';
    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        toast.addEventListener('animationend', () => toast.remove());
    }, 3000);
}