import React, { useState, useEffect } from 'react';
import { Layers, Database, Sparkles, Shield, Code2, Terminal } from 'lucide-react';
import { API_ENDPOINTS } from './data/endpoints';
import { MockServer } from './mockServer';
import { ApiSessionState, StoredUser } from './types';
import { ActiveSessionBar } from './components/ActiveSessionBar';
import { ApiSidebar } from './components/ApiSidebar';
import { ApiDetailPanel } from './components/ApiDetailPanel';
import { UsersDatabaseModal } from './components/UsersDatabaseModal';

export const ApisApp: React.FC = () => {
  const [session, setSession] = useState<ApiSessionState>(() => MockServer.getSession());
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('register-user');
  const [executedEndpoints, setExecutedEndpoints] = useState<string[]>([]);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);

  // Sync session state from MockServer
  const refreshSession = () => {
    setSession(MockServer.getSession());
  };

  const handleResetSession = () => {
    const fresh = MockServer.resetSession();
    setSession(fresh);
    setExecutedEndpoints([]);
  };

  const handleClearAuth = () => {
    MockServer.clearSessionAuth();
    refreshSession();
  };

  const handleEndpointExecuted = (endpointId: string) => {
    if (!executedEndpoints.includes(endpointId)) {
      setExecutedEndpoints(prev => [...prev, endpointId]);
    }
  };

  const selectedEndpoint = API_ENDPOINTS.find(e => e.id === selectedEndpointId) || API_ENDPOINTS[0];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* 1. Header & Playground Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-xs">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  API Testing Playground
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Interactive learning sandbox for testing REST APIs, authentication flows, and token authorization.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Learning Stats */}
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {API_ENDPOINTS.length} Mock Endpoints
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Session Persistent
            </span>
          </div>
        </div>

        {/* 2. Active Session Toolbar */}
        <ActiveSessionBar
          session={session}
          onResetSession={handleResetSession}
          onClearAuth={handleClearAuth}
          onOpenDatabase={() => setIsDatabaseModalOpen(true)}
          onSelectEndpoint={id => setSelectedEndpointId(id)}
        />

        {/* 3. Main Split View: Sidebar + Detail Workbench */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <ApiSidebar
            endpoints={API_ENDPOINTS}
            selectedEndpointId={selectedEndpointId}
            onSelectEndpoint={id => setSelectedEndpointId(id)}
            executedEndpoints={executedEndpoints}
          />

          <ApiDetailPanel
            key={selectedEndpoint.id}
            endpoint={selectedEndpoint}
            session={session}
            onEndpointExecuted={handleEndpointExecuted}
            onRefreshSession={refreshSession}
            onNavigateToEndpoint={id => setSelectedEndpointId(id)}
          />
        </div>

        {/* 4. Live Session Users Modal */}
        <UsersDatabaseModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
          users={session.users}
          activeUser={session.activeUser}
          onSelectUserForTesting={(user: StoredUser) => {
            // When user is selected, if Login is open, can pre-populate or navigate to Login
            setSelectedEndpointId('login-user');
          }}
        />

      </div>
    </div>
  );
};
