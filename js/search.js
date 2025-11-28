(function(){
  function slugify(str){
    return String(str||'')
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-z0-9]+/g,'-')
      .replace(/^-+|-+$/g,'');
  }
  function isInSubdir(){ return /\/Paginas\//.test(window.location.pathname); }
  function productsWithPaths(){
    var baseImg = isInSubdir() ? '..' : '.';
    var list = Array.isArray(window.PRODUCTS) ? window.PRODUCTS.slice() : [];
    return list.map(function(p){
      return {
        id: p.id || slugify(p.name),
        name: p.name,
        price: p.price,
        image: (p.image||'').replace(/^\.\//, baseImg + '/'),
      };
    });
  }
  function ensureProductCardIds(){
    var cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;
    cards.forEach(function(card){
      if (!card.id){
        var h3 = card.querySelector('h3');
        var id = h3 ? slugify(h3.textContent) : '';
        if (id) card.id = id;
      }
    });
  }
  function applyFilterOnProductsPage(query){
    var cards = document.querySelectorAll('.product-card');
    if (!cards.length) return;
    var q = String(query||'').trim().toLowerCase();
    cards.forEach(function(card){
      var text = (card.textContent||'').toLowerCase();
      var show = !q || text.indexOf(q) !== -1;
      card.style.display = show ? '' : 'none';
    });
  }
  function scrollToProduct(id){
    var el = id && document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({behavior:'smooth', block:'center'});
    el.style.transition = 'box-shadow .4s ease';
    var prev = el.style.boxShadow;
    el.style.boxShadow = '0 0 0 4px rgba(74,179,227,0.35)';
    setTimeout(function(){ el.style.boxShadow = prev; }, 1000);
  }
  function parseParams(){
    var p = new URLSearchParams(window.location.search);
    return { q: p.get('q') };
  }
  function gotoProducts(id, q){
    var inSub = isInSubdir();
    var url = inSub ? 'Productos.html' : './Paginas/Productos.html';
    if (id) {
      window.location.href = url + '#' + encodeURIComponent(id);
    } else if (q && q.trim()) {
      window.location.href = url + '?q=' + encodeURIComponent(q.trim());
    } else {
      window.location.href = url;
    }
  }
  function buildSuggestionsUI(input){
    var wrap = input.closest('.search-input-wrapper') || input.parentElement || input;
    var list = document.createElement('div');
    list.className = 'search-suggestions';
    list.style.position = 'absolute';
    list.style.top = '100%';
    list.style.left = '0';
    list.style.right = '0';
    list.style.zIndex = '9999';
    list.style.background = '#fff';
    list.style.border = '1px solid rgba(0,0,0,0.1)';
    list.style.borderTop = 'none';
    list.style.borderRadius = '0 0 8px 8px';
    list.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
    list.style.display = 'none';
    list.style.maxHeight = '260px';
    list.style.overflowY = 'auto';

    // Ensure wrapper is positioned
    var posParent = wrap;
    if (getComputedStyle(posParent).position === 'static'){
      posParent.style.position = 'relative';
    }
    posParent.appendChild(list);

    function render(items){
      list.innerHTML = '';
      if (!items.length){ list.style.display = 'none'; return; }
      items.slice(0,8).forEach(function(item){
        var row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '8px';
        row.style.padding = '8px 10px';
        row.style.cursor = 'pointer';
        row.addEventListener('mouseenter', function(){ row.style.background = '#f7f9fc'; });
        row.addEventListener('mouseleave', function(){ row.style.background = 'transparent'; });
        row.addEventListener('click', function(){ gotoProducts(item.id, input.value); });

        var img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.border = '1px solid rgba(0,0,0,0.06)';
        var name = document.createElement('span');
        name.textContent = item.name;
        name.style.flex = '1';
        name.style.fontSize = '.9rem';
        name.style.color = '#000';

        row.appendChild(img); row.appendChild(name);
        list.appendChild(row);
      });
      list.style.display = 'block';
    }

    function handle(){
      var val = input.value.trim().toLowerCase();
      var items = productsWithPaths().filter(function(p){
        return !val || p.name.toLowerCase().indexOf(val) !== -1;
      });
      render(items);
    }
    input.addEventListener('input', handle);
    input.addEventListener('focus', handle);
    document.addEventListener('click', function(e){ if (!list.contains(e.target) && e.target !== input){ list.style.display='none'; } });
    return { render: render, list: list };
  }

  document.addEventListener('DOMContentLoaded', function(){
    var input = document.getElementById('productSearchInput') || document.querySelector('.search-form input[name="q"]');
    var form = document.getElementById('productSearchForm') || document.querySelector('.search-form');
    if (input) buildSuggestionsUI(input);

    // Intercept submit to go to productos con query
    if (form && input){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        var val = input.value;
        if (/\/Paginas\/Productos\.html$/.test(window.location.pathname)){
          applyFilterOnProductsPage(val);
        } else {
          gotoProducts(null, val);
        }
      });
    }

    // Si estamos en Productos.html, asignar IDs y aplicar filtro/hash
    if (/\/Paginas\/Productos\.html$/.test(window.location.pathname)){
      ensureProductCardIds();
      var params = parseParams();
      if (params.q) applyFilterOnProductsPage(params.q);
      if (window.location.hash){ scrollToProduct(decodeURIComponent(window.location.hash.substring(1))); }
    }
  });
})();
