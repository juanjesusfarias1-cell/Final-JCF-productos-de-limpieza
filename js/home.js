(function(){
  function pickRandom(array, n){
    var copy = array.slice();
    for (var i = copy.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy.slice(0, n);
  }
  function currency(n){
    try { return '$' + Number(n||0).toFixed(0); } catch(e){ return '$0'; }
  }
  function slugify(str){
    return String(str||'')
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }
  document.addEventListener('DOMContentLoaded', function(){
    if (!Array.isArray(window.PRODUCTS)) return;
    var grid = document.querySelector('.product-grid');
    if (!grid) return;
    // Solo en index (raíz): evitar ejecutar en otras páginas por accidente
    if (/\/Paginas\//.test(window.location.pathname)) return;

    var items = pickRandom(window.PRODUCTS, 8);
    grid.innerHTML = items.map(function(p){
      var id = p.id || slugify(p.name);
      var img = (p.image || '').replace(/^\.\//, './');
      return (
        '<div class="product-card" id="'+id+'">\
           <a href="./Paginas/Productos.html#'+id+'" style="text-decoration:none;color:inherit">\
             <img src="'+img+'" alt="'+p.name+'">\
             <h3>'+p.name+'</h3>\
           </a>\
           <p class="price">'+currency(p.price)+'</p>\
           <button class="add-to-cart-btn">Agregar al Carrito</button>\
         </div>'
      );
    }).join('');
  });
})();
