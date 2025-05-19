import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  MoreVertical,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import axios from 'axios';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  workspaces: number;
  apiUsage: number;
}

export function TeamManagement() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('/api/enterprise/team', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleBulkAction = async (action: string) => {
    if (selectedMembers.length === 0) return;

    try {
      await axios.post('/api/enterprise/team/bulk-action', {
        action,
        memberIds: selectedMembers
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchTeamMembers();
      setSelectedMembers([]);
    } catch (error) {
      console.error('Bulk action failed:', error);
    }
  };

  const exportTeamData = () => {
    const csvData = members.map(member => ({
      Name: member.name,
      Email: member.email,
      Role: member.role,
      Status: member.status,
      'Last Active': member.lastActive,
      Workspaces: member.workspaces,
      'API Usage': member.apiUsage
    }));

    const csv = convertToCSV(csvData);
    downloadCSV(csv, 'team-members.csv');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-gray-400 mt-1">Manage your organization's team members and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportTeamData}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => setShowInviteModal(true)}
            variant="primary"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={members.length}
          icon={<Users className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={members.filter(m => m.status === 'active').length}
          icon={<UserCheck className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Pending Invites"
          value={members.filter(m => m.status === 'pending').length}
          icon={<Mail className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title="Admin Users"
          value={members.filter(m => m.role === 'admin').length}
          icon={<Shield className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="viewer">Viewer</option>
        </select>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 flex justify-between items-center">
          <span className="text-sm">
            {selectedMembers.length} member(s) selected
          </span>
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkAction('deactivate')}
              variant="secondary"
              size="sm"
            >
              Deactivate
            </Button>
            <Button
              onClick={() => handleBulkAction('delete')}
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
            <Button
              onClick={() => setSelectedMembers([])}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedMembers.length === filteredMembers.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMembers(filteredMembers.map(m => m.id));
                    } else {
                      setSelectedMembers([]);
                    }
                  }}
                  className="rounded"
                />
              </th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Member</th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Role</th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Last Active</th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Usage</th>
              <th className="p-4 text-left text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-t border-gray-700 hover:bg-gray-700/50">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, member.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== member.id));
                      }
                    }}
                    className="rounded"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge variant={member.role === 'admin' ? 'purple' : 'blue'}>
                    {member.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge variant={
                    member.status === 'active' ? 'green' :
                    member.status === 'pending' ? 'yellow' : 'gray'
                  }>
                    {member.status}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {member.lastActive}
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <p>{member.workspaces} workspaces</p>
                    <p className="text-gray-400">{member.apiUsage.toLocaleString()} API calls</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteMemberModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'bg-blue-900/20 border-blue-700 text-blue-500';
      case 'green': return 'bg-green-900/20 border-green-700 text-green-500';
      case 'yellow': return 'bg-yellow-900/20 border-yellow-700 text-yellow-500';
      case 'purple': return 'bg-purple-900/20 border-purple-700 text-purple-500';
      default: return 'bg-gray-800 border-gray-700 text-gray-500';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getColorClasses()}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="opacity-50">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function InviteMemberModal({ onClose }) {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('developer');
  const [sendInvite, setSendInvite] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendInvite(true);
    
    try {
      await axios.post('/api/enterprise/team/invite', {
        emails: emails.split(',').map(e => e.trim()),
        role
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      onClose();
    } catch (error) {
      console.error('Failed to send invites:', error);
    } finally {
      setSendInvite(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Invite Team Members</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email addresses (comma-separated)
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3"
              rows={3}
              placeholder="john@example.com, jane@example.com"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3"
            >
              <option value="admin">Admin</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={sendInvite}
            >
              {sendInvite ? 'Sending...' : 'Send Invites'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    }).join(',');
  });
  
  return `${csvHeaders}\n${csvRows.join('\n')}`;
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}