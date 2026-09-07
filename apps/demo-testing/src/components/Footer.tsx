import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bug, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Terminal, RefreshCw } from 'lucide-react';
import { PageType } from '../types';

export const Footer: React.FC = () => {
  const { setCurrentPage, resetAllData, openQADrawerToTab, foundBugCodes, knownBugs } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Top Testing Sandbox Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Software Tester's Sandbox
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  15 Deliberate QA Defects
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Practice exploratory testing, boundary analysis, form validation, and professional Jira bug reporting.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openQADrawerToTab('bugs')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
              id="footer-open-bugs-btn"
            >
              <Bug className="w-4 h-4" />
              <span>Inspect All 15 Bugs ({foundBugCodes.length}/15)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all cart items, orders, test reports, and bug progress back to defaults?')) {
                  resetAllData();
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
              id="footer-reset-data-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Test Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Bug className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                BugCraft QA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An interactive test automation and manual testing platform built to educate software quality assurance engineers, SDETs, and developers on real-world edge cases.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Designed for QA Training & Interviews</span>
            </div>
          </div>

          {/* Col 2: Exploration Areas */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Application Modules
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Product Catalog & Filters
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('cart');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Shopping Cart & Discount Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('checkout');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Checkout & Payment Validation
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('login');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Authentication & Password Masking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  User Profile & Order History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: QA Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              QA Learning Hub
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('blog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  How to Write a 5-Star Bug Report
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    openQADrawerToTab('guide');
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Boundary Value Analysis Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('qa-dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Bug Export (Markdown / JSON)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Feedback & Support Form
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter / QA Updates */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              QA Test Challenge
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Subscribe to test newsletter updates or try finding bugs in our forms!
            </p>
            {newsletterSubscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Thanks for subscribing to QA updates!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    placeholder="tester@domain.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                    id="newsletter-email-input"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                    id="newsletter-submit-btn"
                  >
                    Join
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Tip: Test inputs with whitespace, symbols, or empty spaces.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 BugCraft QA Playground. Built for testing practice and QA learning.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Environment Active
            </span>
            <span>v2.4.0-qa-build</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
