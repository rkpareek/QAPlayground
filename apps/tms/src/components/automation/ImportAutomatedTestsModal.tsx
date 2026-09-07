import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseSourceFileContent, injectMissingIds, generateTestIdTag } from '../../utils/sourceParser';
import { AutomationSourceFile, AutomationImportRecord, SupportedFramework } from '../../types/automation';
import { TestCase } from '../../types';
import { X, Upload, Code, FileText, CheckCircle, AlertTriangle, Sparkles, Layers, ShieldCheck, ArrowRight, RefreshCw, BookOpen } from 'lucide-react';

const SAMPLE_PLAYWRIGHT_SPEC = `import { test, expect } from '@playwright/test';

test.describe('Authentication & Session Management @S10014522', () => {
  test('Valid user authentication with MFA @T10010001', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="username"]', 'security.officer@bank.internal');
    await page.fill('[data-testid="password"]', 'VaultPass2026!');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="mfa-challenge"]')).toBeVisible();
  });

  test('Account lockout after 5 consecutive failed login attempts @T10010002', async ({ page }) => {
    await page.goto('/login');
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="password"]', 'WrongPassword!');
      await page.click('button[type="submit"]');
    }
    await expect(page.locator('.toast-error')).toContainText('Account temporarily locked');
  });

  test('Session timeout after 15 minutes of inactivity', async ({ page }) => {
    // Unmapped test without @T tag
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/.*login/);
  });
});
`;

const SAMPLE_MOCHA_SPEC = `describe('Payment Gateway & Card Transactions @S10018899', function() {
  it('Processes contactless EMV purchase under floor limit @T10010009', function(done) {
    chai.request(server)
      .post('/api/v2/transactions/emv')
      .send({ amountCents: 4500, contactless: true })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.settlementStatus).to.equal('authorized');
        done();
      });
  });

  it('Declines expired corporate card with 402 PaymentRequired', function(done) {
    chai.request(server)
      .post('/api/v2/transactions/emv')
      .send({ cardExpiry: '01/24' })
      .end((err, res) => {
        expect(res).to.have.status(402);
        done();
      });
  });
});
`;

export const ImportAutomatedTestsModal: React.FC = () => {
  const {
    isAstImportModalOpen,
    setIsAstImportModalOpen,
    setNavSection,
    currentProject,
    currentUser,
    suites,
    testCases,
    saveSourceFiles,
    hasPermission,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('samples');
  const [pastedCode, setPastedCode] = useState(SAMPLE_PLAYWRIGHT_SPEC);
  const [pastedFileName, setPastedFileName] = useState('tests/e2e/auth/login.spec.ts');
  const [framework, setFramework] = useState<SupportedFramework>('playwright');
  const [filesToProcess, setFilesToProcess] = useState<{ name: string; content: string }[]>([
    { name: 'tests/e2e/auth/login.spec.ts', content: SAMPLE_PLAYWRIGHT_SPEC },
  ]);

  const [autoInjectTags, setAutoInjectTags] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAstImportModalOpen) return null;

  // Parse files currently in buffer
  const parsedFiles = filesToProcess.map((f) => parseSourceFileContent(currentProject.id, f.name, f.content));
  const totalParsedSuites = parsedFiles.reduce((acc, r) => acc + r.suites.length, 0);
  const totalParsedTests = parsedFiles.reduce((acc, r) => acc + r.tests.length, 0);
  const totalTaggedTests = parsedFiles.reduce(
    (acc, r) => acc + r.tests.filter((t) => !!t.testIdRef).length,
    0
  );
  const totalUntaggedTests = totalParsedTests - totalTaggedTests;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const readFiles: { name: string; content: string }[] = [];
    let count = 0;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = (event.target?.result as string) || '';
        readFiles.push({ name: file.name, content });
        count++;
        if (count === uploadedFiles.length) {
          setFilesToProcess(readFiles);
          addToast({ type: 'info', title: `Loaded ${readFiles.length} test files for AST analysis` });
        }
      };
      reader.readAsText(file);
    });
  };

  const handleLoadSample = (type: 'playwright' | 'mocha') => {
    if (type === 'playwright') {
      setPastedCode(SAMPLE_PLAYWRIGHT_SPEC);
      setPastedFileName('tests/e2e/auth/login.spec.ts');
      setFramework('playwright');
      setFilesToProcess([{ name: 'tests/e2e/auth/login.spec.ts', content: SAMPLE_PLAYWRIGHT_SPEC }]);
    } else {
      setPastedCode(SAMPLE_MOCHA_SPEC);
      setPastedFileName('tests/integration/payments.spec.js');
      setFramework('mocha');
      setFilesToProcess([{ name: 'tests/integration/payments.spec.js', content: SAMPLE_MOCHA_SPEC }]);
    }
  };

  const handleSynchronize = () => {
    if (!hasPermission('automation.import')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to import automation sources.' });
      return;
    }

    setIsProcessing(true);

    try {
      const sourceFilesToSave: AutomationSourceFile[] = [];

      for (const item of filesToProcess) {
        let content = item.content;

        // Inject missing @T and @S tags if requested
        if (autoInjectTags) {
          const { newContent } = injectMissingIds(content);
          content = newContent;
        }

        const finalParsed = parseSourceFileContent(currentProject.id, item.name, content);
        sourceFilesToSave.push(finalParsed);
      }

      const importRecord: AutomationImportRecord = {
        id: 'imp-' + Date.now().toString(36),
        projectId: currentProject.id,
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: new Date().toISOString(),
        framework,
        runner: framework === 'playwright' ? 'playwright_test' : 'mocha',
        language: 'typescript',
        sourceScope: 'Client AST Import',
        filesScanned: sourceFilesToSave.length,
        suitesDetected: totalParsedSuites,
        testsDetected: totalParsedTests,
        testsCreated: totalUntaggedTests,
        testsUpdated: totalTaggedTests,
        testsUnchanged: 0,
        testsDetached: 0,
        duplicateCandidates: 0,
        errors: 0,
        warnings: [],
      };

      saveSourceFiles(sourceFilesToSave, importRecord);
      setIsAstImportModalOpen(false);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Import Failed', message: err?.message || 'Unknown error occurred during AST parsing.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-100">Import Automated Tests (AST Static Analysis)</h2>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Client-side Tokenizer
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Parse Playwright & Mocha specs into structured test cases and reconcile @T / @S tags
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAstImportModalOpen(false);
                setNavSection('documentation');
                try {
                  window.history.pushState({}, '', '/docs/automation/import');
                } catch {}
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-blue-400 border border-slate-700 transition-colors"
              title="Read Automation Import Documentation"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Import Docs</span>
            </button>
            <button
              onClick={() => setIsAstImportModalOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('samples')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'samples'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sample Specs (Playwright / Mocha)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'paste'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Source Code
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Upload .ts / .js Files
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Tab 1: Samples */}
          {activeTab === 'samples' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleLoadSample('playwright')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    framework === 'playwright'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Playwright Auth Suite (@playwright/test)
                </button>
                <button
                  onClick={() => handleLoadSample('mocha')}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    framework === 'mocha'
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                      : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  Mocha Payments Spec (Mocha / Chai)
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 max-h-56 overflow-auto">
                <pre>{pastedCode}</pre>
              </div>
            </div>
          )}

          {/* Tab 2: Paste Code */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Spec File Path</label>
                <input
                  type="text"
                  value={pastedFileName}
                  onChange={(e) => {
                    setPastedFileName(e.target.value);
                    setFilesToProcess([{ name: e.target.value, content: pastedCode }]);
                  }}
                  placeholder="e.g. tests/e2e/transfers/p2p.spec.ts"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Test File Content (JS / TS)</label>
                <textarea
                  rows={8}
                  value={pastedCode}
                  onChange={(e) => {
                    setPastedCode(e.target.value);
                    setFilesToProcess([{ name: pastedFileName, content: e.target.value }]);
                  }}
                  placeholder="Paste describe() and test() / it() blocks..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs font-mono focus:outline-hidden focus:border-blue-500 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Tab 3: Upload Files */}
          {activeTab === 'upload' && (
            <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl p-8 text-center transition-colors">
              <Upload className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <div className="text-xs font-medium text-slate-200 mb-1">
                Drag and drop spec files (.spec.ts, .test.js) or click to browse
              </div>
              <p className="text-[11px] text-slate-500 mb-4">
                Analyzed completely on client without server upload
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg cursor-pointer transition-colors border border-slate-700">
                Browse Files
                <input
                  type="file"
                  multiple
                  accept=".ts,.js,.tsx,.jsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* AST Static Analysis Summary Bar */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">AST Analysis Preview</span>
              <span className="text-slate-400">{filesToProcess.length} File(s) in Buffer</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Suites</div>
                <div className="text-lg font-bold text-slate-200">{totalParsedSuites}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Tests</div>
                <div className="text-lg font-bold text-slate-200">{totalParsedTests}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Tagged (@T)</div>
                <div className="text-lg font-bold text-emerald-400">{totalTaggedTests}</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Untagged</div>
                <div className="text-lg font-bold text-amber-400">{totalUntaggedTests}</div>
              </div>
            </div>

            {/* Tag Injection Checkbox */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoInjectTags}
                  onChange={(e) => setAutoInjectTags(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0"
                />
                <span>Automatically generate and inject missing <code className="text-blue-400">@T########</code> and <code className="text-amber-400">@S########</code> tags</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <div className="text-xs text-slate-400">
            Detected: <span className="text-slate-200 font-semibold uppercase">{framework}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAstImportModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isProcessing || totalParsedTests === 0}
              onClick={handleSynchronize}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Import & Map Tests ({totalParsedTests})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
