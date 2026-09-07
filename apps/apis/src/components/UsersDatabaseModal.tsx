import React, { useState } from 'react';
import { X, Database, Copy, Check, UserCheck, Shield, Key } from 'lucide-react';
import { StoredUser, UserProfile } from '../types';

interface UsersDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: StoredUser[];
  activeUser: UserProfile | null;
  onSelectUserForTesting?: (user: StoredUser) => void;
}

export const UsersDatabaseModal: React.FC<UsersDatabaseModalProps> = ({
  isOpen,
  onClose,
  users,
  activeUser,
  onSelectUserForTesting,
}) => {
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, type: 'uid' | 'email') => {
    navigator.clipboard.writeText(text);
    if (type === 'uid') {
      setCopiedUid(text);
      setTimeout(() => setCopiedUid(null), 1500);
    } else {
      setCopiedEmail(text);
      setTimeout(() => setCopiedEmail(null), 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Session Users Database ({users.length})
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Data persists in your browser session. As you register, update, or delete users, records update here in real time.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-3">UID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Username</th>
                  <th className="py-2.5 px-3">Gender</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Password (Plain/Hash)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {users.map((user) => {
                  const isActive = activeUser?.uid === user.uid;
                  return (
                    <tr
                      key={user.uid}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        isActive ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        {user.uid}
                        <button
                          onClick={() => copyToClipboard(user.uid, 'uid')}
                          className="text-slate-400 hover:text-indigo-600 p-0.5 rounded"
                          title="Copy UID"
                        >
                          {copiedUid === user.uid ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-1.5">
                          <span>{user.firstname} {user.lastname}</span>
                          {isActive && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200">
                              Active User
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>{user.email}</span>
                          <button
                            onClick={() => copyToClipboard(user.email, 'email')}
                            className="text-slate-400 hover:text-indigo-600 p-0.5 rounded"
                            title="Copy Email"
                          >
                            {copiedEmail === user.email ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        @{user.username}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                        {user.gender}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {user.age}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                          {user.passwordHash}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {onSelectUserForTesting && (
                          <button
                            onClick={() => {
                              onSelectUserForTesting(user);
                              onClose();
                            }}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-slate-700 hover:text-indigo-600 dark:text-slate-300 text-[11px] font-medium transition-colors"
                          >
                            Use in Test
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              QA Educational Note on Credentials:
            </p>
            <p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
              In a real production REST API, passwords and hashes are strictly concealed from client-facing responses. Here in the sandbox, they are displayed so you can easily test credentials, forgot password recovery, and login scenarios!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs">
          <span className="text-slate-500">
            Total records: <strong className="text-slate-800 dark:text-slate-200">{users.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
