import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useLawyers, useCreateConsultation } from '@/hooks/useLawyers';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { StarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthModal } from '@/components/auth/AuthModal';

interface LawyerFilters {
  specialization?: string;
  experience?: number;
  availability?: string;
  priceRange?: {
    min: number;
    max: number;
  };
}

interface LawyerFinderProps {
  isLoading?: boolean;
}

export function LawyerFinder({ isLoading: propLoading }: LawyerFinderProps) {
  const [filters, setFilters] = useState<LawyerFilters>({
    priceRange: { min: 0, max: 500 }
  });
  const [priceValue, setPriceValue] = useState<number[]>([200]);
  const [currentPage, setCurrentPage] = useState(1);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const { data: lawyers, isLoading } = useLawyers(filters);
  const createConsultation = useCreateConsultation();
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  
  const lawyersPerPage = 5;
  const totalPages = lawyers ? Math.ceil(lawyers.length / lawyersPerPage) : 0;
  
  const applyFilters = () => {
    setFilters({
      ...filters,
      priceRange: { min: 0, max: priceValue[0] }
    });
    setCurrentPage(1);
  };
  
  const handleScheduleConsultation = async (lawyerId: number, ratePerHour: number) => {
    if (!isLoggedIn) {
      setAuthModalOpen(true);
      return;
    }
    
    try {
      // Current date + 3 days
      const scheduleDateInFuture = new Date();
      scheduleDateInFuture.setDate(scheduleDateInFuture.getDate() + 3);
      
      await createConsultation.mutateAsync({
        clientId: user?.id,
        lawyerId: lawyerId,
        scheduleDate: scheduleDateInFuture.toISOString(),
        duration: 60, // 1 hour
        fee: ratePerHour,
        status: 'scheduled'
      });
      
      toast({
        title: "Consultation Scheduled",
        description: "Your consultation has been scheduled successfully. You can view the details in your account.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to Schedule",
        description: "There was a problem scheduling your consultation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleSpecializationChange = (value: string) => {
    setFilters(prev => ({ ...prev, specialization: value === 'All specializations' ? undefined : value }));
  };
  
  const handleExperienceChange = (value: string, checked: boolean) => {
    let experience: number | undefined;
    if (checked) {
      if (value === 'exp-5plus') experience = 5;
      if (value === 'exp-10plus') experience = 10;
    }
    setFilters(prev => ({ ...prev, experience }));
  };
  
  const handlePriceChange = (values: number[]) => {
    setPriceValue(values);
  };
  
  // Calculate lawyers to display on current page
  const indexOfLastLawyer = currentPage * lawyersPerPage;
  const indexOfFirstLawyer = indexOfLastLawyer - lawyersPerPage;
  const currentLawyers = lawyers ? lawyers.slice(indexOfFirstLawyer, indexOfLastLawyer) : [];
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-lg mb-4">Filter By</h3>
            
            <div className="space-y-5">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Specialization</Label>
                <Select onValueChange={handleSpecializationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All specializations">All specializations</SelectItem>
                    <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                    <SelectItem value="Family Law">Family Law</SelectItem>
                    <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                    <SelectItem value="Property Law">Property Law</SelectItem>
                    <SelectItem value="Immigration Law">Immigration Law</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Experience</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="exp-any" onCheckedChange={() => handleExperienceChange('exp-any', true)} />
                    <Label htmlFor="exp-any" className="ml-2 text-sm text-gray-700">Any experience</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="exp-5plus" onCheckedChange={(checked) => handleExperienceChange('exp-5plus', checked as boolean)} />
                    <Label htmlFor="exp-5plus" className="ml-2 text-sm text-gray-700">5+ years</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="exp-10plus" onCheckedChange={(checked) => handleExperienceChange('exp-10plus', checked as boolean)} />
                    <Label htmlFor="exp-10plus" className="ml-2 text-sm text-gray-700">10+ years</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Availability</Label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox id="avail-now" />
                    <Label htmlFor="avail-now" className="ml-2 text-sm text-gray-700">Available now</Label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox id="avail-week" />
                    <Label htmlFor="avail-week" className="ml-2 text-sm text-gray-700">This week</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-1">Price Range</Label>
                <div className="pt-6 px-2">
                  <Slider
                    defaultValue={[200]}
                    max={500}
                    step={10}
                    value={priceValue}
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>$0</span>
                    <span>${priceValue[0]}</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full bg-primary/85 hover:bg-primary" onClick={applyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `Showing ${lawyers?.length || 0} lawyers`
              )}
            </p>
            <div className="flex items-center">
              <Label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mr-2">Sort by:</Label>
              <Select defaultValue="rating">
                <SelectTrigger id="sort-by" className="w-[180px]">
                  <SelectValue placeholder="Rating (High to Low)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              // Loading states
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-4 w-32 mt-2" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                  
                  <div className="md:w-2/4 p-4 border-t md:border-t-0 md:border-l md:border-r">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-4/5 mb-3" />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 p-4 flex flex-col justify-between border-t md:border-t-0">
                    <div className="text-center mb-4">
                      <Skeleton className="h-6 w-16 mx-auto" />
                      <Skeleton className="h-3 w-24 mx-auto mt-1" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full rounded-md" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              currentLawyers.map((lawyer) => (
                <div key={lawyer.id} className="border rounded-lg overflow-hidden flex flex-col md:flex-row hover:shadow-md transition">
                  <div className="md:w-1/4 p-4 flex flex-col items-center justify-center bg-gray-50">
                    <div className="h-24 w-24 rounded-full overflow-hidden mb-2">
                      <img src={lawyer.profileImage || "https://via.placeholder.com/200"} alt={`${lawyer.fullName} profile photo`} className="h-full w-full object-cover" />
                    </div>
                    <h3 className="font-medium text-center">{lawyer.fullName}</h3>
                    <div className="flex items-center text-yellow-400 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon key={star} className="h-4 w-4" fill={star <= (lawyer.id % 2 === 0 ? 4.5 : 5) ? "currentColor" : "none"} />
                      ))}
                      <span className="text-gray-600 text-xs ml-1">({lawyer.id + 20})</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/4 p-4 border-t md:border-t-0 md:border-l md:border-r">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge>{lawyer.specialization}</Badge>
                      <Badge variant="outline">{lawyer.id % 2 === 0 ? 'Constitutional Law' : 'Civil Law'}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{lawyer.bio || `Experienced ${lawyer.specialization} lawyer with a focus on client advocacy and practical solutions.`}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium"> {lawyer.experience} years</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Languages:</span>
                        <span className="font-medium"> English{lawyer.id % 2 === 0 ? ', Hindi' : ', Spanish'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Consultation Fee:</span>
                        <span className="font-medium"> ${lawyer.ratePerHour}/hour</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Availability:</span>
                        <span className="font-medium text-success"> {lawyer.id % 3 === 0 ? 'Available now' : 'Next week'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/4 p-4 flex flex-col justify-between border-t md:border-t-0">
                    <div className="text-center mb-4">
                      <span className="block font-medium text-xl text-primary">${lawyer.ratePerHour}</span>
                      <span className="text-sm text-gray-500">per hour</span>
                    </div>
                    <div className="space-y-2">
                      <Button className="w-full bg-primary hover:bg-secondary-dark"
                        onClick={() => handleScheduleConsultation(lawyer.id, lawyer.ratePerHour || 100)}>
                        Schedule Consultation
                      </Button>
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-l-md"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      className={`${currentPage === i + 1 ? 'bg-secondary text-white hover:bg-secondary-dark' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-r-md"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Auth Modal for non-logged in users */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
