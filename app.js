
  const PRODUCTS = [
    {
      id: 1,
      name: 'Linen Relaxed Tee',
      category: 'T-Shirt',
      price: 68,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'
    },
    {
      id: 2,
      name: 'Oversized Knit Hoodie',
      category: 'Hoodie',
      price: 145,
      oldPrice: 180,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'
      
    },
    {
      id: 3,
      name: 'Wool Blend Jacket',
      category: 'Jacket',
      price: 320,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80'
    },
    {
      id: 4,
      name: 'Slim Tapered Jeans',
      category: 'Jeans',
      price: 118,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80'
    },
    {
      id: 5,
      name: 'Slip Midi Dress',
      category: 'Dress',
      price: 195,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80'
    },
    {
      id: 6,
      name: 'Low-Profile Leather Sneaker',
      category: 'Sneakers',
      price: 220,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'
    },
    {
      id: 7,
      name: 'Cashmere Turtleneck',
      category: 'Knitwear',
      price: 275,
      oldPrice: 310,
      badge: 'Sale',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'
    },
    {
      id: 8,
      name: 'Wide-Leg Linen Trousers',
      category: 'Trousers',
      price: 140,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80'
    }
  ];

  let cart = {};

  function formatPrice(n) { return '$' + n.toFixed(2); }

  // ── Render Products ──
  const grid = document.getElementById('products-grid');
  PRODUCTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        ${p.badge ? `<span class="product-badge ${p.badge === 'New' ? 'new' : ''}">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <p class="product-name">${p.name}</p>
        <div class="product-price-row">
          <span class="product-price">
            ${formatPrice(p.price)}
            ${p.oldPrice ? `<span class="old">${formatPrice(p.oldPrice)}</span>` : ''}
          </span>
          <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });

  // ── Cart Logic ──
  function addToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    if (cart[id]) {
      cart[id].qty++;
    } else {
      cart[id] = { ...p, qty: 1 };
    }
    updateCartUI();
    showToast(p.name);
  }

  function removeFromCart(id) {
    delete cart[id];
    updateCartUI();
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    updateCartUI();
  }

  function getTotalCount() { return Object.values(cart).reduce((s, x) => s + x.qty, 0); }
  function getTotalPrice() { return Object.values(cart).reduce((s, x) => s + x.price * x.qty, 0); }

  function updateCartUI() {
    const count = getTotalCount();
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-count-mobile').textContent = count;

    const itemsEl = document.getElementById('cart-items');
    const footer = document.getElementById('cart-footer');
    itemsEl.innerHTML = '';

    if (count === 0) {
      footer.style.display = 'none';
      itemsEl.innerHTML = `
        <div class="empty-cart">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <p>Your cart is empty.</p>
          <a href="#shop" class="btn-primary" style="font-size:0.75rem;padding:10px 24px" onclick="closeCart()">Browse Collection</a>
        </div>`;
      return;
    }

    footer.style.display = 'block';
    Object.values(cart).forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <p class="cart-item-cat">${item.category}</p>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
          <div class="cart-item-qty">
            <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <button class="remove-item" data-id="${item.id}" title="Remove">✕</button>`;
      itemsEl.appendChild(el);
    });

    document.getElementById('cart-total').textContent = formatPrice(getTotalPrice());
  }

  // ── Cart Open/Close ──
  function openCart() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('cart-toggle-btn').addEventListener('click', openCart);
  document.getElementById('cart-toggle-mobile').addEventListener('click', e => { e.preventDefault(); openCart(); });
  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);

  // ── Delegated events ──
  document.getElementById('cart-items').addEventListener('click', e => {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;
    if (e.target.classList.contains('remove-item')) removeFromCart(id);
    if (e.target.classList.contains('qty-btn')) changeQty(id, parseInt(e.target.dataset.delta));
  });

  document.getElementById('products-grid').addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
      e.target.textContent = 'Added!';
      e.target.classList.add('added');
      setTimeout(() => {
        e.target.textContent = 'Add to Cart';
        e.target.classList.remove('added');
      }, 1500);
    }
  });

  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert(`🛍️ Thank you for shopping with VËLOUR!\n\nOrder Total: ${formatPrice(getTotalPrice())}\n\nYour order has been placed. You'll receive a confirmation email shortly.`);
    cart = {};
    updateCartUI();
    closeCart();
  });

  // ── Toast ──
  function showToast(name) {
    const t = document.getElementById('toast');
    document.getElementById('toast-name').textContent = name;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
  }

  // ── Mobile Nav ──
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('nav-mobile').classList.toggle('open');
  });
  document.querySelectorAll('#nav-mobile a').forEach(a => {
    a.addEventListener('click', () => document.getElementById('nav-mobile').classList.remove('open'));
  });

  // ── Contact form ──
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    alert('✉️ Message sent! We\'ll get back to you within 24 hours.');
    e.target.reset();
  });

  // Init
  updateCartUI();
