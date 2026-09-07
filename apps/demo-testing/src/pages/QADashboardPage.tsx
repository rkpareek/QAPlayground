import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bug, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  PlusCircle, 
  Trash2, 
  Sliders, 
  Search,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { BugSeverity, KnownBug } from '../types';

export const QADashboardPage: React.FC = () => {
  const { 
    knownBugs, 
    foundBugCodes, 
    toggleBugFound, 
    userBugReports, 
    deleteUserBugReport, 
    isBugMode, 
    setIsBugMode, 
    resetAllData, 
    openQADrawerToTab, 
    setCurrentPage,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'matrix' | 'tickets' | 'scenarios'>('matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [expandedBugId, setExpandedBugId] = useState<string | null>(null);
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [copiedAll, setCopiedAll] = useState(false);

  const foundCount = foundBugCodes.length;
  const totalCount = knownBugs.length;
  const coveragePercent = totalCount > 0 ? Math.round((foundCount / totalCount) * 100) : 0;
  const criticalFoundCount = knownBugs.filter(
    (b) => (b.severity === 'Critical' || b.severity === 'Blocker') && foundBugCodes.includes(b.code)
  ).length;
  const totalCriticalCount = knownBugs.filter(
    (b) => b.severity === 'Critical' || b.severity === 'Blocker'
  ).length;

  const categories = ['All', 'Functional', 'UI / Visual', 'Validation', 'Calculation & Data', 'State & Navigation'];
  const severities = ['All', 'Blocker', 'Critical', 'Major', 'Minor'];

  // Filtered Known Bugs
  const filteredBugs = useMemo(() => {
    return knownBugs.filter((b) => {
      const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
      const matchSev = selectedSeverity === 'All' || b.severity === selectedSeverity;
      const matchQuery =
        !searchQuery.trim() ||
        b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSev && matchQuery;
    });
  }, [knownBugs, selectedCategory, selectedSeverity, searchQuery]);

  const toggleHint = (bugId: string) => {
    setRevealedHints((prev) => ({
      ...prev,
      [bugId]: !prev[bugId],
    }));
  };

  const exportAsMarkdown = () => {
    if (userBugReports.length === 0) {
      showToast('No bug tickets logged yet to export.', 'info');
      return;
    }

    let md = `# QA Defect Test Report - BugCraft\n`;
    md += `*Generated: ${new Date().toLocaleString()}*\n\n`;
    md += `## Defect Summary: ${userBugReports.length} Tickets Logged (${foundCount}/${totalCount} Verified Found)\n\n`;

    userBugReports.forEach((rep, idx) => {
      md += `### ${idx + 1}. [${rep.severity}] ${rep.title}\n`;
      md += `- **Ticket ID**: ${rep.id} ${rep.bugCode ? `(${rep.bugCode})` : ''}\n`;
      md += `- **Location / Page**: ${rep.page}\n`;
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
    a.download = `BugCraft_QA_Defect_Report_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('QA Bug Report exported as Markdown!', 'success');
  };

  const exportAsJSON = () => {
    const data = {
      project: 'BugCraft QA Testing Sandbox',
      exportedAt: new Date().toISOString(),
      coverage: `${coveragePercent}%`,
      foundBugsCount: foundCount,
      totalKnownBugs: totalCount,
      verifiedBugCodes: foundBugCodes,
      loggedReports: userBugReports,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BugCraft_QA_Data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('QA Data exported as JSON!', 'success');
  };

  const copyMarkdown = () => {
    if (userBugReports.length === 0) {
      showToast('No user bug reports to copy.', 'info');
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
    setCopiedAll(true);
    showToast('All bug reports copied to clipboard in Markdown format!', 'success');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              QA Test Command Dashboard
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isBugMode 
                ? 'bg-amber-50 text-amber-800 border-amber-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              {isBugMode ? 'Bug Injection Active' : 'Fixed Verification Mode'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover real defects, document reproduction steps, and generate structured defect reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBugMode(!isBugMode)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            title="Toggle between buggy test version and resolved version"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Switch to {isBugMode ? 'Fixed Mode' : 'Buggy Mode'}</span>
          </button>

          <button
            onClick={() => openQADrawerToTab('log')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>File New Defect</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Defect Discovery</span>
            <Bug className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{foundCount}</span>
            <span className="text-xs text-slate-400 font-medium">/ {totalCount} Identified</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500">{coveragePercent}% completion rate</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Logged Tickets</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{userBugReports.length}</span>
            <span className="text-xs text-slate-400 font-medium">Recorded</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {userBugReports.filter((r) => r.status === 'Open').length} Open, ready to export
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Blocker / Critical</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-700">{criticalFoundCount}</span>
            <span className="text-xs text-slate-400 font-medium">/ {totalCriticalCount} Found</span>
          </div>
          <div className="text-[11px] text-slate-500">High-impact financial & validation flaws</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">Report Exports</span>
            <Download className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={exportAsMarkdown}
              disabled={userBugReports.length === 0}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={exportAsJSON}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              JSON
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Bug Matrix & Checklist ({foundCount}/{totalCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('tickets')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'tickets'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Bug Tickets ({userBugReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scenarios')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'scenarios'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Testing Cheat Sheet</span>
        </button>
      </div>

      {/* 4. Tab 1: Bug Matrix & Checklist */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search bugs by code, title, page or summary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 focus:outline-hidden text-slate-800 placeholder:text-slate-400 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Category selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-medium">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden text-xs"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Severity selector */}
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-medium">Severity:</span>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-hidden text-xs"
                >
                  {severities.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Bug List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {filteredBugs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No bugs match your filter criteria.
              </div>
            ) : (
              filteredBugs.map((bug) => {
                const isFound = foundBugCodes.includes(bug.code);
                const isExpanded = expandedBugId === bug.id;
                const isHintVisible = !!revealedHints[bug.id];

                return (
                  <div key={bug.id} className="transition-colors hover:bg-slate-50/50">
                    <div className="p-4 flex items-start justify-between gap-4">
                      {/* Checkbox and main title */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleBugFound(bug.code)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                            isFound
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-slate-400 bg-white text-transparent'
                          }`}
                          title="Toggle Verified Found"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                              {bug.code}
                            </span>

                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              bug.severity === 'Critical' || bug.severity === 'Blocker'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : bug.severity === 'Major'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              {bug.severity}
                            </span>

                            <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                              {bug.category}
                            </span>

                            <span className="text-xs text-slate-400 font-medium">
                              Page: <strong className="text-slate-600">{bug.page}</strong>
                            </span>
                          </div>

                          <h4 className={`text-xs sm:text-sm font-semibold ${isFound ? 'text-slate-900' : 'text-slate-800'}`}>
                            {bug.title}
                          </h4>

                          <p className="text-xs text-slate-500 line-clamp-2">
                            {bug.summary}
                          </p>
                        </div>
                      </div>

                      {/* Right action controls */}
                      <div className="flex items-center gap-2 shrink-0 pt-0.5">
                        <button
                          onClick={() => setExpandedBugId(isExpanded ? null : bug.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Steps'}</span>
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => openQADrawerToTab('log')}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors flex items-center gap-1"
                          title="File a report for this bug"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">File Ticket</span>
                        </button>
                      </div>
                    </div>

                    {/* Expanded details view */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 bg-slate-50/80 border-t border-slate-100 space-y-3 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                            <span className="font-semibold text-slate-700 block">Steps to Reproduce:</span>
                            <ol className="list-decimal list-inside space-y-0.5 text-slate-600 text-[11px]">
                              {bug.stepsToReproduce.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                            <div>
                              <span className="font-semibold text-emerald-700 block">Expected Behavior:</span>
                              <p className="text-slate-600 text-[11px] mt-0.5">{bug.expectedResult}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-rose-700 block">Observed Buggy Behavior:</span>
                              <p className="text-slate-600 text-[11px] mt-0.5">{bug.actualResult}</p>
                            </div>
                          </div>
                        </div>

                        {/* Hint box */}
                        <div className="flex items-center justify-between bg-indigo-50/60 border border-indigo-100 p-3 rounded-lg">
                          <div className="space-y-1 flex-1 pr-3">
                            <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-xs">
                              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Tester Hint & QA Note</span>
                            </div>
                            {isHintVisible ? (
                              <p className="text-[11px] text-indigo-800 leading-relaxed">
                                {bug.hint1} {bug.hint2 && `• ${bug.hint2}`}
                              </p>
                            ) : (
                              <p className="text-[11px] text-indigo-600 italic">
                                Hint is hidden. Click "Reveal Hint" to get testing tips without spoiling the answer.
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => toggleHint(bug.id)}
                            className="px-2.5 py-1 rounded-md bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 text-xs font-semibold shrink-0 transition-colors"
                          >
                            {isHintVisible ? 'Hide Hint' : 'Reveal Hint'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: User Bug Reports */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Logged Bug Tickets ({userBugReports.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted QA defect reports logged during testing sessions
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdown}
                disabled={userBugReports.length === 0}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy All (.md)</span>
              </button>
              <button
                onClick={exportAsMarkdown}
                disabled={userBugReports.length === 0}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 shadow-2xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {userBugReports.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-semibold text-slate-800 text-sm">No bug tickets submitted yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click the "File New Defect" button to log your first discovered issue with steps and expected behavior.
                </p>
              </div>
              <button
                onClick={() => openQADrawerToTab('log')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-2xs"
              >
                File First Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userBugReports.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                        {ticket.id}
                      </span>
                      {ticket.bugCode && (
                        <span className="font-mono font-semibold text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {ticket.bugCode}
                        </span>
                      )}
                      <span className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                        ticket.severity === 'Critical' || ticket.severity === 'Blocker'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : ticket.severity === 'Major'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {ticket.severity}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium">Page: {ticket.page}</span>
                    </div>

                    <button
                      onClick={() => deleteUserBugReport(ticket.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      title="Delete Ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">
                    {ticket.title}
                  </h4>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2">
                    <div>
                      <span className="font-semibold text-slate-700 block mb-0.5">Steps to Reproduce:</span>
                      <pre className="font-mono text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {ticket.stepsToReproduce}
                      </pre>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="font-semibold text-emerald-700 block">Expected Result:</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{ticket.expectedResult}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-rose-700 block">Actual Result:</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{ticket.actualResult}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Testing Cheat Sheet */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              High-Value Edge Case Checklist
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
              <li className="pt-2">
                <strong className="text-slate-900">1. Coupon Stacking & Invalidation:</strong> Apply code <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-700">SAVE20</code> multiple times in cart to check if discounts compound infinitely.
              </li>
              <li className="pt-2">
                <strong className="text-slate-900">2. Past-Date Credit Card Expiration:</strong> Try checking out with an expiry month/year in the past (e.g. 01/20).
              </li>
              <li className="pt-2">
                <strong className="text-slate-900">3. Out of Stock Inventory Bypass:</strong> Add items exceeding current available stock directly from category cards.
              </li>
              <li className="pt-2">
                <strong className="text-slate-900">4. Freeform Phone Validation:</strong> Enter symbols or letters in checkout phone fields.
              </li>
            </ul>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Keyboard Shortcuts & QA Tools
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
              <li className="pt-2 flex items-center justify-between">
                <span>Toggle QA Companion Drawer</span>
                <kbd className="px-2 py-1 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] font-bold text-slate-700">B</kbd>
              </li>
              <li className="pt-2 flex items-center justify-between">
                <span>Switch between Buggy & Fixed</span>
                <span className="text-indigo-600 font-semibold cursor-pointer" onClick={() => setIsBugMode(!isBugMode)}>
                  {isBugMode ? 'Set Fixed' : 'Set Buggy'}
                </span>
              </li>
              <li className="pt-2 flex items-center justify-between">
                <span>Reset Sandbox Data</span>
                <button onClick={resetAllData} className="text-rose-600 font-semibold hover:underline">
                  Reset State
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
