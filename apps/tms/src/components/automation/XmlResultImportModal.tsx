import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseJUnitXml } from '../../utils/xmlParser';
import { AutomationResultDocument } from '../../types/automation';
import { X, FileCode, CheckCircle2, XCircle, Clock, AlertTriangle, Play, ShieldAlert, ArrowRight, RefreshCw, Layers, BookOpen } from 'lucide-react';

const SAMPLE_JUNIT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Playwright E2E Test Suite" tests="4" failures="1" errors="0" skipped="0" time="14.28">
  <testsuite name="Authentication &amp; Session Management @S10014522" timestamp="2026-08-31T06:00:00.000Z" hostname="runner-cluster-us-east-1" tests="3" failures="1" errors="0" time="8.45">
    <testcase name="Valid user authentication with MFA @T10010001" classname="tests/e2e/auth/login.spec.ts" time="2.14" />
    <testcase name="Account lockout after 5 consecutive failed login attempts @T10010002" classname="tests/e2e/auth/login.spec.ts" time="3.89" />
    <testcase name="Session timeout after 15 minutes of inactivity" classname="tests/e2e/auth/login.spec.ts" time="2.42">
      <failure message="Error: Timed out 2000ms waiting for expect(locator).toHaveURL()" type="AssertionError">
        Error: Timed out 2000ms waiting for expect(locator).toHaveURL(expected)
        Expected pattern: /.*login/
        Received string:  "https://app.testone.internal/dashboard"
        at /builds/repo/tests/e2e/auth/login.spec.ts:33:28
      </failure>
    </testcase>
  </testsuite>
  <testsuite name="Payment Gateway &amp; Card Transactions @S10018899" tests="1" failures="0" errors="0" time="5.83">
    <testcase name="Processes contactless EMV purchase under floor limit @T10010009" classname="tests/integration/payments.spec.js" time="5.83" />
  </testsuite>
</testsuites>
`;

export const XmlResultImportModal: React.FC = () => {
  const {
    isXmlImportModalOpen,
    setIsXmlImportModalOpen,
    setNavSection,
    currentProject,
    suites,
    testRuns,
    testCases,
    ingestXmlResults,
    hasPermission,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sample' | 'upload' | 'paste'>('sample');
  const [xmlContent, setXmlContent] = useState<string>(SAMPLE_JUNIT_XML);
  const [documentName, setDocumentName] = useState<string>('junit-results-pipeline-4991.xml');
  const [targetRunOption, setTargetRunOption] = useState<'new_run' | 'existing_run' | 'external_ci'>('new_run');
  const [targetRunId, setTargetRunId] = useState<string>('');
  const [environmentName, setEnvironmentName] = useState<string>('GitLab Runner / Staging QA');
  const [autoCreateMissingCases, setAutoCreateMissingCases] = useState<boolean>(true);
  const [targetSuiteId, setTargetSuiteId] = useState<string>(suites.find((s) => s.projectId === currentProject.id)?.id || '');
  const [isIngesting, setIsIngesting] = useState<boolean>(false);

  if (!isXmlImportModalOpen) return null;

  const projSuites = suites.filter((s) => s.projectId === currentProject.id);
  const projRuns = testRuns.filter((r) => r.projectId === currentProject.id);

  // Parse current XML content for live diagnostic preview
  let parsedDoc: AutomationResultDocument | null = null;
  let parseError: string | null = null;

  try {
    if (xmlContent.trim()) {
      parsedDoc = parseJUnitXml(xmlContent, documentName, currentProject.id, testCases);
    }
  } catch (err: any) {
    parseError = err?.message || 'XML parsing failed';
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setXmlContent(text);
      setDocumentName(file.name);
      addToast({ type: 'info', title: `Loaded XML result file: ${file.name}` });
    };
    reader.readAsText(file);
  };

  const handleIngest = () => {
    if (!parsedDoc) return;
    if (!hasPermission('automation_result.import')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to ingest automation results.' });
      return;
    }

    setIsIngesting(true);
    try {
      ingestXmlResults({
        document: parsedDoc,
        targetRunOption,
        targetRunId: targetRunOption === 'existing_run' ? targetRunId : undefined,
        runName: `JUnit Import: ${documentName}`,
        environmentName,
        autoCreateMissingCases,
        targetSuiteId,
      });
      setIsXmlImportModalOpen(false);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Ingestion Error', message: err?.message || 'Failed to ingest XML results' });
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">Ingest JUnit XML Execution Results</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Normalized Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Safely parse JUnit/xUnit reports from CI/CD, reconcile <code className="text-blue-400">@T...</code> tags, and track execution health
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsXmlImportModalOpen(false);
                setNavSection('documentation');
                try {
                  window.history.pushState({}, '', '/docs/ci-cd/xml-results');
                } catch {}
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 border border-slate-700 transition-colors"
              title="Read XML Results Ingestion Documentation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>XML Docs</span>
            </button>
            <button
              onClick={() => setIsXmlImportModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <button
            onClick={() => {
              setActiveTab('sample');
              setXmlContent(SAMPLE_JUNIT_XML);
              setDocumentName('junit-results-pipeline-4991.xml');
            }}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'sample'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample CI Report
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload XML File
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste XML Snippet
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'sample' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Playwright / Mocha JUnit XML Artifact</span>
                <span className="font-mono text-slate-500">{documentName}</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 max-h-44 overflow-auto">
                <pre>{xmlContent}</pre>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-2">
              <textarea
                rows={6}
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                placeholder="Paste <?xml version='1.0' encoding='UTF-8'?> <testsuites>..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono text-xs focus:outline-hidden focus:border-blue-500 leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-6 text-center bg-slate-950/50">
              <FileCode className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-slate-200 mb-1">Select JUnit XML Report</h3>
              <p className="text-xs text-slate-500 mb-3">Compatible with Playwright, Jest, PyTest, Surefire, and Cypress XML</p>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors">
                <span>Select XML File</span>
                <input type="file" accept=".xml" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          {/* Parse Diagnostic Errors */}
          {parseError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>XML Diagnostic Error: {parseError}</span>
            </div>
          )}

          {/* Diagnostic Metrics Cards */}
          {parsedDoc && (
            <>
              <div className="grid grid-cols-5 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Total Tests</div>
                  <div className="text-lg font-bold text-slate-100">{parsedDoc.totalTests}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Passed</div>
                  <div className="text-lg font-bold text-emerald-400">{parsedDoc.passed}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Failures / Errors</div>
                  <div className="text-lg font-bold text-rose-400">
                    {parsedDoc.failed + parsedDoc.errors}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Unmatched</div>
                  <div className="text-lg font-bold text-amber-400">{parsedDoc.unmatchedCount}</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950">
                  <div className="text-[11px] font-medium text-slate-400 mb-1">Duration</div>
                  <div className="text-lg font-bold text-slate-300">
                    {(parsedDoc.durationMs / 1000).toFixed(2)}s
                  </div>
                </div>
              </div>

              {/* Ingest Target & Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300">Ingestion Target</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="target"
                        checked={targetRunOption === 'new_run'}
                        onChange={() => setTargetRunOption('new_run')}
                        className="text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>Create Standalone Automation Run</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="target"
                        checked={targetRunOption === 'existing_run'}
                        onChange={() => setTargetRunOption('existing_run')}
                        className="text-blue-600 bg-slate-900 border-slate-700"
                      />
                      <span>Associate with Existing Test Run</span>
                    </label>
                  </div>

                  {targetRunOption === 'existing_run' && (
                    <select
                      value={targetRunId}
                      onChange={(e) => setTargetRunId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden"
                    >
                      <option value="">Select target test run...</option>
                      {projRuns.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.id})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
                  <h4 className="text-xs font-semibold text-slate-300">Reconciliation Options</h4>
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={autoCreateMissingCases}
                      onChange={(e) => setAutoCreateMissingCases(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="font-medium text-slate-200">Auto-create Unmatched Cases in Repository</span>
                      <p className="text-[11px] text-slate-500">
                        Generates new test case records for tests without existing @T references ({parsedDoc.unmatchedCount} unmapped)
                      </p>
                    </div>
                  </label>

                  {autoCreateMissingCases && (
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Destination Suite</label>
                      <select
                        value={targetSuiteId}
                        onChange={(e) => setTargetSuiteId(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden"
                      >
                        {projSuites.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Case Inspection List */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Test Ingestion Breakdown</span>
                  <span className="text-[11px] text-slate-500">{parsedDoc.normalizedResults.length} normalized test items</span>
                </div>
                <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                  {parsedDoc.normalizedResults.map((tc, idx) => (
                    <div key={idx} className="p-3 hover:bg-slate-900/40 transition-colors flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {tc.status === 'passed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="text-xs font-medium text-slate-200">{tc.testName}</span>
                          {tc.testIdRef && (
                            <span className="px-1.5 py-0.2 text-[10px] font-mono rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {tc.testIdRef}
                            </span>
                          )}
                        </div>
                        {tc.failureMessage && (
                          <p className="text-[11px] text-rose-400 font-mono pl-5.5">{tc.failureMessage}</p>
                        )}
                        <div className="text-[10px] text-slate-500 pl-5.5 font-mono">
                          {tc.suiteName} • {tc.className}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono text-slate-400">{(tc.durationMs / 1000).toFixed(2)}s</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80 shrink-0">
          <div className="text-xs text-slate-400">
            {parsedDoc ? `${parsedDoc.totalTests} total test items parsed` : 'Awaiting valid XML file'}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsXmlImportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isIngesting || !parsedDoc}
              onClick={handleIngest}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
            >
              {isIngesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              Ingest & Reconcile Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
