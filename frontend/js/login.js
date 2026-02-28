/*
  ============================================================================
  login.js — Lógica de autenticación y manejo de sesiones
  ============================================================================
  Contiene:
  - Credenciales de administrador
  - Manejo del formulario de login
  - Validación de credenciales
  - Gestión de sesiones (localStorage)
  - Manejo de errores
  
  Importar en login.html
  ============================================================================
*/

/**
 * ========== CONFIGURACIÓN DE CREDENCIALES ==========
 * En producción, esto estaría encriptado y en el servidor
 */
const VALID_ADMIN = {
  username: 'admin',
  password: 'velvet123'
};

/**
 * Configuración de sesión
 */
const SESSION_CONFIG = {
  storageKey: 'velvet_admin_session',
  userKey: 'velvet_admin_user',
  timeKey: 'velvet_admin_time',
  durationHours: 24
};

/**
 * ========== MANEJO DEL FORMULARIO DE LOGIN ==========
 * Valida credenciales y crea sesión si son correctas
 * 
 * @param {Event} event - Evento del formulario submit
 */
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('error-msg');

  // Validar credenciales
  if (username === VALID_ADMIN.username && password === VALID_ADMIN.password) {
    // Credenciales correctas - crear sesión
    createSession(username);
    
    // Redirigir al panel admin
    window.location.href = 'admin.html';
  } else {
    // Credenciales incorrectas - mostrar error
    showError(errorMsg, 'Usuario o contraseña incorrectos');

    // Limpiar campo de contraseña
    document.getElementById('password').value = '';

    // Ocultarryy mensaje después de 3 segundos
    setTimeout(() => {
      errorMsg.classList.remove('show');
    }, 3000);
  }
}

/**
 * ========== GESTIÓN DE SESIONES ==========
 * Crea una nueva sesión en localStorage
 * 
 * @param {string} username - Nombre del usuario autenticado
 */
function createSession(username) {
  const now = new Date().getTime();
  
  localStorage.setItem(SESSION_CONFIG.storageKey, 'true');
  localStorage.setItem(SESSION_CONFIG.userKey, username);
  localStorage.setItem(SESSION_CONFIG.timeKey, now.toString());

  console.log(`✓ Sesión iniciada para: ${username}`);
}

/**
 * Verifica si existe una sesión válida
 * 
 * @returns {boolean} True si la sesión es válida
 */
function isSessionValid() {
  const session = localStorage.getItem(SESSION_CONFIG.storageKey);
  const sessionTime = localStorage.getItem(SESSION_CONFIG.timeKey);
  const user = localStorage.getItem(SESSION_CONFIG.userKey);

  if (!session || !sessionTime || !user) {
    return false;
  }

  // Calcular horas transcurridas
  const timeDiff = new Date().getTime() - parseInt(sessionTime);
  const hoursElapsed = timeDiff / (1000 * 60 * 60);

  // Verificar si la sesión aún es válida
  if (hoursElapsed < SESSION_CONFIG.durationHours) {
    return true;
  }

  // Sesión expirada - limpiar
  clearSession();
  return false;
}

/**
 * Obtiene el usuario de la sesión actual
 * 
 * @returns {string|null} Nombre del usuario o null
 */
function getCurrentUser() {
  if (isSessionValid()) {
    return localStorage.getItem(SESSION_CONFIG.userKey);
  }
  return null;
}

/**
 * ========== MANEJO DE ERRORES ==========
 * Muestra mensaje de error en la UI
 * 
 * @param {HTMLElement} errorElement - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error
 */
function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add('show');
  
  console.warn(`⚠ Error de login: ${message}`);
}

/**
 * ========== LIMPIAR INTERFAZ ==========
 * Limpia mensajes de error al interactuar con los campos
 */
function clearErrorOnInput() {
  const errorMsg = document.getElementById('error-msg');
  
  document.getElementById('username').addEventListener('input', () => {
    errorMsg.classList.remove('show');
  });

  document.getElementById('password').addEventListener('input', () => {
    errorMsg.classList.remove('show');
  });
}

/**
 * ========== CERRAR SESIÓN ==========
 * Limpia toda la información de sesión
 */
function clearSession() {
  localStorage.removeItem(SESSION_CONFIG.storageKey);
  localStorage.removeItem(SESSION_CONFIG.userKey);
  localStorage.removeItem(SESSION_CONFIG.timeKey);
  
  console.log('✓ Sesión cerrada');
}

/**
 * Termina la sesión y redirige a inicio
 */
function logout() {
  clearSession();
  window.location.href = 'index.html';
}

/**
 * ========== INICIALIZACIÓN ==========
 * Se ejecuta cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', () => {
  // Configurar listeners para limpiar errores
  clearErrorOnInput();
  
  console.log('✓ Login module initialized');
});
