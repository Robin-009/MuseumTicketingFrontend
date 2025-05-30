import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const DashboardHome = () => {
  const [revenueStats, setRevenueStats] = useState(null);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [yearlyBookings, setYearlyBookings] = useState([]);
  const [siteBookings, setSiteBookings] = useState([]);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [sites, setSites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [revenueRes, monthlyRes, yearlyRes, siteRes, summaryRes, sitesRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/revenue-stats`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/monthly-bookings`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/yearly-bookings`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/site-bookings`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/booking-summary`),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/dashboard/sites`),
        ]);

        setRevenueStats(revenueRes.data);
        setMonthlyBookings(monthlyRes.data);
        setYearlyBookings(yearlyRes.data);
        setSiteBookings(siteRes.data);
        setBookingSummary(summaryRes.data);
        setSites(sitesRes.data);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {revenueStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold">₹{revenueStats.totalRevenue}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Refund Amount</p>
            <p className="text-2xl font-semibold">₹{revenueStats.refundAmount}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Net Revenue</p>
            <p className="text-2xl font-semibold">₹{revenueStats.netRevenue}</p>
          </div>
        </div>
      )}

      {bookingSummary && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Booking Summary</h2>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <li>Total Bookings: <strong>{bookingSummary.totalBookings}</strong></li>
            <li>Adults: <strong>{bookingSummary.totalAdults}</strong></li>
            <li>Children: <strong>{bookingSummary.totalChildren}</strong></li>
            <li>Site Bookings: <strong>{bookingSummary.siteBookings}</strong></li>
            <li>Show Bookings: <strong>{bookingSummary.showBookings}</strong></li>
            <li>Cancelled: <strong>{bookingSummary.cancelledBookings}</strong></li>
            <li>Refunded Amount: <strong>₹{bookingSummary.refundAmount}</strong></li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Bookings Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Monthly Bookings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="siteBookings" fill="#3B82F6" name="Site Bookings" />
              <Bar dataKey="showBookings" fill="#F59E0B" name="Show Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Revenue Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Yearly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyBookings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Site-wise Bookings Pie Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Bookings by Site</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={siteBookings}
              dataKey="bookings"
              nameKey="siteName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {siteBookings.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Site List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">All Museum Sites</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          {sites.map((site) => (
            <li key={site.id} className="p-3 border rounded">
              <p className="font-semibold">{site.name} ({site.city})</p>
              <p>Fare: ₹{site.adultFare} / ₹{site.childFare}</p>
              <p>Timings: {site.openingTime} - {site.closingTime}</p>
              <p>Open: {site.openingDays?.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
