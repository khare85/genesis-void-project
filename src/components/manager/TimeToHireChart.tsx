
import React from "react";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface TimeToHireData {
  position: string;
  days: number;
}

interface TimeToHireChartProps {
  data: TimeToHireData[];
}

const TimeToHireChart: React.FC<TimeToHireChartProps> = ({ data }) => {
  return (
    <div className="h-[210px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="position" 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{ 
              value: 'Days', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#666' } 
            }}
          />
          <Tooltip 
            formatter={(value) => [`${value} days`, 'Time to Hire']}
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="days" 
            stroke="#9b87f5" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#9b87f5' }}
            activeDot={{ r: 6, fill: '#9b87f5' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeToHireChart;
