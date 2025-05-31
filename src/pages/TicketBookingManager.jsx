import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, CreditCard, AlertCircle, X, CheckCircle } from 'lucide-react';

const TicketBookingManager = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingTicket, setCancellingTicket] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch user data from localStorage
  const getUserData = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('museumUser') || '{}');
      return userData;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return {};
    }
  };

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const userData = getUserData();
      
      if (!userData.id) {
        throw new Error('User ID not found in localStorage');
      }

      const response = await fetch(`http://localhost:8080/api/auth/user/${userData.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tickets');
      }

      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if booking date is upcoming
  const isUpcomingBooking = (bookingDate) => {
    const today = new Date();
    const booking = new Date(bookingDate);
    return booking >= today;
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Format booking time
  const formatBookingTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle ticket cancellation
  const handleCancelTicket = async () => {
    if (!cancelReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/payment/cancel/${cancellingTicket}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Refresh tickets after cancellation
      await fetchTickets();
      
      // Reset modal state
      setShowCancelModal(false);
      setCancellingTicket(null);
      setCancelReason('');
      
      alert('Ticket cancelled successfully! Refund will be processed shortly.');
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    }
  };

  // Open cancel modal
  const openCancelModal = (ticketId) => {
    setCancellingTicket(ticketId);
    setShowCancelModal(true);
  };

  // Close cancel modal
  const closeCancelModal = () => {
    setShowCancelModal(false);
    setCancellingTicket(null);
    setCancelReason('');
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTickets}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your museum visit bookings</p>
        </div>

        {tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h2>
            <p className="text-gray-600">You haven't made any bookings yet. Start exploring museums!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{ticket.siteName}</h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {ticket.cancelled ? (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium mb-1">
                          Cancelled
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium mb-1">
                          Confirmed
                        </span>
                      )}
                      {ticket.refundSuccessful && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          Refunded
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visit Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Visit Date</p>
                        <p className="text-sm font-medium">{formatDate(ticket.bookingDate)}</p>
                      </div>
                    </div>
                    
                    {ticket.showBooked && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Show Time</p>
                          <p className="text-sm font-medium">{ticket.showSlot}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visitor Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Site Visit</p>
                        <p className="text-sm font-medium">
                          {ticket.siteAdults} Adults, {ticket.siteChildren} Children
                        </p>
                      </div>
                    </div>
                    
                    {ticket.showBooked && (
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Show</p>
                          <p className="text-sm font-medium">
                            {ticket.showAdults} Adults, {ticket.showChildren} Children
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Site Fare</span>
                      <span className="text-sm font-medium">₹{ticket.siteFare}</span>
                    </div>
                    {ticket.showBooked && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Show Fare</span>
                        <span className="text-sm font-medium">₹{ticket.showFare}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-lg text-blue-600">₹{ticket.totalFare}</span>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="text-xs text-gray-500 mb-4">
                    <p>Booking ID: {ticket.id.substring(0, 8)}...</p>
                    <p>Booked on: {formatBookingTime(ticket.bookedAt)}</p>
                    {ticket.cancelled && ticket.cancellationReason && (
                      <p className="text-red-600 mt-1">Reason: {ticket.cancellationReason}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end">
                    {!ticket.cancelled && isUpcomingBooking(ticket.bookingDate) && (
                      <button
                        onClick={() => openCancelModal(ticket.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
                <button
                  onClick={closeCancelModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-4">
                Please provide a reason for cancellation. Your refund will be processed within 5-7 business days.
              </p>
              
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter cancellation reason..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeCancelModal}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelTicket}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketBookingManager;