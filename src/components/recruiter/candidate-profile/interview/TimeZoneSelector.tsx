
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface TimeZoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

// List of common time zones
const timeZones = [
  "America/New_York", // Eastern Time
  "America/Chicago", // Central Time
  "America/Denver", // Mountain Time
  "America/Los_Angeles", // Pacific Time
  "America/Anchorage", // Alaska Time
  "Pacific/Honolulu", // Hawaii Time
  "Europe/London", // GMT
  "Europe/Paris", // Central European Time
  "Europe/Athens", // Eastern European Time
  "Asia/Dubai", // Gulf Standard Time
  "Asia/Kolkata", // Indian Standard Time
  "Asia/Shanghai", // China Standard Time
  "Asia/Tokyo", // Japan Standard Time
  "Australia/Sydney", // Australian Eastern Time
  "Pacific/Auckland", // New Zealand Standard Time
];

// Format time zone for display
const formatTimeZone = (timeZone: string) => {
  try {
    const now = new Date();
    const timeZoneName = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'short' }).format(now);
    const offset = new Intl.DateTimeFormat('en', { timeZone, timeZoneName: 'longOffset' }).formatToParts(now)
      .find(part => part.type === 'timeZoneName')?.value || '';
    return `${timeZone.replace(/_/g, ' ')} (${offset})`;
  } catch (e) {
    return timeZone;
  }
};

export const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label className="flex items-center" htmlFor="timeZone">
        <Globe className="mr-2 h-4 w-4" />
        Time Zone
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select time zone" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {timeZones.map((tz) => (
            <SelectItem key={tz} value={tz}>
              {formatTimeZone(tz)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
