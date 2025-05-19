import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Tag,
  Archive,
  ChevronRight,
  Filter,
  Download,
  Upload,
  Book,
  FileText,
  Code,
  Package,
  RefreshCw,
  Brain,
  X
} from 'lucide-react';

interface MemoryEntry {
  id: string;
  title: string;
  content: string;
  category: 'documentation' | 'code' | 'context' | 'notes' | 'system';
  tags: string[];
  created: string;
  updated: string;
  size: number;
  references: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'archived';
}

interface MemoryStats {
  totalEntries: number;
  totalSize: number;
  categories: {
    [key: string]: number;
  };
  recentActivity: number;
}

export function MemoryBank() {
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MemoryEntry | null>(null);

  useEffect(() => {
    // Mock data for development
    const mockEntries: MemoryEntry[] = [
      {
        id: '1',
        title: 'API Documentation Overview',
        content: 'Comprehensive API documentation for ClaudeOSaar endpoints...',
        category: 'documentation',
        tags: ['api', 'reference', 'endpoints'],
        created: '2025-01-15T10:00:00Z',
        updated: '2025-01-18T14:30:00Z',
        size: 15624,
        references: 42,
        priority: 'high',
        status: 'active'
      },
      {
        id: '2',
        title: 'Docker Container Configuration',
        content: 'Docker container setup with resource limits and security profiles...',
        category: 'system',
        tags: ['docker', 'containers', 'security'],
        created: '2025-01-10T09:00:00Z',
        updated: '2025-01-16T11:20:00Z',
        size: 8412,
        references: 18,
        priority: 'high',
        status: 'active'
      },
      {
        id: '3',
        title: 'MCP Tool Implementation',
        content: 'Implementation details for Model Context Protocol tools...',
        category: 'code',
        tags: ['mcp', 'tools', 'implementation'],
        created: '2025-01-12T13:00:00Z',
        updated: '2025-01-17T16:45:00Z',
        size: 22048,
        references: 35,
        priority: 'medium',
        status: 'active'
      },
      {
        id: '4',
        title: 'User Authentication Flow',
        content: 'JWT authentication implementation with refresh tokens...',
        category: 'code',
        tags: ['auth', 'jwt', 'security'],
        created: '2025-01-08T11:00:00Z',
        updated: '2025-01-14T09:15:00Z',
        size: 12867,
        references: 27,
        priority: 'high',
        status: 'active'
      },
      {
        id: '5',
        title: 'Development Notes - Sprint 2',
        content: 'Sprint 2 development notes and progress tracking...',
        category: 'notes',
        tags: ['sprint', 'progress', 'planning'],
        created: '2025-01-05T08:00:00Z',
        updated: '2025-01-11T17:00:00Z',
        size: 6234,
        references: 12,
        priority: 'low',
        status: 'archived'
      },
      {
        id: '6',
        title: 'Workspace Resource Management',
        content: 'Context about workspace resource allocation and limits...',
        category: 'context',
        tags: ['resources', 'workspaces', 'limits'],
        created: '2025-01-13T10:30:00Z',
        updated: '2025-01-19T12:00:00Z',
        size: 9876,
        references: 15,
        priority: 'medium',
        status: 'active'
      }
    ];

    const mockStats: MemoryStats = {
      totalEntries: mockEntries.length,
      totalSize: mockEntries.reduce((sum, entry) => sum + entry.size, 0),
      categories: {
        documentation: 1,
        code: 2,
        context: 1,
        notes: 1,
        system: 1
      },
      recentActivity: 8
    };

    setEntries(mockEntries);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const categories = [
    { id: 'all', name: 'All Entries', icon: <Database /> },
    { id: 'documentation', name: 'Documentation', icon: <Book /> },
    { id: 'code', name: 'Code', icon: <Code /> },
    { id: 'context', name: 'Context', icon: <Brain /> },
    { id: 'notes', name: 'Notes', icon: <FileText /> },
    { id: 'system', name: 'System', icon: <Package /> }
  ];

  const filteredEntries = entries.filter(entry => {
    const matchesCategory = selectedCategory === 'all' || entry.category === selectedCategory;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => entry.tags.includes(tag));
    
    return matchesCategory && matchesSearch && matchesTags;
  });

  const allTags = [...new Set(entries.flatMap(entry => entry.tags))];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: MemoryEntry['category']) => {
    switch (category) {
      case 'documentation': return <Book className="h-4 w-4" />;
      case 'code': return <Code className="h-4 w-4" />;
      case 'context': return <Brain className="h-4 w-4" />;
      case 'notes': return <FileText className="h-4 w-4" />;
      case 'system': return <Package className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: MemoryEntry['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEntries}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatSize(stats?.totalSize || 0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Archive className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Updates</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.recentActivity}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(stats?.categories || {}).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Tag className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search entries, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                       transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              New Entry
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                  ${selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors
                    ${selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Entries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map(entry => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg 
                     transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getCategoryIcon(entry.category)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{entry.title}</h3>
                  <p className="text-sm text-gray-500 capitalize">{entry.category}</p>
                </div>
              </div>
              {entry.status === 'archived' && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Archived
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {entry.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-gray-500">
                <span>{formatSize(entry.size)}</span>
                <span>{entry.references} refs</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(entry.priority)}`}>
                {entry.priority}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
              <span>Updated {formatDate(entry.updated)}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12">
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Actions Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {filteredEntries.length} of {entries.length} entries
          </div>
        </div>
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <EntryDetailModal
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={() => {
            // Refresh entries
            setSelectedEntry(null);
          }}
        />
      )}

      {/* Create Entry Modal */}
      {showCreateModal && (
        <CreateEntryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={() => {
            setShowCreateModal(false);
            // Refresh entries
          }}
        />
      )}
    </div>
  );
}

// Entry Detail Modal Component
function EntryDetailModal({ 
  entry, 
  onClose, 
  onUpdate 
}: { 
  entry: MemoryEntry; 
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [activeTab, setActiveTab] = useState('content');
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                {entry.category === 'documentation' && <Book className="h-5 w-5 text-gray-600" />}
                {entry.category === 'code' && <Code className="h-5 w-5 text-gray-600" />}
                {entry.category === 'context' && <Brain className="h-5 w-5 text-gray-600" />}
                {entry.category === 'notes' && <FileText className="h-5 w-5 text-gray-600" />}
                {entry.category === 'system' && <Package className="h-5 w-5 text-gray-600" />}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
                <p className="text-sm text-gray-500 capitalize">{entry.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'content'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'metadata'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Metadata
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            History
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'content' && (
            <div className="space-y-4">
              {isEditing ? (
                <textarea
                  defaultValue={entry.content}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <pre className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {entry.content}
                </pre>
              )}
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                  <p className="text-gray-900">{new Date(entry.created).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Updated</h4>
                  <p className="text-gray-900">{new Date(entry.updated).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Size</h4>
                  <p className="text-gray-900">{formatSize(entry.size)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">References</h4>
                  <p className="text-gray-900">{entry.references}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
                <span className={`px-3 py-1 rounded ${getPriorityColor(entry.priority)}`}>
                  {entry.priority}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <p className="text-gray-600">Version history coming soon...</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                         hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                {isEditing ? 'Cancel Edit' : 'Edit'}
              </button>
              <button
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                         hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg 
                         hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
            {isEditing && (
              <button
                onClick={onUpdate}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                         hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Create Entry Modal Component
function CreateEntryModal({ 
  onClose, 
  onCreate 
}: { 
  onClose: () => void;
  onCreate: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'documentation',
    content: '',
    tags: '',
    priority: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create new entry
    onCreate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Entry</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a descriptive title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="documentation">Documentation</option>
                  <option value="code">Code</option>
                  <option value="context">Context</option>
                  <option value="notes">Notes</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                required
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="api, documentation, reference"
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
                       hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Create Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return '';
  }
}