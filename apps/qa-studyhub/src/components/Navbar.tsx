import React, { useState } from 'react';
import { NavSectionId } from '../types';
import { NAV_ITEMS } from '../data/navigation';
import { useLanguage } from '../context/LanguageContext';
import { Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentSection: NavSectionId;
  onSelectSection: (sectionId: NavSectionId, subSectionId?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onSelectSection,
  onOpenSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Home Link */}
          <div
            id="brand-logo-btn"
            onClick={() => onSelectSection('home')}
            className="flex items-center gap-2 cursor-pointer font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>QA Learning</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectSection(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.shortLabel || item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Switcher, Search Trigger & Mobile Hamburger */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div 
              id="language-switcher-container"
              className="flex items-center bg-slate-100 p-0.5 rounded-md text-xs border border-slate-200"
            >
              <button
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                id="lang-btn-hinglish"
                onClick={() => setLanguage('hinglish')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  language === 'hinglish'
                    ? 'bg-white text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Hinglish"
              >
                Hinglish
              </button>
            </div>

            {/* Search Trigger */}
            <button
              id="header-search-trigger-btn"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs border border-slate-200 transition-colors cursor-pointer"
              title={t("Search QA topics (Cmd+K)", "QA topics search karein (Cmd+K)")}
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-500">{t("Search", "Search")}</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  onSelectSection(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
