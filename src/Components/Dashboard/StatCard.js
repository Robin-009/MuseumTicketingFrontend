// src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-white shadow-md p-4 rounded-2xl border-l-4 ${color} flex items-center gap-4`}>
    <Icon className="w-8 h-8" />
    <div>
      <h4 className="text-sm font-medium text-gray-600">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default StatCard;
