
import React from "react";
import { Calendar, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnalyticsFiltersProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  department: string;
  setDepartment: (value: string) => void;
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({ 
  dateRange, 
  setDateRange, 
  department, 
  setDepartment 
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[160px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">This Quarter</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={department} onValueChange={setDepartment}>
        <SelectTrigger className="w-[160px]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Department</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Departments</SelectItem>
          <SelectItem value="engineering">Engineering</SelectItem>
          <SelectItem value="product">Product</SelectItem>
          <SelectItem value="design">Design</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
          <SelectItem value="sales">Sales</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AnalyticsFilters;
