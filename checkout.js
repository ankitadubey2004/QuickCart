const itemImages = {
  milk: 'assets/2.jpg',
  bread: 'assets/3.jpg',
  eggs: 'assets/22.jpeg',
  coffee: 'assets/20.png',
  tea: 'assets/21.jpg',
  fruits: 'assets/23.png',
  vegetables: 'assets/9.jpg',
  snacks: 'assets/11.jpg',
  juice: 'assets/10.jpg',
  rice: 'assets/25.jpg',
  dal: 'assets/24.jpg',
  maggi: 'assets/26.jpeg',
  biscuits: 'assets/27.jpeg',
  chips: 'assets/28.png',
  'ice cream': 'assets/28.jpeg',
  cola: 'assets/29.png',
};

const token = localStorage.getItem('token');

if (!token) {
  alert("🚫 Please log in first.");
  window.location.href = 'login.html';
}

const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutItemsDiv = document.getElementById('checkout-items');

  async function fetchCart() {
    try {
      const res = await fetch('https://quickcart-6644.onrender.com/api/cart/getUserCart', { headers });
      const data = await res.json();

      if (res.status === 401) {
        alert("⚠️ Session expired. Please log in again.");
        window.location.href = 'login.html';
      }

      return data.cart || [];
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      return [];
    }
  }

  function renderCartItem(item) {
    const imgSrc = itemImages[item.name.toLowerCase()] || 'https://i.imgur.com/7P5b6LN.png';

    return `
      <div class="checkout-item-box">
        <img src="${imgSrc}" alt="${item.name}" class="checkout-item-img" />
        <div class="checkout-item-info">
          <p class="item-name">${item.name}</p>
          <p class="item-quantity">Qty: ${item.quantity}</p>
        </div>
        <button class="delete-btn" data-name="${item.name}">🗑️</button>
      </div>
    `;
  }

  async function renderCheckoutItems() {
    const items = await fetchCart();
    checkoutItemsDiv.innerHTML = '';

    if (items.length === 0) {
      checkoutItemsDiv.innerHTML = `<p class="text-gray-500">Your cart is empty.</p>`;
      updateCheckoutButton();
      return;
    }

    items.forEach(item => {
      checkoutItemsDiv.innerHTML += renderCartItem(item);
    });

    updateCheckoutButton();
  }

  async function deleteCartItem(itemName) {
    try {
      const res = await fetch(`https://quickcart-6644.onrender.com/api/cart/removeFromCart/${encodeURIComponent(itemName)}`, {
        method: 'DELETE',
        headers
      });

      const data = await res.json();

      if (res.ok) {
        alert(`❌ ${itemName} removed from cart.`);
        await renderCheckoutItems();
      } else {
        alert(data.message || "⚠️ Failed to remove item.");
      }
    } catch (err) {
      console.error("❌ Delete item error:", err);
    }
  }

  // ✅ Event delegation for delete buttons
  checkoutItemsDiv.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const itemName = e.target.getAttribute('data-name');
      if (itemName) {
        await deleteCartItem(itemName);
      }
    }
  });

  function updateCheckoutButton() {
    const itemsCount = checkoutItemsDiv.querySelectorAll('.checkout-item-box').length;
    checkoutBtn.disabled = itemsCount === 0;
  }

  checkoutBtn.addEventListener('click', async () => {
    if (checkoutBtn.disabled) return;

    try {
      const response = await fetch('https://quickcart-6644.onrender.com/api/cart/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error('Checkout failed');

      // Redirect to order placed confirmation page
      window.location.href = 'confirm.html';
    } catch (error) {
      alert('Error placing order. Please try again.');
      console.error(error);
    }
  });

  // Initial render
  renderCheckoutItems();
});
