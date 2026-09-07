import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Play, 
  RotateCcw, 
  Lock, 
  Globe, 
  FileCode, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  Key,
  ShieldCheck,
  Terminal,
  Code
} from 'lucide-react';
import { ApiEndpointDef, MockApiResponse, ApiSessionState } from '../types';
import { MockServer } from '../mockServer';

interface ApiDetailPanelProps {
  endpoint: ApiEndpointDef;
  session: ApiSessionState;
  onEndpointExecuted: (endpointId: string) => void;
  onRefreshSession: () => void;
  onNavigateToEndpoint: (endpointId: string) => void;
}

export const ApiDetailPanel: React.FC<ApiDetailPanelProps> = ({
  endpoint,
  session,
  onEndpointExecuted,
  onRefreshSession,
  onNavigateToEndpoint,
}) => {
  // Active view tab: 'execute' | 'docs'
  const [activeTab, setActiveTab] = useState<'execute' | 'docs'>('execute');

  // Request state
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [bodyText, setBodyText] = useState<string>('');
  const [params, setParams] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<MockApiResponse | null>(null);
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // Initialize/reset form whenever selected endpoint changes
  useEffect(() => {
    resetToDefaults();
    setResponse(null);
  }, [endpoint.id]);

  const resetToDefaults = () => {
    // Populate headers
    const initialHeaders: Array<{ key: string; value: string }> = [];
    Object.entries(endpoint.defaultHeaders).forEach(([key, value]) => {
      // If endpoint requires auth and we have an active token, auto-fill it
      if (key.toLowerCase() === 'authorization' && session.activeToken) {
        initialHeaders.push({ key, value: session.activeToken });
      } else {
        initialHeaders.push({ key, value });
      }
    });
    setHeaders(initialHeaders);

    // Populate body
    if (endpoint.defaultBody) {
      setBodyText(JSON.stringify(endpoint.defaultBody, null, 2));
    } else {
      setBodyText('');
    }

    // Populate params
    if (endpoint.defaultParams) {
      setParams({ ...endpoint.defaultParams });
    } else {
      setParams({});
    }

    setJsonError(null);
  };

  // Quick helper to inject current active token
  const injectActiveToken = () => {
    if (!session.activeToken) return;
    const exists = headers.find(h => h.key.toLowerCase() === 'authorization');
    if (exists) {
      setHeaders(headers.map(h => 
        h.key.toLowerCase() === 'authorization' ? { ...h, value: session.activeToken! } : h
      ));
    } else {
      setHeaders([...headers, { key: 'Authorization', value: session.activeToken }]);
    }
  };

  // Quick helper to inject current reset token/code
  const injectActiveResetToken = () => {
    if (!session.lastResetToken) return;
    try {
      const current = bodyText ? JSON.parse(bodyText) : {};
      current.resetToken = session.lastResetToken;
      if (session.lastResetEmail) {
        current.email = session.lastResetEmail;
      }
      setBodyText(JSON.stringify(current, null, 2));
      setJsonError(null);
    } catch {
      // Ignore if body text is invalid JSON
    }
  };

  // Generate random data for Register testing
  const generateRandomUser = () => {
    const randomId = Math.floor(Math.random() * 900) + 100;
    const sample = {
      email: `tester_${randomId}@example.com`,
      username: `user_${randomId}`,
      password: 'SecurePassword123!',
      firstname: 'TestFirst',
      lastname: `User${randomId}`,
      gender: 'Female',
      age: 25,
    };
    setBodyText(JSON.stringify(sample, null, 2));
    setJsonError(null);
  };

  // Generate copyable cURL
  const getCurlCommand = (): string => {
    const headersObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) {
        headersObj[h.key.trim()] = h.value;
      }
    });

    let parsedBody: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        parsedBody = bodyText;
      }
    }

    return MockServer.generateCurl(
      endpoint.method,
      endpoint.endpoint,
      headersObj,
      parsedBody,
      params
    );
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlCommand());
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  // Execute API
  const handleExecute = async () => {
    setJsonError(null);
    let parsedBody: any = undefined;

    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && bodyText.trim()) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch (err: any) {
        setJsonError(`Invalid JSON in request body: ${err.message}`);
        return;
      }
    }

    const headersObj: Record<string, string> = {};
    headers.forEach(h => {
      if (h.key.trim()) {
        headersObj[h.key.trim()] = h.value;
      }
    });

    setIsLoading(true);
    try {
      const res = await MockServer.execute(
        endpoint.id,
        endpoint.method,
        endpoint.endpoint,
        headersObj,
        parsedBody,
        params
      );
      setResponse(res);
      onEndpointExecuted(endpoint.id);
      onRefreshSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Add / remove headers
  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, idx) => idx !== index));
  };

  const updateHeader = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...headers];
    updated[index][field] = val;
    setHeaders(updated);
  };

  // Format JSON helper
  const formatBodyJson = () => {
    try {
      const parsed = JSON.parse(bodyText);
      setBodyText(JSON.stringify(parsed, null, 2));
      setJsonError(null);
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  // Status color badge
  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (status >= 400 && status < 500) {
      return 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    }
    return 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
      
      {/* 1. Endpoint Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Method and Endpoint */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${
              endpoint.method === 'GET'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                : endpoint.method === 'POST'
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : endpoint.method === 'DELETE'
                ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300'
            }`}>
              {endpoint.method}
            </span>

            <code className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {endpoint.endpoint}
            </code>

            {/* Auth Required Badge */}
            {endpoint.requiresAuth ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                <Lock className="w-3 h-3 text-amber-600" />
                <span>Token Required</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                <Globe className="w-3 h-3 text-slate-500" />
                <span>Public Endpoint</span>
              </span>
            )}
          </div>

          {/* Action buttons: Copy cURL & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurl}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Copy complete cURL command to clipboard"
            >
              {copiedCurl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy cURL</span>
                </>
              )}
            </button>

            <button
              onClick={resetToDefaults}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs flex items-center gap-1 transition-colors"
              title="Reset request parameters, headers, and body back to standard sample"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Title and summary */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {endpoint.title}
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
            {endpoint.summary}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80 dark:border-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('execute')}
            className={`pb-1.5 pt-1 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'execute'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Try API / Execute</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`pb-1.5 pt-1 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Schema & Sample Response</span>
          </button>
        </div>
      </div>

      {/* 2. Main Body Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

        {/* TAB 1: TRY API (LIVE EXECUTION) */}
        {activeTab === 'execute' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* LEFT COLUMN: Request Configurator */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Request Parameters & Body</span>
                </h3>

                {endpoint.requiresAuth && (
                  <button
                    onClick={injectActiveToken}
                    disabled={!session.activeToken}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1"
                    title="Insert current active session Bearer token into headers"
                  >
                    <Key className="w-3 h-3" />
                    <span>Use Active Session Token</span>
                  </button>
                )}
              </div>

              {/* Path/Query Parameters if applicable */}
              {Object.keys(params).length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block uppercase">
                    Endpoint Parameters:
                  </span>
                  {Object.entries(params).map(([paramKey, paramVal]) => (
                    <div key={paramKey} className="flex items-center gap-2 text-xs">
                      <label className="font-mono font-semibold text-slate-700 dark:text-slate-300 w-24">
                        {paramKey}:
                      </label>
                      <input
                        type="text"
                        value={paramVal}
                        onChange={e => setParams({ ...params, [paramKey]: e.target.value })}
                        placeholder={`Enter ${paramKey}...`}
                        className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Headers Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Request Headers ({headers.length}):
                  </span>
                  <button
                    onClick={addHeader}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-medium flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add Header
                  </button>
                </div>

                <div className="space-y-1.5">
                  {headers.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="Header name"
                        value={h.key}
                        onChange={e => updateHeader(idx, 'key', e.target.value)}
                        className="w-1/3 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Value"
                        value={h.value}
                        onChange={e => updateHeader(idx, 'value', e.target.value)}
                        className="flex-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-indigo-500"
                      />
                      <button
                        onClick={() => removeHeader(idx)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove Header"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body (JSON) */}
              {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Request Body (JSON):
                    </span>

                    <div className="flex items-center gap-2 text-[11px]">
                      {endpoint.id === 'register-user' && (
                        <button
                          onClick={generateRandomUser}
                          className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 font-medium"
                          title="Generate a new randomized user payload"
                        >
                          <Sparkles className="w-3 h-3" /> Random User
                        </button>
                      )}

                      {endpoint.id === 'reset-password' && session.lastResetToken && (
                        <button
                          onClick={injectActiveResetToken}
                          className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 font-medium"
                          title="Paste active reset token from Forgot Password call"
                        >
                          <Key className="w-3 h-3" /> Insert Active Reset Token
                        </button>
                      )}

                      <button
                        onClick={formatBodyJson}
                        className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:underline"
                        title="Format JSON structure"
                      >
                        Format
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={bodyText}
                    onChange={e => {
                      setBodyText(e.target.value);
                      setJsonError(null);
                    }}
                    rows={8}
                    className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-lg border border-slate-800 focus:outline-hidden focus:border-indigo-500 leading-relaxed resize-y"
                    placeholder="Enter JSON request body..."
                  />

                  {jsonError && (
                    <div className="p-2.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{jsonError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Primary Execute Button */}
              <button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Executing Request...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Try API / Execute Request</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT COLUMN: Response Viewer & Inspector */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {response ? 'Live Response' : 'Sample Expected Response'}
                </h3>

                {response && (
                  <button
                    onClick={handleCopyResponse}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedResponse ? 'Copied' : 'Copy Response'}</span>
                  </button>
                )}
              </div>

              {response ? (
                /* ACTUAL LIVE RESPONSE */
                <div className="space-y-3">
                  {/* Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-medium">Status:</span>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${getStatusColor(response.status)}`}>
                        {response.status} {response.statusText}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                      <span>Time: <strong className="text-slate-800 dark:text-slate-200">{response.latencyMs} ms</strong></span>
                      <span>Content-Type: application/json</span>
                    </div>
                  </div>

                  {/* Contextual Success Alert */}
                  {response.status >= 200 && response.status < 300 && (
                    <>
                      {response.body?.token && (
                        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Session Authenticated!</strong> Bearer token has been automatically saved to your session. Protected endpoints will now work seamlessly.
                          </div>
                        </div>
                      )}

                      {response.body?.resetToken && (
                        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>Reset token generated! Code: <strong>{response.body.resetCode}</strong></span>
                          </div>
                          <button
                            onClick={() => onNavigateToEndpoint('reset-password')}
                            className="text-xs font-bold underline text-amber-900 dark:text-amber-200 flex items-center gap-1"
                          >
                            Switch to Reset Password <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* 401 Unauthorized Alert */}
                  {response.status === 401 && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Authentication Required (HTTP 401)</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        This protected endpoint rejected your request because the <code>Authorization: Bearer &lt;token&gt;</code> header was missing or invalid. Use the <strong>Login</strong> endpoint to obtain an active token, or click "Use Active Session Token" above.
                      </p>
                    </div>
                  )}

                  {/* JSON Response Body */}
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="px-3 py-1.5 bg-slate-900 text-slate-400 text-[10px] font-mono border-b border-slate-800 flex items-center justify-between">
                      <span>Response Payload (JSON)</span>
                      <span>{JSON.stringify(response.body).length} bytes</span>
                    </div>
                    <pre className="p-3.5 text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[380px]">
                      {JSON.stringify(response.body, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                /* SAMPLE RESPONSE PREVIEW */
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="text-slate-500">Expected Status:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded border text-xs ${getStatusColor(endpoint.sampleResponse.status)}`}>
                      {endpoint.sampleResponse.status} {endpoint.sampleResponse.statusText}
                    </span>
                  </div>

                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="px-3 py-1.5 bg-slate-900 text-slate-400 text-[10px] font-mono border-b border-slate-800">
                      Sample Expected Response
                    </div>
                    <pre className="p-3.5 text-xs font-mono text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed max-h-[380px]">
                      {JSON.stringify(endpoint.sampleResponse.body, null, 2)}
                    </pre>
                  </div>

                  <p className="text-[11px] text-slate-400 italic text-center">
                    Click "Try API / Execute Request" to send a live request to the mock server engine.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SCHEMA & SAMPLE RESPONSE */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Request Specifications */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Request Specifications
                </h3>
                
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">HTTP Method:</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">{endpoint.method}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Endpoint URL:</span>
                    <code className="font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded">
                      https://api.qatoolshub.io{endpoint.endpoint}
                    </code>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Authentication:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {endpoint.requiresAuth
                        ? '🔒 Required (Bearer Token in Authorization header)'
                        : '🌐 Public (No token required)'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Required Headers:</span>
                    <ul className="list-disc list-inside font-mono text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      {Object.entries(endpoint.defaultHeaders).map(([k, v]) => (
                        <li key={k}>
                          <strong>{k}</strong>: {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {endpoint.defaultBody && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Default Request Payload:
                    </span>
                    <pre className="p-3 bg-slate-950 text-slate-200 rounded font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify(endpoint.defaultBody, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              {/* Sample Response */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Sample Expected Response
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono border ${getStatusColor(endpoint.sampleResponse.status)}`}>
                    {endpoint.sampleResponse.status} {endpoint.sampleResponse.statusText}
                  </span>
                </div>

                <pre className="p-3 bg-slate-950 text-emerald-400 rounded font-mono text-[11px] overflow-x-auto max-h-[320px]">
                  {JSON.stringify(endpoint.sampleResponse.body, null, 2)}
                </pre>
              </div>
            </div>

            {/* Learning Notes & QA Exercises */}
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4.5 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>QA Learning & Testing Checklist</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400 block">
                    What to Test Here:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    {endpoint.learningNotes.qaTestCases.map((tc, idx) => (
                      <li key={idx}>{tc}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-rose-700 dark:text-rose-400 block">
                    Common Error Scenarios:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                    {endpoint.learningNotes.commonErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
