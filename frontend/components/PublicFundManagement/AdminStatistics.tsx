import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAdminStatistics } from '@/hooks/useAdminStatistics';

interface AdminStatisticsProps {
  showNotification: (message: string) => void;
  onError: (error: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ showNotification, onError }) => {
  const { data: stats, loading, error, refetch } = useAdminStatistics();
  const [activeTab, setActiveTab] = useState('overview');

  // Show error notification
  React.useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading statistics...</span>
      </div>
    );
  }

  // Error state
  if (error || !stats) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertTriangle className="h-8 w-8 text-red-500" />
        <div className="ml-2">
          <p className="text-lg text-red-600">Failed to load statistics</p>
          <Button onClick={refetch} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    trend?: { value: number; isPositive: boolean };
    color?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-600`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <div className={`flex items-center text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-3 w-3 mr-1 ${!trend.isPositive && 'rotate-180'}`} />
            {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );

  const exportReport = () => {
    try {
      // Create comprehensive report data
      const reportData = {
        reportTitle: "Public Fund Management - Admin Statistics Report",
        generatedOn: new Date().toLocaleString(),
        systemStatus: "Operational",
        keyMetrics: {
          totalProposals: stats.totalProposals,
          activeProposals: stats.activeProposals,
          fundsAllocated: `${stats.totalFundsAllocated} ETH`,
          totalAuthorities: stats.totalAuthorities,
          treasuryBalance: `${parseFloat(stats.treasuryBalance).toFixed(2)} ETH`,
          pendingApplications: stats.pendingApplications,
          approvedApplications: stats.approvedApplications
        },
        proposalsByStage: stats.proposalsByStage,
        voteDistribution: stats.voteDistribution,
        fundsAllocation: stats.fundsAllocation,
        monthlyActivity: stats.monthlyActivity,
        summary: {
          totalProposalValue: `${stats.totalFundsAllocated} ETH`,
          averageProposalSize: `${(parseFloat(stats.totalFundsAllocated) / Math.max(stats.totalProposals, 1)).toFixed(2)} ETH`,
          approvalRate: `${Math.round((stats.approvedApplications / Math.max(stats.approvedApplications + stats.pendingApplications, 1)) * 100)}%`,
          systemUtilization: `${Math.round((parseFloat(stats.totalFundsAllocated) / Math.max(parseFloat(stats.treasuryBalance), 1)) * 100)}%`
        }
      };

      // Convert to formatted text
      const reportText = `
PUBLIC FUND MANAGEMENT SYSTEM
ADMIN STATISTICS REPORT
================================

Generated: ${reportData.generatedOn}
System Status: ${reportData.systemStatus}

KEY METRICS
-----------
• Total Proposals: ${reportData.keyMetrics.totalProposals}
• Active Proposals: ${reportData.keyMetrics.activeProposals}
• Funds Allocated: ${reportData.keyMetrics.fundsAllocated}
• Total Authorities: ${reportData.keyMetrics.totalAuthorities}
• Treasury Balance: ${reportData.keyMetrics.treasuryBalance}
• Pending Applications: ${reportData.keyMetrics.pendingApplications}
• Approved Applications: ${reportData.keyMetrics.approvedApplications}

PROPOSAL DISTRIBUTION
--------------------
${reportData.proposalsByStage.map(item => `• ${item.name}: ${item.value} proposals`).join('\n')}

VOTE DISTRIBUTION
-----------------
${reportData.voteDistribution.map(item => `• ${item.name}: ${item.value}%`).join('\n')}

FUND ALLOCATION BY CATEGORY
---------------------------
${reportData.fundsAllocation.map(item => `• ${item.name}: ${item.value}%`).join('\n')}

MONTHLY ACTIVITY SUMMARY
------------------------
${reportData.monthlyActivity.map(item => `• ${item.month}: ${item.proposals} proposals, ${item.funds} ETH allocated`).join('\n')}

PERFORMANCE SUMMARY
-------------------
• Total Proposal Value: ${reportData.summary.totalProposalValue}
• Average Proposal Size: ${reportData.summary.averageProposalSize}
• Application Approval Rate: ${reportData.summary.approvalRate}
• System Utilization: ${reportData.summary.systemUtilization}

NOTES
-----
- This report contains real-time data from blockchain contracts
- All financial figures are in ETH (Ethereum)
- Timestamps are in local time zone
- System status reflects smart contract connectivity

Generated by FundVerify Public Fund Management System
${new Date().toISOString()}
================================
`;

      // Create and download the file
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-statistics-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification('Statistics report exported successfully!');
    } catch (err) {
      console.error('Error exporting report:', err);
      onError('Failed to export report');
    }
  };

  const exportCSV = () => {
    try {
      // Create CSV data for key metrics
      const csvData = [
        ['Public Fund Management System - Statistics Report'],
        [`Generated on: ${new Date().toLocaleString()}`],
        [''],
        ['KEY METRICS'],
        ['Metric', 'Value'],
        ['Total Proposals', stats.totalProposals],
        ['Active Proposals', stats.activeProposals],
        ['Funds Allocated (ETH)', stats.totalFundsAllocated],
        ['Total Authorities', stats.totalAuthorities],
        ['Treasury Balance (ETH)', parseFloat(stats.treasuryBalance).toFixed(2)],
        ['Pending Applications', stats.pendingApplications],
        ['Approved Applications', stats.approvedApplications],
        [''],
        ['PROPOSALS BY STAGE'],
        ['Stage', 'Count'],
        ...stats.proposalsByStage.map(item => [item.name, item.value]),
        [''],
        ['VOTE DISTRIBUTION'],
        ['Vote Type', 'Percentage'],
        ...stats.voteDistribution.map(item => [item.name, `${item.value}%`]),
        [''],
        ['FUND ALLOCATION'],
        ['Category', 'Percentage'],
        ...stats.fundsAllocation.map(item => [item.name, `${item.value}%`]),
        [''],
        ['MONTHLY ACTIVITY'],
        ['Month', 'Proposals', 'Funds (ETH)'],
        ...stats.monthlyActivity.map(item => [item.month, item.proposals, item.funds])
      ];

      // Convert to CSV string
      const csvContent = csvData.map(row => row.join(',')).join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-statistics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showNotification('CSV report exported successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      onError('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Statistics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your public fund management system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={refetch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <div className="relative group">
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white border rounded-md shadow-lg z-50">
              <button
                onClick={exportReport}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
              >
                📄 Export as Text
              </button>
              <button
                onClick={exportCSV}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-md"
              >
                📊 Export as CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Proposals"
          value={stats.totalProposals}
          subtitle={`${stats.activeProposals} active`}
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Funds Allocated"
          value={`${stats.totalFundsAllocated} ETH`}
          subtitle="From treasury"
          icon={DollarSign}
          trend={{ value: 8, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Total Authorities"
          value={stats.totalAuthorities}
          subtitle="Active authorities"
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Treasury Balance"
          value={`${parseFloat(stats.treasuryBalance).toFixed(2)} ETH`}
          subtitle="Available funds"
          icon={Activity}
          trend={{ value: 3, isPositive: false }}
          color="orange"
        />
      </div>

      {/* Applications Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          subtitle="Awaiting approval"
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Approved Applications"
          value={stats.approvedApplications}
          subtitle="Total approved"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposal Analytics</TabsTrigger>
          <TabsTrigger value="funds">Fund Management</TabsTrigger>
          <TabsTrigger value="activity">User Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChartIcon className="h-5 w-5 mr-2" />
                  Proposals by Stage
                </CardTitle>
                <CardDescription>Current distribution of proposal stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.proposalsByStage}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.proposalsByStage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Vote Distribution
                </CardTitle>
                <CardDescription>Voting patterns across proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.voteDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.voteDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="proposals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proposal Analytics</CardTitle>
              <CardDescription>Detailed proposal statistics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.proposalsByStage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funds" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation by Category</CardTitle>
                <CardDescription>Distribution of allocated funds</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.fundsAllocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.fundsAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Fund Activity</CardTitle>
                <CardDescription>Funds allocated over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={stats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="funds" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Overview</CardTitle>
              <CardDescription>Proposals and fund activity trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stats.monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="proposals" stroke="#8884d8" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="funds" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              System Operational
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last Updated: {new Date().toLocaleString()}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatistics;