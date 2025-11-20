document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const googleSignInBtn = document.getElementById('googleSignIn');
    const showSignupLink = document.getElementById('showSignup');
    const showLoginLink = document.getElementById('showLogin');
    const loginFormDiv = document.querySelector('.login-form');
    const signupFormDiv = document.querySelector('.signup-form');
    
    // Mostrar/ocultar formularios
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormDiv.style.display = 'none';
            signupFormDiv.style.display = 'block';
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            signupFormDiv.style.display = 'none';
            loginFormDiv.style.display = 'block';
        });
    }
    
    // Manejar envío del formulario de inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Autenticación con correo y contraseña
            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Usuario ha iniciado sesión
                    const user = userCredential.user;
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    // Manejar errores
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        });
    }
    
    // Manejar envío del formulario de registro
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            // Crear usuario con correo y contraseña
            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Usuario registrado exitosamente
                    const user = userCredential.user;
                    
                    // Actualizar el perfil del usuario con el nombre
                    return user.updateProfile({
                        displayName: name
                    });
                })
                .then(() => {
                    // Redirigir al inicio
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    // Manejar errores
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        });
    }
    
    // Manejar inicio de sesión con Google
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', function() {
            auth.signInWithPopup(provider)
                .then((result) => {
                    // Usuario ha iniciado sesión con Google
                    const user = result.user;
                    window.location.href = '../index.html';
                })
                .catch((error) => {
                    // Manejar errores
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(errorMessage);
                });
        });
    }
    
    // Verificar estado de autenticación
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Usuario ha iniciado sesión
            console.log('Usuario autenticado:', user);
        } else {
            // Usuario ha cerrado sesión
            console.log('Usuario no autenticado');
        }
    });
    
    // Función para cerrar sesión
    window.logout = function() {
        auth.signOut().then(() => {
            // Cierre de sesión exitoso
            window.location.href = 'index.html';
        }).catch((error) => {
            // Manejar errores
            console.error('Error al cerrar sesión:', error);
        });
    };
});
