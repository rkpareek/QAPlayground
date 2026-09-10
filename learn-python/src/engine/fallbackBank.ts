import { GeneratedExercise, LearningModeId } from '../types';

export const FALLBACK_EXERCISES: Record<LearningModeId, GeneratedExercise[]> = {
  M: [
    {
      id: 'm-qt-1',
      mode: 'M',
      topic: 'mutability',
      difficulty: 2,
      title: 'List Mutation vs Assignment',
      question: 'What is printed to stdout after executing the following code snippet?',
      code_snippet: `x = [1, 2]\ny = x\ny.append(3)\nprint(x)`,
      options: ['[1, 2]', '[1, 2, 3]', '[3]', 'Error: y is not a copy'],
      correct_option_index: 1,
      expected_concepts: ['references', 'mutability', 'list.append'],
      hints: [
        'Recall that "y = x" binds both variables to the exact same list object in memory.',
        'y.append(3) mutates the shared underlying list in-place.',
      ],
      solution_strategy: 'In Python, variables are references. y = x does not make a copy.',
      expected_output: '[1, 2, 3]',
    },
    {
      id: 'm-qt-2',
      mode: 'M',
      topic: 'lists',
      difficulty: 2,
      title: 'The append() Return Value Trap',
      question: 'What is the value of "items" after this line runs?',
      code_snippet: `items = [10, 20]\nitems = items.append(30)\nprint(items)`,
      options: ['[10, 20, 30]', '[10, 20]', 'None', 'AttributeError'],
      correct_option_index: 2,
      expected_concepts: ['list-methods', 'mutation', 'return-values'],
      hints: [
        'Does list.append() return the updated list, or None?',
        'In-place methods in Python return None by design to prevent confusion with creating new copies.',
      ],
      solution_strategy: 'append() mutates in-place and returns None. Reassigning items wipes the list.',
      expected_output: 'None',
    },
    {
      id: 'm-qt-3',
      mode: 'M',
      topic: 'for-loops',
      difficulty: 1,
      title: 'Range Boundary Stop Index',
      question: 'What does this loop output?',
      code_snippet: `total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)`,
      options: ['10', '6', '3', '7'],
      correct_option_index: 1,
      expected_concepts: ['range', 'for-loops', 'accumulator'],
      hints: [
        'range(start, stop) includes start but stops strictly BEFORE stop.',
        'Values generated for i are 1, 2, 3. The sum is 1 + 2 + 3 = 6.',
      ],
      solution_strategy: 'range(1, 4) produces [1, 2, 3]. Sum = 6.',
      expected_output: '6',
    },
    {
      id: 'm-qt-4',
      mode: 'M',
      topic: 'references-identity',
      difficulty: 3,
      title: 'Identity "is" vs Equality "=="',
      question: 'What are the two printed boolean values?',
      code_snippet: `a = [1, 2]\nb = [1, 2]\nprint(a == b)\nprint(a is b)`,
      options: ['True, True', 'True, False', 'False, True', 'False, False'],
      correct_option_index: 1,
      expected_concepts: ['is-vs-==', 'object-identity', 'equality'],
      hints: [
        '== checks value equality (do they have the same contents?).',
        'is checks identity (are they pointing to the exact same memory address?).',
      ],
      solution_strategy: 'Two distinct lists have equal values (True), but distinct object identities (False).',
      expected_output: 'True, False',
    },
  ],

  L: [
    {
      id: 'l-cl-1',
      mode: 'L',
      topic: 'test-result-analysis',
      difficulty: 3,
      title: 'Count Failed QA Test Executions',
      question:
        'You are given a list of test status strings. Write Python code that iterates through "statuses", counts how many times "FAIL" appears, and prints the count.',
      starter_code: `statuses = ["PASS", "FAIL", "PASS", "PASS", "FAIL", "SKIP", "FAIL"]\nfailed_count = 0\n\n# Your code here:\nfor status in statuses:\n    if status == "FAIL":\n        failed_count += 1\n\nprint(failed_count)`,
      expected_concepts: ['for-loop', 'counter', 'if-condition'],
      constraints: ['Use a counter variable', 'Do not confuse counting (+ 1) with summing items'],
      common_mistakes: ['Writing failed_count += status instead of failed_count += 1'],
      test_cases: [
        {
          input: 'statuses = ["PASS", "FAIL", "FAIL"]\nfailed_count = 0\nfor s in statuses:\n    if s == "FAIL": failed_count += 1\nprint(failed_count)',
          expected_output: '2',
          description: 'Basic 2 failures',
        },
        {
          input: 'statuses = ["PASS", "PASS"]\nfailed_count = 0\nfor s in statuses:\n    if s == "FAIL": failed_count += 1\nprint(failed_count)',
          expected_output: '0',
          description: 'Zero failures edge case',
        },
      ],
      hints: [
        'Initialize a variable like failed_count = 0 before the loop.',
        'Use an if statement inside the loop: if status == "FAIL":',
        'Increment your counter by 1 each time the condition is met: failed_count += 1',
        'Print failed_count after the loop finishes.',
      ],
      expected_output: '3',
    },
    {
      id: 'l-cl-2',
      mode: 'L',
      topic: 'json-api-parsing',
      difficulty: 4,
      title: 'Filter HTTP 200 API Status Codes',
      question:
        'Given a list of API response status codes, filter and print only the codes that equal 200.',
      starter_code: `responses = [200, 404, 500, 200, 201, 200]\n# Iterate and print only the status codes that are equal to 200:\nfor code in responses:\n    if code == 200:\n        print(code)`,
      expected_concepts: ['filtering', 'conditionals', 'loops'],
      constraints: ['Iterate through responses', 'Print each matching code on a new line'],
      hints: [
        'Use "for code in responses:" to loop through each code.',
        'Check "if code == 200:" to filter.',
        'Call print(code) inside the if block.',
      ],
      expected_output: '200\n200\n200',
    },
  ],

  T: [
    {
      id: 't-lu-1',
      mode: 'T',
      topic: 'mutability',
      difficulty: 2,
      title: 'Mental Model: References vs Mutation',
      question:
        'In Python, variables do not "contain" data like boxes; they act like sticky labels stuck onto objects floating in memory. Let us explore what happens when two labels point to the same list.',
      expected_concepts: ['references', 'aliasing', 'in-place mutation'],
      hints: [
        'Step 1: Understand - When we do a = [1, 2], Python creates a list object and points label "a" to it.',
        'Step 2: Predict - When we do b = a, label "b" points to that exact same list object.',
        'Step 3: Verify - If b.append(3) changes the object, what will print(a) see?',
      ],
      solution_strategy: 'Socratic step-by-step mental model verification',
    },
    {
      id: 't-lu-2',
      mode: 'T',
      topic: 'for-loops',
      difficulty: 2,
      title: 'Accumulator vs Counter Pattern',
      question:
        'A very common beginner trip-wire is confusing an Accumulator (adding values up) with a Counter (tallying occurrences). Let us build the mental model.',
      expected_concepts: ['accumulator', 'counter', 'state variables'],
      hints: [
        'Counter question: "How many red cars passed?" -> count += 1',
        'Accumulator question: "What is the total weight of the cars?" -> total += car_weight',
      ],
    },
  ],

  P: [
    {
      id: 'p-pl-1',
      mode: 'P',
      topic: 'test-result-analysis',
      difficulty: 2,
      title: 'Calculate Test Suite Pass Rate %',
      question:
        'Given total_tests = 50 and passed_tests = 42, calculate the pass rate percentage as an integer (e.g. 84) and print it.',
      starter_code: `total_tests = 50\npassed_tests = 42\n\n# Calculate and print the percentage:\npass_rate = int((passed_tests / total_tests) * 100)\nprint(pass_rate)`,
      expected_concepts: ['arithmetic', 'casting', 'percentages'],
      hints: [
        'Hint 1 (Conceptual): Percentage is (part / whole) * 100.',
        'Hint 2 (Algorithmic): Divide passed_tests by total_tests, multiply by 100, then convert to int.',
        'Hint 3 (Pseudocode): rate = int((passed / total) * 100); print(rate)',
        'Hint 4 (Partial Code): pass_rate = int((passed_tests / total_tests) * 100)',
      ],
      expected_output: '84',
    },
    {
      id: 'p-pl-2',
      mode: 'P',
      topic: 'qa-automation',
      difficulty: 4,
      title: 'Flag Slow API Response Times',
      question:
        'Given a list of endpoint response times in milliseconds [120, 450, 890, 1100, 320, 1500], print the count of response times that breached the 500ms SLA.',
      starter_code: `times_ms = [120, 450, 890, 1100, 320, 1500]\nsla_breaches = 0\n\nfor t in times_ms:\n    if t > 500:\n        sla_breaches += 1\n\nprint(sla_breaches)`,
      expected_concepts: ['counters', 'thresholds', 'QA SLAs'],
      hints: [
        'Hint 1 (Conceptual): Track a single counter for measurements exceeding 500.',
        'Hint 2 (Algorithmic): Loop through times_ms. If time > 500, increment sla_breaches by 1.',
        'Hint 3 (Pseudocode): breaches = 0; for t in times: if t > 500: breaches += 1; print(breaches)',
      ],
      expected_output: '3',
    },
  ],

  E: [
    {
      id: 'e-lb-1',
      mode: 'E',
      topic: 'algorithms',
      difficulty: 3,
      title: 'Find the Second-Largest Number',
      question:
        'Describe an algorithm in plain English to find the second-largest number in an unsorted list of numbers without using built-in sorting.\n\nExplain:\n1. What information you must track in memory.\n2. What conditions you evaluate for each number.\n3. How you update your tracked state.\n4. Edge cases (e.g. fewer than 2 numbers or duplicates).',
      expected_concepts: ['state-tracking', 'running-max', 'edge-cases'],
      hints: [
        'Hint 1 (State): You need to remember two variables: the largest number seen so far, and the second largest number seen so far.',
        'Hint 2 (Transitions): When a new number is greater than "largest", what happens to the old "largest"? It becomes the new "second largest"!',
        'Hint 3 (Else condition): What if the number is less than "largest" but greater than "second largest"?',
      ],
    },
    {
      id: 'e-lb-2',
      mode: 'E',
      topic: 'qa-automation',
      difficulty: 4,
      title: 'Identify Flaky Tests in CI/CD Matrix',
      question:
        'Explain in English how you would write an algorithm to identify "flaky" tests from 3 repeat test runs of a suite. (A test is flaky if it passed in at least one run and failed in at least one run).',
      expected_concepts: ['state-tracking', 'boolean-flags', 'test-stability'],
      hints: [
        'Hint 1 (State): For each unique test ID, track whether it has ever passed and whether it has ever failed.',
        'Hint 2 (Condition): After inspecting all 3 runs, any test with both has_passed=True and has_failed=True is marked flaky.',
      ],
    },
  ],
};
