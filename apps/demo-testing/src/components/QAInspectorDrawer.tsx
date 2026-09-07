import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Bug, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Search, 
  Sliders, 
  Layers, 
  ShieldAlert, 
  BookOpen, 
  PlusCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { BugCategory, BugSeverity, KnownBug, UserBugReport } from '../types';

export const QAInspectorDrawer: React.FC = () => {
  const {
    isQADrawerOpen,
    setIsQADrawerOpen,
    qaDrawerInitialTab,
    knownBugs,
    foundBugCodes,
    toggleBugFound,
    userBugReports,
    addUserBugReport,
    deleteUserBugReport,
    isBugMode,
    setIsBugMode,
    resetAllData,
    setCurrentPage,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bugs' | 'log' | 'reports' | 'guide'>('bugs');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedHints, setRevealedHints] = useState<Record<string, { hint1?: boolean; hint2?: boolean; solution?: boolean }>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New Bug Report Form State
  const [reportBugCode, setReportBugCode] = useState<string>('');
  const [reportTitle, setReportTitle] = useState<string>('');
  const [reportPage, setReportPage] = useState<string>('Products Page');
  const [reportCategory, setReportCategory] = useState<BugCategory>('Functional');
  const [reportSeverity, setReportSeverity] = useState<BugSeverity>('Major');
  const [reportSteps, setReportSteps] = useState<string>('1. Navigate to...\n2. Click on...\n3. Observe...');
  const [reportExpected, setReportExpected] = useState<string>('');
  const [reportActual, setReportActual] = useState<string>('');
  const [reportEnvironment, setReportEnvironment] = useState<string>('Chrome 128 / macOS (AI Studio Preview)');

  useEffect(() => {
    if (qaDrawerInitialTab === 'bugs') setActiveTab('bugs');
    else if (qaDrawerInitialTab === 'log') setActiveTab('log');
    else if (qaDrawerInitialTab === 'guide') setActiveTab('guide');
    else if (qaDrawerInitialTab === 'scenarios') setActiveTab('guide');
  }, [qaDrawerInitialTab, isQADrawerOpen]);

  if (!isQADrawerOpen) return null;

  const toggleHint = (bugId: string, type: 'hint1' | 'hint2' | 'solution') => {
    setRevealedHints((prev) => ({
      ...prev,
      [bugId]: {
        ...prev[bugId],
        [type]: !prev[bugId]?.[type]
      }
    }));
  };

  const prefillReportForm = (bug: KnownBug) => {
    setReportBugCode(bug.code);
    setReportTitle(`[${bug.code}] ${bug.title}`);
    setReportPage(bug.page);
    setReportCategory(bug.category);
    setReportSeverity(bug.severity);
    setReportSteps(bug.stepsToReproduce.join('\n'));
    setReportExpected(bug.expectedResult);
    setReportActual(bug.actualResult);
    setActiveTab('log');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) {
      showToast('Please enter a bug title.', 'error');
      return;
    }

    addUserBugReport({
      bugCode: reportBugCode || undefined,
      title: reportTitle,
      page: reportPage,
      category: reportCategory,
      severity: reportSeverity,
      stepsToReproduce: reportSteps,
      expectedResult: reportExpected,
      actualResult: reportActual,
      environment: reportEnvironment
    });

    if (reportBugCode && !foundBugCodes.includes(reportBugCode)) {
      toggleBugFound(reportBugCode);
    }

    // Reset Form
    setReportBugCode('');
    setReportTitle('');
    setReportExpected('');
    setReportActual('');
    setReportSteps('1. Navigate to...\n2. Click on...\n3. Observe...');
    setActiveTab('reports');
  };

  const exportAsMarkdown = () => {
    if (userBugReports.length === 0) {
      showToast('No logged bug reports to export.', 'info');
      return;
    }

    let md = `# QA Defect Test Report - BugCraft\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
    md += `## Summary of Logged Bugs (${userBugReports.length} total)\n\n`;

    userBugReports.forEach((rep, idx) => {
      md += `### ${idx + 1}. [${rep.severity}] ${rep.title}\n`;
      md += `- **ID**: ${rep.id} ${rep.bugCode ? `(${rep.bugCode})` : ''}\n`;
      md += `- **Page / Location**: ${rep.page}\n`;
      md += `- **Category**: ${rep.category}\n`;
      md += `- **Severity**: ${rep.severity}\n`;
      md += `- **Environment**: ${rep.environment}\n\n`;
      md += `#### Steps to Reproduce:\n\`\`\`\n${rep.stepsToReproduce}\n\`\`\`\n\n`;
      md += `- **Expected Result**: ${rep.expectedResult}\n`;
      md += `- **Actual Result**: ${rep.actualResult}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BugCraft_QA_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Markdown Bug Report downloaded!', 'success');
  };

  const copyMarkdownToClipboard = () => {
    if (userBugReports.length === 0) {
      showToast('No logged bug reports to copy.', 'info');
      return;
    }
    let md = `# QA Defect Test Report - BugCraft\n\n`;
    userBugReports.forEach((rep) => {
      md += `### [${rep.severity}] ${rep.title}\n`;
      md += `- **Page**: ${rep.page} | **Category**: ${rep.category}\n`;
      md += `**Steps to Reproduce:**\n${rep.stepsToReproduce}\n`;
      md += `**Expected:** ${rep.expectedResult}\n`;
      md += `**Actual:** ${rep.actualResult}\n\n---\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedCode('all');
    showToast('All bug reports copied to clipboard in Markdown format!', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredBugs = knownBugs.filter((bug) => {
    const matchesCategory = selectedCategory === 'All' || bug.category === selectedCategory;
    const matchesSearch = 
      bug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bug.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories: (string | BugCategory)[] = ['All', 'Functional', 'UI / Visual', 'Validation', 'Calculation & Data', 'State & Navigation'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
        id="qa-inspector-drawer"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-600/30">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">
                  QA Tester's Companion Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {foundBugCodes.length} / {knownBugs.length} Found
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect intentional defects, request graduated hints, log Jira tickets, and verify fixes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQADrawerOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Drawer"
              id="close-qa-drawer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Toggle & Score Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Application Mode:</span>
            <button
              onClick={() => setIsBugMode(true)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                isBugMode 
                  ? 'bg-rose-600 text-white shadow-xs font-bold' 
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
              id="toggle-buggy-mode-btn"
            >
              Buggy Mode (Find Defect)
            </button>
            <button
              onClick={() => setIsBugMode(false)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                !isBugMode 
                  ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                  : 'bg-white text-slate-600 hover:bg-slate-200'
              }`}
              id="toggle-fixed-mode-btn"
            >
              Fixed Mode (Compare Expected)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-bold text-indigo-600">{Math.round((foundBugCodes.length / knownBugs.length) * 100)}%</span>
              <span>Test Coverage</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('bugs')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'bugs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-all-bugs-btn"
          >
            <Bug className="w-4 h-4" />
            <span>Target Bugs ({knownBugs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'log'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-log-bug-btn"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File Bug Ticket</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-reports-btn"
          >
            <FileText className="w-4 h-4" />
            <span>My Tickets ({userBugReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            id="tab-guide-btn"
          >
            <BookOpen className="w-4 h-4" />
            <span>QA Guide & Checklists</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {/* TAB 1: ALL TARGET BUGS */}
          {activeTab === 'bugs' && (
            <div className="space-y-4">
              {/* Search & Category Filter */}
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search by bug name, code (e.g. BUG-01), or page..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 shadow-xs"
                    id="search-bugs-input"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bug List */}
              <div className="space-y-3 pt-2">
                {filteredBugs.map((bug) => {
                  const isFound = foundBugCodes.includes(bug.code);
                  const hints = revealedHints[bug.id] || {};

                  return (
                    <div
                      key={bug.id}
                      className={`bg-white rounded-2xl border transition-all p-4 ${
                        isFound
                          ? 'border-emerald-300 bg-emerald-50/30 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Top Bar: Code, Category, Severity, Found Checkbox */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-white">
                            {bug.code}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {bug.category}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              bug.severity === 'Critical' || bug.severity === 'Blocker'
                                ? 'bg-rose-100 text-rose-700'
                                : bug.severity === 'Major'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {bug.severity}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleBugFound(bug.code)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isFound
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                          id={`toggle-found-${bug.code}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isFound ? 'Found & Verified' : 'Mark as Found'}</span>
                        </button>
                      </div>

                      {/* Title & Page Location */}
                      <h4 className="font-bold text-slate-900 text-sm mb-1">
                        {bug.title}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2.5 flex items-center gap-1">
                        <span className="font-medium text-slate-700">Location:</span>
                        <span className="underline decoration-slate-300">{bug.page}</span> → {bug.location}
                      </p>

                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {bug.summary}
                      </p>

                      {/* Hint & Solution Accordion Controls */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => toggleHint(bug.id, 'hint1')}
                            className="text-[11px] font-medium px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3 text-amber-600" />
                            <span>{hints.hint1 ? 'Hide Hint 1' : 'Show Hint 1 (Gentle)'}</span>
                          </button>

                          <button
                            onClick={() => toggleHint(bug.id, 'hint2')}
                            className="text-[11px] font-medium px-2 py-1 rounded bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-1"
                          >
                            <HelpCircle className="w-3 h-3 text-orange-600" />
                            <span>{hints.hint2 ? 'Hide Hint 2' : 'Show Hint 2 (Detailed)'}</span>
                          </button>

                          <button
                            onClick={() => toggleHint(bug.id, 'solution')}
                            className="text-[11px] font-medium px-2 py-1 rounded bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                          >
                            {hints.solution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{hints.solution ? 'Hide Reproduction' : 'Reveal Solution & Steps'}</span>
                          </button>

                          <button
                            onClick={() => prefillReportForm(bug)}
                            className="text-[11px] font-semibold ml-auto px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                          >
                            <PlusCircle className="w-3 h-3 text-rose-400" />
                            <span>Log Ticket</span>
                          </button>
                        </div>

                        {/* Hint 1 Box */}
                        {hints.hint1 && (
                          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 animate-in fade-in duration-150">
                            <strong>💡 Hint 1:</strong> {bug.hint1}
                          </div>
                        )}

                        {/* Hint 2 Box */}
                        {hints.hint2 && (
                          <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200 text-xs text-orange-900 animate-in fade-in duration-150">
                            <strong>🔍 Hint 2:</strong> {bug.hint2}
                          </div>
                        )}

                        {/* Solution & Reproduction Box */}
                        {hints.solution && (
                          <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-2 animate-in fade-in duration-150">
                            <div>
                              <span className="font-bold text-rose-400 block mb-1">Steps to Reproduce:</span>
                              <ol className="list-decimal pl-4 space-y-0.5 text-slate-300 font-mono text-[11px]">
                                {bug.stepsToReproduce.map((s, i) => (
                                  <li key={i}>{s.replace(/^\d+\.\s*/, '')}</li>
                                ))}
                              </ol>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                              <div>
                                <span className="font-bold text-emerald-400 block">Expected:</span>
                                <p className="text-slate-300">{bug.expectedResult}</p>
                              </div>
                              <div>
                                <span className="font-bold text-amber-400 block">Actual:</span>
                                <p className="text-slate-300">{bug.actualResult}</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-800 text-[11px] text-indigo-300">
                              <strong>Engineering Root Cause:</strong> {bug.fixExplanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: FILE BUG TICKET */}
          {activeTab === 'log' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Submit QA Defect Ticket
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in standard Jira/Linear bug report fields to practice standard QA reporting.
                </p>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Bug Code (Optional)
                    </label>
                    <select
                      value={reportBugCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        setReportBugCode(code);
                        const match = knownBugs.find((b) => b.code === code);
                        if (match) prefillReportForm(match);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="">Custom / Discovered Defect</option>
                      {knownBugs.map((b) => (
                        <option key={b.code} value={b.code}>
                          {b.code} - {b.title.slice(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={reportCategory}
                      onChange={(e) => setReportCategory(e.target.value as BugCategory)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    >
                      <option value="Functional">Functional</option>
                      <option value="UI / Visual">UI / Visual</option>
                      <option value="Validation">Validation</option>
                      <option value="Calculation & Data">Calculation & Data</option>
                      <option value="State & Navigation">State & Navigation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Severity *
                    </label>
                    <select
                      value={reportSeverity}
                      onChange={(e) => setReportSeverity(e.target.value as BugSeverity)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                    >
                      <option value="Blocker">P1 - Blocker</option>
                      <option value="Critical">P2 - Critical</option>
                      <option value="Major">P3 - Major</option>
                      <option value="Minor">P4 - Minor</option>
                      <option value="Trivial">P5 - Trivial</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Bug Title / Summary *
                  </label>
                  <input
                    type="text"
                    placeholder="[Module] Concise description of failure under specific condition"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Target Page / URL
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Products Page / Cart Page"
                      value={reportPage}
                      onChange={(e) => setReportPage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Environment
                    </label>
                    <input
                      type="text"
                      value={reportEnvironment}
                      onChange={(e) => setReportEnvironment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Steps to Reproduce *
                  </label>
                  <textarea
                    rows={4}
                    value={reportSteps}
                    onChange={(e) => setReportSteps(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Expected Result *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What should have happened according to business requirements?"
                      value={reportExpected}
                      onChange={(e) => setReportExpected(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Actual Result *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What actually occurred (error message, wrong data, bad layout)?"
                      value={reportActual}
                      onChange={(e) => setReportActual(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('bugs')}
                    className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20"
                    id="submit-bug-report-btn"
                  >
                    Save Bug Ticket
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: MY LOGGED TICKETS */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Logged Defect Tickets ({userBugReports.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Export your bug findings for portfolio, team review, or interview demonstrations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMarkdownToClipboard}
                    disabled={userBugReports.length === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Markdown</span>
                  </button>

                  <button
                    onClick={exportAsMarkdown}
                    disabled={userBugReports.length === 0}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report (.md)</span>
                  </button>
                </div>
              </div>

              {userBugReports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">No bug tickets logged yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Explore the store pages, find unexpected behaviors, and log tickets or click "Log Ticket" next to any target bug.
                  </p>
                  <button
                    onClick={() => setActiveTab('log')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 shadow-xs"
                  >
                    Create First Bug Report
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBugReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {report.id}
                          </span>
                          {report.bugCode && (
                            <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                              {report.bugCode}
                            </span>
                          )}
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            report.severity === 'Critical' || report.severity === 'Blocker'
                              ? 'bg-rose-100 text-rose-700'
                              : report.severity === 'Major'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {report.severity}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteUserBugReport(report.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm">
                        {report.title}
                      </h4>

                      <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                        <span><strong>Page:</strong> {report.page}</span>
                        <span><strong>Category:</strong> {report.category}</span>
                        <span><strong>Reported:</strong> {new Date(report.reportedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2 border border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-700 block">Steps to Reproduce:</span>
                          <pre className="font-mono text-[11px] text-slate-600 whitespace-pre-wrap mt-0.5">
                            {report.stepsToReproduce}
                          </pre>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div>
                            <span className="font-semibold text-emerald-700 block">Expected Result:</span>
                            <p className="text-slate-700">{report.expectedResult}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-rose-700 block">Actual Result:</span>
                            <p className="text-slate-700">{report.actualResult}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: QA GUIDE & CHECKLISTS */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs text-slate-700">
              {/* QA Methodology Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Essential QA Testing Methodologies
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h5 className="font-bold text-slate-900">1. Boundary Value Analysis (BVA)</h5>
                    <p className="text-slate-600 leading-relaxed">
                      Test inputs at extreme edges (e.g. quantity = -1, 0, 1, 99, 100). Off-by-one errors frequently hide in page slices and indices.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h5 className="font-bold text-slate-900">2. Equivalence Partitioning (EP)</h5>
                    <p className="text-slate-600 leading-relaxed">
                      Divide inputs into valid & invalid sets (e.g. standard email vs email with trailing spaces or missing @).
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h5 className="font-bold text-slate-900">3. State & Persistence Testing</h5>
                    <p className="text-slate-600 leading-relaxed">
                      Test actions across page navigation and refresh. Does user avatar or cart subtotal survive route transitions?
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <h5 className="font-bold text-slate-900">4. Business Logic Stacking</h5>
                    <p className="text-slate-600 leading-relaxed">
                      Test what happens when applying coupons repeatedly, removing all items, or placing orders with expired cards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Testing Checklist */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">
                  Quick Smoke & Regression Checklist
                </h4>

                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                    <span><strong>Sort verification:</strong> Test low-to-high, high-to-low, and name sorting with mixed 2-digit and 3-digit prices.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                    <span><strong>Pagination consistency:</strong> Ensure the total count equals items-per-page × pages and no item duplicates across page boundaries.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                    <span><strong>Negative inputs:</strong> Manually type 0, -1, or text into quantity fields.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
                    <span><strong>String vs Case Sensitivity:</strong> Test promo codes in lowercase vs uppercase (`save20` vs `SAVE20`).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
                    <span><strong>UI Desynchronization:</strong> Toggle password visibility and observe if the actual input reveals characters.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
