/**
 * ============================================================================
 * api.js — Capa de acceso a datos
 * ============================================================================
 * 
 * Proporciona dos funciones para obtener datos de perfiles:
 * 
 * 1. getProfiles()
 *    - Retorna datos mock para desarrollo local del frontend
 *    - Contiene 15 perfiles con fotos, descripción y tags
 *    - Útil para testing sin dependencia del backend
 * 
 * 2. fetchProfilesFromServer()
 *    - Llamada al endpoint /api/profiles del backend
 *    - Remplazar getProfiles() por esta función cuando sea necesario
 *    - Requiere que el backend esté corriendo
 * 
 * Estructura de un perfil:
 * {
 *   id: number,
 *   alias: string,           // Nombre/apodo del perfil
 *   age: number,
 *   city: string,
 *   tags: string[],          // Tags descriptivos (VIP, Premium, etc)
 *   photos: string[],        // URLs de imágenes
 *   description: string      // Descripción completa (opcional)
 * }
 * 
 * ============================================================================
 */

/**
 * getProfiles()
 * @returns {Promise<Array>} Array de perfiles sin reseñas (lista general)
 *
 * Llama a `/api/profiles` en el servidor. La respuesta **NO** incluye
 * las reseñas para cada perfil; estas se cargan individualmente cuando
 * se requiere un detalle.
 */
export async function getProfiles() {
  const resp = await fetch('/api/profiles');
  if (!resp.ok) throw new Error('error fetching from server');
  return resp.json();
}

/**
 * fetchProfile(id)
 * @param {number|string} id
 * @returns {Promise<Object>} Perfil completo incluyendo `reviews`
 *
 * Utilizado en la página de detalle para obtener un perfil con todas las
 * reseñas almacenadas en la tabla `profile_reviews`.
 */
export async function fetchProfile(id) {
  const resp = await fetch(`/api/profiles/${id}`);
  if (!resp.ok) throw new Error('error fetching profile ' + id);
  return resp.json();
}


/**
 * fetchProfilesFromServer()
 * @returns {Promise<Array>} Array de perfiles desde el endpoint /api/profiles
 * 
 * Consume el endpoint del backend Express que retorna los perfiles
 * en la misma estructura que getProfiles().
 * 
 * Si necesitas cambiar a esta función:
 * 1. Reemplaza la importación en app.js
 * 2. Asegúrate de que el servidor backend esté corriendo (puerto 3000)
 * 3. El endpoint debe estar disponible en /api/profiles
 */
export async function fetchProfilesFromServer() {
  try {
    const response = await fetch('/api/profiles');
    if (!response.ok) {
      throw new Error('Error al obtener perfiles del servidor');
    }
    return await response.json();
  } catch (error) {
    console.error('Error conectando con el servidor:', error);
    throw error;
  }
}

// objeto cliente para facilitar exportaciones
export const apiClient = {
  getProfiles,
  fetchProfilesFromServer
};
