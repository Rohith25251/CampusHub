import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  bgColor = 'bg-blue-50',
  iconColor = 'text-blue-600'
}) => {
  const isPositive = trend === 'up';

  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`${iconColor} bg-white rounded-lg p-3`}>
          <Icon size={24} />
        </div>
      </div>

      {trend && trendValue && (
        <div className="flex items-center gap-2 text-sm">
          {isPositive ? (
            <>
              <TrendingUp size={16} className="text-green-600" />
              <span className="text-green-600 font-semibold">{trendValue}% up</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-600" />
              <span className="text-red-600 font-semibold">{trendValue}% down</span>
            </>
          )}
          <span className="text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};
