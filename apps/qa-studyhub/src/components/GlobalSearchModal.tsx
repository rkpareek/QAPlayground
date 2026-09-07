import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, BookOpen, HelpCircle, Wrench, Send, ShieldCheck, Cpu, ClipboardCheck } from 'lucide-react';
import { NavSectionId, SearchResultItem } from '../types';
import { QA_TERMINOLOGY } from '../data/terminology';
import { QA_INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { QA_TOOLS_DATA } from '../data/qaTools';
import { HTTP_STATUS_CODES } from '../data/apiTesting';
import { FUNCTIONAL_TESTING_TYPES, NON_FUNCTIONAL_TESTING_TYPES, TESTING_TECHNIQUES, SOFTWARE_TESTING_BASICS } from '../data/manualTesting';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: NavSectionId, subSectionId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable index
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // Terminology
    QA_TERMINOLOGY.forEach((term) => {
      items.push({
        title: term.term + (term.abbreviation ? ` (${term.abbreviation})` : ''),
        section: 'terminology',
        subSectionId: `term-${term.id}`,
        category: `Terminology • ${term.category}`,
        snippet: term.shortDefinition,
        type: 'term'
      });
    });

    // Interview Questions
    QA_INTERVIEW_QUESTIONS.forEach((q) => {
      items.push({
        title: `Q#${q.id}: ${q.question}`,
        section: 'interview',
        subSectionId: `q-${q.id}`,
        category: `Interview • ${q.category}`,
        snippet: q.answer,
        type: 'question'
      });
    });

    // Tools
    QA_TOOLS_DATA.forEach((tool) => {
      items.push({
        title: tool.name,
        section: 'tools',
        subSectionId: `tool-${tool.id}`,
        category: `QA Tools • ${tool.category}`,
        snippet: tool.whatItIs,
        type: 'tool'
      });
    });

    // Testing types
    [...FUNCTIONAL_TESTING_TYPES, ...NON_FUNCTIONAL_TESTING_TYPES].forEach((t) => {
      items.push({
        title: t.name,
        section: 'manual-testing',
        subSectionId: `type-${t.id}`,
        category: `Testing Types • ${t.category}`,
        snippet: t.definition,
        type: 'type'
      });
    });

    // Testing Techniques
    TESTING_TECHNIQUES.forEach((tech) => {
      items.push({
        title: tech.name,
        section: 'manual-testing',
        subSectionId: `tech-${tech.id}`,
        category: `Testing Techniques • ${tech.type}`,
        snippet: tech.whatItIs,
        type: 'concept'
      });
    });

    // Status codes
    HTTP_STATUS_CODES.forEach((sc) => {
      items.push({
        title: `HTTP ${sc.code} ${sc.name}`,
        section: 'api-testing',
        subSectionId: `status-${sc.code}`,
        category: `API Testing • ${sc.category}`,
        snippet: `${sc.description} QA Check: ${sc.qaCheck}`,
        type: 'concept'
      });
    });

    // Software Testing Basics
    SOFTWARE_TESTING_BASICS.forEach((b) => {
      items.push({
        title: b.title,
        section: 'manual-testing',
        subSectionId: b.id,
        category: 'Manual Testing Basics',
        snippet: b.definition,
        type: 'concept'
      });
    });

    return items;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return allSearchItems.slice(0, 8); // default suggestions
    }
    const cleanQ = query.toLowerCase().trim();
    return allSearchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(cleanQ) ||
        item.snippet.toLowerCase().includes(cleanQ) ||
        item.category.toLowerCase().includes(cleanQ)
    ).slice(0, 20);
  }, [allSearchItems, query]);

  if (!isOpen) return null;

  const getIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'term':
        return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case 'question':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'tool':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'type':
        return <ClipboardCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <Send className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div
      id="global-search-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-10 pt-16 sm:pt-20 animate-fade-in"
      onClick={onClose}
    >
      <div
        id="global-search-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="global-search-input"
            placeholder="Search concepts, STLC, Severity, BVA, Postman, XSS, 50 QA Q&As..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded-md font-mono hover:bg-slate-300 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 flex-wrap text-xs text-slate-600">
          <span className="font-semibold text-slate-500 mr-1">Popular:</span>
          {['STLC', 'Regression', 'Severity vs Priority', 'BVA', 'Postman', 'XSS', 'RTM', 'Verification'].map(
            (tag) => (
              <button
                key={tag}
                id={`search-quick-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setQuery(tag)}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-100 flex-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-slate-700">No matching QA topics found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for terms like "Smoke", "Jira", "Status 401", or "Equivalence"</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <button
                key={`${item.section}-${item.subSectionId || idx}`}
                id={`search-result-item-${idx}`}
                onClick={() => {
                  onNavigate(item.section, item.subSectionId);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-indigo-50/60 transition-colors group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-indigo-100 transition-colors shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0 self-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0.5" />
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Search across 50+ Terms, 50 Interview Q&As, Tools, and Guides</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
