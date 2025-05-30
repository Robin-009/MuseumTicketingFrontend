import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MuseumLandingPage from "./Components/LandingPageNew";
import HomePage from "./Components/LandingPage1";
import Signup from "./Components/Auth/SignUp";
import VerifyOtp from "./Components/Auth/VerifyOtp";
import Login from "./Components/Auth/Login";
import MuseumDashboard from "./pages/Dashboard";
import Visit from "./Components/LandingPageNew";
import Navbar from './Components/Navbar'
import BookingForm from "./Components/TicketBookingPage";
import Dashboard from "./pages/DashboardNew";
import DashboardHome from "./pages/DashboardNew";
import Sites from "./Components/Dashboard/Sites";
import RefundsPage from "./Components/Dashboard/RefundedTickets";
import CancelledTickets from "./Components/Dashboard/CancelledTicket";
import MuseumAuth from "./Components/Auth/Login";

function App() {
  const [email, setEmail] = useState(""); // To pass email from Signup to OTP

  return (
    <Router>
      <div className="min-h-screen flex">
        <Navbar/>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/book" element={<BookingForm />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/refunds" element={<RefundsPage />} />
            <Route path="/cancelticket" element={<CancelledTickets />} />
            <Route path="/auth" element={<MuseumAuth />} />


            {/* ✅ Auth Routes */}
            <Route path="/signup" element={<Signup setEmail={setEmail} />} />
            <Route path="/verify-otp" element={<VerifyOtp email={email} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>




      {/* <div className="min-h-screen flex">
        {/* Sidebar 
        <nav className="w-64 bg-gray-800 text-white p-5 flex flex-col">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          <Link className="mb-4 hover:text-gray-300" to="/">Dashboard</Link>
          <Link className="mb-4 hover:text-gray-300" to="/sites">Sites</Link>
          <Link className="mb-4 hover:text-gray-300" to="/cancelled-tickets">Cancelled Tickets</Link>
          <Link className="mb-4 hover:text-gray-300" to="/refunds">Refunds</Link>
        </nav> 

        {/* Main content 
        <main className="flex-1 p-6 bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/cancelled-tickets" element={<CancelledTickets />} />
            <Route path="/refunds" element={<Refunds />} />
          </Routes> 
        </main>
      </div>*/}
    </Router>
  );
}

export default App;
