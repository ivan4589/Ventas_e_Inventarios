// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const loginButton = document.getElementById('loginButton');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const passwordModal = document.getElementById('passwordModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const sendRecoveryBtn = document.getElementById('sendRecovery');
    const recoveryEmailInput = document.getElementById('recoveryEmail');
    const secureConnectionCheckbox = document.getElementById('secureConnection');

    // Mostrar/ocultar contraseña
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar ícono
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Manejo del envío del formulario de inicio de sesión
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const isSecureConnection = secureConnectionCheckbox.checked;
        
        // Validaciones básicas
        if (!username || !password) {
            showAlert('Por favor, complete todos los campos.', 'error');
            return;
        }
        
        if (!isValidEmail(username) && !isValidUsername(username)) {
            showAlert('Por favor, ingrese un nombre de usuario o correo válido.', 'error');
            return;
        }
        
        // Mostrar estado de carga
        loginButton.classList.add('loading');
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
        
        // Simulación de autenticación (en un caso real, aquí se haría una petición al servidor)
        setTimeout(() => {
            loginButton.classList.remove('loading');
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
            
            // Credenciales de ejemplo (simulación)
            if ((username === 'usuario@empresa.bo' || username === 'admin') && password === 'password123') {
                showAlert('¡Inicio de sesión exitoso! Redirigiendo al sistema...', 'success');
                
                // En un caso real, aquí se redirigiría al usuario
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showAlert('Credenciales incorrectas. Por favor, inténtelo de nuevo.', 'error');
                // Añadir efecto de "shake" al formulario
                loginForm.classList.add('shake');
                setTimeout(() => {
                    loginForm.classList.remove('shake');
                }, 500);
            }
        }, 2000);
    });

    // Manejo de "Olvidé mi contraseña"
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        passwordModal.style.display = 'flex';
        // Prellenar el correo en el modal si hay algo en el campo de usuario
        recoveryEmailInput.value = usernameInput.value.trim() || '';
    });

    // Cerrar modal
    closeModalBtn.addEventListener('click', function() {
        passwordModal.style.display = 'none';
    });

    // Cerrar modal haciendo clic fuera de él
    window.addEventListener('click', function(e) {
        if (e.target === passwordModal) {
            passwordModal.style.display = 'none';
        }
    });

    // Enviar recuperación de contraseña
    sendRecoveryBtn.addEventListener('click', function() {
        const email = recoveryEmailInput.value.trim();
        
        if (!isValidEmail(email)) {
            showAlert('Por favor, ingrese un correo electrónico válido.', 'error');
            return;
        }
        
        // Simulación de envío
        this.innerHTML = 'Enviando...';
        this.disabled = true;
        
        setTimeout(() => {
            showAlert(`Se ha enviado un enlace de recuperación a ${email}. Revise su bandeja de entrada.`, 'success');
            passwordModal.style.display = 'none';
            this.innerHTML = 'Enviar Enlace de Recuperación';
            this.disabled = false;
        }, 1500);
    });

    // Función para mostrar alertas
    function showAlert(message, type) {
        // Eliminar alerta anterior si existe
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Crear nueva alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        // Estilos para la alerta
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        `;
        
        if (type === 'success') {
            alertDiv.style.backgroundColor = '#27ae60';
        } else {
            alertDiv.style.backgroundColor = '#e74c3c';
        }
        
        document.body.appendChild(alertDiv);
        
        // Auto-eliminar la alerta después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (alertDiv.parentNode) {
                        alertDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
        
        // Animación CSS para las alertas
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .shake {
                animation: shake 0.5s ease-in-out;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Funciones de validación
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidUsername(username) {
        // Validación simple para nombre de usuario (sin espacios, al menos 3 caracteres)
        return username.length >= 3 && !/\s/.test(username);
    }

    // Añadir estilo para el checkbox de conexión segura
    secureConnectionCheckbox.addEventListener('change', function() {
        const label = document.querySelector('label[for="secureConnection"]');
        if (this.checked) {
            label.innerHTML = '<i class="fas fa-lock"></i> CONEXIÓN SEGURA SSL';
        } else {
            label.innerHTML = '<i class="fas fa-unlock"></i> CONEXIÓN NO SEGURA';
        }
    });

    // Opcional: Añadir funcionalidad para limpiar el campo de usuario cuando se hace clic
    usernameInput.addEventListener('click', function() {
        // Si el campo está vacío, no hacer nada
        if (this.value === '') return;
        
        // Opcional: Seleccionar todo el texto para facilitar la edición
        this.select();
    });
});