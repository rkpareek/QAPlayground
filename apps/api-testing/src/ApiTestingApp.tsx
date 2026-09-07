import React, { useState } from 'react';
import { Send, Play, Clock, CheckCircle2, Copy, Check, Terminal, Sparkles } from 'lucide-react';

export const ApiTestingApp: React.FC = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [url, setUrl] = useState('https://api.qahub.internal/v1/users/102');
  const [requestBody, setRequestBody] = useState('{\n  "role": "QA_LEAD",\n  "status": "ACTIVE"\n}');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>({
    status: 200,
    statusText: 'OK',
    latencyMs: 42,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-ratelimit-remaining': '99',
      'x-request-id': 'req-9842a-qa'
    },
    data: {
      id: 102,
      name: 'Alex Chen',
      email: 'alex.chen@qahub.internal',
      role: 'QA_LEAD',
      status: 'ACTIVE',
      teams: ['Automation-Core', 'Release-Gate'],
      updatedAt: '2026-09-01T09:45:00Z'
    }
  });

  const sendRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResponse({
        status: method === 'POST' ? 201 : method === 'DELETE' ? 204 : 200,
        statusText: method === 'POST' ? 'Created' : method === 'DELETE' ? 'No Content' : 'OK',
        latencyMs: Math.floor(Math.random() * 60) + 20,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-ratelimit-remaining': '98',
          'x-request-id': `req-${Math.random().toString(36).substring(2, 9)}`
        },
        data: method === 'DELETE' ? null : {
          id: 102,
          name: 'Alex Chen',
          email: 'alex.chen@qahub.internal',
          role: 'QA_LEAD',
          status: 'ACTIVE',
          actionTimestamp: new Date().toISOString()
        }
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-xs">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              API Testing Studio
            </h1>
            <p className="text-xs text-slate-500">
              Interactive HTTP REST request builder and JSON assertion tester
            </p>
          </div>
        </div>

        {/* URL Bar */}
        <div className="flex flex-col sm:flex-row gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-0 focus:ring-2 focus:ring-cyan-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 px-4 py-2 text-xs font-mono bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
          />

          <button
            onClick={sendRequest}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isLoading ? 'Sending...' : 'Send Request'}</span>
          </button>
        </div>

        {/* Request & Response Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Body */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">Request Payload (JSON)</h3>
            <textarea
              rows={12}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none"
            />
          </div>

          {/* Response Inspector */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">Response Body & Headers</h3>
              {response && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold">
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {response.latencyMs}ms
                  </span>
                </div>
              )}
            </div>

            <pre className="p-3 font-mono text-xs rounded-xl bg-slate-950 text-slate-200 border border-slate-800 overflow-x-auto h-64">
              {JSON.stringify(response?.data, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
