'use client';

import { Bell, Command, Plus, ChevronRight, LogOut, User, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { useTeamStore } from '@/stores/teamStore';

export function TopNav() {
  const pathname = usePathname();
  const { user, logoutUser } = useAuthStore();
  const { openCommandPalette } = useUIStore();
  const { getActiveWorkspace } = useWorkspaceStore();
  const { getActiveTeam } = useTeamStore();

  const activeWorkspace = getActiveWorkspace();
  const activeTeam = getActiveTeam();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: { label: string; href: string }[] = [];

    if (activeWorkspace) {
      breadcrumbs.push({
        label: activeWorkspace.name,
        href: `/workspace/${activeWorkspace.id}`,
      });
    }

    if (activeTeam && segments.includes('team')) {
      breadcrumbs.push({
        label: activeTeam.name,
        href: `/team/${activeTeam.id}`,
      });
    }

    // Add current page
    const currentPage = segments[segments.length - 1];
    if (currentPage && currentPage !== activeWorkspace?.id && currentPage !== activeTeam?.id) {
      const label = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
      breadcrumbs.push({
        label,
        href: pathname,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/login';
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 flex-1">
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-2">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Link
                  href={crumb.href}
                  className="text-sm font-medium hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
          </nav>
        ) : (
          <div className="text-sm font-medium">Linear Clone</div>
        )}
      </div>

      {/* Right: Actions and User Menu */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={openCommandPalette}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <Command className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">⌘K</span>
        </Button>

        {/* Create Issue Button */}
        <Button variant="ghost" size="icon" className="relative">
          <Plus className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {/* Notification badge */}
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.name} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
