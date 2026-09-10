export interface CurriculumCategory {
  id: string;
  name: string;
  description: string;
  minLevel: number;
  topics: {
    id: string;
    title: string;
    description: string;
    commonMisconceptions: string[];
    qaApplication?: string;
  }[];
}

export const CURRICULUM_CATEGORIES: CurriculumCategory[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Variables, primitive data types, operators, strings, booleans, and console I/O',
    minLevel: 1,
    topics: [
      {
        id: 'variables',
        title: 'Variables & Assignment',
        description: 'Variable declaration, dynamic typing, and binding identifiers to objects',
        commonMisconceptions: ['Thinking assignment copies container contents', 'Variable naming conventions'],
      },
      {
        id: 'data-types',
        title: 'Data Types & Casting',
        description: 'Integers, floats, strings, booleans, int(), str(), float(), type()',
        commonMisconceptions: ['String concatenation with integers without str()', 'Float precision rounding'],
      },
      {
        id: 'operators',
        title: 'Operators & Expressions',
        description: 'Arithmetic (+, -, *, /, //, %, **), comparison, and logical operators (and, or, not)',
        commonMisconceptions: ['Floor division // vs true division /', 'Modulo with negative numbers'],
      },
      {
        id: 'strings',
        title: 'Strings & Slicing',
        description: 'Indexing, negative indexing, slice step [start:stop:step], f-strings',
        commonMisconceptions: ['Inclusive vs exclusive stop index in slicing', 'String immutability'],
      },
    ],
  },
  {
    id: 'control-flow',
    name: 'Control Flow',
    description: 'Decision branches, loops, iterations, and control statements',
    minLevel: 2,
    topics: [
      {
        id: 'conditionals',
        title: 'if / elif / else',
        description: 'Boolean branching, truthy/falsy evaluation, compound conditions',
        commonMisconceptions: ['Using assignment = instead of comparison ==', 'Chained comparison syntax'],
      },
      {
        id: 'for-loops',
        title: 'For Loops & Range',
        description: 'Iterating sequences, range(start, stop, step), iterating indices vs elements',
        commonMisconceptions: ['range stop value exclusion', 'Modifying list while iterating over it'],
      },
      {
        id: 'while-loops',
        title: 'While Loops & Guards',
        description: 'Condition-controlled loops, infinite loop avoidance, loop counters',
        commonMisconceptions: ['Off-by-one boundary conditions', 'Forgetting state update in loop body'],
      },
      {
        id: 'loop-controls',
        title: 'Break, Continue & Loop Else',
        description: 'Early loop exits, skipping iterations, and the else clause on loops',
        commonMisconceptions: ['Thinking loop else runs on break', 'Misplacing continue statement'],
      },
    ],
  },
  {
    id: 'functions',
    name: 'Functions & Scope',
    description: 'Modular code, parameters, returns, and variable scopes',
    minLevel: 3,
    topics: [
      {
        id: 'func-definition',
        title: 'Function Definition & Return',
        description: 'def keyword, parameters, return statement vs print() side-effects',
        commonMisconceptions: ['Confusing print() output with function return value', 'Functions without return give None'],
      },
      {
        id: 'scope',
        title: 'Local vs Global Scope (LEGB)',
        description: 'Variable visibility, local namespaces, global and nonlocal keywords',
        commonMisconceptions: ['UnboundLocalError when modifying global without declaration', 'Shadowing built-ins'],
      },
      {
        id: 'arguments',
        title: 'Arguments & Defaults',
        description: 'Positional, keyword arguments, default parameter values, mutable default trap',
        commonMisconceptions: ['Mutable default arguments sharing state across calls (def f(x=[]) )'],
      },
    ],
  },
  {
    id: 'python-behavior',
    name: 'Python Behavior & Mental Models',
    description: 'References, mutability, object identity, and memory models',
    minLevel: 4,
    topics: [
      {
        id: 'mutability',
        title: 'Mutable vs Immutable',
        description: 'Lists/dicts (mutable) vs strings/tuples/ints (immutable)',
        commonMisconceptions: ['Confusing in-place mutation (.append, .sort) with return value assignment'],
      },
      {
        id: 'references-identity',
        title: 'References & Identity (is vs ==)',
        description: 'Object id(), memory references, equality (==) vs identity (is)',
        commonMisconceptions: ['Using "is" for value comparison', 'Variable reassignment vs object mutation'],
      },
      {
        id: 'truthiness',
        title: 'Truthiness & None',
        description: 'Falsy values (0, "", [], {}, None, False), checking is None',
        commonMisconceptions: ['Empty list [] evaluates to False', 'Checking if val == None instead of is None'],
      },
    ],
  },
  {
    id: 'collections',
    name: 'Collections & Iteration',
    description: 'Lists, tuples, sets, dictionaries, and list comprehensions',
    minLevel: 5,
    topics: [
      {
        id: 'lists',
        title: 'Lists & List Methods',
        description: 'append, extend, pop, insert, sort vs sorted, shallow copying',
        commonMisconceptions: ['x.append() returns None, setting x = x.append(1) wipes the list!'],
      },
      {
        id: 'dictionaries',
        title: 'Dictionaries & Key-Value Logic',
        description: 'Key lookups, .get(key, default), keys(), values(), items()',
        commonMisconceptions: ['KeyError on direct index missing key', 'Iterating dict yields keys by default'],
      },
      {
        id: 'sets-tuples',
        title: 'Sets & Tuples',
        description: 'Unique memberships, set union/intersection, immutable tuple records',
        commonMisconceptions: ['Creating single element tuple (1,) vs (1)', 'Set is unordered'],
      },
      {
        id: 'comprehensions',
        title: 'Comprehensions',
        description: 'List comprehensions, dict comprehensions, condition filtering',
        commonMisconceptions: ['Overcomplicating nested comprehensions', 'Condition placement before vs after for'],
      },
    ],
  },
  {
    id: 'qa-automation',
    name: 'QA & Automation Logic',
    description: 'Test results, API responses, JSON data, log processing, and validation utilities',
    minLevel: 6,
    topics: [
      {
        id: 'json-api-parsing',
        title: 'JSON & API Payload Parsing',
        description: 'Extracting status codes, nested response objects, validating schemas',
        commonMisconceptions: ['Handling missing optional keys in JSON payloads without crashing'],
        qaApplication: 'Parsing REST API response bodies and verifying assertions in automation test suites.',
      },
      {
        id: 'test-result-analysis',
        title: 'Test Result Aggregation',
        description: 'Counting passed/failed tests, grouping failures by test suite, calculating pass rate %',
        commonMisconceptions: ['Confusing total tests with failed tests', 'Division by zero on empty suites'],
        qaApplication: 'Building CI/CD test run summary reports and metric collectors.',
      },
      {
        id: 'log-processing',
        title: 'Log Parsing & Regex / String Filters',
        description: 'Filtering ERROR/WARN lines, extracting timestamps, identifying flaky endpoints',
        commonMisconceptions: ['Case sensitivity in log levels', 'Multi-line stack traces'],
        qaApplication: 'Automated test failure triaging and system health telemetry.',
      },
      {
        id: 'retry-logic',
        title: 'Retry & Polling Algorithms',
        description: 'Simulating exponential backoff, status poll loops, timeout guards',
        commonMisconceptions: ['Not incrementing retry attempt counter', 'Exceeding max retry duration'],
        qaApplication: 'Robust UI element wait conditions and asynchronous polling in Playwright/Selenium.',
      },
    ],
  },
];

export const DIFFICULTY_LEVEL_DESCRIPTIONS: Record<number, { title: string; focus: string }> = {
  1: { title: 'Level 1: Single Concept', focus: 'Variables, basic arithmetic, single expressions' },
  2: { title: 'Level 2: Two Concepts', focus: 'Conditionals paired with arithmetic or string checks' },
  3: { title: 'Level 3: State Tracking', focus: 'Single counter or flag state tracking in loops' },
  4: { title: 'Level 4: Multiple State Variables', focus: 'Running min/max, dual counters, flag states' },
  5: { title: 'Level 5: Nested Structures', focus: 'Nested lists, list of dicts, matrix coordinates' },
  6: { title: 'Level 6: Business Rules', focus: 'Multi-branch decision logic, discounts, validation gates' },
  7: { title: 'Level 7: Data Transformation', focus: 'Aggregating records, grouping, mapping collections' },
  8: { title: 'Level 8: QA/Automation Logic', focus: 'Test results analysis, API responses, log triage' },
  9: { title: 'Level 9: Interview-Style Challenges', focus: 'Two-pointer, frequency maps, sliding windows' },
  10: { title: 'Level 10: Advanced Applied Python', focus: 'Custom utilities, generator streams, resilient scripts' },
};
