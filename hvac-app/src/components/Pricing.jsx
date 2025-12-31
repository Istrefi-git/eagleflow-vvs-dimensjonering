import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Priser
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full mb-8"></div>
          <p className="text-lg text-gray-600">
            EagleFlow er for øyeblikket i betafase
          </p>
        </div>

        {/* Beta Notice */}
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-gray-200 text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl mb-6 shadow-md">
            <Info className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Gratis under betafase
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Vi er for øyeblikket i betafase og jobber kontinuerlig med å utvikle og forbedre verktøyet. 
            I denne perioden er alle funksjoner gratis å bruke.
          </p>
          <p className="text-lg text-teal-600 font-semibold">
            Prisinformasjon vil bli tilgjengelig når vi lanserer full versjon
          </p>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Hva får du tilgang til?
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-700">Sanitærdimensjonering (kaldtvann, varmtvann, spillvann)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-700">Overvannsledning dimensjonering</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-700">Prosjektstyring og organisering</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-700">Kontinuerlige oppdateringer og nye funksjoner</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-700">Tilgang til alle beregningsverktøy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
