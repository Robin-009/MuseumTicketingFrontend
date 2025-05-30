import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiMapPin, FiClock, FiCalendar, FiX } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

// Enhanced image component with loading state and error handling
const SafeImage = ({ 
  src, 
  alt, 
  className, 
  fallback = "https://via.placeholder.com/300x200?text=Museum" 
}) => {
  const [status, setStatus] = useState({ loading: true, error: false });

  return (
    <div className={`relative ${className}`}>
      {status.loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <img
        src={status.error ? fallback : src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          status.loading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setStatus({ loading: false, error: false })}
        onError={() => setStatus({ loading: false, error: true })}
        loading="lazy"
      />
    </div>
  );
};

// Memoized museum card component for better performance
const MuseumCard = React.memo(({ museum, onClick }) => {
  const firstPhoto = museum.photos?.[0] || "https://via.placeholder.com/400x300?text=Museum";

  return (
    <article 
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View details for ${museum.name}`}
    >
      <div className="h-48 relative">
        <SafeImage
          src={firstPhoto}
          alt={`${museum.name} thumbnail`}
          className="absolute inset-0"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{museum.name}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <FiMapPin className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {museum.city}, {museum.state}
          </span>
        </div>
        <p className="text-gray-600 line-clamp-2">
          {museum.description}
        </p>
        <div className="mt-3 flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full whitespace-nowrap">
            From ₹{museum.adultFare}
          </span>
          <button 
            className="text-blue-600 font-medium hover:underline focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            aria-label={`View details for ${museum.name}`}
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
});

// Museum modal component with image carousel
const MuseumModal = ({ museum, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate()
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold truncate">{museum.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="relative">
            {museum.photos?.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ 
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active bg-blue-500'
                }}
                spaceBetween={20}
                slidesPerView={1}
                className="rounded-xl"
                onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
              >
                {museum.photos.map((photo, index) => (
                  <SwiperSlide key={index}>
                    <div className="h-80 md:h-96 overflow-hidden rounded-xl">
                      <img
                        src={photo}
                        alt={`${museum.name} - Exhibit ${index + 1}`}
                        className="w-full h-full"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="h-80 md:h-96 bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4">About</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {museum.description || "No description available."}
              </p>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-start">
                  <FiMapPin className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p>
                      {museum.address || `${museum.city}, ${museum.state}, ${museum.country}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiClock className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Opening Hours</h4>
                    <p>
                      {museum.openingTime} - {museum.closingTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <FiCalendar className="mt-1 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Opening Days</h4>
                    <p>
                      {museum.openingDays?.join(", ") || "Open daily"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Ticket Information</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <h4 className="font-medium mb-2">General Admission</h4>
                  <div className="flex justify-between">
                    <span>Adults</span>
                    <span className="font-semibold">₹{museum.adultFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Children (5-12)</span>
                    <span className="font-semibold">₹{museum.childFare}</span>
                  </div>
                </div>
                
                {museum.showSlots?.length > 0 ? (
                  <div>
                    <h4 className="font-medium mb-2">Special Exhibitions</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {museum.showSlots.map((slot, index) => (
                        <div 
                          key={index} 
                          className="bg-white p-3 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between font-medium">
                            <span>{slot.slotTime}</span>
                            <span>Seats: {slot.totalSeats}</span>
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span>Adult: ₹{slot.adultShowFare}</span>
                            <span>Child: ₹{slot.childShowFare}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No special exhibitions currently scheduled
                  </p>
                )}
                
                <button 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    // In a real app, this would navigate to booking page
                    navigate('/book');
                    alert(`Redirect to booking for ${museum.name}`);
                  }}
                >
                  Book Tickets Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
const Visit = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMuseum, setSelectedMuseum] = useState(null);

  useEffect(() => {
    const fetchMuseums = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/museums`);
        setMuseums(res.data);
        console.log("Museum--->", res.data);
      } catch (err) {
        console.error("Failed to fetch museums:", err);
        setError("Failed to load museums. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMuseums();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center w-full max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Discover Museums</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4">
                <div className="h-48 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Unable to Load Museums
            </h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Explore Cultural Treasures
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover fascinating museums and exhibitions near you
          </p>
        </header>
        
        {museums.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No museums currently available. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {museums.map((museum) => (
              <MuseumCard
                key={museum.id}
                museum={museum}
                onClick={() => setSelectedMuseum(museum)}
              />
            ))}
          </div>
        )}
      </div>
      
      {selectedMuseum && (
        <MuseumModal
          museum={selectedMuseum}
          onClose={() => setSelectedMuseum(null)}
        />
      )}
    </div>
  );
};

export default Visit;