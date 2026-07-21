'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useCurrentUser } from '@/hooks/use-current-user';
import { logoutAction } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu, Sun, Moon, LogOut, User, Settings,
  ChevronDown, Bell,
} from 'lucide-react';

export function Navbar({ onMenuClick, sidebarCollapsed }) {
  const { theme, setTheme } = useTheme();
  const { user } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logoutAction();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch {
      toast.error('Failed to logout');
    }
  };

  // Generate breadcrumb from pathname
  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((segment, i, arr) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: '/' + arr.slice(0, i + 1).join('/'),
      isLast: i === arr.length - 1,
    }));

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 md:px-6"
      style={{
        background: 'var(--background)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--muted)] lg:hidden text-[var(--foreground)]"
        style={{ borderColor: 'var(--border)' }}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </button>

      {/* Breadcrumbs Navigation */}
      <nav className="hidden sm:flex flex-1 items-center gap-1.5 text-sm font-medium">
        {breadcrumbs.map((crumb, idx) => (
          <div key={crumb.href} className="flex items-center gap-1.5">
            {idx > 0 && <span style={{ color: 'var(--muted-foreground)' }}>/</span>}
            {crumb.isLast ? (
              <span className="truncate max-w-[140px] md:max-w-[240px]" style={{ color: 'var(--foreground)' }}>
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="transition-colors hover:text-[var(--foreground)]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Utilities Right Actions Area */}
      <div className="ml-auto flex items-center gap-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--muted)] text-[var(--foreground)]"
          style={{ borderColor: 'var(--border)' }}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {/* Notifications Mock Trigger */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border transition-colors hover:bg-[var(--muted)] text-[var(--foreground)]"
          style={{ borderColor: 'var(--border)' }}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Dropdown User Trigger Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 rounded-full p-0.5 transition-colors hover:bg-[var(--muted)] text-[var(--foreground)]"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.name || 'User avatar'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground uppercase">
                {user?.name?.slice(0, 2) || <User className="h-4 w-4" />}
              </div>
            )}
            <ChevronDown className={`h-4 w-4 text-[var(--muted-foreground)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Floating Dropdown Menu Card */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border p-1 shadow-md animate-fade-in focus:outline-none z-50"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="px-3 py-2 border-b border-[var(--border)] mb-1">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--foreground)' }}>
                  {user?.name || 'Account'}
                </p>
                <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--muted)]"
                style={{ color: 'var(--foreground)' }}
              >
                <Settings className="h-4 w-4 text-[var(--muted-foreground)]" />
                Account settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--destructive-muted,var(--muted))] text-[var(--destructive,calc(var(--foreground)))]"
              >
                <LogOut className="h-4 w-4" />
                Sign outt
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}