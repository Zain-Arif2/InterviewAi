'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import { DASHBOARD_NAV, ADMIN_NAV } from '@/lib/constants';
import {
  LayoutDashboard, MessageSquare, BarChart3, User, Settings,
  Users, Monitor, ChevronsLeft, ChevronsRight, Sparkles, X, Crown,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, MessageSquare, BarChart3, User, Settings,
  Users, Monitor,
};

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { user } = useCurrentUser();
  const isAdmin = user?.role === 'admin';

  const NavItem = ({ item }) => {
    const Icon = iconMap[item.icon];
    const isActive = pathname === item.href ||
      (item.href !== '/dashboard' && pathname.startsWith(item.href));

    return (
      <Link
        href={item.href}
        onClick={onMobileClose}
        className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          collapsed ? 'justify-center' : ''
        }`}
        style={{
          background: isActive ? 'var(--sidebar-active)' : 'transparent',
          color: isActive ? 'var(--sidebar-active-text)' : 'var(--muted-foreground)',
        }}
        title={collapsed ? item.title : undefined}
      >
        {Icon && (
          <Icon
            className={`h-[18px] w-[18px] shrink-0 transition-colors duration-200 ${
              isActive ? '' : 'group-hover:opacity-80'
            }`}
          />
        )}
        {!collapsed && <span>{item.title}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={`flex h-16 items-center border-b px-4 ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}
        style={{ borderColor: 'var(--sidebar-border)' }}
      >
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
            <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-500" />
            <span style={{ color: 'var(--foreground)' }}>ToolSuite</span>
          </Link>
        )}
        
        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggle}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main User Navigation */}
        <div className="space-y-1.5">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              Core Applications
            </p>
          )}
          {DASHBOARD_NAV.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </div>

        {/* Administration Section */}
        {isAdmin && (
          <div className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
                <Crown size={12} className="text-amber-500" />
                Admin Dashboard
              </p>
            )}
            {ADMIN_NAV.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Banner */}
      {!collapsed && user?.plan !== 'pro' && (
        <div className="p-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
          <div className="rounded-xl p-3.5 space-y-2.5 text-center bg-secondary border border-border">
            <p className="text-xs font-semibold text-foreground">Get Unlimited Access</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unlock professional tools, higher rate limits, and custom exports.
            </p>
            <Link
              href="/dashboard/billing"
              className="w-full inline-flex items-center justify-center h-8 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Slide-in View */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:hidden transform border-r transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
      >
        {sidebarContent}
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
        />
      )}

      {/* Desktop Persistent Sidebar */}
      <div
        className={`hidden md:block h-screen fixed top-0 left-0 border-r transition-all duration-300 ease-in-out ${
          collapsed ? 'w-16' : 'w-64'
        }`}
        style={{ background: 'var(--sidebar-bg)', borderColor: 'var(--sidebar-border)' }}
      >
        {sidebarContent}
      </div>
    </>
  );
}