import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';
import {
  LayoutDashboard,
  FolderTree,
  FileCheck,
  CalendarCheck,
  PlayCircle,
  Bug,
  ListTodo,
  FileSpreadsheet,
  Zap,
  BarChart3,
  FileText,
  UserCheck,
  Settings,
  History,
  ShieldCheck,
  SlidersHorizontal,
  ChevronRight,
  BookOpen,
  Users,
  Shield,
  Tag,
  Sliders,
} from 'lucide-react';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const {
    navSection,
    setNavSection,
    currentProject,
    testRuns,
    defects,
    testCases,
    currentUser,
    setSelectedTestRunId,
  } = useApp();

  // Calculate live badges
  const activeRuns = testRuns.filter((r) => r.projectId === currentProject.id && r.status === 'in_progress').length;
  const openDefects = defects.filter((d) => d.projectId === currentProject.id && (d.status === 'open' || d.status === 'in_progress')).length;
  const myAssignedTests = testRuns
    .filter((r) => r.projectId === currentProject.id)
    .flatMap((r) => r.items)
    .filter((item) => item.assignedToId === currentUser.id && item.status === 'not_run').length;

  const sections: { title: string; items: NavItem[] }[] = [
    {
      title: 'Workspace',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'my-work', label: 'My Work', icon: <UserCheck className="w-4 h-4" />, badge: myAssignedTests > 0 ? myAssignedTests : undefined, badgeColor: 'bg-blue-100 text-blue-800' },
      ],
    },
    {
      title: 'Testing',
      items: [
        { id: 'repository', label: 'Test Repository', icon: <FolderTree className="w-4 h-4" /> },
        { id: 'test-plans', label: 'Test Plans', icon: <CalendarCheck className="w-4 h-4" /> },
        {
          id: 'test-runs',
          label: 'Test Runs',
          icon: <PlayCircle className="w-4 h-4" />,
          badge: activeRuns > 0 ? `${activeRuns} active` : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
        { id: 'test-execution', label: 'Execution Cockpit', icon: <FileCheck className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Quality & Traceability',
      items: [
        { id: 'requirements', label: 'Requirements', icon: <ListTodo className="w-4 h-4" /> },
        { id: 'traceability', label: 'Traceability Matrix', icon: <ShieldCheck className="w-4 h-4" /> },
        {
          id: 'defects',
          label: 'Defects',
          icon: <Bug className="w-4 h-4" />,
          badge: openDefects > 0 ? openDefects : undefined,
          badgeColor: 'bg-red-100 text-red-800',
        },
      ],
    },
    {
      title: 'Automation',
      items: [
        { id: 'automation-tests', label: 'Automated Tests', icon: <Zap className="w-4 h-4" /> },
        { id: 'automation-runs', label: 'Automation Runs', icon: <PlayCircle className="w-4 h-4" /> },
        { id: 'automation-analytics', label: 'Auto Analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'analytics', label: 'Quality Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'reports', label: 'Test Reports', icon: <FileText className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Administration',
      items: [
        { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
        { id: 'teams', label: 'Teams & Squads', icon: <Shield className="w-4 h-4" /> },
        { id: 'labels', label: 'Labels & Tag Registry', icon: <Tag className="w-4 h-4" /> },
        { id: 'custom-fields', label: 'Custom Fields Engine', icon: <Sliders className="w-4 h-4" /> },
        { id: 'settings', label: 'Project Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'audit-log', label: 'Activity Audit Log', icon: <History className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Documentation',
      items: [
        { id: 'documentation', label: 'Documentation', icon: <BookOpen className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-14 flex items-center px-4 gap-2.5 border-b border-slate-800 bg-slate-950/50">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md">
          TO
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            TestOne
            <span className="text-[9px] uppercase font-semibold px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              PRO
            </span>
          </span>
          <span className="text-[10px] text-slate-400 leading-none">Test Management System</span>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((section) => (
          <div key={section.title} className="space-y-0.5">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = navSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setNavSection(item.id);
                    if (item.id === 'test-execution') {
                      // pick first active run if none selected
                      const active = testRuns.find((r) => r.projectId === currentProject.id && r.status === 'in_progress');
                      if (active) setSelectedTestRunId(active.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Quick Project Summary */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Project Repository</span>
          <span className="font-mono text-slate-300">
            {testCases.filter((tc) => tc.projectId === currentProject.id && !tc.isArchived).length} tests
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-blue-500 h-full rounded-full"
            style={{ width: `${Math.min(100, (testCases.filter((tc) => tc.projectId === currentProject.id).length / 30) * 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
};
