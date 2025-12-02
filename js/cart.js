(function(){
  var STORAGE_KEY = 'carrito';

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch(e){ return []; }
  }
  function saveCart(cart){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
  }
  function findIndex(cart, id){
    return cart.findIndex(function(i){ return i.id === id; });
  }
  function parsePrice(text){
    // Expect formats like "$250.00" or "250"
    var n = String(text).replace(/[^0-9.,]/g,'').replace(/\./g,'').replace(',', '.');
    var v = parseFloat(n);
    return isNaN(v) ? 0 : v;
  }

  function updateCartCount(){
    var cart = loadCart();
    var count = cart.reduce(function(acc, it){ return acc + (it.qty||0); }, 0);
    var badges = document.querySelectorAll('.cart-count');
    badges.forEach(function(b){ b.textContent = String(count); });
  }

  // Hacer addItem accesible globalmente
  window.addItem = function(item){
    var cart = loadCart();
    var idx = findIndex(cart, item.id);
    if (idx >= 0){
      cart[idx].qty += item.qty || 1;
    } else {
      // Asegurar que la imagen tenga la ruta correcta para el carrito
      var imgPath = item.image || '';
      if (imgPath && imgPath.startsWith('./')) {
        imgPath = '../' + imgPath.substring(2);
      }
      cart.push({ id: item.id, name: item.name, price: item.price, image: imgPath, qty: item.qty || 1 });
    }
    saveCart(cart);
  };
  function removeItem(id){
    var cart = loadCart().filter(function(i){ return i.id !== id; });
    saveCart(cart);
    renderCartPage();
  }
  function updateQty(id, qty){
    qty = Math.max(1, parseInt(qty||1, 10));
    var cart = loadCart();
    var idx = findIndex(cart, id);
    if (idx >= 0){ cart[idx].qty = qty; saveCart(cart); }
    renderCartPage();
  }
  function clearCart(){
    saveCart([]);
    renderCartPage();
  }

  // Hook add-to-cart buttons in product listing pages
  function wireProductButtons(){
    var buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(function(btn){
      if (btn._wiredCart) return; // avoid double-binding
      btn._wiredCart = true;
      btn.addEventListener('click', function(){
        var card = btn.closest('.product-card') || document;
        var nameEl = card.querySelector('h3');
        var priceEl = card.querySelector('.price');
        var imgEl = card.querySelector('img');
        var name = nameEl ? nameEl.textContent.trim() : 'Producto';
        var id = name.toLowerCase().replace(/\s+/g,'-');
        var price = parsePrice(priceEl ? priceEl.textContent : '0');
        var image = imgEl ? imgEl.getAttribute('src') : '';
        addItem({ id: id, name: name, price: price, image: image, qty: 1 });
      });
    });
  }

  // Render cart page if on carrito.html
  function renderCartPage(){
    var container = document.getElementById('cartContainer');
    if (!container) return; // not on cart page
    var cart = loadCart();

    if (cart.length === 0){
      container.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
      var totals = document.getElementById('cartTotals');
      if (totals) totals.innerHTML = '';
      return;
    }

    var rows = cart.map(function(it){
      var subtotal = (it.price * it.qty);
      var imgPath = it.image;
      
      // Ajustar ruta de imagen para carrito.html
      if (imgPath && imgPath.startsWith('./')) {
        imgPath = '../' + imgPath.substring(2);
      } else if (imgPath && !imgPath.startsWith('../') && !imgPath.startsWith('http')) {
        imgPath = '../Imagenes/Productos/' + imgPath.split('/').pop();
      }
      
      return (
        '<tr class="cart-row" data-id="'+it.id+'">'+
          '<td class="cart-item">'+
            '<div class="cart-item-img-container">'+
              (imgPath ? '<img src="'+imgPath+'" alt="'+it.name+'" onerror="this.src=\'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjMwIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzY2NiIgZm9udC1zaXplPSIxMCI+8J+RPC90ZXh0Pgo8L3N2Zz4=\';" class="cart-item-image">' : '')+
            '</div>'+
            '<span class="cart-item-name">'+it.name+'</span>'+
          '</td>'+
          '<td class="cart-price">$'+it.price.toFixed(2)+'</td>'+
          '<td class="cart-qty">'+
            '<input type="number" min="1" value="'+it.qty+'" class="qty-input">'+
          '</td>'+
          '<td class="cart-subtotal">$'+subtotal.toFixed(2)+'</td>'+
          '<td class="cart-actions">'+
            '<button class="btn-remove">Eliminar</button>'+
          '</td>'+
        '</tr>'
      );
    }).join('');

    container.innerHTML = (
      '<table class="cart-table">'+
        '<thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>'+
        '<tbody>'+rows+'</tbody>'+
      '</table>'
    );

    // Totals
    var total = cart.reduce(function(acc, it){ return acc + it.price * it.qty; }, 0);
    var totalsEl = document.getElementById('cartTotals');
    if (totalsEl){
      totalsEl.innerHTML = (
        '<div class="totals-line"><span>Total</span><span>$'+ total.toFixed(2) +'</span></div>'+
        '<div class="cart-actions-footer">'+
          '<button id="clearCartBtn" class="btn-clear">Vaciar carrito</button>'+
          '<button id="checkoutBtn" class="btn-checkout">Continuar</button>'+
        '</div>'
      );
      var clearBtn = document.getElementById('clearCartBtn');
      if (clearBtn) clearBtn.addEventListener('click', clearCart);
      var checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) checkoutBtn.addEventListener('click', function(){
        alert('Implementa el proceso de checkout según tus necesidades.');
      });
    }

    // Wire qty changes and remove
    container.querySelectorAll('.qty-input').forEach(function(inp){
      inp.addEventListener('change', function(){
        var tr = inp.closest('tr');
        var id = tr ? tr.getAttribute('data-id') : null;
        if (id) updateQty(id, inp.value);
      });
    });
    container.querySelectorAll('.btn-remove').forEach(function(btn){
      btn.addEventListener('click', function(){
        var tr = btn.closest('tr');
        var id = tr ? tr.getAttribute('data-id') : null;
        if (id) removeItem(id);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    updateCartCount();
    wireProductButtons();
    renderCartPage();

    // Ensure cart icon navigates to carrito.html if element exists without href
    var cartLink = document.getElementById('cartLink');
    if (cartLink && !cartLink.getAttribute('href')){
      var inSubdir = /\/Paginas\//.test(window.location.pathname);
      cartLink.setAttribute('href', inSubdir ? 'carrito.html' : './Paginas/carrito.html');
    }
  });
})();
