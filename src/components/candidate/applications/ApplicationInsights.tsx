
import React from 'react';
import AIGenerated from '@/components/shared/AIGenerated';

const ApplicationInsights = () => {
  return (
    <AIGenerated>
      <div className="space-y-4">
        <p className="text-sm">Based on your application history:</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Average response time:</span>
            <span className="font-medium">5 days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Interview conversion rate:</span>
            <span className="font-medium">42%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Application success rate:</span>
            <span className="font-medium">14%</span>
          </div>
        </div>
        <div className="pt-4 border-t text-sm">
          <h4 className="font-medium mb-2">Improvement suggestions:</h4>
          <ul className="space-y-1 text-xs">
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Highlight your React testing experience more prominently</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Add quantifiable achievements to your full stack projects</span>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-primary mt-0.5">•</span>
              <span>Consider applying to medium-sized companies for better response rates</span>
            </li>
          </ul>
        </div>
      </div>
    </AIGenerated>
  );
};

export default ApplicationInsights;
