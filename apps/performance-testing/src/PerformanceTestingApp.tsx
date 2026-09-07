import React, { useState } from 'react';
import { Gauge, Calculator, Clock, Users, Activity, Copy, Check } from 'lucide-react';

export const PerformanceTestingApp: React.FC = () => {
  const [tps, setTps] = useState<number>(50); // Target Transactions Per Second
  const [responseTimeSec, setResponseTimeSec] = useState<number>(0.4); // 400ms avg response time
  const [thinkTimeSec, setThinkTimeSec] = useState<number>(1.0); // 1.0s user think time
  const [copied, setCopied] = useState(false);

  // Little's Law: N = X * (R + Z)
  // Virtual Users (VU) = Target TPS * (Response Time + Think Time)
  const totalIterationDuration = responseTimeSec + thinkTimeSec;
  const calculatedVU = Math.ceil(tps * totalIterationDuration);

  const k6Script = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: ${calculatedVU} }, // Ramp up to ${calculatedVU} VUs
    { duration: '3m', target: ${calculatedVU} }, // Steady state ${tps} TPS
    { duration: '30s', target: 0 },             // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<${Math.round(responseTimeSec * 1000 * 1.5)}'], // 95% under target SLA
    http_req_failed: ['rate<0.01'],             // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.qahub.internal/v1/checkout/quote');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(${thinkTimeSec});
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(k6Script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Performance Testing & Capacity Benchmarker
            </h1>
            <p className="text-xs text-slate-500">
              Calculate Virtual Users via Little's Law and generate k6 load testing configurations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-500" />
              <span>Little's Law Parameters</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Throughput (TPS / RPS)
              </label>
              <input
                type="number"
                value={tps}
                onChange={(e) => setTps(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Avg Response Time (Seconds)
              </label>
              <input
                type="number"
                step="0.05"
                value={responseTimeSec}
                onChange={(e) => setResponseTimeSec(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">{(responseTimeSec * 1000).toFixed(0)} ms latency</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                User Pacing / Think Time (Seconds)
              </label>
              <input
                type="number"
                step="0.1"
                value={thinkTimeSec}
                onChange={(e) => setThinkTimeSec(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-1">
              <div className="text-xs text-amber-800 dark:text-amber-300 font-semibold">Required Concurrent Virtual Users (VU)</div>
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{calculatedVU} VUs</div>
              <div className="text-[10px] text-slate-500">Formula: VU = TPS × (Response Time + Think Time)</div>
            </div>
          </div>

          {/* k6 Script */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Generated k6 Load Test Script</h3>
              <button
                onClick={copyScript}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy k6 Script'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 h-80">
              {k6Script}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
