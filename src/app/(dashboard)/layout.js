'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LayoutDashboard, MessageSquare, BarChart3, CreditCard, Settings, ShieldCheck, X, Menu, Mic, User } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Interviews', href: '/dashboard/interviews', icon: MessageSquare },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminNavItem = { name: 'Admin', href: '/dashboard/admin', icon: ShieldCheck };

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const items = isAdmin ? [...navigationItems, adminNavItem] : navigationItems;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300
    lg:static lg:translate-x-0 border-[var(--border)] bg-[var(--background)]
    ${collapsed ? 'lg:w-20' : 'lg:w-64'}
    ${mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
  `;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))' }}
            >
              <Mic className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg text-[var(--foreground)] whitespace-nowrap animate-fade-in">
                InterviewAI
              </span>
            )}
          </div>

          <button
            onClick={mobileOpen ? onMobileClose : onToggle}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5 lg:hidden" /> : <Menu className="h-5 w-5 hidden lg:block" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors relative group`}
                style={{
                  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                  color: isActive ? 'var(--sidebar-active-text)' : 'var(--muted-foreground)',
                }}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />

                {!collapsed && <span className="animate-fade-in">{item.name}</span>}

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

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--background)' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Navbar
          onMenuClick={() => setMobileOpen(true)}
          sidebarCollapsed={collapsed}
        />

        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}