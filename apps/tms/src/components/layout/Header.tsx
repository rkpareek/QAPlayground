import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateProjectModal } from '../projects/CreateProjectModal';
import {
  Search,
  Plus,
  Bell,
  Keyboard,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Layers,
  Server,
  UserCheck,
  Check,
  FolderPlus,
  BookOpen,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentProject,
    projects,
    setCurrentProjectId,
    currentUser,
    users,
    setCurrentUserId,
    environments,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setIsSearchOpen,
    setIsQuickCreateOpen,
    setIsShortcutsOpen,
    resetAllDemoData,
    setNavSection,
    setSelectedTestRunId,
    setSelectedDefectId,
  } = useApp();

  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const projectMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const activeEnv = environments.find((e) => e.projectId === currentProject.id && e.isDefault) || environments[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (projectMenuRef.current && !projectMenuRef.current.contains(e.target as Node)) {
        setIsProjectMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Left: Project Selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={projectMenuRef}>
          <button
            onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-100 transition-colors text-left border border-slate-200"
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-xs"
              style={{ backgroundColor: currentProject.color }}
            >
              {currentProject.key.substring(0, 2)}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 leading-none">{currentProject.name}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">{currentProject.key}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {isProjectMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Project
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setCurrentProjectId(proj.id);
                    setIsProjectMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    proj.id === currentProject.id ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-4 h-4 rounded text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: proj.color }}
                    >
                      {proj.key.substring(0, 2)}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-medium text-slate-800 truncate">{proj.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{proj.key}</div>
                    </div>
                  </div>
                  {proj.id === currentProject.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}

              {/* Create New Project Option */}
              <div className="pt-1.5 mt-1 border-t border-slate-200 px-1">
                <button
                  onClick={() => {
                    setIsProjectMenuOpen(false);
                    setIsCreateProjectOpen(true);
                  }}
                  className="w-full px-2.5 py-1.5 rounded text-left flex items-center gap-2 text-blue-600 hover:bg-blue-50 text-xs font-semibold transition-colors"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>+ Create New Project</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Environment Tag */}
        {activeEnv && (
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-slate-50 text-slate-600 rounded text-xs border border-slate-200">
            <Server className="w-3 h-3 text-emerald-500" />
            <span className="font-medium text-[11px]">{activeEnv.name}</span>
          </div>
        )}
      </div>

      {/* Center: Global Search Bar Button */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full h-8 px-3 rounded-md bg-slate-100 hover:bg-slate-200/80 border border-slate-200 flex items-center justify-between text-slate-500 text-xs transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-400 truncate">Search test cases, runs, defects, requirements...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 text-slate-500 shadow-2xs">
            ⌘K / S
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Create + button */}
        <button
          onClick={() => setIsQuickCreateOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          title="Quick Create (N)"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Documentation / Knowledge Base button */}
        <button
          onClick={() => setNavSection('documentation')}
          className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          title="Knowledge Base & Integrations Docs"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        {/* Keyboard Shortcuts button */}
        <button
          onClick={() => setIsShortcutsOpen(true)}
          className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900">Notifications ({unreadNotifs.length})</span>
                <button
                  onClick={clearAllNotifications}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.linkView) setNavSection(notif.linkView as any);
                        if (notif.linkEntityId) {
                          if (notif.linkView === 'test-runs') setSelectedTestRunId(notif.linkEntityId);
                          if (notif.linkView === 'defects') setSelectedDefectId(notif.linkEntityId);
                        }
                        setIsNotifOpen(false);
                      }}
                      className={`p-3 text-left hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-800 leading-snug">{notif.title}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (confirm('Reset all projects, test cases, and runs to default demo data?')) {
              resetAllDemoData();
            }
          }}
          className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors"
          title="Restore seed demo data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo</span>
        </button>

        {/* User Persona Switcher */}
        <div className="relative border-l border-slate-200 pl-2 ml-1" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-slate-100 transition-colors text-left"
            title="Switch User Persona"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-300"
            />
            <div className="hidden xl:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 leading-none">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 capitalize">{currentUser.role.replace('_', ' ')}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Active Persona
              </div>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUserId(u.id);
                    setIsUserMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    u.id === currentUser.id ? 'bg-blue-50/70' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-800">{u.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.title}</div>
                    </div>
                  </div>
                  {u.id === currentUser.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
      />
    </header>
  );
};
