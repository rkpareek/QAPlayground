import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Package,
  Terminal,
  Copy,
  Check,
  Play,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  GitBranch as Gitlab,
  GitFork as Github,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  Settings2,
  ExternalLink,
  Code2,
  RefreshCw,
} from 'lucide-react';

export const NpmReporterView: React.FC = () => {
  const { currentProject, triggerMockAutomationRun, setNavSection, setSelectedTestRunId, addToast, hasPermission } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'quickstart' | 'playwright_config' | 'gitlab_component' | 'simulator' | 'api_reference'>('quickstart');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Config generator interactive options
  const [autoCreateCases, setAutoCreateCases] = useState(true);
  const [uploadArtifacts, setUploadArtifacts] = useState(true);
  const [recordTraces, setRecordTraces] = useState(true);
  const [defaultFolder, setDefaultFolder] = useState('Automated / Playwright E2E');
  const [environmentTag, setEnvironmentTag] = useState('CI Pipeline / Staging');

  // Simulator state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simRunId, setSimRunId] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
    addToast({ type: 'info', title: 'Snippet copied to clipboard' });
  };

  const PLAYWRIGHT_CONFIG_CODE = `// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,

  // 🚀 Register the TestOne official Playwright Reporter
  reporter: [
    ['list'],
    ['@testone/playwright-reporter', {
      apiKey: process.env.TESTONE_API_KEY,
      projectKey: '${currentProject.key}',
      baseUrl: process.env.TESTONE_BASE_URL || 'https://app.testone.internal',
      autoCreateTestCases: ${autoCreateCases},
      defaultFolder: '${defaultFolder}',
      uploadArtifactsOnFailure: ${uploadArtifacts},
      recordTraces: ${recordTraces},
      metadata: {
        environment: process.env.CI_ENVIRONMENT_NAME || '${environmentTag}',
        buildNumber: process.env.CI_PIPELINE_ID || process.env.GITHUB_RUN_NUMBER,
        gitCommit: process.env.CI_COMMIT_SHA || process.env.GITHUB_SHA,
        gitBranch: process.env.CI_COMMIT_REF_NAME || process.env.GITHUB_REF_NAME,
      }
    }],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'https://staging.internal.bank',
    trace: '${recordTraces ? 'on-first-retry' : 'off'}',
    screenshot: '${uploadArtifacts ? 'only-on-failure' : 'off'}',
    video: 'retain-on-failure',
  },
});`;

  const GITLAB_COMPONENT_CODE = `# .gitlab-ci.yml
# Option A: Modern GitLab CI Component (GitLab 16+)
include:
  - component: gitlab.com/testone/gitlab-component/playwright@v1
    inputs:
      testone_api_key: $TESTONE_API_KEY
      project_key: "${currentProject.key}"
      test_command: "npx playwright test"
      sync_repository_first: true
`;

  const GITLAB_STANDARD_YML_CODE = `# .gitlab-ci.yml
# Option B: Standard Native Pipeline using @testone/playwright-reporter
stages:
  - test

variables:
  TESTONE_PROJECT_KEY: "${currentProject.key}"
  TESTONE_BASE_URL: "https://app.testone.internal"

playwright_e2e:
  stage: test
  image: mcr.microsoft.com/playwright:v1.46.0-jammy
  script:
    - npm ci
    # 1. Sync any new spec tests from code to TMS test repository
    - npx testone sync --project=$TESTONE_PROJECT_KEY
    # 2. Execute tests; @testone/playwright-reporter streams results automatically
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
`;

  const GITHUB_ACTIONS_CODE = `# .github/workflows/testone-e2e.yml
name: TestOne E2E Automation Pipeline

on:
  push:
    branches: [main, release/*]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Sync Spec Test Cases to TestOne
        run: npx testone sync --project=${currentProject.key}
        env:
          TESTONE_API_KEY: \${{ secrets.TESTONE_API_TOKEN }}

      - name: Run Playwright Tests with TestOne Reporter
        run: npx playwright test
        env:
          TESTONE_API_KEY: \${{ secrets.TESTONE_API_TOKEN }}
          TESTONE_BASE_URL: "https://app.testone.internal"
`;

  const runSimulation = () => {
    if (!hasPermission('automation.execute')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to run automation simulations.' });
      return;
    }

    setIsSimulating(true);
    setSimRunId(null);
    setSimLogs([
      `[00:00.00] $ npx playwright test`,
      `[00:00.15] [@testone/playwright-reporter] Initializing TestOne Reporter v1.4.0...`,
      `[00:00.32] [@testone/playwright-reporter] Handshake with https://app.testone.internal for project "${currentProject.key}"`,
      `[00:00.60] [@testone/playwright-reporter] onBegin() -> Created active run buffer (Session ID: s_9f2a71c)`,
    ]);

    setTimeout(() => {
      setSimLogs((prev) => [
        ...prev,
        `[00:01.10] [worker 1] Running 6 tests using 4 workers`,
        `[00:01.45] [@testone/playwright-reporter] onTestBegin() -> tests/e2e/auth/login.spec.ts "Valid user authentication with MFA @T10010001"`,
        `[00:01.80] [@testone/playwright-reporter] onStepBegin() -> page.goto("/login")`,
        `[00:02.15] [@testone/playwright-reporter] onStepEnd() -> passed (320ms)`,
        `[00:02.40] [@testone/playwright-reporter] onTestEnd() -> status: passed (1,120ms) -> Queued result`,
      ]);
    }, 1000);

    setTimeout(() => {
      setSimLogs((prev) => [
        ...prev,
        `[00:02.90] [@testone/playwright-reporter] onTestBegin() -> tests/e2e/payments/checkout.spec.ts "Process contactless payment @T10010009"`,
        `[00:03.40] [@testone/playwright-reporter] onTestEnd() -> status: passed (890ms)`,
        `[00:03.80] [@testone/playwright-reporter] onTestBegin() -> tests/e2e/security/lockout.spec.ts "Account lockout after 5 failed attempts @T10010002"`,
        `[00:04.20] [@testone/playwright-reporter] onTestEnd() -> status: passed (640ms)`,
      ]);
    }, 2200);

    setTimeout(() => {
      const generatedRun = triggerMockAutomationRun('playwright');
      setSimRunId(generatedRun.id);
      setSimLogs((prev) => [
        ...prev,
        `[00:04.90] [@testone/playwright-reporter] onEnd() -> Test suite finished: 6 passed, 0 failed in 4.9s`,
        `[00:05.10] [@testone/playwright-reporter] Compressing & flushing payload to /api/v1/automation/runs/ingest`,
        `[00:05.35] [@testone/playwright-reporter] HTTP 200 OK -> TestOne Run Ingested: ${generatedRun.id}`,
        `[00:05.40] ==============================================================================`,
        `[00:05.42] 📊 TestOne Run Telemetry: https://app.testone.internal/runs/${generatedRun.id}`,
        `[00:05.45] ✨ Verified 6 test cases against Test Repository. Zero manual curl scripts needed.`,
      ]);
      setIsSimulating(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                @testone/playwright-reporter & CLI Ecosystem
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NPM Official
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Plug-and-play Playwright reporter and AST sync CLI that completely eliminates manual cURL scripts, JUnit XML parsing, and brittle pipeline scripts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSubTab('simulator')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 shadow-sm shadow-blue-500/20 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch Live Simulator</span>
            </button>
          </div>
        </div>

        {/* Feature Highlights Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Zero-Config Integration</div>
              <div className="text-[11px] text-slate-400 mt-0.5">1-line config in <code className="text-blue-400 font-mono">playwright.config.ts</code> replaces 40 lines of curl script.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">AST Test Case Sync (`testone sync`)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Scans spec files, auto-allocates <code className="text-emerald-400 font-mono">@T########</code> tags, and syncs repository trees.</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-3">
            <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-400 mt-0.5">
              <Gitlab className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Native GitLab CI/CD Component</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Includes predefined GitLab CI Catalog component for instant setup in any project pipeline.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveSubTab('quickstart')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'quickstart'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>1. Install & Quickstart</span>
        </button>

        <button
          onClick={() => setActiveSubTab('playwright_config')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'playwright_config'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>2. Config Generator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gitlab_component')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'gitlab_component'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Gitlab className="w-3.5 h-3.5 text-orange-400" />
          <span>3. GitLab & GitHub CI/CD</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulator')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'simulator'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>4. Live Reporter Simulator</span>
        </button>

        <button
          onClick={() => setActiveSubTab('api_reference')}
          className={`px-3.5 py-2 text-xs font-medium rounded-lg flex items-center gap-2 transition-colors ${
            activeSubTab === 'api_reference'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>API Reference</span>
        </button>
      </div>

      {/* Tab 1: Install & Quickstart */}
      {activeSubTab === 'quickstart' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Install NPM Packages */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold font-mono">
                    1
                  </span>
                  <h3 className="text-sm font-semibold text-slate-200">Install Packages via NPM / Yarn / PNPM</h3>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">devDependencies</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Add the official reporter and CLI toolkit to your repository dependencies:
              </p>

              <div className="space-y-2">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-xs font-mono text-emerald-400">
                    npm install -D @testone/playwright-reporter @testone/cli
                  </code>
                  <button
                    onClick={() => handleCopy('npm install -D @testone/playwright-reporter @testone/cli', 'install-npm')}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedKey === 'install-npm' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                  <code className="text-xs font-mono text-slate-300">
                    pnpm add -D @testone/playwright-reporter @testone/cli
                  </code>
                  <button
                    onClick={() => handleCopy('pnpm add -D @testone/playwright-reporter @testone/cli', 'install-pnpm')}
                    className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedKey === 'install-pnpm' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3.5 space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  What is included in the bundle:
                </div>
                <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                  <li><strong className="text-slate-200">@testone/playwright-reporter</strong>: Custom Playwright Reporter implementation implementing <code className="text-blue-400 font-mono">Reporter</code> interface.</li>
                  <li><strong className="text-slate-200">@testone/cli</strong>: AST spec file scanner with <code className="text-blue-400 font-mono">testone sync</code> and auto-tag injection.</li>
                  <li><strong className="text-slate-200">Zero Runtime Overhead</strong>: Non-blocking HTTP batching with automatic retries and exponential backoff.</li>
                </ul>
              </div>
            </div>

            {/* Step 2: Configure Environment Variables */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs font-bold font-mono">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-slate-200">Set Environment Secrets</h3>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">CI/CD Variables</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Add these environment variables to your GitLab CI / GitHub Actions repository settings:
              </p>

              <div className="space-y-2 font-mono text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">TESTONE_API_KEY</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Secret Masked</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">Bearer token generated in Project Settings &gt; API Keys.</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">TESTONE_BASE_URL</span>
                    <span className="text-[10px] text-slate-400">Optional</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">Default: <code className="text-slate-300">https://app.testone.internal</code> (or your custom enterprise domain).</div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-semibold">TESTONE_PROJECT_KEY</span>
                    <span className="text-[10px] font-bold text-slate-200 bg-slate-800 px-1.5 py-0.5 rounded">{currentProject.key}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans mt-1">Target workspace project key.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Code Example Comparison: Old vs New */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Before & After: How @testone/playwright-reporter Simplifies Your Pipeline
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
              {/* Old Way */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-rose-400 font-semibold px-1">
                  <span className="flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Traditional Brittle Way (XML & cURL)</span>
                  <span className="text-[10px] text-slate-500 font-sans">42 lines of bash</span>
                </div>
                <pre className="p-3.5 rounded-lg bg-rose-950/10 border border-rose-900/30 text-slate-400 overflow-x-auto text-[11px] leading-relaxed">
{`# ❌ Brittle bash scripts & XML upload
- npx playwright test --reporter=junit
- if [ -f results/junit.xml ]; then
    curl -X POST "https://app.testone.internal/api/v1/automation/ingest" \\
      -H "Authorization: Bearer $TESTONE_API_KEY" \\
      -F "file=@results/junit.xml" \\
      -F "pipelineId=$CI_PIPELINE_ID" \\
      -F "branch=$CI_COMMIT_REF_NAME"
  fi
# ❌ No real-time test step streaming
# ❌ Screenshots not linked to specific failed tests`}
                </pre>
              </div>

              {/* New Way */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-emerald-400 font-semibold px-1">
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> New @testone/playwright-reporter</span>
                  <span className="text-[10px] text-slate-500 font-sans">2 lines in CI</span>
                </div>
                <pre className="p-3.5 rounded-lg bg-emerald-950/10 border border-emerald-900/30 text-slate-200 overflow-x-auto text-[11px] leading-relaxed">
{`# ✅ Zero curl scripts needed
- npx testone sync --project=${currentProject.key}
- npx playwright test

# ✨ Automatic step streaming
# ✨ Failed trace viewer archives auto-uploaded
# ✨ Automatic test case discovery & reconciliation`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Config Generator */}
      {activeSubTab === 'playwright_config' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-blue-400" />
              Reporter Options
            </h3>
            <p className="text-xs text-slate-400">
              Customize reporter behavior to generate your tailor-made <code className="text-blue-400 font-mono">playwright.config.ts</code>:
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={autoCreateCases}
                  onChange={(e) => setAutoCreateCases(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Auto-create Missing Test Cases</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Automatically provisions test cases in TestOne for untagged tests.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={uploadArtifacts}
                  onChange={(e) => setUploadArtifacts(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Upload Failure Artifacts</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Upload screenshots, videos, and trace archives on failure.</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={recordTraces}
                  onChange={(e) => setRecordTraces(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Capture Step Traces</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Record granular <code className="text-blue-400">test.step()</code> execution logs.</div>
                </div>
              </label>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">Default Target Suite Folder</label>
                <input
                  type="text"
                  value={defaultFolder}
                  onChange={(e) => setDefaultFolder(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Environment Label</label>
                <input
                  type="text"
                  value={environmentTag}
                  onChange={(e) => setEnvironmentTag(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Generated Code Preview */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-semibold text-slate-200 font-mono">playwright.config.ts</span>
              </div>
              <button
                onClick={() => handleCopy(PLAYWRIGHT_CONFIG_CODE, 'playwright-config')}
                className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {copiedKey === 'playwright-config' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'playwright-config' ? 'Copied' : 'Copy Config'}</span>
              </button>
            </div>
            <pre className="p-4 flex-1 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed selection:bg-blue-600 selection:text-white">
              {PLAYWRIGHT_CONFIG_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: GitLab Component & GitHub Actions */}
      {activeSubTab === 'gitlab_component' && (
        <div className="space-y-6">
          {/* GitLab Component Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Gitlab className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                    GitLab CI Catalog Component (Recommended)
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      GitLab 16+
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Include the official TestOne component directly in your <code className="text-orange-400 font-mono">.gitlab-ci.yml</code> with just 4 lines of configuration.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(GITLAB_COMPONENT_CODE, 'gitlab-component')}
                className="px-3 py-1.5 rounded-lg bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-orange-500/30 self-start md:self-auto"
              >
                {copiedKey === 'gitlab-component' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Component Snippet</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border-b border-slate-800">
              {GITLAB_COMPONENT_CODE}
            </pre>

            {/* Standard .gitlab-ci.yml alternative */}
            <div className="p-5 space-y-3 bg-slate-950/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Or use standard .gitlab-ci.yml job syntax:</span>
                <button
                  onClick={() => handleCopy(GITLAB_STANDARD_YML_CODE, 'gitlab-standard')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copiedKey === 'gitlab-standard' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy YAML</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 font-mono text-xs overflow-x-auto leading-relaxed">
                {GITLAB_STANDARD_YML_CODE}
              </pre>
            </div>
          </div>

          {/* GitHub Actions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    GitHub Actions Workflow (.github/workflows/testone-e2e.yml)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated Playwright regression workflow with TestOne AST sync and reporter telemetry.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(GITHUB_ACTIONS_CODE, 'github-actions')}
                className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-blue-500/30 self-start md:self-auto"
              >
                {copiedKey === 'github-actions' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy GitHub Workflow</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
              {GITHUB_ACTIONS_CODE}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Live Reporter Simulator */}
      {activeSubTab === 'simulator' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Live Reporter Execution Simulator
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulates how <code className="text-emerald-400 font-mono">@testone/playwright-reporter</code> intercepts Playwright hooks (<code className="text-blue-400">onBegin</code>, <code className="text-blue-400">onTestBegin</code>, <code className="text-blue-400">onStepBegin</code>, <code className="text-blue-400">onTestEnd</code>, <code className="text-blue-400">onEnd</code>) and streams real-time test runs into TestOne.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={runSimulation}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2 shadow-sm shadow-emerald-500/20 transition-colors"
                >
                  {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isSimulating ? 'Streaming Execution...' : 'Run Reporter Test'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Console Box */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs space-y-1.5 shadow-inner min-h-[220px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-slate-500 text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-1 text-slate-400">bash — 80x24 (Playwright + @testone/playwright-reporter)</span>
                </div>
                {isSimulating ? (
                  <span className="text-amber-400 animate-pulse font-sans text-xs">Streaming hooks...</span>
                ) : simLogs.length > 0 ? (
                  <span className="text-emerald-400 font-sans text-xs">Exit Code: 0 (Success)</span>
                ) : (
                  <span>Ready to trigger</span>
                )}
              </div>

              {simLogs.length === 0 && (
                <div className="py-12 text-center text-slate-600">
                  Click <strong className="text-slate-400">"Run Reporter Test"</strong> to simulate Playwright execution with real-time @testone/playwright-reporter telemetry.
                </div>
              )}

              {simLogs.map((line, idx) => (
                <div
                  key={idx}
                  className={`${
                    line.includes('[@testone/playwright-reporter]')
                      ? 'text-blue-400'
                      : line.includes('HTTP 200') || line.includes('passed')
                      ? 'text-emerald-400'
                      : line.includes('Telemetry:')
                      ? 'text-indigo-300 font-bold'
                      : line.includes('===')
                      ? 'text-slate-600'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>

            {simRunId && (
              <div className="p-4 rounded-lg bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-slate-100">
                      Automation Run Created: <span className="font-mono text-blue-400">{simRunId}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      All execution results, timings, and logs were automatically synced to TestOne.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedTestRunId(simRunId);
                    setNavSection('test-runs');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <span>View in Test Runs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: API Reference */}
      {activeSubTab === 'api_reference' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">@testone/playwright-reporter Configuration Options</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3 font-semibold">Option</th>
                    <th className="py-2.5 px-3 font-semibold">Type</th>
                    <th className="py-2.5 px-3 font-semibold">Default</th>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">apiKey</td>
                    <td className="py-2.5 px-3 text-slate-300">string</td>
                    <td className="py-2.5 px-3 text-slate-500">process.env.TESTONE_API_KEY</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Secret API token for authenticating against TestOne.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">projectKey</td>
                    <td className="py-2.5 px-3 text-slate-300">string</td>
                    <td className="py-2.5 px-3 text-amber-400 font-sans">Required</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Unique project key identifier (e.g. {currentProject.key}).</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">baseUrl</td>
                    <td className="py-2.5 px-3 text-slate-300">string</td>
                    <td className="py-2.5 px-3 text-slate-400">"https://app.testone.internal"</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">TestOne API endpoint URL.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">autoCreateTestCases</td>
                    <td className="py-2.5 px-3 text-slate-300">boolean</td>
                    <td className="py-2.5 px-3 text-emerald-400">true</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Automatically provisions untracked test cases in repository.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">uploadArtifactsOnFailure</td>
                    <td className="py-2.5 px-3 text-slate-300">boolean</td>
                    <td className="py-2.5 px-3 text-emerald-400">true</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Uploads screenshots, videos, and trace archives for failed tests.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-blue-400 font-bold">metadata</td>
                    <td className="py-2.5 px-3 text-slate-300">object</td>
                    <td className="py-2.5 px-3 text-slate-500">Auto-detected CI vars</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">Custom tags including git commit, branch, environment name, and PR number.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
