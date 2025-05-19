import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download,
  Filter,
  PieChart,
  BarChart3,
  Info,
  AlertTriangle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CostChart } from './charts/CostChart';
import axios from 'axios';

interface CostData {
  currentMonth: number;
  previousMonth: number;
  yearToDate: number;
  projectedMonth: number;
  breakdown: {
    compute: number;
    storage: number;
    network: number;
    support: number;
    other: number;
  };
  byTeam: Array<{
    team: string;
    cost: number;
    trend: number;
  }>;
  byWorkspace: Array<{
    workspace: string;
    owner: string;
    cost: number;
    tier: string;
  }>;
  trends: Array<{
    month: string;
    cost: number;
  }>;
}

interface Budget {
  monthly: number;
  annual: number;
  used: number;
  remaining: number;
  alerts: Array<{
    id: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}

export function CostAnalytics() {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [timeRange, setTimeRange] = useState('month');
  const [viewType, setViewType] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    breakdown: true,
    teams: true,
    workspaces: false,
    recommendations: true
  });

  useEffect(() => {
    fetchCostData();
  }, [timeRange]);

  const fetchCostData = async () => {
    try {
      const [costRes, budgetRes] = await Promise.all([
        axios.get(`/api/enterprise/costs?range=${timeRange}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/enterprise/budget', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setCostData(costRes.data);
      setBudget(budgetRes.data);
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderContent = () => {
    switch (viewType) {
      case 'breakdown':
        return <CostBreakdown data={costData} />;
      case 'trends':
        return <CostTrends data={costData} timeRange={timeRange} />;
      case 'optimization':
        return <CostOptimization />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (!costData || !budget) return null;

    const monthlyChange = ((costData.currentMonth - costData.previousMonth) / costData.previousMonth) * 100;
    const budgetUsage = (costData.currentMonth / budget.monthly) * 100;

    return (
      <div className="space-y-6">
        {/* Cost Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CostCard
            title="Current Month"
            value={`€${costData.currentMonth.toLocaleString()}`}
            change={monthlyChange}
            icon={<DollarSign className="h-6 w-6" />}
            color="blue"
          />
          <CostCard
            title="Projected Month"
            value={`€${costData.projectedMonth.toLocaleString()}`}
            change={((costData.projectedMonth - costData.currentMonth) / costData.currentMonth) * 100}
            icon={<TrendingUp className="h-6 w-6" />}
            color="purple"
          />
          <CostCard
            title="Year to Date"
            value={`€${costData.yearToDate.toLocaleString()}`}
            icon={<Calendar className="h-6 w-6" />}
            color="green"
          />
          <CostCard
            title="Budget Used"
            value={`${budgetUsage.toFixed(0)}%`}
            subtitle={`€${budget.remaining.toLocaleString()} remaining`}
            icon={<PieChart className="h-6 w-6" />}
            color={budgetUsage > 90 ? 'red' : budgetUsage > 70 ? 'yellow' : 'green'}
          />
        </div>

        {/* Budget Alerts */}
        {budget.alerts.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Alerts</h3>
            <div className="space-y-3">
              {budget.alerts.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleSection('breakdown')}
          >
            <h3 className="text-lg font-semibold">Cost Breakdown</h3>
            {expandedSections.breakdown ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </div>
          
          {expandedSections.breakdown && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <CostChart 
                  data={Object.entries(costData.breakdown).map(([key, value]) => ({
                    category: key.charAt(0).toUpperCase() + key.slice(1),
                    amount: value
                  }))}
                  type="pie"
                />
              </div>
              <div className="space-y-4">
                {Object.entries(costData.breakdown)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, amount]) => (
                    <BreakdownItem
                      key={category}
                      category={category}
                      amount={amount}
                      percentage={(amount / costData.currentMonth) * 100}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Cost by Team */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleSection('teams')}
          >
            <h3 className="text-lg font-semibold">Cost by Team</h3>
            {expandedSections.teams ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </div>
          
          {expandedSections.teams && (
            <div className="space-y-3">
              {costData.byTeam.map((team) => (
                <TeamCostItem key={team.team} data={team} />
              ))}
            </div>
          )}
        </div>

        {/* Cost Optimization */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div 
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => toggleSection('recommendations')}
          >
            <h3 className="text-lg font-semibold">Cost Optimization Recommendations</h3>
            {expandedSections.recommendations ? 
              <ChevronUp className="h-5 w-5" /> : 
              <ChevronDown className="h-5 w-5" />
            }
          </div>
          
          {expandedSections.recommendations && (
            <div className="space-y-3">
              <OptimizationItem
                title="Idle Workspace Cleanup"
                description="5 workspaces have been idle for 30+ days"
                potential="€450/month"
                difficulty="easy"
              />
              <OptimizationItem
                title="Downgrade Underutilized Resources"
                description="12 workspaces using < 20% of allocated resources"
                potential="€890/month"
                difficulty="medium"
              />
              <OptimizationItem
                title="Storage Optimization"
                description="Archive old data and remove unused volumes"
                potential="€230/month"
                difficulty="hard"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cost Analytics</h2>
          <p className="text-gray-400 mt-1">Monitor and optimize your spending</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2"
          >
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
        {['overview', 'breakdown', 'trends', 'optimization'].map((view) => (
          <button
            key={view}
            onClick={() => setViewType(view)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === view
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
}

function CostCard({ title, value, change, subtitle, icon, color }) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-900/20 border-blue-700 text-blue-500';
      case 'green': return 'bg-green-900/20 border-green-700 text-green-500';
      case 'purple': return 'bg-purple-900/20 border-purple-700 text-purple-500';
      case 'red': return 'bg-red-900/20 border-red-700 text-red-500';
      case 'yellow': return 'bg-yellow-900/20 border-yellow-700 text-yellow-500';
      default: return 'bg-gray-800 border-gray-700 text-gray-500';
    }
  };

  const colors = getColorClasses();

  return (
    <div className={`border rounded-lg p-6 ${colors}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-gray-400">{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="opacity-50">{icon}</div>
      </div>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-sm ${
          change >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

function AlertItem({ alert }) {
  const getSeverityStyles = () => {
    switch (alert.severity) {
      case 'error': return 'bg-red-900/20 border-red-700 text-red-400';
      case 'warning': return 'bg-yellow-900/20 border-yellow-700 text-yellow-400';
      default: return 'bg-blue-900/20 border-blue-700 text-blue-400';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${getSeverityStyles()}`}>
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <p className="text-sm">{alert.message}</p>
    </div>
  );
}

function BreakdownItem({ category, amount, percentage }) {
  const getCategoryColor = () => {
    switch (category.toLowerCase()) {
      case 'compute': return 'bg-blue-500';
      case 'storage': return 'bg-green-500';
      case 'network': return 'bg-purple-500';
      case 'support': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getCategoryColor()}`} />
        <span className="capitalize">{category}</span>
      </div>
      <div className="text-right">
        <p className="font-medium">€{amount.toLocaleString()}</p>
        <p className="text-sm text-gray-400">{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}

function TeamCostItem({ data }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
      <div>
        <p className="font-medium">{data.team}</p>
        <p className="text-sm text-gray-400">Team spending</p>
      </div>
      <div className="text-right">
        <p className="font-medium">€{data.cost.toLocaleString()}</p>
        <div className={`flex items-center gap-1 text-sm ${
          data.trend >= 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {data.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(data.trend)}%</span>
        </div>
      </div>
    </div>
  );
}

function OptimizationItem({ title, description, potential, difficulty }) {
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
      <div className="flex items-center gap-4">
        <DollarSign className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium text-green-400">{potential}</p>
        <p className={`text-sm capitalize ${getDifficultyColor()}`}>{difficulty}</p>
      </div>
    </div>
  );
}

function CostBreakdown({ data }) {
  if (!data) return null;
  return <div className="space-y-6">Cost breakdown view...</div>;
}

function CostTrends({ data, timeRange }) {
  if (!data) return null;
  return <div className="space-y-6">Cost trends view...</div>;
}

function CostOptimization() {
  return <div className="space-y-6">Cost optimization view...</div>;
}