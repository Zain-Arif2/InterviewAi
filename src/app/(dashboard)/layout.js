'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, X, Menu, GraduationCap } from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resumes', href: '/dashboard/resumes', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300
    lg:static lg:translate-x-0 border-[var(--border)] bg-[var(--background)]
    ${collapsed ? 'lg:w-20' : 'lg:w-64'}
    ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
  `;

  return (
    <>
      {/* Mobile Overlay Background */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-[var(--foreground)] whitespace-nowrap animate-fade-in">
                InterviewAI
              </span>
            )}
          </div>

          {/* Desktop Collapse Trigger / Mobile Close Icon */}
          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5 lg:hidden" /> : <Menu className="h-5 w-5 hidden lg:block" />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative group`}
                style={{
                  backgroundColor: isActive ? 'var(--muted)' : 'transparent',
                  color: isActive ? 'var(--foreground)' : 'var(--muted-foreground)',
                }}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
                
                {/* Text Node toggles safely based on state */}
                {!collapsed && <span className="animate-fade-in">{item.name}</span>}

                {/* Hover Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}