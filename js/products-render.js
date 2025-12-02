(function() {
  function isInSubdir() {
    return /\/Paginas\//.test(window.location.pathname);
  }

  function renderProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
    const baseImg = isInSubdir() ? '..' : '.';

    // Limpiar productos existentes con fade out
    productGrid.style.opacity = '0';
    
    setTimeout(() => {
      productGrid.innerHTML = '';

      products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.id = product.id;

        const imgPath = product.image.replace(/^\.\//, `${baseImg}/`);

        productCard.innerHTML = `
          <div style="width:100%; height:200px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; color:#666; font-size:14px; border-radius:8px;">
            🧼 Imagen no disponible
          </div>
          <h3>${product.name}</h3>
          <p>Descripción breve de ${product.name.toLowerCase()}.</p>
          <p class="price">$${product.price.toLocaleString('es-AR')}</p>
          <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Agregar al Carrito</button>
        `;

        productGrid.appendChild(productCard);
      });

      // Fade in suave
      productGrid.style.transition = 'opacity 0.3s ease-in-out';
      productGrid.style.opacity = '1';
      
      // Reconectar botones de carrito
      setTimeout(() => {
        var buttons = document.querySelectorAll('.add-to-cart-btn');
        buttons.forEach(function(btn){
          if (btn._wiredCart) return;
          btn._wiredCart = true;
          btn.addEventListener('click', function(){
            var id = btn.getAttribute('data-id');
            var name = btn.getAttribute('data-name');
            var price = parseFloat(btn.getAttribute('data-price'));
            
            // Acceder a la función addItem del scope global
            if (typeof window.addItem === 'function') {
              window.addItem({ id: id, name: name, price: price, image: '', qty: 1 });
            } else if (typeof addItem === 'function') {
              addItem({ id: id, name: name, price: price, image: '', qty: 1 });
            } else {
              console.error('Función addItem no encontrada');
            }
          });
        });
      }, 50);
    }, 100);
  }

  document.addEventListener('DOMContentLoaded', function() {
    // Solo ejecutar en la página de productos
    if (/\/Paginas\/Productos\.html$/.test(window.location.pathname)) {
      // Pequeña demora para asegurar que todo esté cargado
      setTimeout(renderProducts, 50);
    }
  });
})();
