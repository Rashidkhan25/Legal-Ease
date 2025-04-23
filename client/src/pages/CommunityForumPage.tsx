import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Search, Users, MessageSquare, Plus, ThumbsUp, ThumbsDown, Filter, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

// Mock forum data
const FORUM_CATEGORIES = [
  { id: 'criminal', name: 'Criminal Law', count: 124 },
  { id: 'civil', name: 'Civil Law', count: 98 },
  { id: 'family', name: 'Family Law', count: 76 },
  { id: 'property', name: 'Property Law', count: 65 },
  { id: 'tax', name: 'Tax Law', count: 42 },
  { id: 'consumer', name: 'Consumer Law', count: 37 },
  { id: 'employment', name: 'Employment Law', count: 55 },
  { id: 'cyber', name: 'Cyber Law', count: 29 },
];

const MOCK_DISCUSSIONS = [
  {
    id: 1,
    title: "Tenant rights when landlord refuses to return security deposit",
    category: "property",
    author: {
      id: 101,
      name: "Amit Sharma",
      avatar: null,
      role: "user"
    },
    createdAt: "2023-12-15T14:30:00",
    content: "My landlord is refusing to return my security deposit even after I've vacated the premises in good condition. What legal recourse do I have? I've sent multiple emails and messages but haven't received any proper response.",
    upvotes: 12,
    downvotes: 2,
    replies: [
      {
        id: 201,
        author: {
          id: 102,
          name: "Priya Desai",
          avatar: null,
          role: "lawyer"
        },
        createdAt: "2023-12-15T15:45:00",
        content: "You can send a legal notice through a lawyer first. If that doesn't work, you can file a complaint in the Rent Control Tribunal or Civil Court. Make sure you have documentation proving the condition of the property when you left.",
        upvotes: 8,
        downvotes: 0,
      },
      {
        id: 202,
        author: {
          id: 103,
          name: "Rahul Mehra",
          avatar: null,
          role: "user"
        },
        createdAt: "2023-12-15T16:20:00",
        content: "I had a similar issue. I sent a formal notice through a lawyer and got my deposit back within a week. Most landlords don't want to deal with legal issues.",
        upvotes: 5,
        downvotes: 1,
      }
    ]
  },
  {
    id: 2,
    title: "Legal implications of online defamation on social media",
    category: "cyber",
    author: {
      id: 104,
      name: "Neha Kapoor",
      avatar: null,
      role: "user"
    },
    createdAt: "2023-12-14T10:15:00",
    content: "Someone has posted false information about me and my business on social media, which is affecting my reputation. What legal action can I take against online defamation?",
    upvotes: 8,
    downvotes: 1,
    replies: [
      {
        id: 203,
        author: {
          id: 105,
          name: "Vikram Singh",
          avatar: null,
          role: "lawyer"
        },
        createdAt: "2023-12-14T11:30:00",
        content: "Online defamation is actionable under both civil and criminal law in India. You can file a complaint under Section 499/500 of IPC and Section 66A of the IT Act. First, gather all evidence including screenshots. It's advisable to send a cease and desist notice before pursuing legal action.",
        upvotes: 10,
        downvotes: 0,
      }
    ]
  },
  {
    id: 3,
    title: "Consumer rights for defective product - no response from seller",
    category: "consumer",
    author: {
      id: 106,
      name: "Suresh Kumar",
      avatar: null,
      role: "user"
    },
    createdAt: "2023-12-13T09:45:00",
    content: "I purchased a refrigerator online which had manufacturing defects. Despite multiple complaints, the seller is not responding. What are my rights as a consumer?",
    upvotes: 15,
    downvotes: 0,
    replies: []
  }
];

export default function CommunityForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', category: '', content: '' });
  const [discussions, setDiscussions] = useState(MOCK_DISCUSSIONS);
  const [activeCategory, setActiveCategory] = useState('all');
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter from the server
    toast({
      title: "Search results",
      description: `Showing results for "${searchQuery}"`,
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to create a new discussion.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPost.title || !newPost.category || !newPost.content) {
      toast({
        title: "Incomplete form",
        description: "Please fill all the required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be sent to the server
    const newDiscussion = {
      id: Math.max(...discussions.map(d => d.id)) + 1,
      title: newPost.title,
      category: newPost.category,
      author: {
        id: user?.id || 0,
        name: user?.fullName || user?.username || 'Anonymous',
        avatar: null, // Set to null to match existing type
        role: user?.role || 'user'
      },
      createdAt: new Date().toISOString(),
      content: newPost.content,
      upvotes: 0,
      downvotes: 0,
      replies: []
    };
    
    setDiscussions([newDiscussion, ...discussions]);
    setNewPost({ title: '', category: '', content: '' });
    setShowNewPostForm(false);
    
    toast({
      title: "Post created",
      description: "Your discussion has been posted successfully.",
    });
  };

  const handleVote = (discussionId: number, replyId: number | null, isUpvote: boolean) => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please login to vote on discussions.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would be sent to the server
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        if (replyId === null) {
          return {
            ...discussion,
            upvotes: isUpvote ? discussion.upvotes + 1 : discussion.upvotes,
            downvotes: !isUpvote ? discussion.downvotes + 1 : discussion.downvotes
          };
        } else {
          return {
            ...discussion,
            replies: discussion.replies.map(reply => 
              reply.id === replyId
                ? {
                    ...reply,
                    upvotes: isUpvote ? reply.upvotes + 1 : reply.upvotes,
                    downvotes: !isUpvote ? reply.downvotes + 1 : reply.downvotes
                  }
                : reply
            )
          };
        }
      }
      return discussion;
    }));
    
    toast({
      title: isUpvote ? "Upvoted" : "Downvoted",
      description: `You have ${isUpvote ? 'upvoted' : 'downvoted'} the ${replyId ? 'reply' : 'discussion'}.`,
    });
  };

  const filteredDiscussions = activeCategory === 'all'
    ? discussions
    : discussions.filter(d => d.category === activeCategory);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary font-serif mb-2">Community Legal Forum</h1>
        <p className="text-gray-600">
          Connect with peers and legal experts to discuss legal issues, share experiences, and get advice.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                  activeCategory === 'all' ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setActiveCategory('all')}
              >
                <span className="font-medium">All Topics</span>
                <Badge variant="outline">{discussions.length}</Badge>
              </div>
              
              {FORUM_CATEGORIES.map(category => (
                <div 
                  key={category.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                    activeCategory === category.id ? 'bg-primary/10 text-primary' : ''
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.name}</span>
                  <Badge variant="outline">{category.count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Discussions</span>
                <span className="font-medium">{discussions.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Replies</span>
                <span className="font-medium">
                  {discussions.reduce((acc, curr) => acc + curr.replies.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Users</span>
                <span className="font-medium">58</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lawyer Responses</span>
                <span className="font-medium">24</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-3">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Discussions
                </CardTitle>
                <div className="flex space-x-3">
                  <form onSubmit={handleSearch} className="relative hidden md:flex">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search discussions..."
                      className="pl-8 w-[200px] lg:w-[300px] rounded-md"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                  <Button onClick={() => setShowNewPostForm(true)} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    New Discussion
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSearch} className="p-4 md:hidden">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search discussions..."
                    className="pl-8 w-full rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              
              <Tabs defaultValue="latest" className="p-4 pb-0">
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {showNewPostForm && (
                <div className="p-4 border-b">
                  <h3 className="text-lg font-bold mb-3">Create New Discussion</h3>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Discussion Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <select 
                        className="w-full border rounded-md p-2"
                        value={newPost.category}
                        onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                        required
                      >
                        <option value="">Select Category</option>
                        {FORUM_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Describe your legal question or issue in detail..."
                        rows={4}
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => setShowNewPostForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Post Discussion
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="divide-y">
                {filteredDiscussions.length > 0 ? (
                  filteredDiscussions.map(discussion => (
                    <div key={discussion.id} className="p-4">
                      <div className="flex items-start">
                        <div className="mr-4 mt-1 flex flex-col items-center space-y-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50"
                            onClick={() => handleVote(discussion.id, null, true)}
                          >
                            <ThumbsUp className="h-5 w-5" />
                          </Button>
                          <span className="text-sm font-medium">{discussion.upvotes - discussion.downvotes}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => handleVote(discussion.id, null, false)}
                          >
                            <ThumbsDown className="h-5 w-5" />
                          </Button>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold">{discussion.title}</h3>
                            <Badge className="ml-2">
                              {FORUM_CATEGORIES.find(c => c.id === discussion.category)?.name || discussion.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-1 mb-2">
                            <Avatar className="h-6 w-6">
                              {discussion.author.avatar && <AvatarImage src={discussion.author.avatar} />}
                              <AvatarFallback>{discussion.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{discussion.author.name}</span>
                            {discussion.author.role === 'lawyer' && (
                              <Badge variant="outline" className="px-2 py-0 h-5 text-xs bg-blue-50 text-blue-600 border-blue-200">
                                Lawyer
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(discussion.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700">{discussion.content}</p>
                          
                          <div className="mt-4">
                            <Button variant="ghost" size="sm" className="text-sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {discussion.replies.length} {discussion.replies.length === 1 ? 'Reply' : 'Replies'}
                            </Button>
                          </div>
                          
                          {discussion.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                              {discussion.replies.map(reply => (
                                <div key={reply.id} className="relative">
                                  <div className="flex items-start">
                                    <div className="mr-4 mt-1 flex flex-col items-center space-y-1">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded-full text-gray-400 hover:text-green-500 hover:bg-green-50"
                                        onClick={() => handleVote(discussion.id, reply.id, true)}
                                      >
                                        <ThumbsUp className="h-4 w-4" />
                                      </Button>
                                      <span className="text-xs font-medium">{reply.upvotes - reply.downvotes}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => handleVote(discussion.id, reply.id, false)}
                                      >
                                        <ThumbsDown className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <Avatar className="h-5 w-5">
                                          {reply.author.avatar && <AvatarImage src={reply.author.avatar} />}
                                          <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{reply.author.name}</span>
                                        {reply.author.role === 'lawyer' && (
                                          <Badge variant="outline" className="px-2 py-0 h-5 text-xs bg-blue-50 text-blue-600 border-blue-200">
                                            Lawyer
                                          </Badge>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      
                                      <p className="text-gray-700 text-sm">{reply.content}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {isLoggedIn && (
                            <div className="mt-4">
                              <Textarea placeholder="Write a reply..." className="text-sm" rows={2} />
                              <div className="flex justify-end mt-2">
                                <Button size="sm">Post Reply</Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No discussions found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {activeCategory === 'all' 
                        ? "Be the first to start a discussion in the community!" 
                        : `No discussions found in this category. Why not start one?`}
                    </p>
                    <Button onClick={() => setShowNewPostForm(true)} className="mt-4">
                      Start a Discussion
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}