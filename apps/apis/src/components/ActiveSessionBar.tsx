import React, { useState } from 'react';
import { 
  Key, 
  Database, 
  RotateCcw, 
  UserCheck, 
  Copy, 
  Check, 
  LogOut, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { ApiSessionState } from '../types';

interface ActiveSessionBarProps {
  session: ApiSessionState;
  onResetSession: () => void;
  onClearAuth: () => void;
  onOpenDatabase: () => void;
  onSelectEndpoint: (endpointId: string) => void;
  onInjectToken?: (token: string) => void;
}

export const ActiveSessionBar: React.FC<ActiveSessionBarProps> = ({
  session,
  onResetSession,
  onClearAuth,
  onOpenDatabase,
  onSelectEndpoint,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedResetToken, setCopiedResetToken] = useState(false);

  const handleCopyToken = () => {
    if (session.activeToken) {
      navigator.clipboard.writeText(session.activeToken);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleCopyResetToken = () => {
    if (session.lastResetToken) {
      navigator.clipboard.writeText(session.lastResetToken);
      setCopiedResetToken(true);
      setTimeout(() => setCopiedResetToken(false), 2000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Active Auth & Identity */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-slate-500 dark:text-slate-400">Session Auth:</span>
            {session.activeToken ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Unauthenticated
              </span>
            )}
          </div>

          {session.activeUser && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200">
              <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="font-semibold">{session.activeUser.firstname} {session.activeUser.lastname}</span>
              <span className="text-indigo-500 dark:text-indigo-400 font-mono text-[11px]">(@{session.activeUser.username})</span>
            </div>
          )}

          {session.activeToken && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopyToken}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1 text-[11px] transition-colors"
                title="Copy current Bearer Token to clipboard"
              >
                {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                <span>{copiedToken ? 'Token Copied!' : 'Copy Token'}</span>
              </button>

              <button
                onClick={onClearAuth}
                className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 text-[11px] transition-colors"
                title="Log out / Clear Bearer Token to test 401 Unauthorized"
              >
                <LogOut className="w-3 h-3" />
                <span>Clear Auth</span>
              </button>
            </div>
          )}

          {/* Reset Token Prompt if available */}
          {session.lastResetToken && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px]">
              <Key className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Active Reset Code: <strong>{session.lastResetCode}</strong></span>
              <button
                onClick={handleCopyResetToken}
                className="ml-1 text-amber-700 dark:text-amber-300 hover:underline font-semibold"
              >
                {copiedResetToken ? 'Copied!' : 'Copy Token'}
              </button>
              <span className="text-amber-300">•</span>
              <button
                onClick={() => onSelectEndpoint('reset-password')}
                className="text-amber-900 dark:text-amber-200 underline font-bold flex items-center gap-0.5"
              >
                Use in Reset API <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Database and Reset Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDatabase}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            title="Inspect all user profiles currently saved in the session database"
          >
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            <span>View Session Users ({session.users.length})</span>
          </button>

          <button
            onClick={onResetSession}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            title="Reset database and authentication back to fresh initial demo state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset State</span>
          </button>
        </div>

      </div>
    </div>
  );
};
