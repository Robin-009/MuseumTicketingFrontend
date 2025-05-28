import { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer
} from 'recharts';

const RefundsPage = () => {
  const [pendingRefunds, setPendingRefunds] = useState([]);
  const [cancelledTickets, setCancelledTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [refundRes, cancelRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/dashboard/pending-refunds'),
        fetch('http://localhost:8080/api/admin/dashboard/cancelled-tickets')
      ]);

      const refundData = await refundRes.json();
      const cancelData = await cancelRes.json();

      setPendingRefunds(Array.isArray(refundData) ? refundData : []);
      setCancelledTickets(Array.isArray(cancelData) ? cancelData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const refundedTickets = Array.isArray(cancelledTickets)
    ? cancelledTickets.filter(ticket => ticket.refundStatus === 'REFUNDED')
    : [];

  const pieData = [
    { name: 'Pending Refunds', value: pendingRefunds.length },
    { name: 'Refunded Tickets', value: refundedTickets.length }
  ];

  const COLORS = ['#FF8042', '#00C49F'];

  const refundAmountBySite = Array.isArray(pendingRefunds)
    ? pendingRefunds.reduce((acc, ticket) => {
        acc[ticket.siteName] = (acc[ticket.siteName] || 0) + ticket.totalAmount;
        return acc;
      }, {})
    : {};

  const barData = Object.entries(refundAmountBySite).map(([site, amount]) => ({
    site,
    amount
  }));

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">Refund & Cancellation Overview</h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      {loading ? (
        <p className="text-center text-gray-600">Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Pie Chart */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-lg font-semibold mb-3 text-center">Refund Summary</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-lg font-semibold mb-3 text-center">Refund Amount by Site</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <XAxis dataKey="site" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#82ca9d" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Refunds Table */}
          <div className="bg-white p-5 rounded shadow mb-10 overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Pending Refunds</h2>
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">Ticket ID</th>
                  <th className="p-2">User Name</th>
                  <th className="p-2">Site</th>
                  <th className="p-2">Booking Date</th>
                  <th className="p-2">Cancelled At</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingRefunds.map(ticket => (
                  <tr key={ticket.ticketId} className="border-b">
                    <td className="p-2">{ticket.ticketId}</td>
                    <td className="p-2">{ticket.userName}</td>
                    <td className="p-2">{ticket.siteName}</td>
                    <td className="p-2">{ticket.bookingDate}</td>
                    <td className="p-2">{ticket.cancelledAt}</td>
                    <td className="p-2">₹{ticket.totalAmount.toFixed(2)}</td>
                    <td className="p-2">{ticket.refundStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Refunded Tickets Table */}
          <div className="bg-white p-5 rounded shadow overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4">Refunded Tickets</h2>
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">Ticket ID</th>
                  <th className="p-2">User Name</th>
                  <th className="p-2">Site</th>
                  <th className="p-2">Booking Date</th>
                  <th className="p-2">Cancelled At</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {refundedTickets.map(ticket => (
                  <tr key={ticket.ticketId} className="border-b">
                    <td className="p-2">{ticket.ticketId}</td>
                    <td className="p-2">{ticket.userName}</td>
                    <td className="p-2">{ticket.siteName}</td>
                    <td className="p-2">{ticket.bookingDate}</td>
                    <td className="p-2">{ticket.cancelledAt}</td>
                    <td className="p-2">₹{ticket.totalAmount.toFixed(2)}</td>
                    <td className="p-2">{ticket.refundStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RefundsPage;
