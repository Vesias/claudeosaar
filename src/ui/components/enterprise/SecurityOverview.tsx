import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Key,
  FileWarning,
  UserX,
  Zap,
  RefreshCw,
  Download,
  Settings,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import axios from 'axios';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'api_access' | 'permission_change' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user: string;
  timestamp: string;
  ip: string;
  resolved: boolean;
}

interface SecurityMetrics {
  totalEvents: number;
  unresolvedEvents: number;
  criticalEvents: number;
  riskScore: number;
  compliance: {
    gdpr: boolean;
    soc2: boolean;
    iso27001: boolean;
  };
  lastAudit: string;
}

export function SecurityOverview() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchSecurityData();
    const interval = autoRefresh ? setInterval(fetchSecurityData, 10000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchSecurityData = async () => {
    try {
      const [eventsRes, metricsRes] = await Promise.all([
        axios.get('/api/enterprise/security/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/enterprise/security/metrics', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      
      setEvents(eventsRes.data);
      setMetrics(metricsRes.data);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <UserX className="h-4 w-4" />;
      case 'api_access': return <Key className="h-4 w-4" />;
      case 'permission_change': return <Lock className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'events':
        return <SecurityEvents events={events} />;
      case 'compliance':
        return <ComplianceStatus metrics={metrics} />;
      case 'audit':
        return <AuditLogs />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => {
    if (!metrics) return null;

    return (
      <div className="space-y-6">
        {/* Security Score */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold">Security Score</h3>
              <p className="text-gray-400 text-sm mt-1">Overall security posture</p>
            </div>
            <Button variant="secondary" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - metrics.riskScore / 100)}`}
                  className={metrics.riskScore > 80 ? 'text-green-500' : 
                           metrics.riskScore > 60 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{metrics.riskScore}</span>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4">
              <MetricCard
                title="Total Events"
                value={metrics.totalEvents}
                icon={<Zap className="h-5 w-5" />}
                trend="+12%"
              />
              <MetricCard
                title="Unresolved"
                value={metrics.unresolvedEvents}
                icon={<AlertTriangle className="h-5 w-5" />}
                trend="-5%"
                negative
              />
              <MetricCard
                title="Critical Events"
                value={metrics.criticalEvents}
                icon={<FileWarning className="h-5 w-5" />}
                trend="+2"
                negative
              />
              <MetricCard
                title="Last Audit"
                value={metrics.lastAudit}
                icon={<CheckCircle className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>

        {/* Recent Security Events */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Security Events</h3>
            <button
              onClick={() => setSelectedView('events')}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all →
            </button>
          </div>
          
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
          <div className="grid grid-cols-3 gap-4">
            <ComplianceCard
              title="GDPR"
              status={metrics.compliance.gdpr}
              description="General Data Protection Regulation"
            />
            <ComplianceCard
              title="SOC 2"
              status={metrics.compliance.soc2}
              description="Service Organization Control 2"
            />
            <ComplianceCard
              title="ISO 27001"
              status={metrics.compliance.iso27001}
              description="Information Security Management"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Security Audit"
              description="Run comprehensive audit"
              icon={<Shield className="h-6 w-6" />}
              onClick={() => console.log('Run audit')}
            />
            <ActionCard
              title="Export Report"
              description="Download security report"
              icon={<Download className="h-6 w-6" />}
              onClick={() => console.log('Export report')}
            />
            <ActionCard
              title="Access Control"
              description="Manage permissions"
              icon={<Lock className="h-6 w-6" />}
              onClick={() => console.log('Access control')}
            />
            <ActionCard
              title="Security Settings"
              description="Configure security"
              icon={<Settings className="h-6 w-6" />}
              onClick={() => console.log('Settings')}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Overview</h2>
          <p className="text-gray-400 mt-1">Monitor and manage security across your organization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'primary' : 'secondary'}
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button variant="secondary" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
        {['overview', 'events', 'compliance', 'audit'].map((view) => (
          <button
            key={view}
            onClick={() => setSelectedView(view)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === view
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

function MetricCard({ title, value, icon, trend, negative = false }) {
  return (
    <div className="bg-gray-700/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <p className="text-xl font-bold">{value}</p>
      {trend && (
        <p className={`text-sm mt-1 ${negative ? 'text-red-400' : 'text-green-400'}`}>
          {trend}
        </p>
      )}
    </div>
  );
}

function EventRow({ event }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-900/50 text-red-400 border-red-700';
      case 'high': return 'bg-orange-900/50 text-orange-400 border-orange-700';
      case 'medium': return 'bg-yellow-900/50 text-yellow-400 border-yellow-700';
      case 'low': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      default: return 'bg-gray-700/50 text-gray-400 border-gray-700';
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
      <div className={getSeverityColor(event.severity)}>
        {getEventIcon(event.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{event.message}</p>
        <p className="text-xs text-gray-400">
          {event.user} • {event.ip} • {event.timestamp}
        </p>
      </div>
      <Badge variant={event.resolved ? 'green' : 'red'}>
        {event.resolved ? 'Resolved' : 'Open'}
      </Badge>
    </div>
  );
}

function ComplianceCard({ title, status, description }) {
  return (
    <div className={`border rounded-lg p-4 ${
      status ? 'bg-green-900/20 border-green-700' : 'bg-red-900/20 border-red-700'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium">{title}</h4>
        {status ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500" />
        )}
      </div>
      <p className="text-sm text-gray-400">{description}</p>
      <p className={`text-sm mt-2 ${status ? 'text-green-400' : 'text-red-400'}`}>
        {status ? 'Compliant' : 'Non-compliant'}
      </p>
    </div>
  );
}

function ActionCard({ title, description, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-700/50 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
    >
      <div className="mb-3 text-blue-500">{icon}</div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}

function SecurityEvents({ events }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Security Events</h3>
        <p className="text-gray-400 text-sm mt-1">All security events from the last 30 days</p>
      </div>
      
      <div className="space-y-3">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

function ComplianceStatus({ metrics }) {
  if (!metrics) return null;
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Overview</h3>
        <div className="grid grid-cols-3 gap-4">
          <ComplianceCard
            title="GDPR"
            status={metrics.compliance.gdpr}
            description="General Data Protection Regulation"
          />
          <ComplianceCard
            title="SOC 2"
            status={metrics.compliance.soc2}
            description="Service Organization Control 2"
          />
          <ComplianceCard
            title="ISO 27001"
            status={metrics.compliance.iso27001}
            description="Information Security Management"
          />
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Compliance Actions</h3>
        <div className="space-y-3">
          <ActionItem
            title="Complete SOC 2 Type II Audit"
            description="Required for enterprise customers"
            dueDate="2024-03-15"
            status="in_progress"
          />
          <ActionItem
            title="Update Privacy Policy"
            description="GDPR compliance requirement"
            dueDate="2024-02-28"
            status="pending"
          />
          <ActionItem
            title="Security Training"
            description="Annual security awareness training"
            dueDate="2024-04-01"
            status="completed"
          />
        </div>
      </div>
    </div>
  );
}

function AuditLogs() {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Audit Logs</h3>
      <p className="text-gray-400">Audit log viewing functionality coming soon...</p>
    </div>
  );
}

function ActionItem({ title, description, dueDate, status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-400">Due: {dueDate}</p>
        <p className={`text-sm font-medium ${getStatusColor()}`}>
          {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
        </p>
      </div>
    </div>
  );
}