/**
 * Luftmengdeskjema Calculations
 * Based on Excel formulas from Luftmengdeberegning.xlsx (Alternativ 2)
 */

/**
 * Calculate TEK17 foreløpig luftmengde (Column J)
 * Formula: IF(H>0, H, (C*F) + (E*G))
 * @param {number} areal_m2 - C: Areal (m²)
 * @param {number} personer - E: Antall personer
 * @param {number} prosess_m3h - H: Prosessluft (m³/h)
 * @param {number} A_m3h_per_m2 - F: Konstant A (m³/h/m²)
 * @param {number} B_m3h_per_person - G: Konstant B (m³/h/pers)
 * @returns {number} Foreløpig luftmengde (m³/h)
 */
export function calcTEK17Forelopig(areal_m2, personer, prosess_m3h, A_m3h_per_m2, B_m3h_per_person) {
  const C = areal_m2 || 0;
  const E = personer || 0;
  const H = prosess_m3h || 0;
  const F = A_m3h_per_m2;
  const G = B_m3h_per_person;
  
  if (H > 0) {
    return H;
  }
  return (C * F) + (E * G);
}

/**
 * Calculate Kravspek (Column K)
 * Formula: IF(AND(C>0, I>0), C*I, "")
 * @param {number} areal_m2 - C: Areal (m²)
 * @param {number} kravspek_m3h_per_m2 - I: Kravspek (m³/h/m²)
 * @returns {number|null} Kravspek luftmengde (m³/h) or null
 */
export function calcKravspek(areal_m2, kravspek_m3h_per_m2) {
  const C = areal_m2 || 0;
  const I = kravspek_m3h_per_m2 || 0;
  
  if (C > 0 && I > 0) {
    return C * I;
  }
  return null;
}

/**
 * Calculate Valgt Avtrekk (Column M)
 * Formula: M = L (or use manually input value if provided)
 * @param {number} valgtTilluft_m3h - L: Valgt tilluft (m³/h)
 * @param {number} valgtAvtrekk_m3h - M: Manually input valgt avtrekk (if any)
 * @returns {number} Valgt avtrekk (m³/h)
 */
export function calcValgtAvtrekk(valgtTilluft_m3h, valgtAvtrekk_m3h) {
  // If manually input value exists, use it. Otherwise default to tilluft value
  if (valgtAvtrekk_m3h !== undefined && valgtAvtrekk_m3h !== null && valgtAvtrekk_m3h !== '') {
    return parseFloat(valgtAvtrekk_m3h) || 0;
  }
  return valgtTilluft_m3h || 0;
}

/**
 * Calculate VAV Min (Column P)
 * Formula: P = O * P11 (vavMinFactor)
 * @param {number} vavMaks_m3h - O: VAV maks (m³/h)
 * @param {number} vavMinFactor - P11: VAV min faktor (default 0.2)
 * @returns {number} VAV min (m³/h)
 */
export function calcVAVMin(vavMaks_m3h, vavMinFactor) {
  const O = vavMaks_m3h || 0;
  return O * vavMinFactor;
}

/**
 * Calculate Kontroll (Tilluft) (Column R)
 * Formula: IF(AND(L>0, C>0), L/C, "")
 * @param {number} valgtTilluft_m3h - L: Valgt tilluft (m³/h)
 * @param {number} areal_m2 - C: Areal (m²)
 * @returns {number|null} Kontroll (m³/h/m²) or null
 */
export function calcKontroll(valgtTilluft_m3h, areal_m2) {
  const L = valgtTilluft_m3h || 0;
  const C = areal_m2 || 0;
  
  if (L > 0 && C > 0) {
    return L / C;
  }
  return null;
}

/**
 * Calculate Kjøleeffekt (Column T)
 * Formula: IFERROR((L/3600)*1.205*1.005*(T15-T14)*1000, 0)
 * @param {number} valgtTilluft_m3h - L: Valgt tilluft (m³/h)
 * @param {number} tTilluft_C - T14: Tillufttemperatur (°C)
 * @param {number} tAvtrekk_C - T15: Avtrekkstemperatur (°C)
 * @returns {number} Kjøleeffekt (W)
 */
export function calcKjoleeffekt(valgtTilluft_m3h, tTilluft_C, tAvtrekk_C) {
  try {
    const L = valgtTilluft_m3h || 0;
    const result = (L / 3600) * 1.205 * 1.005 * (tAvtrekk_C - tTilluft_C) * 1000;
    return isNaN(result) ? 0 : result;
  } catch {
    return 0;
  }
}

/**
 * Calculate all derived fields for a room row
 * @param {Object} row - Room row data
 * @param {Object} globals - Global constants
 * @returns {Object} Calculated fields
 */
export function calcRoomRow(row, globals) {
  const tek17Forelopig = calcTEK17Forelopig(
    row.areal_m2,
    row.personer,
    row.prosess_m3h,
    globals.A_m3h_per_m2,
    globals.B_m3h_per_person
  );
  
  const kravspek = calcKravspek(row.areal_m2, row.kravspek_m3h_per_m2);
  
  const valgtAvtrekk = calcValgtAvtrekk(row.valgtTilluft_m3h, row.valgtAvtrekk_m3h);
  
  const vavMin = calcVAVMin(row.vavMaks_m3h, globals.vavMinFactor);
  
  const kontroll = calcKontroll(row.valgtTilluft_m3h, row.areal_m2);
  
  const kjoleeffekt = calcKjoleeffekt(
    row.valgtTilluft_m3h,
    globals.tTilluft_C,
    globals.tAvtrekk_C
  );
  
  return {
    tek17Forelopig_m3h: tek17Forelopig,
    kravspek_m3h: kravspek,
    valgtAvtrekk_m3h: valgtAvtrekk,
    vavMin_m3h: vavMin,
    kontroll_m3h_per_m2: kontroll,
    kjoleeffekt_W: kjoleeffekt
  };
}

/**
 * Calculate sums for all room rows
 * @param {Array} rows - Array of room rows with calculated fields
 * @returns {Object} Sums
 */
export function calcSums(rows) {
  const sum = {
    areal_m2: 0,
    personer: 0,
    tek17Forelopig_m3h: 0,
    kravspek_m3h: 0,
    valgtTilluft_m3h: 0,
    valgtAvtrekk_m3h: 0,
    vavMin_m3h: 0
  };
  
  rows.forEach(row => {
    sum.areal_m2 += row.areal_m2 || 0;
    sum.personer += row.personer || 0;
    sum.tek17Forelopig_m3h += row.calculated?.tek17Forelopig_m3h || 0;
    sum.kravspek_m3h += row.calculated?.kravspek_m3h || 0;
    sum.valgtTilluft_m3h += row.valgtTilluft_m3h || 0;
    sum.valgtAvtrekk_m3h += row.calculated?.valgtAvtrekk_m3h || 0;
    sum.vavMin_m3h += row.calculated?.vavMin_m3h || 0;
  });
  
  return sum;
}

/**
 * Group rows by system number and calculate sums per system
 * Based on "Sum Ventilasjonssystem" sheet
 * @param {Array} rows - Array of room rows with calculated fields
 * @returns {Object} Grouped by systemnr with sums
 */
export function groupBySystem(rows) {
  const systems = {};
  
  rows.forEach(row => {
    const systemnr = row.systemnr || 'Udefinert';
    
    if (!systems[systemnr]) {
      systems[systemnr] = {
        systemnr,
        tilluft_m3h: 0,
        avtrekk_m3h: 0,
        vavMin_m3h: 0,
        cavKonstant_m3h: 0
      };
    }
    
    systems[systemnr].tilluft_m3h += row.valgtTilluft_m3h || 0;
    systems[systemnr].avtrekk_m3h += row.calculated?.valgtAvtrekk_m3h || 0;
    systems[systemnr].vavMin_m3h += row.calculated?.vavMin_m3h || 0;
    systems[systemnr].cavKonstant_m3h += row.cavKonstant_m3h || 0;
  });
  
  return Object.values(systems);
}

