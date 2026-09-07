import React, { useState } from 'react';
import { Database, RefreshCw, Copy, Check, Download, ShieldAlert, Sparkles } from 'lucide-react';

export const TestDataApp: React.FC = () => {
  const [recordCount, setRecordCount] = useState<number>(5);
  const [copied, setCopied] = useState(false);

  const generateData = () => {
    const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'Lucas', 'Mia'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const roles = ['QA_ENGINEER', 'DEV_LEAD', 'PRODUCT_OWNER', 'SECURITY_ANALYST', 'SCRUM_MASTER'];

    const records = [];
    for (let i = 0; i < recordCount; i++) {
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      records.push({
        id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
        uuid: `0000${i + 1}-qa-uuid-${Math.random().toString(36).substring(2, 7)}`,
        name: `${first} ${last}`,
        email: `${first.toLowerCase()}.${last.toLowerCase()}@qahub.internal`,
        role: roles[Math.floor(Math.random() * roles.length)],
        status: i % 4 === 0 ? 'SUSPENDED' : 'ACTIVE',
        balance: +(Math.random() * 1500).toFixed(2),
        testCard: `4532-0150-1849-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }
    return records;
  };

  const [data, setData] = useState<any[]>(generateData());

  const handleRegenerate = () => {
    setData(generateData());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const boundaryStrings = [
    { label: 'SQL Injection Payload', str: `' OR '1'='1' --` },
    { label: 'Cross-Site Scripting (XSS)', str: `<script>alert('XSS_QA')</script>` },
    { label: 'Max Safe 32-bit Integer', str: `2147483647` },
    { label: 'Unicode / Emoji Stress', str: `👩‍💻 QA 🚀 𠜎 𠜱 𠝹` },
    { label: 'Null Byte Injection', str: `%00` }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Synthetic Test Data Generator
            </h1>
            <p className="text-xs text-slate-500">
              Generate bulk mock user datasets, test credit cards, and boundary edge cases
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls & Boundaries */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dataset Configuration</h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Number of Records ({recordCount})
                </label>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={recordCount}
                  onChange={(e) => setRecordCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <button
                onClick={handleRegenerate}
                className="w-full inline-flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Dataset</span>
              </button>
            </div>

            {/* Boundary Strings */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                <span>Boundary Strings Library</span>
              </h3>
              <div className="space-y-2">
                {boundaryStrings.map((b, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigator.clipboard.writeText(b.str)}
                    className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-rose-300 text-xs cursor-pointer group"
                    title="Click to copy string"
                  >
                    <div className="text-[10px] font-bold text-slate-500">{b.label}</div>
                    <div className="font-mono text-slate-900 dark:text-white group-hover:text-rose-600 truncate">{b.str}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Output JSON */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generated JSON Dataset</h3>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-rose-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
