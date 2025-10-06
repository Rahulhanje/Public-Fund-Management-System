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
  Store,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  Handshake,
  Building,
  Award,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  Phone,
  Mail,
  Globe,
  Camera,
  FileText,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  PieChart,
  ShoppingBag,
  Briefcase,
  Heart,
  ThumbsUp,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie } from 'recharts';

interface LocalBusinessProps {
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  owner: string;
  location: string;
  established: string;
  employees: number;
  website?: string;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  verified: boolean;
  partnershipLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  services: string[];
  projectsParticipated: number;
  communityImpact: number;
  avatar?: string;
  images?: string[];
}

interface Partnership {
  id: string;
  businessId: string;
  projectId: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate?: string;
  value: number;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  performance: number;
  deliverables: string[];
  milestones: { name: string; completed: boolean; date: string }[];
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  requirements: string[];
  projectId: string;
  applicants: number;
  status: 'open' | 'reviewing' | 'awarded' | 'closed';
  postedDate: string;
}

export default function LocalBusinessIntegration({ showNotification, onError }: LocalBusinessProps) {
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPartnershipLevel, setSelectedPartnershipLevel] = useState('all');

  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: 'bus-1',
      name: 'GreenTech Solutions',
      category: 'Technology',
      description: 'Sustainable technology solutions for smart city initiatives and environmental monitoring.',
      owner: 'Sarah Mitchell',
      location: 'Tech District',
      established: '2020',
      employees: 25,
      website: 'greentech-solutions.com',
      phone: '(555) 123-4567',
      email: 'contact@greentech-solutions.com',
      rating: 4.8,
      reviews: 47,
      verified: true,
      partnershipLevel: 'gold',
      services: ['Smart Sensors', 'IoT Solutions', 'Data Analytics', 'Environmental Monitoring'],
      projectsParticipated: 8,
      communityImpact: 92
    },
    {
      id: 'bus-2',
      name: 'Community Builders Co.',
      category: 'Construction',
      description: 'Local construction company specializing in public infrastructure and community spaces.',
      owner: 'Mike Rodriguez',
      location: 'Industrial Zone',
      established: '2015',
      employees: 45,
      phone: '(555) 234-5678',
      email: 'info@communitybuilders.com',
      rating: 4.6,
      reviews: 89,
      verified: true,
      partnershipLevel: 'platinum',
      services: ['Construction', 'Project Management', 'Infrastructure', 'Renovations'],
      projectsParticipated: 15,
      communityImpact: 88
    },
    {
      id: 'bus-3',
      name: 'EcoScape Designs',
      category: 'Landscaping',
      description: 'Sustainable landscaping and urban design for parks, gardens, and public spaces.',
      owner: 'Emma Chen',
      location: 'Riverside Area',
      established: '2018',
      employees: 18,
      website: 'ecoscape-designs.com',
      phone: '(555) 345-6789',
      email: 'hello@ecoscape-designs.com',
      rating: 4.9,
      reviews: 34,
      verified: true,
      partnershipLevel: 'silver',
      services: ['Landscape Design', 'Garden Maintenance', 'Urban Planning', 'Sustainability Consulting'],
      projectsParticipated: 6,
      communityImpact: 95
    },
    {
      id: 'bus-4',
      name: 'Digital Learning Hub',
      category: 'Education',
      description: 'Educational technology and training services for public institutions and community programs.',
      owner: 'James Wilson',
      location: 'Education District',
      established: '2019',
      employees: 12,
      website: 'digitallearninghub.org',
      phone: '(555) 456-7890',
      email: 'learn@digitallearninghub.org',
      rating: 4.7,
      reviews: 28,
      verified: true,
      partnershipLevel: 'gold',
      services: ['Training Programs', 'E-Learning Platforms', 'Curriculum Development', 'Digital Literacy'],
      projectsParticipated: 4,
      communityImpact: 91
    },
    {
      id: 'bus-5',
      name: 'LocalCraft Artisans',
      category: 'Arts & Culture',
      description: 'Local artisan collective creating custom artwork and cultural installations for public spaces.',
      owner: 'Lisa Thompson',
      location: 'Arts Quarter',
      established: '2017',
      employees: 8,
      phone: '(555) 567-8901',
      email: 'create@localcraft.com',
      rating: 4.5,
      reviews: 52,
      verified: false,
      partnershipLevel: 'bronze',
      services: ['Custom Artwork', 'Murals', 'Sculptures', 'Community Art Programs'],
      projectsParticipated: 3,
      communityImpact: 87
    }
  ]);

  const [partnerships, setPartnerships] = useState<Partnership[]>([
    {
      id: 'part-1',
      businessId: 'bus-1',
      projectId: 'proj-1',
      projectName: 'Smart City Infrastructure',
      role: 'Technology Provider',
      startDate: '2025-06-01',
      endDate: '2025-12-31',
      value: 450000,
      status: 'active',
      performance: 92,
      deliverables: ['Smart Traffic Sensors', 'Environmental Monitoring System', 'Data Dashboard'],
      milestones: [
        { name: 'Sensor Installation', completed: true, date: '2025-07-15' },
        { name: 'System Integration', completed: true, date: '2025-08-30' },
        { name: 'Testing & Optimization', completed: false, date: '2025-10-15' },
        { name: 'Final Deployment', completed: false, date: '2025-12-15' }
      ]
    },
    {
      id: 'part-2',
      businessId: 'bus-2',
      projectId: 'proj-2',
      projectName: 'Community Center Renovation',
      role: 'General Contractor',
      startDate: '2025-03-01',
      endDate: '2025-09-30',
      value: 1200000,
      status: 'completed',
      performance: 95,
      deliverables: ['Complete Renovation', 'ADA Compliance', 'Energy Efficiency Upgrades'],
      milestones: [
        { name: 'Demolition', completed: true, date: '2025-03-15' },
        { name: 'Structural Work', completed: true, date: '2025-05-30' },
        { name: 'Interior Finishing', completed: true, date: '2025-08-15' },
        { name: 'Final Inspection', completed: true, date: '2025-09-25' }
      ]
    }
  ]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: 'opp-1',
      title: 'Public Library Digital Upgrade',
      description: 'Seeking technology partner to modernize library systems with digital resources and interactive learning spaces.',
      category: 'Technology',
      budget: 350000,
      deadline: '2025-11-15',
      requirements: ['Digital Infrastructure', 'User Training', 'Ongoing Support'],
      projectId: 'proj-lib-1',
      applicants: 8,
      status: 'open',
      postedDate: '2025-10-01'
    },
    {
      id: 'opp-2',
      title: 'Downtown Park Landscaping',
      description: 'Professional landscaping services needed for new downtown park including sustainable design and maintenance planning.',
      category: 'Landscaping',
      budget: 180000,
      deadline: '2025-10-30',
      requirements: ['Sustainable Design', 'Native Plants', 'Irrigation System'],
      projectId: 'proj-park-2',
      applicants: 5,
      status: 'reviewing',
      postedDate: '2025-09-15'
    },
    {
      id: 'opp-3',
      title: 'Community Safety Training Program',
      description: 'Educational services to develop and deliver safety training programs for community members and local businesses.',
      category: 'Education',
      budget: 75000,
      deadline: '2025-12-01',
      requirements: ['Curriculum Development', 'Certified Instructors', 'Materials'],
      projectId: 'proj-safety-1',
      applicants: 12,
      status: 'open',
      postedDate: '2025-09-28'
    }
  ]);

  const [businessStats, setBusinessStats] = useState({
    totalBusinesses: 127,
    verifiedPartners: 89,
    activeProjects: 23,
    totalPartnerships: 156,
    economicImpact: 12700000,
    jobsSupported: 1250,
    averageRating: 4.6,
    partnerSatisfaction: 93
  });
  const [categoryData, setCategoryData] = useState([
    { name: 'Technology', value: 25, businesses: 32 },
    { name: 'Construction', value: 20, businesses: 28 },
    { name: 'Landscaping', value: 15, businesses: 18 },
    { name: 'Education', value: 12, businesses: 15 },
    { name: 'Arts & Culture', value: 10, businesses: 12 },
    { name: 'Healthcare', value: 8, businesses: 11 },
    { name: 'Other', value: 10, businesses: 11 }
  ]);

  const [economicTrends, setEconomicTrends] = useState([
    { month: 'Jan', partnerships: 45, revenue: 2.1, jobs: 180 },
    { month: 'Feb', partnerships: 48, revenue: 2.3, jobs: 195 },
    { month: 'Mar', partnerships: 52, revenue: 2.8, jobs: 220 },
    { month: 'Apr', partnerships: 55, revenue: 3.1, jobs: 245 },
    { month: 'May', partnerships: 58, revenue: 3.4, jobs: 270 },
    { month: 'Jun', partnerships: 62, revenue: 3.8, jobs: 295 },
    { month: 'Jul', partnerships: 65, revenue: 4.2, jobs: 320 },
    { month: 'Aug', partnerships: 68, revenue: 4.5, jobs: 340 },
    { month: 'Sep', partnerships: 71, revenue: 4.8, jobs: 365 }
  ]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

  const getPartnershipLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'open': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': case 'awarded': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': case 'reviewing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': case 'closed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || business.category === selectedCategory;
    const matchesPartnership = selectedPartnershipLevel === 'all' || business.partnershipLevel === selectedPartnershipLevel;
    return matchesSearch && matchesCategory && matchesPartnership;
  });

  const applyForOpportunity = (opportunityId: string) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === opportunityId 
        ? { ...opp, applicants: opp.applicants + 1 }
        : opp
    ));
    showNotification('Your application has been submitted successfully!');
  };

  const verifyBusiness = (businessId: string) => {
    setBusinesses(prev => prev.map(business => 
      business.id === businessId 
        ? { ...business, verified: true }
        : business
    ));
    showNotification('Business has been verified and added to the partner network!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Store className="h-8 w-8 mr-3 text-blue-600" />
            Local Business Integration Hub
          </h1>
          <p className="text-muted-foreground">
            Connecting local businesses with public fund projects and community opportunities
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <Building className="h-3 w-3 mr-1" />
            {businessStats.totalBusinesses} local partners
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Register Business
          </Button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Businesses</p>
                <p className="text-2xl font-bold">{businessStats.totalBusinesses}</p>
              </div>
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Economic Impact</p>
                <p className="text-2xl font-bold">${(businessStats.economicImpact / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jobs Supported</p>
                <p className="text-2xl font-bold">{businessStats.jobsSupported.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-2xl font-bold">{businessStats.activeProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="directory">Business Directory</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="partnerships">Active Partnerships</TabsTrigger>
          <TabsTrigger value="analytics">Business Analytics</TabsTrigger>
        </TabsList>

        {/* Business Directory Tab */}
        <TabsContent value="directory" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <Input
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="md:col-span-2"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categoryData.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <select
                  value={selectedPartnershipLevel}
                  onChange={(e) => setSelectedPartnershipLevel(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Partnership Levels</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Business Listings */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <CardDescription>{business.category}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-1">
                      {business.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <Badge className={getPartnershipLevelColor(business.partnershipLevel)}>
                        {business.partnershipLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{business.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{business.rating}</span>
                      <span className="text-gray-600">({business.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{business.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {business.services.slice(0, 2).map((service, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                    {business.services.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{business.services.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>Projects: {business.projectsParticipated}</div>
                    <div>Employees: {business.employees}</div>
                    <div>Impact Score: {business.communityImpact}</div>
                    <div>Since: {business.established}</div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      {business.website && (
                        <Button variant="ghost" size="sm">
                          <Globe className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="sm" onClick={() => setSelectedBusiness(business)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{opportunity.title}</CardTitle>
                      <CardDescription className="mt-1">{opportunity.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(opportunity.status)}>
                        {opportunity.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{opportunity.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Budget:</span>
                      <p>${opportunity.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span>
                      <p>{new Date(opportunity.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Applicants:</span>
                      <p>{opportunity.applicants} businesses</p>
                    </div>
                    <div>
                      <span className="font-medium">Posted:</span>
                      <p>{new Date(opportunity.postedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium text-sm">Requirements:</span>
                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                      {opportunity.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm text-gray-600">
                      {Math.ceil((new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {opportunity.status === 'open' && (
                        <Button size="sm" onClick={() => applyForOpportunity(opportunity.id)}>
                          <Handshake className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Partnerships Tab */}
        <TabsContent value="partnerships" className="space-y-4">
          <div className="space-y-4">
            {partnerships.map((partnership) => {
              const business = businesses.find(b => b.id === partnership.businessId);
              return (
                <Card key={partnership.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{partnership.projectName}</CardTitle>
                        <CardDescription className="mt-1">
                          {business?.name} • {partnership.role}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(partnership.status)}>
                          {partnership.status.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">
                          ${partnership.value.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Start Date:</span>
                        <p>{new Date(partnership.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium">End Date:</span>
                        <p>{partnership.endDate ? new Date(partnership.endDate).toLocaleDateString() : 'Ongoing'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Performance:</span>
                        <p className="text-green-600">{partnership.performance}%</p>
                      </div>
                      <div>
                        <span className="font-medium">Deliverables:</span>
                        <p>{partnership.deliverables.length} items</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-sm">Project Progress</span>
                        <span className="text-sm text-gray-600">
                          {partnership.milestones.filter(m => m.completed).length} / {partnership.milestones.length} milestones
                        </span>
                      </div>
                      <Progress 
                        value={(partnership.milestones.filter(m => m.completed).length / partnership.milestones.length) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <span className="font-medium text-sm">Recent Milestones:</span>
                      <div className="space-y-2 mt-2">
                        {partnership.milestones.slice(-3).map((milestone, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                              <span>{milestone.name}</span>
                            </div>
                            <span className="text-gray-600">{new Date(milestone.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Business Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Business Categories Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Business Categories</CardTitle>
                <CardDescription>Distribution of local businesses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Economic Impact Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Economic Impact Trends</CardTitle>
                <CardDescription>Monthly business engagement and economic activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={economicTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="partnerships" stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Partnership Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Partnership Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for business partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{businessStats.partnerSatisfaction}%</div>
                  <div className="text-sm text-gray-600">Partner Satisfaction</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{businessStats.averageRating}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{businessStats.verifiedPartners}</div>
                  <div className="text-sm text-gray-600">Verified Partners</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">94%</div>
                  <div className="text-sm text-gray-600">On-Time Delivery</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Businesses */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Partners</CardTitle>
              <CardDescription>Businesses with highest community impact and performance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businesses
                  .sort((a, b) => b.communityImpact - a.communityImpact)
                  .slice(0, 5)
                  .map((business, index) => (
                    <div key={business.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-semibold">{business.name}</p>
                          <p className="text-sm text-gray-600">{business.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{business.communityImpact}</div>
                        <div className="text-sm text-gray-600">Impact Score</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Business Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{selectedBusiness.name}</CardTitle>
                  <CardDescription className="mt-1">{selectedBusiness.description}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedBusiness(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Business Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Business Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Owner:</span>
                      <span>{selectedBusiness.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Established:</span>
                      <span>{selectedBusiness.established}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employees:</span>
                      <span>{selectedBusiness.employees}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{selectedBusiness.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partnership Level:</span>
                      <Badge className={getPartnershipLevelColor(selectedBusiness.partnershipLevel)}>
                        {selectedBusiness.partnershipLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Community Impact</span>
                        <span className="text-sm font-medium">{selectedBusiness.communityImpact}/100</span>
                      </div>
                      <Progress value={selectedBusiness.communityImpact} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Customer Rating</span>
                        <span className="text-sm font-medium">{selectedBusiness.rating}/5</span>
                      </div>
                      <Progress value={selectedBusiness.rating * 20} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-600">
                      Projects Participated: {selectedBusiness.projectsParticipated}
                    </div>
                    <div className="text-sm text-gray-600">
                      Customer Reviews: {selectedBusiness.reviews}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="font-semibold mb-3">Services Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBusiness.services.map((service, idx) => (
                    <Badge key={idx} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{selectedBusiness.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <span className="text-sm">{selectedBusiness.email}</span>
                  </div>
                  {selectedBusiness.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{selectedBusiness.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                {!selectedBusiness.verified && (
                  <Button 
                    variant="outline" 
                    onClick={() => verifyBusiness(selectedBusiness.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Business
                  </Button>
                )}
                <Button>
                  <Handshake className="h-4 w-4 mr-2" />
                  Start Partnership
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}