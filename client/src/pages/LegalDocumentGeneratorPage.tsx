import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, FileDown, Download, Check, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';

// Document templates
const DOCUMENT_TEMPLATES = [
  { id: 'affidavit', name: 'Affidavit', category: 'court' },
  { id: 'rental-agreement', name: 'Rental Agreement', category: 'property' },
  { id: 'will', name: 'Last Will and Testament', category: 'personal' },
  { id: 'nda', name: 'Non-Disclosure Agreement', category: 'business' },
  { id: 'employment', name: 'Employment Contract', category: 'business' },
  { id: 'complaint', name: 'Legal Complaint', category: 'court' },
  { id: 'divorce', name: 'Divorce Petition', category: 'family' },
  { id: 'poa', name: 'Power of Attorney', category: 'personal' },
];

export default function LegalDocumentGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedDocument, setGeneratedDocument] = useState('');
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    if (!selectedTemplate) {
      toast({
        title: "Template required",
        description: "Please select a document template first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate document generation with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            generateMockDocument(data);
            toast({
              title: "Document Generated Successfully",
              description: "Your legal document has been created and ready for download.",
            });
          }, 500);
        }
        return newProgress;
      });
    }, 600);
  };

  const generateMockDocument = (data: any) => {
    const template = DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplate);
    
    let documentText = '';
    
    switch (selectedTemplate) {
      case 'affidavit':
        documentText = `
AFFIDAVIT

I, ${data.fullName}, son/daughter of ______________, aged ${data.age} years, residing at ${data.address}, do hereby solemnly affirm and declare as follows:

1. That I am the deponent in this case and am fully conversant with the facts of this case.
2. ${data.affidavitContent || 'That the contents of this affidavit are true to the best of my knowledge.'}
3. That I have not concealed or misrepresented any material facts in this affidavit.

I solemnly affirm that the contents of this affidavit are true to the best of my knowledge, no part of it is false, and nothing material has been concealed therein.

Verified at ${data.city || '[City]'} on this ${new Date().getDate()} day of ${new Date().toLocaleString('default', { month: 'long' })}, ${new Date().getFullYear()}.

Deponent
${data.fullName}
`;
        break;
      case 'rental-agreement':
        documentText = `
RENTAL AGREEMENT

This Rental Agreement is made on ${new Date().toLocaleDateString()} between ${data.ownerName || '[Owner Name]'} (hereinafter referred to as the "LANDLORD") and ${data.fullName} (hereinafter referred to as the "TENANT").

PROPERTY ADDRESS: ${data.address}

TERMS AND CONDITIONS:
1. The landlord agrees to rent the premises to the tenant for a period of ${data.rentalPeriod || '11 months'} commencing from ${data.startDate || '[Start Date]'}.
2. The monthly rent shall be Rs. ${data.rentAmount || '[Amount]'} payable in advance on or before the 5th day of each calendar month.
3. The tenant has paid a refundable security deposit of Rs. ${data.depositAmount || '[Amount]'}.

[Additional terms as per standard rental agreement will be included here]

IN WITNESS WHEREOF, the parties hereto have set their hands on the day and year first written above.

LANDLORD                          TENANT
${data.ownerName || '___________'}                 ${data.fullName}
`;
        break;
      default:
        documentText = `
LEGAL DOCUMENT: ${template?.name.toUpperCase()}

This document is generated for ${data.fullName} on ${new Date().toLocaleDateString()}.

[This is a placeholder for the ${template?.name} content. In a production environment, this would contain the full legal text based on your inputs and requirements.]

Additional information provided:
${Object.entries(data)
  .filter(([key]) => key !== 'fullName')
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

DISCLAIMER: This document is generated as a template and may need professional legal review before use.
`;
    }
    
    setGeneratedDocument(documentText);
  };

  const renderFormFields = () => {
    switch (selectedTemplate) {
      case 'affidavit':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register("fullName", { required: true })} />
                {errors.fullName && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" {...register("age", { required: true })} />
                {errors.age && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Current Address</Label>
              <Textarea id="address" {...register("address", { required: true })} />
              {errors.address && <p className="text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city", { required: true })} />
              {errors.city && <p className="rounded-md text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="affidavitContent">Affidavit Content</Label>
              <Textarea 
                id="affidavitContent" 
                rows={4}
                placeholder="Enter the main content of your affidavit..."
                {...register("affidavitContent")}
              />
            </div>
          </>
        );
        
      case 'rental-agreement':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Tenant Full Name</Label>
                <Input id="fullName" {...register("fullName", { required: true })} />
                {errors.fullName && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Full Name</Label>
                <Input id="ownerName" {...register("ownerName", { required: true })} />
                {errors.ownerName && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Property Address</Label>
              <Textarea id="address" {...register("address", { required: true })} />
              {errors.address && <p className="text-xs text-red-500">This field is required</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rentAmount">Monthly Rent (₹)</Label>
                <Input id="rentAmount" type="number" {...register("rentAmount", { required: true })} />
                {errors.rentAmount && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Security Deposit (₹)</Label>
                <Input id="depositAmount" type="number" {...register("depositAmount", { required: true })} />
                {errors.depositAmount && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" {...register("startDate", { required: true })} />
                {errors.startDate && <p className="rounded-md text-xs text-red-500">This field is required</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentalPeriod">Rental Period</Label>
                <Select onValueChange={(value) => register("rentalPeriod").onChange({ target: { value } })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11 months">11 Months</SelectItem>
                    <SelectItem value="1 year">1 Year</SelectItem>
                    <SelectItem value="2 years">2 Years</SelectItem>
                    <SelectItem value="3 years">3 Years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rentalPeriod && <p className="text-xs text-red-500">This field is required</p>}
              </div>
            </div>
          </>
        );
        
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" {...register("fullName", { required: true })} />
              {errors.fullName && <p className="rounded-md text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" {...register("email", { required: true })} />
              {errors.email && <p className="rounded-md text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone", { required: true })} />
              {errors.phone && <p className="rounded-md text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" {...register("address", { required: true })} />
              {errors.address && <p className="text-xs text-red-500">This field is required</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea 
                id="additionalInfo" 
                rows={4}
                placeholder="Enter any additional information relevant to this document..."
                {...register("additionalInfo")}
              />
            </div>
          </div>
        );
    }
  };

  const downloadDocument = () => {
    // In a real app, this would generate a PDF or Word document
    const element = document.createElement("a");
    const file = new Blob([generatedDocument], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${selectedTemplate}-document.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Document Downloaded",
      description: "Your legal document has been downloaded successfully.",
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-2">Legal Document Generator</h1>
        <p className="text-gray-600">
          Create professional legal documents by filling out simple forms. No legal expertise required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Template Selection */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Select Document Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="court">Court</TabsTrigger>
                </TabsList>
                
                {['all', 'business', 'personal', 'court'].map(category => (
                  <TabsContent key={category} value={category} className="space-y-2 mt-4">
                    {DOCUMENT_TEMPLATES
                      .filter(t => category === 'all' || t.category === category)
                      .map(template => (
                        <div 
                          key={template.id} 
                          className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors flex items-center ${
                            selectedTemplate === template.id ? 'border-primary bg-primary/5' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          {selectedTemplate === template.id ? (
                            <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Document
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Document Form */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedTemplate ? (
                  <span>
                    {DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Document'} Information
                  </span>
                ) : (
                  'Enter Document Information'
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedTemplate ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Select a Template</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Please select a document template from the list on the left to get started.
                  </p>
                </div>
              ) : isGenerating ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
                  <h3 className="text-xl font-bold mb-6">Generating Your Document</h3>
                  <div className="max-w-md mx-auto mb-2">
                    <Progress value={progress} />
                  </div>
                  <p className="text-gray-500">
                    Please wait while we prepare your document...
                  </p>
                </div>
              ) : generatedDocument ? (
                <div className="space-y-6">
                  <div className="border rounded-md p-4 bg-gray-50 font-mono text-sm whitespace-pre-wrap">
                    {generatedDocument}
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={downloadDocument} className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {renderFormFields()}
                  
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    Generate Document
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}