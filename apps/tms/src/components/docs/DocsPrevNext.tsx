import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DocArticle } from '../../docs/types';

interface Props {
  prev: DocArticle | null;
  next: DocArticle | null;
  onNavigate: (slug: string) => void;
}

export const DocsPrevNext: React.FC<Props> = ({ prev, next, onNavigate }) => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {prev ? (
        <button
          onClick={() => onNavigate(prev.slug)}
          className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all text-left group"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1 group-hover:text-blue-600">
            <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" /> Previous
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
            {prev.title}
          </span>
          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {prev.categoryTitle}
          </span>
        </button>
      ) : (
        <div />
      )}

      {next ? (
        <button
          onClick={() => onNavigate(next.slug)}
          className="flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all text-right group sm:items-end"
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1 group-hover:text-blue-600">
            Next <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1">
            {next.title}
          </span>
          <span className="text-xs text-slate-500 line-clamp-1 mt-0.5">
            {next.categoryTitle}
          </span>
        </button>
      ) : (
        <div />
      )}
    </div>
  );
};
