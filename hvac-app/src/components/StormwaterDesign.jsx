import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CloudRain, Info } from 'lucide-react';
import { getPipeTypesForMedia } from '../lib/sanitary/dataLoader';

function StormwaterDesign() {
  const navigate = useNavigate();
  
  // Input values
  const [area_m2, setArea_m2] = useState('');
  const [runoffCoef, setRunoffCoef] = useState(0.9); // φ (avrenningsfaktor)
  const [intensity_lps_m2, setIntensity_lps_m2] = useState(0.003); // i (regnintensitet)
  const [selectedPipeType, setSelectedPipeType] = useState('plastic');
  
  // Get available pipe types (using drainage pipes)
  const avPipeTypes = getPipeTypesForMedia('AV');
  
  // Calculate flow
  const Q_overvann = area_m2 && intensity_lps_m2 && runoffCoef 
    ? parseFloat(area_m2) * parseFloat(intensity_lps_m2) * parseFloat(runoffCoef)
    : 0;
  
  // Find suitable pipe dimension
  const selectedPipeTypeObj = avPipeTypes.find(p => p.pipeType === selectedPipeType);
  const suitableDimensions = selectedPipeTypeObj 
    ? selectedPipeTypeObj.dimensions.filter(d => {
        // Simplified: assume we need minimum 0.5 m/s velocity and max 2.0 m/s
        // For basic overvann, we just pick based on rough capacity
        const area_m2 = Math.PI * Math.pow((d.innerDiameter_mm / 2000), 2);
        const capacity_lps_at_1mps = area_m2 * 1000; // At 1 m/s
        return capacity_lps_at_1mps >= Q_overvann;
      })
    : [];
  
  const recommendedDimension = suitableDimensions.length > 0 ? suitableDimensions[0] : null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Dimensjoner Overvannsledning</h1>
            <p className="text-sm text-blue-100">Beregn overvannsmengde og velg rørdimensjon</p>
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto p-4 space-y-6 mt-6">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Om overvannsdimensjonering</p>
            <p>Overvannsmengde beregnes med formelen: <strong>Q = A × i × φ</strong></p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li><strong>A</strong> = Areal (m²)</li>
              <li><strong>i</strong> = Regnintensitet (l/s·m²)</li>
              <li><strong>φ</strong> = Avrenningsfaktor (0-1)</li>
            </ul>
          </div>
        </div>
        
        {/* Input Card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
            <CloudRain className="w-6 h-6 text-blue-600" />
            Inndata
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areal (A) - m²
              </label>
              <input
                type="number"
                step="0.01"
                value={area_m2}
                onChange={(e) => setArea_m2(e.target.value)}
                placeholder="Skriv inn areal"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regnintensitet (i) - l/s·m²
              </label>
              <input
                type="number"
                step="0.0001"
                value={intensity_lps_m2}
                onChange={(e) => setIntensity_lps_m2(e.target.value)}
                placeholder="Standard: 0.003"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Typiske verdier: 0.002-0.005 l/s·m² avhengig av returperiode og lokasjon
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avrenningsfaktor (φ)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={runoffCoef}
                onChange={(e) => setRunoffCoef(e.target.value)}
                placeholder="0.0 - 1.0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Eksempler: Tak (0.9), Asfalt (0.8-0.9), Gress (0.3-0.4)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rørtype
              </label>
              <select
                value={selectedPipeType}
                onChange={(e) => setSelectedPipeType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {avPipeTypes.map(pt => (
                  <option key={pt.pipeType} value={pt.pipeType}>{pt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Card */}
        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-xl p-6 shadow-lg">
          <h3 className="font-bold mb-4 text-lg">Resultat</h3>
          
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-100">Beregnet overvannsmengde (Q):</span>
              </div>
              <div className="text-3xl font-bold">
                {Q_overvann.toFixed(3)} <span className="text-xl">l/s</span>
              </div>
              {area_m2 && (
                <p className="text-sm text-blue-100 mt-2">
                  = {area_m2} m² × {intensity_lps_m2} l/s·m² × {runoffCoef}
                </p>
              )}
            </div>
            
            {Q_overvann > 0 && recommendedDimension && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-blue-100 mb-2">Anbefalt rørdimensjon:</div>
                <div className="text-2xl font-bold">
                  {recommendedDimension.label}
                </div>
                <p className="text-sm text-blue-100 mt-2">
                  Indre diameter: {recommendedDimension.innerDiameter_mm} mm
                </p>
              </div>
            )}
            
            {Q_overvann > 0 && !recommendedDimension && (
              <div className="bg-red-500/30 backdrop-blur-sm rounded-lg p-4">
                <div className="font-semibold mb-1">⚠️ Advarsel</div>
                <p className="text-sm">
                  Ingen passende dimensjon funnet. Vannmengden er for stor for standarddimensjoner.
                  Vurder å dele opp i flere ledninger eller bruk spesialdimensjoner.
                </p>
              </div>
            )}
            
            {Q_overvann === 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-blue-100">Fyll inn alle verdier for å se resultat</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Available Dimensions Table */}
        {selectedPipeTypeObj && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4">Tilgjengelige dimensjoner - {selectedPipeTypeObj.label}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Dimensjon</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Indre diameter (mm)</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Kapasitet @ 1 m/s (ca.)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPipeTypeObj.dimensions.map((dim, idx) => {
                    const area_m2 = Math.PI * Math.pow((dim.innerDiameter_mm / 2000), 2);
                    const capacity_lps = area_m2 * 1000;
                    const isRecommended = recommendedDimension && dim.label === recommendedDimension.label;
                    
                    return (
                      <tr 
                        key={idx} 
                        className={`border-b border-gray-100 ${isRecommended ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'}`}
                      >
                        <td className="px-4 py-3">
                          {dim.label}
                          {isRecommended && <span className="ml-2 text-blue-600">← Anbefalt</span>}
                        </td>
                        <td className="px-4 py-3">{dim.innerDiameter_mm}</td>
                        <td className="px-4 py-3">{capacity_lps.toFixed(2)} l/s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StormwaterDesign;

