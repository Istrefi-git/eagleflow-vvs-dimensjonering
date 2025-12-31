/**
 * @fileoverview Storage helper for Sanitær project data
 * Manages localStorage persistence per project
 */

/**
 * Generate storage key for a specific project
 * @param {number|string} projectId - Project identifier
 * @returns {string} Storage key
 */
function getStorageKey(projectId) {
  return `eagleflow_sanitary_${projectId}`;
}

/**
 * Load sanitær data for a project
 * @param {number|string} projectId - Project identifier
 * @returns {import('./types').SanitaryProjectData|null} Project data or null if not found
 */
export function loadSanitaryData(projectId) {
  if (!projectId) return null;
  
  try {
    const key = getStorageKey(projectId);
    const data = localStorage.getItem(key);
    
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading sanitary data:', error);
    return null;
  }
}

/**
 * Save sanitær data for a project
 * @param {number|string} projectId - Project identifier
 * @param {import('./types').SanitaryProjectData} data - Data to save
 * @returns {boolean} Success status
 */
export function saveSanitaryData(projectId, data) {
  if (!projectId) return false;
  
  try {
    const key = getStorageKey(projectId);
    const dataWithTimestamp = {
      ...data,
      lastModified: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(dataWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving sanitary data:', error);
    return false;
  }
}

/**
 * Initialize empty sanitär data for a project
 * @param {number|string} projectId - Project identifier
 * @returns {import('./types').SanitaryProjectData} Initial data structure
 */
export function initializeSanitaryData(projectId) {
  const initialData = {
    fixtures: [],
    segments: [],
    simultaneityFactor: 0.5, // Default k-factor
    buildingType: 'general',
    lastModified: Date.now()
  };
  
  saveSanitaryData(projectId, initialData);
  return initialData;
}

/**
 * Get or initialize sanitär data for a project
 * @param {number|string} projectId - Project identifier
 * @returns {import('./types').SanitaryProjectData} Project data
 */
export function getOrInitSanitaryData(projectId) {
  const existing = loadSanitaryData(projectId);
  if (existing) return existing;
  
  return initializeSanitaryData(projectId);
}

/**
 * Delete sanitär data for a project
 * @param {number|string} projectId - Project identifier
 * @returns {boolean} Success status
 */
export function deleteSanitaryData(projectId) {
  if (!projectId) return false;
  
  try {
    const key = getStorageKey(projectId);
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting sanitary data:', error);
    return false;
  }
}

