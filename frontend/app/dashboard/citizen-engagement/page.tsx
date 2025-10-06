'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  MessageSquare, 
  Video, 
  BarChart3, 
  Store,
  ArrowRight,
  Sparkles,
  Globe,
  Target,
  TrendingUp
} from 'lucide-react';

// Import your citizen engagement components
import CitizenDashboard from '@/components/PublicFundManagement/CitizenEngagement/CitizenDashboard';
import VirtualTownHall from '@/components/PublicFundManagement/CitizenEngagement/VirtualTownHall';
import CitizenJurySystem from '@/components/PublicFundManagement/CitizenEngagement/CitizenJurySystem';
import CommunityImpactScoring from '@/components/PublicFundManagement/CitizenEngagement/CommunityImpactScoring';
import LocalBusinessIntegration from '@/components/PublicFundManagement/CitizenEngagement/LocalBusinessIntegration';

export default function CitizenEngagementPage() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  const showNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const onError = (error: string) => {
    console.error('Citizen Engagement Error:', error);
    showNotification(`Error: ${error}`);
  };

  const features = [
    {
      id: 'citizen-dashboard',
      title: 'Community Forum & Engagement',
      description: 'Interactive dashboard with community forums, town hall events, and citizen participation tracking',
      icon: Users,
      color: 'blue',
      stats: { users: '2.4K+', posts: '8.9K+', engagement: '94%' }
    },
    {
      id: 'virtual-townhall',
      title: 'Virtual Town Hall Meetings',
      description: 'VR/AR-enabled virtual town hall meetings with real-time participation and immersive experiences',
      icon: Video,
      color: 'purple',
      stats: { meetings: '156+', attendees: '12K+', satisfaction: '96%' }
    },
    {
      id: 'citizen-jury',
      title: 'Democratic Jury System',
      description: 'Qualified citizen juries for democratic proposal evaluation with transparent decision-making',
      icon: BarChart3,
      color: 'green',
      stats: { evaluations: '487+', accuracy: '98%', participation: '87%' }
    },
    {
      id: 'impact-scoring',
      title: 'Community Impact Analytics',
      description: 'Advanced analytics and predictive modeling for measuring real-world project impact',
      icon: TrendingUp,
      color: 'orange',
      stats: { projects: '234+', roi: '340%', impact: '92%' }
    },
    {
      id: 'business-integration',
      title: 'Local Business Integration',
      description: 'Connect local businesses with public projects, partnerships, and economic opportunities',
      icon: Store,
      color: 'emerald',
      stats: { businesses: '127+', partnerships: '156+', jobs: '1.2K+' }
    }
  ];

  const renderFeatureComponent = () => {
    switch (activeFeature) {
      case 'citizen-dashboard':
        return <CitizenDashboard showNotification={showNotification} onError={onError} />;
      case 'virtual-townhall':
        return (
          <VirtualTownHall
            showNotification={showNotification}
            onError={onError}
            eventId={1}
            eventTitle="Community Virtual Town Hall"
          />
        );
      case 'citizen-jury':
        return <CitizenJurySystem showNotification={showNotification} onError={onError} />;
      case 'impact-scoring':
        return <CommunityImpactScoring showNotification={showNotification} onError={onError} />;
      case 'business-integration':
        return <LocalBusinessIntegration showNotification={showNotification} onError={onError} />;
      default:
        return null;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      emerald: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (activeFeature) {
    return (
      <div className="min-h-screen">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setActiveFeature(null)}
            className="flex items-center"
          >
            ← Back to Citizen Engagement Hub
          </Button>
        </div>
        
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg"
              >
                {notification}
              </div>
            ))}
          </div>
        )}
        
        {/* Feature Component */}
        {renderFeatureComponent()}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Citizen Engagement Platform
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Empowering citizens with innovative tools for democratic participation, community engagement, 
          and transparent governance through cutting-edge technology
        </p>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Globe className="h-4 w-4" />
            <span>Global Platform</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>Real Impact</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Community Driven</span>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">15.2K+</div>
            <div className="text-sm text-gray-600">Active Citizens</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <div className="text-sm text-gray-600">Projects Evaluated</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">98.4%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">$2.8M</div>
            <div className="text-sm text-gray-600">Community Impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <Card 
              key={feature.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-200"
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(feature.color)}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {Object.entries(feature.stats).map(([key, value]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded-lg">
                      <div className="font-semibold text-sm">{value}</div>
                      <div className="text-xs text-gray-600 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full group-hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFeature(feature.id);
                  }}
                >
                  Launch {feature.title.split(' ')[0]}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Why Choose Our Citizen Engagement Platform?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-900">🚀 Innovative Features</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• VR/AR virtual town hall meetings</li>
                <li>• AI-powered impact scoring</li>
                <li>• Gamified citizen participation</li>
                <li>• Real-time blockchain integration</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-purple-900">💡 Proven Results</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• 94% increase in civic participation</li>
                <li>• 340% ROI on public investments</li>
                <li>• 98% citizen satisfaction rate</li>
                <li>• 1,200+ local jobs created</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg"
            >
              {notification}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}