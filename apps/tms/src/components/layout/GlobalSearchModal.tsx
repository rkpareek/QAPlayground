import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  FileCode,
  PlayCircle,
  CalendarCheck,
  Bug,
  ListTodo,
  ArrowRight,
  Folder,
} from 'lucide-react';
import { PriorityBadge, ExecutionBadge } from '../common/Badges';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    currentProject,
    testCases,
    testRuns,
    testPlans,
    defects,
    requirements,
    suites,
    setNavSection,
    setSelectedTestCaseId,
    setSelectedTestRunId,
    setSelectedPlanId,
    setSelectedDefectId,
    setSelectedRequirementId,
    setSelectedSuiteId,
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const items: Array<{
      type: 'test_case' | 'test_run' | 'test_plan' | 'defect' | 'requirement' | 'suite';
      id: string;
      title: string;
      subtitle: string;
      meta?: any;
    }> = [];

    // Test cases
    if (filterType === 'all' || filterType === 'test_case') {
      testCases
        .filter((tc) => tc.projectId === currentProject.id)
        .forEach((tc) => {
          if (
            tc.id.toLowerCase().includes(q) ||
            tc.title.toLowerCase().includes(q) ||
            tc.description.toLowerCase().includes(q) ||
            tc.tags.some((t) => t.toLowerCase().includes(q))
          ) {
            items.push({
              type: 'test_case',
              id: tc.id,
              title: `${tc.id}: ${tc.title}`,
              subtitle: `Suite: ${suites.find((s) => s.id === tc.suiteId)?.name || 'Default'} • Type: ${tc.testType}`,
              meta: tc.priority,
            });
          }
        });
    }

    // Test runs
    if (filterType === 'all' || filterType === 'test_run') {
      testRuns
        .filter((r) => r.projectId === currentProject.id)
        .forEach((r) => {
          if (r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) {
            items.push({
              type: 'test_run',
              id: r.id,
              title: `${r.id}: ${r.name}`,
              subtitle: `Build: ${r.buildVersion} • Items: ${r.items.length} • Status: ${r.status}`,
              meta: r.status,
            });
          }
        });
    }

    // Test plans
    if (filterType === 'all' || filterType === 'test_plan') {
      testPlans
        .filter((p) => p.projectId === currentProject.id)
        .forEach((p) => {
          if (p.id.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.objective.toLowerCase().includes(q)) {
            items.push({
              type: 'test_plan',
              id: p.id,
              title: `${p.id}: ${p.name}`,
              subtitle: `Status: ${p.status} • Planned tests: ${p.selectedTestCaseIds.length}`,
              meta: p.priority,
            });
          }
        });
    }

    // Defects
    if (filterType === 'all' || filterType === 'defect') {
      defects
        .filter((d) => d.projectId === currentProject.id)
        .forEach((d) => {
          if (d.id.toLowerCase().includes(q) || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)) {
            items.push({
              type: 'defect',
              id: d.id,
              title: `${d.id}: ${d.title}`,
              subtitle: `Severity: ${d.severity} • Status: ${d.status}`,
              meta: d.severity,
            });
          }
        });
    }

    // Requirements
    if (filterType === 'all' || filterType === 'requirement') {
      requirements
        .filter((req) => req.projectId === currentProject.id)
        .forEach((req) => {
          if (req.id.toLowerCase().includes(q) || req.title.toLowerCase().includes(q) || req.description.toLowerCase().includes(q)) {
            items.push({
              type: 'requirement',
              id: req.id,
              title: `${req.id}: ${req.title}`,
              subtitle: `Priority: ${req.priority} • Status: ${req.status}`,
              meta: req.priority,
            });
          }
        });
    }

    return items.slice(0, 20);
  }, [query, filterType, currentProject.id, testCases, testRuns, testPlans, defects, requirements, suites]);

  if (!isSearchOpen) return null;

  const handleSelect = (item: (typeof results)[0]) => {
    setIsSearchOpen(false);
    if (item.type === 'test_case') {
      setSelectedTestCaseId(item.id);
      setNavSection('repository');
    } else if (item.type === 'test_run') {
      setSelectedTestRunId(item.id);
      setNavSection('test-runs');
    } else if (item.type === 'test_plan') {
      setSelectedPlanId(item.id);
      setNavSection('test-plans');
    } else if (item.type === 'defect') {
      setSelectedDefectId(item.id);
      setNavSection('defects');
    } else if (item.type === 'requirement') {
      setSelectedRequirementId(item.id);
      setNavSection('requirements');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 px-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search everything in project (e.g. login, OBANK-TC-0001, FedNow)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-slate-900 placeholder-slate-400 outline-hidden bg-transparent"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All Entities' },
            { id: 'test_case', label: 'Test Cases' },
            { id: 'test_run', label: 'Test Runs' },
            { id: 'test_plan', label: 'Test Plans' },
            { id: 'defect', label: 'Defects' },
            { id: 'requirement', label: 'Requirements' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilterType(pill.id)}
              className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                filterType === pill.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100">
          {!query.trim() ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-medium text-slate-600">Global Repository Search</p>
              <p className="text-slate-400 mt-1">Type keywords, entity IDs (e.g. TC-0001, BUG-0001), or tags.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No matching records found for <span className="font-semibold text-slate-700">"{query}"</span>
            </div>
          ) : (
            results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleSelect(item)}
                className="w-full p-2.5 rounded-lg text-left hover:bg-slate-50 flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-md bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                    {item.type === 'test_case' && <FileCode className="w-4 h-4" />}
                    {item.type === 'test_run' && <PlayCircle className="w-4 h-4" />}
                    {item.type === 'test_plan' && <CalendarCheck className="w-4 h-4" />}
                    {item.type === 'defect' && <Bug className="w-4 h-4" />}
                    {item.type === 'requirement' && <ListTodo className="w-4 h-4" />}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
};
