
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
  CartesianGrid
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
    <div className="h-[250px]">
      <ChartContainer
        config={{
          days: { label: 'Days', color: '#9b87f5' }
        }}
      >
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="position" type="category" width={120} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="days" fill="#9b87f5" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TimeToHireChart;
