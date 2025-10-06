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
  Users,
  Scale,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Gavel,
  Eye,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Award,
  Shield,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  DollarSign,
  BarChart3,
  Vote,
  User,
  Crown,
  Zap
} from 'lucide-react';

interface CitizenJuryProps {
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

interface JuryMember {
  id: string;
  name: string;
  expertise: string[];
  reputation: number;
  location: string;
  casesEvaluated: number;
  accuracy: number;
  isSelected: boolean;
  avatar?: string;
}

interface ProposalCase {
  id: string;
  title: string;
  description: string;
  requestedAmount: number;
  category: string;
  submittedBy: string;
  submissionDate: string;
  deadline: string;
  status: 'pending' | 'in-review' | 'voting' | 'decided' | 'appealed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  documents: string[];
  currentPhase: 'selection' | 'deliberation' | 'voting' | 'verdict';
  jurySize: number;
  votesNeeded: number;
  currentVotes: { support: number; oppose: number; abstain: number };
}

interface JuryDecision {
  caseId: string;
  jurorId: string;
  decision: 'support' | 'oppose' | 'abstain';
  reasoning: string;
  confidenceLevel: number;
  timestamp: string;
}

interface EvaluationCriteria {
  feasibility: number;
  impact: number;
  necessity: number;
  budgetJustification: number;
  timeline: number;
  sustainability: number;
}

export default function CitizenJurySystem({ showNotification, onError }: CitizenJuryProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCase, setSelectedCase] = useState<ProposalCase | null>(null);
  const [userRole, setUserRole] = useState<'citizen' | 'juror' | 'coordinator'>('citizen');
  const [evaluationCriteria, setEvaluationCriteria] = useState<EvaluationCriteria>({
    feasibility: 0,
    impact: 0,
    necessity: 0,
    budgetJustification: 0,
    timeline: 0,
    sustainability: 0
  });
  const [jurorReasoning, setJurorReasoning] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(50);

  const [availableJurors, setAvailableJurors] = useState<JuryMember[]>([
    {
      id: 'j1',
      name: 'Dr. Sarah Mitchell',
      expertise: ['Urban Planning', 'Environmental Science'],
      reputation: 95,
      location: 'Downtown District',
      casesEvaluated: 23,
      accuracy: 91,
      isSelected: true
    },
    {
      id: 'j2',
      name: 'Mike Rodriguez',
      expertise: ['Finance', 'Public Administration'],
      reputation: 88,
      location: 'Riverside Area',
      casesEvaluated: 31,
      accuracy: 87,
      isSelected: true
    },
    {
      id: 'j3',
      name: 'Emma Chen',
      expertise: ['Education', 'Community Development'],
      reputation: 92,
      location: 'Education District',
      casesEvaluated: 18,
      accuracy: 94,
      isSelected: true
    },
    {
      id: 'j4',
      name: 'James Wilson',
      expertise: ['Engineering', 'Infrastructure'],
      reputation: 89,
      location: 'Industrial Zone',
      casesEvaluated: 27,
      accuracy: 85,
      isSelected: false
    },
    {
      id: 'j5',
      name: 'Lisa Thompson',
      expertise: ['Healthcare', 'Social Services'],
      reputation: 94,
      location: 'Medical District',
      casesEvaluated: 15,
      accuracy: 96,
      isSelected: false
    }
  ]);

  const [currentCases, setCurrentCases] = useState<ProposalCase[]>([
    {
      id: 'case-1',
      title: 'Community Sports Complex Development',
      description: 'Proposal to build a new sports complex with swimming pool, basketball courts, and fitness facilities in the downtown area.',
      requestedAmount: 2500000,
      category: 'Infrastructure',
      submittedBy: 'Downtown Community Association',
      submissionDate: '2025-10-01',
      deadline: '2025-10-20',
      status: 'voting',
      priority: 'high',
      documents: ['proposal.pdf', 'budget.xlsx', 'site-plan.pdf'],
      currentPhase: 'voting',
      jurySize: 7,
      votesNeeded: 5,
      currentVotes: { support: 4, oppose: 2, abstain: 1 }
    },
    {
      id: 'case-2',
      title: 'Public Library Digital Transformation',
      description: 'Modernization of all public libraries with digital resources, high-speed internet, and collaborative workspaces.',
      requestedAmount: 850000,
      category: 'Education',
      submittedBy: 'City Library Board',
      submissionDate: '2025-09-28',
      deadline: '2025-10-25',
      status: 'in-review',
      priority: 'medium',
      documents: ['digital-plan.pdf', 'cost-analysis.pdf'],
      currentPhase: 'deliberation',
      jurySize: 5,
      votesNeeded: 3,
      currentVotes: { support: 0, oppose: 0, abstain: 0 }
    },
    {
      id: 'case-3',
      title: 'Emergency Response Center Upgrade',
      description: 'Upgrading the emergency response center with latest technology and expanding capacity for better disaster preparedness.',
      requestedAmount: 1200000,
      category: 'Public Safety',
      submittedBy: 'Emergency Services Department',
      submissionDate: '2025-10-03',
      deadline: '2025-10-15',
      status: 'pending',
      priority: 'urgent',
      documents: ['emergency-plan.pdf', 'equipment-specs.pdf', 'training-schedule.pdf'],
      currentPhase: 'selection',
      jurySize: 9,
      votesNeeded: 6,
      currentVotes: { support: 0, oppose: 0, abstain: 0 }
    }
  ]);

  const [juryStats, setJuryStats] = useState({
    totalCases: 47,
    casesThisMonth: 8,
    averageDecisionTime: '5.2 days',
    jurorSatisfaction: 94,
    publicTrust: 87,
    appealRate: 12,
    activeJurors: 156,
    expertiseCategories: 23
  });

  const [recentDecisions, setRecentDecisions] = useState([
    {
      caseId: 'case-prev-1',
      title: 'Park Renovation Project',
      decision: 'Approved',
      juryScore: 8.5,
      date: '2025-09-30',
      appeal: false
    },
    {
      caseId: 'case-prev-2',
      title: 'Traffic Light Modernization',
      decision: 'Approved with Conditions',
      juryScore: 7.2,
      date: '2025-09-28',
      appeal: false
    },
    {
      caseId: 'case-prev-3',
      title: 'Shopping Center Development',
      decision: 'Rejected',
      juryScore: 4.1,
      date: '2025-09-25',
      appeal: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'voting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'decided': return 'bg-green-100 text-green-800 border-green-200';
      case 'appealed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleJuryApplication = () => {
    showNotification('Your application to become a jury member has been submitted for review!');
  };

  const submitEvaluation = () => {
    if (!selectedCase) return;

    const averageScore = Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) / 6;
    const decision = averageScore >= 7 ? 'support' : averageScore >= 4 ? 'abstain' : 'oppose';

    // Update case votes
    setCurrentCases(prev => prev.map(case_ => 
      case_.id === selectedCase.id 
        ? {
            ...case_,
            currentVotes: {
              ...case_.currentVotes,
              [decision]: case_.currentVotes[decision as keyof typeof case_.currentVotes] + 1
            }
          }
        : case_
    ));

    showNotification(`Your evaluation has been submitted. Decision: ${decision.toUpperCase()}`);
    setSelectedCase(null);
    setEvaluationCriteria({
      feasibility: 0,
      impact: 0,
      necessity: 0,
      budgetJustification: 0,
      timeline: 0,
      sustainability: 0
    });
    setJurorReasoning('');
    setConfidenceLevel(50);
  };

  const applyForJury = () => {
    setUserRole('juror');
    showNotification('Congratulations! You are now qualified to serve as a citizen juror.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Scale className="h-8 w-8 mr-3 text-blue-600" />
            Citizen Jury System
          </h1>
          <p className="text-muted-foreground">
            Democratic evaluation of public fund proposals by qualified citizen juries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            {juryStats.activeJurors} active jurors
          </Badge>
          {userRole === 'citizen' && (
            <Button onClick={applyForJury}>
              <Gavel className="h-4 w-4 mr-2" />
              Apply to be a Juror
            </Button>
          )}
          {userRole === 'juror' && (
            <Badge className="bg-blue-600 text-white">
              <Crown className="h-3 w-3 mr-1" />
              Certified Juror
            </Badge>
          )}
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold">{juryStats.totalCases}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Decision Time</p>
                <p className="text-2xl font-bold">{juryStats.averageDecisionTime}</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Public Trust</p>
                <p className="text-2xl font-bold">{juryStats.publicTrust}%</p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Appeal Rate</p>
                <p className="text-2xl font-bold">{juryStats.appealRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="cases">Active Cases</TabsTrigger>
          <TabsTrigger value="jury-pool">Jury Pool</TabsTrigger>
          <TabsTrigger value="decisions">Past Decisions</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Active Cases Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Vote className="h-5 w-5 mr-2" />
                  Cases Requiring Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCases.filter(case_ => case_.status !== 'decided').map((case_) => (
                  <div key={case_.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{case_.title}</h4>
                        <p className="text-sm text-gray-600">{case_.category}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(case_.priority)}>
                          {case_.priority}
                        </Badge>
                        <Badge className={getStatusColor(case_.status)}>
                          {case_.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Amount: ${case_.requestedAmount.toLocaleString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Phase: {case_.currentPhase}
                      </span>
                      <Button size="sm" onClick={() => setSelectedCase(case_)}>
                        {userRole === 'juror' ? 'Evaluate' : 'View Details'}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Recent Jury Decisions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDecisions.map((decision, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{decision.title}</h4>
                        <p className="text-sm text-gray-600">{decision.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          decision.decision.includes('Approved') ? 'bg-green-100 text-green-800' :
                          decision.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {decision.decision}
                        </Badge>
                        {decision.appeal && (
                          <Badge variant="outline" className="text-orange-600">
                            Appealed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Jury Score: {decision.juryScore}/10
                      </span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < decision.juryScore / 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Jury System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Juror Satisfaction</span>
                    <span className="text-sm text-gray-600">{juryStats.jurorSatisfaction}%</span>
                  </div>
                  <Progress value={juryStats.jurorSatisfaction} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Public Trust</span>
                    <span className="text-sm text-gray-600">{juryStats.publicTrust}%</span>
                  </div>
                  <Progress value={juryStats.publicTrust} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Decision Accuracy</span>
                    <span className="text-sm text-gray-600">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Cases Tab */}
        <TabsContent value="cases" className="space-y-4">
          <div className="space-y-4">
            {currentCases.map((case_) => (
              <Card key={case_.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{case_.title}</CardTitle>
                      <CardDescription className="mt-2">{case_.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(case_.priority)}>
                        {case_.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(case_.status)}>
                        {case_.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Amount:</span>
                      <p>${case_.requestedAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>
                      <p>{case_.category}</p>
                    </div>
                    <div>
                      <span className="font-medium">Deadline:</span>
                      <p>{new Date(case_.deadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">Submitted by:</span>
                      <p>{case_.submittedBy}</p>
                    </div>
                  </div>

                  {case_.status === 'voting' && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Current Voting Status</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{case_.currentVotes.support}</div>
                          <div className="text-sm text-gray-600">Support</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{case_.currentVotes.oppose}</div>
                          <div className="text-sm text-gray-600">Oppose</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-600">{case_.currentVotes.abstain}</div>
                          <div className="text-sm text-gray-600">Abstain</div>
                        </div>
                      </div>
                      <Progress 
                        value={(case_.currentVotes.support / case_.jurySize) * 100} 
                        className="h-2"
                      />
                      <div className="text-sm text-gray-600 text-center">
                        {case_.votesNeeded - case_.currentVotes.support} more votes needed for approval
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Jury Size: {case_.jurySize} members | Phase: {case_.currentPhase}
                    </div>
                    <Button 
                      onClick={() => setSelectedCase(case_)}
                      variant={userRole === 'juror' ? 'default' : 'outline'}
                    >
                      {userRole === 'juror' ? 'Evaluate Case' : 'View Details'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Jury Pool Tab */}
        <TabsContent value="jury-pool" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableJurors.map((juror) => (
              <Card key={juror.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{juror.name}</CardTitle>
                      <CardDescription>{juror.location}</CardDescription>
                    </div>
                    {juror.isSelected && (
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Reputation</span>
                      <span className="text-sm text-gray-600">{juror.reputation}%</span>
                    </div>
                    <Progress value={juror.reputation} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-sm text-gray-600">{juror.accuracy}%</span>
                    </div>
                    <Progress value={juror.accuracy} className="h-2" />
                  </div>

                  <div>
                    <span className="text-sm font-medium">Expertise:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {juror.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Cases Evaluated: {juror.casesEvaluated}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Past Decisions Tab */}
        <TabsContent value="decisions" className="space-y-4">
          <div className="space-y-4">
            {recentDecisions.map((decision, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{decision.title}</h3>
                      <p className="text-sm text-gray-600">{decision.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={
                        decision.decision.includes('Approved') ? 'bg-green-100 text-green-800' :
                        decision.decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {decision.decision}
                      </Badge>
                      {decision.appeal && (
                        <Badge variant="outline" className="text-orange-600">
                          Under Appeal
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 mr-2">Jury Score:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < decision.juryScore / 2 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm font-medium">{decision.juryScore}/10</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Evaluation Modal */}
      {selectedCase && userRole === 'juror' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Evaluate Case: {selectedCase.title}</CardTitle>
              <CardDescription>
                Please carefully evaluate this proposal based on the criteria below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Case Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><strong>Description:</strong> {selectedCase.description}</p>
                  <p className="mb-2"><strong>Amount:</strong> ${selectedCase.requestedAmount.toLocaleString()}</p>
                  <p className="mb-2"><strong>Category:</strong> {selectedCase.category}</p>
                  <p><strong>Submitted by:</strong> {selectedCase.submittedBy}</p>
                </div>
              </div>

              {/* Evaluation Criteria */}
              <div>
                <h3 className="font-semibold mb-4">Evaluation Criteria (Rate 1-10)</h3>
                <div className="space-y-4">
                  {Object.entries(evaluationCriteria).map(([criterion, value]) => (
                    <div key={criterion}>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium capitalize">
                          {criterion.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <span className="text-sm text-gray-600">{value}/10</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={(e) => setEvaluationCriteria(prev => ({
                          ...prev,
                          [criterion]: parseInt(e.target.value)
                        }))}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Confidence in Decision</label>
                  <span className="text-sm text-gray-600">{confidenceLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Reasoning */}
              <div>
                <label className="block text-sm font-medium mb-2">Reasoning (Required)</label>
                <Textarea
                  placeholder="Please provide detailed reasoning for your evaluation..."
                  value={jurorReasoning}
                  onChange={(e) => setJurorReasoning(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Overall Score */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(Object.values(evaluationCriteria).reduce((a, b) => a + b, 0) / 6).toFixed(1)}/10
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedCase(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={submitEvaluation}
                  disabled={!jurorReasoning.trim() || Object.values(evaluationCriteria).every(v => v === 0)}
                >
                  Submit Evaluation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}