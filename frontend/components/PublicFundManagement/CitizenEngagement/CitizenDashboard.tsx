'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  MessageSquare,
  Calendar,
  Star,
  MapPin,
  Camera,
  Video,
  Mic,
  Heart,
  ThumbsUp,
  Eye,
  TrendingUp,
  Award,
  Bell,
  Share2,
  Flag,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

interface CitizenEngagementProps {
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

interface CommunityPost {
  id: number;
  author: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  category: string;
  location?: string;
  images?: string[];
  isLiked: boolean;
}

interface TownHallEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  virtualLink?: string;
  attendees: number;
  maxAttendees: number;
  proposalId?: number;
  isRegistered: boolean;
}

interface CitizenFeedback {
  id: number;
  projectId: number;
  projectName: string;
  rating: number;
  feedback: string;
  category: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
  images?: string[];
}

export default function CitizenDashboard({ showNotification, onError }: CitizenEngagementProps) {
  const [activeTab, setActiveTab] = useState('community');
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: 1,
      author: "Sarah Johnson",
      content: "The new park construction is looking great! Can't wait for it to be completed. The playground area will be perfect for our kids. 🏞️",
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      category: "Infrastructure",
      location: "Downtown Park",
      isLiked: false,
      images: ["/api/placeholder/400/300"]
    },
    {
      id: 2,
      author: "Mike Chen",
      content: "Attended the town hall meeting yesterday about the school renovation project. Great to see community involvement! The proposed changes look promising.",
      likes: 15,
      comments: 12,
      timestamp: "5 hours ago",
      category: "Education",
      isLiked: true
    },
    {
      id: 3,
      author: "Emma Davis",
      content: "The road repairs on Main Street are causing some traffic issues. Maybe we need better signage? Has anyone else noticed this? 🚧",
      likes: 31,
      comments: 18,
      timestamp: "1 day ago",
      category: "Transportation",
      location: "Main Street",
      isLiked: false
    }
  ]);

  const [townHallEvents, setTownHallEvents] = useState<TownHallEvent[]>([
    {
      id: 1,
      title: "Community Center Renovation Discussion",
      description: "Join us to discuss the proposed community center renovation project. Your input matters!",
      date: "2025-10-15",
      time: "18:00",
      location: "City Hall - Conference Room A",
      virtualLink: "https://meet.google.com/abc-defg-hij",
      attendees: 45,
      maxAttendees: 100,
      proposalId: 1,
      isRegistered: false
    },
    {
      id: 2,
      title: "Green Energy Initiative Town Hall",
      description: "Discussing the implementation of solar panels in public buildings and sustainable energy solutions.",
      date: "2025-10-20",
      time: "19:00",
      location: "Community Center - Main Hall",
      virtualLink: "https://zoom.us/j/123456789",
      attendees: 78,
      maxAttendees: 150,
      proposalId: 3,
      isRegistered: true
    },
    {
      id: 3,
      title: "Budget Planning Workshop",
      description: "Interactive workshop on next year's municipal budget priorities. Help shape our city's future!",
      date: "2025-10-25",
      time: "10:00",
      location: "Virtual Event",
      virtualLink: "https://teams.microsoft.com/l/meetup-join/xyz",
      attendees: 32,
      maxAttendees: 200,
      isRegistered: false
    }
  ]);

  const [citizenFeedback, setCitizenFeedback] = useState<CitizenFeedback[]>([
    {
      id: 1,
      projectId: 1,
      projectName: "Downtown Park Renovation",
      rating: 4,
      feedback: "The park looks amazing! The new benches and walking paths are well-designed.",
      category: "Infrastructure",
      timestamp: "3 days ago",
      status: "reviewed"
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Public Library Expansion",
      rating: 5,
      feedback: "Excellent use of funds. The new study areas and technology section are fantastic!",
      category: "Education",
      timestamp: "1 week ago",
      status: "resolved"
    }
  ]);

  const [engagementStats, setEngagementStats] = useState({
    totalCitizens: 2847,
    activeParticipants: 456,
    communityPosts: 189,
    townHallAttendance: 78,
    feedbackSubmitted: 234,
    projectsRated: 15
  });

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      onError("Please enter some content for your post");
      return;
    }

    const post: CommunityPost = {
      id: Date.now(),
      author: "You",
      content: newPost,
      likes: 0,
      comments: 0,
      timestamp: "Just now",
      category: selectedCategory,
      isLiked: false
    };

    setCommunityPosts([post, ...communityPosts]);
    setNewPost('');
    showNotification("Your post has been shared with the community!");
  };

  const handleLikePost = (postId: number) => {
    setCommunityPosts(posts =>
      posts.map(post =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post
      )
    );
  };

  const handleEventRegistration = (eventId: number) => {
    setTownHallEvents(events =>
      events.map(event =>
        event.id === eventId
          ? {
            ...event,
            isRegistered: !event.isRegistered,
            attendees: event.isRegistered ? event.attendees - 1 : event.attendees + 1
          }
          : event
      )
    );

    const event = townHallEvents.find(e => e.id === eventId);
    if (event) {
      showNotification(
        event.isRegistered
          ? `You've unregistered from "${event.title}"`
          : `You've registered for "${event.title}"`
      );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'infrastructure': return <MapPin className="h-4 w-4" />;
      case 'education': return <Award className="h-4 w-4" />;
      case 'transportation': return <Target className="h-4 w-4" />;
      case 'environment': return <Heart className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Citizen Engagement Platform</h1>
          <p className="text-muted-foreground">
            Connect, participate, and make your voice heard in community decisions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {engagementStats.activeParticipants} active participants
          </Badge>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Subscribe to Updates
          </Button>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Citizens</p>
                <p className="text-2xl font-bold">{engagementStats.totalCitizens.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{engagementStats.activeParticipants}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Community Posts</p>
                <p className="text-2xl font-bold">{engagementStats.communityPosts}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Event Attendance</p>
                <p className="text-2xl font-bold">{engagementStats.townHallAttendance}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback Given</p>
                <p className="text-2xl font-bold">{engagementStats.feedbackSubmitted}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects Rated</p>
                <p className="text-2xl font-bold">{engagementStats.projectsRated}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="community">Community Forum</TabsTrigger>
          <TabsTrigger value="events">Town Hall Events</TabsTrigger>
          <TabsTrigger value="feedback">Project Feedback</TabsTrigger>
          <TabsTrigger value="impact">Community Impact</TabsTrigger>
        </TabsList>

        {/* Community Forum Tab */}
        <TabsContent value="community" className="space-y-4">
          {/* Create New Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Share with Your Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="general">General</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="education">Education</option>
                  <option value="transportation">Transportation</option>
                  <option value="environment">Environment</option>
                  <option value="safety">Public Safety</option>
                </select>
                <Badge variant="outline" className="flex items-center">
                  {getCategoryIcon(selectedCategory)}
                  <span className="ml-1 capitalize">{selectedCategory}</span>
                </Badge>
              </div>
              <Textarea
                placeholder="What's happening in your community? Share updates, concerns, or suggestions..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </Button>
                </div>
                <Button onClick={handlePostSubmit}>
                  Share Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts Feed */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{post.author}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{post.timestamp}</span>
                          <Badge variant="secondary" className="text-xs">
                            {getCategoryIcon(post.category)}
                            <span className="ml-1">{post.category}</span>
                          </Badge>
                          {post.location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {post.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-gray-700 mb-4">{post.content}</p>

                  {post.images && post.images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={post.images[0]}
                        alt="Post image"
                        className="rounded-lg max-h-96 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikePost(post.id)}
                        className={post.isLiked ? "text-red-600" : ""}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {post.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Town Hall Events Tab */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {townHallEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="mt-2">{event.description}</CardDescription>
                    </div>
                    {event.isRegistered && (
                      <Badge className="bg-green-100 text-green-800">
                        Registered
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center col-span-2">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.virtualLink && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium mb-1">Virtual Access Available</p>
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <Video className="h-4 w-4 mr-2" />
                        Join Virtual Meeting
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{event.attendees}</span> / {event.maxAttendees} registered
                    </div>
                    <Button
                      onClick={() => handleEventRegistration(event.id)}
                      variant={event.isRegistered ? "outline" : "default"}
                    >
                      {event.isRegistered ? "Unregister" : "Register"}
                    </Button>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Project Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {/* Submit New Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Share Your Experience
              </CardTitle>
              <CardDescription>
                Help us improve by sharing feedback on completed or ongoing projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Project</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Downtown Park Renovation</option>
                    <option>Public Library Expansion</option>
                    <option>Main Street Road Repairs</option>
                    <option>Community Center Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Infrastructure</option>
                    <option>Education</option>
                    <option>Transportation</option>
                    <option>Environment</option>
                    <option>Public Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button key={rating} variant="ghost" size="sm">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Feedback</label>
                <Textarea
                  placeholder="Share your thoughts about this project. What worked well? What could be improved?"
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
                <Button>
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Previous Feedback</h3>
            {citizenFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{feedback.projectName}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < feedback.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                            />
                          ))}
                        </div>
                        <Badge variant="secondary">{feedback.category}</Badge>
                        <span className="text-sm text-muted-foreground">{feedback.timestamp}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(feedback.status)}>
                      {feedback.status}
                    </Badge>
                  </div>
                  <p className="text-gray-700">{feedback.feedback}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Impact Tab */}
        <TabsContent value="impact" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Your Impact Score
                </CardTitle>
                <CardDescription>
                  Based on your community participation and contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">847</div>
                  <p className="text-muted-foreground mb-4">Community Impact Points</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Posts Shared:</span>
                      <span>12 (+120 points)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Events Attended:</span>
                      <span>5 (+250 points)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Feedback Given:</span>
                      <span>8 (+160 points)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Votes Cast:</span>
                      <span>15 (+300 points)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Community Leader</p>
                    <p className="text-xs text-muted-foreground">Top contributor</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Event Regular</p>
                    <p className="text-xs text-muted-foreground">5+ events attended</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Feedback Hero</p>
                    <p className="text-xs text-muted-foreground">Helpful reviews</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Voice of Community</p>
                    <p className="text-xs text-muted-foreground">Active discussions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>Top contributors this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "You", points: 847, badge: "🥇" },
                  { rank: 2, name: "Sarah Johnson", points: 734, badge: "🥈" },
                  { rank: 3, name: "Mike Chen", points: 692, badge: "🥉" },
                  { rank: 4, name: "Emma Davis", points: 645, badge: "" },
                  { rank: 5, name: "John Smith", points: 598, badge: "" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{user.badge || `#${user.rank}`}</span>
                      <span className={`font-medium ${user.name === "You" ? "text-blue-600" : ""}`}>
                        {user.name}
                      </span>
                    </div>
                    <span className="font-semibold">{user.points} points</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}