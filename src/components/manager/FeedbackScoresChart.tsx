
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

interface FeedbackScore {
  category: string;
  score: number;
}

interface FeedbackScoresChartProps {
  data: FeedbackScore[];
}

const FeedbackScoresChart: React.FC<FeedbackScoresChartProps> = ({ data }) => {
  return (
    <div className="h-[300px]">
      <ChartContainer
        config={{
          score: { label: 'Score', color: '#9b87f5' }
        }}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" />
          <YAxis domain={[0, 5]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="score" fill="#9b87f5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default FeedbackScoresChart;
