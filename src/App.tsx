import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../packages/shared-ui/ThemeContext';
import { SharedHeader } from '../packages/shared-ui/SharedHeader';
import { DashboardApp } from '../apps/dashboard/src/DashboardApp';
import { CommandPalette } from '../apps/dashboard/src/CommandPalette';

// Applications
import { TmsApp } from '../apps/tms/src/TmsApp';
import { QaStudyHubApp } from '../apps/qa-studyhub/src/QaStudyHubApp';
import { DemoTestingApp } from '../apps/demo-testing/src/DemoTestingApp';
import { ApiTestingApp } from '../apps/api-testing/src/ApiTestingApp';
import { AutomationApp } from '../apps/automation/src/AutomationApp';
import { PerformanceTestingApp } from '../apps/performance-testing/src/PerformanceTestingApp';
import { TestDataApp } from '../apps/test-data/src/TestDataApp';
import { ApisApp } from '../apps/apis/src/ApisApp';

export const App: React.FC = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-150 flex flex-col font-sans">
        {/* Unified App Header */}
        <SharedHeader onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />

        {/* Global Command Palette */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />

        {/* Primary Route Mount */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardApp onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />} />
            <Route path="/tms/*" element={<TmsApp />} />
            <Route path="/qa-studyhub/*" element={<QaStudyHubApp />} />
            <Route path="/demo-testing/*" element={<DemoTestingApp />} />
            <Route path="/apis/*" element={<ApisApp />} />
            <Route path="/api-testing/*" element={<ApiTestingApp />} />
            <Route path="/automation/*" element={<AutomationApp />} />
            <Route path="/performance-testing/*" element={<PerformanceTestingApp />} />
            <Route path="/test-data/*" element={<TestDataApp />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;
