export type NavSectionId = 
  | 'home'
  | 'manual-testing'
  | 'api-testing'
  | 'automation'
  | 'security'
  | 'tools'
  | 'terminology'
  | 'interview';

export interface ConceptItem {
  id: string;
  title: string;
  definition: string;
  definitionHinglish?: string;
  whyUsed?: string;
  whyUsedHinglish?: string;
  example?: string;
  exampleHinglish?: string;
  remember?: string;
  rememberHinglish?: string;
  keyPoints?: string[];
  keyPointsHinglish?: string[];
  category?: string;
}

export interface TestingTypeItem {
  id: string;
  name: string;
  category: 'Functional' | 'Non-Functional';
  definition: string;
  definitionHinglish?: string;
  whyUsed: string;
  whyUsedHinglish?: string;
  example: string;
  exampleHinglish?: string;
  remember?: string;
  rememberHinglish?: string;
}

export interface TestingTechniqueItem {
  id: string;
  name: string;
  type: 'Black-box' | 'White-box' | 'Experience-based';
  whatItIs: string;
  whatItIsHinglish?: string;
  whenToUse: string;
  whenToUseHinglish?: string;
  example: string;
  exampleHinglish?: string;
  remember?: string;
  rememberHinglish?: string;
}

export interface TerminologyItem {
  id: string;
  term: string;
  abbreviation?: string;
  category: 'Requirements' | 'SDLC & STLC' | 'Testing Types' | 'Defects & Quality' | 'Test Execution & Metrics' | 'Environment & Release';
  shortDefinition: string;
  shortDefinitionHinglish?: string;
  example?: string;
  exampleHinglish?: string;
  istqbNote?: string;
}

export interface InterviewQuestionItem {
  id: number;
  question: string;
  questionHinglish?: string;
  category: 'Manual Testing' | 'API Testing' | 'Automation Basics' | 'Security Testing' | 'Agile & Process';
  answer: string;
  answerHinglish?: string;
  example?: string;
  exampleHinglish?: string;
  tags: string[];
}

export interface ToolItem {
  id: string;
  name: string;
  category: 'Test Management' | 'Defect Tracking' | 'API Testing' | 'Automation' | 'CI/CD' | 'Version Control';
  whatItIs: string;
  whatItIsHinglish?: string;
  qaUsage: string;
  qaUsageHinglish?: string;
  basicIdea: string;
  basicIdeaHinglish?: string;
  badge?: string;
}

export interface HttpStatusCodeItem {
  code: number;
  name: string;
  category: '2xx Success' | '3xx Redirection' | '4xx Client Error' | '5xx Server Error';
  description: string;
  descriptionHinglish?: string;
  qaCheck: string;
  qaCheckHinglish?: string;
}

export interface TestCaseRow {
  testCaseId: string;
  scenario: string;
  testSteps: string[];
  testData: string;
  expectedResult: string;
  actualResult: string;
  status: 'Pass' | 'Fail' | 'Blocked';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
}

export interface SearchResultItem {
  title: string;
  section: NavSectionId;
  subSectionId?: string;
  category: string;
  snippet: string;
  type: 'concept' | 'term' | 'question' | 'tool' | 'type';
}

