
import React from "react";
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid,
  ResponsiveContainer
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
    <div className="h-[200px] w-full">
      <ChartContainer
        config={{
          days: { label: 'Days', color: '#9b87f5' }
        }}
      >
        <BarChart 
          data={data} 
          layout="vertical" 
          margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis 
            dataKey="position" 
            type="category" 
            width={100}
            tick={{ fontSize: 11 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar 
            dataKey="days" 
            fill="#9b87f5" 
            radius={[0, 4, 4, 0]}
            barSize={12} 
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TimeToHireChart;
