import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Check, AlertCircle, ArrowRight, Scale } from 'lucide-react';
import { useForm } from 'react-hook-form';

// Legal Aid Criteria (simplified for demonstration)
const INCOME_THRESHOLDS = {
  'single': 150000,  // Annual income in INR
  'married': 200000,
  'family': 250000
};

const CASE_TYPES_ELIGIBLE = [
  'Criminal Defense',
  'Domestic Violence',
  'Housing Eviction',
  'Employment Discrimination',
  'Consumer Protection',
  'Government Benefits',
  'Landlord-Tenant Disputes',
  'Family Law Matters',
  'Civil Rights Violations'
];

export default function LegalAidEligibilityPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(25);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligibilityDetails, setEligibilityDetails] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const watchMaritalStatus = watch('maritalStatus');
  const watchCaseType = watch('caseType');

  const handleNextStep = (data: Record<string, any>) => {
    // Save current step data
    setEligibilityDetails(prev => ({ ...prev, ...data }));
    
    // Move to next step and update progress
    setStep(prev => prev + 1);
    setProgress(prev => Math.min(100, prev + 25));
  };
  
  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    setProgress(prev => Math.max(0, prev - 25));
  };
  
  const checkEligibility = (data: Record<string, any>) => {
    setEligibilityDetails(prev => ({ ...prev, ...data }));
    
    // Check eligibility based on collected data
    const allData = { ...eligibilityDetails, ...data };
    
    // Income check
    const annualIncome = parseInt(allData.annualIncome) || 0;
    const threshold = INCOME_THRESHOLDS[allData.maritalStatus as keyof typeof INCOME_THRESHOLDS] || 0;
    const incomeEligible = annualIncome <= threshold;
    
    // Case type check
    const caseTypeEligible = CASE_TYPES_ELIGIBLE.includes(allData.caseType);
    
    // Additional criteria
    // In a real app, more complex eligibility logic would be applied
    const additionalEligible = allData.hasRepresentation === 'no' && allData.hasTried === 'yes';
    
    // Final eligibility
    const eligible = incomeEligible && caseTypeEligible && additionalEligible;
    
    setIsEligible(eligible);
    setStep(5); // Move to result step
    setProgress(100);
    
    if (eligible) {
      toast({
        title: "Good news!",
        description: "Based on the information provided, you may be eligible for legal aid.",
      });
    } else {
      toast({
        title: "Eligibility Check Complete",
        description: "We've determined your eligibility status based on the information provided.",
      });
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                {...register("fullName", { required: true })}
                placeholder="Enter your full name"
                className='rounded-md'
              />
              {errors.fullName && <p className="text-sm text-red-500">This field is required</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  {...register("age", { required: true, min: 18, max: 120 })}
                  placeholder="Your age"
                  className='rounded-md'
                />
                {errors.age && <p className="text-sm text-red-500">Valid age is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select onValueChange={(value) => register('gender').onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-sm text-red-500">This field is required</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                {...register("address", { required: true })}
                placeholder="Your current address"
                className='rounded-md'
              />
              {errors.address && <p className="text-sm text-red-500">This field is required</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  {...register("city", { required: true })}
                  placeholder="City"
                  className='rounded-md'
                />
                {errors.city && <p className="text-sm text-red-500">This field is required</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input 
                  id="state" 
                  {...register("state", { required: true })}
                  placeholder="State"
                  className='rounded-md'
                />
                {errors.state && <p className="text-sm text-red-500">This field is required</p>}
              </div>
            </div>
            
            <Button type="submit" className="w-full mt-4">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        );
        
      case 2:
        return (
          <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <RadioGroup defaultValue={eligibilityDetails.maritalStatus} onValueChange={(value) => register('maritalStatus').onChange({ target: { value } })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="married" id="married" />
                  <Label htmlFor="married">Married</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="family" id="family" />
                  <Label htmlFor="family">Family with dependents</Label>
                </div>
              </RadioGroup>
              {errors.maritalStatus && <p className="text-sm text-red-500">This field is required</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="annualIncome">Annual Income (₹)</Label>
              <Input 
                id="annualIncome" 
                type="number"
                {...register("annualIncome", { required: true, min: 0 })}
                placeholder="Your annual income in INR"
                className='rounded-md'
              />
              {errors.annualIncome && <p className="text-sm text-red-500">Valid income is required</p>}
              
              {watchMaritalStatus && (
                <p className="text-sm text-gray-500 mt-1">
                  Income threshold for {watchMaritalStatus === 'single' ? 'singles' : watchMaritalStatus === 'married' ? 'married couples' : 'families'}: 
                  ₹{INCOME_THRESHOLDS[watchMaritalStatus as keyof typeof INCOME_THRESHOLDS].toLocaleString()}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Do you own any significant assets?</Label>
              <RadioGroup defaultValue={eligibilityDetails.hasAssets} onValueChange={(value) => register('hasAssets').onChange({ target: { value } })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="assets-yes" />
                  <Label htmlFor="assets-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="assets-no" />
                  <Label htmlFor="assets-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button type="submit">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        );
        
      case 3:
        return (
          <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caseType">Type of Legal Issue</Label>
              <Select onValueChange={(value) => register('caseType').onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  {CASE_TYPES_ELIGIBLE.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                  <SelectItem value="Medical Malpractice">Medical Malpractice</SelectItem>
                  <SelectItem value="Personal Injury">Personal Injury</SelectItem>
                  <SelectItem value="Business Dispute">Business Dispute</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.caseType && <p className="text-sm text-red-500">This field is required</p>}
              
              {watchCaseType && CASE_TYPES_ELIGIBLE.includes(watchCaseType) && (
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <Check className="h-4 w-4 mr-1" /> This case type is typically eligible for legal aid
                </p>
              )}
              
              {watchCaseType && !CASE_TYPES_ELIGIBLE.includes(watchCaseType) && (
                <p className="text-sm text-amber-600 flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 mr-1" /> This case type may have limited eligibility for legal aid
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="caseDescription">Brief Description of Your Case</Label>
              <textarea 
                id="caseDescription"
                className="w-full min-h-[100px] p-2 border rounded-md"
                {...register("caseDescription", { required: true })}
                placeholder="Please describe your legal issue in a few sentences..."
              />
              {errors.caseDescription && <p className="text-sm text-red-500">This field is required</p>}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button type="submit">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        );
        
      case 4:
        return (
          <form onSubmit={handleSubmit(checkEligibility)} className="space-y-4">
            <div className="space-y-2">
              <Label>Do you already have legal representation?</Label>
              <RadioGroup defaultValue={eligibilityDetails.hasRepresentation} onValueChange={(value) => register('hasRepresentation').onChange({ target: { value } })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="representation-yes" />
                  <Label htmlFor="representation-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="representation-no" />
                  <Label htmlFor="representation-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Have you tried to resolve this issue through other means?</Label>
              <RadioGroup defaultValue={eligibilityDetails.hasTried} onValueChange={(value) => register('hasTried').onChange({ target: { value } })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="tried-yes" />
                  <Label htmlFor="tried-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="tried-no" />
                  <Label htmlFor="tried-no">No</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>How urgent is your legal issue?</Label>
              <RadioGroup defaultValue={eligibilityDetails.urgency} onValueChange={(value) => register('urgency').onChange({ target: { value } })}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="urgency-immediate" />
                  <Label htmlFor="urgency-immediate">Immediate (within days)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="soon" id="urgency-soon" />
                  <Label htmlFor="urgency-soon">Soon (within weeks)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-urgent" id="urgency-not" />
                  <Label htmlFor="urgency-not">Not urgent (within months)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <textarea 
                id="additionalInfo"
                className="w-full min-h-[80px] p-2 border rounded-md"
                {...register("additionalInfo")}
                placeholder="Any other information that might be relevant to your application..."
              />
            </div>
            
            <div className="flex justify-between mt-4">
              <Button type="button" variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button type="submit">
                Check Eligibility
              </Button>
            </div>
          </form>
        );
        
      case 5:
        return (
          <div className="text-center py-4">
            {isEligible ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-600">You May Be Eligible for Legal Aid</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Based on the information you've provided, you may qualify for free or subsidized legal assistance.
                </p>
                
                <Card className="mt-6 text-left">
                  <CardHeader>
                    <CardTitle className="text-lg">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white font-medium text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Visit a Legal Aid Office</h4>
                        <p className="text-sm text-gray-600">
                          Take this eligibility result to your nearest legal aid office for formal verification.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white font-medium text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Prepare Your Documents</h4>
                        <p className="text-sm text-gray-600">
                          Bring identification, proof of income, and any documents related to your case.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-primary/10 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white font-medium text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Complete Formal Application</h4>
                        <p className="text-sm text-gray-600">
                          You'll need to complete an official application form and possibly attend an interview.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Find Nearest Legal Aid Office</Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-amber-600">You May Not Be Eligible for Legal Aid</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Based on the information you've provided, you may not qualify for free legal aid. However, there are still options available to you.
                </p>
                
                <Card className="mt-6 text-left">
                  <CardHeader>
                    <CardTitle className="text-lg">Alternative Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-50 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-500 text-white font-medium text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Pro Bono Legal Services</h4>
                        <p className="text-sm text-gray-600">
                          Many law firms offer free services to certain clients. Check with local bar associations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-50 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-500 text-white font-medium text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Legal Clinics</h4>
                        <p className="text-sm text-gray-600">
                          Many law schools run free legal clinics where law students supervised by attorneys provide assistance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-amber-50 rounded-full p-1 mr-3">
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-amber-500 text-white font-medium text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Affordable Legal Help</h4>
                        <p className="text-sm text-gray-600">
                          Some lawyers offer payment plans or reduced fees based on your circumstances.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" variant="outline">Find Affordable Legal Help</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            <div className="mt-8">
              <p className="text-sm text-gray-500 mb-4">
                Note: This is only a preliminary check. Final eligibility will be determined by the legal aid organization.
              </p>
              <Button variant="outline" onClick={() => {
                setStep(1);
                setProgress(25);
                setIsEligible(null);
                setEligibilityDetails({});
              }}>
                Start New Check
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-2">Legal Aid Eligibility Checker</h1>
        <p className="text-gray-600">
          Find out if you qualify for free or subsidized legal assistance based on your income and case type.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Scale className="h-5 w-5 mr-2" />
                About Legal Aid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Legal aid provides free legal advice and representation to people who cannot afford it. Eligibility is typically based on:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm">Income below certain thresholds</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm">The type of legal problem you're facing</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm">Your personal circumstances</p>
                </div>
                <div className="flex items-start">
                  <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <p className="text-sm">Whether you have already tried other options</p>
                </div>
              </div>
              
              <div className="p-3 bg-amber-50 rounded-md">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> This tool provides a preliminary check only. Official eligibility will be determined by legal aid authorities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="space-y-2">
                <CardTitle className="text-lg">Eligibility Checker</CardTitle>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Personal Details</span>
                  <span>Financial Status</span>
                  <span>Case Details</span>
                  <span>Additional Info</span>
                  <span>Result</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}