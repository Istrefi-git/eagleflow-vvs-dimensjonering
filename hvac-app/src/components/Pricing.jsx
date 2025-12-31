import React, { useEffect, useRef } from 'react';
import { Sparkles, Rocket, Gift, Clock, Check } from 'lucide-react';

function Pricing() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative">
        {/* Header */}
        <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-400/30 mb-6">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-semibold">Beta-versjon</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Priser
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 mx-auto rounded-full animate-gradient-x"></div>
        </div>

        {/* Main Beta Card */}
        <div className="scroll-animate opacity-0 scale-95 transition-all duration-700 mb-12">
          <div className="relative bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-purple-500/10 backdrop-blur-lg rounded-3xl p-12 border-2 border-purple-400/40 shadow-2xl shadow-purple-500/30 overflow-hidden">
            {/* Animated corner accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 rounded-tr-full"></div>
            
            <div className="relative text-center">
              {/* Icon */}
              <div className="inline-flex p-6 bg-gradient-to-br from-purple-600 via-cyan-500 to-purple-600 rounded-full mb-6 transform hover:rotate-12 hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50 animate-pulse-glow">
                <Gift className="w-16 h-16 text-white" />
              </div>

              {/* Main Message */}
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Fullstendig <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">GRATIS</span> akkurat nå!
              </h2>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                EagleFlow er for øyeblikket i <span className="text-cyan-400 font-semibold">beta-versjon</span>, 
                og vi tilbyr full tilgang til alle funksjoner helt kostnadsfritt mens vi utvikler og forbedrer plattformen.
              </p>

              {/* Price Display */}
              <div className="inline-block bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-gray-400 line-through text-3xl">kr 999,-</div>
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                    kr 0,-
                  </div>
                </div>
                <p className="text-gray-400 mt-2">per måned i beta-perioden</p>
              </div>

              {/* CTA Button */}
              <button className="px-10 py-5 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold text-xl rounded-xl hover:from-purple-700 hover:via-cyan-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 animate-gradient-x mb-8">
                <span className="flex items-center gap-3">
                  <Rocket className="w-6 h-6" />
                  Kom i gang gratis nå!
                </span>
              </button>

              <p className="text-sm text-gray-400">
                💳 Ingen kredittkort påkrevd • ✨ Full tilgang • 🚀 Klar på minutter
              </p>
            </div>
          </div>
        </div>

        {/* Features included in Beta */}
        <div className="scroll-animate opacity-0 translate-y-10 transition-all duration-700">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            Hva får du i beta-versjonen?
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              'Full tilgang til alle dimensjoneringsverktøy',
              'Ventilasjon: Luftmengdeskjema og kanaldimensjonering',
              'Sanitær: Komplette beregninger for sanitæranlegg',
              'Varme: Varmebehov og rørdimensjonering',
              'Ubegrenset antall prosjekter',
              'Eksport av rapporter og dokumentasjon',
              'Prioritert support og feedback',
              'Påvirk utviklingen med dine innspill'
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 transform hover:scale-105"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-200">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="scroll-animate opacity-0 scale-95 transition-all duration-700">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-lg rounded-2xl p-10 border border-cyan-400/30 text-center">
            <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Prisplaner kommer snart
            </h3>
            <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Vi jobber med å finne de beste prisplanene som passer for alle – fra enkeltpersoner til store bedrifter. 
              Bruk gjerne denne tiden til å utforske alle funksjonene kostnadsfritt!
            </p>
            <p className="text-lg text-cyan-400 font-semibold">
              Beta-brukere vil få spesialtilbud når vi lanserer offisielle prisplaner 🎁
            </p>
          </div>
        </div>

        {/* FAQ-style info */}
        <div className="mt-16 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Ofte stilte spørsmål
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-2">
                Hvor lenge er beta-versjonen gratis?
              </h4>
              <p className="text-gray-300">
                Vi holder beta-versjonen gratis mens vi utvikler og forbedrer plattformen. 
                Du vil få god varsel før eventuelle prisendringer.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-2">
                Hva skjer når dere lanserer betalte planer?
              </h4>
              <p className="text-gray-300">
                Beta-brukere vil få eksklusive tilbud og rabatter som takk for å ha vært med fra starten. 
                Du vil aldri miste tilgang til dine eksisterende prosjekter.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold text-white mb-2">
                Er det noen begrensninger i beta-versjonen?
              </h4>
              <p className="text-gray-300">
                Nei! Du får full tilgang til alle funksjoner uten noen begrensninger. 
                Vi ønsker at du skal teste alt og gi oss verdifull tilbakemelding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;


