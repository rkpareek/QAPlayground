import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateTestIdTag, injectMissingIds } from '../../utils/sourceParser';
import { AutomationSourceFile } from '../../types/automation';
import {
  Code,
  FileCode,
  Layers,
  Search,
  Sparkles,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  Tag,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FolderCode,
} from 'lucide-react';

export const AutomationSourceExplorer: React.FC = () => {
  const {
    sourceFiles,
    deleteSourceFile,
    syncAutomationTags,
    setIsAstImportModalOpen,
    testCases,
    setSelectedTestCaseId,
    setNavSection,
    hasPermission,
    addToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileId, setSelectedFileId] = useState<string>(sourceFiles[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const filteredFiles = sourceFiles.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase()) || f.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeFile = sourceFiles.find((f) => f.id === selectedFileId) || filteredFiles[0] || sourceFiles[0];

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ type: 'info', title: 'Source code copied to clipboard' });
  };

  const handleInjectMissingTags = () => {
    if (!activeFile) return;
    if (!hasPermission('automation.manage')) {
      addToast({ type: 'error', title: 'Permission Denied', message: 'You do not have permission to modify source tags.' });
      return;
    }

    const { newContent, injectedCount } = injectMissingIds(activeFile.content);

    if (injectedCount > 0) {
      syncAutomationTags(activeFile.id, newContent);
      addToast({
        type: 'success',
        title: 'Tags Injected',
        message: `Injected ${injectedCount} @T identifiers into ${activeFile.path}`,
      });
    } else {
      addToast({ type: 'info', title: 'All tests in this file already have @T tags' });
    }
  };

  if (sourceFiles.length === 0) {
    return (
      <div className="p-12 rounded-xl border border-slate-800 bg-slate-900/50 text-center">
        <FolderCode className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200 mb-1">No Automation Source Files Tracked</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mb-5">
          Import and synchronize your Playwright, Mocha, and Cypress test repositories to explore AST mappings and reconcile tags.
        </p>
        <button
          onClick={() => setIsAstImportModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Import Test Specification Files
        </button>
      </div>
    );
  }

  // Count metrics for current file
  const fileTests = activeFile?.suites.flatMap((s) => s.tests) || [];
  const taggedCount = fileTests.filter((t) => !!t.testIdRef).length;
  const untaggedCount = fileTests.length - taggedCount;

  return (
    <div className="grid grid-cols-12 gap-5 min-h-[600px] h-[calc(100vh-220px)]">
      {/* File Tree / Sidebar */}
      <div className="col-span-4 rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-200">Tracked Test Files ({sourceFiles.length})</span>
            </div>
            <button
              onClick={() => setIsAstImportModalOpen(true)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Import
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file path or framework..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs placeholder-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {filteredFiles.map((file) => {
            const isSelected = file.id === activeFile?.id;
            const testsInFile = file.suites.flatMap((s) => s.tests);
            const untagged = testsInFile.filter((t) => !t.testIdRef).length;

            return (
              <div
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-600/10 border-l-2 border-blue-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-200 truncate pr-2 font-mono">{file.path}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 uppercase font-sans shrink-0">
                    {file.framework}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {file.suites.length} suites • {testsInFile.length} tests
                  </span>
                  {untagged > 0 ? (
                    <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                      <AlertCircle className="w-3 h-3" />
                      {untagged} unmapped
                    </span>
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      fully tagged
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Viewer & AST Outline */}
      <div className="col-span-8 rounded-xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
        {activeFile ? (
          <>
            {/* Top Toolbar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/90 shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200 font-mono">{activeFile.path}</div>
                  <div className="text-[11px] text-slate-400">
                    Framework: <span className="text-slate-300 font-medium capitalize">{activeFile.framework}</span> • Last Parsed:{' '}
                    {new Date(activeFile.lastImportedAt || activeFile.lastModifiedAt || Date.now()).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {untaggedCount > 0 && (
                  <button
                    onClick={handleInjectMissingTags}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Inject Missing @T IDs ({untaggedCount})
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => deleteSourceFile(activeFile.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors text-xs"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* AST Structure Bar */}
            <div className="px-5 py-2 border-b border-slate-800/80 bg-slate-950/60 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeFile.suites.length} Suites</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {taggedCount}/{fileTests.length} Tests Mapped with @T
                </span>
              </div>
            </div>

            {/* Monospace Code Editor / Viewer */}
            <div className="flex-1 overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed select-text">
              <pre className="space-y-0.5">
                {activeFile.content.split('\n').map((line, idx) => {
                  const lineNum = idx + 1;
                  const isSuiteLine = line.includes('describe(');
                  const isTestLine = line.includes('test(') || line.includes('it(');
                  const hasSuiteTag = line.includes('@S');
                  const hasTestTag = line.includes('@T');

                  return (
                    <div key={idx} className="flex hover:bg-slate-900/60 group">
                      <span className="w-10 select-none text-slate-600 text-right pr-4 shrink-0">{lineNum}</span>
                      <span className="flex-1 whitespace-pre-wrap">
                        {isSuiteLine && (
                          <span className="text-amber-300 font-semibold">{line}</span>
                        )}
                        {isTestLine && (
                          <span className="text-blue-300 font-medium">{line}</span>
                        )}
                        {!isSuiteLine && !isTestLine && line}
                      </span>
                    </div>
                  );
                })}
              </pre>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-500">Select a file to preview</div>
        )}
      </div>
    </div>
  );
};
