'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  TrendingUp,
  Users,
  Heart,
  Leaf,
  Building,
  GraduationCap,
  Shield,
  Zap,
  MapPin,
  Star,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Camera,
  FileText,
  Clock,
  DollarSign,
  Eye,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts';

interface CommunityImpactProps {
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

interface ImpactMetric {
  category: string;
  score: number;
  weight: number;
  indicators: {
    name: string;
    value: number;
    target: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

interface ProjectImpact {
  id: string;
  name: string;
  category: string;
  status: 'completed' | 'ongoing' | 'planned';
  overallScore: number;
  metrics: {
    social: number;
    economic: number;
    environmental: number;
    infrastructure: number;
    education: number;
    safety: number;
  };
  beneficiaries: number;
  startDate: string;
  endDate?: string;
  budget: number;
  actualSpent: number;
  location: string;
  feedback: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface CommunityFeedback {
  id: string;
  projectId: string;
  citizenName: string;
  rating: number;
  comment: string;
  category: string;
  verified: boolean;
  timestamp: string;
  helpfulVotes: number;
  images?: string[];
}

export default function CommunityImpactScoring({ showNotification, onError }: CommunityImpactProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedProject, setSelectedProject] = useState<ProjectImpact | null>(null);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');

  const [overallImpactScore, setOverallImpactScore] = useState(78.5);
  
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetric[]>([
    {
      category: 'Social Development',
      score: 82,
      weight: 0.25,
      indicators: [
        { name: 'Community Engagement', value: 85, target: 80, unit: '%', trend: 'up' },
        { name: 'Public Participation', value: 78, target: 75, unit: '%', trend: 'up' },
        { name: 'Social Cohesion Index', value: 7.2, target: 7.0, unit: '/10', trend: 'stable' },
        { name: 'Accessibility Improvement', value: 89, target: 85, unit: '%', trend: 'up' }
      ]
    },
    {
      category: 'Economic Impact',
      score: 75,
      weight: 0.20,
      indicators: [
        { name: 'Local Jobs Created', value: 245, target: 200, unit: 'jobs', trend: 'up' },
        { name: 'Local Business Growth', value: 12, target: 10, unit: '%', trend: 'up' },
        { name: 'Property Value Increase', value: 8.5, target: 5, unit: '%', trend: 'up' },
        { name: 'Tourism Revenue', value: 1.2, target: 1.0, unit: 'M$', trend: 'up' }
      ]
    },
    {
      category: 'Environmental',
      score: 88,
      weight: 0.20,
      indicators: [
        { name: 'Carbon Footprint Reduction', value: 15, target: 12, unit: '%', trend: 'up' },
        { name: 'Green Space Increase', value: 2.3, target: 2.0, unit: 'km²', trend: 'up' },
        { name: 'Waste Reduction', value: 22, target: 20, unit: '%', trend: 'up' },
        { name: 'Energy Efficiency', value: 93, target: 90, unit: '%', trend: 'stable' }
      ]
    },
    {
      category: 'Infrastructure',
      score: 71,
      weight: 0.15,
      indicators: [
        { name: 'Road Quality Index', value: 7.8, target: 8.0, unit: '/10', trend: 'up' },
        { name: 'Digital Connectivity', value: 94, target: 95, unit: '%', trend: 'stable' },
        { name: 'Public Transport Access', value: 68, target: 75, unit: '%', trend: 'up' },
        { name: 'Utility Reliability', value: 97, target: 98, unit: '%', trend: 'stable' }
      ]
    },
    {
      category: 'Education & Health',
      score: 79,
      weight: 0.10,
      indicators: [
        { name: 'Educational Access', value: 96, target: 95, unit: '%', trend: 'up' },
        { name: 'Healthcare Access', value: 87, target: 90, unit: '%', trend: 'up' },
        { name: 'Literacy Rate', value: 98, target: 97, unit: '%', trend: 'stable' },
        { name: 'Health Outcome Index', value: 8.1, target: 8.0, unit: '/10', trend: 'up' }
      ]
    },
    {
      category: 'Public Safety',
      score: 84,
      weight: 0.10,
      indicators: [
        { name: 'Crime Rate Reduction', value: 18, target: 15, unit: '%', trend: 'up' },
        { name: 'Emergency Response Time', value: 4.2, target: 5.0, unit: 'min', trend: 'up' },
        { name: 'Public Safety Perception', value: 8.3, target: 8.0, unit: '/10', trend: 'stable' },
        { name: 'Traffic Safety Index', value: 91, target: 90, unit: '%', trend: 'up' }
      ]
    }
  ]);

  const [projectImpacts, setProjectImpacts] = useState<ProjectImpact[]>([
    {
      id: 'proj-1',
      name: 'Downtown Park Renovation',
      category: 'Environmental',
      status: 'completed',
      overallScore: 89,
      metrics: {
        social: 92,
        economic: 75,
        environmental: 95,
        infrastructure: 88,
        education: 70,
        safety: 85
      },
      beneficiaries: 15000,
      startDate: '2025-01-15',
      endDate: '2025-08-30',
      budget: 2500000,
      actualSpent: 2350000,
      location: 'Downtown District',
      feedback: { positive: 156, neutral: 23, negative: 8 }
    },
    {
      id: 'proj-2',
      name: 'Public Library Digital Hub',
      category: 'Education',
      status: 'completed',
      overallScore: 85,
      metrics: {
        social: 88,
        economic: 82,
        environmental: 78,
        infrastructure: 90,
        education: 95,
        safety: 80
      },
      beneficiaries: 8500,
      startDate: '2025-03-01',
      endDate: '2025-09-15',
      budget: 850000,
      actualSpent: 820000,
      location: 'Education District',
      feedback: { positive: 124, neutral: 15, negative: 3 }
    },
    {
      id: 'proj-3',
      name: 'Community Sports Complex',
      category: 'Social',
      status: 'ongoing',
      overallScore: 78,
      metrics: {
        social: 90,
        economic: 70,
        environmental: 75,
        infrastructure: 85,
        education: 72,
        safety: 88
      },
      beneficiaries: 12000,
      startDate: '2025-05-01',
      budget: 3200000,
      actualSpent: 1900000,
      location: 'Riverside Area',
      feedback: { positive: 89, neutral: 31, negative: 12 }
    }
  ]);

  const [communityFeedback, setCommunityFeedback] = useState<CommunityFeedback[]>([
    {
      id: 'fb-1',
      projectId: 'proj-1',
      citizenName: 'Sarah Johnson',
      rating: 5,
      comment: 'The park renovation exceeded my expectations! The new playground is amazing and the walking trails are beautiful.',
      category: 'Infrastructure',
      verified: true,
      timestamp: '2025-09-15',
      helpfulVotes: 23,
      images: ['/api/placeholder/300/200']
    },
    {
      id: 'fb-2',
      projectId: 'proj-2',
      citizenName: 'Mike Chen',
      rating: 5,
      comment: 'The digital transformation of our library is incredible. High-speed internet and modern workspaces make it a perfect place to study and work.',
      category: 'Education',
      verified: true,
      timestamp: '2025-09-20',
      helpfulVotes: 18
    },
    {
      id: 'fb-3',
      projectId: 'proj-3',
      citizenName: 'Emma Davis',
      rating: 4,
      comment: 'Great progress on the sports complex! Looking forward to the swimming pool opening next month.',
      category: 'Social',
      verified: true,
      timestamp: '2025-10-02',
      helpfulVotes: 15
    }
  ]);

  const [impactTrends, setImpactTrends] = useState([
    { month: 'Jan', overall: 72, social: 70, economic: 68, environmental: 85, infrastructure: 65, education: 75, safety: 80 },
    { month: 'Feb', overall: 74, social: 72, economic: 70, environmental: 86, infrastructure: 67, education: 76, safety: 81 },
    { month: 'Mar', overall: 75, social: 74, economic: 71, environmental: 87, infrastructure: 68, education: 77, safety: 82 },
    { month: 'Apr', overall: 76, social: 75, economic: 73, environmental: 88, infrastructure: 70, education: 78, safety: 83 },
    { month: 'May', overall: 77, social: 76, economic: 74, environmental: 88, infrastructure: 71, education: 78, safety: 83 },
    { month: 'Jun', overall: 78, social: 78, economic: 75, environmental: 88, infrastructure: 71, education: 79, safety: 84 },
    { month: 'Jul', overall: 78, social: 80, economic: 75, environmental: 88, infrastructure: 71, education: 79, safety: 84 },
    { month: 'Aug', overall: 79, social: 82, economic: 75, environmental: 88, infrastructure: 71, education: 79, safety: 84 },
    { month: 'Sep', overall: 79, social: 82, economic: 75, environmental: 88, infrastructure: 71, education: 79, safety: 84 }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 55) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />;
      default: return <Activity className="h-3 w-3 text-gray-600" />;
    }
  };

  const radarData = impactMetrics.map(metric => ({
    category: metric.category.split(' ')[0],
    score: metric.score,
    target: 80
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Target className="h-8 w-8 mr-3 text-blue-600" />
            Community Impact Scoring
          </h1>
          <p className="text-muted-foreground">
            Measuring and tracking the real-world impact of public fund projects
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border">
            <span className="text-sm font-medium">Time Range:</span>
            {['1M', '3M', '6M', '1Y', 'ALL'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range as any)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Badge className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
            Overall Score: {overallImpactScore}
          </Badge>
        </div>
      </div>

      {/* Overall Impact Score */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-blue-600 mb-2">{overallImpactScore}</div>
            <div className="text-xl text-gray-600 mb-4">Community Impact Score</div>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">42,500</div>
                <div className="text-sm text-gray-600">Citizens Benefited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">$12.7M</div>
                <div className="text-sm text-gray-600">Investment Impact</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Impact Overview</TabsTrigger>
          <TabsTrigger value="projects">Project Impact</TabsTrigger>
          <TabsTrigger value="feedback">Community Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        {/* Impact Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Impact Categories */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {impactMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.category}</CardTitle>
                    <Badge className={getScoreBadgeColor(metric.score)}>
                      {metric.score}/100
                    </Badge>
                  </div>
                  <Progress value={metric.score} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  {metric.indicators.slice(0, 2).map((indicator, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(indicator.trend)}
                        <span>{indicator.name}</span>
                      </div>
                      <span className={getScoreColor(metric.score)}>
                        {indicator.value} {indicator.unit}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full">
                      View All Indicators
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Impact Trends Over Time</CardTitle>
              <CardDescription>
                Track how community impact scores change across different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={impactTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="overall" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="social" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="economic" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="environmental" stroke="#F59E0B" strokeWidth={2} />
                  <Line type="monotone" dataKey="infrastructure" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="education" stroke="#06B6D4" strokeWidth={2} />
                  <Line type="monotone" dataKey="safety" stroke="#F97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Key Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Recent Impact Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Environmental Excellence</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Achieved 15% carbon footprint reduction, exceeding our 12% target through renewable energy projects.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Economic Growth</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Created 245 local jobs through infrastructure projects, boosting community employment by 12%.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">Community Engagement</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      85% community participation rate in public forums, strengthening democratic participation.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-orange-600" />
                      <span className="font-semibold text-orange-800">Safety Improvement</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      18% reduction in crime rate and 4.2-minute emergency response time improvement.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Project Impact Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="space-y-4">
            {projectImpacts.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.location} • {project.beneficiaries.toLocaleString()} beneficiaries
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={project.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' : 
                                      'bg-gray-100 text-gray-800'}>
                        {project.status.toUpperCase()}
                      </Badge>
                      <Badge className={getScoreBadgeColor(project.overallScore)}>
                        {project.overallScore}/100
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Project Metrics Radar */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Impact Distribution</h4>
                      <div className="space-y-2">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize">{key}:</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={value} className="w-20 h-2" />
                              <span className={`text-sm font-medium ${getScoreColor(value)}`}>
                                {value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Project Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span>${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span>${project.actualSpent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Efficiency:</span>
                          <span className="text-green-600">
                            {((project.budget - project.actualSpent) / project.budget * 100).toFixed(1)}% under budget
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>
                            {project.endDate ? 
                              `${Math.round((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months` :
                              'Ongoing'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Community Feedback Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Community Feedback</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">{project.feedback.positive}</div>
                        <div className="text-sm text-gray-600">Positive</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-600">{project.feedback.neutral}</div>
                        <div className="text-sm text-gray-600">Neutral</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{project.feedback.negative}</div>
                        <div className="text-sm text-gray-600">Negative</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress 
                        value={(project.feedback.positive / (project.feedback.positive + project.feedback.neutral + project.feedback.negative)) * 100} 
                        className="h-2"
                      />
                      <div className="text-xs text-center mt-1 text-gray-600">
                        {Math.round((project.feedback.positive / (project.feedback.positive + project.feedback.neutral + project.feedback.negative)) * 100)}% satisfaction rate
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setSelectedProject(project)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Feedback Tab */}
        <TabsContent value="feedback" className="space-y-4">
          {/* Feedback Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Share Your Project Experience
              </CardTitle>
              <CardDescription>
                Help us measure community impact by sharing your experience with completed projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Select Project</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    {projectImpacts.filter(p => p.status === 'completed').map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Impact Category</label>
                  <select className="w-full px-3 py-2 border rounded-md">
                    <option>Social Development</option>
                    <option>Economic Impact</option>
                    <option>Environmental</option>
                    <option>Infrastructure</option>
                    <option>Education & Health</option>
                    <option>Public Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Overall Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button key={rating} variant="ghost" size="sm">
                      <Star className="h-6 w-6 text-yellow-400 fill-current" />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Experience</label>
                <Textarea 
                  placeholder="Describe how this project impacted you and your community..."
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

          {/* Recent Feedback */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Community Feedback</h3>
            {communityFeedback.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{feedback.citizenName}</span>
                        {feedback.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{feedback.timestamp}</span>
                        <Badge variant="outline">{feedback.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{feedback.rating}/5</div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{feedback.comment}</p>

                  {feedback.images && feedback.images.length > 0 && (
                    <div className="mb-4">
                      <img 
                        src={feedback.images[0]} 
                        alt="Project feedback" 
                        className="rounded-lg max-h-48 w-auto"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({feedback.helpfulVotes})
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">
                      Project: {projectImpacts.find(p => p.id === feedback.projectId)?.name}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Score Radar</CardTitle>
                <CardDescription>
                  Current performance vs targets across all impact categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#EF4444"
                      fill="transparent"
                      strokeDasharray="5 5"
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Impact ROI */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Return on Investment</CardTitle>
                <CardDescription>
                  Measuring value generated per dollar invested
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectImpacts.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{project.name}</span>
                        <Badge className={getScoreBadgeColor(project.overallScore)}>
                          ROI: {(project.overallScore / (project.actualSpent / 1000000)).toFixed(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Impact Score: {project.overallScore} | Investment: ${(project.actualSpent / 1000000).toFixed(1)}M
                      </div>
                      <Progress value={project.overallScore} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Impact Model */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Predictive Impact Analysis
              </CardTitle>
              <CardDescription>
                AI-powered predictions for future community impact based on current trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85.2</div>
                  <div className="text-sm text-gray-600">Predicted Score (Next Quarter)</div>
                  <div className="text-xs text-green-600 mt-1">↗ +6.7 improvement</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600">Project Success Likelihood</div>
                  <div className="text-xs text-green-600 mt-1">Based on current trends</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">58K</div>
                  <div className="text-sm text-gray-600">Projected Beneficiaries</div>
                  <div className="text-xs text-blue-600 mt-1">Next 6 months</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}