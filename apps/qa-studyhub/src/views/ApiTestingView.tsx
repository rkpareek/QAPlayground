import React, { useState } from 'react';
import { 
  HTTP_METHODS_DATA, 
  API_TESTING_CONCEPTS, 
  POSTMAN_CORE_CONCEPTS,
  SAMPLE_POSTMAN_TEST_SCRIPT 
} from '../data/apiTesting';
import { InteractiveStatusCodeFinder } from '../components/InteractiveStatusCodeFinder';
import { RememberCallout } from '../components/RememberCallout';
import { Copy, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ApiTestingView: React.FC = () => {
  const { language, t } = useLanguage();
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState('api-basics');

  const subSections = [
    { id: 'sec-5-1', hash: 'api-basics', title: t('5.1 API Fundamentals', '5.1 API Testing Fundamentals') },
    { id: 'sec-5-2', hash: 'http-methods', title: t('5.2 HTTP Methods (CRUD)', '5.2 HTTP Methods (CRUD Operations)') },
    { id: 'sec-5-3', hash: 'status-codes', title: t('5.3 Status Codes Reference', '5.3 Status Codes Reference') },
    { id: 'sec-5-4', hash: 'api-vs-ui', title: t('5.4 API vs UI Testing', '5.4 API Testing vs UI Testing') },
    { id: 'sec-5-5', hash: 'postman-guide', title: t('5.5 Postman Test Assertions', '5.5 Postman Test Script') }
  ];

  const scrollToSubSection = (hash: string) => {
    setActiveSubSection(hash);
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(SAMPLE_POSTMAN_TEST_SCRIPT);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div id="api-testing-view" className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Module 02", "Module 02")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("API Testing & Postman Guide", "API Testing & Postman Guide (Hinglish / English)")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {t(
            "HTTP communication, RESTful principles, status code categories, request/response headers, schema validation, and Postman test scripts.",
            "HTTP communication, REST API principles, status codes, request/response headers, schema validation aur Postman test scripts."
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
          {/* 5.1 API Fundamentals */}
          <section id="api-basics" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              5.1 {t("API Testing Fundamentals", "API Testing Fundamentals")}
            </h2>

            <div className="space-y-4">
              {API_TESTING_CONCEPTS.map((item, idx) => {
                const desc = language === 'hinglish' && item.descriptionHinglish ? item.descriptionHinglish : item.description;

                return (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                    <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 5.2 HTTP Methods */}
          <section id="http-methods" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              5.2 {t("HTTP Methods (CRUD Operations)", "HTTP Methods (CRUD Operations)")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Method", "Method")}</th>
                    <th className="p-3">{t("Description", "Description")}</th>
                    <th className="p-3">{t("Idempotent?", "Idempotent?")}</th>
                    <th className="p-3">{t("Example", "Example")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {HTTP_METHODS_DATA.map((m) => {
                    const desc = language === 'hinglish' && m.descriptionHinglish ? m.descriptionHinglish : m.description;
                    const idemp = m.idempotent === 'Yes' ? t('Yes (Idempotent)', 'Haan (Idempotent)') : t('No (Non-Idempotent)', 'Nahi (Non-Idempotent)');

                    return (
                      <tr key={m.method} className="hover:bg-slate-50/50">
                        <td className="p-3 font-mono font-bold text-indigo-700">{m.method}</td>
                        <td className="p-3">{desc}</td>
                        <td className="p-3 font-medium text-slate-800">{idemp}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-600">{m.example}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <RememberCallout 
              text="GET and DELETE are idempotent (calling them 10 times yields the same server state), whereas POST is not idempotent." 
              hinglishText="GET aur DELETE idempotent hote hain (10 baar call karne par bhi server state same rehti hai), jabki POST idempotent nahi hota (har call naya record banata hai)."
            />
          </section>

          {/* 5.3 Status Codes */}
          <section id="status-codes" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              5.3 {t("HTTP Status Codes Reference", "HTTP Status Codes Reference")}
            </h2>
            <InteractiveStatusCodeFinder />
          </section>

          {/* 5.4 API vs UI Testing */}
          <section id="api-vs-ui" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              5.4 {t("API Testing vs UI Testing", "API Testing vs UI Testing")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Factor", "Factor")}</th>
                    <th className="p-3">{t("API Testing", "API Testing")}</th>
                    <th className="p-3">{t("UI Testing", "UI Testing")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Execution Speed", "Execution Speed")}</td>
                    <td className="p-3 text-emerald-700 font-medium">{t("Very Fast (~100ms per call)", "Bahut Fast (~100ms per API call)")}</td>
                    <td className="p-3">{t("Slower (~3-10s per browser action)", "Slow (~3-10s per browser action)")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Test Stability", "Test Stability")}</td>
                    <td className="p-3 text-emerald-700 font-medium">{t("High (immune to UI layout changes)", "High (UI layout badalne par bhi test fail nahi hota)")}</td>
                    <td className="p-3">{t("Medium/Low (flaky due to DOM / locator changes)", "Medium/Low (DOM ya element locator badalne se test flaky ho jate hain)")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Early Testing", "Early Testing")}</td>
                    <td className="p-3">{t("Can start as soon as backend endpoints exist", "Backend endpoint bante hi test start ho sakti hai")}</td>
                    <td className="p-3">{t("Requires full frontend design & deployment", "Poora frontend design aur integrate hone ka wait karna padta hai")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Focus", "Focus")}</td>
                    <td className="p-3">{t("Business logic, data integrity, security", "Business logic, database integrity aur backend security")}</td>
                    <td className="p-3">{t("User experience, visual rendering, end-to-end flow", "User experience, UI visual appearance aur browser workflow")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5.5 Postman Guide */}
          <section id="postman-guide" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              5.5 {t("Postman Core Concepts & Assertion Script", "Postman Core Concepts & Assertion Script")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {POSTMAN_CORE_CONCEPTS.map((c, i) => {
                const detail = language === 'hinglish' && c.detailHinglish ? c.detailHinglish : c.detail;

                return (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg space-y-1">
                    <h4 className="font-semibold text-slate-900 text-xs">{c.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{detail}</p>
                  </div>
                );
              })}
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-slate-700">Sample Postman Test Script (pm.test)</span>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? t('Copied', 'Copied') : t('Copy', 'Copy')}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed">
                {SAMPLE_POSTMAN_TEST_SCRIPT}
              </pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
