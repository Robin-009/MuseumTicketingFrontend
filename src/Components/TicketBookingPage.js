import { useState, useEffect } from 'react';

export default function BookingForm({ onNext }) {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [form, setForm] = useState({
    userId: userId,
    siteId: '',
    bookSiteVisit: true,
    numberOfAdults: 1,
    numberOfChildren: 0,
    bookShow: false,
    showSlotTime: '10:00 AM',
    showAdults: 0,
    showChildren: 0,
    bookingDate: ''
  });

  const [loginUserId, setLoginUserId] = useState('');

  // Keep userId in sync with localStorage
  useEffect(() => {
    setForm(prev => ({ ...prev, userId }));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: type === 'number' ? parseInt(val) : val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.bookingDate || !form.userId || !form.siteId) {
      alert("Please fill all required fields.");
      return;
    }
    onNext(form);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginUserId.trim() !== '') {
      localStorage.setItem('userId', loginUserId);
      setUserId(loginUserId);
    }
  };

  return (
    <>
      {!userId ? (
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-lg max-w-sm mx-auto mt-20 space-y-4 text-gray-800"
        >
          <h2 className="text-xl font-bold text-center text-indigo-700">🔐 Login to Book Tickets</h2>
          <div>
            <label className="block text-sm font-medium">User ID</label>
            <input
              type="text"
              value={loginUserId}
              onChange={(e) => setLoginUserId(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter your User ID"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto mt-10 space-y-6 text-gray-800"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-800">🎟️ Museum Ticket Booking</h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium">User ID</label>
            <input
              name="userId"
              value={form.userId}
              readOnly
              className="w-full p-2 border rounded-md bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Site ID</label>
            <input
              name="siteId"
              value={form.siteId}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Number of Adults</label>
              <input
                name="numberOfAdults"
                type="number"
                min="0"
                value={form.numberOfAdults}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Number of Children</label>
              <input
                name="numberOfChildren"
                type="number"
                min="0"
                value={form.numberOfChildren}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bookSiteVisit"
              checked={form.bookSiteVisit}
              onChange={handleChange}
            />
            <label className="text-sm">Include Site Visit</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="bookShow"
              checked={form.bookShow}
              onChange={handleChange}
            />
            <label className="text-sm">Include Show</label>
          </div>

          {form.bookShow && (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">Show Slot Time</label>
                <select
                  name="showSlotTime"
                  value={form.showSlotTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>2:00 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Show Adults</label>
                  <input
                    name="showAdults"
                    type="number"
                    min="0"
                    value={form.showAdults}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Show Children</label>
                  <input
                    name="showChildren"
                    type="number"
                    min="0"
                    value={form.showChildren}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium">Booking Date</label>
            <input
              name="bookingDate"
              type="date"
              value={form.bookingDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-4 rounded-md mt-4"
          >
            Continue to Summary
          </button>
        </form>
      )}
    </>
  );
}
