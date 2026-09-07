import React, { useState } from 'react';
import { 
  Search, 
  Lock, 
  Globe, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ApiEndpointDef, HttpMethod } from '../types';

interface ApiSidebarProps {
  endpoints: ApiEndpointDef[];
  selectedEndpointId: string;
  onSelectEndpoint: (id: string) => void;
  executedEndpoints: string[];
}

export const ApiSidebar: React.FC<ApiSidebarProps> = ({
  endpoints,
  selectedEndpointId,
  onSelectEndpoint,
  executedEndpoints,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getMethodBadge = (method: HttpMethod) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'POST':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'PUT':
      case 'PATCH':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'DELETE':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const filtered = endpoints.filter(ep => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      ep.title.toLowerCase().includes(q) ||
      ep.endpoint.toLowerCase().includes(q) ||
      ep.method.toLowerCase().includes(q) ||
      ep.category.toLowerCase().includes(q)
    );
  });

  const categories = Array.from(new Set(endpoints.map(ep => ep.category)));

  return (
    <aside className="w-full lg:w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shrink-0 shadow-2xs">
      {/* Header & Search */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mock API Directory</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {executedEndpoints.length}/{endpoints.length} tested
          </span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter APIs by name or path..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Endpoints List grouped by category */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4 max-h-[calc(100vh-280px)] lg:max-h-none">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No APIs match "{searchQuery}"
          </div>
        ) : (
          categories.map(category => {
            const groupEndpoints = filtered.filter(ep => ep.category === category);
            if (groupEndpoints.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {category}
                </div>

                <div className="space-y-1">
                  {groupEndpoints.map(ep => {
                    const isSelected = selectedEndpointId === ep.id;
                    const hasExecuted = executedEndpoints.includes(ep.id);

                    return (
                      <button
                        key={ep.id}
                        onClick={() => onSelectEndpoint(ep.id)}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start gap-2.5 group relative ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {/* Method Badge */}
                        <span
                          className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${getMethodBadge(
                            ep.method
                          )}`}
                        >
                          {ep.method}
                        </span>

                        {/* Title & Path */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`font-semibold truncate block text-xs ${
                                isSelected
                                  ? 'text-indigo-950 dark:text-indigo-100'
                                  : 'text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {ep.title}
                            </span>
                            
                            {/* Auth Icon */}
                            {ep.requiresAuth ? (
                              <span title="Requires Bearer Token" className="shrink-0 text-amber-500">
                                <Lock className="w-3 h-3" />
                              </span>
                            ) : (
                              <span title="Public API (No Token Required)" className="shrink-0 text-slate-300 dark:text-slate-600">
                                <Globe className="w-3 h-3" />
                              </span>
                            )}
                          </div>

                          <div className="font-mono text-[11px] text-slate-400 truncate mt-0.5">
                            {ep.endpoint}
                          </div>
                        </div>

                        {/* Execution Indicator */}
                        {hasExecuted && (
                          <span title="Tested in this session" className="shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-amber-500" /> = Token Required
        </span>
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-slate-400" /> = Public
        </span>
      </div>
    </aside>
  );
};
