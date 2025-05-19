import { lazyLoad } from '@/components/LazyLoad';

// Lazy load dashboard components
export const WorkspaceCard = lazyLoad(() => 
  import('@/ui/components/WorkspaceCard').then(m => ({ default: m.WorkspaceCard }))
);

export const CreateWorkspaceModal = lazyLoad(() => 
  import('@/ui/components/CreateWorkspaceModal').then(m => ({ default: m.CreateWorkspaceModal }))
);

export const ResourceMonitor = lazyLoad(() => 
  import('@/ui/components/enterprise/ResourceMonitor').then(m => ({ default: m.ResourceMonitor }))
);

export const SecurityOverview = lazyLoad(() => 
  import('@/ui/components/enterprise/SecurityOverview').then(m => ({ default: m.SecurityOverview }))
);

export const CostAnalytics = lazyLoad(() => 
  import('@/ui/components/enterprise/CostAnalytics').then(m => ({ default: m.CostAnalytics }))
);

export const TeamManagement = lazyLoad(() => 
  import('@/ui/components/enterprise/TeamManagement').then(m => ({ default: m.TeamManagement }))
);

// Preload critical components
export function preloadDashboardComponents() {
  import('@/ui/components/WorkspaceCard');
  import('@/ui/components/CreateWorkspaceModal');
}