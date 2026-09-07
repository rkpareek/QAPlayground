import React, { useState } from 'react';
import { SAMPLE_LOGIN_TEST_CASES } from '../data/manualTesting';
import { FileSpreadsheet, CheckCircle2, XCircle, AlertCircle, Copy, Check } from 'lucide-react';

export const InteractiveTestCaseViewer: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>(SAMPLE_LOGIN_TEST_CASES[0].testCaseId);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeTC = SAMPLE_LOGIN_TEST_CASES.find((tc) => tc.testCaseId === selectedCase) || SAMPLE_LOGIN_TEST_CASES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="interactive-test-case-viewer" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs my-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Standard Test Case Template & Examples (Login Module)</h4>
            <p className="text-xs text-slate-500">Inspect positive, negative, and edge-case test case structures.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
        {SAMPLE_LOGIN_TEST_CASES.map((tc) => (
          <button
            key={tc.testCaseId}
            id={`tc-tab-${tc.testCaseId.toLowerCase()}`}
            onClick={() => setSelectedCase(tc.testCaseId)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCase === tc.testCaseId
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {tc.testCaseId}: {tc.scenario.length > 30 ? tc.scenario.substring(0, 30) + '...' : tc.scenario}
          </button>
        ))}
      </div>

      {/* Test Case Detail Card */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-white border border-slate-200 rounded">
              {activeTC.testCaseId}
            </span>
            <span className="font-bold text-slate-800">{activeTC.scenario}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
              {activeTC.status}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[11px]">
              Sev: {activeTC.severity}
            </span>
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[11px]">
              Prio: {activeTC.priority}
            </span>
            <button
              onClick={() => handleCopy(JSON.stringify(activeTC, null, 2), activeTC.testCaseId)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              title="Copy Test Case JSON"
            >
              {copiedId === activeTC.testCaseId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Steps & Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-semibold text-slate-700 block mb-1.5">Execution Steps:</span>
            <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-700">
              {activeTC.testSteps.map((step, idx) => (
                <div key={idx}>{step}</div>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="font-semibold text-slate-700 block mb-1">Test Data Used:</span>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80 font-mono text-[11px] text-slate-600">
                {activeTC.testData}
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Expected Result:</span>
              <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/60 text-[11px] text-emerald-900">
                {activeTC.expectedResult}
              </div>
            </div>

            <div>
              <span className="font-semibold text-slate-700 block mb-1">Actual Result (Verified in QA):</span>
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                {activeTC.actualResult}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
