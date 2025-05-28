import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Calendar, TrendingUp, RefreshCw, 
  MapPin, IndianRupee, BarChart3, PieChart, Activity, 
  Filter, Download, Eye, Clock, AlertCircle, X, 
  ChevronUp, ChevronDown, Star, Award, Target
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';

// API Base URL
const API_BASE = 'http://localhost:8080/api/admin/dashboard';

// Sophisticated color palette with slate tones
const colors = {
  primary: '#F59E0B', // Amber
  secondary: '#EF4444', // Red
  success: '#10B981', // Emerald
  info: '#3B82F6', // Blue
  warning: '#F97316', // Orange
  purple: '#8B5CF6', // Violet
  pink: '#EC4899', // Pink
  teal: '#14B8A6', // Teal
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  }
};

const chartColors = [colors.primary, colors.success, colors.info, colors.warning, colors.purple, colors.pink];

// API Service
const apiService = {
  async fetchBookingSummary(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE}/booking-summary?${params}`);
    return response.json();
  },

  async fetchMonthlyBookings(year) {
    const params = year ? `?year=${year}` : '';
    const response = await fetch(`${API_BASE}/monthly-bookings${params}`);
    return response.json();
  },

  async fetchSiteBookingStats(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE}/site-bookings?${params}`);
    return response.json();
  },

  async fetchWeekdayAnalysis(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE}/weekday-analysis?${params}`);
    return response.json();
  },

  async fetchRevenueStats(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await fetch(`${API_BASE}/revenue-stats?${params}`);
    return response.json();
  },

  async fetchYearlyBookings() {
    const response = await fetch(`${API_BASE}/yearly-bookings`);
    return response.json();
  },

  async fetchPendingRefunds() {
    const response = await fetch(`${API_BASE}/pending-refunds`);
    return response.json();
  }
};

// Enhanced Stat Card Component
const StatCard = ({ icon: Icon, title, value, subtitle, trend, color = colors.primary, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative overflow-hidden bg-white rounded-2xl p-6 transition-all duration-300 cursor-pointer transform ${
        isHovered ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg'
      } border border-slate-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 100%)` }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="p-3 rounded-xl shadow-sm"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
          >
            <Icon className="w-8 h-8" style={{ color }} />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
              trend > 0 
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {trend > 0 ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500 leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Chart Card Component
const ChartCard = ({ title, children, icon: Icon, className = "", fullWidth = false }) => (
  <div className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 ${className} ${fullWidth ? 'col-span-full' : ''}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-slate-100">
          <Icon className="w-6 h-6 text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      </div>
      <button className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
        <Download className="w-5 h-5 text-slate-600" />
      </button>
    </div>
    {children}
  </div>
);

// Mini Modal Component
const MiniModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Loading and Error Components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="relative">
      <RefreshCw className="w-12 h-12 animate-spin text-slate-400" />
      <div className="absolute inset-0 rounded-full border-2 border-slate-200 border-t-slate-400 animate-pulse"></div>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center space-y-4 p-8 bg-red-50 border border-red-200 rounded-2xl">
    <AlertCircle className="w-12 h-12 text-red-500" />
    <p className="text-red-700 text-center font-medium">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

const MuseumDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({ isOpen: false, title: '', content: null });
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = dateRange;
      
      const [
        bookingSummary,
        monthlyBookings,
        siteStats,
        weekdayAnalysis,
        revenueStats,
        yearlyBookings,
        pendingRefunds
      ] = await Promise.all([
        apiService.fetchBookingSummary(startDate, endDate),
        apiService.fetchMonthlyBookings(new Date().getFullYear()),
        apiService.fetchSiteBookingStats(startDate, endDate),
        apiService.fetchWeekdayAnalysis(startDate, endDate),
        apiService.fetchRevenueStats(startDate, endDate),
        apiService.fetchYearlyBookings(),
        apiService.fetchPendingRefunds()
      ]);

      setData({
        bookingSummary,
        monthlyBookings,
        siteStats,
        weekdayAnalysis,
        revenueStats,
        yearlyBookings,
        pendingRefunds
      });
    } catch (err) {
      setError('Failed to fetch dashboard data. Please check your connection.');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [dateRange]);

  const formatCurrency = (amount) => `₹${amount?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || 0}`;
  const formatNumber = (num) => num?.toLocaleString('en-IN') || 0;
  const formatPercentage = (num) => `${num?.toFixed(1) || 0}%`;

  const openModal = (title, content) => {
    setModalData({ isOpen: true, title, content });
  };

  const closeModal = () => {
    setModalData({ isOpen: false, title: '', content: null });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <ErrorMessage message={error} onRetry={fetchAllData} />
    </div>
  );

  const { bookingSummary, monthlyBookings, siteStats, weekdayAnalysis, revenueStats } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-800 flex items-center space-x-3">
                <Building2 className="w-10 h-10 text-amber-600" />
                <span>भारतीय संग्रहालय Dashboard</span>
              </h1>
              <p className="text-slate-600 text-lg">Smart Museum Ticketing System Analytics</p>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {new Date().toLocaleTimeString()}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Activity className="w-4 h-4" />
                  <span>Live Data</span>
                </span>
              </div>
            </div>
            
            {/* Enhanced Date Filter */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-2xl shadow-lg border border-slate-200">
              <Filter className="w-5 h-5 text-slate-500" />
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <span className="text-slate-500 font-medium">to</span>
                <input
                  type="date"
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
              <button 
                onClick={fetchAllData}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Bookings"
            value={formatNumber(bookingSummary?.totalBookings)}
            subtitle={`${formatNumber(bookingSummary?.totalAdults)} Adults • ${formatNumber(bookingSummary?.totalChildren)} Children`}
            trend={12.5}
            color={colors.primary}
            onClick={() => openModal('Booking Details', 
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 text-sm">Adults</p>
                    <p className="text-2xl font-bold text-slate-800">{formatNumber(bookingSummary?.totalAdults)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600 text-sm">Children</p>
                    <p className="text-2xl font-bold text-slate-800">{formatNumber(bookingSummary?.totalChildren)}</p>
                  </div>
                </div>
              </div>
            )}
          />
          <StatCard
            icon={IndianRupee}
            title="Total Revenue"
            value={formatCurrency(bookingSummary?.totalRevenue)}
            subtitle={`Net Revenue: ${formatCurrency(revenueStats?.netRevenue)}`}
            trend={8.3}
            color={colors.success}
            onClick={() => openModal('Revenue Breakdown',
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Site Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueStats?.siteRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Show Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueStats?.showRevenue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-slate-600 font-medium">Total Revenue</span>
                    <span className="font-bold text-lg">{formatCurrency(revenueStats?.totalRevenue)}</span>
                  </div>
                </div>
              </div>
            )}
          />
          <StatCard
            icon={Building2}
            title="Site Bookings"
            value={formatNumber(bookingSummary?.siteBookings)}
            subtitle={`${formatNumber(bookingSummary?.showBookings)} Show Bookings`}
            trend={15.7}
            color={colors.info}
          />
          <StatCard
            icon={AlertCircle}
            title="Cancelled Tickets"
            value={formatNumber(bookingSummary?.cancelledBookings)}
            subtitle={`Refund Amount: ${formatCurrency(bookingSummary?.refundAmount)}`}
            trend={-5.2}
            color={colors.secondary}
          />
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Monthly Bookings Trend */}
          <ChartCard title="Monthly Bookings Trend" icon={TrendingUp}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyBookings} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="siteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.info} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={colors.info} stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.slate[300]} />
                  <XAxis dataKey="month" stroke={colors.slate[600]} />
                  <YAxis stroke={colors.slate[600]} />
                  <Tooltip 
                    formatter={(value, name) => [formatNumber(value), name]}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: `1px solid ${colors.slate[300]}`,
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="totalBookings" 
                    stroke={colors.primary} 
                    strokeWidth={3}
                    fill="url(#totalGradient)" 
                    name="Total Bookings" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="siteBookings" 
                    stroke={colors.info} 
                    strokeWidth={2}
                    fill="url(#siteGradient)" 
                    name="Site Bookings" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Revenue Distribution */}
          <ChartCard title="Revenue Distribution" icon={PieChart}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Site Revenue', value: revenueStats?.siteRevenue || 0, color: colors.primary },
                      { name: 'Show Revenue', value: revenueStats?.showRevenue || 0, color: colors.info }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    labelLine={false}
                  >
                    {[colors.primary, colors.info].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value)]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Top Performing Sites */}
          <ChartCard title="Top Performing Sites" icon={Star}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={siteStats?.slice(0, 6)} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.slate[300]} />
                  <XAxis 
                    dataKey="siteName" 
                    stroke={colors.slate[600]}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke={colors.slate[600]} />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value), 'Total Bookings']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: `1px solid ${colors.slate[300]}`,
                      borderRadius: '12px' 
                    }}
                  />
                  <Bar 
                    dataKey="totalBookings" 
                    fill={colors.primary}
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Weekday Analysis */}
          <ChartCard title="Visitor Pattern by Day" icon={Calendar}>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weekdayAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.slate[300]} />
                  <XAxis dataKey="dayOfWeek" stroke={colors.slate[600]} />
                  <YAxis stroke={colors.slate[600]} />
                  <Tooltip 
                    formatter={(value) => [formatNumber(value), 'Bookings']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: `1px solid ${colors.slate[300]}`,
                      borderRadius: '12px' 
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke={colors.info} 
                    strokeWidth={4}
                    dot={{ fill: colors.info, strokeWidth: 2, r: 8 }}
                    activeDot={{ r: 10, stroke: colors.info, strokeWidth: 2, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200">
            <span className="text-2xl">🇮🇳</span>
            <p className="text-slate-600 font-medium">Smart Museum Ticketing System - Preserving India's Heritage</p>
          </div>
        </div>
      </div>

      {/* Mini Modal */}
      <MiniModal 
        isOpen={modalData.isOpen} 
        onClose={closeModal} 
        title={modalData.title}
      >
        {modalData.content}
      </MiniModal>
    </div>
  );
};

export default MuseumDashboard;