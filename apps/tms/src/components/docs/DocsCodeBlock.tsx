import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { DocCodeSnippet } from '../../docs/types';

interface Props {
  snippet: DocCodeSnippet;
}

export const DocsCodeBlock: React.FC<Props> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-4 rounded-xl border border-slate-700/60 bg-slate-900 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="font-mono uppercase font-semibold text-[11px] text-slate-400 ml-2">
            {snippet.language}
          </span>
          {snippet.caption && (
            <span className="text-slate-500 text-[11px] border-l border-slate-800 pl-2">
              {snippet.caption}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px] font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-100 selection:bg-blue-600 selection:text-white">
        <pre className="whitespace-pre">{snippet.code}</pre>
      </div>
    </div>
  );
};
