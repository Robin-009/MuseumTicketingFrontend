import axios from "axios";

const API_BASE = "http://localhost:8080/api/admin/dashboard";

export const getBookingSummary = (params) => axios.get(`${API_BASE}/booking-summary`, { params });
export const getSiteBookings = (params) => axios.get(`${API_BASE}/site-bookings`, { params });
export const getMonthlyBookings = (year) => axios.get(`${API_BASE}/monthly-bookings`, { params: { year } });
export const getYearlyBookings = () => axios.get(`${API_BASE}/yearly-bookings`);
export const getWeekdayAnalysis = (params) => axios.get(`${API_BASE}/weekday-analysis`, { params });
export const getCancelledTickets = (params) => axios.get(`${API_BASE}/cancelled-tickets`, { params });
export const getPendingRefunds = () => axios.get(`${API_BASE}/pending-refunds`);
export const processRefund = (ticketId) => axios.post(`${API_BASE}/process-refund/${ticketId}`);
export const getRevenueStats = (params) => axios.get(`${API_BASE}/revenue-stats`, { params });
export const getAllCities = () => axios.get(`${API_BASE}/site-cities`);
export const getAllStates = () => axios.get(`${API_BASE}/site-states`);
export const getAllSites = (params) => axios.get(`${API_BASE}/sites`, { params });
