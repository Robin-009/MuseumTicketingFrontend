import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Building2, Shield, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const MuseumAuth = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [otpTimer, setOtpTimer] = useState(0);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otpForm, setOtpForm] = useState({ email: '', otp: '' });

  // Validation states
  const [errors, setErrors] = useState({});

  // Start OTP timer
  React.useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  const validateEmail = (email) => {
    const gmailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (form, type) => {
    const newErrors = {};
    
    if (type === 'login') {
      if (!form.email) newErrors.email = 'Email is required';
      else if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid Gmail address';
      if (!form.password) newErrors.password = 'Password is required';
    }
    
    if (type === 'signup') {
      if (!form.name) newErrors.name = 'Name is required';
      if (!form.email) newErrors.email = 'Email is required';
      else if (!validateEmail(form.email)) newErrors.email = 'Please enter a valid Gmail address';
      if (!form.phone) newErrors.phone = 'Phone number is required';
      else if (!validatePhone(form.phone)) newErrors.phone = 'Please enter a valid Indian phone number';
      if (!form.password) newErrors.password = 'Password is required';
      else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (type === 'otp') {
      if (!form.email) newErrors.email = 'Email is required';
      if (!form.otp) newErrors.otp = 'OTP is required';
      else if (!/^\d{6}$/.test(form.otp)) newErrors.otp = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const handleLogin = async () => {
    if (!validateForm(loginForm, 'login')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      if (data.success) {
        showMessage(data.message, 'success');
        // Redirect to dashboard or home page
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Login failed. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    if (!validateForm(signupForm, 'signup')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });
      
      const data = await response.json();
      if (data.success) {
        setOtpForm({ ...otpForm, email: signupForm.email });
        setCurrentView('otp');
        setOtpTimer(300); // 5 minutes
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Registration failed. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleOtpVerification = async () => {
    if (!validateForm(otpForm, 'otp')) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(otpForm)
      });
      
      const data = await response.json();
      if (data.success) {
        showMessage(data.message, 'success');
        setTimeout(() => setCurrentView('login'), 2000);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('OTP verification failed. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/resend-otp?email=${otpForm.email}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      if (data.success) {
        setOtpTimer(300);
        showMessage(data.message, 'success');
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('Failed to resend OTP. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Heritage Museum</h1>
          <p className="text-gray-600">Discover History, Create Memories</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Auth Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          {/* Login Form */}
          {currentView === 'login' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to book your museum experience</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your Gmail address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setCurrentView('signup')}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Signup Form */}
          {currentView === 'signup' && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
                <p className="text-gray-600 mt-2">Join us for an amazing cultural journey</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your Gmail address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={signupForm.phone}
                      onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter 10-digit phone number"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Create a password (min 6 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {currentView === 'otp' && (
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Verify Your Email</h2>
                <p className="text-gray-600 mt-2">
                  We've sent a verification code to<br/>
                  <span className="font-semibold text-gray-800">{otpForm.email}</span>
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={otpForm.otp}
                      onChange={(e) => setOtpForm({...otpForm, otp: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      className={`w-full px-4 py-3 border rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="000000"
                      maxLength="6"
                    />
                  </div>
                  {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                </div>

                {otpTimer > 0 && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Code expires in {formatTime(otpTimer)}</span>
                  </div>
                )}

                <button
                  onClick={handleOtpVerification}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={otpTimer > 0 || isLoading}
                      className="text-orange-600 hover:text-orange-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend Code
                    </button>
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setCurrentView('signup')}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 Heritage Museum. All rights reserved.</p>
          <p className="mt-1">Secure authentication powered by advanced encryption</p>
        </div>
      </div>
    </div>
  );
};

export default MuseumAuth;