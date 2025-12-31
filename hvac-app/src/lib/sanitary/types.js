/**
 * @fileoverview Type definitions for Sanitær dimensjonering system
 * All types are documented using JSDoc for better IDE support
 */

/**
 * @typedef {Object} Fixture
 * @property {string} id - Unique identifier
 * @property {string} fixtureType - Type of fixture (e.g., 'wc', 'servant', 'dusj')
 * @property {number} quantity - Number of fixtures
 * @property {'KV' | 'VV' | 'BOTH'} waterType - Water type: Cold (KV), Hot (VV), or Both
 * @property {number} floor - Floor number (numeric)
 * @property {string} zone - Zone identifier (e.g., "Sone A", "Leilighet 1")
 * @property {string} segmentId - ID of pipe segment this fixture is connected to
 */

/**
 * @typedef {Object} PipeSegment
 * @property {string} id - Unique identifier
 * @property {string|null} parentId - ID of parent segment (null for root segments)
 * @property {number} length - Length in meters
 * @property {'KV' | 'VV' | 'AV'} mediaType - Media type: Cold water, Hot water, or Drainage
 * @property {string} pipeType - Type of pipe (e.g., 'PEX Sanipex', 'Kobberrør', 'Plastrør')
 */

/**
 * @typedef {Object} NormFixture
 * @property {string} fixtureType - Type identifier
 * @property {string} label - Display name
 * @property {number} nominalFlow_lps - Nominal flow in liters per second
 * @property {number} loadUnits - Load units (tappevannsenheter)
 * @property {string[]} waterTypes - Applicable water types ['KV', 'VV', 'BOTH']
 */

/**
 * @typedef {Object} PipeDimension
 * @property {string} label - Display label (e.g., "DN15", "Ø16")
 * @property {number} innerDiameter_mm - Inner diameter in millimeters
 */

/**
 * @typedef {Object} PipeTypeDefinition
 * @property {string} pipeType - Pipe type identifier
 * @property {string} label - Display name
 * @property {PipeDimension[]} dimensions - Available dimensions
 */

/**
 * @typedef {Object} PipeCatalog
 * @property {Object.<string, PipeTypeDefinition[]>} byMediaType - Pipe types grouped by media type
 */

/**
 * @typedef {Object} FixtureLoadResult
 * @property {number} totalLoadUnits - Total load units for this fixture
 * @property {number} totalNominalFlow_lps - Total nominal flow in l/s
 */

/**
 * @typedef {Object} SegmentResult
 * @property {string} segmentId - Segment identifier
 * @property {number} totalLoadUnits - Total load units (including children)
 * @property {number} designFlow_lps - Dimensjonerende vannmengde (l/s)
 * @property {PipeDimension|null} selectedDimension - Selected pipe dimension
 * @property {number|null} velocity_mps - Water velocity in m/s
 * @property {number|null} pressureDrop_kPa - Pressure drop in kPa
 * @property {string|null} error - Error message if dimensioning failed
 */

/**
 * @typedef {Object} FloorZoneGroup
 * @property {Object.<number, Fixture[]>} byFloor - Fixtures grouped by floor
 * @property {Object.<string, Fixture[]>} byZone - Fixtures grouped by zone
 * @property {Object.<string, Fixture[]>} byFloorZone - Fixtures grouped by "floor_zone"
 */

/**
 * @typedef {Object} SanitaryProjectData
 * @property {Fixture[]} fixtures - All fixtures in project
 * @property {PipeSegment[]} segments - All pipe segments in project
 * @property {number} simultaneityFactor - k-factor for design flow calculation
 * @property {string} buildingType - Building type (for future k-mapping)
 * @property {number} lastModified - Timestamp of last modification
 */

export default {};

