import React from 'react';
import { NavSectionId } from '../types';
import { NAV_ITEMS } from '../data/navigation';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onSelectSection: (sectionId: NavSectionId, subSectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-slate-50 text-slate-600 pt-10 pb-8 border-t border-slate-200 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="font-bold text-slate-900 text-sm mb-1">
              QA Testing Learning Hub
            </div>
            <p className="text-slate-500 max-w-md">
              A distraction-free study resource for manual testing, API testing, automation basics, security testing, and interview preparation.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className="text-slate-600 hover:text-indigo-600 transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>
            Aligned with recognized industry testing standards and ISTQB concepts.
          </p>

          <button
            onClick={scrollToTop}
            id="back-to-top-btn"
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
