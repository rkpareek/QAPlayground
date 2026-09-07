import React, { useState, useMemo } from 'react';
import { QA_TERMINOLOGY } from '../data/terminology';
import { useLanguage } from '../context/LanguageContext';
import { Search } from 'lucide-react';

export const TerminologyView: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  const categories = [
    'All',
    'Requirement & Planning',
    'Testing Types',
    'Defects & Quality',
    'Agile & Process',
    'Metrics & Criteria'
  ];

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredTerms = useMemo(() => {
    return QA_TERMINOLOGY.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const termFirstLetter = item.term.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === 'All' || termFirstLetter === selectedLetter;
      
      const q = searchQuery.toLowerCase().trim();
      const defText = language === 'hinglish' && item.shortDefinitionHinglish ? item.shortDefinitionHinglish : item.shortDefinition;
      const exText = language === 'hinglish' && item.exampleHinglish ? item.exampleHinglish : (item.example || '');

      const matchesSearch =
        !q ||
        item.term.toLowerCase().includes(q) ||
        (item.abbreviation && item.abbreviation.toLowerCase().includes(q)) ||
        item.shortDefinition.toLowerCase().includes(q) ||
        defText.toLowerCase().includes(q) ||
        (item.example && item.example.toLowerCase().includes(q)) ||
        exText.toLowerCase().includes(q);

      return matchesCategory && matchesLetter && matchesSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory, selectedLetter, language]);

  return (
    <div id="terminology-view" className="py-8 max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Section 4.14 Glossary", "Section 4.14 Glossary")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("QA Terminology Dictionary", "QA Terminology Dictionary (50+ Terms)")}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            "Industry-standard definitions for 50+ software testing terms aligned with ISTQB standards and practical agile workflows.",
            "ISTQB standards aur practical agile testing par based 50+ essential QA terms ki definitions aur real-world examples."
          )}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="terminology-search-input"
            placeholder={t("Search terms (e.g. SRS, RTM, Defect Leakage, Retesting)...", "Terms search karein (e.g. SRS, RTM, Defect Leakage, Retesting)...")}
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

        {/* Alphabet quick jump */}
        <div className="flex flex-wrap gap-1 pt-1 overflow-x-auto text-[11px]">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`w-6 h-6 rounded flex items-center justify-center font-mono font-medium transition-colors ${
                selectedLetter === letter
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Table / List */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
            <tr>
              <th className="p-3 w-48">Term</th>
              <th className="p-3">Definition & Example</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-600">
            {filteredTerms.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-8 text-center text-slate-400">
                  {t("No QA terms found matching your search.", "Koi QA term nahi mila.")}
                </td>
              </tr>
            ) : (
              filteredTerms.map((item) => {
                const currentDef = language === 'hinglish' && item.shortDefinitionHinglish ? item.shortDefinitionHinglish : item.shortDefinition;
                const currentEx = language === 'hinglish' && item.exampleHinglish ? item.exampleHinglish : item.example;

                return (
                  <tr key={item.id} id={`term-${item.id}`} className="hover:bg-slate-50/50">
                    <td className="p-3 align-top">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 text-sm">{item.term}</div>
                        {item.abbreviation && (
                          <span className="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {item.abbreviation}
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400">{item.category}</div>
                      </div>
                    </td>
                    <td className="p-3 align-top space-y-2">
                      <p className="text-slate-700 leading-relaxed">{currentDef}</p>
                      {currentEx && (
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded text-[11px] text-slate-600">
                          <strong className="text-slate-800">{t("Example:", "Example:")}</strong>{' '}
                          <span className="italic">{currentEx}</span>
                        </div>
                      )}
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
