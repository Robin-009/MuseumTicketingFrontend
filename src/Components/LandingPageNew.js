import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle, Calendar, Users, MapPin, Camera, Headphones, X, Send, Globe, Menu, Star, Clock, Ticket } from 'lucide-react';

const MuseumLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatData, setChatData] = useState({});
  const [chatStep, setChatStep] = useState('greeting');
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const chatEndRef = useRef(null);

  const translations = {
    en: {
      title: 'Heritage Explorer',
      subtitle: 'Discover India\'s Rich Cultural Heritage',
      bookTickets: 'Book Tickets',
      virtualTour: 'Virtual Tour',
      exploreMore: 'Explore More',
      features: 'Features',
      chatWithBot: 'Chat with Heritage Bot',
      instantBooking: 'Instant Booking',
      cancelTicket: 'Cancel Ticket',
      showSites: 'Show Sites',
      quickActions: 'Quick Actions',
      popularSites: 'Popular Heritage Sites',
      aboutUs: 'About Heritage Explorer',
      aboutText: 'Experience India\'s magnificent heritage through our AI-powered chatbot that makes museum and monument visits seamless. Book tickets, explore virtually, and plan your cultural journey with ease.',
      contact: 'Contact Us',
      email: 'Email: info@heritageexplorer.in',
      phone: 'Phone: +91 98765 43210',
      greetingMsg: 'Namaste! Welcome to Heritage Explorer. How can I help you today?',
      bookOption: '🎫 Book Ticket',
      cancelOption: '❌ Cancel Ticket',
      sitesOption: '🏛️ Show Sites'
    },
    hi: {
      title: 'हेरिटेज एक्सप्लोरर',
      subtitle: 'भारत की समृद्ध सांस्कृतिक विरासत खोजें',
      bookTickets: 'टिकट बुक करें',
      virtualTour: 'वर्चुअल टूर',
      exploreMore: 'और देखें',
      features: 'विशेषताएं',
      chatWithBot: 'हेरिटेज बॉट से चैट करें',
      instantBooking: 'तुरंत बुकिंग',
      cancelTicket: 'टिकट रद्द करें',
      showSites: 'स्थल दिखाएं',
      quickActions: 'त्वरित कार्य',
      popularSites: 'लोकप्रिय विरासत स्थल',
      aboutUs: 'हेरिटेज एक्सप्लोरर के बारे में',
      aboutText: 'हमारे AI-पावर्ड चैटबॉट के माध्यम से भारत की शानदार विरासत का अनुभव करें जो संग्रहालय और स्मारक यात्राओं को आसान बनाता है।',
      contact: 'संपर्क करें',
      email: 'ईमेल: info@heritageexplorer.in',
      phone: 'फोन: +91 98765 43210',
      greetingMsg: 'नमस्ते! हेरिटेज एक्सप्लोरर में आपका स्वागत है। आज मैं आपकी कैसे सहायता कर सकता हूं?',
      bookOption: '🎫 टिकट बुक करें',
      cancelOption: '❌ टिकट रद्द करें',
      sitesOption: '🏛️ स्थल दिखाएं'
    }
  };

  const t = translations[language];

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
      title: language === 'en' ? 'Taj Mahal, Agra' : 'ताज महल, आगरा',
      subtitle: language === 'en' ? 'Symbol of Eternal Love' : 'शाश्वत प्रेम का प्रतीक'
    },
    {
      image: 'https://images.unsplash.com/photo-1545979797-bb43bc2946b3?w=800',
      title: language === 'en' ? 'Red Fort, Delhi' : 'लाल किला, दिल्ली',
      subtitle: language === 'en' ? 'Mughal Architecture Marvel' : 'मुगल वास्तुकला का चमत्कार'
    },
    {
      image: 'https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=800',
      title: language === 'en' ? 'Mysore Palace' : 'मैसूर पैलेस',
      subtitle: language === 'en' ? 'Royal Grandeur' : 'शाही भव्यता'
    }
  ];

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8 text-orange-500" />,
      title: t.chatWithBot,
      desc: language === 'en' ? 'Interactive AI assistant for seamless booking' : 'निर्बाध बुकिंग के लिए इंटरैक्टिव AI सहायक'
    },
    {
      icon: <Ticket className="w-8 h-8 text-orange-500" />,
      title: t.instantBooking,
      desc: language === 'en' ? 'Book tickets instantly with real-time availability' : 'रियल-टाइम उपलब्धता के साथ तुरंत टिकट बुक करें'
    },
    {
      icon: <Camera className="w-8 h-8 text-orange-500" />,
      title: t.virtualTour,
      desc: language === 'en' ? 'Explore heritage sites from your home' : 'अपने घर से विरासत स्थलों का अन्वेषण करें'
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: language === 'en' ? 'Multilingual Support' : 'बहुभाषी समर्थन',
      desc: language === 'en' ? 'Available in Hindi and English' : 'हिंदी और अंग्रेजी में उपलब्ध'
    }
  ];

  const popularSites = [
    { name: language === 'en' ? 'Taj Mahal' : 'ताज महल', city: language === 'en' ? 'Agra' : 'आगरा', rating: 4.9, price: '₹50' },
    { name: language === 'en' ? 'Red Fort' : 'लाल किला', city: language === 'en' ? 'Delhi' : 'दिल्ली', rating: 4.7, price: '₹35' },
    { name: language === 'en' ? 'Hawa Mahal' : 'हवा महल', city: language === 'en' ? 'Jaipur' : 'जयपुर', rating: 4.6, price: '₹30' },
    { name: language === 'en' ? 'Gateway of India' : 'इंडिया गेट', city: language === 'en' ? 'Mumbai' : 'मुंबई', rating: 4.5, price: '₹25' }
  ];

  const chatFlow = {
    greeting: {
      message: t.greetingMsg,
      options: [t.bookOption, t.cancelOption, t.sitesOption]
    },
    bookTicket: {
      steps: ['city', 'site', 'date', 'adults', 'children', 'show', 'slot', 'summary', 'confirm']
    },
    cancelTicket: {
      steps: ['ticketId', 'confirmCancel']
    },
    showSites: {
      steps: ['city', 'site']
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const initializeChat = () => {
    setChatHistory([{
      type: 'bot',
      message: t.greetingMsg,
      options: [t.bookOption, t.cancelOption, t.sitesOption]
    }]);
    setChatStep('greeting');
    setChatData({});
  };

  const handleChatOption = (option) => {
    setChatHistory(prev => [...prev, { type: 'user', message: option }]);
    
    if (option.includes('Book') || option.includes('बुक')) {
      setChatStep('bookTicket_city');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'Which city would you like to visit?' : 'आप किस शहर की यात्रा करना चाहते हैं?',
        input: true
      }]);
    } else if (option.includes('Cancel') || option.includes('रद्द')) {
      setChatStep('cancelTicket_ticketId');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'Please enter your ticket ID:' : 'कृपया अपना टिकट ID डालें:',
        input: true
      }]);
    } else if (option.includes('Show') || option.includes('दिखाएं')) {
      setChatStep('showSites_city');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'Which city sites would you like to see?' : 'आप किस शहर के स्थल देखना चाहते हैं?',
        input: true
      }]);
    }
  };

  const handleChatInput = (input) => {
    if (!input.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', message: input }]);
    setUserInput('');
    
    // Process based on current step
    if (chatStep === 'bookTicket_city') {
      setChatData(prev => ({ ...prev, city: input }));
      setChatStep('bookTicket_site');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? `Great! Here are popular sites in ${input}:` : `बहुत बढ़िया! ${input} में लोकप्रिय स्थल हैं:`,
        options: ['Taj Mahal', 'Red Fort', 'Hawa Mahal', 'Gateway of India']
      }]);
    } else if (chatStep === 'bookTicket_site') {
      setChatData(prev => ({ ...prev, site: input }));
      setChatStep('bookTicket_date');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'When would you like to visit? (DD/MM/YYYY)' : 'आप कब जाना चाहते हैं? (DD/MM/YYYY)',
        input: true
      }]);
    } else if (chatStep === 'bookTicket_date') {
      setChatData(prev => ({ ...prev, date: input }));
      setChatStep('bookTicket_adults');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'How many adults?' : 'कितने वयस्क?',
        input: true
      }]);
    } else if (chatStep === 'bookTicket_adults') {
      setChatData(prev => ({ ...prev, adults: parseInt(input) }));
      setChatStep('bookTicket_children');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'How many children?' : 'कितने बच्चे?',
        input: true
      }]);
    } else if (chatStep === 'bookTicket_children') {
      setChatData(prev => ({ ...prev, children: parseInt(input) }));
      setChatStep('bookTicket_show');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? 'Would you like to book a show as well?' : 'क्या आप शो भी बुक करना चाहते हैं?',
        options: [language === 'en' ? 'Yes' : 'हाँ', language === 'en' ? 'No' : 'नहीं']
      }]);
    } else if (chatStep === 'bookTicket_show') {
      setChatData(prev => ({ ...prev, wantShow: input.toLowerCase().includes('yes') || input.includes('हाँ') }));
      if (input.toLowerCase().includes('yes') || input.includes('हाँ')) {
        setChatStep('bookTicket_slot');
        setChatHistory(prev => [...prev, {
          type: 'bot',
          message: language === 'en' ? 'Select time slot:' : 'समय स्लॉट चुनें:',
          options: ['10:00 AM', '2:00 PM', '6:00 PM']
        }]);
      } else {
        showBookingSummary();
      }
    } else if (chatStep === 'bookTicket_slot') {
      setChatData(prev => ({ ...prev, slot: input }));
      showBookingSummary();
    } else if (chatStep === 'cancelTicket_ticketId') {
      setChatData(prev => ({ ...prev, ticketId: input }));
      setChatStep('cancelTicket_confirm');
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? `Confirm cancellation of ticket ${input}?` : `टिकट ${input} का रद्द करना confirm करें?`,
        options: [language === 'en' ? 'Yes, Cancel' : 'हाँ, रद्द करें', language === 'en' ? 'No' : 'नहीं']
      }]);
    } else if (chatStep === 'showSites_city') {
      setChatData(prev => ({ ...prev, city: input }));
      setChatHistory(prev => [...prev, {
        type: 'bot',
        message: language === 'en' ? `Popular sites in ${input}:` : `${input} में लोकप्रिय स्थल:`,
        sites: popularSites.filter(site => site.city.toLowerCase().includes(input.toLowerCase()))
      }]);
    }
  };

  const showBookingSummary = () => {
    const summary = `
${language === 'en' ? 'Booking Summary:' : 'बुकिंग सारांश:'}
${language === 'en' ? 'City:' : 'शहर:'} ${chatData.city}
${language === 'en' ? 'Site:' : 'स्थल:'} ${chatData.site}
${language === 'en' ? 'Date:' : 'दिनांक:'} ${chatData.date}
${language === 'en' ? 'Adults:' : 'वयस्क:'} ${chatData.adults}
${language === 'en' ? 'Children:' : 'बच्चे:'} ${chatData.children}
${chatData.slot ? `${language === 'en' ? 'Show Slot:' : 'शो स्लॉट:'} ${chatData.slot}` : ''}
    `;
    
    setChatHistory(prev => [...prev, {
      type: 'bot',
      message: summary,
      options: [language === 'en' ? 'Confirm Booking' : 'बुकिंग confirm करें', language === 'en' ? 'Cancel' : 'रद्द करें']
    }]);
    setChatStep('bookTicket_confirm');
  };

  const handleBookingConfirm = () => {
    // Here you would call your API
    const apiData = {
      type: 'booking',
      data: chatData,
      timestamp: new Date().toISOString()
    };
    
    console.log('API Call Data:', JSON.stringify(apiData, null, 2));
    
    setChatHistory(prev => [...prev, {
      type: 'bot',
      message: language === 'en' ? '✅ Booking confirmed! Your ticket ID is: TKT12345' : '✅ बुकिंग confirmed हो गई! आपका टिकट ID है: TKT12345'
    }]);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen && chatHistory.length === 0) {
      initializeChat();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{t.title}</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <nav className="flex space-x-6">
                <a href="#features" className="text-gray-600 hover:text-orange-500">{t.features}</a>
                <a href="#popular" className="text-gray-600 hover:text-orange-500">{t.popularSites}</a>
                <a href="#about" className="text-gray-600 hover:text-orange-500">{t.aboutUs}</a>
              </nav>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
              </select>
            </div>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full z-30">
          <div className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-gray-600">{t.features}</a>
            <a href="#popular" className="block text-gray-600">{t.popularSites}</a>
            <a href="#about" className="block text-gray-600">{t.aboutUs}</a>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>
      )}

      {/* Hero Carousel */}
      <section className="relative h-96 md:h-[600px] overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="min-w-full relative">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white px-4">
                  <h2 className="text-3xl md:text-6xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-lg md:text-2xl mb-8">{slide.subtitle}</p>
                  <div className="space-x-4">
                    <button 
                      onClick={toggleChat}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      {t.bookTickets}
                    </button>
                    <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors">
                      {t.virtualTour}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </section>

      {/* Quick Actions */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">{t.quickActions}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button 
              onClick={toggleChat}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <Ticket className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">{t.bookTickets}</div>
            </button>
            <button 
              onClick={toggleChat}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <X className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">{t.cancelTicket}</div>
            </button>
            <button 
              onClick={toggleChat}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-lg transition-shadow"
            >
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="font-semibold">{t.showSites}</div>
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">{t.features}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h4>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Sites */}
      <section id="popular" className="py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">{t.popularSites}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSites.map((site, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-r from-orange-400 to-red-400"></div>
                <div className="p-4">
                  <h4 className="font-semibold text-lg mb-1">{site.name}</h4>
                  <p className="text-gray-600 mb-2">{site.city}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">{site.rating}</span>
                    </div>
                    <span className="font-semibold text-orange-500">{site.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-8 text-gray-800">{t.aboutUs}</h3>
            <p className="text-lg text-gray-600 mb-8">{t.aboutText}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-800">{t.contact}</h4>
                <p className="text-gray-600">{t.email}</p>
                <p className="text-gray-600">{t.phone}</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 text-gray-800">
                  {language === 'en' ? 'Follow Us' : 'हमें फॉलो करें'}
                </h4>
                <div className="flex space-x-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen && (
          <button
            onClick={toggleChat}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow animate-pulse"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-xl shadow-2xl w-80 h-96 flex flex-col">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="font-semibold">Heritage Bot</span>
              </div>
              <button onClick={toggleChat}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.map((chat, index) => (
                <div key={index} className={`${chat.type === 'user' ? 'ml-auto' : 'mr-auto'} max-w-xs`}>
                  <div className={`p-3 rounded-lg ${
                    chat.type === 'user' 
                      ? 'bg-orange-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{chat.message}</p>
                    
                    {chat.options && (
                      <div className="mt-2 space-y-1">
                        {chat.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleChatOption(option)}
                            className="block w-full text-left p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-xs transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {chat.sites && (
                      <div className="mt-2 space-y-1">
                        {chat.sites.map((site, siteIndex) => (
                          <div key={siteIndex} className="p-2 bg-white bg-opacity-10 rounded text-xs">
                            <div className="font-semibold">{site.name}</div>
                            <div className="text-xs opacity-75">{site.city} - {site.price}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {chat.input && index === chatHistory.length - 1 && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleChatInput(userInput)}
                          placeholder={language === 'en' ? 'Type your response...' : 'अपना उत्तर टाइप करें...'}
                          className="w-full p-2 text-xs border rounded text-gray-800"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {chatHistory.length > 0 && !chatHistory[chatHistory.length - 1]?.input && (
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatInput(userInput)}
                    placeholder={language === 'en' ? 'Type a message...' : 'संदेश टाइप करें...'}
                    className="flex-1 p-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => handleChatInput(userInput)}
                    className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">{t.title}</h4>
              </div>
              <p className="text-gray-400 text-sm">
                {language === 'en' 
                  ? 'Experience India\'s heritage through AI-powered conversations.' 
                  : 'AI-संचालित बातचीत के माध्यम से भारत की विरासत का अनुभव करें।'
                }
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">
                {language === 'en' ? 'Quick Links' : 'त्वरित लिंक'}
              </h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">{t.features}</a></li>
                <li><a href="#popular" className="hover:text-white">{t.popularSites}</a></li>
                <li><a href="#about" className="hover:text-white">{t.aboutUs}</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">
                {language === 'en' ? 'Support' : 'सहायता'}
              </h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">
                  {language === 'en' ? 'Help Center' : 'सहायता केंद्र'}
                </a></li>
                <li><a href="#" className="hover:text-white">
                  {language === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                </a></li>
                <li><a href="#" className="hover:text-white">
                  {language === 'en' ? 'Terms of Service' : 'सेवा की शर्तें'}
                </a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">{t.contact}</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <p>{t.email}</p>
                <p>{t.phone}</p>
                <p>
                  {language === 'en' 
                    ? 'Address: New Delhi, India' 
                    : 'पता: नई दिल्ली, भारत'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              {language === 'en' 
                ? '© 2025 Heritage Explorer. All rights reserved.' 
                : '© 2025 हेरिटेज एक्सप्लोरर। सभी अधिकार सुरक्षित।'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MuseumLandingPage;