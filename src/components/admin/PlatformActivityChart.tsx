
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for platform activity
const activityData = [
  { date: 'Jan', userLogins: 1200, jobsPosted: 145, applicationsSubmitted: 3200, interviewsScheduled: 890 },
  { date: 'Feb', userLogins: 1800, jobsPosted: 167, applicationsSubmitted: 3800, interviewsScheduled: 1010 },
  { date: 'Mar', userLogins: 1600, jobsPosted: 159, applicationsSubmitted: 3500, interviewsScheduled: 940 },
  { date: 'Apr', userLogins: 2200, jobsPosted: 185, applicationsSubmitted: 4200, interviewsScheduled: 1250 },
  { date: 'May', userLogins: 2400, jobsPosted: 215, applicationsSubmitted: 4800, interviewsScheduled: 1380 },
  { date: 'Jun', userLogins: 2100, jobsPosted: 190, applicationsSubmitted: 4500, interviewsScheduled: 1280 },
  { date: 'Jul', userLogins: 2800, jobsPosted: 230, applicationsSubmitted: 5200, interviewsScheduled: 1520 },
];

interface PlatformActivityChartProps {
  type?: 'usage' | 'companies' | 'revenue';
}

const PlatformActivityChart = ({ type = 'usage' }: PlatformActivityChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'usage':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="userLogins" name="User Logins" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="applicationsSubmitted" name="Applications" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="interviewsScheduled" name="Interviews" stroke="#f97316" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'companies':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="jobsPosted" name="Jobs Posted" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'revenue':
        // Mock revenue data
        const revenueData = activityData.map(item => ({
          ...item,
          revenue: item.userLogins * 2.5 + item.jobsPosted * 50
        }));
        
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-64">
      {renderChart()}
    </div>
  );
};

export default PlatformActivityChart;
