
// Images for items (you can replace URLs with your own images)
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

async function fetchCart() {
  try {
    const res = await fetch('https://quickcart-6644.onrender.com/api/cart/serCart', { headers });
    const data = await res.json();

    if (res.status === 401) {
      alert("⚠️ Session expired or unauthorized. Please log in again.");
      window.location.href = 'login.html';
      return { cart: [] };
    }

    return data;
  } catch (error) {
    console.error('❌ Fetch cart error:', error);
    return { cart: [] };
  }
}

async function fetchSuggestions() {
  try {
    const res = await fetch('https://quickcart-6644.onrender.com/api/suggestions/getSuggestions', { headers });
    const data = await res.json();

    if (res.status === 401) {
      alert("⚠️ Session expired or unauthorized. Please log in again.");
      window.location.href = 'login.html';
      return { suggestions: [] };
    }

    return data;
  } catch (error) {
    console.error('❌ Fetch suggestions error:', error);
    return { suggestions: [] };
  }
}

async function addToCart(itemName) {
  try {
    const res = await fetch('https://quickcart-6644.onrender.com/api/cart/addToCart', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name: itemName, quantity: 1 })
    });

    const data = await res.json();

    if (res.status === 401) {
      alert("⚠️ Session expired or unauthorized. Please log in again.");
      window.location.href = 'login.html';
      return;
    }

    if (data.message) {
      alert(`✅ ${itemName} added to cart!`);
      
      // ✅ Redirect straight to checkout, no renderCart
      // window.location.href = 'checkout.html';
    } else {
      alert('⚠️ Failed to add item.');
    }
  } catch (error) {
    console.error('❌ Add to cart error:', error);
  }
}
function renderCartItem(item) {
  const imgSrc = itemImages[item.name.toLowerCase()] || 'https://i.imgur.com/7P5b6LN.png'; // default image

  return `
    <li class="flex items-center p-2 border rounded space-x-4 bg-gray-50">
      <img src="${imgSrc}" alt="${item.name}" class="w-12 h-12 object-contain rounded" />
      <div class="flex-1">
        <p class="font-semibold">${item.name}</p>
        <p class="text-gray-600 text-sm">Quantity: ${item.quantity}</p>
      </div>
    </li>
  `;
}

function renderSuggestionItem(itemName) {
  const imgSrc = itemImages[itemName.toLowerCase()] || 'https://i.imgur.com/7P5b6LN.png';

  return `
    <li class="flex items-center p-2 border rounded space-x-4 bg-gray-50 mb-2">
      <img src="${imgSrc}" alt="${itemName}" class="w-12 h-12 object-contain rounded" />
      <div class="flex-1">
        <p class="font-semibold text-gray-800">${itemName}</p>
      </div>
      <button onclick="addToCart('${itemName}')" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
        Add to Cart
      </button>
    </li>
  `;
}


async function renderCart() {
  const cartData = await fetchCart();
  const cartList = document.getElementById('cart-list');
  cartList.innerHTML = '';

  if (cartData.message) {
    cartList.innerHTML = `<li class="text-red-500">Error: ${cartData.message}</li>`;
    return;
  }

  const items = cartData.cart || [];

  if (items.length === 0) {
    cartList.innerHTML = `<li class="text-gray-500"></li>`;
  } else {
    items.forEach(item => {
      cartList.innerHTML += renderCartItem(item);
    });
  }
}

async function renderSuggestions() {
  const suggestionData = await fetchSuggestions();
  const suggestionList = document.getElementById('suggestion-list');
  suggestionList.innerHTML = '';

  if (suggestionData.message) {
    suggestionList.innerHTML = `<p class="text-red-500">Error: ${suggestionData.message}</p>`;
    return;
  }

  const suggestions = suggestionData.suggestions || [];

  if (suggestions.length === 0) {
    suggestionList.innerHTML = `<p class="text-gray-500">No suggestions available.</p>`;
  } else {
    suggestions.forEach(itemName => {
      suggestionList.innerHTML += renderSuggestionItem(itemName);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await renderCart();
  await renderSuggestions();
});
// const itemImages = {
//   milk: 'assets/2.jpg',
//   bread: 'assets/3.jpg',
//   eggs: 'assets/22.jpg',
//   coffee: 'assets/20.png',
//   tea: 'assets/21.jpg',
//   fruits: 'assets/23.png',
//   vegetables: 'assets/9.jpg',
//   snacks: 'assets/11.jpg',
//   juice: 'assets/10.jpg',
//   rice: 'assets/25.jpg',
//   dal: 'assets/24.jpg',
//   maggi: 'assets/26.jpeg',
//   biscuits: 'assets/27.jpeg',
//   chips: 'assets/28.png',
//   'ice cream': 'assets/28.jpeg',
//   cola: 'assets/29.png',
// };

// const token = localStorage.getItem('token');

// if (!token) {
//   alert("🚫 Please log in first.");
//   // window.location.href = 'login.html'; // Optional redirect
// }

// const headers = {
//   'Authorization': `Bearer ${token}`,
//   'Content-Type': 'application/json'
// };

// async function fetchCart() {
//   try {
//     const res = await fetch('https://quickcart-6644.onrender.com/api/cart/getUserCart', { headers });
//     const data = await res.json();

//     if (res.status === 401) {
//       alert("⚠️ Session expired or unauthorized. Please log in again.");
//       // window.location.href = 'login.html';
//       return { cart: [] };
//     }

//     return data;
//   } catch (error) {
//     console.error('❌ Fetch cart error:', error);
//     return { cart: [] };
//   }
// }
// function renderSuggestionItem(itemName) {
//   const imgSrc = itemImages[itemName.toLowerCase()] || 'https://i.imgur.com/7P5b6LN.png';
//   return `
//     <li class="flex items-center p-2 border rounded space-x-4 bg-gray-50 mb-2">
//       <img src="${imgSrc}" alt="${itemName}" class="w-12 h-12 object-contain rounded" />
//       <div class="flex-1">
//         <p class="font-semibold text-gray-800">${itemName}</p>
//       </div>
//       <button onclick="addToCart('${itemName}')" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
//         Add to Cart
//       </button>
//     </li>
//   `;
// }

// async function renderSuggestions() {
//   const suggestions = await fetchSuggestions();
//   console.log('Suggestions to render:', suggestions);

//   const suggestionList = document.getElementById('suggestion-list');
//   if (!suggestionList) {
//     console.error('❌ Element #suggestion-list not found in DOM!');
//     return;
//   }

//   suggestionList.innerHTML = '';

//   if (suggestions.length === 0) {
//     suggestionList.innerHTML = `<p class="text-gray-500">No suggestions available.</p>`;
//     return;
//   }

//   let html = '';
//   suggestions.forEach(itemName => {
//     html += renderSuggestionItem(itemName);
//   });
//   suggestionList.innerHTML = html;
// }

// async function addToCart(itemName) {
//   try {
//     const res = await fetch('https://quickcart-6644.onrender.com/api/cart/addToCart', {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({ name: itemName, quantity: 1 })
//     });

//     const data = await res.json();

//     if (res.status === 401) {
//       alert("⚠️ Session expired or unauthorized. Please log in again.");
//       window.location.href = 'login.html';
//       return;
//     }

//     if (data.message) {
//       alert(`✅ ${itemName} added to cart!`);
//       // ✅ Redirect to checkout after adding item
//       window.location.href = 'checkout.html';
//     } else {
//       alert('⚠️ Failed to add item.');
//     }
//   } catch (error) {
//     console.error('❌ Add to cart error:', error);
//   }
// }

// function renderCartItem(item) {
//   const imgSrc = itemImages[item.name.toLowerCase()] || 'https://i.imgur.com/7P5b6LN.png';
//   return `
//     <li class="flex items-center p-2 border rounded space-x-4 bg-gray-50">
//       <img src="${imgSrc}" alt="${item.name}" class="w-12 h-12 object-contain rounded" />
//       <div class="flex-1">
//         <p class="font-semibold">${item.name}</p>
//         <p class="text-gray-600 text-sm">Quantity: ${item.quantity}</p>
//       </div>
//     </li>
//   `;
// }

// async function renderCart() {
//   const cartData = await fetchCart();
//   const cartList = document.getElementById('cart-list');
//   cartList.innerHTML = '';

//   if (cartData.message) {
//     cartList.innerHTML = `<li class="text-red-500">Error: ${cartData.message}</li>`;
//     return;
//   }

//   const items = cartData.cart || [];
//   if (items.length === 0) {
//     cartList.innerHTML = `<li class="text-gray-500">Your cart is empty.</li>`;
//   } else {
//     items.forEach(item => {
//       cartList.innerHTML += renderCartItem(item);
//     });
//   }
// }


// document.addEventListener('DOMContentLoaded', async () => {
//   await renderCart();
//   await renderSuggestions();
// });
