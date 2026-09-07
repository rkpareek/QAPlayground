import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { QuickCreateModal } from './components/layout/QuickCreateModal';
import { ShortcutsModal } from './components/layout/ShortcutsModal';
import { ToastContainer } from './components/common/ToastContainer';
import { QuickAddTestCaseModal } from './components/automation/QuickAddTestCaseModal';
import { ImportAutomatedTestsModal } from './components/automation/ImportAutomatedTestsModal';
import { XmlResultImportModal } from './components/automation/XmlResultImportModal';
import { AccessInspectorModal } from './components/automation/AccessInspectorModal';

// Feature Modules
import { ProjectDashboard } from './components/dashboard/ProjectDashboard';
import { TestRepository } from './components/repository/TestRepository';
import { ExecutionCockpit } from './components/execution/ExecutionCockpit';
import { TestRunsList } from './components/runs/TestRunsList';
import { TestPlansList } from './components/plans/TestPlansList';
import { RequirementsView } from './components/requirements/RequirementsView';
import { TraceabilityMatrix } from './components/traceability/TraceabilityMatrix';
import { DefectsView } from './components/defects/DefectsView';
import { AutomatedTestsView } from './components/automation/AutomatedTestsView';
import { AutomationRunsView } from './components/automation/AutomationRunsView';
import { AutomationAnalyticsView } from './components/automation/AutomationAnalyticsView';
import { QualityAnalytics } from './components/analytics/QualityAnalytics';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { AuditLogView } from './components/audit/AuditLogView';
import { MyWorkView } from './components/mywork/MyWorkView';
import { DocumentationView } from './components/docs/DocumentationView';

const MainLayout: React.FC = () => {
  const { navSection, setNavSection } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Hotkeys handler
  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in input / textarea
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      // 1. Search Shortcut (Cmd+K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      if (isInputActive) return;

      // 2. Help / Shortcuts Shortcut (?)
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 3. Quick Create (c)
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsQuickCreateOpen(true);
        return;
      }

      // 4. Two-key chord navigation (e.g. g then d, g then r)
      const now = Date.now();
      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          setNavSection('dashboard');
        } else if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          setNavSection('repository');
        } else if (e.key.toLowerCase() === 'e') {
          e.preventDefault();
          setNavSection('test-execution');
        } else if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          setNavSection('traceability');
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          setNavSection('defects');
        }
        lastKey = '';
        return;
      }

      if (e.key === 'g') {
        lastKey = 'g';
        lastKeyTime = now;
      } else {
        lastKey = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setNavSection]);

  const renderActiveView = () => {
    switch (navSection) {
      case 'dashboard':
        return <ProjectDashboard />;
      case 'my-work':
        return <MyWorkView />;
      case 'repository':
        return <TestRepository />;
      case 'test-execution':
        return <ExecutionCockpit />;
      case 'test-runs':
        return <TestRunsList />;
      case 'test-plans':
        return <TestPlansList />;
      case 'requirements':
        return <RequirementsView />;
      case 'traceability':
        return <TraceabilityMatrix />;
      case 'defects':
        return <DefectsView />;
      case 'automation':
        return <AutomatedTestsView />;
      case 'automation-runs':
        return <AutomationRunsView />;
      case 'automation-analytics':
        return <AutomationAnalyticsView />;
      case 'analytics':
        return <QualityAnalytics />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
      case 'users':
      case 'teams':
      case 'labels':
      case 'custom-fields':
        return <SettingsView />;
      case 'documentation':
        return <DocumentationView />;
      case 'audit-log':
        return <AuditLogView />;
      default:
        return <ProjectDashboard />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* Global Sidebar Navigation */}
      <Sidebar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Workspace View */}
        <main className="flex-1 flex overflow-hidden relative">{renderActiveView()}</main>
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <QuickCreateModal />
      <ShortcutsModal />
      <QuickAddTestCaseModal />
      <ImportAutomatedTestsModal />
      <XmlResultImportModal />
      <AccessInspectorModal />
      <ToastContainer />
    </div>
  );
};

export const TmsApp: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default TmsApp;
