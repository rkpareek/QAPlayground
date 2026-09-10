export interface ToolMetadata {
  id: string;
  name: string;
  description: string;
  category: 'Core Management' | 'Knowledge & Learning' | 'Practice & Sandboxes' | 'Automation & Code' | 'Performance & API';
  path: string;
  icon: string;
  color: 'indigo' | 'emerald' | 'blue' | 'purple' | 'amber' | 'cyan' | 'rose' | 'teal';
  tags: string[];
  status: 'active' | 'beta' | 'new';
  version: string;
  features: string[];
  docsPath?: string;
}

export const TOOLS_REGISTRY: ToolMetadata[] = [
  {
    id: 'tms',
    name: 'Test Management System',
    description: 'Enterprise test management suite with project workspaces, hierarchical test suites, execution runs, defect triage, requirements traceability matrix, and QA velocity analytics.',
    category: 'Core Management',
    path: '/tms',
    icon: 'CheckSquare',
    color: 'indigo',
    tags: ['Test Cases', 'Suites', 'Executions', 'Defects', 'RTM Matrix', 'Analytics'],
    status: 'active',
    version: '2.4.0',
    features: [
      'Project Workspaces & Test Suite Trees',
      'Execution Runs with Step-by-Step Status Tracking',
      'Defect Management with Severity & Triage Workflow',
      'Requirements Traceability Matrix (RTM)',
      'Pass/Fail Velocity & Burndown Analytics',
      'Test Case Export & Markdown Generation'
    ]
  },
  {
    id: 'qa-studyhub',
    name: 'QA Study Hub & Knowledge Base',
    description: 'Comprehensive interactive learning portal and certification reference covering Manual Testing techniques (BVA, ECP), REST API Testing, Selenium WebDriver, CI/CD Quality Gates, and QA Interview mastery.',
    category: 'Knowledge & Learning',
    path: '/qa-studyhub',
    icon: 'GraduationCap',
    color: 'emerald',
    tags: ['Manual QA', 'API Testing', 'Selenium', 'CI/CD', 'Interview Prep', 'Cheat Sheets'],
    status: 'active',
    version: '3.1.0',
    features: [
      'Interactive Boundary Value & Equivalence Partitioning Calculators',
      'HTTP Status Codes & REST Architectural Principles Guide',
      'Selenium & Cypress Code Snippet Repository',
      'CI/CD Pipeline Quality Gate Architecture',
      '150+ Curated QA Engineering Interview Questions & Answers',
      'Searchable Quick-Reference Cheat Sheets'
    ]
  },
  {
    id: 'demo-testing',
    name: 'QA Demo Testing Sandbox',
    description: 'Full-featured mock e-commerce web application with realistic test scenarios, simulated edge cases, intentional defects, dynamic cart calculation, and real-time Bug Hunter inspector.',
    category: 'Practice & Sandboxes',
    path: '/demo-testing',
    icon: 'ShoppingBag',
    color: 'blue',
    tags: ['E-Commerce', 'Bug Hunting', 'Exploratory QA', 'Checkout Flow', 'DOM Sandbox'],
    status: 'active',
    version: '2.0.0',
    features: [
      'Full Product Catalog with Filtering & Sorting',
      'Shopping Cart & Multi-Step Checkout Sandbox',
      'Simulated User Authentication & Session States',
      'Interactive "Bug Hunter Mode" DOM Inspector',
      'Intentional Edge Cases & Form Validation Scenarios',
      'Console & Network Activity Logger'
    ]
  },
  {
    id: 'apis',
    name: 'API Testing Playground',
    description: 'Interactive beginner-friendly mock API testing sandbox with user registration, JWT Bearer authentication, password recovery/reset flows, and profile management.',
    category: 'Performance & API',
    path: '/apis',
    icon: 'Terminal',
    color: 'indigo',
    tags: ['Mock REST API', 'Auth Token', 'Register', 'Login', 'Profile', 'cURL Generator', 'QA Learning'],
    status: 'new',
    version: '1.0.0',
    features: [
      'Interactive Mock REST API with Live Response Viewer',
      'Register, Login, Password Reset, and User Profile CRUD',
      'Token-Based Authorization Header Validation',
      'One-Click Copy cURL Command Generator',
      'Session-Persistent User Database with Live State Inspector',
      'QA Test Case Scenarios & Common Error Code Guides'
    ]
  },
  {
    id: 'api-testing',
    name: 'API Testing Studio',
    description: 'Visual REST API client to construct HTTP requests, inspect headers, simulate mock payloads, validate JSON schema assertions, and verify response latency.',
    category: 'Performance & API',
    path: '/api-testing',
    icon: 'Send',
    color: 'cyan',
    tags: ['REST API', 'HTTP Client', 'JSON Validator', 'Headers', 'Mock Endpoints'],
    status: 'active',
    version: '1.8.0',
    features: [
      'Interactive Request Builder (GET, POST, PUT, DELETE, PATCH)',
      'Pre-configured QA Mock Endpoints & Sample Payloads',
      'Custom Headers & Query Parameter Configurator',
      'JSON Response Beautifier & Status Code Analyzer',
      'Response Time & Header Inspection',
      'Automated Assertion Rules Check'
    ]
  },
  {
    id: 'automation',
    name: 'Automation Playground & Code Generator',
    description: 'Multi-framework test automation code generator and Page Object Model builder for Playwright, Selenium WebDriver (Java/Python), and Cypress.',
    category: 'Automation & Code',
    path: '/automation',
    icon: 'Code2',
    color: 'purple',
    tags: ['Playwright', 'Selenium', 'Cypress', 'POM Builder', 'Locator Generator'],
    status: 'active',
    version: '2.1.0',
    features: [
      'Multi-Framework Code Generator (Playwright, Selenium, Cypress)',
      'Page Object Model (POM) Boilerplate Creator',
      'CSS Selector & XPath Syntax Builder & Validator',
      'Cross-Browser Assertion Template Engine',
      'Copy-to-Clipboard & File Export'
    ]
  },
  {
    id: 'performance-testing',
    name: 'Performance Testing & Capacity Benchmarker',
    description: 'Calculates Virtual Users (VU), Target Throughput (TPS), and Response Times based on Little\'s Law, with load testing configuration generators for k6, JMeter, and Locust.',
    category: 'Performance & API',
    path: '/performance-testing',
    icon: 'Gauge',
    color: 'amber',
    tags: ["Little's Law", 'TPS to VU', 'k6 Script Gen', 'JMeter', 'Latency Planner'],
    status: 'active',
    version: '1.5.0',
    features: [
      'Interactive Little\'s Law VU Calculator (VU = TPS × Response Time)',
      'Pacing & Think Time Delay Estimator',
      'Instant Load Profile Config Generator for k6, JMeter & Locust',
      'Concurrency vs. Throughput Curve Matrix',
      'Performance SLA Validation Checklist'
    ]
  },
  {
    id: 'test-data',
    name: 'Synthetic Test Data Generator',
    description: 'Generates structured synthetic QA test datasets, user profiles, payment cards (Luhn-valid test numbers), localized addresses, and security boundary test strings.',
    category: 'Automation & Code',
    path: '/test-data',
    icon: 'Database',
    color: 'rose',
    tags: ['Synthetic Data', 'Boundary Strings', 'Mock Users', 'JSON/CSV', 'Luhn Generator'],
    status: 'active',
    version: '1.6.0',
    features: [
      'Bulk User Profile Generator (Name, Email, Phone, UUID, Role)',
      'Security & Boundary Value String Library (SQLi, XSS, Unicode, Max Int)',
      'Luhn Algorithm Compliant Test Card Generator',
      'Export to JSON, CSV, and SQL INSERT formats',
      'Custom Field Schema Designer'
    ]
  },
  {
    id: 'learn-python',
    name: 'Agentic Python Learning Coach',
    description: 'Adaptive 5-mode Python learning coach with mental reasoning (Quick Think), sandboxed test execution (Code Lab), Socratic interactive tutor (Learn & Understand), real-world WAPs (Practical Lab), and English algorithmic reasoning (Logic Builder).',
    category: 'Knowledge & Learning',
    path: '/learn-python',
    icon: 'Zap',
    color: 'emerald',
    tags: ['Python Coach', 'Quick Think', 'Code Lab', 'Logic Builder', 'Pyodide Sandbox', 'Adaptive AI'],
    status: 'new',
    version: '2.0.0',
    features: [
      'Five Dedicated Learning Modes (M, L, T, P, E)',
      'Sandboxed Python Execution & Deterministic Test Assertions',
      'Mistake Memory Tracking (Counting vs Summing, Mutation vs Return)',
      'Algorithmic English-First Logic Reasoning Builder',
      'Interactive Socratic Memory Models (References, Mutability, Scope)',
      '4-Tier Progressive Hint Ladder (Conceptual to Partial Code)'
    ]
  }
];

export const CATEGORIES = [
  'All Tools',
  'Core Management',
  'Knowledge & Learning',
  'Practice & Sandboxes',
  'Automation & Code',
  'Performance & API'
] as const;
