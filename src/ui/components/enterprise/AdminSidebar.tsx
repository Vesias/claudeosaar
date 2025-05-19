import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Server, 
  Shield, 
  DollarSign, 
  Settings,
  FileText,
  Activity,
  Building2,
  Webhook,
  Key,
  Database,
  Globe,
  Bell,
  HelpCircle
} from 'lucide-react';

interface AdminSidebarProps {
  selectedView: string;
  onViewChange: (view: string) => void;
}

export function AdminSidebar({ selectedView, onViewChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'resources', label: 'Resource Monitor', icon: Server },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'costs', label: 'Cost Analytics', icon: DollarSign },
    { id: 'activity-logs', label: 'Activity Logs', icon: Activity },
    { id: 'integrations', label: 'Integrations', icon: Webhook },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'domains', label: 'Domains', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'compliance', label: 'Compliance', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="font-bold text-lg">Enterprise</h2>
            <p className="text-xs text-gray-400">Admin Console</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-blue-900/20 text-blue-400 border-l-2 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700/50 transition-colors">
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Help & Support</span>
        </button>
      </div>
    </aside>
  );
}