import React, { useEffect, useRef } from 'react';
import { Users, Award, Target, Heart } from 'lucide-react';

function AboutUs() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-cyan-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header */}
        <div className="text-center mb-16 scroll-animate opacity-0 transition-all duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Om oss
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="scroll-animate opacity-0 transition-all duration-700 bg-white rounded-xl p-8 md:p-12 border border-gray-200 shadow-lg mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              EagleFlow er utviklet av brødrene <span className="text-teal-600 font-semibold">Albanin Istrefi</span> og <span className="text-teal-600 font-semibold">Avdyl Istrefi</span>, begge med over 10 års erfaring fra VVS-bransjen, primært innen rørfaget. Gjennom mange år som rådgivere, prosjektingeniører og utførende har vi jobbet tett på både prosjektering, dimensjonering og gjennomføring av VVS-anlegg i små og store prosjekter.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Vi har sett på nært hold hvilke utfordringer som oppstår når dimensjonering baseres på manuelle Excel-ark og egenutviklede regneoppsett – løsninger som ofte er tidkrevende, lite standardiserte og sårbare for menneskelige feil. Dette var utgangspunktet for EagleFlow.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Med en sterk faglig forankring og genuin lidenskap for VVS-faget ønsket vi å utvikle et moderne, pålitelig og brukervennlig verktøy som forenkler dimensjonering av VVS-anlegg, samtidig som kvalitet og sporbarhet ivaretas. Målet vårt er å gi bransjen et smartere alternativ som bidrar til mer effektive arbeidsprosesser, bedre beslutningsgrunnlag og redusert risiko for feil i prosjektering.
            </p>

            <p className="text-lg text-teal-600 leading-relaxed font-semibold">
              EagleFlow er utviklet av fagfolk – for fagfolk, og videreutvikles kontinuerlig basert på erfaring fra praksis, gjeldende regelverk og reelle behov i bransjen.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="scroll-animate opacity-0 transition-all duration-700 bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center hover:shadow-xl hover:border-teal-300 transition-all">
            <div className="inline-flex p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-4 shadow-md">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">10+ års erfaring</h3>
            <p className="text-gray-600">Fra VVS-bransjen</p>
          </div>

          <div className="scroll-animate opacity-0 transition-all duration-700 bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center hover:shadow-xl hover:border-teal-300 transition-all" style={{ transitionDelay: '100ms' }}>
            <div className="inline-flex p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl mb-4 shadow-md">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Faglig forankret</h3>
            <p className="text-gray-600">Av erfarne fagfolk</p>
          </div>

          <div className="scroll-animate opacity-0 transition-all duration-700 bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center hover:shadow-xl hover:border-teal-300 transition-all" style={{ transitionDelay: '200ms' }}>
            <div className="inline-flex p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4 shadow-md">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Praktisk erfaring</h3>
            <p className="text-gray-600">Fra ekte prosjekter</p>
          </div>

          <div className="scroll-animate opacity-0 transition-all duration-700 bg-white rounded-xl p-6 border border-gray-200 shadow-lg text-center hover:shadow-xl hover:border-teal-300 transition-all" style={{ transitionDelay: '300ms' }}>
            <div className="inline-flex p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4 shadow-md">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lidenskap for faget</h3>
            <p className="text-gray-600">Kontinuerlig utvikling</p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="scroll-animate opacity-0 transition-all duration-700 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl p-8 text-center shadow-lg">
          <blockquote className="text-2xl md:text-3xl font-semibold text-white italic mb-4">
            "Utviklet av fagfolk – for fagfolk"
          </blockquote>
          <p className="text-lg text-teal-50">
            Med ekte erfaring fra bransjen, for å løse reelle utfordringer
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
