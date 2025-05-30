import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line,
} from 'recharts';

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard`;

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [filters, setFilters] = useState({ name: '', city: '', state: '' });
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [weekdayData, setWeekdayData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [allWeekdayAnalysis, setAllWeekdayAnalysis] = useState([]);
  const [allMonthlyBookings, setAllMonthlyBookings] = useState([]);

  useEffect(() => {
    fetchCities();
    fetchStates();
    fetchWeekdayAnalysis();
    fetchMonthlyBookings();
  }, []);

  useEffect(() => {
    fetchSites();
  }, [filters]);

  // Helper to build query params string
  const buildQueryString = (params) => {
    const esc = encodeURIComponent;
    return Object.keys(params)
      .filter(k => params[k])
      .map(k => esc(k) + '=' + esc(params[k]))
      .join('&');
  };

  async function fetchSites() {
    try {
      const query = buildQueryString(filters);
      const url = `${API_BASE_URL}/sites${query ? `?${query}` : ''}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response was not ok');

      const sitesData = await res.json();

      // Fetch bookings separately
      const bookingsRes = await fetch(`${API_BASE_URL}/site-bookings`);
      if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
      const bookingData = await bookingsRes.json();

      const bookingMap = {};
      bookingData.forEach(stat => {
        bookingMap[stat.siteId] = stat.totalBookings || 0;
      });

      const enrichedSites = sitesData.map(site => ({
        ...site,
        totalBookings: bookingMap[site.siteId] || 0,
      }));

      setSites(enrichedSites);
    } catch (err) {
      console.error('Error fetching sites:', err);
    }
  }

  async function fetchCities() {
    try {
      const res = await fetch(`${API_BASE_URL}/site-cities`);
      if (!res.ok) throw new Error('Failed to fetch cities');
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  }

  async function fetchStates() {
    try {
      const res = await fetch(`${API_BASE_URL}/site-states`);
      if (!res.ok) throw new Error('Failed to fetch states');
      const data = await res.json();
      setStates(data);
    } catch (err) {
      console.error('Error fetching states:', err);
    }
  }

  async function fetchWeekdayAnalysis() {
    try {
      const res = await fetch(`${API_BASE_URL}/weekday-analysis`);
      if (!res.ok) throw new Error('Failed to fetch weekday analysis');
      const data = await res.json();
      setAllWeekdayAnalysis(data);
    } catch (err) {
      console.error('Error fetching weekday analysis:', err);
    }
  }

  async function fetchMonthlyBookings() {
    try {
      const res = await fetch(`${API_BASE_URL}/monthly-bookings`);
      if (!res.ok) throw new Error('Failed to fetch monthly bookings');
      const data = await res.json();
      setAllMonthlyBookings(data);
    } catch (err) {
      console.error('Error fetching monthly bookings:', err);
    }
  }

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSiteDetails = (siteId) => {
    const site = sites.find(s => s.siteId === siteId);
    if (!site) return;

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const siteWeekdayData = weekdays.map((day, index) => {
      const found = allWeekdayAnalysis.find(w => w.siteId === siteId && w.dayNumber === index);
      return {
        day,
        bookings: found ? found.bookings : 0,
      };
    });

    const siteMonthlyData = allMonthlyBookings
      .filter(m => m.siteId === siteId)
      .sort((a, b) => a.monthNumber - b.monthNumber);

    setSelectedSite(site);
    setWeekdayData(siteWeekdayData);
    setMonthlyData(siteMonthlyData);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Museum Sites</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          name="name"
          placeholder="Site Name"
          value={filters.name}
          onChange={handleInputChange}
          className="border p-2 rounded flex-1"
        />
        <select
          name="city"
          value={filters.city}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <select
          name="state"
          value={filters.state}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">All States</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">Site ID</th>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">City</th>
            <th className="py-2 px-4">State</th>
            <th className="py-2 px-4">Total Bookings</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {sites.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No sites found.</td>
            </tr>
          ) : (
            sites.map(site => (
              <tr key={site.siteId} className="hover:bg-gray-50">
                <td className="py-2 px-4">{site.siteId}</td>
                <td className="py-2 px-4">{site.name}</td>
                <td className="py-2 px-4">{site.city}</td>
                <td className="py-2 px-4">{site.state}</td>
                <td className="py-2 px-4">{site.totalBookings}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleSiteDetails(site.siteId)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {selectedSite && (
        <div className="mt-10 p-6 bg-gray-50 rounded shadow">
          <h3 className="text-2xl font-semibold mb-4">{selectedSite.name} - Booking Insights</h3>

          <div className="mb-8">
            <h4 className="font-medium mb-2">Weekday Bookings</h4>
            <BarChart width={600} height={300} data={weekdayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" />
            </BarChart>
          </div>

          <div>
            <h4 className="font-medium mb-2">Monthly Bookings</h4>
            <LineChart width={700} height={300} data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalBookings" stroke="#82ca9d" name="Total Bookings" />
              <Line type="monotone" dataKey="siteBookings" stroke="#8884d8" name="Site Bookings" />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sites;
