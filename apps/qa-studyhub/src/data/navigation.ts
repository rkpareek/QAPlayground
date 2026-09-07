import { NavSectionId } from '../types';

export interface NavItem {
  id: NavSectionId;
  label: string;
  shortLabel?: string;
  description: string;
  iconName: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Overview & Learning Roadmap',
    iconName: 'Home'
  },
  {
    id: 'manual-testing',
    label: 'Manual Testing',
    shortLabel: 'Manual',
    description: 'Fundamentals, Techniques, SDLC, STLC & Bug Life Cycle',
    iconName: 'ClipboardCheck',
    badge: 'Core'
  },
  {
    id: 'terminology',
    label: 'QA Terminology',
    shortLabel: 'Terminology',
    description: '50+ Industry & ISTQB Glossary Terms',
    iconName: 'BookOpen',
    badge: '50+ Terms'
  },
  {
    id: 'api-testing',
    label: 'API Testing',
    shortLabel: 'API',
    description: 'HTTP, Status Codes, CRUD & Postman Guide',
    iconName: 'Send'
  },
  {
    id: 'automation',
    label: 'Automation Basics',
    shortLabel: 'Automation',
    description: 'Fundamentals, Frameworks, POM & CI/CD',
    iconName: 'Cpu'
  },
  {
    id: 'security',
    label: 'Security Testing',
    shortLabel: 'Security',
    description: 'OWASP Top 10, XSS, SQLi, IDOR for QA',
    iconName: 'ShieldCheck'
  },
  {
    id: 'tools',
    label: 'QA Tools',
    shortLabel: 'Tools',
    description: 'Jira, TestRail, Postman, Playwright, Jenkins',
    iconName: 'Wrench'
  },
  {
    id: 'interview',
    label: 'Interview Questions',
    shortLabel: '50 QA Q&As',
    description: '50 Curated 2-3 Year QA Interview Questions',
    iconName: 'HelpCircle',
    badge: '50 Qs'
  }
];

export const LEARNING_PATH_STEPS = [
  {
    step: 1,
    title: 'Software Testing Basics',
    desc: 'What is testing, why we test, quality vs testing, Verification vs Validation, Error/Defect/Bug/Failure.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'what-is-software-testing'
  },
  {
    step: 2,
    title: 'Manual Testing Core',
    desc: 'Manual testing process, advantages, limitations, manual vs automation, real-world example.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'manual-testing-overview'
  },
  {
    step: 3,
    title: 'Testing Types & Levels',
    desc: 'Functional (Smoke, Sanity, Regression, Retesting) & Non-Functional (Performance, Usability, Security) & Levels (Unit, Integration, System, UAT).',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'testing-types'
  },
  {
    step: 4,
    title: 'Testing Techniques (Black-box)',
    desc: 'Equivalence Partitioning (EP), Boundary Value Analysis (BVA), Decision Tables, State Transitions, Error Guessing.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'testing-techniques'
  },
  {
    step: 5,
    title: 'SDLC & STLC',
    desc: 'Software Development & Testing Life Cycles, QA roles in each phase, Entry/Exit criteria, SDLC vs STLC.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'sdlc-stlc'
  },
  {
    step: 6,
    title: 'Test Cases & Documentation',
    desc: 'Test Scenarios vs Test Cases, login test case example, Positive/Negative testing, RTM.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'test-documentation'
  },
  {
    step: 7,
    title: 'Defects & Bug Life Cycle',
    desc: 'Bug life cycle states (New, Assigned, Open, Fixed, Retest, Verified, Closed), Severity vs Priority.',
    sectionId: 'manual-testing' as NavSectionId,
    hash: 'bug-lifecycle'
  },
  {
    step: 8,
    title: 'Agile & QA Terminology',
    desc: 'Scrum, User Stories, Acceptance Criteria, Definition of Done, 50+ essential QA dictionary terms.',
    sectionId: 'terminology' as NavSectionId,
    hash: 'terminology'
  },
  {
    step: 9,
    title: 'API Testing & Postman',
    desc: 'HTTP methods, 2xx/3xx/4xx/5xx status codes, API vs UI, Postman collections, environments, test scripts.',
    sectionId: 'api-testing' as NavSectionId,
    hash: 'api-basics'
  },
  {
    step: 10,
    title: 'Automation & CI/CD Basics',
    desc: 'When to automate vs not, Playwright & Selenium, POM framework architecture, CI/CD pipeline role.',
    sectionId: 'automation' as NavSectionId,
    hash: 'automation-basics'
  },
  {
    step: 11,
    title: 'Security Testing Basics',
    desc: 'XSS, SQLi, CSRF, Broken Access Control / IDOR, Client vs Server validation, OWASP Top 10.',
    sectionId: 'security' as NavSectionId,
    hash: 'security-basics'
  },
  {
    step: 12,
    title: '50 Interview Questions',
    desc: 'Test your understanding with 50 interview-ready accordion questions covering 2-3 years QA experience.',
    sectionId: 'interview' as NavSectionId,
    hash: 'interview-questions'
  }
];
