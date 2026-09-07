import React from 'react';
import { NavSectionId } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSelectSection: (sectionId: NavSectionId, subSectionId?: string) => void;
  onOpenSearch: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectSection }) => {
  const { language, t } = useLanguage();

  const learningPath = [
    {
      step: '01',
      id: 'manual-testing' as NavSectionId,
      title: t('Manual Testing', 'Manual Testing Complete Guide'),
      desc: t(
        'Fundamentals, testing types, black-box techniques (EP, BVA), SDLC & STLC, test case design, bug life cycle, and severity vs priority.',
        'Fundamentals, testing types, black-box techniques (EP, BVA), SDLC aur STLC, test case design, bug life cycle aur severity vs priority.'
      )
    },
    {
      step: '02',
      id: 'api-testing' as NavSectionId,
      title: t('API Testing', 'API Testing & Postman Guide'),
      desc: t(
        'HTTP methods (GET, POST, PUT, DELETE), status codes (2xx, 4xx, 5xx), REST concepts, headers, and Postman test scripts.',
        'HTTP methods (GET, POST, PUT, DELETE), status codes (2xx, 4xx, 5xx), REST API concepts aur Postman test scripts.'
      )
    },
    {
      step: '03',
      id: 'automation' as NavSectionId,
      title: t('Automation Basics', 'Automation Testing & CI/CD Basics'),
      desc: t(
        'When to automate vs manual testing, tool overview (Selenium, Playwright), Page Object Model (POM), and CI/CD pipelines.',
        'Automation kab karni chahiye, modern tools (Playwright, Selenium), Page Object Model (POM) design pattern aur CI/CD pipelines.'
      )
    },
    {
      step: '04',
      id: 'security' as NavSectionId,
      title: t('Security Testing', 'Security Testing Awareness for QA'),
      desc: t(
        'Authentication vs Authorization, client vs server validation, OWASP Top 10 concepts (SQLi, XSS, IDOR).',
        'Authentication vs Authorization, client vs server validation, OWASP Top 10 vulnerabilities (SQLi, XSS, IDOR) aur QA checklist.'
      )
    },
    {
      step: '05',
      id: 'tools' as NavSectionId,
      title: t('QA Tools', 'Common QA Tools by Category'),
      desc: t(
        'Common tools in QA workflow: Jira, TestRail, Postman, Playwright, Jenkins, and Git.',
        'QA workflow ke top industry tools: Jira, TestRail, Postman, Playwright, Jenkins aur Git.'
      )
    },
    {
      step: '06',
      id: 'interview' as NavSectionId,
      title: t('Interview Questions', 'QA Interview Questions (50 Q&As)'),
      desc: t(
        'Curated 50 questions with concise answers and practical examples for 0–3 years QA experience.',
        '0–3 saal experience ke liye 50 curated interview questions with simple answers aur real-world examples.'
      )
    },
    {
      step: '07',
      id: 'terminology' as NavSectionId,
      title: t('QA Terminology Dictionary', 'QA Terminology Dictionary (50+ Terms)'),
      desc: t(
        '50+ essential testing terms (SRS, BRD, FRD, RTM, SIT, UAT, Smoke, Sanity, Defect Leakage, Defect Density).',
        '50+ essential QA testing terms (SRS, BRD, RTM, SIT, UAT, Smoke, Sanity, Defect Leakage, Defect Density).'
      )
    }
  ];

  return (
    <div id="home-view" className="py-10 max-w-3xl mx-auto px-4 sm:px-6">
      {/* Simple Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
          {t('QA Testing Learning Hub', 'QA Testing Learning Hub')}
        </h1>
        <p className="text-base text-slate-600 leading-relaxed mb-6">
          {t(
            "Simple learning resources for Manual Testing, API Testing, Automation Basics, Security Testing, and QA Interview preparation.",
            "Manual Testing, API Testing, Automation Basics, Security Testing aur Interview preparation ke liye simple, structured learning notes."
          )}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="start-manual-testing-btn"
            onClick={() => onSelectSection('manual-testing')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{t("Start Manual Testing", "Manual Testing Shuru Karein")}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="start-interview-btn"
            onClick={() => onSelectSection('interview')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium rounded-md transition-colors cursor-pointer"
          >
            <span>{t("50 Interview Questions", "50 Interview Questions")}</span>
          </button>
        </div>
      </div>

      {/* Learning Path */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
          {t("Learning Path", "Learning Path")}
        </h2>

        <div className="divide-y divide-slate-100 border-y border-slate-200">
          {learningPath.map((item) => (
            <div
              key={item.id}
              id={`path-item-${item.id}`}
              onClick={() => onSelectSection(item.id)}
              className="py-4 flex items-start gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group px-2 rounded-md"
            >
              <span className="font-mono text-sm font-semibold text-slate-400 group-hover:text-indigo-600 pt-0.5 w-6 shrink-0">
                {item.step}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                </div>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Note */}
      <div className="mt-12 p-4 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800 font-semibold">{t("How to study:", "Study Tip:")}</strong>{' '}
        {t(
          "Read the conceptual explanations, check the small practical examples, note the highlighted 'Remember' rules, and review the curated interview questions.",
          "Har topic ki simple explanation padhein, real-world example dekhein, 'Remember' rules note karein aur interview questions practice karein."
        )}
      </div>
    </div>
  );
};
