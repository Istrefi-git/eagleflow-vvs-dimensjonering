/**
 * Luftmengdeskjema Storage
 * Handles localStorage operations for airflow schedule data per project
 */

const STORAGE_KEY_PREFIX = 'eagleflow_airflow_';

/**
 * Get default globals
 * @returns {Object} Default global constants
 */
export function getDefaultGlobals() {
  return {
    A_m3h_per_m2: 3.6,
    B_m3h_per_person: 26,
    vavMinFactor: 0.2,
    tTilluft_C: 18,
    tAvtrekk_C: 26
  };
}

/**
 * Get default project metadata
 * @returns {Object} Default metadata
 */
export function getDefaultMeta() {
  return {
    prosjektNavn: '',
    ordreNr: '',
    anleggOmrade: '',
    revisjonsDato: '',
    utfortAv: '',
    utfortDato: '',
    notater: ''
  };
}

/**
 * Load airflow schedule data for a project
 * @param {string|number} projectId - Project ID
 * @returns {Object|null} Airflow schedule data or null if not found
 */
export function loadAirflowSchedule(projectId) {
  if (!projectId) return null;
  
  try {
    const key = `${STORAGE_KEY_PREFIX}${projectId}`;
    const data = localStorage.getItem(key);
    
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading airflow schedule:', error);
    return null;
  }
}

/**
 * Save airflow schedule data for a project
 * @param {string|number} projectId - Project ID
 * @param {Object} data - Airflow schedule data
 * @returns {boolean} Success status
 */
export function saveAirflowSchedule(projectId, data) {
  if (!projectId) return false;
  
  try {
    const key = `${STORAGE_KEY_PREFIX}${projectId}`;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving airflow schedule:', error);
    return false;
  }
}

/**
 * Initialize airflow schedule for a project if it doesn't exist
 * @param {string|number} projectId - Project ID
 * @returns {Object} Airflow schedule data (existing or new)
 */
export function initAirflowSchedule(projectId) {
  const existing = loadAirflowSchedule(projectId);
  
  if (existing) {
    return existing;
  }
  
  const newData = {
    meta: getDefaultMeta(),
    globals: getDefaultGlobals(),
    rows: [],
    lastModified: new Date().toISOString()
  };
  
  saveAirflowSchedule(projectId, newData);
  return newData;
}

/**
 * Update project metadata
 * @param {string|number} projectId - Project ID
 * @param {Object} meta - Metadata to update
 * @returns {boolean} Success status
 */
export function updateMeta(projectId, meta) {
  const data = loadAirflowSchedule(projectId);
  if (!data) return false;
  
  data.meta = { ...data.meta, ...meta };
  data.lastModified = new Date().toISOString();
  
  return saveAirflowSchedule(projectId, data);
}

/**
 * Update global constants
 * @param {string|number} projectId - Project ID
 * @param {Object} globals - Globals to update
 * @returns {boolean} Success status
 */
export function updateGlobals(projectId, globals) {
  const data = loadAirflowSchedule(projectId);
  if (!data) return false;
  
  data.globals = { ...data.globals, ...globals };
  data.lastModified = new Date().toISOString();
  
  return saveAirflowSchedule(projectId, data);
}

/**
 * Add a new room row
 * @param {string|number} projectId - Project ID
 * @param {Object} row - Room row data
 * @returns {Object|null} Added row with ID or null
 */
export function addRow(projectId, row) {
  const data = loadAirflowSchedule(projectId);
  if (!data) return null;
  
  const newRow = {
    id: Date.now(),
    ...row,
    createdAt: new Date().toISOString()
  };
  
  data.rows.push(newRow);
  data.lastModified = new Date().toISOString();
  
  if (saveAirflowSchedule(projectId, data)) {
    return newRow;
  }
  
  return null;
}

/**
 * Update a room row
 * @param {string|number} projectId - Project ID
 * @param {string|number} rowId - Row ID
 * @param {Object} updates - Fields to update
 * @returns {boolean} Success status
 */
export function updateRow(projectId, rowId, updates) {
  const data = loadAirflowSchedule(projectId);
  if (!data) return false;
  
  const index = data.rows.findIndex(r => r.id === rowId);
  if (index === -1) return false;
  
  data.rows[index] = {
    ...data.rows[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  data.lastModified = new Date().toISOString();
  
  return saveAirflowSchedule(projectId, data);
}

/**
 * Delete a room row
 * @param {string|number} projectId - Project ID
 * @param {string|number} rowId - Row ID
 * @returns {boolean} Success status
 */
export function deleteRow(projectId, rowId) {
  const data = loadAirflowSchedule(projectId);
  if (!data) return false;
  
  data.rows = data.rows.filter(r => r.id !== rowId);
  data.lastModified = new Date().toISOString();
  
  return saveAirflowSchedule(projectId, data);
}

/**
 * Get all rows for a project
 * @param {string|number} projectId - Project ID
 * @returns {Array} Array of rows
 */
export function getRows(projectId) {
  const data = loadAirflowSchedule(projectId);
  return data ? data.rows : [];
}

/**
 * Delete all airflow schedule data for a project
 * @param {string|number} projectId - Project ID
 * @returns {boolean} Success status
 */
export function deleteAirflowSchedule(projectId) {
  if (!projectId) return false;
  
  try {
    const key = `${STORAGE_KEY_PREFIX}${projectId}`;
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error deleting airflow schedule:', error);
    return false;
  }
}

