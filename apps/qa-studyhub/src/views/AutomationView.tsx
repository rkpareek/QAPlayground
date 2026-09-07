import React, { useState } from 'react';
import { 
  AUTOMATION_FUNDAMENTALS, 
  WHAT_TO_AUTOMATE_MATRIX, 
  AUTOMATION_TOOLS_LIST, 
  FRAMEWORK_COMPONENTS, 
  CICD_FOR_QA 
} from '../data/automationTesting';
import { RememberCallout } from '../components/RememberCallout';
import { useLanguage } from '../context/LanguageContext';

export const AutomationView: React.FC = () => {
  const { language, t } = useLanguage();
  const [activeSubSection, setActiveSubSection] = useState('auto-fundamentals');

  const subSections = [
    { id: 'sec-6-0', hash: 'auto-fundamentals', title: t('6.0 Automation Fundamentals', '6.0 Automation Fundamentals') },
    { id: 'sec-6-1', hash: 'when-to-automate', title: t('6.1 When to Automate vs Not', '6.1 Kab Automate Karein vs Kab Nahi') },
    { id: 'sec-6-2', hash: 'top-tools', title: t('6.2 Modern Automation Tools', '6.2 Top Automation Tools Overview') },
    { id: 'sec-6-3', hash: 'pom-architecture', title: t('6.3 Page Object Model (POM)', '6.3 Page Object Model (POM)') },
    { id: 'sec-6-4', hash: 'cicd-role', title: t('6.4 CI/CD Pipeline for QA', '6.4 CI/CD Pipeline QA Ke Liye') }
  ];

  const scrollToSubSection = (hash: string) => {
    setActiveSubSection(hash);
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const whatIsText = language === 'hinglish' && AUTOMATION_FUNDAMENTALS.whatIsHinglish ? AUTOMATION_FUNDAMENTALS.whatIsHinglish : AUTOMATION_FUNDAMENTALS.whatIs;
  const advantagesList = language === 'hinglish' && AUTOMATION_FUNDAMENTALS.advantagesHinglish ? AUTOMATION_FUNDAMENTALS.advantagesHinglish : AUTOMATION_FUNDAMENTALS.advantages;
  const limitationsList = language === 'hinglish' && AUTOMATION_FUNDAMENTALS.limitationsHinglish ? AUTOMATION_FUNDAMENTALS.limitationsHinglish : AUTOMATION_FUNDAMENTALS.limitations;

  return (
    <div id="automation-view" className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Module 03", "Module 03")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("Automation Testing & CI/CD Basics", "Automation Testing & CI/CD Basics (Hinglish / English)")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {t(
            "Understanding automation principles, when to automate vs manual testing, modern test runners (Playwright, Selenium), Page Object Model (POM), and CI/CD workflows.",
            "Automation ke basic concepts, automation vs manual testing decision, modern tools (Playwright, Selenium), Page Object Model (POM) design pattern aur CI/CD pipelines."
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
          {/* 6.0 Fundamentals */}
          <section id="auto-fundamentals" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              6.0 {t("Automation Testing Fundamentals", "Automation Testing Fundamentals")}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed">
              {whatIsText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <strong className="text-slate-900 block font-semibold">{t("Key Advantages:", "Key Advantages:")}</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {advantagesList.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
                <strong className="text-slate-900 block font-semibold">{t("Key Limitations:", "Key Limitations:")}</strong>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  {limitationsList.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>

            <RememberCallout 
              text="Automation does not replace manual testing; it executes repetitive regression tests so manual testers can focus on exploratory and edge-case testing."
              hinglishText="Automation manual testing ko replace nahi karta; yeh repetitive regression tests chalata hai taaki manual testers exploratory aur edge-case testing par focus kar sakein."
            />
          </section>

          {/* 6.1 When to Automate */}
          <section id="when-to-automate" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              6.1 {t("When to Automate vs When NOT to Automate", "Kab Automate Karein vs Kab Automate Na Karein")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WHAT_TO_AUTOMATE_MATRIX.map((grp, idx) => {
                const catName = language === 'hinglish' && grp.categoryHinglish ? grp.categoryHinglish : grp.category;
                const itemsList = language === 'hinglish' && grp.itemsHinglish ? grp.itemsHinglish : grp.items;

                return (
                  <div key={idx} className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{catName}</h3>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                      {itemsList.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 6.2 Top Tools */}
          <section id="top-tools" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              6.2 {t("Top Automation Tools Overview", "Top Automation Tools Overview")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Tool", "Tool")}</th>
                    <th className="p-3">{t("Languages", "Languages")}</th>
                    <th className="p-3">{t("What it is & Main Use", "What it is & Main Use")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  {AUTOMATION_TOOLS_LIST.map((tool) => {
                    const what = language === 'hinglish' && tool.whatItIsHinglish ? tool.whatItIsHinglish : tool.whatItIs;
                    const main = language === 'hinglish' && tool.mainUseHinglish ? tool.mainUseHinglish : tool.mainUse;

                    return (
                      <tr key={tool.name} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900 align-top">
                          {tool.name}
                          <div className="text-[10px] text-slate-400 font-normal">{tool.creator}</div>
                        </td>
                        <td className="p-3 font-mono text-[11px] align-top">{tool.languages}</td>
                        <td className="p-3 align-top space-y-1">
                          <p>{what}</p>
                          <p className="text-slate-500 text-[11px]"><strong>{t("Main use:", "Main use:")}</strong> {main}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 6.3 Page Object Model */}
          <section id="pom-architecture" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              6.3 {t("Page Object Model (POM) Design Pattern", "Page Object Model (POM) Design Pattern")}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed">
              {t(
                "Page Object Model (POM) is an industry-standard design pattern where each web page is represented as a separate class. Web elements (locators) and user actions (methods) are stored in page classes, while test assertion logic stays in test files.",
                "Page Object Model (POM) ek standard design pattern hai jisme har web page ko ek separate class banaya jata hai. UI web elements (locators) aur actions (click/type methods) page class me rehte hain, aur test assertions test script files me rehte hain."
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FRAMEWORK_COMPONENTS.map((comp, i) => {
                const roleText = language === 'hinglish' && comp.roleHinglish ? comp.roleHinglish : comp.role;

                return (
                  <div key={i} className="p-3 border border-slate-200 rounded-lg space-y-1">
                    <h4 className="font-semibold text-slate-900 text-xs">{comp.name}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{roleText}</p>
                  </div>
                );
              })}
            </div>

            <RememberCallout 
              text="POM reduces test maintenance: when a UI locator changes, you only update it once in the Page class, rather than across dozens of individual test files."
              hinglishText="POM test maintenance aasan banata hai: jab koi UI element locator change hota hai, to bas ek baar Page class me update karna hota hai, har test file me nahi."
            />
          </section>

          {/* 6.4 CI/CD */}
          <section id="cicd-role" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-3 pb-2 border-b border-slate-200">
              6.4 {t("CI/CD Pipeline Role for QA", "CI/CD Pipeline Role QA Ke Liye")}
            </h2>

            <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <p><strong>{t("Continuous Integration (CI):", "Continuous Integration (CI):")}</strong> {language === 'hinglish' && CICD_FOR_QA.whatIsCIHinglish ? CICD_FOR_QA.whatIsCIHinglish : CICD_FOR_QA.whatIsCI}</p>
              <p><strong>{t("Continuous Delivery (CD):", "Continuous Delivery (CD):")}</strong> {language === 'hinglish' && CICD_FOR_QA.whatIsCDHinglish ? CICD_FOR_QA.whatIsCDHinglish : CICD_FOR_QA.whatIsCD}</p>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg space-y-2 bg-slate-50 text-xs">
              <strong className="text-slate-900 block font-semibold">{t("QA Roles in the CI/CD Pipeline:", "CI/CD Pipeline Me QA Ka Role:")}</strong>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {(language === 'hinglish' && CICD_FOR_QA.qaPipelineRoleHinglish ? CICD_FOR_QA.qaPipelineRoleHinglish : CICD_FOR_QA.qaPipelineRole).map((role, idx) => (
                  <li key={idx}>{role}</li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
