/**
 * @fileoverview Data loader for norms and pipe catalogs
 * Loads JSON datasets and provides access to them
 */

import normsDataImport from '../../data/sanitary/norms.json';
import pipesDataImport from '../../data/sanitary/pipes.json';

const normsData = normsDataImport || { fixtures: [] };
const pipesData = pipesDataImport || { byMediaType: { KV: [], VV: [], AV: [] } };

/**
 * Get all fixture norms
 * @returns {import('./types').NormFixture[]}
 */
export function getFixtureNorms() {
  return normsData?.fixtures || [];
}

/**
 * Get norm for a specific fixture type
 * @param {string} fixtureType - Fixture type identifier
 * @returns {import('./types').NormFixture|null}
 */
export function getFixtureNorm(fixtureType) {
  const fixtures = normsData?.fixtures || [];
  return fixtures.find(f => f.fixtureType === fixtureType) || null;
}

/**
 * Get normalvannmengde (Nvm) for a fixture type and water type
 * @param {string} fixtureType - Fixture type identifier
 * @param {'KV'|'VV'|'SPILL'} waterType - Water type
 * @returns {number} Normalvannmengde in l/s, or 0 if not found
 */
export function getFixtureNvm(fixtureType, waterType) {
  const fixture = getFixtureNorm(fixtureType);
  if (!fixture) return 0;
  
  switch(waterType) {
    case 'KV':
      return fixture.nvm_kv_lps || 0;
    case 'VV':
      return fixture.nvm_vv_lps || 0;
    case 'SPILL':
      return fixture.nvm_spill_lps || 0;
    default:
      return 0;
  }
}

/**
 * Get pipe catalog
 * @returns {import('./types').PipeCatalog}
 */
export function getPipeCatalog() {
  return pipesData || { byMediaType: { KV: [], VV: [], AV: [] } };
}

/**
 * Get available pipe types for a media type
 * @param {'KV'|'VV'|'AV'} mediaType - Media type
 * @returns {import('./types').PipeTypeDefinition[]}
 */
export function getPipeTypesForMedia(mediaType) {
  return pipesData?.byMediaType?.[mediaType] || [];
}

/**
 * Get pipe type definition
 * @param {'KV'|'VV'|'AV'} mediaType - Media type
 * @param {string} pipeType - Pipe type identifier
 * @returns {import('./types').PipeTypeDefinition|null}
 */
export function getPipeTypeDefinition(mediaType, pipeType) {
  const types = getPipeTypesForMedia(mediaType);
  return types.find(t => t.pipeType === pipeType) || null;
}

/**
 * Get available dimensions for a pipe type
 * @param {'KV'|'VV'|'AV'} mediaType - Media type
 * @param {string} pipeType - Pipe type identifier
 * @returns {import('./types').PipeDimension[]}
 */
export function getPipeDimensions(mediaType, pipeType) {
  const typeDef = getPipeTypeDefinition(mediaType, pipeType);
  return typeDef ? typeDef.dimensions : [];
}
