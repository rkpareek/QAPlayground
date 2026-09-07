import React, { useState } from 'react';
import { HTTP_STATUS_CODES } from '../data/apiTesting';
import { Search, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const InteractiveStatusCodeFinder: React.FC = () => {
  const { language, t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', '2xx Success', '3xx Redirection', '4xx Client Error', '5xx Server Error'];

  const filteredCodes = HTTP_STATUS_CODES.filter((item) => {
    const matchesCat = filterCategory === 'All' || item.category === filterCategory;
    const descText = language === 'hinglish' && item.descriptionHinglish ? item.descriptionHinglish : item.description;
    const checkText = language === 'hinglish' && item.qaCheckHinglish ? item.qaCheckHinglish : item.qaCheck;

    const matchesSearch =
      item.code.toString().includes(searchQuery) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qaCheck.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (cat: string) => {
    if (cat.startsWith('2xx')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (cat.startsWith('3xx')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (cat.startsWith('4xx')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  };

  return (
    <div id="interactive-status-code-finder" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs my-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">{t("Interactive HTTP Status Code & QA Validation Guide", "Interactive HTTP Status Code & QA Validation Guide")}</h4>
            <p className="text-xs text-slate-500">{t("Search any code to view exact status meaning and QA verification expectations.", "Kisi bhi status code ko search karein aur uska exact meaning aur QA verification expectations dekhein.")}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="status-code-search"
            placeholder={t("Search code (e.g. 401, 204, 500) or keyword...", "Code search karein (e.g. 401, 204, 500) ya keyword...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`status-cat-btn-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Status Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
        {filteredCodes.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs">
            {t(`No status codes matching "${searchQuery}"`, `"${searchQuery}" se koi status code nahi mila.`)}
          </div>
        ) : (
          filteredCodes.map((item) => {
            const desc = language === 'hinglish' && item.descriptionHinglish ? item.descriptionHinglish : item.description;
            const qa = language === 'hinglish' && item.qaCheckHinglish ? item.qaCheckHinglish : item.qaCheck;

            return (
              <div
                key={item.code}
                id={`status-${item.code}`}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm px-2 py-0.5 rounded-md bg-slate-900 text-white">
                        {item.code}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadge(item.category)}`}>
                      {item.category.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                    {desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-indigo-900 bg-indigo-50/50 p-2 rounded-lg">
                  <span className="font-semibold text-indigo-950">{t("QA Validation:", "QA Validation:")}</span> {qa}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
