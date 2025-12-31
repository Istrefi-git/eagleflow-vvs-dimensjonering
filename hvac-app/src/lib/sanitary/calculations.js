/**
 * @fileoverview Calculation engine for sanitær dimensjonering
 * Implements functions 3.1 through 3.10 from specification
 */

/**
 * 3.1 - Group fixtures by floor and zone
 * @param {import('./types').Fixture[]} fixtures - All fixtures
 * @returns {import('./types').FloorZoneGroup}
 */
export function groupFixturesByFloorZone(fixtures) {
  const byFloor = {};
  const byZone = {};
  const byFloorZone = {};

  fixtures.forEach(fixture => {
    // Group by floor
    if (!byFloor[fixture.floor]) {
      byFloor[fixture.floor] = [];
    }
    byFloor[fixture.floor].push(fixture);

    // Group by zone
    if (!byZone[fixture.zone]) {
      byZone[fixture.zone] = [];
    }
    byZone[fixture.zone].push(fixture);

    // Group by floor_zone combination
    const key = `${fixture.floor}_${fixture.zone}`;
    if (!byFloorZone[key]) {
      byFloorZone[key] = [];
    }
    byFloorZone[key].push(fixture);
  });

  return { byFloor, byZone, byFloorZone };
}

/**
 * 3.2 - Calculate load for one fixture
 * @param {import('./types').Fixture} fixture - Fixture to calculate
 * @param {import('./types').NormFixture} norm - Norm data for this fixture type
 * @returns {import('./types').FixtureLoadResult}
 */
export function calcFixtureLoad(fixture, norm) {
  return {
    totalLoadUnits: fixture.quantity * norm.loadUnits,
    totalNominalFlow_lps: fixture.quantity * norm.nominalFlow_lps
  };
}

/**
 * 3.3 - Calculate total load for a pipe segment (including children)
 * @param {string} segmentId - Segment to calculate
 * @param {Object.<string, import('./types').PipeSegment>} segmentsById - All segments indexed by ID
 * @param {import('./types').Fixture[]} fixtures - All fixtures
 * @param {Object.<string, import('./types').NormFixture>} normsById - Norms indexed by fixture type
 * @returns {number} Total load units
 */
export function calcSegmentTotalLoad(segmentId, segmentsById, fixtures, normsById) {
  let totalLoad = 0;

  // Add load from fixtures directly connected to this segment
  const segmentFixtures = fixtures.filter(f => f.segmentId === segmentId);
  segmentFixtures.forEach(fixture => {
    const norm = normsById[fixture.fixtureType];
    if (norm) {
      const load = calcFixtureLoad(fixture, norm);
      totalLoad += load.totalLoadUnits;
    }
  });

  // Add load from child segments (recursive)
  const childSegments = Object.values(segmentsById).filter(s => s.parentId === segmentId);
  childSegments.forEach(child => {
    totalLoad += calcSegmentTotalLoad(child.id, segmentsById, fixtures, normsById);
  });

  return totalLoad;
}

/**
 * 3.4 - Calculate design flow (dimensjonerende vannmengde)
 * @param {number} totalLoadUnits - Total load units
 * @param {number} k - Simultaneity factor
 * @returns {number} Design flow in l/s
 */
export function calcDesignFlow(totalLoadUnits, k) {
  if (totalLoadUnits <= 0) return 0;
  return k * Math.sqrt(totalLoadUnits);
}

/**
 * 3.5 - Get available pipe dimensions for media type and pipe type
 * @param {{mediaType: 'KV'|'VV'|'AV', pipeType: string}} params - Parameters
 * @param {import('./types').PipeCatalog} pipeCatalog - Pipe catalog
 * @returns {import('./types').PipeDimension[]} Sorted dimensions (smallest first)
 */
export function getAvailablePipeDimensions({ mediaType, pipeType }, pipeCatalog) {
  const mediaTypes = pipeCatalog.byMediaType[mediaType];
  if (!mediaTypes) return [];

  const pipeTypeDef = mediaTypes.find(pt => pt.pipeType === pipeType);
  if (!pipeTypeDef) return [];

  // Return sorted by inner diameter (smallest first)
  return [...pipeTypeDef.dimensions].sort((a, b) => a.innerDiameter_mm - b.innerDiameter_mm);
}

/**
 * 3.6 - Calculate water velocity
 * @param {number} q_lps - Flow in liters per second
 * @param {number} innerDiameter_mm - Inner diameter in millimeters
 * @returns {number} Velocity in m/s
 */
export function calcVelocity(q_lps, innerDiameter_mm) {
  if (innerDiameter_mm <= 0 || q_lps <= 0) return 0;

  // Convert to SI units
  const q_m3ps = q_lps / 1000; // l/s to m³/s
  const d_m = innerDiameter_mm / 1000; // mm to m
  const area_m2 = Math.PI * Math.pow(d_m / 2, 2); // Cross-sectional area

  return q_m3ps / area_m2; // v = Q / A
}

/**
 * 3.7 - Check if velocity is allowed for media type
 * @param {{mediaType: 'KV'|'VV'|'AV', v_mps: number}} params - Parameters
 * @returns {boolean} True if velocity is within limits
 */
export function isVelocityAllowed({ mediaType, v_mps }) {
  if (mediaType === 'KV') {
    return v_mps <= 2.0;
  } else if (mediaType === 'VV') {
    return v_mps <= 1.5;
  } else if (mediaType === 'AV') {
    // For drainage: use conservative max velocity of 3.0 m/s in v1
    return v_mps <= 3.0;
  }
  return false;
}

/**
 * Helper for drainage dimension selection (v1 basic rule)
 * @param {number} q_lps - Flow in l/s
 * @param {import('./types').PipeDimension[]} dimensions - Available dimensions
 * @returns {import('./types').PipeDimension|null}
 */
function selectDrainDimensionBasic(q_lps, dimensions) {
  // For drainage: use max velocity 3.0 m/s as selection criterion
  for (const dim of dimensions) {
    const v = calcVelocity(q_lps, dim.innerDiameter_mm);
    if (v <= 3.0) {
      return dim;
    }
  }
  return null; // No suitable dimension found
}

/**
 * 3.8 - Select pipe dimension based on flow and velocity requirements
 * @param {{mediaType: 'KV'|'VV'|'AV', q_lps: number, dimensions: import('./types').PipeDimension[]}} params
 * @returns {import('./types').PipeDimension|null} Selected dimension or null if none suitable
 */
export function selectPipeDimension({ mediaType, q_lps, dimensions }) {
  if (q_lps <= 0) return dimensions[0] || null;

  // For drainage, use separate basic rule
  if (mediaType === 'AV') {
    return selectDrainDimensionBasic(q_lps, dimensions);
  }

  // For water pipes (KV/VV): select smallest dimension that meets velocity requirement
  for (const dim of dimensions) {
    const v = calcVelocity(q_lps, dim.innerDiameter_mm);
    if (isVelocityAllowed({ mediaType, v_mps: v })) {
      return dim;
    }
  }

  return null; // No suitable dimension found
}

/**
 * 3.9 - Calculate pressure drop (basic model for v1)
 * Uses simplified Darcy-Weisbach with fixed friction factors
 * @param {{length_m: number, innerDiameter_mm: number, v_mps: number, mediaType: 'KV'|'VV'|'AV'}} params
 * @returns {number} Pressure drop in kPa
 */
export function calcPressureDropBasic({ length_m, innerDiameter_mm, v_mps, mediaType }) {
  if (length_m <= 0 || innerDiameter_mm <= 0 || v_mps <= 0) return 0;

  // Fixed friction factors for v1 (conservative estimates)
  const frictionFactors = {
    'KV': 0.025,
    'VV': 0.025,
    'AV': 0.020
  };

  const f = frictionFactors[mediaType] || 0.025;
  const d_m = innerDiameter_mm / 1000;
  const rho = 1000; // Water density kg/m³

  // Darcy-Weisbach: ΔP = f * (L/D) * (ρ * v²/2)
  const pressureDrop_Pa = f * (length_m / d_m) * (rho * Math.pow(v_mps, 2) / 2);
  
  return pressureDrop_Pa / 1000; // Convert Pa to kPa
}

/**
 * 3.10 - Dimension one segment (main function combining all steps)
 * @param {string} segmentId - Segment to dimension
 * @param {{
 *   segmentsById: Object.<string, import('./types').PipeSegment>,
 *   fixtures: import('./types').Fixture[],
 *   normsById: Object.<string, import('./types').NormFixture>,
 *   pipeCatalog: import('./types').PipeCatalog,
 *   k: number
 * }} context - Calculation context
 * @returns {import('./types').SegmentResult}
 */
export function dimensionOneSegment(segmentId, context) {
  const { segmentsById, fixtures, normsById, pipeCatalog, k } = context;
  const segment = segmentsById[segmentId];

  if (!segment) {
    return {
      segmentId,
      totalLoadUnits: 0,
      designFlow_lps: 0,
      selectedDimension: null,
      velocity_mps: null,
      pressureDrop_kPa: null,
      error: 'Segment not found'
    };
  }

  // Step 3.3: Calculate total load
  const totalLoadUnits = calcSegmentTotalLoad(segmentId, segmentsById, fixtures, normsById);

  // Step 3.4: Calculate design flow
  const designFlow_lps = calcDesignFlow(totalLoadUnits, k);

  // Step 3.5: Get available dimensions
  const dimensions = getAvailablePipeDimensions(
    { mediaType: segment.mediaType, pipeType: segment.pipeType },
    pipeCatalog
  );

  if (dimensions.length === 0) {
    return {
      segmentId,
      totalLoadUnits,
      designFlow_lps,
      selectedDimension: null,
      velocity_mps: null,
      pressureDrop_kPa: null,
      error: 'No dimensions available for selected pipe type'
    };
  }

  // Step 3.8: Select dimension
  const selectedDimension = selectPipeDimension({
    mediaType: segment.mediaType,
    q_lps: designFlow_lps,
    dimensions
  });

  if (!selectedDimension) {
    return {
      segmentId,
      totalLoadUnits,
      designFlow_lps,
      selectedDimension: null,
      velocity_mps: null,
      pressureDrop_kPa: null,
      error: 'No dimension meets velocity requirements'
    };
  }

  // Step 3.6: Calculate velocity
  const velocity_mps = calcVelocity(designFlow_lps, selectedDimension.innerDiameter_mm);

  // Step 3.9: Calculate pressure drop
  const pressureDrop_kPa = calcPressureDropBasic({
    length_m: segment.length,
    innerDiameter_mm: selectedDimension.innerDiameter_mm,
    v_mps: velocity_mps,
    mediaType: segment.mediaType
  });

  return {
    segmentId,
    totalLoadUnits,
    designFlow_lps,
    selectedDimension,
    velocity_mps,
    pressureDrop_kPa,
    error: null
  };
}

/**
 * Topological sort of segments (bottom-up order)
 * @param {import('./types').PipeSegment[]} segments - All segments
 * @returns {{sorted: import('./types').PipeSegment[], hasCycle: boolean}}
 */
export function topoSortSegments(segments) {
  const segmentsById = {};
  segments.forEach(s => { segmentsById[s.id] = s; });

  const visited = new Set();
  const tempMark = new Set();
  const sorted = [];
  let hasCycle = false;

  function visit(segmentId) {
    if (tempMark.has(segmentId)) {
      hasCycle = true;
      return;
    }
    if (visited.has(segmentId)) return;

    tempMark.add(segmentId);
    const segment = segmentsById[segmentId];
    
    // Visit children first (segments that have this as parent)
    const children = segments.filter(s => s.parentId === segmentId);
    children.forEach(child => visit(child.id));

    tempMark.delete(segmentId);
    visited.add(segmentId);
    sorted.push(segment);
  }

  // Start with root segments (no parent)
  const roots = segments.filter(s => !s.parentId);
  roots.forEach(root => visit(root.id));

  // Visit any remaining segments (in case of disconnected components)
  segments.forEach(s => {
    if (!visited.has(s.id)) {
      visit(s.id);
    }
  });

  return { sorted, hasCycle };
}

/**
 * Dimension all segments in bottom-up order
 * @param {import('./types').PipeSegment[]} segments - All segments
 * @param {{
 *   fixtures: import('./types').Fixture[],
 *   normsById: Object.<string, import('./types').NormFixture>,
 *   pipeCatalog: import('./types').PipeCatalog,
 *   k: number
 * }} context - Calculation context
 * @returns {{results: import('./types').SegmentResult[], hasCycle: boolean}}
 */
export function dimensionAllSegmentsBottomUp(segments, context) {
  const { sorted, hasCycle } = topoSortSegments(segments);

  if (hasCycle) {
    return { results: [], hasCycle: true };
  }

  const segmentsById = {};
  segments.forEach(s => { segmentsById[s.id] = s; });

  const results = sorted.map(segment => 
    dimensionOneSegment(segment.id, { ...context, segmentsById })
  );

  return { results, hasCycle: false };
}

