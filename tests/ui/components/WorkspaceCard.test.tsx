import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkspaceCard } from '../../../src/ui/components/WorkspaceCard';

describe('WorkspaceCard', () => {
  const mockWorkspace = {
    id: 'test-id',
    name: 'Test Workspace',
    status: 'running',
    terminal_url: '/terminal/test-id'
  };

  const mockOnOpen = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workspace information', () => {
    render(
      <WorkspaceCard 
        workspace={mockWorkspace}
        onOpen={mockOnOpen}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Workspace')).toBeInTheDocument();
    expect(screen.getByText(/test-id/)).toBeInTheDocument();
    expect(screen.getByText('running')).toBeInTheDocument();
  });

  it('calls onOpen when terminal button is clicked', () => {
    render(
      <WorkspaceCard 
        workspace={mockWorkspace}
        onOpen={mockOnOpen}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByText('Open Terminal'));
    expect(mockOnOpen).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <WorkspaceCard 
        workspace={mockWorkspace}
        onOpen={mockOnOpen}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('disables terminal button when workspace is not running', () => {
    const stoppedWorkspace = { ...mockWorkspace, status: 'stopped' };
    
    render(
      <WorkspaceCard 
        workspace={stoppedWorkspace}
        onOpen={mockOnOpen}
        onDelete={mockOnDelete}
      />
    );

    const terminalButton = screen.getByText('Open Terminal');
    expect(terminalButton).toBeDisabled();
  });
});