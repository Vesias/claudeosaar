import React from 'react';
import { Button } from './ui/button';
import { Terminal, Trash2, Activity } from 'lucide-react';

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    status: string;
    terminal_url: string;
  };
  onOpen: () => void;
  onDelete: () => void;
}

export function WorkspaceCard({ workspace, onOpen, onDelete }: WorkspaceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-400';
      case 'stopped':
        return 'text-gray-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{workspace.name}</h3>
        <div className="flex items-center gap-2">
          <Activity className={`h-4 w-4 ${getStatusColor(workspace.status)}`} />
          <span className={`text-sm ${getStatusColor(workspace.status)}`}>
            {workspace.status}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        ID: {workspace.id.substring(0, 8)}...
      </p>

      <div className="flex gap-3">
        <Button
          onClick={onOpen}
          variant="primary"
          className="flex-1 flex items-center justify-center gap-2"
          disabled={workspace.status !== 'running'}
        >
          <Terminal className="h-4 w-4" />
          Open Terminal
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}