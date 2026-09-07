import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { parseSourceFileContent, injectMissingIds, generateTestIdTag } from '../../utils/sourceParser';
import {
  Sparkles,
  RefreshCw,
  FolderCode,
  CheckCircle2,
  AlertTriangle,
  Code,
  FileCode,
  Layers,
  ArrowRight,
  Plus,
  Tag,
  Check,
  Terminal,
  ShieldCheck,
  Zap,
  FolderTree,
  Folder,
  Eye,
} from 'lucide-react';
import { SupportedFramework } from '../../types';

const SAMPLE_SPECS = [
  {
    path: 'tests/e2e/auth/mfa-login.spec.ts',
    framework: 'playwright' as SupportedFramework,
    content: `import { test, expect } from '@playwright/test';

test.describe('Customer Authentication & Step-Up MFA @S10014522', () => {
  test('User logs in with valid credentials and completes SMS OTP @T10010001', async ({ page }) => {
    await test.step('Navigate to /login', async () => {
      await page.goto('/login');
    });
    await test.step('Enter credentials', async () => {
      await page.fill('[data-testid="username"]', 'alice@bank.internal');
      await page.fill('[data-testid="password"]', 'VaultPass2026!');
      await page.click('button[type="submit"]');
    });
    await test.step('Verify OTP challenge screen', async () => {
      await expect(page.locator('[data-testid="otp-challenge"]')).toBeVisible();
    });
  });

  test('Biometric WebAuthn passkey registration for mobile browser', async ({ page }) => {
    await test.step('Open security settings', async () => {
      await page.goto('/settings/security');
    });
    await test.step('Register WebAuthn credential', async () => {
      await page.click('[data-testid="enable-passkey"]');
      await expect(page.locator('.status-active')).toBeVisible();
    });
  });

  test('Enforce rate limiting after 5 consecutive failed login attempts @T10010002', async ({ page }) => {
    await test.step('Trigger 5 failed attempts', async () => {
      await page.goto('/login');
      for (let i = 0; i < 5; i++) {
        await page.fill('[data-testid="password"]', 'BadPass');
        await page.click('button[type="submit"]');
      }
    });
    await test.step('Assert HTTP 429 TooManyRequests message', async () => {
      await expect(page.locator('.toast-error')).toContainText('Rate limit exceeded');
    });
  });
});`,
  },
  {
    path: 'tests/e2e/payments/wire-transfers.spec.ts',
    framework: 'playwright' as SupportedFramework,
    content: `import { test, expect } from '@playwright/test';

test.describe('Wire Transfers & ACH Settlements @S10018899', () => {
  test('Initiates domestic Fedwire transfer under daily transaction limit @T10010009', async ({ page }) => {
    await test.step('Navigate to transfers panel', async () => {
      await page.goto('/transfers/wire');
    });
    await test.step('Submit recipient routing and amount', async () => {
      await page.fill('#routing-number', '021000021');
      await page.fill('#amount', '4500.00');
      await page.click('#submit-transfer');
    });
    await test.step('Verify confirmation reference ID', async () => {
      await expect(page.locator('.tx-badge-confirmed')).toBeVisible();
    });
  });

  test('Rejects international SWIFT transfer with invalid BIC code', async ({ page }) => {
    await test.step('Attempt SWIFT transfer with invalid code', async () => {
      await page.goto('/transfers/wire');
      await page.fill('#swift-bic', 'INVALID_BIC');
      await page.click('#submit-transfer');
    });
    await test.step('Verify validation error message', async () => {
      await expect(page.locator('.field-error')).toContainText('Invalid SWIFT routing identifier');
    });
  });
});`,
  },
];

export const TestCaseSyncView: React.FC = () => {
  const {
    currentProject,
    suites,
    folders,
    testCases,
    syncAutomatedTestCasesIntoTms,
    setNavSection,
    setSelectedSuiteId,
    setSelectedTestCaseId,
    addToast,
    hasPermission,
  } = useApp();

  const [selectedSpecIndex, setSelectedSpecIndex] = useState(0);
  const [specFiles, setSpecFiles] = useState(SAMPLE_SPECS);
  const [targetSuiteId, setTargetSuiteId] = useState<string>(suites[0]?.id || '');
  const [targetFolderId, setTargetFolderId] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [cliLogs, setCliLogs] = useState<string[]>([]);
  const [lastSyncResult, setLastSyncResult] = useState<{ createdCount: number; updatedCount: number; testCaseIds: string[] } | null>(null);

  const activeSpec = specFiles[selectedSpecIndex] || specFiles[0];

  // Parse current active spec using AST parser
  const parsed = useMemo(() => {
    return parseSourceFileContent(currentProject.id, activeSpec.path, activeSpec.content);
  }, [currentProject.id, activeSpec.path, activeSpec.content]);

  // Classify tests into New vs Reconciled vs Missing Tags
  const testAnalysis = useMemo(() => {
    return parsed.tests.map((t) => {
      const existingCase = testCases.find((tc) => {
        if (tc.projectId !== currentProject.id) return false;
        if (t.testIdRef && (tc.id === t.testIdRef || tc.tags?.includes(t.testIdRef))) return true;
        return tc.title.trim().toLowerCase() === (t.cleanTitle || t.title).trim().toLowerCase();
      });

      let status: 'reconciled' | 'new_in_code' | 'missing_tag' = 'new_in_code';
      if (existingCase && t.testIdRef) {
        status = 'reconciled';
      } else if (!t.testIdRef) {
        status = 'missing_tag';
      }

      return {
        ...t,
        existingCase,
        status,
      };
    });
  }, [parsed.tests, testCases, currentProject.id]);

  const newCount = testAnalysis.filter((t) => t.status === 'new_in_code').length;
  const missingTagCount = testAnalysis.filter((t) => t.status === 'missing_tag').length;
  const reconciledCount = testAnalysis.filter((t) => t.status === 'reconciled').length;

  const handleAutoInjectTags = () => {
    if (!hasPermission('automation.manage')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to modify test specs.' });
      return;
    }

    const { newContent, injectedCount } = injectMissingIds(activeSpec.content);
    if (injectedCount === 0) {
      addToast({ type: 'info', title: 'All tests already have @T tags' });
      return;
    }

    const updated = [...specFiles];
    updated[selectedSpecIndex] = { ...activeSpec, content: newContent };
    setSpecFiles(updated);

    addToast({
      type: 'success',
      title: 'Tags Auto-Injected',
      message: `Injected ${injectedCount} @T tags into ${activeSpec.path}`,
    });
  };

  const handleExecuteSync = () => {
    if (!hasPermission('testcase.create')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to create test cases.' });
      return;
    }

    setIsSyncing(true);
    setCliLogs([
      `[00:00.00] $ npx testone sync --project=${currentProject.key}`,
      `[00:00.12] [@testone/cli] Discovering test spec files in ./tests/**/*.spec.ts...`,
      `[00:00.28] [@testone/cli] Found 1 file with ${parsed.tests.length} test declarations`,
      `[00:00.45] [@testone/cli] AST parsing: ${parsed.suites.length} suites, ${parsed.tests.length} tests`,
    ]);

    setTimeout(() => {
      const testsToSync = parsed.tests.map((t) => ({
        title: t.cleanTitle || t.title,
        suiteName: parsed.suites[0]?.name || 'Automated Regression',
        filePath: activeSpec.path,
        framework: activeSpec.framework,
        testIdTag: t.testIdRef,
        steps: [
          {
            action: 'Execute automated test scenario',
            expectedResult: 'Step succeeds without error.',
          },
        ],
        priority: 'high' as const,
        testType: 'functional' as const,
      }));

      const syncResult = syncAutomatedTestCasesIntoTms({
        targetSuiteId: targetSuiteId || suites[0]?.id,
        targetFolderId: targetFolderId || undefined,
        testsToSync,
      });

      setLastSyncResult(syncResult);
      setCliLogs((prev) => [
        ...prev,
        `[00:01.20] [@testone/cli] Syncing to TestOne TMS (Project: ${currentProject.key})...`,
        `[00:01.45] [@testone/cli] Provisioned ${syncResult.createdCount} new test cases in Test Repository`,
        `[00:01.60] [@testone/cli] Reconciled ${syncResult.updatedCount} existing test cases with updated steps`,
        `[00:01.75] [@testone/cli] HTTP 200 OK — Repository synchronized successfully!`,
      ]);
      setIsSyncing(false);
    }, 1200);
  };

  const projectFolders = folders.filter((f) => !targetSuiteId || f.suiteId === targetSuiteId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                Automated Test Case Sync Engine (CLI)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                npx testone sync
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Bi-directionally synchronize automated Playwright & Mocha spec files with the TestOne Test Repository. Discovers newly written tests, auto-provisions test cases, and reconciles execution steps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAutoInjectTags}
              disabled={missingTagCount === 0}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Auto-Inject @T Tags ({missingTagCount})</span>
            </button>

            <button
              onClick={handleExecuteSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/20 transition-colors"
            >
              {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Sync to Test Repository</span>
            </button>
          </div>
        </div>

        {/* Sync Summary Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-slate-400">Total Specs Discovered</div>
            <div className="text-lg font-bold text-slate-100 mt-0.5">{parsed.tests.length} tests</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled in TMS
            </div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{reconciledCount}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> New (To Provision)
            </div>
            <div className="text-lg font-bold text-blue-400 mt-0.5">{newCount}</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Missing @T Annotation
            </div>
            <div className="text-lg font-bold text-amber-400 mt-0.5">{missingTagCount}</div>
          </div>
        </div>
      </div>

      {/* Main Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: File Explorer & Config */}
        <div className="space-y-4">
          {/* File Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <FolderCode className="w-4 h-4 text-blue-400" />
              Repository Spec Files
            </h3>

            <div className="space-y-1.5">
              {specFiles.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSpecIndex(idx)}
                  className={`w-full p-2.5 rounded-lg text-left text-xs font-mono transition-colors flex items-center justify-between border ${
                    selectedSpecIndex === idx
                      ? 'bg-blue-600/10 text-blue-300 border-blue-500/30'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{f.path}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{f.framework}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sync Target Folder Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-emerald-400" />
              Target Test Repository Location
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Target Suite</label>
                <select
                  value={targetSuiteId}
                  onChange={(e) => setTargetSuiteId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {suites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-400">Target Folder (Optional)</label>
                <select
                  value={targetFolderId}
                  onChange={(e) => setTargetFolderId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">(Root folder)</option>
                  {projectFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CLI Terminal Output */}
          {cliLogs.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                CLI Output (<code className="text-emerald-400 font-mono text-[11px]">npx testone sync</code>)
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
                {cliLogs.map((log, i) => (
                  <div key={i} className={log.includes('OK') ? 'text-emerald-400' : 'text-slate-300'}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Discovered Tests Diff & Code Preview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Last Sync Success Card */}
          {lastSyncResult && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-emerald-300">
                    Test Repository Synchronized! ({lastSyncResult.createdCount} provisioned, {lastSyncResult.updatedCount} reconciled)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Created test cases are now available for manual execution or automated CI/CD runs.
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSuiteId(targetSuiteId);
                  setNavSection('repository');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>View Repository</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Test Analysis Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-slate-200 font-mono">{activeSpec.path}</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Suite: <strong className="text-slate-200">{parsed.suites[0]?.name || 'Root'}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {testAnalysis.map((test, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-850 transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-100">{test.cleanTitle || test.title}</span>
                      {test.testIdRef ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono font-bold">
                          @{test.testIdRef}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Untagged
                        </span>
                      )}

                      {test.status === 'reconciled' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
                          Reconciled in TMS
                        </span>
                      )}

                      {test.status === 'new_in_code' && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">
                          Ready to Provision
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono">
                      File: {test.filePath} (Lines {test.startLine}–{test.endLine})
                    </div>
                  </div>

                  <div>
                    {test.existingCase ? (
                      <button
                        onClick={() => {
                          if (test.existingCase) {
                            setSelectedTestCaseId(test.existingCase.id);
                            setNavSection('repository');
                          }
                        }}
                        className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-blue-400 transition-colors"
                        title="View Linked Test Case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Will create</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
