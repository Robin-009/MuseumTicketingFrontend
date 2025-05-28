import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const CancelledTickets = () => {
  const [cancelledData, setCancelledData] = useState([]);
  const [siteWiseCounts, setSiteWiseCounts] = useState([]);
  const [monthlyCounts, setMonthlyCounts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/dashboard/cancelled-tickets').then((res) => {
      const data = res.data;
      setCancelledData(data);

      // Site-wise counts
      const siteMap = {};
      data.forEach((item) => {
        siteMap[item.siteName] = (siteMap[item.siteName] || 0) + 1;
      });
      const siteChartData = Object.entries(siteMap).map(([site, count]) => ({
        name: site,
        count,
      }));
      setSiteWiseCounts(siteChartData);

      // Month-wise counts
      const monthMap = {};
      data.forEach((item) => {
        const month = new Date(item.cancelledAt).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        monthMap[month] = (monthMap[month] || 0) + 1;
      });
      const monthChartData = Object.entries(monthMap).map(([month, count]) => ({
        month,
        count,
      }));
      setMonthlyCounts(monthChartData);
    });
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800">📉 Cancelled Tickets Overview</h1>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site-wise Cancellations */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Cancellations by Site</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siteWiseCounts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Cancellations */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Cancellations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCounts}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#F87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cancelled Tickets Table */}
      <div className="bg-white shadow-md rounded-2xl p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Cancelled Tickets Details</h2>
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Ticket ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Site</th>
              <th className="px-4 py-2 border">Booking Date</th>
              <th className="px-4 py-2 border">Cancelled At</th>
              <th className="px-4 py-2 border">Reason</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Refund</th>
            </tr>
          </thead>
          <tbody>
            {cancelledData.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                  No cancelled tickets available.
                </td>
              </tr>
            ) : (
              cancelledData.map((item) => (
                <tr key={item.ticketId} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">{item.ticketId}</td>
                  <td className="px-4 py-2">{item.userName}</td>
                  <td className="px-4 py-2">{item.userEmail}</td>
                  <td className="px-4 py-2">{item.siteName}</td>
                  <td className="px-4 py-2">{item.bookingDate}</td>
                  <td className="px-4 py-2">{new Date(item.cancelledAt).toLocaleString()}</td>
                  <td className="px-4 py-2">{item.cancellationReason}</td>
                  <td className="px-4 py-2">₹{item.totalAmount}</td>
                  <td className="px-4 py-2">{item.refundStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CancelledTickets;
