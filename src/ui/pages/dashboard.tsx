import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { WorkspaceCard } from '../components/WorkspaceCard';
import { CreateWorkspaceModal } from '../components/CreateWorkspaceModal';
import { Button } from '@/components/ui/Button';
import { Plus, RefreshCw } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  status: string;
  terminal_url: string;
  container_id: string;
}

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get('/api/workspaces', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWorkspaces(response.data);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
      if (error.response?.status === 401) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string, apiKey: string) => {
    try {
      const response = await axios.post('/api/workspaces', {
        name,
        claude_api_key: apiKey
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWorkspaces([...workspaces, response.data]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const deleteWorkspace = async (workspaceId: string) => {
    try {
      await axios.delete(`/api/workspaces/${workspaceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setWorkspaces(workspaces.filter(w => w.id !== workspaceId));
    } catch (error) {
      console.error('Failed to delete workspace:', error);
    }
  };

  const openTerminal = (workspaceId: string) => {
    router.push(`/terminal/${workspaceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">ClaudeOSaar Workspaces</h1>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Workspace
              </Button>
              <Button
                onClick={fetchWorkspaces}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => router.push('/billing')}
                variant="ghost"
              >
                Billing
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading workspaces...</p>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No workspaces yet. Create your first one!</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="mx-auto"
            >
              Create Workspace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onOpen={() => openTerminal(workspace.id)}
                onDelete={() => deleteWorkspace(workspace.id)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createWorkspace}
        />
      )}
    </div>
  );
}