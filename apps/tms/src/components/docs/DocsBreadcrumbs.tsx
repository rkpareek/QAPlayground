import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { DocArticle } from '../../docs/types';

interface BreadcrumbsProps {
  article?: DocArticle;
  onNavigate: (slug: string) => void;
}

export const DocsBreadcrumbs: React.FC<BreadcrumbsProps> = ({ article, onNavigate }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4 flex-wrap">
      <button
        onClick={() => onNavigate('')}
        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Documentation</span>
      </button>

      {article && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-medium text-slate-600 dark:text-slate-300">
            {article.categoryTitle}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">
            {article.title}
          </span>
        </>
      )}
    </nav>
  );
};
