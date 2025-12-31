import React, { useEffect, useRef } from 'react';
import { Wind, Droplets, Thermometer, Calculator, Zap, TrendingUp } from 'lucide-react';

function Home() {
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  const features = [
    {
      icon: Wind,
      title: 'Ventilasjon',
      description: 'Slutt med gjettelek og Excel-helvete!',
      details: 'Lag prosjektspesifikke luftmengdeskjemaer på rekordtid og dimensjoner kanaler som en proff. Ingen mer hodepine over trykkfall og hastigheter.',
      color: 'from-blue-500 to-cyan-500',
      benefits: ['Automatisk luftmengdeberegning', 'Kanaldimensjonering', 'Trykkfallsanalyse']
    },
    {
      icon: Droplets,
      title: 'Sanitæranlegg',
      description: 'Rør? Vi fikser det!',
      details: 'Dimensjoner sanitæranlegg med kirurgisk presisjon. Fra toaletter til store anlegg - vi regner ut alt mens du lener deg tilbake.',
      color: 'from-teal-500 to-emerald-500',
      benefits: ['Vannforbruksberegning', 'Rørdimensjonering', 'Trykkontroll']
    },
    {
      icon: Thermometer,
      title: 'Varmeanlegg',
      description: 'Hold varmen, vi gjør jobben!',
      details: 'Beregn varmebehov og dimensjoner rør for varmeanlegg. Få perfekt balanse mellom komfort og effektivitet - ingen mer frysende kunder!',
      color: 'from-orange-500 to-red-500',
      benefits: ['Varmebehovsberegning', 'Rørdimensjonering', 'Energioptimalisering']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20">
        {/* Background Pattern - Eagles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M15 20 c-0.5 0-1 0.3-1.2 0.6 l-0.8 1 c-0.4-0.8-1.1-1.3-2-1.3 -1.3 0-2.3 1-2.3 2.3 0 0.8 0.4 1.4 1 1.8 -1 0.5-1.8 1.5-1.8 2.8 0 1.8 1.4 3.2 3.2 3.2 0.8 0 1.4-0.3 2-0.7 v2.5 c0 0.8 0.6 1.4 1.4 1.4 s1.4-0.6 1.4-1.4 v-2.5 c0.6 0.4 1.3 0.7 2 0.7 1.8 0 3.2-1.4 3.2-3.2 0-1.3-0.8-2.3-1.8-2.8 0.6-0.4 1-1 1-1.8 0-1.3-1-2.3-2.3-2.3 -0.9 0-1.6 0.5-2 1.3 l-0.8-1 c-0.3-0.4-0.8-0.6-1.2-0.6 z m-10 5 c-0.8-0.4-1.5-1-2-1.8 -0.6-0.9-1-2-1-3 0-0.4 0.1-0.8 0.3-1.1 0.4 0.3 0.9 0.4 1.4 0.4 1.3 0 2.3-0.6 2.8-1.5 0.4 0.8 1.1 1.3 2 1.4 -0.8 1.3-1.4 2.8-1.8 4.3 -0.5 0.4-1 0.9-1.7 1.3 z m20 0 c0.8-0.4 1.5-1 2-1.8 0.6-0.9 1-2 1-3 0-0.4-0.1-0.8-0.3-1.1 -0.4 0.3-0.9 0.4-1.4 0.4 -1.3 0-2.3-0.6-2.8-1.5 -0.4 0.8-1.1 1.3-2 1.4 0.8 1.3 1.4 2.8 1.8 4.3 0.5 0.4 1 0.9 1.7 1.3 z'/%3E%3Cpath transform='translate(40,0)' d='M15 20 c-0.5 0-1 0.3-1.2 0.6 l-0.8 1 c-0.4-0.8-1.1-1.3-2-1.3 -1.3 0-2.3 1-2.3 2.3 0 0.8 0.4 1.4 1 1.8 -1 0.5-1.8 1.5-1.8 2.8 0 1.8 1.4 3.2 3.2 3.2 0.8 0 1.4-0.3 2-0.7 v2.5 c0 0.8 0.6 1.4 1.4 1.4 s1.4-0.6 1.4-1.4 v-2.5 c0.6 0.4 1.3 0.7 2 0.7 1.8 0 3.2-1.4 3.2-3.2 0-1.3-0.8-2.3-1.8-2.8 0.6-0.4 1-1 1-1.8 0-1.3-1-2.3-2.3-2.3 -0.9 0-1.6 0.5-2 1.3 l-0.8-1 c-0.3-0.4-0.8-0.6-1.2-0.6 z m-10 5 c-0.8-0.4-1.5-1-2-1.8 -0.6-0.9-1-2-1-3 0-0.4 0.1-0.8 0.3-1.1 0.4 0.3 0.9 0.4 1.4 0.4 1.3 0 2.3-0.6 2.8-1.5 0.4 0.8 1.1 1.3 2 1.4 -0.8 1.3-1.4 2.8-1.8 4.3 -0.5 0.4-1 0.9-1.7 1.3 z m20 0 c0.8-0.4 1.5-1 2-1.8 0.6-0.9 1-2 1-3 0-0.4-0.1-0.8-0.3-1.1 -0.4 0.3-0.9 0.4-1.4 0.4 -1.3 0-2.3-0.6-2.8-1.5 -0.4 0.8-1.1 1.3-2 1.4 0.8 1.3 1.4 2.8 1.8 4.3 0.5 0.4 1 0.9 1.7 1.3 z'/%3E%3Cpath transform='translate(0,40)' d='M15 20 c-0.5 0-1 0.3-1.2 0.6 l-0.8 1 c-0.4-0.8-1.1-1.3-2-1.3 -1.3 0-2.3 1-2.3 2.3 0 0.8 0.4 1.4 1 1.8 -1 0.5-1.8 1.5-1.8 2.8 0 1.8 1.4 3.2 3.2 3.2 0.8 0 1.4-0.3 2-0.7 v2.5 c0 0.8 0.6 1.4 1.4 1.4 s1.4-0.6 1.4-1.4 v-2.5 c0.6 0.4 1.3 0.7 2 0.7 1.8 0 3.2-1.4 3.2-3.2 0-1.3-0.8-2.3-1.8-2.8 0.6-0.4 1-1 1-1.8 0-1.3-1-2.3-2.3-2.3 -0.9 0-1.6 0.5-2 1.3 l-0.8-1 c-0.3-0.4-0.8-0.6-1.2-0.6 z m-10 5 c-0.8-0.4-1.5-1-2-1.8 -0.6-0.9-1-2-1-3 0-0.4 0.1-0.8 0.3-1.1 0.4 0.3 0.9 0.4 1.4 0.4 1.3 0 2.3-0.6 2.8-1.5 0.4 0.8 1.1 1.3 2 1.4 -0.8 1.3-1.4 2.8-1.8 4.3 -0.5 0.4-1 0.9-1.7 1.3 z m20 0 c0.8-0.4 1.5-1 2-1.8 0.6-0.9 1-2 1-3 0-0.4-0.1-0.8-0.3-1.1 -0.4 0.3-0.9 0.4-1.4 0.4 -1.3 0-2.3-0.6-2.8-1.5 -0.4 0.8-1.1 1.3-2 1.4 0.8 1.3 1.4 2.8 1.8 4.3 0.5 0.4 1 0.9 1.7 1.3 z'/%3E%3Cpath transform='translate(40,40)' d='M15 20 c-0.5 0-1 0.3-1.2 0.6 l-0.8 1 c-0.4-0.8-1.1-1.3-2-1.3 -1.3 0-2.3 1-2.3 2.3 0 0.8 0.4 1.4 1 1.8 -1 0.5-1.8 1.5-1.8 2.8 0 1.8 1.4 3.2 3.2 3.2 0.8 0 1.4-0.3 2-0.7 v2.5 c0 0.8 0.6 1.4 1.4 1.4 s1.4-0.6 1.4-1.4 v-2.5 c0.6 0.4 1.3 0.7 2 0.7 1.8 0 3.2-1.4 3.2-3.2 0-1.3-0.8-2.3-1.8-2.8 0.6-0.4 1-1 1-1.8 0-1.3-1-2.3-2.3-2.3 -0.9 0-1.6 0.5-2 1.3 l-0.8-1 c-0.3-0.4-0.8-0.6-1.2-0.6 z m-10 5 c-0.8-0.4-1.5-1-2-1.8 -0.6-0.9-1-2-1-3 0-0.4 0.1-0.8 0.3-1.1 0.4 0.3 0.9 0.4 1.4 0.4 1.3 0 2.3-0.6 2.8-1.5 0.4 0.8 1.1 1.3 2 1.4 -0.8 1.3-1.4 2.8-1.8 4.3 -0.5 0.4-1 0.9-1.7 1.3 z m20 0 c0.8-0.4 1.5-1 2-1.8 0.6-0.9 1-2 1-3 0-0.4-0.1-0.8-0.3-1.1 -0.4 0.3-0.9 0.4-1.4 0.4 -1.3 0-2.3-0.6-2.8-1.5 -0.4 0.8-1.1 1.3-2 1.4 0.8 1.3 1.4 2.8 1.8 4.3 0.5 0.4 1 0.9 1.7 1.3 z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse">
                <Calculator className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              VVS Dimensjonering
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-2">
                Gjort Enkelt
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
              Slutt å kaste bort tid på manuelle beregninger! Vårt verktøy gjør dimensjonering av VVS-anlegg 
              raskere, enklere og morsommere enn noensinne.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <span className="flex items-center text-cyan-400 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Lynraskt
              </span>
              <span className="flex items-center text-green-400 text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Presist
              </span>
              <span className="flex items-center text-purple-400 text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Profesjonelt
              </span>
            </div>
          </div>

          {/* Hero Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
            <div className="relative h-64 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 group">
              <img 
                src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=800" 
                alt="Ventilasjon" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-xl">Ventilasjon</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 group">
              <img 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800" 
                alt="Sanitæranlegg" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/90 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-xl">Sanitæranlegg</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="relative h-64 rounded-xl overflow-hidden shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 group">
              <img 
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800" 
                alt="Varmeanlegg" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/90 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-xl">Varmeanlegg</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-center text-white mb-12 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
              Hva kan vi hjelpe deg med?
            </h2>
            
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="scroll-animate opacity-0 translate-x-10 transition-all duration-700 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 hover:from-white/10 hover:to-white/15 border border-white/20 hover:border-white/40 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className={`p-4 bg-gradient-to-br ${feature.color} rounded-xl flex-shrink-0 transform hover:rotate-12 hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        {feature.title}
                      </h3>
                      <p className="text-cyan-300 text-xl mb-3 font-semibold">
                        {feature.description}
                      </p>
                      <p className="text-gray-300 text-lg mb-4">
                        {feature.details}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {feature.benefits.map((benefit, idx) => (
                          <span 
                            key={idx}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full text-sm text-gray-200 border border-purple-400/30 hover:border-purple-400/60 hover:scale-105 transition-all duration-300 cursor-default"
                          >
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Why Section */}
          <div className="mt-20 scroll-animate opacity-0 scale-95 transition-all duration-700 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 sm:p-8 md:p-12 border border-purple-500/40 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8 text-center bg-gradient-to-r from-purple-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent break-words">
              Hvorfor velge vårt dimensjoneringsverktøy?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Spar tid og penger</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Hva som tidligere tok timer, tar nå minutter. Mer tid til kaffe og viktige prosjektmøter!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Færre feil</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Automatiserte beregninger betyr færre menneskelige feil. Ingen mer pinlige revisjoner!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Profesjonelle rapporter</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Generer flotte dokumenter som får deg til å se ut som en superstjerne.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Alltid oppdatert</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Vi følger de nyeste standardene og forskriftene. Du trenger ikke bekymre deg for noe!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Brukervennlig</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Så enkelt at selv din sjef kan bruke det. Intuitiv design som bare funker!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Imponér kunder</h4>
                    <p className="text-sm sm:text-base text-gray-300">
                      Lever profesjonelle resultater som får kundene til å komme tilbake gang på gang.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-2xl text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-cyan-300 bg-clip-text font-bold mb-6 animate-pulse">
                Klar for å revolusjonere din VVS-hverdag?
              </p>
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:via-cyan-600 hover:to-purple-700 transform hover:scale-110 hover:rotate-1 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 animate-gradient-x">
                Kom i gang nå! 🚀
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-20 text-center text-gray-400">
            <p className="text-lg">
              Laget med ❤️ for VVS-ingeniører som vil jobbe smartere, ikke hardere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

