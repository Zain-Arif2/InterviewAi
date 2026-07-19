'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Always use light mode' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark mode' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' },
  ];

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--foreground)' }}>
          Settings
        </h1>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Manage your application preferences
        </p>
      </div>

      {/* Appearance Card */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--muted)' }}
          >
            <Sun className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Appearance
            </h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Choose your preferred theme
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className="flex flex-col items-center text-center gap-2 rounded-xl p-4 transition-all duration-200 border cursor-pointer"
                style={{
                  background: isActive ? 'var(--muted)' : 'transparent',
                  borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? 'var(--primary)' : 'var(--muted-foreground)' }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    {option.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications Section */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--muted)' }}
          >
            <Bell className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Notifications
            </h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Configure alert system parameters
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Notification routes and triggers are managed automatically based on system events.
        </p>
      </div>

      {/* Privacy and Security Section */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'var(--muted)' }}
          >
            <Shield className="h-5 w-5" style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
              Security
            </h3>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Session and access management
            </p>
          </div>
        </div>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Your active token lifecycle is secured dynamically via protected sessions.
        </p>
      </div>
    </div>
  );
}