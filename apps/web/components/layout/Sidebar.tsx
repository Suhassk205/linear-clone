'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  Inbox,
  ListTodo,
  Settings,
  FolderKanban,
  Repeat,
  Plus,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useTeamStore } from '@/stores/teamStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { workspaces, activeWorkspaceId, setActiveWorkspace, getActiveWorkspace } =
    useWorkspaceStore();
  const { teams, activeTeamId, setActiveTeam, getActiveTeam } = useTeamStore();

  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [cyclesExpanded, setCyclesExpanded] = useState(true);

  const activeWorkspace = getActiveWorkspace();
  const activeTeam = getActiveTeam();

  // Filter teams by active workspace
  const workspaceTeams = teams.filter(
    (team) => team.workspace_id === activeWorkspaceId
  );

  // Handle workspace selection
  const handleWorkspaceChange = (value: string) => {
    if (value === '__new__') {
      // TODO: Open create workspace modal
      console.log('Create new workspace');
      return;
    }
    setActiveWorkspace(value);
  };

  // Handle team selection
  const handleTeamChange = (value: string) => {
    if (value === '__new__') {
      // TODO: Open create team modal
      console.log('Create new team');
      return;
    }
    setActiveTeam(value);
  };

  const navItems: NavItem[] = [
    {
      label: 'My Issues',
      href: '/issues/me',
      icon: <ListTodo className="h-4 w-4" />,
      count: 0, // TODO: Fetch from API
    },
    {
      label: 'Inbox',
      href: '/inbox',
      icon: <Inbox className="h-4 w-4" />,
      count: 0, // TODO: Fetch from API
    },
  ];

  if (sidebarCollapsed) {
    return (
      <div className="h-screen w-16 border-r border-border bg-background flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mb-4"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="h-screen w-64 border-r border-border bg-background flex flex-col">
      {/* Header with workspace/team switcher */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Linear Clone</h2>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Workspace Switcher */}
        <Select
          value={activeWorkspaceId || undefined}
          onValueChange={handleWorkspaceChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select workspace">
              {activeWorkspace?.name || 'Select workspace'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((workspace) => (
              <SelectItem key={workspace.id} value={workspace.id}>
                {workspace.icon && <span className="mr-2">{workspace.icon}</span>}
                {workspace.name}
              </SelectItem>
            ))}
            <SelectItem value="__new__">
              <div className="flex items-center text-muted-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Create workspace
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Team Switcher */}
        {activeWorkspaceId && (
          <Select
            value={activeTeamId || undefined}
            onValueChange={handleTeamChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select team">
                {activeTeam?.name || 'Select team'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {workspaceTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.icon && <span className="mr-2">{team.icon}</span>}
                  {team.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {team.identifier}
                  </span>
                </SelectItem>
              ))}
              <SelectItem value="__new__">
                <div className="flex items-center text-muted-foreground">
                  <Plus className="h-4 w-4 mr-2" />
                  Create team
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {/* Main navigation items */}
        <div className="space-y-1 mb-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                pathname === item.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Team Section */}
        {activeTeam && (
          <>
            <div className="px-3 py-2 mb-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                {activeTeam.name}
              </h3>
            </div>

            <div className="space-y-1 mb-6">
              <Link
                href={`/team/${activeTeam.id}/issues`}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  pathname === `/team/${activeTeam.id}/issues`
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <ListTodo className="h-4 w-4" />
                <span>Issues</span>
              </Link>
            </div>

            {/* Projects Section */}
            <div className="mb-6">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase hover:text-foreground transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  <span>Projects</span>
                </div>
                {projectsExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {projectsExpanded && (
                <div className="mt-1 space-y-1">
                  {/* TODO: Fetch and map actual projects */}
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No projects yet
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors w-full"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New project</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cycles Section */}
            <div className="mb-6">
              <button
                onClick={() => setCyclesExpanded(!cyclesExpanded)}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase hover:text-foreground transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  <span>Cycles</span>
                </div>
                {cyclesExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>

              {cyclesExpanded && (
                <div className="mt-1 space-y-1">
                  {/* TODO: Fetch and map actual cycles */}
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No cycles yet
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors w-full"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New cycle</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {/* Footer with Settings */}
      <div className="p-2 border-t border-border">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
            pathname === '/settings'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
