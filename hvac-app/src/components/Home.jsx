import React, { useEffect, useRef } from 'react';
import { Wind, Droplets, Thermometer, Calculator, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      description: 'Prosjektspesifikke luftmengdeskjemaer og kanaldimensjonering',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Droplets,
      title: 'Sanitæranlegg',
      description: 'Dimensjonering av kaldtvann, varmtvann og spillvannsledninger',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Thermometer,
      title: 'Varmeanlegg',
      description: 'Varmebehovsberegning og rørdimensjonering for varmeanlegg',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 py-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16 scroll-animate opacity-0 transition-all duration-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-lg">
              <Calculator className="w-16 h-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            VVS Dimensjonering
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 mt-2">
              Gjort Enkelt
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Profesjonelt dimensjoneringsverktøy for VVS-ingeniører. 
            Spar tid og få presise resultater.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Kom i gang gratis
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-teal-600 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-all duration-300"
            >
              Logg inn
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 scroll-animate opacity-0 transition-all duration-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hva kan du dimensjonere?
          </h2>
          <p className="text-lg text-gray-600">
            Verktøy for de vanligste VVS-fagområdene
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`scroll-animate opacity-0 transition-all duration-700 delay-${index * 100}`}
            >
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`p-4 rounded-xl inline-block mb-6 bg-gradient-to-br ${feature.color}`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-lg border border-gray-200 scroll-animate opacity-0 transition-all duration-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Hvorfor velge EagleFlow?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Spar tid</h4>
                <p className="text-gray-600">
                  Hva som tidligere tok timer, tar nå minutter
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Færre feil</h4>
                <p className="text-gray-600">
                  Automatiserte beregninger reduserer menneskelige feil
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Alltid oppdatert</h4>
                <p className="text-gray-600">
                  Vi følger de nyeste normene og standardene
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Enkel å bruke</h4>
                <p className="text-gray-600">
                  Intuitivt grensesnitt for alle kompleksitetsnivåer
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-8 md:p-12 text-center shadow-lg scroll-animate opacity-0 transition-all duration-700">
          <h2 className="text-3xl font-bold text-white mb-4">Klar til å komme i gang?</h2>
          <p className="text-xl text-teal-50 mb-8">
            Registrer deg i dag og få tilgang til alle funksjonene
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start gratis prøveperiode
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-500 border-t border-gray-200 mt-20">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} EagleFlow. Alle rettigheter reservert.
        </p>
      </footer>
    </div>
  );
}

export default Home;
