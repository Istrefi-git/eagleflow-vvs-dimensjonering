import React, { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Globe, Linkedin, CheckCircle } from 'lucide-react';

function Contact() {
  const observerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Her ville man sendt data til backend
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', company: '', phone: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative">
        {/* Header */}
        <div className="text-center mb-16 scroll-animate opacity-0 translate-y-10 transition-all duration-700">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent">
            Kontakt oss
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Vi er her for å svare på dine spørsmål! Ta kontakt så hører du fra oss raskt.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 mx-auto rounded-full animate-gradient-x"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="scroll-animate opacity-0 translate-x-10 transition-all duration-700">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Send oss en melding</h2>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center animate-fade-in">
                  <div className="inline-flex p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 animate-pulse">
                    <CheckCircle className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Takk for din henvendelse! 🎉</h3>
                  <p className="text-gray-300">Vi kommer tilbake til deg så snart som mulig.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Navn *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="Ditt navn"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">E-post *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      placeholder="din@epost.no"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Firma</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="Ditt firma"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Telefon</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                        placeholder="+47 xxx xx xxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Melding *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 bg-white/5 border border-purple-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                      placeholder="Fortell oss hva du lurer på..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-purple-700 hover:via-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 animate-gradient-x flex items-center justify-center gap-3"
                  >
                    <Send className="w-5 h-5" />
                    Send melding
                  </button>

                  <p className="text-sm text-gray-400 text-center">
                    Vi svarer vanligvis innen 24 timer
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="scroll-animate opacity-0 translate-x-10 transition-all duration-700 space-y-6">
            {/* Contact Cards */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/50 transform hover:rotate-12 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">E-post</h3>
                  <a href="mailto:kontakt@eagleflow.no" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    kontakt@eagleflow.no
                  </a>
                  <p className="text-gray-400 text-sm mt-1">For generelle henvendelser</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/50 transform hover:rotate-12 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Telefon</h3>
                  <a href="tel:+4712345678" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    +47 123 45 678
                  </a>
                  <p className="text-gray-400 text-sm mt-1">Man-Fre: 08:00 - 16:00</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/50 transform hover:rotate-12 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Adresse</h3>
                  <p className="text-gray-300">
                    EagleFlow AS<br />
                    Exempelveien 123<br />
                    0123 Oslo, Norge
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/30 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-cyan-400" />
                Følg oss
              </h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg hover:scale-110 transition-transform shadow-lg hover:shadow-blue-500/50"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
                <a
                  href="#"
                  className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg hover:scale-110 transition-transform shadow-lg hover:shadow-purple-500/50"
                  aria-label="Instagram"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="p-4 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg hover:scale-110 transition-transform shadow-lg hover:shadow-cyan-500/50"
                  aria-label="Facebook"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="scroll-animate opacity-0 scale-95 transition-all duration-700">
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-lg rounded-2xl p-12 border border-purple-400/30 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Klar til å komme i gang?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Prøv EagleFlow gratis i dag og opplev hvor enkelt dimensjonering kan være!
            </p>
            <button className="px-10 py-5 bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 text-white font-bold text-xl rounded-xl hover:from-purple-700 hover:via-cyan-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-cyan-500/50 animate-gradient-x">
              Start gratis nå! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;

