import React, { useState, useMemo } from 'react';
import { QA_INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { useLanguage } from '../context/LanguageContext';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Copy, 
  Check 
} from 'lucide-react';

export const InterviewView: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const categories = [
    'All',
    'Manual Testing',
    'API Testing',
    'Automation Basics',
    'Security Testing'
  ];

  const filteredQuestions = useMemo(() => {
    return QA_INTERVIEW_QUESTIONS.filter((q) => {
      const matchesCat = selectedCategory === 'All' || q.category === selectedCategory;
      const cleanQ = searchQuery.toLowerCase().trim();
      const answerText = language === 'hinglish' && q.answerHinglish ? q.answerHinglish : q.answer;
      const exampleText = language === 'hinglish' && q.exampleHinglish ? q.exampleHinglish : (q.example || '');
      
      const matchesSearch =
        !cleanQ ||
        q.question.toLowerCase().includes(cleanQ) ||
        q.answer.toLowerCase().includes(cleanQ) ||
        answerText.toLowerCase().includes(cleanQ) ||
        (q.example && q.example.toLowerCase().includes(cleanQ)) ||
        exampleText.toLowerCase().includes(cleanQ) ||
        q.tags.some((t) => t.toLowerCase().includes(cleanQ));

      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory, language]);

  const toggleQuestion = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredQuestions.map((q) => q.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const copyQuestionAnswer = (q: typeof QA_INTERVIEW_QUESTIONS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const answer = language === 'hinglish' && q.answerHinglish ? q.answerHinglish : q.answer;
    const example = language === 'hinglish' && q.exampleHinglish ? q.exampleHinglish : q.example;
    const textToCopy = `Q: ${q.question}\n\nA: ${answer}${example ? `\n\nExample: ${example}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="interview-view" className="py-8 max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          Module 06
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("QA Interview Questions", "QA Interview Questions (50 Q&As)")}
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t(
            "50 curated interview questions with concise answers and practical examples for 0–3 years experience.",
            "0–3 saal experience ke liye 50 curated QA interview questions with clear answers aur practical examples."
          )}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            id="interview-search-input"
            placeholder={t("Search questions (e.g. Severity, Regression, Postman, BVA)...", "Questions search karein (e.g. Severity, Regression, Postman, BVA)...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm focus:outline-indigo-500"
          />
        </div>

        {/* Category Pills & Expand/Collapse Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
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

          <div className="flex items-center gap-3 text-xs text-indigo-600">
            <button onClick={expandAll} className="hover:underline font-medium cursor-pointer">
              {t("Expand All", "Sab Kholein")}
            </button>
            <span className="text-slate-300">|</span>
            <button onClick={collapseAll} className="hover:underline font-medium cursor-pointer">
              {t("Collapse All", "Sab Band Karein")}
            </button>
          </div>
        </div>
      </div>

      {/* Question Accordions (Clean List) */}
      <div className="border border-slate-200 rounded-lg divide-y divide-slate-200 overflow-hidden bg-white">
        {filteredQuestions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            {t("No interview questions match your search query.", "Aapke search query se koi question match nahi hua.")}
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedIds.has(q.id);
            const answer = language === 'hinglish' && q.answerHinglish ? q.answerHinglish : q.answer;
            const example = language === 'hinglish' && q.exampleHinglish ? q.exampleHinglish : q.example;

            return (
              <div key={q.id} id={`q-${q.id}`} className="transition-colors">
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full text-left p-4 flex items-start justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="font-mono text-xs font-semibold text-slate-400 pt-0.5 w-6 shrink-0">
                      {q.id < 10 ? `0${q.id}` : q.id}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 leading-snug">
                      {q.question}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-block">
                      {q.category}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 pl-13 text-sm text-slate-700 bg-slate-50/50 space-y-3 border-t border-slate-100">
                    <p className="leading-relaxed whitespace-pre-line">
                      {answer}
                    </p>

                    {example && (
                      <div className="p-3 bg-white border border-slate-200 rounded text-xs text-slate-700">
                        <strong className="text-slate-900 block mb-0.5">
                          {t("Practical Example:", "Real-World Example:")}
                        </strong>
                        <span className="italic text-slate-600">{example}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <div className="flex flex-wrap gap-1">
                        {q.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => copyQuestionAnswer(q, e)}
                        className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
                        title="Copy Question and Answer"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-medium">{t("Copied", "Copied")}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t("Copy", "Copy")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
