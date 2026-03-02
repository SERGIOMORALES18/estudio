/*
  session.js — manejo de sesión y protección de rutas para el panel admin.
  Exporta funciones utilizadas por `admin.js`.
*/

const SESSION_CONFIG = {
  storageKey: 'velvet_admin_session',
  userKey: 'velvet_admin_user',
  timeKey: 'velvet_admin_time',
  durationHours: 24
};

export function checkSession() {
  const session = localStorage.getItem(SESSION_CONFIG.storageKey);
  const sessionTime = localStorage.getItem(SESSION_CONFIG.timeKey);
  const user = localStorage.getItem(SESSION_CONFIG.userKey);

  if (!session || !sessionTime || !user) {
    console.warn('Sesion no encontrada');
    window.location.href = 'login.html';
    return false;
  }

  const timeDiff = new Date().getTime() - parseInt(sessionTime);
  const hoursElapsed = timeDiff / (1000 * 60 * 60);

  if (hoursElapsed < SESSION_CONFIG.durationHours) {
    console.log('Sesion valida para: ' + user);
    return true;
  }

  console.warn('Sesion expirada');
  clearSession();
  window.location.href = 'login.html';
  return false;
}

export function clearSession() {
  localStorage.removeItem(SESSION_CONFIG.storageKey);
  localStorage.removeItem(SESSION_CONFIG.userKey);
  localStorage.removeItem(SESSION_CONFIG.timeKey);
  console.log('Sesion limpiada');
}

export function logout() {
  clearSession();
  console.log('→ redirigiendo a inicio después de logout');
  window.location.href = 'index.html';
}
