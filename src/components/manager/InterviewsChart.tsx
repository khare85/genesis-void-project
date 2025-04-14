
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
  Legend 
} from "recharts";

interface InterviewData {
  month: string;
  completed: number;
  scheduled: number;
  canceled: number;
}

interface InterviewsChartProps {
  data: InterviewData[];
}

const InterviewsChart: React.FC<InterviewsChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          scheduled: { label: 'Scheduled', color: '#9b87f5' },
          completed: { label: 'Completed', color: '#22c55e' },
          canceled: { label: 'Canceled', color: '#ef4444' },
        }}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="scheduled"
            stroke="#9b87f5"
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#22c55e"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="canceled"
            stroke="#ef4444"
            strokeWidth={2}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default InterviewsChart;
