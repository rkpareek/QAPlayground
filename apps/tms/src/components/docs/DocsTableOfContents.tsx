import React, { useEffect, useState } from 'react';
import { DocSection } from '../../docs/types';
import { AlignLeft } from 'lucide-react';

interface Props {
  sections: DocSection[];
}

export const DocsTableOfContents: React.FC<Props> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = sections
        .map((s) => document.getElementById(s.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + 120;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(el.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="w-56 shrink-0 hidden xl:block sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pl-4 border-l border-slate-200 dark:border-slate-800 text-xs">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 text-[11px] mb-3">
        <AlignLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span>On this page</span>
      </div>

      <nav className="space-y-1">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="block w-full text-left py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          Overview
        </button>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className={`block w-full text-left py-1 truncate transition-colors ${
              activeId === section.id
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title={section.title}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  );
};
