import React, { useState } from 'react';
import { 
  SECURITY_FUNDAMENTALS, 
  COMMON_VULNERABILITIES, 
  OWASP_TOP_10_OVERVIEW 
} from '../data/securityTesting';
import { RememberCallout } from '../components/RememberCallout';
import { useLanguage } from '../context/LanguageContext';

export const SecurityTestingView: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeSubSection, setActiveSubSection] = useState('sec-fundamentals');

  const subSections = [
    { id: 'sec-7-1', hash: 'sec-fundamentals', title: t('7.1 Security Fundamentals', '7.1 Security Fundamentals') },
    { id: 'sec-7-2', hash: 'common-vulns', title: t('7.2 Common Vulnerabilities', '7.2 Common Vulnerabilities (QA Focus)') },
    { id: 'sec-7-3', hash: 'owasp-top-10', title: t('7.3 OWASP Top 10 Overview', '7.3 OWASP Top 10 Overview') },
    { id: 'sec-7-4', hash: 'qa-security-checklist', title: t('7.4 QA Security Checklist', '7.4 QA Security Checklist') }
  ];

  const scrollToSubSection = (hash: string) => {
    setActiveSubSection(hash);
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const whatIsText = language === 'hinglish' && SECURITY_FUNDAMENTALS.whatIsHinglish ? SECURITY_FUNDAMENTALS.whatIsHinglish : SECURITY_FUNDAMENTALS.whatIs;
  const whyQAText = language === 'hinglish' && SECURITY_FUNDAMENTALS.whyQAHinglish ? SECURITY_FUNDAMENTALS.whyQAHinglish : SECURITY_FUNDAMENTALS.whyQA;

  return (
    <div id="security-testing-view" className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Module 04", "Module 04")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("Security Testing Awareness for QA", "Security Testing Awareness for QA (Hinglish / English)")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {t(
            "Security awareness essentials for functional testers: Authentication vs Authorization, XSS, SQL Injection, IDOR, sensitive data protection, and OWASP Top 10.",
            "Functional testers ke liye basic security concepts: Authentication vs Authorization, XSS, SQL Injection, IDOR aur OWASP Top 10 risks."
          )}
        </p>
      </div>

      {/* 2-Column Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <aside className="lg:col-span-3 lg:sticky lg:top-20">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
              {t("Topics", "Topics")}
            </h3>
            <nav className="space-y-0.5 text-xs">
              {subSections.map((sec) => (
                <button
                  key={sec.id}
                  id={`toc-link-${sec.hash}`}
                  onClick={() => scrollToSubSection(sec.hash)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                    activeSubSection === sec.hash
                      ? 'bg-white text-indigo-700 font-semibold border border-slate-200 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {sec.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 max-w-3xl space-y-12">
          {/* 7.1 Fundamentals */}
          <section id="sec-fundamentals" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              7.1 {t("Security Testing Fundamentals", "Security Testing Fundamentals")}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed">
              {whatIsText}
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
              <strong className="text-slate-900">{t("Role of a Functional QA Tester:", "Functional QA Tester Ka Role:")}</strong>{' '}
              {whyQAText}
            </div>

            <h3 className="text-sm font-semibold text-slate-900 pt-2">{t("Five Core Pillars of Security:", "Five Core Pillars of Security:")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SECURITY_FUNDAMENTALS.corePillars.map((p) => {
                const desc = language === 'hinglish' && p.descHinglish ? p.descHinglish : p.desc;

                return (
                  <div key={p.title} className="p-3 border border-slate-200 rounded-lg space-y-1">
                    <strong className="text-slate-900 text-xs font-semibold block">{p.title}</strong>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>

            <RememberCallout 
              text="Client-side UI validation improves user experience, but ONLY server-side validation guarantees security."
              hinglishText="Client-side UI validation user experience accha karti hai, lekin ONLY server-side validation hi security guarantee karti hai."
            />
          </section>

          {/* 7.2 Common Vulnerabilities */}
          <section id="common-vulns" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              7.2 {t("Common Vulnerabilities (QA Focus)", "Common Vulnerabilities (QA Focus)")}
            </h2>

            <div className="space-y-4">
              {COMMON_VULNERABILITIES.map((vuln) => {
                const whatItMeans = language === 'hinglish' && vuln.whatItMeansHinglish ? vuln.whatItMeansHinglish : vuln.whatItMeans;
                const simpleExample = language === 'hinglish' && vuln.simpleExampleHinglish ? vuln.simpleExampleHinglish : vuln.simpleExample;
                const checks = language === 'hinglish' && vuln.whatQAShouldCheckHinglish ? vuln.whatQAShouldCheckHinglish : vuln.whatQAShouldCheck;

                return (
                  <div key={vuln.id} className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 text-sm">{vuln.name}</h3>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {vuln.id}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{whatItMeans}</p>
                    <div className="text-xs bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1.5">
                      <div>
                        <strong className="text-slate-800">{t("Example Scenario:", "Example Scenario:")}</strong>{' '}
                        <span className="font-mono text-slate-700">{simpleExample}</span>
                      </div>
                      <div>
                        <strong className="text-slate-800 block mb-0.5">{t("What QA Should Check:", "QA Ko Kya Check Karna Chahiye:")}</strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                          {checks.map((check, i) => (
                            <li key={i}>{check}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 7.3 OWASP Top 10 */}
          <section id="owasp-top-10" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              7.3 {t("OWASP Top 10 Overview", "OWASP Top 10 Overview")}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed">
              {t(
                "OWASP (Open Web Application Security Project) publishes the standard awareness document for developers and web application security risks.",
                "OWASP (Open Web Application Security Project) web application security risks aur vulnerabilities ka standard global awareness benchmark document publish karta hai."
              )}
            </p>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3 w-24">{t("Rank", "Rank")}</th>
                    <th className="p-3 w-48">{t("Category", "Category")}</th>
                    <th className="p-3">{t("Summary", "Summary")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {OWASP_TOP_10_OVERVIEW.map((item) => {
                    const desc = language === 'hinglish' && item.descHinglish ? item.descHinglish : item.desc;

                    return (
                      <tr key={item.rank} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-slate-800">{item.rank}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.name}</td>
                        <td className="p-3">{desc}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 7.4 QA Security Checklist */}
          <section id="qa-security-checklist" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              7.4 {t("Practical QA Security Checklist", "Practical QA Security Checklist")}
            </h2>

            <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-xs text-slate-700">
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                <li><strong>{t("Session Expiry:", "Session Expiry:")}</strong> {t("Verify token expires after logout and browser Back button does not show authenticated pages.", "Verify karein ki logout ke baad session token expire ho jata hai aur browser Back button dabane par secure pages nahi dikhte.")}</li>
                <li><strong>{t("Password Masking:", "Password Masking:")}</strong> {t("Verify passwords are masked with dots/asterisks on UI and never logged in plain-text API headers.", "Passwords UI par masked (dots) me hone chahiye aur backend logs ya API parameters me plain text me leak nahi hone chahiye.")}</li>
                <li><strong>{t("URL Parameter Tampering:", "URL Parameter Tampering (IDOR):")}</strong> {t("Change resource IDs in URLs (e.g. /order/1001 to /order/1002) to test for IDOR.", "URL me resource ID change karke (e.g. /order/1001 se /order/1002) check karein ki unauthorized data access to nahi ho raha.")}</li>
                <li><strong>{t("SQL Characters:", "SQL Injection Tests:")}</strong> {t("Enter single quotes ('), double quotes, and SQL keywords in search inputs to ensure no DB error traces are exposed.", "Search fields aur input boxes me single quotes (') aur SQL syntax daal kar check karein ki raw database errors screen par na dikhein.")}</li>
                <li><strong>{t("Cross-Site Scripting (XSS):", "Cross-Site Scripting (XSS):")}</strong> {t("Input test script tags like <script>alert(1)</script> into comment/text fields to verify HTML sanitization.", "Comment ya text fields me <script>alert(1)</script> input daal kar verify karein ki system script sanitize karta hai.")}</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
