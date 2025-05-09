import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StatCards from "./StatCards";
import InterviewsChart from "@/components/manager/InterviewsChart";
import FeedbackScoresChart from "@/components/manager/FeedbackScoresChart";
import TimeToHireChart from "@/components/manager/TimeToHireChart";
interface OverviewTabContentProps {
  interviewsData: any[];
  feedbackScoresData: any[];
  timeToHireData: any[];
}
const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  interviewsData,
  feedbackScoresData,
  timeToHireData
}) => {
  return <div className="bg-white">
      <StatCards />

      <div className="grid gap-6 md:grid-cols-2 mx-0 my-[16px] bg-white">
        <Card>
          <CardHeader>
            <CardTitle>Interviews Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <InterviewsChart data={interviewsData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Feedback Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <FeedbackScoresChart data={feedbackScoresData} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time to Hire by Position</CardTitle>
        </CardHeader>
        <CardContent className="pb-6">
          <TimeToHireChart data={timeToHireData} />
        </CardContent>
      </Card>
    </div>;
};
export default OverviewTabContent;