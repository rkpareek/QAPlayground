import React, { useState } from 'react';
import {
  Search,
  Rocket,
  LayoutDashboard,
  FolderGit2,
  CalendarRange,
  PlayCircle,
  Cpu,
  GitMerge,
  BarChart3,
  Bug,
  ShieldCheck,
  Settings,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { docCategories } from '../../docs/docsRegistry';

interface Props {
  onSelectArticle: (slug: string) => void;
  onOpenSearch: () => void;
}

export const DocsHome: React.FC<Props> = ({ onSelectArticle, onOpenSearch }) => {
  const [localQuery, setLocalQuery] = useState('');

  const getCategoryIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 shrink-0' };
    switch (iconName) {
      case 'Rocket':
        return <Rocket {...props} className="w-5 h-5 text-orange-500" />;
      case 'LayoutDashboard':
        return <LayoutDashboard {...props} className="w-5 h-5 text-blue-500" />;
      case 'FolderGit2':
        return <FolderGit2 {...props} className="w-5 h-5 text-emerald-500" />;
      case 'CalendarRange':
        return <CalendarRange {...props} className="w-5 h-5 text-indigo-500" />;
      case 'PlayCircle':
        return <PlayCircle {...props} className="w-5 h-5 text-cyan-500" />;
      case 'Cpu':
        return <Cpu {...props} className="w-5 h-5 text-purple-500" />;
      case 'GitMerge':
        return <GitMerge {...props} className="w-5 h-5 text-pink-500" />;
      case 'BarChart3':
        return <BarChart3 {...props} className="w-5 h-5 text-amber-500" />;
      case 'Bug':
        return <Bug {...props} className="w-5 h-5 text-rose-500" />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} className="w-5 h-5 text-teal-500" />;
      case 'Settings':
        return <Settings {...props} className="w-5 h-5 text-slate-500" />;
      default:
        return <BookOpen {...props} className="w-5 h-5 text-blue-500" />;
    }
  };

  const quickLinks = [
    { label: 'Core Concepts', slug: 'getting-started/introduction' },
    { label: 'Quick Add Test Case', slug: 'test-management/quick-add' },
    { label: 'Test Run Execution', slug: 'test-execution/test-runs' },
    { label: 'Playwright Spec Syntax', slug: 'automation/playwright' },
    { label: '@T Identifier Rules', slug: 'automation/test-ids' },
    { label: 'GitLab CI Integration', slug: 'ci-cd/gitlab' },
    { label: 'JUnit XML Ingestion', slug: 'ci-cd/xml-results' },
    { label: 'RBAC & Custom Roles', slug: 'users-access/roles-permissions' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Complete Product Manual & Technical Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Everything you need to plan, manage, automate, and analyze testing.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          Comprehensive developer guides, AST automation references, CI/CD result ingestion specifications, and enterprise governance workflows.
        </p>

        {/* Prominent Search Bar */}
        <div className="pt-2 max-w-xl mx-auto">
          <div
            onClick={onOpenSearch}
            className="flex items-center px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl shadow-md cursor-pointer transition-all gap-3 text-left"
          >
            <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-sm text-slate-400 flex-1">
              Search documentation (e.g. Playwright, @T########, GitLab, RBAC)...
            </span>
            <kbd className="px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded-md border border-slate-200 dark:border-slate-600 text-slate-500">
              Ctrl+K
            </kbd>
          </div>
        </div>

        {/* Quick Jump Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 pt-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Popular Topics:</span>
          {quickLinks.map((ql) => (
            <button
              key={ql.slug}
              onClick={() => onSelectArticle(ql.slug)}
              className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {ql.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Documentation Modules
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {docCategories.length} functional areas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {docCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400/60 dark:hover:border-blue-600/60 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-105 transition-transform">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">
                    {cat.articles.length} articles
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  {cat.articles.slice(0, 3).map((art) => (
                    <button
                      key={art.slug}
                      onClick={() => onSelectArticle(art.slug)}
                      className="w-full text-left text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-0.5 truncate flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span className="truncate">{art.title}</span>
                    </button>
                  ))}
                  {cat.articles.length > 3 && (
                    <span className="text-[10px] text-slate-400 italic pl-2.5">
                      +{cat.articles.length - 3} more articles
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button
                  onClick={() => onSelectArticle(cat.articles[0]?.slug || '')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                >
                  <span>Explore {cat.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
