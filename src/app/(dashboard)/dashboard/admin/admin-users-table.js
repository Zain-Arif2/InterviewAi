'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, Loader2, Ban, CheckCircle } from 'lucide-react';
import { getAllUsersAction, toggleUserDisabledAction, updateUserPlanAction } from '@/actions/admin.actions';

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await getAllUsersAction({ search });
    if (result.success) setUsers(result.data.users);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  async function handleToggleDisabled(user) {
    setUpdatingId(user._id);
    const result = await toggleUserDisabledAction(user._id, !user.isDisabled);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isDisabled: result.data.isDisabled } : u)));
      toast.success(result.data.isDisabled ? 'User disabled' : 'User enabled');
    } else {
      toast.error(result.error);
    }
    setUpdatingId(null);
  }

  async function handlePlanChange(user, plan) {
    setUpdatingId(user._id);
    const result = await updateUserPlanAction(user._id, plan);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, subscription: { ...u.subscription, plan } } : u)));
      toast.success(`Plan updated to ${plan}`);
    } else {
      toast.error(result.error);
    }
    setUpdatingId(null);
  }

  return (
    <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Users</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-xl py-2 pl-9 pr-3 text-sm outline-none"
            style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--color-primary-500)' }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Name</th>
                <th className="py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Email</th>
                <th className="py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Plan</th>
                <th className="py-2 text-left font-medium" style={{ color: 'var(--muted-foreground)' }}>Status</th>
                <th className="py-2 text-right font-medium" style={{ color: 'var(--muted-foreground)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-3" style={{ color: 'var(--foreground)' }}>{user.name}</td>
                  <td className="py-3" style={{ color: 'var(--muted-foreground)' }}>{user.email}</td>
                  <td className="py-3">
                    <select
                      value={user.subscription?.plan || 'free'}
                      onChange={(e) => handlePlanChange(user, e.target.value)}
                      disabled={updatingId === user._id || user.role === 'admin'}
                      className="rounded-lg px-2 py-1 text-xs outline-none"
                      style={{ background: 'var(--background)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
                    >
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium"
                      style={
                        user.isDisabled
                          ? { background: 'var(--color-danger-50)', color: 'var(--color-danger-600)' }
                          : { background: 'var(--color-success-50)', color: 'var(--color-success-600)' }
                      }
                    >
                      {user.isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleDisabled(user)}
                        disabled={updatingId === user._id}
                        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
                        style={
                          user.isDisabled
                            ? { background: 'var(--color-success-50)', color: 'var(--color-success-600)' }
                            : { background: 'var(--color-danger-50)', color: 'var(--color-danger-600)' }
                        }
                      >
                        {user.isDisabled ? <CheckCircle className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                        {user.isDisabled ? 'Enable' : 'Disable'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>No users found.</p>
          )}
        </div>
      )}
    </div>
  );
}