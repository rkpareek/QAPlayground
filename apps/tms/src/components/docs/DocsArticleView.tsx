import React from 'react';
import { DocArticle } from '../../docs/types';
import { DocsBreadcrumbs } from './DocsBreadcrumbs';
import { DocsCallout } from './DocsCallout';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsPrevNext } from './DocsPrevNext';
import { DocsTableOfContents } from './DocsTableOfContents';
import { getArticleBySlug, getPrevNextArticles } from '../../docs/docsRegistry';
import { Calendar, Clock, ArrowUpRight, HelpCircle, Workflow } from 'lucide-react';

interface Props {
  article: DocArticle;
  onNavigate: (slug: string) => void;
}

export const DocsArticleView: React.FC<Props> = ({ article, onNavigate }) => {
  const { prev, next } = getPrevNextArticles(article.slug);

  return (
    <div className="flex items-start gap-8 max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Main Content Pane */}
      <div className="flex-1 min-w-0 max-w-3xl">
        {/* Breadcrumbs */}
        <DocsBreadcrumbs article={article} onNavigate={onNavigate} />

        {/* Article Header */}
        <header className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {article.categoryTitle}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Updated {article.lastUpdated}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 4 min read
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {article.description}
          </p>
        </header>

        {/* Article Body */}
        <div className="py-6 space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {/* Overview Block */}
          {article.overview && (
            <div className="space-y-2">
              <h2 id="overview" className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Overview</span>
              </h2>
              <p className="leading-relaxed">{article.overview}</p>
            </div>
          )}

          {/* When to Use & How It Works Cards */}
          {(article.whenToUse || article.howItWorks) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {article.whenToUse && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    <HelpCircle className="w-4 h-4 text-indigo-500" />
                    <span>When to Use</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {article.whenToUse}
                  </p>
                </div>
              )}

              {article.howItWorks && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    <Workflow className="w-4 h-4 text-emerald-500" />
                    <span>How It Works</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {article.howItWorks}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Sections */}
          {article.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {section.title}
              </h2>

              {section.content && (
                <div className="whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">
                  {section.content}
                </div>
              )}

              {section.callout && <DocsCallout callout={section.callout} />}

              {section.codeSnippet && <DocsCodeBlock snippet={section.codeSnippet} />}

              {section.table && (
                <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700">
                        {section.table.headers.map((h, idx) => (
                          <th key={idx} className="p-3 font-bold uppercase tracking-wider text-[11px]">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                      {section.table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="p-3 font-medium text-slate-700 dark:text-slate-300">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.subsections && (
                <div className="space-y-4 pl-4 border-l border-slate-200 dark:border-slate-800 my-4">
                  {section.subsections.map((sub) => (
                    <div key={sub.id} id={sub.id} className="space-y-2">
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {sub.title}
                      </h3>
                      <div className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                        {sub.content}
                      </div>
                      {sub.callout && <DocsCallout callout={sub.callout} />}
                      {sub.codeSnippet && <DocsCodeBlock snippet={sub.codeSnippet} />}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Related Articles Cross-Linking */}
          {article.relatedSlugs && article.relatedSlugs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Related Documentation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {article.relatedSlugs.map((slug) => {
                  const target = getArticleBySlug(slug);
                  if (!target) return null;
                  return (
                    <button
                      key={slug}
                      onClick={() => onNavigate(slug)}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 truncate">
                          {target.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {target.categoryTitle}
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Previous / Next Navigation */}
          <DocsPrevNext prev={prev} next={next} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Right Sidebar Table of Contents */}
      <DocsTableOfContents sections={article.sections} />
    </div>
  );
};
