/**
 * @fileoverview Calculation engine for sanitary dimensioning based on report method
 * Implements Norwegian standard method from Tekniske Bestemmelser (KS, 2014/2015)
 */

import { getFixtureNvm } from './dataLoader.js';
import drainageData from '../../data/sanitary/drainage.json';

/**
 * Calculate sum of normal water consumption (Q) for a list of fixtures
 * @param {Array} fixtures - Array of fixture objects with {fixtureType, quantity, excludedFromCalc}
 * @param {'KV'|'VV'|'SPILL'} waterType - Water type
 * @param {Object} scopeFilter - Optional filter {floor, zone}
 * @returns {number} Sum Nvm in l/s
 */
export function calcSumNormal(fixtures, waterType, scopeFilter = {}) {
  if (!fixtures || fixtures.length === 0) return 0;
  
  let filteredFixtures = fixtures.filter(f => !f.excludedFromCalc);
  
  // Apply scope filter
  if (scopeFilter.floor && scopeFilter.floor !== 'all') {
    filteredFixtures = filteredFixtures.filter(f => f.floor === scopeFilter.floor);
  }
  if (scopeFilter.zone && scopeFilter.zone !== 'all') {
    filteredFixtures = filteredFixtures.filter(f => f.zone === scopeFilter.zone);
  }
  
  const sum = filteredFixtures.reduce((total, fixture) => {
    const nvm = getFixtureNvm(fixture.fixtureType, waterType);
    const quantity = fixture.quantity || 1;
    return total + (nvm * quantity);
  }, 0);
  
  return sum;
}

/**
 * Find largest single tap (q1) for a list of fixtures
 * @param {Array} fixtures - Array of fixture objects
 * @param {'KV'|'VV'|'SPILL'} waterType - Water type
 * @param {Object} scopeFilter - Optional filter {floor, zone}
 * @returns {number} q1 in l/s
 */
export function calcQ1(fixtures, waterType, scopeFilter = {}) {
  if (!fixtures || fixtures.length === 0) return 0;
  
  let filteredFixtures = fixtures.filter(f => !f.excludedFromCalc);
  
  // Apply scope filter
  if (scopeFilter.floor && scopeFilter.floor !== 'all') {
    filteredFixtures = filteredFixtures.filter(f => f.floor === scopeFilter.floor);
  }
  if (scopeFilter.zone && scopeFilter.zone !== 'all') {
    filteredFixtures = filteredFixtures.filter(f => f.zone === scopeFilter.zone);
  }
  
  const maxNvm = filteredFixtures.reduce((max, fixture) => {
    const nvm = getFixtureNvm(fixture.fixtureType, waterType);
    return Math.max(max, nvm);
  }, 0);
  
  return maxNvm;
}

/**
 * Calculate probable maximum flow using report formula
 * Formula: q = q1 + 0.015(Q - q1) + 0.17√(Q - q1)
 * @param {number} Q - Sum of normal flows (l/s)
 * @param {number} q1 - Largest single tap (l/s)
 * @returns {number} Probable max flow q in l/s
 */
export function calcProbableMaxFlow(Q, q1) {
  if (Q <= 0 || q1 <= 0) return 0;
  if (Q < q1) return q1; // Edge case: Q should be >= q1
  
  const diff = Q - q1;
  const q = q1 + 0.015 * diff + 0.17 * Math.sqrt(diff);
  
  return q;
}

/**
 * Calculate required inner diameter based on flow and velocity
 * Formula: Di = 20√(V̇/(π·v)) where V̇ is in l/s and v is in m/s
 * Simplified: Di_mm = 1000√(4·q_m³/s/(π·v)) = 1000√(4·(q/1000)/(π·v))
 * @param {number} q_lps - Flow in l/s
 * @param {number} v_mps - Velocity in m/s
 * @returns {number} Required inner diameter in mm
 */
export function calcRequiredInnerDiameter_mm(q_lps, v_mps) {
  if (q_lps <= 0 || v_mps <= 0) return 0;
  
  // Convert l/s to m³/s
  const q_m3ps = q_lps / 1000;
  
  // Formula: Di = √(4·Q/(π·v))
  const di_m = Math.sqrt((4 * q_m3ps) / (Math.PI * v_mps));
  const di_mm = di_m * 1000;
  
  return di_mm;
}

/**
 * Select smallest pipe dimension that meets or exceeds required inner diameter
 * @param {Array} dimensions - Array of {label, innerDiameter_mm, ...}
 * @param {number} required_mm - Required inner diameter in mm
 * @returns {Object|null} Selected dimension or null if none suitable
 */
export function selectPipeByInnerDiameter(dimensions, required_mm) {
  if (!dimensions || dimensions.length === 0 || required_mm <= 0) return null;
  
  // Filter dimensions that meet requirement
  const suitable = dimensions.filter(d => d.innerDiameter_mm >= required_mm);
  
  if (suitable.length === 0) return null;
  
  // Sort by inner diameter (ascending) and return smallest
  suitable.sort((a, b) => a.innerDiameter_mm - b.innerDiameter_mm);
  
  return suitable[0];
}

/**
 * Calculate maximum drainage flow from curve A (business buildings)
 * Uses linear interpolation between points
 * @param {number} sumNormal_spill - Sum of normal spillvann in l/s
 * @param {'curveA'|'curveB'} curveType - Which curve to use (A=business, B=residential)
 * @returns {number} Maximum simultaneous drainage flow in l/s
 */
export function calcDrainageMaxFlow(sumNormal_spill, curveType = 'curveA') {
  if (sumNormal_spill <= 0) return 0;
  
  const curve = drainageData[curveType];
  if (!curve || !curve.points) return 0;
  
  const points = curve.points;
  
  // If below minimum, use first point
  if (sumNormal_spill <= points[0].sumNormal_lps) {
    return points[0].qMax_lps;
  }
  
  // If above maximum, use last point
  if (sumNormal_spill >= points[points.length - 1].sumNormal_lps) {
    return points[points.length - 1].qMax_lps;
  }
  
  // Linear interpolation between two points
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    
    if (sumNormal_spill >= p1.sumNormal_lps && sumNormal_spill <= p2.sumNormal_lps) {
      // Interpolate
      const ratio = (sumNormal_spill - p1.sumNormal_lps) / (p2.sumNormal_lps - p1.sumNormal_lps);
      const qMax = p1.qMax_lps + ratio * (p2.qMax_lps - p1.qMax_lps);
      return qMax;
    }
  }
  
  return points[points.length - 1].qMax_lps;
}

/**
 * Select drainage pipe dimension based on slope and max flow
 * @param {string} slopeKey - Slope ratio key (e.g. "1:60")
 * @param {number} qMax_spill - Maximum simultaneous drainage flow in l/s
 * @returns {Object|null} Selected dimension {nominalDiameter_mm, innerDiameter_mm, qMax_lps} or null
 */
export function selectDrainDimensionBySlope(slopeKey, qMax_spill) {
  if (!slopeKey || qMax_spill <= 0) return null;
  
  const slopeData = drainageData.horizontalDrainBySlope[slopeKey];
  if (!slopeData || !slopeData.dimensions) return null;
  
  const dimensions = slopeData.dimensions;
  
  // Find smallest dimension that can handle the flow
  for (let i = 0; i < dimensions.length; i++) {
    if (dimensions[i].qMax_lps >= qMax_spill) {
      return dimensions[i];
    }
  }
  
  // If none sufficient, return largest available
  return dimensions[dimensions.length - 1];
}

/**
 * Calculate actual velocity for verification
 * @param {number} q_lps - Flow in l/s
 * @param {number} innerDiameter_mm - Inner diameter in mm
 * @returns {number} Velocity in m/s
 */
export function calcActualVelocity(q_lps, innerDiameter_mm) {
  if (q_lps <= 0 || innerDiameter_mm <= 0) return 0;
  
  const q_m3ps = q_lps / 1000;
  const di_m = innerDiameter_mm / 1000;
  const area_m2 = Math.PI * Math.pow(di_m / 2, 2);
  
  const v_mps = q_m3ps / area_m2;
  
  return v_mps;
}

/**
 * Get available slope options for drainage
 * @returns {Array<{key: string, label: string, description: string}>}
 */
export function getAvailableSlopes() {
  const slopes = [];
  for (const [key, value] of Object.entries(drainageData.horizontalDrainBySlope)) {
    slopes.push({
      key: key,
      label: `Fall ${key}`,
      description: value.description || ''
    });
  }
  return slopes;
}

/**
 * Get velocity limits for a water type
 * @param {'KV'|'VV'|'AV'} mediaType
 * @returns {{max: number, description: string}}
 */
export function getVelocityLimits(mediaType) {
  switch(mediaType) {
    case 'KV':
      return { max: 2.0, recommended: 1.5, description: 'Maks 2.0 m/s (fordelingsledning), anbefalt 1.5 m/s' };
    case 'VV':
      return { max: 1.5, recommended: 1.5, description: 'Maks 1.5 m/s' };
    case 'AV':
      return { max: 2.0, recommended: 1.5, description: 'Maks 2.0 m/s (liggende), 4.0 m/s (stående)' };
    default:
      return { max: 2.0, recommended: 1.5, description: 'Standard' };
  }
}

