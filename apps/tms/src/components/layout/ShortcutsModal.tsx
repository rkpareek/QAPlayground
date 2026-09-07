import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Keyboard, Zap } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: '⌘K / S', label: 'Open Global Search across all tests, runs, and defects' },
    { key: 'N', label: 'Quick Create dialog (Test Case, Run, Plan, Defect)' },
    { key: '?', label: 'Open Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', label: 'Close modals, drawers, and overlay dialogs' },
    { key: 'P', label: 'Mark current test step/case as PASSED (in Execution Cockpit)' },
    { key: 'F', label: 'Mark current test step/case as FAILED (in Execution Cockpit)' },
    { key: 'B', label: 'Mark current test step/case as BLOCKED (in Execution Cockpit)' },
    { key: '→ / ↓', label: 'Navigate to Next test case during execution' },
    { key: '← / ↑', label: 'Navigate to Previous test case during execution' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 divide-y divide-slate-100 text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <span className="text-slate-600 font-medium">{sc.label}</span>
              <kbd className="px-2 py-1 font-mono text-[11px] bg-slate-100 border border-slate-300 rounded text-slate-800 font-semibold shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-400">
          Optimized for rapid QA execution workflows & navigation
        </div>
      </div>
    </div>
  );
};
