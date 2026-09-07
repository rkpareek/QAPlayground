import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavSectionId } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { HomeView } from './views/HomeView';
import { ManualTestingView } from './views/ManualTestingView';
import { TerminologyView } from './views/TerminologyView';
import { ApiTestingView } from './views/ApiTestingView';
import { AutomationView } from './views/AutomationView';
import { SecurityTestingView } from './views/SecurityTestingView';
import { ToolsView } from './views/ToolsView';
import { InterviewView } from './views/InterviewView';

const QaStudyHubInner: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  // Derive section from URL path, e.g. /qa-studyhub/manual-testing -> manual-testing
  const getSectionFromPath = (): NavSectionId => {
    const cleanPath = location.pathname.replace(/^\/qa-studyhub\/?/, '');
    if (!cleanPath || cleanPath === 'home') return 'home';
    if (cleanPath === 'manual' || cleanPath === 'manual-testing') return 'manual-testing';
    if (cleanPath === 'terminology') return 'terminology';
    if (cleanPath === 'api' || cleanPath === 'api-testing') return 'api-testing';
    if (cleanPath === 'automation') return 'automation';
    if (cleanPath === 'security') return 'security';
    if (cleanPath === 'tools') return 'tools';
    if (cleanPath === 'interview') return 'interview';
    return 'home';
  };

  const currentSection = getSectionFromPath();

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSection = (sectionId: NavSectionId, subSectionId?: string) => {
    const targetPath = sectionId === 'home' ? '/qa-studyhub' : `/qa-studyhub/${sectionId}`;
    navigate(targetPath);

    if (subSectionId) {
      setTimeout(() => {
        const el = document.getElementById(subSectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 120);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-600 selection:text-white font-sans">
      {/* Header Navigation */}
      <Navbar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {currentSection === 'home' && (
          <HomeView
            onSelectSection={handleSelectSection}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}
        {currentSection === 'manual-testing' && (
          <ManualTestingView onNavigateSection={handleSelectSection} />
        )}
        {currentSection === 'terminology' && <TerminologyView />}
        {currentSection === 'api-testing' && <ApiTestingView />}
        {currentSection === 'automation' && <AutomationView />}
        {currentSection === 'security' && <SecurityTestingView />}
        {currentSection === 'tools' && <ToolsView />}
        {currentSection === 'interview' && <InterviewView />}
      </div>

      {/* Global Search & Quick Navigation Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSelectSection}
      />

      {/* Site Footer */}
      <Footer onSelectSection={handleSelectSection} />
    </div>
  );
};

export const QaStudyHubApp: React.FC = () => {
  return (
    <LanguageProvider>
      <QaStudyHubInner />
    </LanguageProvider>
  );
};

export default QaStudyHubApp;
