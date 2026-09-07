import { ToolItem } from '../types';

export const QA_TOOLS_DATA: ToolItem[] = [
  // Test Management
  {
    id: 'testrail',
    name: 'TestRail',
    category: 'Test Management',
    whatItIs: 'A dedicated web-based test case management software for QA teams.',
    whatItIsHinglish: 'QA teams ke liye dedicated web-based test case management tool.',
    qaUsage: 'QA uses TestRail to write, organize, and execute test cases, create test runs, track execution status (Pass/Fail/Blocked), and generate testing progress reports.',
    qaUsageHinglish: 'QA isme test cases organize aur execute karta hai, test runs banata hai aur execution reports track karta hai.',
    basicIdea: 'Centralized single source of truth for all manual and automated test suites.',
    basicIdeaHinglish: 'Saari testing suites ke liye centralized management hub.',
    badge: 'Popular'
  },
  {
    id: 'zephyr',
    name: 'Zephyr (for Jira)',
    category: 'Test Management',
    whatItIs: 'A native test management plugin integrated directly inside Atlassian Jira.',
    whatItIsHinglish: 'Jira ke andar directly integrate hone wala test management plugin.',
    qaUsage: 'QA uses Zephyr to create test cases directly linked to Jira user stories, track sprint test execution cycles, and link defects with zero context switching.',
    qaUsageHinglish: 'Jira user stories se direct test cases link karne aur sprint execution track karne ke liye use hota hai.',
    basicIdea: 'Brings full test planning and execution tracking directly inside Jira boards.',
    basicIdeaHinglish: 'Jira ke andar hi poora test planning aur execution laata hai.'
  },
  {
    id: 'qtest',
    name: 'qTest (by Tricentis)',
    category: 'Test Management',
    whatItIs: 'An enterprise-grade agile test management platform.',
    whatItIsHinglish: 'Enterprise level ka scalable agile test management platform.',
    qaUsage: 'Large QA teams use qTest for scaling test management, exploratory testing recording, and integrating with Jira, CI/CD pipelines, and automation frameworks.',
    qaUsageHinglish: 'Badi teams qTest use karti hain automation pipelines, Jira integration aur exploratory session record karne ke liye.',
    basicIdea: 'Enterprise-scale testing hub with rich analytics and real-time Jira integration.',
    basicIdeaHinglish: 'Rich analytics aur Jira integration ke sath enterprise test hub.'
  },

  // Defect Tracking / Project Management
  {
    id: 'jira',
    name: 'Jira (Atlassian)',
    category: 'Defect Tracking',
    whatItIs: 'The leading issue tracking and agile project management platform in the software industry.',
    whatItIsHinglish: 'Software industry ka leading issue tracking aur agile project management tool.',
    qaUsage: 'QA uses Jira to log defects with reproduction steps, track user stories across Sprint Kanban/Scrum boards, manage bug lifecycles, and prioritize tickets with developers.',
    qaUsageHinglish: 'QA Jira par bugs log karta hai, Sprint boards par user stories track karta hai aur developer ke sath triage karta hai.',
    basicIdea: 'The primary workspace where QA, developers, and product owners track all sprint work and bugs.',
    basicIdeaHinglish: 'Sprint ka kaam aur bugs manage karne ka primary workspace.',
    badge: 'Industry Standard'
  },
  {
    id: 'azure-devops',
    name: 'Azure DevOps (ADO)',
    category: 'Defect Tracking',
    whatItIs: 'Microsoft\'s integrated DevOps platform featuring Boards, Repos, Pipelines, and Test Plans.',
    whatItIsHinglish: 'Microsoft ka complete DevOps platform jisme Boards, Repos, Pipelines aur Test Plans integrated hain.',
    qaUsage: 'QA creates and executes test plans in Azure Test Plans, logs bugs in Azure Boards, and monitors automated test runs in Azure Pipelines.',
    qaUsageHinglish: 'QA Azure Test Plans mein test cases execute karta hai aur Azure Boards mein bugs manage karta hai.',
    basicIdea: 'All-in-one platform unifying backlog tracking, code repos, CI/CD pipelines, and test execution.',
    basicIdeaHinglish: 'Code repo, test cases aur CI/CD pipelines ko ek jagah jodne wala platform.'
  },

  // API Testing
  {
    id: 'postman',
    name: 'Postman',
    category: 'API Testing',
    whatItIs: 'An API platform for building, testing, documenting, and executing HTTP requests.',
    whatItIsHinglish: 'API testing, documentation aur automation ke liye leading HTTP client platform.',
    qaUsage: 'QA creates API requests (GET, POST, PUT, DELETE), configures environments and auth tokens, writes assertion tests in JavaScript, and runs automated collection suites.',
    qaUsageHinglish: 'QA isme REST API requests banata hai, environment variables configure karta hai aur JS assertions likh kar collections run karta hai.',
    basicIdea: 'The ultimate GUI tool for manual and automated REST API verification.',
    basicIdeaHinglish: 'REST API verification ke liye sabse popular tool.',
    badge: 'Must Know'
  },
  {
    id: 'swagger',
    name: 'Swagger / OpenAPI',
    category: 'API Testing',
    whatItIs: 'An interactive API documentation specification framework.',
    whatItIsHinglish: 'Interactive API documentation aur schema specification tool.',
    qaUsage: 'QA uses Swagger UI to explore API contracts, view schemas and required parameters, and execute quick manual API queries directly in the browser before writing test cases.',
    qaUsageHinglish: 'QA Swagger UI se direct browser mein API endpoints check karta hai aur schema verify karta hai.',
    basicIdea: 'Interactive documentation showing developers and testers exactly what endpoints exist and how to call them.',
    basicIdeaHinglish: 'Interactive documentation jo batata hai ki API kaise call karni hai.'
  },

  // Automation
  {
    id: 'selenium',
    name: 'Selenium WebDriver',
    category: 'Automation',
    whatItIs: 'Open-source browser automation framework supporting multiple programming languages.',
    whatItIsHinglish: 'Open-source browser automation framework jo Java, Python, C#, JS sabhi ko support karta hai.',
    qaUsage: 'QA writes automated UI scripts in Java, Python, or C# to simulate user clicks, form fills, and navigation across different browsers.',
    qaUsageHinglish: 'QA browsers ko automate karne ke liye scripts likhta hai aur cross-browser tests chalata hai.',
    basicIdea: 'The foundational standard for browser automation across the web industry.',
    basicIdeaHinglish: 'Web browser automation ka industry-wide foundation.'
  },
  {
    id: 'playwright',
    name: 'Playwright',
    category: 'Automation',
    whatItIs: 'Next-generation modern end-to-end automation framework developed by Microsoft.',
    whatItIsHinglish: 'Microsoft dwara banaya gaya ultra-fast modern E2E automation framework.',
    qaUsage: 'QA writes fast, resilient automated tests in TypeScript/JavaScript with built-in auto-waits, video recording, network interception, and cross-browser support.',
    qaUsageHinglish: 'QA auto-waits, network mocking aur trace viewer ke sath bina flaky tests ke fast automation likhta hai.',
    basicIdea: 'Modern, ultra-fast test automation with zero flaky sleeps.',
    basicIdeaHinglish: 'Fast, resilient aur modern test automation.',
    badge: 'Top Modern Tool'
  },
  {
    id: 'cypress',
    name: 'Cypress',
    category: 'Automation',
    whatItIs: 'Frontend developer and QA friendly test runner executing directly inside Chromium and Firefox browsers.',
    whatItIsHinglish: 'Frontend developer aur QA-friendly test runner jo browser ke andar execute hota hai.',
    qaUsage: 'QA writes automated component and end-to-end tests with real-time DOM debugging and time-travel snapshots.',
    qaUsageHinglish: 'Time-travel debugging aur direct DOM inspection ke sath Single Page Apps ko test karne ke liye.',
    basicIdea: 'Developer-friendly web testing framework with rich visual debugging.',
    basicIdeaHinglish: 'Rich visual debugging ke sath web testing framework.'
  },

  // CI/CD
  {
    id: 'jenkins',
    name: 'Jenkins',
    category: 'CI/CD',
    whatItIs: 'Open-source continuous integration and continuous delivery (CI/CD) automation server.',
    whatItIsHinglish: 'Open-source CI/CD automation server jo build pipelines aur tests execute karta hai.',
    qaUsage: 'QA configures Jenkins jobs and pipelines to automatically trigger automated test suites upon code commits, generating execution reports and alerting the team of test failures.',
    qaUsageHinglish: 'Code commit hone par automatically automation test suites run karwane aur reports generate karne ke liye.',
    basicIdea: 'Automates the execution of test suites whenever new code is built.',
    basicIdeaHinglish: 'Naya code aate hi automated test run karna.'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'CI/CD',
    whatItIs: 'Native automation and workflow orchestration built directly into GitHub repositories.',
    whatItIsHinglish: 'GitHub repositories ke andar natively built automation workflows.',
    qaUsage: 'QA writes YAML workflow files to automatically run Playwright, Cypress, or Postman Newman test suites on every Pull Request.',
    qaUsageHinglish: 'Har Pull Request (PR) par automatically test suite run karne ke liye YAML workflows likhna.',
    basicIdea: 'Enables seamless automated test execution right alongside the code on GitHub.',
    basicIdeaHinglish: 'GitHub ke andar hi code ke sath automated testing run karna.'
  },

  // Version Control
  {
    id: 'git',
    name: 'Git',
    category: 'Version Control',
    whatItIs: 'Distributed version control system tracking changes in source code and test automation scripts.',
    whatItIsHinglish: 'Source code aur automation test scripts ke changes track karne wala version control system.',
    qaUsage: 'QA uses Git to clone automation frameworks, create branches for new test cases, commit test code, and collaborate via Pull Requests.',
    qaUsageHinglish: 'QA test automation code ko branches mein manage karne, commit karne aur PRs ke through collaborate karne ke liye use karta hai.',
    basicIdea: 'Essential tool for managing version history of test automation code and test configurations.',
    basicIdeaHinglish: 'Test code ke history aur collaboration ke liye mandatory tool.'
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Version Control',
    whatItIs: 'Cloud-based hosting platform for Git repositories with issue tracking, code reviews, and CI/CD.',
    whatItIsHinglish: 'Git repositories ko cloud par host karne, code reviews aur issue tracking ka platform.',
    qaUsage: 'QA reviews pull requests, manages test repositories, opens defect issues, and monitors automated CI test workflows.',
    qaUsageHinglish: 'Test repositories host karne, pull requests check karne aur automated CI test runs monitor karne ke liye.',
    basicIdea: 'Central cloud home for team collaboration, code reviews, and automated testing pipelines.',
    basicIdeaHinglish: 'Team collaboration aur cloud pipelines ka central hub.'
  }
];
