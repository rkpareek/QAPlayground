import React, { useState } from 'react';
import { QA_TOOLS_DATA } from '../data/qaTools';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ToolsView: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Test Management',
    'Defect Tracking',
    'API Testing',
    'Automation',
    'CI/CD',
    'Version Control'
  ];

  const filteredTools = QA_TOOLS_DATA.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const whatText = language === 'hinglish' && tool.whatItIsHinglish ? tool.whatItIsHinglish : tool.whatItIs;
    const qaText = language === 'hinglish' && tool.qaUsageHinglish ? tool.qaUsageHinglish : tool.qaUsage;
    const ideaText = language === 'hinglish' && tool.basicIdeaHinglish ? tool.basicIdeaHinglish : tool.basicIdea;

    const matchesSearch =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.whatItIs.toLowerCase().includes(q) ||
      whatText.toLowerCase().includes(q) ||
      tool.qaUsage.toLowerCase().includes(q) ||
      qaText.toLowerCase().includes(q) ||
      tool.basicIdea.toLowerCase().includes(q) ||
      ideaText.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div id="tools-view" className="py-8 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Module 05", "Module 05")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("Common QA Tools by Category", "Common QA Tools by Category (Hinglish / English)")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {t(
            "Overview of industry-standard tools for test management, defect tracking, API testing, automation, CI/CD, and version control.",
            "Test management, defect tracking, API testing, automation, CI/CD aur version control ke industry standard tools ka complete overview."
          )}
        </p>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="tools-search-input"
            placeholder={t("Search tools (e.g. Jira, Postman, Playwright, TestRail)...", "Tools search karein (e.g. Jira, Postman, Playwright, TestRail)...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Table / List */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
            <tr>
              <th className="p-3 w-36">{t("Tool", "Tool")}</th>
              <th className="p-3 w-32">{t("Category", "Category")}</th>
              <th className="p-3">{t("What it is & QA Usage", "What it is & QA Usage")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            {filteredTools.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-slate-400">
                  {t("No tools found matching your search.", "Aapke search query se koi tool nahi mila.")}
                </td>
              </tr>
            ) : (
              filteredTools.map((tool) => {
                const what = language === 'hinglish' && tool.whatItIsHinglish ? tool.whatItIsHinglish : tool.whatItIs;
                const qa = language === 'hinglish' && tool.qaUsageHinglish ? tool.qaUsageHinglish : tool.qaUsage;

                return (
                  <tr key={tool.name} className="hover:bg-slate-50/50">
                    <td className="p-3 align-top font-semibold text-slate-900">
                      {tool.name}
                      {tool.badge && (
                        <span className="block mt-1 w-fit text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {tool.badge}
                        </span>
                      )}
                    </td>
                    <td className="p-3 align-top">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {tool.category}
                      </span>
                    </td>
                    <td className="p-3 align-top space-y-1">
                      <p className="text-slate-700 leading-relaxed">{what}</p>
                      <p className="text-slate-500 text-[11px]">
                        <strong className="text-slate-700">{t("QA Usage:", "QA Usage:")}</strong> {qa}
                      </p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
