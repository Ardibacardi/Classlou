import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Video, 
  MapPin, 
  CheckCircle2, 
  Menu, 
  X, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Phone,
  Instagram,
  Send
} from 'lucide-react';
import { NAV_LINKS, REVIEWS, FAQS, SUBJECTS, LEVELS_INFO, FEATURES } from './constants';
import { FormData } from './types';
import loainaFoto from "./assets/loainafoto.jpeg";
import arthurFoto from "./assets/arthurfoto.jpeg";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('');
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    schoolInfo: '',
    subjects: '',
    typePreference: 'Online',
    availability: '',
    comments: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Scroll Spy to update active navigation link
  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is somewhat in view (top third of screen)
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = '#' + section;
          }
        }
      }
      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Using FormSubmit.co for backend-less email submission
      const response = await fetch("https://formsubmit.co/ajax/theclasslou@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nieuwe Bijles Aanmelding: ${formData.studentName}`,
          _template: "table", // Formats email as a nice table
          ...formData
        })
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          studentName: '',
          parentName: '',
          email: '',
          phone: '',
          schoolInfo: '',
          subjects: '',
          typePreference: 'Online',
          availability: '',
          comments: ''
        });
      } else {
        console.error("Submission failed");
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Error:", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-800 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <span className="text-2xl font-bold text-primary">The Classlou</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                const isButton = link.label === 'Inschrijven';
                
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-all duration-200 
                      ${isButton 
                        ? 'bg-primary text-white px-4 py-2 rounded-full hover:bg-primaryHover hover:scale-105 shadow-md' 
                        : isActive 
                          ? 'text-primary border-b-2 border-primary pb-1' 
                          : 'text-gray-600 hover:text-primary'
                      }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary focus:outline-none p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t animate-fade-in">
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 rounded-md text-base font-medium transition-colors
                    ${link.label === 'Inschrijven' 
                    ? 'bg-primary text-white text-center mt-4 shadow-md' 
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            Bijles met <span className="text-primary">aandacht</span> en <span className="text-secondary">resultaat</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Professionele begeleiding voor VMBO, HAVO en VWO. Herwin je zelfvertrouwen en verbeter je cijfers in een rustige omgeving.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {FEATURES.map((feature, idx) => (
              <span key={idx} className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-primary text-sm font-semibold shadow-sm border border-indigo-100">
                <CheckCircle2 size={16} className="mr-2" />
                {feature}
              </span>
            ))}
          </div>

          <div className="flex justify-center">
            <a 
              href="#register" 
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg text-white bg-primary hover:bg-primaryHover focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all transform hover:-translate-y-1"
            >
              Meld je aan voor bijles
              <BookOpen className="ml-2 -mr-1" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Over Ons</h2>
            <p className="mt-4 text-lg text-gray-600">Maak kennis met het team achter The Classlou.</p>
          </div>

          <div className="space-y-24">
      {/* Person 1: Loaina */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative group">
          <div className="aspect-[4/5] md:aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group-hover:shadow-primary/20 transition-shadow duration-500">
            <img
              src={loainaFoto}
              alt="Loaina"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-secondary p-6 rounded-xl shadow-xl hidden md:block transform rotate-3 transition-transform group-hover:rotate-0">
            <p className="text-white font-bold text-lg">"Geduldig & Helder"</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl text-primary font-semibold mb-4">
            Hoi, ik ben Loaina!
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed text-lg">
          Ik heb een VWO beta dubbelprofiel achtergrond en geef al sinds de derde klas
          bijles in alle vakken. Voor mij is kennis delen
          een krachtige manier om anderen te helpen. Het
          bijdragen aan de maatschappij en het onderstrepen
          van het belang van educatie staan voorop in mijn
          motivatie.
          </p>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
          Samen bouwen we aan een omgeving
          waarin kennis wordt gedeeld en versterkt.
          </p>
          <blockquote className="border-l-4 border-secondary pl-6 italic text-gray-800 bg-orange-50 py-4 pr-4 rounded-r-lg shadow-sm">
            "Ik help graag leerlingen om hun cijfers te verbeteren en weer grip
            te krijgen op school."
          </blockquote>
        </div>
      </div>


            {/* Person 2: Placeholder / Second Tutor */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text (Left on Desktop) */}
              <div className="order-2 md:order-1">
                <h3 className="text-xl text-primary font-semibold mb-4">En ik ben Arthur!</h3>
                <p className="text-gray-600 mb-4 leading-relaxed text-lg">
                Ik heb een vwo beta-
                dubbelprofiel (NT en NG) afgerond en studeer nu
                Artificial Intelligence aan de VU. Mijn sterkste vak is
                wiskunde B (9,4 voor CE) en afgesloten met een 9,0.
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Daarnaast vind ik het leuk om anderen te helpen.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 italic text-gray-800 bg-indigo-50 py-4 pr-4 rounded-r-lg shadow-sm">
                  "Leren mag best leuk zijn, zolang je maar snapt wat je doet."
                </blockquote>
              </div>
              
              {/* Image (Right on Desktop) */}
              <div className="relative group order-1 md:order-2">
                <div className="aspect-[4/5] md:aspect-[2/3] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center text-gray-400 border-4 border-white group-hover:shadow-secondary/20 transition-shadow duration-500">
                  <img
                    src={arthurFoto}
                    alt="Arthur"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-xl shadow-xl hidden md:block transform -rotate-3 transition-transform group-hover:rotate-0">
                  <p className="text-white font-bold text-lg">"Enthousiast & Betrokken"</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Diensten & Bijlessen</h2>
            <p className="mt-4 text-lg text-gray-600">Voor elk niveau en elk doel een passende oplossing.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Subjects */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vakken</h3>
              <ul className="space-y-3">
                {SUBJECTS.map((subject) => (
                  <li key={subject.name} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                    {subject.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Levels */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <GraduationCap size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Niveaus</h3>
              <ul className="space-y-3">
                {LEVELS_INFO.map((level) => (
                  <li key={level} className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    {level}
                  </li>
                ))}
              </ul>
            </div>

            {/* Method */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Werkwijze</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle2 size={18} className="mr-2 mt-1 text-green-500 shrink-0" />
                  <span>Intakegesprek & Doelen bepalen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={18} className="mr-2 mt-1 text-green-500 shrink-0" />
                  <span>Wekelijkse of flexibele lessen</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={18} className="mr-2 mt-1 text-green-500 shrink-0" />
                  <span>Toets- en examenvoorbereiding</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 size={18} className="mr-2 mt-1 text-green-500 shrink-0" />
                  <span>1-op-1 of in kleine groepjes</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-primary/30 transition-colors">
              <Video className="text-primary mr-4" size={32} />
              <div>
                <h4 className="font-bold text-lg">Online Bijles</h4>
                <p className="text-gray-600 text-sm">Via Teams of Zoom, vanuit je eigen huis.</p>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-secondary/30 transition-colors">
              <MapPin className="text-secondary mr-4" size={32} />
              <div>
                <h4 className="font-bold text-lg">Fysiek Bijles</h4>
                <p className="text-gray-600 text-sm">Op locatie in regio Amsterdam.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rates Section */}
      <section id="rates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Tarieven</h2>
            <p className="mt-4 text-lg text-gray-600">Heldere prijzen, geen verrassingen.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* 1-on-1 */}
            <div className="relative bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1-op-1 Bijles</h3>
              <p className="text-gray-500 mb-6">Maximale persoonlijke aandacht</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-gray-900">€35</span>
                <span className="text-gray-500 ml-2 font-medium">/ uur</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Volledige focus op de leerling
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Tempo aangepast aan niveau
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Fysiek of Online (zelfde prijs)
                </li>
              </ul>
              <a href="#register" className="block w-full text-center bg-white text-gray-900 font-bold py-4 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all">
              Kies 1-op-1
              </a>
            </div>

            {/* Group */}
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-primary/10 ring-1 ring-primary/5 transform hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl uppercase tracking-wide shadow-md">
                Meest Gekozen
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Groepsbijles</h3>
              <p className="text-gray-500 mb-6">Leren met studiegenoten (max 3-6)</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-gray-900">€20</span>
                <span className="text-gray-500 ml-2 font-medium">/ uur p.p.</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Samen leren en motiveren
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Voordeliger tarief
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Fysiek of Online 
                </li>
              </ul>
              <a href="#register" className="block w-full text-center bg-primary text-white font-bold py-4 rounded-xl hover:bg-primaryHover transition-colors shadow-lg shadow-primary/20">
              Kies Groep
              </a>
            </div>

            {/* Examen training */}
            <div className="relative bg-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-secondary/30 hover:shadow-lg transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Examen Training</h3>
              <p className="text-gray-500 mb-6">Gericht. Effectief. Resultaat.</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-gray-900">€250</span>
                <span className="text-gray-500 ml-2 font-medium">/ training</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Gericht oefenen met echte examenopgaven
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Slimme strategieën voor hogere scores
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckCircle2 size={20} className="text-secondary mr-3 flex-shrink-0" />
                  Persoonlijke uitleg van lastige stof
                </li>
              </ul>
              <a href="#register" className="block w-full text-center bg-white text-gray-900 font-bold py-4 rounded-xl border border-gray-200 hover:bg-white hover:shadow-md transition-all">
                Kies Examen Training
              </a>
            </div>
            
               
{/* Cito Training */}
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl border-2 border-primary/10 ring-1 ring-primary/5 transform hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl uppercase tracking-wide shadow-md">
              Meest Gekozen
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Cito Training</h3>
              <p className="text-gray-500 mb-6">Met vertrouwen naar de Cito-toets</p>
              <div className="flex items-baseline mb-8">
                <span className="text-5xl font-extrabold text-gray-900">€150</span>
                <span className="text-gray-500 ml-2 font-medium">/ training</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Oefenen met Cito vragen
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Focus op taal en rekenen
                </li>
                <li className="flex items-center text-gray-700 font-medium">
                  <CheckCircle2 size={20} className="text-primary mr-3 flex-shrink-0" />
                  Praktische toetstips en zelfvertrouwen
                </li>
              </ul>
              <a href="#register" className="block w-full text-center bg-primary text-white font-bold py-4 rounded-xl hover:bg-primaryHover transition-colors shadow-lg shadow-primary/20">
                Kies Cito Training
              </a>
            </div>


          </div>

          <div className="bg-indigo-50 rounded-xl p-6 max-w-4xl mx-auto">
            <h4 className="font-bold text-primary mb-3">Handig om te weten:</h4>
            <ul className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
              <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-2 flex-shrink-0"></span>Betaling via Tikkie, Bank of Contant</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-2 flex-shrink-0"></span>Strippenkaarten beschikbaar</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-secondary rounded-full mr-2 flex-shrink-0"></span>Gratis annuleren tot 48u vooraf</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gradient-to-br from-indigo-900 to-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Ervaringen</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <div key={review.id} className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <div className="flex text-secondary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 leading-relaxed">"{review.text}"</p>
                <p className="font-bold text-indigo-200 flex items-center">
                  <div className="w-8 h-8 bg-indigo-400/30 rounded-full flex items-center justify-center mr-3 text-sm">
                    {review.author.charAt(0)}
                  </div>
                  {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Veelgestelde Vragen</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-gray-50 hover:bg-white transition-all"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-500" />}
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-5 bg-white text-gray-600 border-t border-gray-100 leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section id="register" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">Inschrijven</h2>
              <p className="mt-2 text-gray-600">Vul het formulier in, dan neem ik zo snel mogelijk contact op.</p>
            </div>

            {formStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-3">Bedankt voor je aanmelding!</h3>
                <p className="text-green-700 text-lg">De gegevens zijn succesvol verstuurd naar The Classlou.</p>
                <p className="text-green-600 mt-2">Je ontvangt binnenkort een reactie per mail.</p>
                <button 
                  onClick={() => setFormStatus('idle')}
                  className="mt-8 px-6 py-2 bg-white border border-green-200 text-green-700 rounded-full font-medium hover:bg-green-50 transition-colors"
                >
                  Nog een aanmelding doen
                </button>
              </div>
            ) : formStatus === 'error' ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center animate-fade-in mb-6">
                <p className="text-red-800 font-bold mb-2">Er ging iets mis bij het versturen.</p>
                <p className="text-red-600 mb-4">Probeer het opnieuw of stuur direct een mail.</p>
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg"
                  >
                    Probeer opnieuw
                  </button>
                  <a 
                    href={`mailto:theclasslou@gmail.com?subject=Aanmelding via Website&body=${encodeURIComponent("Ik wil me graag aanmelden. " + JSON.stringify(formData))}`}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Open Mail App
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="studentName" className="block text-sm font-semibold text-gray-700 mb-2">Naam Leerling *</label>
                    <input
                      type="text"
                      name="studentName"
                      id="studentName"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.studentName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="parentName" className="block text-sm font-semibold text-gray-700 mb-2">Naam Ouder/Verzorger</label>
                    <input
                      type="text"
                      name="parentName"
                      id="parentName"
                      placeholder="Verplicht bij <18 jaar"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.parentName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">E-mailadres *</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">Telefoonnummer *</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="schoolInfo" className="block text-sm font-semibold text-gray-700 mb-2">School + Leerjaar *</label>
                    <input
                      type="text"
                      name="schoolInfo"
                      id="schoolInfo"
                      placeholder="Bijv. Comenius College, 3 HAVO"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.schoolInfo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="subjects" className="block text-sm font-semibold text-gray-700 mb-2">Vak(ken) *</label>
                    <input
                      type="text"
                      name="subjects"
                      id="subjects"
                      placeholder="Bijv. Wiskunde B, Natuurkunde"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.subjects}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="locaPreference" className="block text-sm font-semibold text-gray-700 mb-2">Voorkeur *</label>
                    <select
                      name="locaPreference"
                      id="locaPreference"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.typePreference}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Kies leslocatie</option>
                      <option value="Online">Online</option>
                      <option value="Fysiek">Fysiek (Regio Amsterdam)</option>
                      <option value="Geen voorkeur">Geen voorkeur</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="typePreference" className="block text-sm font-semibold text-gray-700 mb-2">Voorkeur Bijles *</label>
                    <select
                      name="typePreference"
                      id="typePreference"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.typePreference}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Kies type les</option>
                      <option value="1-op-1 Bijles">1-op-1</option>
                      <option value="Groepsles">Groepsles</option>
                      <option value="Examen Training">Examen Training</option>
                      <option value="Cito Training">Cito Training</option>
                    </select>
                  </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                  
                  <div>
                    <label htmlFor="availability" className="block text-sm font-semibold text-gray-700 mb-2">Voorkeur dagen/tijden</label>
                    <input
                      type="text"
                      name="availability"
                      id="availability"
                      placeholder="Bijv. Zaterdag, Zondag"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.availability}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2"> Lestijd</label>
                    <input
                      type="float"
                      name="time"
                      id="time"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-semibold text-gray-700 mb-2">Extra opmerkingen</label>
                  <textarea
                    name="comments"
                    id="comments"
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow bg-gray-50 focus:bg-white"
                    value={formData.comments}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  * Door dit formulier te versturen ga je akkoord met onze privacyverklaring. Gegevens worden alleen gebruikt voor deze aanvraag.
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white ${formStatus === 'submitting' ? 'bg-indigo-400' : 'bg-primary hover:bg-primaryHover'} transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300`}
                >
                  {formStatus === 'submitting' ? 'Versturen...' : (
                    <>
                      Verstuur Aanmelding <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Heb je nog vragen of wil je eerst even overleggen? Neem gerust contact op.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-primary mr-5 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail size={26} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">E-mail</p>
                    <a href="mailto:theclasslou@gmail.com" className="text-xl text-gray-900 font-medium hover:text-primary transition-colors">Theclasslou@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-primary mr-5 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin size={26} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Regio</p>
                    <p className="text-xl text-gray-900 font-medium">Amsterdam & Online</p>
                  </div>
                </div>

                <div className="flex items-center group">
                  <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-primary mr-5 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Instagram size={26} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Socials</p>
                    <a href="https://instagram.com/theclasslou" target="_blank" rel="noreferrer" className="text-xl text-gray-900 font-medium hover:text-primary transition-colors">@theclasslou</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-10 flex flex-col justify-center items-center text-center border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Klaar om te starten?</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Wacht niet te lang. Vol = vol.
              </p>
              <a href="#register" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-secondary hover:bg-orange-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Schrijf je nu in
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <span className="text-2xl font-bold text-white tracking-tight">The Classlou</span>
            <p className="mt-4 text-sm leading-relaxed">
              Professionele bijles met persoonlijke aandacht voor VMBO, HAVO en VWO.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Snelle Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Diensten</a></li>
              <li><a href="#rates" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Tarieven</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors hover:translate-x-1 inline-block">Ervaringen</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors hover:translate-x-1 inline-block">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Juridisch</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacyverklaring</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          &copy; {new Date().getFullYear()} Loaina’s Classroom Hub. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
}

export default App;
