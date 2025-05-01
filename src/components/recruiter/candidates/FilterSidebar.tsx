
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft } from "lucide-react";

interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClose: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  searchQuery,
  setSearchQuery,
  onClose,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center">
        <CardTitle className="text-base">Filter</CardTitle>
        <Button variant="ghost" size="sm" className="ml-auto" onClick={onClose}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Keywords
              <ChevronDown className="h-4 w-4" />
            </h3>
            <Input 
              placeholder="Search keywords in profile" 
              className="w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Notice Period
              <ChevronDown className="h-4 w-4" />
            </h3>
            <div className="flex items-center space-x-2">
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option>Min</option>
                {[7, 15, 30, 60, 90].map(days => (
                  <option key={days} value={days}>{days} days</option>
                ))}
              </select>
              <span>-</span>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option>Max</option>
                {[15, 30, 60, 90, 180].map(days => (
                  <option key={days} value={days}>{days} days</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex items-center">
              <input type="checkbox" id="noNotice" className="mr-2" />
              <label htmlFor="noNotice" className="text-sm">Include candidates with no notice period</label>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Current Location
              <ChevronDown className="h-4 w-4" />
            </h3>
            <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
              <option value="">Select Location</option>
              <option value="remote">Remote</option>
              <option value="us">United States</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
            </select>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Experience
              <ChevronDown className="h-4 w-4" />
            </h3>
            <div className="flex items-center space-x-2">
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option>Min</option>
                {[0, 1, 2, 3, 5, 7].map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
              <span>-</span>
              <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                <option>Max</option>
                {[1, 3, 5, 8, 10, 15].map(years => (
                  <option key={years} value={years}>{years} years</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex items-center">
              <input type="checkbox" id="includeFreshers" className="mr-2" />
              <label htmlFor="includeFreshers" className="text-sm">Include freshers</label>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Created Date Range
              <ChevronDown className="h-4 w-4" />
            </h3>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center justify-between">
              Education
              <ChevronDown className="h-4 w-4" />
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
