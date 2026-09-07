import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GitBranch as Gitlab,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Settings,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileCode,
  Bug,
  Activity,
  Terminal,
} from 'lucide-react';

const SAMPLE_GITLAB_CI_YML = `# .gitlab-ci.yml (Modern zero-overhead integration)
include:
  - component: gitlab.com/testone/gitlab-component/playwright@v1
    inputs:
      testone_api_key: $TESTONE_API_KEY
      project_key: "$CI_PROJECT_NAME"

# Or direct NPM pipeline step:
# playwright_e2e:
#   stage: test
#   image: mcr.microsoft.com/playwright:v1.46.0-jammy
#   script:
#     - npm ci
#     - npx testone sync --project=$TESTONE_PROJECT_KEY
#     - npx playwright test
`;

export const GitLabIntegrationView: React.FC = () => {
  const {
    gitlabConfig,
    updateGitLabConfig,
    triggerGitLabPipelineMock,
    automationRuns,
    currentProject,
    currentUser,
    hasPermission,
    createDefectFromAutomationFailure,
    addToast,
  } = useApp();

  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineProgressLogs, setPipelineProgressLogs] = useState<string[]>([]);
  const [copiedYml, setCopiedYml] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Filter runs triggered via GitLab
  const gitlabRuns = automationRuns.filter(
    (r) => r.projectId === currentProject.id && (r.pipelineMetadata || r.runner?.includes('GitLab'))
  );

  const handleTriggerPipeline = async () => {
    if (!hasPermission('automation.execute')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to trigger CI pipelines.' });
      return;
    }

    setIsRunningPipeline(true);
    setPipelineProgressLogs([
      `[00:01] Triggering GitLab CI Pipeline on branch: ${gitlabConfig.defaultBranch}...`,
      `[00:03] Runner #4991 allocated on runner-cluster-us-east-1`,
      `[00:06] Pulling container image mcr.microsoft.com/playwright:v1.42.0...`,
      `[00:12] Executing: npx playwright test --reporter=junit`,
    ]);

    setTimeout(() => {
      setPipelineProgressLogs((prev) => [
        ...prev,
        `[00:25] Tests completed: 118 passed, 6 failed, 2 skipped in 42s`,
        `[00:30] JUnit XML artifact uploaded to TestOne Ingestion API`,
      ]);
    }, 1500);

    setTimeout(async () => {
      await triggerGitLabPipelineMock();
      setIsRunningPipeline(false);
    }, 2800);
  };

  const handleCopyYml = () => {
    navigator.clipboard.writeText(SAMPLE_GITLAB_CI_YML);
    setCopiedYml(true);
    setTimeout(() => setCopiedYml(false), 2000);
    addToast({ type: 'info', title: '.gitlab-ci.yml configuration copied to clipboard' });
  };

  return (
    <div className="space-y-6">
      {/* Header Status Card */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Gitlab className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-semibold text-slate-100">GitLab CI/CD Integration</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target Project: <span className="text-slate-300 font-mono font-medium">{gitlabConfig.projectPath}</span> • Default
              Branch: <span className="text-blue-400 font-mono font-medium">{gitlabConfig.defaultBranch}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfigModal(!showConfigModal)}
            className="px-3.5 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-4 h-4" />
            Config
          </button>
          <button
            disabled={isRunningPipeline}
            onClick={handleTriggerPipeline}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-medium rounded-lg shadow-sm shadow-orange-500/20 transition-colors"
          >
            {isRunningPipeline ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running CI Pipeline...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Trigger GitLab Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Log Stream Banner (when active) */}
      {isRunningPipeline && (
        <div className="p-4 rounded-xl border border-orange-500/30 bg-slate-950 font-mono text-xs text-slate-300 space-y-1 animate-pulse">
          <div className="flex items-center gap-2 text-orange-400 font-semibold mb-2">
            <Terminal className="w-4 h-4" />
            <span>GitLab Runner Execution Stream (Job #4991)</span>
          </div>
          {pipelineProgressLogs.map((log, i) => (
            <div key={i} className="text-slate-400">
              {log}
            </div>
          ))}
        </div>
      )}

      {/* Config Drawer / Box (Conditional) */}
      {showConfigModal && (
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200">GitLab Connection Settings</h3>
            <span className="text-[11px] text-slate-500">API v4 Token Scopes: read_api, read_repository</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">GitLab Instance URL</label>
              <input
                type="text"
                value={gitlabConfig.gitlabUrl}
                onChange={(e) => updateGitLabConfig({ gitlabUrl: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Project Path / Namespace</label>
              <input
                type="text"
                value={gitlabConfig.projectPath}
                onChange={(e) => updateGitLabConfig({ projectPath: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Default Branch</label>
              <input
                type="text"
                value={gitlabConfig.defaultBranch}
                onChange={(e) => updateGitLabConfig({ defaultBranch: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid: Pipelines Table & .gitlab-ci.yml Guide */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Pipeline Execution History */}
        <div className="col-span-8 rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-slate-200">GitLab CI Pipeline History</span>
            </div>
            <span className="text-xs text-slate-500">{gitlabRuns.length} Synced Pipelines</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto max-h-[480px]">
            {gitlabRuns.map((run) => (
              <div key={run.id} className="p-4 hover:bg-slate-800/30 transition-colors space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-slate-300 font-semibold">
                      #{run.pipelineMetadata?.pipelineId || 4991}
                    </span>
                    <span className="text-xs font-medium text-slate-200">{run.runName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Passed
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-blue-400">branch: {run.branch}</span>
                    <span>commit: <code className="text-slate-300 font-mono">{run.commitHash}</code></span>
                    <span>duration: {run.durationSeconds}s</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-emerald-400">{run.passed} passed</span>
                    <span className="text-rose-400">{run.failed} failed</span>
                    <span className="text-amber-400">{run.flaky || 0} flaky</span>
                  </div>
                </div>

                {/* Failed item defect shortcut */}
                {run.failed > 0 && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-rose-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {run.failed} failures detected in this pipeline
                    </span>
                    <div className="flex items-center gap-2">
                      {run.results
                        .filter((r) => r.status === 'failed')
                        .map((failedRes) => (
                          <button
                            key={failedRes.id}
                            onClick={() => createDefectFromAutomationFailure(run.id, failedRes.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-[11px] font-medium transition-colors"
                          >
                            <Bug className="w-3 h-3" />
                            Log Bug for {failedRes.testName.slice(0, 20)}...
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: .gitlab-ci.yml Template */}
        <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">.gitlab-ci.yml Template</span>
            </div>
            <button
              onClick={handleCopyYml}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs flex items-center gap-1"
            >
              {copiedYml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-950 p-3.5 font-mono text-[11px] text-slate-300 overflow-auto leading-relaxed">
            <pre>{SAMPLE_GITLAB_CI_YML}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
