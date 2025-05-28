import React, { useState, useEffect ,useRef } from "react";
import { Calendar, ShoppingBag, Users, Gift, Clock, MapPin, Ticket, Image, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
   const [step, setStep] = useState('greet');
    const [payload, setPayload] = useState({});
    const [messages, setMessages] = useState([{ sender: 'bot', text: 'Welcome to Museum Express! I can help you book exhibition tickets, find information about current exhibitions, or manage your existing bookings. How may I assist you today?' }]);
    const [isThinking, setIsThinking] = useState(false);
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef(null);
  
    // Auto-scroll to bottom of chat
    useEffect(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);
  
    const addMessage = (sender, text) => {
      setMessages((prevMessages) => [...prevMessages, { sender, text }]);
    };
  
    const handleInputChange = (key, value) => {
      setPayload({ ...payload, [key]: value });
    };
  
    const handleConfirmBooking = () => {
      // Generate a random ticket ID
      const ticketId = 'MUS-' + Math.floor(100000 + Math.random() * 900000);
      
      addMessage('bot', `Booking confirmed! Here's your summary:\n- Ticket ID: ${ticketId}\n- Museum: ${payload.city} Art Museum\n- Exhibition: ${payload.site}\n- Date: ${payload.date}\n- Adults: ${payload.adults}\n- Children: ${payload.children}${payload.slot ? '\n- Guided Tour: ' + payload.slot : ''}\n\nPlease save your Ticket ID for future reference.`);
      console.log('Booking Payload:', {...payload, ticketId});
      setStep('greet');
      setPayload({});
    };
  
    const handleConfirmCancel = () => {
      addMessage('bot', `Ticket with ID ${payload.ticketId} has been cancelled! A confirmation email will be sent shortly.`);
      console.log('Cancel Payload:', payload);
      setStep('greet');
      setPayload({});
    };
  
    const detectIntent = (input) => {
      const text = input.toLowerCase();
      
      // Book intent detection
      if (text.includes('book') || 
          text.includes('reserve') || 
          text.includes('get ticket') || 
          text.includes('buy ticket') ||
          text.includes('purchase')) {
        return 'book';
      }
      
      // Cancel intent detection
      if (text.includes('cancel') || 
          text.includes('refund') || 
          text.includes('delete booking') ||
          text.includes('return ticket')) {
        return 'cancel';
      }
      
      // Show sites intent detection
      if (text.includes('show') || 
          text.includes('list') || 
          text.includes('display') ||
          text.includes('what exhibition') ||
          text.includes('current exhibition') ||
          text.includes('available exhibition') ||
          text.includes('see exhibition')) {
        return 'show';
      }
      
      // Greeting detection
      if (text.includes('hello') || 
          text.includes('hi') || 
          text.includes('hey') ||
          text.includes('greetings') ||
          text.match(/^(hi|hello|hey)[\s!]*$/)) {
        return 'greeting';
      }
      
      return null;
    };
  
    const extractCity = (input) => {
      // Museum cities
      const museumCities = ['new york', 'london', 'paris', 'tokyo', 'rome', 'berlin', 'madrid', 'amsterdam', 'florence', 'vienna'];
      const text = input.toLowerCase();
      
      for (const city of museumCities) {
        if (text.includes(city)) {
          return city;
        }
      }
      
      return null;
    };
  
    const simulateThinking = async (callback, delay = 1000) => {
      setIsThinking(true);
      await new Promise(resolve => setTimeout(resolve, delay));
      setIsThinking(false);
      callback();
    };
  
    const handleSendMessage = () => {
      if (!userInput.trim()) return;
      
      addMessage('user', userInput);
      const currentInput = userInput;
      setUserInput('');
  
      simulateThinking(() => processUserInput(currentInput));
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSendMessage();
      }
    };
  
    const processUserInput = (input) => {
      switch (step) {
        case 'greet': {
          const intent = detectIntent(input);
          const city = extractCity(input);
          
          if (intent === 'greeting') {
            addMessage('bot', 'Hello! I\'m your museum assistant. I can help you book exhibition tickets, find information about current exhibitions, or manage your existing bookings. How can I assist you today?');
            return;
          }
          
          if (intent === 'book') {
            if (city) {
              handleInputChange('city', city);
              addMessage('bot', `I see you're interested in the ${city.charAt(0).toUpperCase() + city.slice(1)} Art Museum. Which exhibition would you like to visit?`);
              setStep('selectSite');
            } else {
              addMessage('bot', 'I understand you want to book museum tickets. Please enter the city where you\'d like to visit a museum:');
              setStep('cityInput');
            }
          } else if (intent === 'cancel') {
            addMessage('bot', 'I understand you want to cancel a museum ticket. Please enter your Ticket ID (format: MUS-XXXXXX):');
            setStep('ticketInput');
          } else if (intent === 'show') {
            if (city) {
              handleInputChange('city', city);
              addMessage('bot', `Current exhibitions at ${city.charAt(0).toUpperCase() + city.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts`);
              setStep('greet');
            } else {
              addMessage('bot', 'I understand you want to see current exhibitions. Please enter the city:');
              setStep('siteCityInput');
            }
          } else {
            addMessage('bot', 'I can help you book museum tickets, cancel existing bookings, or show current exhibitions. What would you like to do?');
          }
          break;
        }
  
        case 'cityInput':
          handleInputChange('city', input);
          addMessage('bot', `Current exhibitions at ${input.charAt(0).toUpperCase() + input.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts\n\nPlease select one by name or number:`);
          setStep('selectSite');
          break;
  
        case 'selectSite':
          handleInputChange('site', input);
          addMessage('bot', 'When would you like to visit? Please enter a date (YYYY-MM-DD):');
          setStep('dateInput');
          break;
  
        case 'dateInput':
          handleInputChange('date', input);
          addMessage('bot', 'How many adult tickets do you need?');
          setStep('adultsInput');
          break;
  
        case 'adultsInput':
          handleInputChange('adults', input);
          addMessage('bot', 'How many child tickets do you need? (Ages 6-12 receive discounted admission. Children under 6 are free.)');
          setStep('childrenInput');
          break;
  
        case 'childrenInput':
          handleInputChange('children', input);
          addMessage('bot', 'Would you like to add a guided tour? Our expert guides provide 45-minute tours throughout the day. (yes/no)');
          setStep('showBooking');
          break;
  
        case 'showBooking':
          if (input.toLowerCase() === 'yes' || input.toLowerCase().includes('yes')) {
            addMessage('bot', 'Available tour times: 10:30 AM, 1:00 PM, 2:30 PM, 4:00 PM. Please select one:');
            setStep('slotInput');
          } else {
            handleConfirmBooking();
          }
          break;
  
        case 'slotInput':
          handleInputChange('slot', input);
          handleConfirmBooking();
          break;
  
        case 'ticketInput':
          handleInputChange('ticketId', input);
          handleConfirmCancel();
          break;
  
        case 'siteCityInput':
          handleInputChange('city', input);
          addMessage('bot', `Current exhibitions at ${input.charAt(0).toUpperCase() + input.slice(1)} Art Museum:\n1. Modern Masters\n2. Renaissance Treasures\n3. Contemporary Sculptures\n4. Impressionist Collection\n5. Ancient Artifacts`);
          setStep('greet');
          break;
  
        default:
          break;
      }
    };

  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const images = [
    {
      src: "https://www.christies.com/-/media/images/features/articles/2023/11/01-10/christian-levett-property-from-the-mougins-museum-of-classical-art/christian-levett-mougins-museum-3520.jpg?h=2200&iar=0&w=3520&rev=5f12f1c4a54842698d13c28ea4ca7fec&hash=315432ee60273350eb5d346e4042bcae2ca83de8",
      caption: "Experience Art Through the Ages",
      subcaption: "Our main gallery reopens this weekend"
    },
    {
      src: "https://imageio.forbes.com/specials-images/imageserve/665a63078da098d705fc9f2d/IMG-9684--1-/0x0.jpg?format=jpg&crop=2574,1448,x0,y0,safe&width=1440", 
      caption: "Architectural Wonders",
      subcaption: "Explore our award-winning building design"
    },
    {
      src: "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/12/11/245918.jpg",
      caption: "Interactive Exhibits",
      subcaption: "Perfect for visitors of all ages"
    }
  ];
  
  const categories = [
    { id: "all", label: "All" },
    { id: "visit", label: "Planning Your Visit" },
    { id: "explore", label: "Explore" },
    { id: "support", label: "Support" }
  ];
  
  const options = [
    { 
      title: "Visit Info", 
      url: "/visit", 
      icon: <Clock size={24} />,
      category: "visit",
      description: "Hours, directions, and accessibility"
    },
    { 
      title: "Exhibitions", 
      url: "/exhibitions", 
      icon: <Image size={24} />,
      category: "explore",
      description: "Current and upcoming exhibitions"
    },
    { 
      title: "Book Tickets", 
      url: "/book", 
      icon: <Ticket size={24} />,
      category: "visit",
      description: "Reserve your spot today"
    },
    { 
      title: "Virtual Tour", 
      url: "/virtual-tour", 
      icon: <MapPin size={24} />,
      category: "explore",
      description: "Experience the museum from anywhere"
    },
    { 
      title: "Museum Shop", 
      url: "/shop", 
      icon: <ShoppingBag size={24} />,
      category: "explore",
      description: "Unique gifts and souvenirs"
    },
    { 
      title: "Events", 
      url: "/events", 
      icon: <Calendar size={24} />,
      category: "explore",
      description: "Workshops, talks, and performances"
    },
    { 
      title: "Membership", 
      url: "/membership", 
      icon: <Users size={24} />,
      category: "support",
      description: "Join our community of art lovers"
    },
    { 
      title: "Donate", 
      url: "/donate", 
      icon: <Gift size={24} />,
      category: "support",
      description: "Support our mission and programs"
    },
    { 
      title: "Blog", 
      url: "/blog", 
      icon: <BookOpen size={24} />,
      category: "explore",
      description: "Stories behind the art"
    }
  ];

  const highlights = [
    {
      title: "New Exhibition",
      description: "Modern Masters: A Century of Innovation",
      date: "May 25 - September 10",
      image: "/api/placeholder/400/300"
    },
    {
      title: "Family Day",
      description: "Interactive workshops for all ages",
      date: "Every Sunday, 10am-4pm",
      image: "/api/placeholder/400/300"
    },
    {
      title: "Guided Tours",
      description: "Expert-led tours of our permanent collection",
      date: "Daily at 11am and 2pm",
      image: "/api/placeholder/400/300"
    }
  ];

  const filteredOptions = activeCategory === "all" 
    ? options 
    : options.filter(opt => opt.category === activeCategory);
    
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  // Custom carousel component since we can't import react-responsive-carousel
  const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    
    useEffect(() => {
      const interval = setInterval(() => {
        nextSlide();
      }, 3000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="relative h-96 md:h-screen max-h-[600px] overflow-hidden">
        {images.map((img, i) => (
          <div 
            key={i} 
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === i ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img.src} alt={`Slide ${i+1}`} className="object-cover h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60 flex flex-col justify-end text-left p-6 md:p-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{img.caption}</h2>
              <p className="text-lg md:text-xl text-white mb-8">{img.subcaption}</p>
              <div className="flex flex-wrap gap-4">
                <a href="/book" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                  Book Tickets
                </a>
                <a href="/exhibitions" className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                  Explore Exhibitions
                </a>
              </div>
            </div>
          </div>
        ))}
        
        <button 
          onClick={prevSlide} 
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full p-2 focus:outline-none"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={nextSlide} 
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black bg-opacity-40 hover:bg-opacity-60 text-white rounded-full p-2 focus:outline-none"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full ${currentSlide === i ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
              aria-label={`Go to slide ${i+1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header with scroll effect */}
      {/* <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            
            <h2 className="ml-2 text-xl font-bold text-gray-800">Museum guide</h2>
          </div>
          {/* <nav className="hidden md:flex space-x-8">
            <Link to="/visit" className="text-gray-600 hover:text-blue-600 font-medium">Visit</Link>
            <Link to="/events" className="text-gray-600 hover:text-blue-600 font-medium">Events</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium">About</Link>
            <Link to="/exhibitions" className="text-gray-600 hover:text-blue-600 font-medium">Exhibitions</Link>
          </nav> */}
          {/* <div className="flex items-center space-x-4">
            <a href="/book" className="hidden sm:block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Book Tickets
            </a>
            <button className="md:hidden text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
     </header> */}

      {/* Hero carousel with improved design */}
      <div className="relative">
        <Carousel />
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Current highlights section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Current Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <img src={highlight.image} alt={highlight.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded mb-2">{highlight.title}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{highlight.description}</h3>
                  <p className="text-gray-600 mb-4">{highlight.date}</p>
                  <a href="/details" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    Learn more
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick links section with tabs */}
        <section className="bg-white rounded-xl shadow-md p-6 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Plan Your Experience</h2>
          
          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto space-x-4 pb-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`py-2 px-3 font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeCategory === category.id
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOptions.map((opt, i) => (
              <a
                key={i}
                href={opt.url}
                className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition duration-300"
              >
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
                  {opt.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{opt.title}</h3>
                  <p className="text-sm text-gray-600">{opt.description}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Newsletter and chat section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="mb-4">Stay updated with exhibitions, events, and special offers.</p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Your email address"
                className="flex-grow rounded-l-lg px-4 py-2 text-gray-800 focus:outline-none"
              />
              <button 
                onClick={handleSubscribe}
                className="bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded-r-lg font-medium transition duration-300"
              >
                Subscribe
              </button>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help Planning Your Visit?</h3>
            <p className="text-gray-600 mb-6">Our team is ready to answer your questions about tickets, exhibitions, or special accommodations.</p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat with Us
            </button>
          </div>
        </section>
            </main>
            {/* Chatbot Modal */}
{isChatOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex justify-end">
   <div className="backdrop-blur-none h-60vh flex items-center justify-center p-4">
         <div className="bg-white rounded-full shadow-lg w-full max-w-md flex flex-col h-96 border border-gray-200">
           <div className="bg-indigo-800 text-white p-3 rounded-t-lg flex items-center">
             <div className="mr-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
             </div>
             <div>
               <h2 className="text-lg font-semibold">Museum Guide</h2>
               <p className="text-xs text-indigo-100">Book tickets & explore exhibitions</p>
             </div>
           </div>
           
           <div className="flex-grow overflow-y-auto p-3 space-y-2 bg-gray-50">
             {messages.map((msg, index) => (
               <div key={index} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                 <div 
                   className={`p-2 rounded-lg max-w-xs text-xs ${
                     msg.sender === 'bot' 
                       ? 'bg-indigo-50 text-gray-800 border border-indigo-100' 
                       : 'bg-indigo-600 text-white'
                   }`}
                 >
                   {msg.text.split('\n').map((line, i) => (
                     <React.Fragment key={i}>
                       {line}
                       {i < msg.text.split('\n').length - 1 && <br />}
                     </React.Fragment>
                   ))}
                 </div>
               </div>
             ))}
             
             {isThinking && (
               <div className="flex justify-start">
                 <div className="bg-indigo-50 p-2 rounded-lg flex items-center space-x-1 border border-indigo-100">
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>
           
           <div className="p-3 border-t border-gray-200 bg-slate-500">
             <div className="flex gap-4">
               <input 
                 type="text" 
                 className="border border-black rounded-full p-2 flex-grow text-xs" 
                 placeholder="Ask about exhibitions, tickets, or tours..." 
                 value={userInput}
                 onChange={(e) => setUserInput(e.target.value)}
                 onKeyDown={handleKeyDown}
               />
               <button 
                 onClick={handleSendMessage}
                 className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-150"
               >
                 <span>Send</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                   <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                 </svg>
               </button>
             </div>
              <div className="flex  justify-center mt-2">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-xs text-black hover:text-red-700 border border-black hover:border-red-700 rounded-full px-3 py-1 transition duration-300"
                >
                  Close
                </button>
                </div>
           </div>
         </div>
       </div>
  </div>
)}

          </div>
        );
      };
      
      export default HomePage;