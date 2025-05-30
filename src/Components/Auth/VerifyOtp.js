// components/VerifyOtp.jsx
import React, { useState } from "react";
import axios from "axios";

const VerifyOtp = ({ email, setStage }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
        params: { email, otp },
      });
      setStage("login");
    } catch (err) {
      setError("OTP verification failed. Please try again.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Verify OTP
      </h2>
      {error && (
        <p className="text-sm text-red-600 text-center mb-2">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter OTP"
          required
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
