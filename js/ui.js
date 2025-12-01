(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Resolver la ruta base de los recursos para que funcione desde raíz y subpáginas
    var isInSubdir = /\/Paginas\//.test(window.location.pathname);
    var defaultAvatarPath = isInSubdir ? '../Imagenes/default-avatar.png' : './Imagenes/default-avatar.png';
    // UI del encabezado basada en autenticación (avatar/nombre de usuario y menú desplegable)
    try {
      if (typeof auth !== 'undefined') {
        auth.onAuthStateChanged(function (user) {
          var userBtn = document.getElementById('userBtn');
          var userDropdown = document.getElementById('userDropdown');
          if (!userBtn || !userDropdown) return;

          if (user) {
            userBtn.innerHTML = '\n              <img src="' + (user.photoURL || defaultAvatarPath) + '" alt="Foto de perfil" class="user-avatar">\n              <span>' + (user.displayName || 'Usuario') + '</span>\n            ';
            userBtn.href = '#';

            userBtn.addEventListener('click', function (e) {
              e.preventDefault();
              var isOpen = userDropdown.style.display === 'block';
              userDropdown.style.display = isOpen ? 'none' : 'block';
              userBtn.setAttribute('aria-expanded', String(!isOpen));
            });

            document.addEventListener('click', function (e) {
              if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.style.display = 'none';
                userBtn.setAttribute('aria-expanded', 'false');
              }
            });
          } else {
            userBtn.innerHTML = '\n              <i class="fas fa-user-circle"></i>\n              <span>Iniciar Sesión</span>\n            ';
            userBtn.href = '#';
            userDropdown.style.display = 'none';
            userBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    } catch (e) {
      // sin operación
    }

    // Abrir/cerrar modal (inicio de sesión/registro)
    var modal = document.getElementById('loginModal');
    var btn = document.getElementById('userBtn');
    var span = (document.getElementsByClassName('close-modal') || [])[0];

    if (btn && modal) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'block';
      });
    }
    if (span && modal) {
      span.addEventListener('click', function () {
        modal.style.display = 'none';
      });
    }
    window.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });

    // Alternar entre formularios de inicio de sesión y registro en el modal (si existen)
    var loginFormContainer = document.getElementById('loginFormContainer');
    var signupFormContainer = document.getElementById('signupFormContainer');
    var showSignupLink = document.getElementById('showSignupLink');
    var showLoginLink = document.getElementById('showLoginLink');

    if (showSignupLink && loginFormContainer && signupFormContainer) {
      showSignupLink.addEventListener('click', function (e) {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        signupFormContainer.style.display = 'block';
      });
    }
    if (showLoginLink && loginFormContainer && signupFormContainer) {
      showLoginLink.addEventListener('click', function (e) {
        e.preventDefault();
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
      });
    }

    // Botón para limpiar la búsqueda del encabezado
    var input = document.getElementById('productSearchInput') || document.querySelector('.search-form input[name="q"]');
    var clearBtn = document.getElementById('clearSearchBtn');
    if (input && clearBtn) {
      function actualizarX() {
        clearBtn.style.display = input.value.trim() ? 'inline-block' : 'none';
      }
      input.addEventListener('input', actualizarX);
      clearBtn.addEventListener('click', function () {
        input.value = '';
        actualizarX();
        input.focus();
      });
      actualizarX();
    }

    // Menú hamburguesa móvil
    try {
      var menuToggle = document.getElementById('menuToggle');
      var mobileMenu = document.getElementById('mobileMenu');
      var mobileOverlay = document.getElementById('mobileOverlay');
      function openMenu(){ if(mobileMenu){ mobileMenu.classList.add('open'); } if(mobileOverlay){ mobileOverlay.classList.add('show'); } }
      function closeMenu(){ if(mobileMenu){ mobileMenu.classList.remove('open'); } if(mobileOverlay){ mobileOverlay.classList.remove('show'); } }
      if (menuToggle && mobileMenu){
        menuToggle.addEventListener('click', function(e){ e.preventDefault(); var isOpen = mobileMenu.classList.contains('open'); if(isOpen) closeMenu(); else openMenu(); });
      }
      if (mobileOverlay){ mobileOverlay.addEventListener('click', closeMenu); }
      if (mobileMenu){
        mobileMenu.addEventListener('click', function(e){
          var t = e.target;
          if (t.tagName === 'A') { closeMenu(); }
        });
      }
      document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
    } catch(e) { /* sin operación */ }
  });
})();
