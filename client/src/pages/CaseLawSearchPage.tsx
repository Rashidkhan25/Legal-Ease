import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Clock, Download, BookCopy } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - in a real app, this would come from an API
const MOCK_CASES = [
  {
    id: 1,
    title: "Smith v. Jones (2022)",
    citation: "123 SCR 456",
    court: "Supreme Court",
    date: "2022-06-15",
    summary: "This landmark case established the principle that...",
    keywords: ["property law", "easement", "right of way"],
    fullText: "The court, having considered all evidence presented...",
  },
  {
    id: 2,
    title: "State of Maharashtra v. Amit Kumar",
    citation: "AIR 2021 SC 789",
    court: "High Court",
    date: "2021-03-22",
    summary: "The case dealt with the interpretation of Section 302 of IPC...",
    keywords: ["criminal law", "murder", "evidence"],
    fullText: "The honorable court has carefully examined the evidence and statements...",
  },
  {
    id: 3,
    title: "Patel Enterprises v. Tax Authority",
    citation: "Tax App. 45/2020",
    court: "Tax Tribunal",
    date: "2020-11-05",
    summary: "A significant case regarding the application of GST on digital services...",
    keywords: ["tax law", "GST", "digital services"],
    fullText: "The appellant contended that the services provided by them fall under the exemption...",
  }
];

export default function CaseLawSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a keyword, case name, or citation to search.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      const filteredResults = MOCK_CASES.filter(
        case_ => 
          case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          case_.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          case_.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          case_.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
      
      toast({
        title: `${filteredResults.length} results found`,
        description: filteredResults.length > 0 
          ? "Showing search results for your query." 
          : "Try different keywords or broaden your search.",
      });
    }, 1000);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-2">Case Law Search Engine</h1>
        <p className="text-gray-600">
          Search for case laws, judgments, and legal precedents from various courts across India.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Search and Filters */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Keywords</label>
                  <div className="flex">
                    <Input 
                      placeholder="Case name, citation, keywords..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="rounded-l"
                    />
                    <Button type="submit" className="rounded-l-none" disabled={isSearching}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="courts">
                    <AccordionTrigger className="text-sm">Courts</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="supreme" className="mr-2" />
                          <label htmlFor="supreme" className="text-sm rounded-md">Supreme Court</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="high" className="mr-2" />
                          <label htmlFor="high" className="text-sm rounded-md">High Courts</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="district" className="mr-2" />
                          <label htmlFor="district" className="text-sm rounded-md">District Courts</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="tribunals" className="mr-2" />
                          <label htmlFor="tribunals" className="text-sm rounded-md">Tribunals</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="date">
                    <AccordionTrigger className="text-sm">Date Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <label className="text-sm">From:</label>
                        <Input type="date" className="w-full rounded-md" />
                        <label className="text-sm">To:</label>
                        <Input type="date" className="w-full rounded-md" />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="categories">
                    <AccordionTrigger className="text-sm">Legal Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input type="checkbox" id="criminal" className="mr-2" />
                          <label htmlFor="criminal" className="text-sm">Criminal Law</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="civil" className="mr-2" />
                          <label htmlFor="civil" className="text-sm rounded-md">Civil Law</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="constitutional" className="mr-2 rounded-md" />
                          <label htmlFor="constitutional" className="text-sm">Constitutional Law</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="tax" className="mr-2" />
                          <label htmlFor="tax" className="text-sm rounded-md">Tax Law</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="family" className="mr-2 rounded-md" />
                          <label htmlFor="family" className="text-sm">Family Law</label>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button type="submit" className="w-full" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Search Cases'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Results */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookCopy className="h-5 w-5 mr-2" />
                Search Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSearching ? (
                // Loading state
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-2/3" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                // Search results
                <div className="space-y-6">
                  {searchResults.map((caseItem) => (
                    <Card key={caseItem.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-primary">{caseItem.title}</h3>
                        <div className="flex space-x-2 items-center text-sm text-gray-500">
                          <span className="font-medium">{caseItem.citation}</span>
                          <span>•</span>
                          <span>{caseItem.court}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{new Date(caseItem.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-gray-700">{caseItem.summary}</p>
                        <div className="flex flex-wrap gap-2">
                          {caseItem.keywords.map((keyword: string, i: number) => (
                            <Badge key={i} variant="outline" className="bg-secondary/10 text-secondary">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <Tabs defaultValue="summary">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="fulltext">Full Text</TabsTrigger>
                          </TabsList>
                          <TabsContent value="summary" className="p-4 text-sm">
                            {caseItem.summary}
                          </TabsContent>
                          <TabsContent value="fulltext" className="p-4 text-sm">
                            {caseItem.fullText}
                            <Button className="mt-4 flex items-center" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchQuery ? (
                // No results
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No results found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    We couldn't find any cases matching "{searchQuery}". Try different keywords or refine your search.
                  </p>
                </div>
              ) : (
                // Initial state
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BookCopy className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Search for Case Laws</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Enter keywords, case names, or citations in the search box to find relevant case laws and judgments.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}