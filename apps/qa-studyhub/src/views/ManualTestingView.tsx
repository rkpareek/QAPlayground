import React, { useState } from 'react';
import { 
  SOFTWARE_TESTING_BASICS, 
  MANUAL_TESTING_OVERVIEW,
  FUNCTIONAL_TESTING_TYPES, 
  NON_FUNCTIONAL_TESTING_TYPES, 
  TESTING_TECHNIQUES,
  TEST_DOCUMENTATION_ITEMS,
  SDLC_PHASES,
  STLC_PHASES,
  SDLC_VS_STLC_COMPARISON,
  AGILE_SCRUM_ITEMS,
  CLIENT_VS_SERVER_VALIDATION
} from '../data/manualTesting';
import { RememberCallout } from '../components/RememberCallout';
import { InteractiveBVA } from '../components/InteractiveBVA';
import { InteractiveBugLifeCycle } from '../components/InteractiveBugLifeCycle';
import { InteractiveSeverityPriority } from '../components/InteractiveSeverityPriority';
import { InteractiveTestCaseViewer } from '../components/InteractiveTestCaseViewer';
import { NavSectionId, TestingTechniqueItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ManualTestingViewProps {
  onNavigateSection: (sectionId: NavSectionId, subSectionId?: string) => void;
}

export const ManualTestingView: React.FC<ManualTestingViewProps> = ({ onNavigateSection }) => {
  const { language, t } = useLanguage();
  const [activeSubSection, setActiveSubSection] = useState<string>('what-is-software-testing');

  const subSections = [
    { id: 'sec-4-1', hash: 'what-is-software-testing', title: t('What is Software Testing?', 'Software Testing Kya Hai?') },
    { id: 'sec-4-2', hash: 'manual-testing-overview', title: t('Manual Testing Overview', 'Manual Testing Overview') },
    { id: 'sec-4-3', hash: 'testing-types', title: t('Types of Testing', 'Testing Ke Types') },
    { id: 'sec-4-4', hash: 'testing-levels', title: t('Testing Levels (Unit to UAT)', 'Testing Levels (Unit se UAT)') },
    { id: 'sec-4-5', hash: 'testing-techniques', title: t('Testing Techniques (EP, BVA)', 'Testing Techniques (EP, BVA)') },
    { id: 'sec-4-6', hash: 'test-documentation', title: t('Test Documentation Flow', 'Test Documentation Flow') },
    { id: 'sec-4-7', hash: 'test-case-design', title: t('Test Case Design', 'Test Case Design Kaise Karein') },
    { id: 'sec-4-8', hash: 'sdlc-guide', title: t('SDLC & QA Role', 'SDLC aur QA Ka Role') },
    { id: 'sec-4-9', hash: 'stlc-guide', title: t('STLC & SDLC vs STLC', 'STLC aur SDLC vs STLC') },
    { id: 'sec-4-10', hash: 'agile-scrum', title: t('Agile & Scrum for QA', 'Agile & Scrum QA Ke Liye') },
    { id: 'sec-4-11', hash: 'defects-and-bugs', title: t('Error, Defect, Bug & Failure', 'Error, Defect, Bug aur Failure') },
    { id: 'sec-4-12', hash: 'bug-lifecycle', title: t('Bug Life Cycle', 'Bug Life Cycle') },
    { id: 'sec-4-13', hash: 'severity-vs-priority', title: t('Severity vs Priority', 'Severity vs Priority') },
    { id: 'sec-4-15', hash: 'validation-layers', title: t('Client vs Server Validation', 'Client vs Server Validation') }
  ];

  const scrollToSubSection = (hash: string) => {
    setActiveSubSection(hash);
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="manual-testing-view" className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Documentation Page Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          {t("Core Module 01", "Core Module 01")}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
          {t("Manual Testing Complete Guide", "Manual Testing Complete Guide (Hinglish / English)")}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          {t(
            "Fundamental principles, testing types, black-box design techniques, SDLC/STLC lifecycles, test cases, and defect management.",
            "Testing ke basic principles, functional/non-functional types, black-box techniques (EP, BVA), SDLC/STLC lifecycles aur defect management."
          )}
        </p>
      </div>

      {/* 2-Column Documentation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Simple Sidebar Navigation */}
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

            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => onNavigateSection('terminology')}
                className="w-full text-left px-2.5 py-1.5 text-xs text-indigo-600 font-medium hover:underline"
              >
                {t("→ QA Terminology Glossary", "→ QA Terminology Glossary")}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="lg:col-span-9 max-w-3xl space-y-12">
          {/* 4.1 What is Software Testing */}
          <section id="what-is-software-testing" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.1 {t("What is Software Testing?", "Software Testing Kya Hai?")}
            </h2>

            <div className="space-y-6">
              {SOFTWARE_TESTING_BASICS.map((item) => {
                const def = language === 'hinglish' && item.definitionHinglish ? item.definitionHinglish : item.definition;
                const ex = language === 'hinglish' && item.exampleHinglish ? item.exampleHinglish : item.example;
                const pts = language === 'hinglish' && item.keyPointsHinglish ? item.keyPointsHinglish : item.keyPoints;

                return (
                  <div key={item.id} className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{def}</p>

                    {pts && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                        {pts.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    )}

                    {ex && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                        <strong className="text-slate-900">{t("Example:", "Example:")}</strong> {ex}
                      </div>
                    )}

                    {item.remember && (
                      <RememberCallout text={item.remember} hinglishText={item.rememberHinglish} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4.2 Manual Testing Guide */}
          <section id="manual-testing-overview" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.2 {t("Manual Testing Fundamentals", "Manual Testing Fundamentals")}
            </h2>

            <div className="space-y-6">
              {MANUAL_TESTING_OVERVIEW.map((item) => {
                const def = language === 'hinglish' && item.definitionHinglish ? item.definitionHinglish : item.definition;
                const ex = language === 'hinglish' && item.exampleHinglish ? item.exampleHinglish : item.example;
                const pts = language === 'hinglish' && item.keyPointsHinglish ? item.keyPointsHinglish : item.keyPoints;

                return (
                  <div key={item.id} className="space-y-2">
                    <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-sm text-slate-700 leading-relaxed">{def}</p>

                    {pts && (
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600">
                        {pts.map((pt, idx) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    )}

                    {ex && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
                        <strong className="text-slate-900">{t("Example:", "Example:")}</strong> {ex}
                      </div>
                    )}

                    {item.remember && (
                      <RememberCallout text={item.remember} hinglishText={item.rememberHinglish} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4.3 Types of Testing */}
          <section id="testing-types" className="scroll-mt-20 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
              4.3 {t("Types of Testing (Functional & Non-Functional)", "Testing Ke Types (Functional aur Non-Functional)")}
            </h2>

            {/* Functional Testing */}
            <div>
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                1. {t("Functional Testing Types", "Functional Testing Types")}
              </h3>
              <div className="space-y-4">
                {FUNCTIONAL_TESTING_TYPES.map((tItem) => {
                  const def = language === 'hinglish' && tItem.definitionHinglish ? tItem.definitionHinglish : tItem.definition;
                  const why = language === 'hinglish' && tItem.whyUsedHinglish ? tItem.whyUsedHinglish : tItem.whyUsed;
                  const ex = language === 'hinglish' && tItem.exampleHinglish ? tItem.exampleHinglish : tItem.example;

                  return (
                    <div key={tItem.id} id={`type-${tItem.id}`} className="p-4 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 text-sm">{tItem.name}</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Functional
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{def}</p>
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded space-y-1">
                        <div><strong className="text-slate-800">{t("Why used:", "Kyun use hota hai:")}</strong> {why}</div>
                        <div><strong className="text-slate-800">{t("Example:", "Example:")}</strong> {ex}</div>
                      </div>
                      {tItem.remember && (
                        <RememberCallout text={tItem.remember} hinglishText={tItem.rememberHinglish} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Non-Functional Testing */}
            <div className="pt-4">
              <h3 className="text-base font-semibold text-slate-900 mb-3">
                2. {t("Non-Functional Testing Types", "Non-Functional Testing Types")}
              </h3>
              <div className="space-y-4">
                {NON_FUNCTIONAL_TESTING_TYPES.map((tItem) => {
                  const def = language === 'hinglish' && tItem.definitionHinglish ? tItem.definitionHinglish : tItem.definition;
                  const why = language === 'hinglish' && tItem.whyUsedHinglish ? tItem.whyUsedHinglish : tItem.whyUsed;
                  const ex = language === 'hinglish' && tItem.exampleHinglish ? tItem.exampleHinglish : tItem.example;

                  return (
                    <div key={tItem.id} id={`type-${tItem.id}`} className="p-4 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 text-sm">{tItem.name}</h4>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Non-Functional
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed">{def}</p>
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded space-y-1">
                        <div><strong className="text-slate-800">{t("Why used:", "Kyun use hota hai:")}</strong> {why}</div>
                        <div><strong className="text-slate-800">{t("Example:", "Example:")}</strong> {ex}</div>
                      </div>
                      {tItem.remember && (
                        <RememberCallout text={tItem.remember} hinglishText={tItem.rememberHinglish} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4.4 Testing Levels */}
          <section id="testing-levels" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.4 {t("Testing Levels (ISTQB Hierarchy)", "Testing Levels (ISTQB Hierarchy)")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Level", "Level")}</th>
                    <th className="p-3">{t("Testing Type", "Testing Type")}</th>
                    <th className="p-3">{t("Primary Responsibility", "Primary Responsibility")}</th>
                    <th className="p-3">{t("Scope", "Scope")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">Level 1</td>
                    <td className="p-3 font-semibold text-slate-900">Unit Testing</td>
                    <td className="p-3">{t("Developers", "Developers")}</td>
                    <td className="p-3">{t("Individual methods & isolated functions", "Individual methods aur isolated code functions")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">Level 2</td>
                    <td className="p-3 font-semibold text-slate-900">Integration Testing</td>
                    <td className="p-3">{t("QA / Developers", "QA / Developers")}</td>
                    <td className="p-3">{t("Interfaces and data exchange between modules", "Modules ke beech data flow aur communication interfaces")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">Level 3</td>
                    <td className="p-3 font-semibold text-slate-900">System Testing</td>
                    <td className="p-3">{t("QA Team", "QA Team")}</td>
                    <td className="p-3">{t("End-to-end full application against SRS", "SRS requirements ke against poori application ka end-to-end flow")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold text-slate-800">Level 4</td>
                    <td className="p-3 font-semibold text-slate-900">Acceptance Testing (UAT)</td>
                    <td className="p-3">{t("End Users / Client", "End Users / Client")}</td>
                    <td className="p-3">{t("Business readiness for production release", "Production release ke liye business readiness verification")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500">
              <strong>{t("Order of Execution:", "Execution Ka Order:")}</strong> Unit Testing → Integration Testing → System Testing → Acceptance Testing (UAT).
            </p>
          </section>

          {/* 4.5 Testing Techniques */}
          <section id="testing-techniques" className="scroll-mt-20 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
              4.5 {t("Black-Box Test Design Techniques", "Black-Box Test Design Techniques (EP, BVA, Decision Table)")}
            </h2>

            <div className="space-y-4">
              {TESTING_TECHNIQUES.map((tech: TestingTechniqueItem) => {
                const what = language === 'hinglish' && tech.whatItIsHinglish ? tech.whatItIsHinglish : tech.whatItIs;
                const when = language === 'hinglish' && tech.whenToUseHinglish ? tech.whenToUseHinglish : tech.whenToUse;
                const ex = language === 'hinglish' && tech.exampleHinglish ? tech.exampleHinglish : tech.example;

                return (
                  <div key={tech.id} id={`tech-${tech.id}`} className="p-4 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 text-sm">{tech.name}</h4>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {tech.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{what}</p>
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded space-y-1">
                      <div><strong className="text-slate-800">{t("When to use:", "Kab use karein:")}</strong> {when}</div>
                      <div><strong className="text-slate-800">{t("Example:", "Example:")}</strong> {ex}</div>
                    </div>
                    {tech.remember && (
                      <RememberCallout text={tech.remember} hinglishText={tech.rememberHinglish} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive BVA Tool */}
            <div className="pt-2">
              <InteractiveBVA />
            </div>
          </section>

          {/* 4.6 Test Documentation */}
          <section id="test-documentation" className="scroll-mt-20 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
              4.6 {t("Test Documentation & Traceability Flow", "Test Documentation aur Traceability Flow")}
            </h2>

            {/* Text Flow */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700">
              <strong className="text-slate-900 block mb-1">{t("Standard QA Workflow Flow:", "Standard QA Workflow Flow:")}</strong>
              <div className="font-mono text-[11px] text-slate-600 overflow-x-auto py-1">
                Requirement → Test Scenario → Test Case → Test Data → Execution → Result → Defect (if failed)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEST_DOCUMENTATION_ITEMS.map((doc, idx) => {
                const def = language === 'hinglish' && doc.definitionHinglish ? doc.definitionHinglish : doc.definition;
                const ex = language === 'hinglish' && doc.exampleHinglish ? doc.exampleHinglish : doc.example;

                return (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg space-y-1">
                    <h4 className="font-semibold text-slate-900 text-xs">{doc.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{def}</p>
                    <div className="text-[11px] font-mono bg-slate-50 p-2 rounded text-slate-700 border border-slate-100">
                      {ex}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4.7 Test Case Design & Example */}
          <section id="test-case-design" className="scroll-mt-20 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
              4.7 {t("Test Case Design & Example", "Test Case Design aur Examples")}
            </h2>

            <p className="text-sm text-slate-700 leading-relaxed">
              {t(
                "A standard test case includes: Test Case ID, Title, Pre-conditions, Step-by-Step Instructions, Test Data, Expected Result, Actual Result, Status, Severity, and Priority.",
                "Ek standard test case me: Test Case ID, Title, Pre-conditions, Step-by-Step Steps, Test Data, Expected Result, Actual Result, Status, Severity aur Priority hote hain."
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                <strong className="text-slate-900 block mb-1">{t("Positive Testing:", "Positive Testing:")}</strong>
                <p className="text-slate-600">
                  {t(
                    "Validates that application works properly with valid, expected inputs (Happy path).",
                    "Valid aur sahi inputs ke sath application expected behavior verify karna (Happy path)."
                  )}
                </p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                <strong className="text-slate-900 block mb-1">{t("Negative Testing:", "Negative Testing:")}</strong>
                <p className="text-slate-600">
                  {t(
                    "Validates that application handles invalid inputs gracefully with clear error messages.",
                    "Invalid ya galat inputs par application sahi error message deti hai aur crash nahi hoti."
                  )}
                </p>
              </div>
            </div>

            <InteractiveTestCaseViewer />
          </section>

          {/* 4.8 SDLC */}
          <section id="sdlc-guide" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.8 {t("Software Development Life Cycle (SDLC)", "Software Development Life Cycle (SDLC)")}
            </h2>

            <div className="space-y-3">
              {SDLC_PHASES.map((p, idx) => {
                const desc = language === 'hinglish' && p.descriptionHinglish ? p.descriptionHinglish : p.description;
                const qa = language === 'hinglish' && p.qaRoleHinglish ? p.qaRoleHinglish : p.qaRole;

                return (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">{p.phase}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                    </div>
                    <div className="sm:w-1/2 p-2.5 bg-slate-50 border border-slate-100 rounded text-xs text-slate-700">
                      <strong className="text-slate-900">{t("QA Role:", "QA Role:")}</strong> {qa}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4.9 STLC & Comparison */}
          <section id="stlc-guide" className="scroll-mt-20 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 pb-2 border-b border-slate-200">
              4.9 {t("Software Testing Life Cycle (STLC)", "Software Testing Life Cycle (STLC)")}
            </h2>

            <div className="space-y-3">
              {STLC_PHASES.map((st, idx) => {
                const act = language === 'hinglish' && st.activitiesHinglish ? st.activitiesHinglish : st.activities;
                const entry = language === 'hinglish' && st.entryCriteriaHinglish ? st.entryCriteriaHinglish : st.entryCriteria;
                const deliv = language === 'hinglish' && st.deliverablesHinglish ? st.deliverablesHinglish : st.deliverables;
                const exit = language === 'hinglish' && st.exitCriteriaHinglish ? st.exitCriteriaHinglish : st.exitCriteria;

                return (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900 text-sm">{st.phase}</h4>
                      <span className="text-[11px] font-mono text-slate-400">Step {idx + 1} of 6</span>
                    </div>
                    <p className="text-xs text-slate-600"><strong className="text-slate-800">{t("Activities:", "Activities:")}</strong> {act}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <strong className="text-slate-700 block text-[11px]">{t("Entry Criteria:", "Entry Criteria:")}</strong>
                        <span className="text-slate-600">{entry}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <strong className="text-slate-700 block text-[11px]">{t("Deliverables:", "Deliverables:")}</strong>
                        <span className="text-slate-600">{deliv}</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-100">
                        <strong className="text-slate-700 block text-[11px]">{t("Exit Criteria:", "Exit Criteria:")}</strong>
                        <span className="text-slate-600">{exit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SDLC vs STLC Comparison Table */}
            <div className="pt-2">
              <h3 className="text-base font-semibold text-slate-900 mb-3">{t("SDLC vs STLC Comparison", "SDLC vs STLC Comparison")}</h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                    <tr>
                      <th className="p-3">{t("Parameter", "Parameter")}</th>
                      <th className="p-3">SDLC</th>
                      <th className="p-3">STLC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    {SDLC_VS_STLC_COMPARISON.map((row, idx) => {
                      const sdlc = language === 'hinglish' && row.sdlcHinglish ? row.sdlcHinglish : row.sdlc;
                      const stlc = language === 'hinglish' && row.stlcHinglish ? row.stlcHinglish : row.stlc;

                      return (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-900">{row.parameter}</td>
                          <td className="p-3">{sdlc}</td>
                          <td className="p-3 font-medium text-indigo-900 bg-indigo-50/30">{stlc}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 4.10 Agile & Scrum */}
          <section id="agile-scrum" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.10 {t("Agile & Scrum for QA", "Agile & Scrum QA Ke Liye")}
            </h2>

            <div className="space-y-3">
              {AGILE_SCRUM_ITEMS.map((item, idx) => {
                const def = language === 'hinglish' && item.definitionHinglish ? item.definitionHinglish : item.definition;
                const qa = language === 'hinglish' && item.qaContextHinglish ? item.qaContextHinglish : item.qaContext;

                return (
                  <div key={idx} className="p-3.5 border border-slate-200 rounded-lg space-y-1.5">
                    <h4 className="font-semibold text-slate-900 text-sm">{item.term}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{def}</p>
                    <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                      <strong className="text-slate-900">{t("QA Context:", "QA Context:")}</strong> {qa}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4.11 Defects, Bugs & Errors */}
          <section id="defects-and-bugs" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.11 {t("Bug vs Defect vs Error vs Failure", "Bug vs Defect vs Error vs Failure Me Antar")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Term", "Term")}</th>
                    <th className="p-3">{t("Definition", "Definition")}</th>
                    <th className="p-3">{t("Concrete Example", "Real Example")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Error (Mistake)", "Error (Galti)")}</td>
                    <td className="p-3">{t("Human action made by developer, designer or tester producing an incorrect result.", "Developer ya kisi human se hui mistake jisse galat code ya design banta hai.")}</td>
                    <td className="p-3 font-mono text-[11px]">{t("Developer writes age > 18 instead of age >= 18.", "Developer ne age > 18 likha jabki requirement age >= 18 thi.")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Defect / Bug", "Defect / Bug")}</td>
                    <td className="p-3">{t("A flaw or discrepancy found in software code or design during development/testing.", "Testing ke dauraan code ya application me mili kami jo expected result se match nahi karti.")}</td>
                    <td className="p-3 font-mono text-[11px]">{t("Tester discovers an 18-year-old user is incorrectly denied signup.", "Tester ne paya ki 18 saal ka user signup nahi kar pa raha hai.")}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Failure", "Failure (System Crash)")}</td>
                    <td className="p-3">{t("The runtime manifestation of a defect where the system crashes or cannot perform its required function.", "Jab defect production ya runtime me live users ke samne trigger ho kar system crash ya fail kar deta hai.")}</td>
                    <td className="p-3 font-mono text-[11px]">{t("Live production payment API times out and user checkout aborts.", "Production par live payment API crash hui aur user checkout cancel ho gaya.")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4.12 Bug Life Cycle */}
          <section id="bug-lifecycle" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.12 {t("Bug Life Cycle", "Bug Life Cycle (Interactive Flow)")}
            </h2>
            <InteractiveBugLifeCycle />
          </section>

          {/* 4.13 Severity vs Priority */}
          <section id="severity-vs-priority" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.13 {t("Severity vs Priority Matrix", "Severity vs Priority Matrix")}
            </h2>
            <InteractiveSeverityPriority />
          </section>

          {/* 4.15 Client vs Server Validation */}
          <section id="validation-layers" className="scroll-mt-20">
            <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              4.15 {t("Client-Side vs Server-Side Validation", "Client-Side vs Server-Side Validation")}
            </h2>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase">
                  <tr>
                    <th className="p-3">{t("Feature", "Feature")}</th>
                    <th className="p-3">{CLIENT_VS_SERVER_VALIDATION.clientSide.title}</th>
                    <th className="p-3">{CLIENT_VS_SERVER_VALIDATION.serverSide.title}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Where it runs", "Kahan execute hota hai")}</td>
                    <td className="p-3">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.clientSide.whereHinglish ? CLIENT_VS_SERVER_VALIDATION.clientSide.whereHinglish : CLIENT_VS_SERVER_VALIDATION.clientSide.where}</td>
                    <td className="p-3">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.serverSide.whereHinglish ? CLIENT_VS_SERVER_VALIDATION.serverSide.whereHinglish : CLIENT_VS_SERVER_VALIDATION.serverSide.where}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Primary Purpose", "Primary Purpose")}</td>
                    <td className="p-3">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.clientSide.purposeHinglish ? CLIENT_VS_SERVER_VALIDATION.clientSide.purposeHinglish : CLIENT_VS_SERVER_VALIDATION.clientSide.purpose}</td>
                    <td className="p-3">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.serverSide.purposeHinglish ? CLIENT_VS_SERVER_VALIDATION.serverSide.purposeHinglish : CLIENT_VS_SERVER_VALIDATION.serverSide.purpose}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">{t("Security Rule", "Security Rule")}</td>
                    <td className="p-3 text-amber-800 bg-amber-50/40">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.clientSide.limitationHinglish ? CLIENT_VS_SERVER_VALIDATION.clientSide.limitationHinglish : CLIENT_VS_SERVER_VALIDATION.clientSide.limitation}</td>
                    <td className="p-3 font-medium text-emerald-800 bg-emerald-50/40">{language === 'hinglish' && CLIENT_VS_SERVER_VALIDATION.serverSide.ruleHinglish ? CLIENT_VS_SERVER_VALIDATION.serverSide.ruleHinglish : CLIENT_VS_SERVER_VALIDATION.serverSide.rule}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
