
import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CareersHeroProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const CareersHero: React.FC<CareersHeroProps> = ({
  searchTerm,
  setSearchTerm,
  location,
  setLocation,
  category,
  setCategory
}) => {
  return (
    <section className="bg-gradient-to-r from-[#EFF6FF] to-[#F5F8FF] py-16">
      <div className="container text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Browse through our curated selection of top opportunities and take the next step in your career journey.
        </p>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-2 flex flex-col md:flex-row gap-2">
          <div className="flex-grow flex items-center gap-2 bg-background rounded-md px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Job title, keyword, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          </div>
          <div className="flex gap-2">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Location" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Locations</SelectItem>
                <SelectItem value="Remote">Remote</SelectItem>
                <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                <SelectItem value="New York">New York, NY</SelectItem>
                <SelectItem value="Austin">Austin, TX</SelectItem>
                <SelectItem value="Chicago">Chicago, IL</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="bg-[#3054A5] hover:bg-[#264785]">Search</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareersHero;
