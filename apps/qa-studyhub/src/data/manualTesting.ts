import { ConceptItem, TestingTypeItem, TestingTechniqueItem, TestCaseRow } from '../types';

export const SOFTWARE_TESTING_BASICS: ConceptItem[] = [
  {
    id: 'what-is-software-testing',
    title: 'What is Software Testing?',
    definition: 'Software testing is a systematic process of executing and evaluating a software system or its components to determine whether it satisfies specified requirements and to identify defects or discrepancies between actual and expected results.',
    definitionHinglish: 'Software Testing ek systematic process hai jisme kisi software application ya uske components ko execute aur evaluate kiya jaata hai taaki check kiya ja sake ki wo client requirements meet kar raha hai ya nahi, aur actual vs expected results ke beech ke bugs ko find kiya ja sake.',
    whyUsed: 'To verify software quality, ensure business requirements are met, prevent monetary and reputational losses, and guarantee user satisfaction.',
    whyUsedHinglish: 'Software ki high quality verify karne ke liye, business requirements fulfill karne, company ke financial/brand loss ko rokne aur end-user satisfaction ensure karne ke liye.',
    example: 'Testing an e-commerce checkout flow to ensure tax and discount calculations match exact accounting rules.',
    exampleHinglish: 'E-commerce checkout flow test karna taaki coupon discount aur tax calculation bilkul correct ho.',
    remember: 'Testing is not just finding bugs; it is measuring and assuring software quality.',
    rememberHinglish: 'Testing ka matlab sirf bugs nikalna nahi hai, balki software quality ko measure aur assure karna hai.',
    keyPoints: [
      'Identifies defects early before deployment to production.',
      'Measures system reliability, performance, and security.',
      'Ensures compliance with industry standards and legal regulations.'
    ],
    keyPointsHinglish: [
      'Production deployment se pehle early stage par defects dhundhna.',
      'System ki reliability, performance aur security ko measure karna.',
      'Industry standards aur business requirements ke saath compliance verify karna.'
    ]
  },
  {
    id: 'why-test-software',
    title: 'Why Do We Test Software?',
    definition: 'Testing is vital because software is written by humans, and human errors in requirements, design, or coding are inevitable. Unchecked bugs can cause financial failure, system downtime, security breaches, or even loss of life in critical applications.',
    definitionHinglish: 'Software human developers likhte hain, isliye requirements, design ya coding mein galti hona natural hai. Agar bugs check na kiye jayein to financial loss, system downtime, security leak ya customer dissatisfaction ho sakta hai.',
    whyUsed: 'To reduce business risk, protect data integrity, and guarantee stable system behavior under real-world usage.',
    whyUsedHinglish: 'Business risk kam karne, user data secure rakhne aur real-world usage mein app ko stable rakhne ke liye.',
    example: 'A currency rounding defect in a banking app could cause thousands of dollars in transaction mismatches overnight.',
    exampleHinglish: 'Banking app mein rounding error ka bug raat-o-raat hazaron dollars ka mismatch create kar sakta hai.',
    remember: 'Finding a defect in requirements costs 10x less than finding it in development, and 100x less than in production.',
    rememberHinglish: 'Requirement stage par bug pakadna development se 10 guna aur production se 100 guna sasta padta hai.'
  },
  {
    id: 'objectives-of-testing',
    title: 'Objectives of Testing (ISTQB)',
    definition: 'The primary objectives of testing vary across project stages but core goals remain consistent: preventing defects, verifying requirement fulfillment, building confidence in system quality, detecting failures, and providing actionable information to stakeholders.',
    definitionHinglish: 'Testing ke main objectives hain: defects prevent karna, requirements verify karna, software quality mein confidence build karna, runtime failures detect karna aur stakeholders ko accurate quality status provide karna.',
    keyPoints: [
      'Preventing defects by evaluating work products early (Verification).',
      'Verifying whether all specified requirements are implemented.',
      'Checking whether the test object meets user and stakeholder needs (Validation).',
      'Finding defects and failures to reduce the level of risk in operational software.',
      'Providing sufficient quality metrics to allow stakeholders to make informed release decisions.'
    ],
    keyPointsHinglish: [
      'Early reviews ke through defects aane se pehle rokna (Verification).',
      'Check karna ki saari specified requirements implement hui hain ya nahi.',
      'Verify karna ki software end-user ki real needs satisfy kar raha hai (Validation).',
      'Defects aur failures dhundh kar operational risk ko drastically reduce karna.',
      'Stakeholders ko clear metrics dena taaki wo confident release decision le sakein.'
    ],
    remember: 'Testing aims to find defects and reduce risk; exhaustive testing is practically impossible.',
    rememberHinglish: 'Testing ka goal defects dhundhna aur risk kam karna hai; complete exhaustive testing practically impossible hai.'
  },
  {
    id: 'quality-vs-testing',
    title: 'Quality vs Testing',
    definition: 'Quality is the degree to which a component or system meets specified requirements and user expectations. Testing is the activity or mechanism used to measure, evaluate, and provide feedback on that quality.',
    definitionHinglish: 'Quality ka matlab hai ki software user requirements aur expectations ko kitni achhi tarah meet karta hai. Testing wo process hai jisse hum is quality ko measure aur evaluate karte hain.',
    keyPoints: [
      'Quality cannot be tested into an application at the end; it must be built into every development phase.',
      'Testing measures existing quality and reveals where quality is lacking.'
    ],
    keyPointsHinglish: [
      'Quality aakhiri mein add nahi ki ja sakti; ye har development phase mein build karni padti hai.',
      'Testing existing quality ko measure karti hai aur batati hai ki kahan improvement ki zarurat hai.'
    ],
    remember: 'Testing does not create quality; it measures quality so improvements can be made.',
    rememberHinglish: 'Testing khud quality create nahi karti, balki quality measure karke improvement ke raaste batati hai.'
  },
  {
    id: 'error-defect-bug-failure',
    title: 'Error, Defect, Bug, and Failure (Key Distinctions)',
    definition: 'These terms represent different stages of a flaw in the software lifecycle according to ISTQB standards.',
    definitionHinglish: 'Ye software lifecycle mein kisi mistake ke alag-alag stages ko darshate hain (ISTQB standard).',
    keyPoints: [
      'Error (Mistake): A human mistake made by a programmer, analyst, or architect (e.g., misreading a requirement).',
      'Defect (Fault): The physical flaw or incorrect logic inside the source code or specification caused by the error.',
      'Bug: The common industry term used when a defect is detected and logged during testing.',
      'Failure: An event where the system deviates from expected behavior during runtime (e.g., app crashes on click).',
      'Incident: An unconfirmed anomaly observed during test execution requiring investigation.'
    ],
    keyPointsHinglish: [
      'Error (Mistake): Developer ya analyst se hui insani galti (e.g., logic galat samajhna).',
      'Defect (Fault): Us galti ki wajah se code ya document mein aayi flaw ya incorrect logic.',
      'Bug: Testing ke dauraan pakda gaya defect jisko Jira mein log kiya jaata hai.',
      'Failure: Jab runtime par software galat behavior dikhata hai ya crash ho jaata hai.',
      'Incident: Test run ke dauraan dikha koi unexplained behavior jiski investigation zaruri ho.'
    ],
    example: 'Developer misinterprets requirement (Error) → Writes incorrect logic (Defect/Bug) → System crashes during checkout (Failure).',
    exampleHinglish: 'Developer ne requirement galat samjhi (Error) → Galat logic code kiya (Defect/Bug) → Checkout par app crash ho gaya (Failure).',
    remember: 'Error in thought → Defect in code → Failure in execution.',
    rememberHinglish: 'Dimaag ki galti (Error) → Code ki khami (Defect) → Runtime par crash (Failure).'
  },
  {
    id: 'verification-vs-validation',
    title: 'Verification vs Validation (V&V)',
    definition: 'Two fundamental pillars of quality assurance that check software from different perspectives.',
    definitionHinglish: 'Software Quality Assurance ke do mukhya pillars jo alag-alag tarike se system ko verify karte hain.',
    keyPoints: [
      'Verification (Static): "Are we building the product right?" Reviews, inspections, walkthroughs without code execution.',
      'Validation (Dynamic): "Are we building the right product?" Executing code against user requirements and business needs.'
    ],
    keyPointsHinglish: [
      'Verification (Static): "Kya hum product sahi tarike se bana rahe hain?" (Reviews, walkthroughs bina code run kiye).',
      'Validation (Dynamic): "Kya hum sahi product bana rahe hain?" (Actual software run karke user requirements test karna).'
    ],
    example: 'Verification: Reviewing the SRS document and database schema. Validation: Testing the live registration form on staging.',
    exampleHinglish: 'Verification: SRS aur Architecture review karna. Validation: Staging environment par live registration form test karna.',
    remember: 'Verification = Document & Code inspection. Validation = Actual software execution.',
    rememberHinglish: 'Verification = Documents/Code inspect karna. Validation = Software run karke test karna.'
  }
];

export const MANUAL_TESTING_OVERVIEW: ConceptItem[] = [
  {
    id: 'what-is-manual-testing',
    title: 'What is Manual Testing?',
    definition: 'Manual testing is the practice of manually executing test cases without the assistance of automated tools or scripts. The tester takes on the role of an end-user to check features, navigation, UI/UX aesthetics, and business workflows.',
    definitionHinglish: 'Manual Testing ek aisa testing process hai jisme tester bina kisi automated tool ya script ke manually test cases execute karta hai. Tester khud end-user ban kar application ki usability, UI/UX aur business workflows ko test karta hai.',
    whyUsed: 'Provides human perspective, visual nuance, domain intuition, and flexibility that automated scripts cannot replicate.',
    whyUsedHinglish: 'Human perspective, visual feel, exploratory intuition aur user convenience check karne ke liye jo automation scripts nahi pakad sakti.',
    example: 'A tester manually opens an iOS banking app, tries biometric FaceID login, simulates poor network connectivity, and observes user prompts.',
    exampleHinglish: 'Mobile banking app mein FaceID login check karna, slow network simulate karna aur UI messages verify karna.'
  },
  {
    id: 'manual-testing-process',
    title: 'How Manual Testing Works (The 5-Step Process)',
    definition: 'A structured, repeatable sequence followed by manual QA testers in every sprint:',
    definitionHinglish: 'Har sprint mein follow kiya jaane wala 5-step structured manual testing process:',
    keyPoints: [
      '1. Requirement Analysis: Understand user stories, acceptance criteria, and business goals.',
      '2. Test Case Creation: Write detailed positive, negative, and boundary test cases.',
      '3. Test Data Preparation: Gather valid/invalid credentials, payload files, and mock accounts.',
      '4. Test Execution: Execute step-by-step test cases against the deployed build and record results.',
      '5. Defect Logging & Retesting: Log defects in Jira with reproducible steps; retest fixed builds.'
    ],
    keyPointsHinglish: [
      '1. Requirement Analysis: User story aur acceptance criteria ko achhi tarah samajhna.',
      '2. Test Case Creation: Positive, negative aur boundary test cases draft karna.',
      '3. Test Data Preparation: Test accounts, valid/invalid inputs aur mock data ready karna.',
      '4. Test Execution: Deployed build par test cases run karna aur actual result note karna.',
      '5. Defect Logging & Retesting: Jira mein bugs log karna aur developer ke fix ke baad retest karna.'
    ],
    remember: 'Great manual testing requires thorough documentation and relentless attention to edge cases.',
    rememberHinglish: 'Behtareen manual testing ke liye strong documentation aur edge cases par bariki se dhyan dena zaroori hai.'
  },
  {
    id: 'advantages-and-limitations',
    title: 'Advantages & Limitations of Manual Testing',
    definition: 'Understanding when manual testing excels and where it encounters natural boundaries.',
    definitionHinglish: 'Manual testing ke mukhya fayde aur uski natural limitations:',
    keyPoints: [
      'Advantages: Immediate visual feedback, exceptional for exploratory & usability testing, low initial setup cost, handles rapidly changing UI seamlessly.',
      'Limitations: Time-consuming for large repetitive regression suites, prone to human fatigue during repetitive checks, impossible for high-concurrency load testing.'
    ],
    keyPointsHinglish: [
      'Advantages: Quick visual feedback, exploratory aur usability testing ke liye best, zero initial framework setup cost, flexible UI changes.',
      'Limitations: Repetitive regression suites mein zyada time lagna, human fatigue ki sambhavna, heavy load/concurrency test na kar pana.'
    ],
    remember: 'Manual testing and Automation testing complement each other; one never completely replaces the other.',
    rememberHinglish: 'Manual aur Automation testing ek doosre ke saathi hain; ek doosre ko kabhi poori tarah replace nahi kar sakta.'
  }
];

export const FUNCTIONAL_TESTING_TYPES: TestingTypeItem[] = [
  {
    id: 'unit-testing',
    name: 'Unit Testing (QA Perspective)',
    category: 'Functional',
    definition: 'Testing individual software components, functions, or modules in complete isolation.',
    definitionHinglish: 'Software ke individual functions, methods ya single code components ko akele mein test karna.',
    whyUsed: 'To catch bugs at the earliest possible stage directly in source code.',
    whyUsedHinglish: 'Source code level par sabse early stage par bugs pakadne ke liye.',
    example: 'Verifying that a standalone `calculateTax(price, rate)` function returns correct decimals.',
    exampleHinglish: 'Check karna ki `calculateTax(100, 18)` exactly 18 return karta hai.',
    remember: 'Typically written by developers, but QA reviews test coverage metrics.',
    rememberHinglish: 'Ye mostly developers likhte hain, par QA coverage verify karta hai.'
  },
  {
    id: 'integration-testing',
    name: 'Integration Testing',
    category: 'Functional',
    definition: 'Testing the interfaces and interaction between integrated units or modules to uncover data exchange defects.',
    definitionHinglish: 'Do ya do se zyada modules ke beech ke interaction aur data flow ko test karna.',
    whyUsed: 'Individual units may work alone but fail when communicating together.',
    whyUsedHinglish: 'Single units akele sahi chalte hain par aapas mein connect hone par fail ho sakte hain.',
    example: 'Verifying that the Login module correctly passes session tokens to the User Profile module.',
    exampleHinglish: 'Login module successfully session token User Profile module ko pass kar raha hai ya nahi.'
  },
  {
    id: 'system-testing',
    name: 'System Testing',
    category: 'Functional',
    definition: 'Testing the completely integrated application end-to-end to verify adherence to functional and system requirements.',
    definitionHinglish: 'Poori tarah integrated software ko shuru se aakhir tak complete requirements ke sath test karna.',
    whyUsed: 'Validates overall system behavior, database persistence, UI, and business rules as a cohesive whole.',
    whyUsedHinglish: 'Overall system behavior, database integrity aur business rules ko complete app ke roop mein verify karna.',
    example: 'Testing an entire e-commerce flow: Search product → Add to cart → Checkout → Receive email confirmation.',
    exampleHinglish: 'E-commerce flow: Product khojna → Cart mein daalna → Payment karna → Confirmation email aana.'
  },
  {
    id: 'acceptance-testing',
    name: 'Acceptance Testing (UAT)',
    category: 'Functional',
    definition: 'Formal testing conducted by end-users or clients to determine whether the system satisfies business acceptance criteria for release.',
    definitionHinglish: 'Client ya end-users dwara ki jaane wali testing jo check karti hai ki software business needs fulfill kar raha hai ya nahi.',
    whyUsed: 'Gives business stakeholders confidence to sign off on production deployment.',
    whyUsedHinglish: 'Business stakeholders ko release ke liye formal sign-off dene ka confidence deta hai.',
    example: 'Accountants verifying that new invoice generation conforms to national tax compliance rules.',
    exampleHinglish: 'Finance team ka check karna ki nayi GST invoice rules bilkul correct apply ho rahe hain.'
  },
  {
    id: 'regression-testing',
    name: 'Regression Testing',
    category: 'Functional',
    definition: 'Re-running existing functional test suites to ensure that recent code modifications or bug fixes have not broken existing features.',
    definitionHinglish: 'Existing features ko dobara test karna taaki naye code changes ya bug fixes se purani working functionality na toote.',
    whyUsed: 'Prevents side-effects and regression defects when software evolves.',
    whyUsedHinglish: 'Naye code update se purane features mein defects aane se rokne ke liye.',
    example: 'Testing checkout and search after developers updated the payment gateway API SDK.',
    exampleHinglish: 'Payment SDK update hone ke baad search aur cart functionality check karna.',
    remember: 'New change → verify old functionality still works.',
    rememberHinglish: 'Naya change aane par purana feature check karna regression testing hai.'
  },
  {
    id: 'retesting',
    name: 'Retesting',
    category: 'Functional',
    definition: 'Specifically executing the exact test cases that previously failed to verify that a reported bug has been properly fixed.',
    definitionHinglish: 'Sirf un specific test cases ko dobara chalana jo pehle fail huye the, taaki bug fix verify ho sake.',
    whyUsed: 'Confirms that the defect is resolved in the new build.',
    whyUsedHinglish: 'Confirm karna ki reported bug naye build mein sahi fix ho gaya hai.',
    example: 'Tester logs bug #402 (password reset link broken). Developer deploys fix. Tester re-runs test case TC-08.',
    exampleHinglish: 'Password reset broken bug report hua → Dev ne fix kiya → Tester ne wahi test case re-run kiya.'
  },
  {
    id: 'smoke-testing',
    name: 'Smoke Testing (Build Verification)',
    category: 'Functional',
    definition: 'A wide and shallow set of critical tests run on every fresh build to verify basic stability before accepting it for deeper testing.',
    definitionHinglish: 'Har naye build par chalaye jaane wale critical basic tests jo check karte hain ki build test karne layak stable hai ya nahi.',
    whyUsed: 'Saves QA time by rejecting fundamentally broken builds immediately.',
    whyUsedHinglish: 'Broken build ko turant reject karke QA ka time bachata hai.',
    example: 'Verifying app boots, user can login, and main navigation tabs render without immediate crash.',
    exampleHinglish: 'App open hona, login kaam karna aur main pages crash na hona verify karna.'
  },
  {
    id: 'sanity-testing',
    name: 'Sanity Testing',
    category: 'Functional',
    definition: 'A quick, focused test on a stable build following a minor bug fix or patch to confirm the specific module behaves as expected.',
    definitionHinglish: 'Minor bug fix ya patch ke baad us specific module ko deeply aur quickly test karna.',
    whyUsed: 'Quickly verifies targeted changes without running a full regression cycle.',
    whyUsedHinglish: 'Full regression run kiye bina targeted fix ko quickly verify karne ke liye.',
    example: 'Testing coupon code application and discount totals thoroughly after a coupon logic fix.',
    exampleHinglish: 'Coupon logic fix hone ke baad coupon codes aur cart discount calculation check karna.'
  },
  {
    id: 'exploratory-testing',
    name: 'Exploratory Testing',
    category: 'Functional',
    definition: 'Simultaneous learning, test design, and test execution without scripted test cases, driven by tester curiosity and domain knowledge.',
    definitionHinglish: 'Bina written test cases ke application ko explore karke, curiosity aur domain knowledge se bugs dhundhna.',
    whyUsed: 'Discovers complex, unexpected edge cases that rigid test cases miss.',
    whyUsedHinglish: 'Aise unexpected edge cases dhundhne ke liye jo regular test cases miss kar dete hain.',
    example: 'Rapidly double-clicking submit buttons while switching network connection from Wi-Fi to Airplane mode.',
    exampleHinglish: 'Form submit karte time internet disconnect karke ya fast double click karke behavior dekhna.'
  },
  {
    id: 'adhoc-testing',
    name: 'Ad-hoc Testing',
    category: 'Functional',
    definition: 'Informal, unstructured testing performed spontaneously without formal documentation, test plans, or test cases.',
    definitionHinglish: 'Bina kisi formal test plan ya doc ke randomly aur informally application ko test karna (monkey testing approach).',
    whyUsed: 'Quickly uncovers defects by trying random, unconventional user actions (monkey testing).',
    whyUsedHinglish: 'Random user actions try karke quick defects pakadne ke liye.',
    example: 'Entering emojis, script tags, and extreme strings into random form fields.',
    exampleHinglish: 'Input fields mein emojis, symbols aur lambe random characters daal kar check karna.'
  },
  {
    id: 'e2e-testing',
    name: 'End-to-End (E2E) Testing',
    category: 'Functional',
    definition: 'Testing the complete user journey from beginning to end across all integrated third-party systems, databases, and network layers.',
    definitionHinglish: 'User ke poore journey ko start se end tak database aur third-party services ke saath test karna.',
    whyUsed: 'Ensures real-world user scenarios execute seamlessly across distributed architectures.',
    whyUsedHinglish: 'Real customer scenarios sabhi integrated systems ke beech smoothly execute hone ko guarantee karne ke liye.',
    example: 'Customer registers → receives email verification → purchases subscription via Stripe → logs in via mobile app.',
    exampleHinglish: 'User account banata hai → OTP verify karta hai → Payment karta hai → Service activate hoti hai.'
  },
  {
    id: 'compatibility-testing',
    name: 'Compatibility Testing',
    category: 'Functional',
    definition: 'Verifying that the application functions seamlessly across different web browsers, operating systems, screen resolutions, and devices.',
    definitionHinglish: 'Check karna ki application alag-alag browsers (Chrome, Safari), devices aur screen sizes par sahi chal raha hai.',
    whyUsed: 'Ensures consistent user experience regardless of client hardware or browser choice.',
    whyUsedHinglish: 'Har device aur browser par user ko consistent experience dene ke liye.',
    example: 'Testing a responsive web application on Chrome (Windows), Safari (macOS), Firefox (Linux), and Chrome (Android).',
    exampleHinglish: 'App ko Windows Chrome, iPhone Safari aur Android Chrome par test karna.'
  }
];

export const NON_FUNCTIONAL_TESTING_TYPES: TestingTypeItem[] = [
  {
    id: 'performance-testing',
    name: 'Performance Testing',
    category: 'Non-Functional',
    definition: 'Evaluating system responsiveness, throughput, speed, and stability under a specific workload.',
    definitionHinglish: 'System ki speed, responsiveness aur stability ko given workload ke andar measure karna.',
    whyUsed: 'Ensures the system meets SLA response times (e.g., page load < 2 seconds).',
    whyUsedHinglish: 'Check karne ke liye ki page 2 second ke andar load ho aur SLA meet kare.',
    example: 'Measuring API latency when 100 simultaneous users request search results.',
    exampleHinglish: '100 users ke ek sath search karne par API response time measure karna.'
  },
  {
    id: 'load-testing',
    name: 'Load Testing',
    category: 'Non-Functional',
    definition: 'Testing application behavior under expected normal and peak user traffic volumes over an extended duration.',
    definitionHinglish: 'Expected normal aur peak user load par application ke behavior ko check karna.',
    whyUsed: 'Identifies performance bottlenecks, memory leaks, and CPU throttling before real users experience slowdowns.',
    whyUsedHinglish: 'Bottlenecks aur memory leaks ko identify karna taaki real users ko lag na mile.',
    example: 'Simulating 5,000 concurrent users browsing an e-commerce platform during normal business hours.',
    exampleHinglish: 'Ek sath 5,000 users simulate karke server load test karna.'
  },
  {
    id: 'stress-testing',
    name: 'Stress Testing',
    category: 'Non-Functional',
    definition: 'Testing application limits by subjecting it to extreme, beyond-capacity workloads until it breaks, and observing how it recovers.',
    definitionHinglish: 'System ko uski normal capacity se kahi zyada extreme traffic dekar break point aur recovery check karna.',
    whyUsed: 'Determines the breaking point and verifies graceful failure without data corruption.',
    whyUsedHinglish: 'Breaking point pata lagana aur dekhna ki system data corrupt kiye bina safely fail hota hai ya nahi.',
    example: 'Bombarding a server with 50,000 requests per second to verify it returns 503 instead of corrupting database records.',
    exampleHinglish: '50,000 requests bhej kar check karna ki server 503 deta hai ya database crash karta hai.'
  },
  {
    id: 'security-testing-nf',
    name: 'Security Testing',
    category: 'Non-Functional',
    definition: 'Evaluating whether the application protects sensitive data, enforces authentication, and prevents unauthorized access or cyber attacks.',
    definitionHinglish: 'Check karna ki application sensitive data ko protect karta hai aur unauthorized access ya attacks ko rokta hai.',
    whyUsed: 'Protects user data, complies with GDPR/HIPAA, and prevents security breaches.',
    whyUsedHinglish: 'Data leaks rokne aur security compliance ensure karne ke liye.',
    example: 'Verifying that passwords are encrypted in transit and database, and session tokens expire upon logout.',
    exampleHinglish: 'Check karna ki passwords database mein encrypted hain aur logout ke baad token expire hota hai.'
  },
  {
    id: 'usability-testing',
    name: 'Usability Testing',
    category: 'Non-Functional',
    definition: 'Evaluating how user-friendly, intuitive, and accessible the application interface is for end users.',
    definitionHinglish: 'Check karna ki application ka user interface kitna aasan, intuitive aur user-friendly hai.',
    whyUsed: 'Reduces user frustration and increases user retention and conversion rates.',
    whyUsedHinglish: 'User ki pareshani kam karne aur app adoption badhane ke liye.',
    example: 'Checking if an elderly user can complete a money transfer in fewer than 3 intuitive steps without assistance.',
    exampleHinglish: 'Check karna ki bina help ke user 3 simple steps mein payment complete kar pa raha hai.'
  }
];

export const TESTING_TECHNIQUES: TestingTechniqueItem[] = [
  {
    id: 'equivalence-partitioning',
    name: 'Equivalence Partitioning (EP)',
    type: 'Black-box',
    whatItIs: 'A black-box technique that divides input data into valid and invalid partitions, selecting representative test values from each class under the assumption that all values in a partition are processed identically.',
    whatItIsHinglish: 'Inputs ko valid aur invalid partitions (classes) mein divide karna, aur har group se ek representative value select karke test karna.',
    whenToUse: 'When input values span a wide numeric or categorical range where testing every single value is impossible.',
    whenToUseHinglish: 'Jab input range badi ho aur har value ko alag se test karna possible na ho.',
    example: 'Age field (18 to 60 valid): Partition 1: Age < 18 (Invalid, e.g., 12) | Partition 2: 18 ≤ Age ≤ 60 (Valid, e.g., 30) | Partition 3: Age > 60 (Invalid, e.g., 75).',
    exampleHinglish: 'Age (18 se 60): Class 1 (Invalid: 12), Class 2 (Valid: 28), Class 3 (Invalid: 70).',
    remember: 'Reduces thousands of potential test cases to a handful of high-confidence checks.',
    rememberHinglish: 'Hazaron test cases ko reduce karke kuch high-confidence test cases banata hai.'
  },
  {
    id: 'boundary-value-analysis',
    name: 'Boundary Value Analysis (BVA)',
    type: 'Black-box',
    whatItIs: 'A black-box technique focusing on testing values strictly at the boundaries (minimum, maximum, just below, just above, and within) because defects cluster predominantly at input edges.',
    whatItIsHinglish: 'Range ke edges (Min, Max, Min-1, Min+1, Max-1, Max+1) par test karna kyunki zyadatar bugs boundary conditions par aate hain.',
    whenToUse: 'For numeric ranges, string length limits, date ranges, or array size boundaries.',
    whenToUseHinglish: 'Numbers, text length limits aur date ranges ke edge points test karne ke liye.',
    example: 'Input range 1 to 100: 2-Value BVA tests: 0 (invalid), 1 (min), 100 (max), 101 (invalid). 3-Value BVA adds: 2 (min+1) and 99 (max-1).',
    exampleHinglish: 'Range 1 se 100: Test points honge 0 (Min-1), 1 (Min), 2 (Min+1), 99 (Max-1), 100 (Max), 101 (Max+1).',
    remember: 'Bugs hide in boundaries. Always test Min-1, Min, Min+1, Max-1, Max, Max+1.',
    rememberHinglish: 'Bugs hamesha boundaries par milte hain! Min aur Max ke aas-paas zaroor test karein.'
  },
  {
    id: 'decision-table-testing',
    name: 'Decision Table Testing',
    type: 'Black-box',
    whatItIs: 'A systematic black-box technique capturing complex business logic with multiple combinations of boolean input conditions and their resulting output actions in a tabular matrix.',
    whatItIsHinglish: 'Multiple business conditions (True/False) aur unke output actions ko table form mein bana kar har combination ko test karna.',
    whenToUse: 'When business logic involves complex combinations of IF-THEN conditions (e.g., insurance quotes, credit card approvals, discount rules).',
    whenToUseHinglish: 'Complex business rules (e.g. loan approval, discount eligibility) test karne ke liye.',
    example: 'Credit Card Approval Table: (Good Credit? Y/N) + (Income > 50k? Y/N) → Card Approved vs Rejected.',
    exampleHinglish: 'Loan Approval: Credit Score > 750 + Income > 50k → Approved; varna Rejected.',
    remember: 'Guarantees 100% combination coverage of complex business rules without guessing.',
    rememberHinglish: 'Complex rules ke har scenario ki 100% coverage ensure karta hai.'
  },
  {
    id: 'state-transition-testing',
    name: 'State Transition Testing',
    type: 'Black-box',
    whatItIs: 'A technique testing how an application transitions from one valid state to another in response to specific user events or input triggers.',
    whatItIsHinglish: 'System ki states (e.g., Logged Out → Logged In → Locked) aur unke beech ke transitions ko test karna.',
    whenToUse: 'For state-machine driven systems: order lifecycles (Draft → Placed → Shipped → Delivered), ATM cards, login lockout sequences.',
    whenToUseHinglish: 'Order status flows (Ordered → Shipped → Delivered) aur authentication states test karne ke liye.',
    example: 'User Account State: Active → 3 Failed Login Attempts → Locked → Admin Reset → Active.',
    exampleHinglish: 'Account state: Active → 3 wrong passwords → Locked → OTP Verify → Active.',
    remember: 'Validates both valid state transitions and verifies invalid transitions are strictly rejected.',
    rememberHinglish: 'Valid transitions pass hone aur invalid transitions block hone dono ko verify karta hai.'
  },
  {
    id: 'use-case-testing',
    name: 'Use Case Testing',
    type: 'Black-box',
    whatItIs: 'Designs test cases based on real-world actor-system interaction scenarios, covering primary happy paths and alternate/exception flows.',
    whatItIsHinglish: 'Real-world user persona aur unke complete flow (Happy path + Exception flow) ke basis par test cases design karna.',
    whenToUse: 'For testing end-to-end user business workflows from a customer persona viewpoint.',
    whenToUseHinglish: 'End-to-end customer journey test karne ke liye.',
    example: 'ATM Withdrawal Use Case: Insert card → enter PIN → choose amount → dispense cash → print receipt → eject card.',
    exampleHinglish: 'ATM se paise nikalna: Card lagana → PIN daalna → Cash nikalna → Receipt lena.',
    remember: 'Aligns testing directly with real user operations.',
    rememberHinglish: 'Testing ko direct real-world user behavior ke sath align karta hai.'
  },
  {
    id: 'error-guessing',
    name: 'Error Guessing',
    type: 'Experience-based',
    whatItIs: 'An intuitive technique where experienced testers anticipate potential defects based on past experience, developer habits, and historical defect clusters.',
    whatItIsHinglish: 'Experience aur intuition ke dum par guess karna ki developer ne kahan galti ki hogi aur wahan edge cases test karna.',
    whenToUse: 'After formal test techniques are executed, to catch elusive edge cases and boundary anomalies.',
    whenToUseHinglish: 'Formal testing ke baad tricky edge cases pakadne ke liye.',
    example: 'Testing empty string, whitespace only, entering 0 in divisor fields, uploading 0-byte or corrupted files, pasting 10,000 characters into text fields.',
    exampleHinglish: 'Input mein sirf spaces daalna, divide by zero karna, empty file upload karna, 5000 characters paste karna.',
    remember: 'Combines experience, intuition, and knowledge of common coding mistakes.',
    rememberHinglish: 'Tester ke experience aur common developer mistakes ke knowledge par based hota hai.'
  }
];

export const TEST_DOCUMENTATION_ITEMS = [
  {
    title: 'Test Scenario',
    definition: 'A high-level test objective or one-line statement describing "What to test" from an end-user perspective.',
    definitionHinglish: 'Ek high-level summary statement jo batata hai "Kya test karna hai" (What to test).',
    example: 'TS_01: Verify user registration with email verification.',
    exampleHinglish: 'TS_01: Email verification ke saath user registration check karna.'
  },
  {
    title: 'Test Case',
    definition: 'A detailed step-by-step document with preconditions, test steps, test data, expected result, and execution state.',
    definitionHinglish: 'Step-by-step detailed document jisme Preconditions, Steps, Test Data aur Expected Result hota hai.',
    example: 'TC_01: Enter unregistered email, valid password, click Sign Up, verify verification email dispatched.',
    exampleHinglish: 'TC_01: Naya email aur password enter karein, Sign Up par click karein aur OTP email check karein.'
  },
  {
    title: 'Test Condition',
    definition: 'A specific item or event of an application that could be verified by one or more test cases.',
    definitionHinglish: 'Application ka wo specific rule ya condition jisko verify kiya ja sakta hai.',
    example: 'Password must contain at least 1 uppercase letter.',
    exampleHinglish: 'Password mein kam se kam 1 Capital letter hona mandatory hai.'
  },
  {
    title: 'Test Data',
    definition: 'Input values, sample records, and mock files explicitly prepared to feed into test cases during execution.',
    definitionHinglish: 'Test execution ke dauraan use hone wale valid/invalid sample inputs aur test accounts.',
    example: 'CSV file with 50 valid test credit cards and 10 expired cards.',
    exampleHinglish: 'Valid user IDs, invalid passwords aur dummy payment cards ki list.'
  },
  {
    title: 'Test Suite',
    definition: 'A logical collection of test cases grouped together for execution purposes (e.g., Smoke Suite, Regression Suite).',
    definitionHinglish: 'Ek specific purpose ke liye test cases ka group (e.g. Smoke Test Suite, Regression Suite).',
    example: 'Daily Sanity Suite containing 25 critical path tests.',
    exampleHinglish: 'Daily Sanity Suite jisme 20 main critical tests hain.'
  },
  {
    title: 'Test Plan',
    definition: 'A comprehensive document detailing testing scope, schedule, resources, environment, risks, and deliverables.',
    definitionHinglish: 'Comprehensive document jisme project testing ka Scope, Schedule, Resources, Tools aur Risks define hote hain.',
    example: 'Sprint 24 Test Plan authored by QA Lead outlining mobile app scope.',
    exampleHinglish: 'Sprint Test Plan jo batata hai ki is sprint mein kya test hoga aur kaun karega.'
  },
  {
    title: 'Test Strategy',
    definition: 'A high-level, organization-wide document establishing testing standards, frameworks, toolsets, and quality gates.',
    definitionHinglish: 'Company-level high-level document jo overall testing approaches aur quality standards define karta hai.',
    example: 'Company strategy requiring 80% unit test coverage and automated API regression in CI.',
    exampleHinglish: 'Company policy jisme 80% code coverage aur mandatory automated CI tests set hain.'
  },
  {
    title: 'Test Execution & Evidence',
    definition: 'The actual running of test cases against a build and capturing supporting screenshots, logs, or recordings as proof.',
    definitionHinglish: 'Build par actual test cases run karna aur Pass/Fail status ke sath screenshot/logs attach karna.',
    example: 'Attaching video recording and browser console logs to a failed test execution ticket.',
    exampleHinglish: 'Failed test case ke sath console error ka screenshot Jira mein lagana.'
  },
  {
    title: 'Test Summary Report',
    definition: 'A final deliverable summarizing test execution metrics, pass/fail percentage, open bugs, and release recommendations.',
    definitionHinglish: 'Testing complete hone par final report jisme Pass/Fail percentage, open bugs aur Go/No-Go release status hota hai.',
    example: 'Final Test Report stating 150 test cases executed, 98% pass rate, 0 critical bugs, recommendation: Proceed to Release.',
    exampleHinglish: 'Final report: 150 tests executed, 98% pass, 0 critical bugs → Go for Production Release.'
  }
];

export const SAMPLE_LOGIN_TEST_CASES: TestCaseRow[] = [
  {
    testCaseId: 'TC_LOGIN_001',
    scenario: 'Verify successful login with valid credentials',
    testSteps: [
      '1. Navigate to https://app.example.com/login',
      '2. Enter valid registered email "john.qa@example.com"',
      '3. Enter valid password "Pass@1234"',
      '4. Click on "Log In" button'
    ],
    testData: 'Email: john.qa@example.com | Pass: Pass@1234',
    expectedResult: 'User should be redirected to the Dashboard with a welcome banner.',
    actualResult: 'Redirected to Dashboard successfully.',
    status: 'Pass',
    severity: 'High',
    priority: 'P1'
  },
  {
    testCaseId: 'TC_LOGIN_002',
    scenario: 'Verify login fails with invalid password',
    testSteps: [
      '1. Navigate to login page',
      '2. Enter registered email "john.qa@example.com"',
      '3. Enter incorrect password "WrongPassword"',
      '4. Click on "Log In" button'
    ],
    testData: 'Email: john.qa@example.com | Pass: WrongPassword',
    expectedResult: 'Error message "Invalid email or password" displayed in red banner; user remains on login page.',
    actualResult: 'Error message displayed correctly.',
    status: 'Pass',
    severity: 'High',
    priority: 'P1'
  },
  {
    testCaseId: 'TC_LOGIN_003',
    scenario: 'Verify login validation on blank fields',
    testSteps: [
      '1. Navigate to login page',
      '2. Leave email and password fields empty',
      '3. Click on "Log In" button'
    ],
    testData: 'Email: "" | Pass: ""',
    expectedResult: 'Inline validation errors "Email is required" and "Password is required" appear under respective inputs.',
    actualResult: 'Inline errors displayed.',
    status: 'Pass',
    severity: 'Medium',
    priority: 'P2'
  },
  {
    testCaseId: 'TC_LOGIN_004',
    scenario: 'Verify account lockout after 5 consecutive failed attempts',
    testSteps: [
      '1. Enter valid email with wrong password 5 times in succession',
      '2. Click "Log In" on 5th attempt'
    ],
    testData: '5 failed login attempts within 2 minutes',
    expectedResult: 'Account temporarily locked for 15 minutes with message "Account locked. Please try again later or reset password".',
    actualResult: 'Account locked message displayed; security alert email received.',
    status: 'Pass',
    severity: 'Critical',
    priority: 'P1'
  }
];

export const SDLC_PHASES = [
  {
    phase: '1. Requirement Gathering & Analysis',
    description: 'Business analysts, product owners, and stakeholders define business objectives, user requirements, and constraints in BRD/SRS.',
    descriptionHinglish: 'Product Owners aur Business Analysts client requirements gather karke BRD aur SRS documents tayyar karte hain.',
    qaRole: 'Review requirements for testability, identify ambiguities or missing edge cases, and raise clarification queries early (Static Testing).',
    qaRoleHinglish: 'Requirements ko testability ke perspective se review karna, missing edge cases dhundhna aur questions raise karna (Static Testing).'
  },
  {
    phase: '2. System Design & Architecture',
    description: 'Architects and senior engineers design system architecture, database models, API contracts, UI wireframes, and technology stack (HLD/LLD).',
    descriptionHinglish: 'Architects aur Tech Leads system architecture, database design, API specifications aur UI wireframes banate hain (HLD/LLD).',
    qaRole: 'Review design documents, create high-level Test Strategy, understand module integrations, and plan test environment requirements.',
    qaRoleHinglish: 'Design documents review karna, High-level Test Strategy plan karna aur test environment ki requirements decide karna.'
  },
  {
    phase: '3. Development / Coding',
    description: 'Developers write source code, integrate third-party libraries, and write automated unit and component tests.',
    descriptionHinglish: 'Developers actual source code likhte hain aur unit tests run karte hain.',
    qaRole: 'Draft detailed test scenarios, write test cases, prepare test data, build automation test scripts, and set up test environments.',
    qaRoleHinglish: 'Detailed test cases likhna, test data prepare karna, automation framework setup karna aur staging environment ready karna.'
  },
  {
    phase: '4. Testing',
    description: 'The compiled build is deployed to the test environment. QA executes comprehensive functional, regression, API, and non-functional tests.',
    descriptionHinglish: 'QA team deployed build par Functional, Regression, API, Security aur Usability tests execute karti hai.',
    qaRole: 'Execute test cases, log detailed bug reports in Jira, retest bug fixes, run regression suites, and track quality metrics.',
    qaRoleHinglish: 'Test cases execute karna, Jira mein bugs log karna, bug fixes ko retest karna aur quality reports maintain karna.'
  },
  {
    phase: '5. Deployment / Release',
    description: 'Following QA sign-off and stakeholder UAT approval, the verified build is deployed to the production environment.',
    descriptionHinglish: 'QA sign-off aur UAT approval milne ke baad build ko live production environment par deploy kiya jaata hai.',
    qaRole: 'Perform post-deployment Smoke/Sanity testing in production to verify live system health.',
    qaRoleHinglish: 'Production par post-deployment Smoke testing run karke verify karna ki live system bilkul healthy hai.'
  },
  {
    phase: '6. Maintenance & Support',
    description: 'Ongoing monitoring, patching, performance tuning, and handling production defects reported by real users.',
    descriptionHinglish: 'Live application ki regular monitoring, performance tuning aur production bugs ko fix karna.',
    qaRole: 'Reproduce production bugs in staging, test hotfix releases, conduct Root Cause Analysis (RCA), and update regression suites.',
    qaRoleHinglish: 'Production issues ko reproduce karna, emergency hotfixes test karna aur regression suite update karna.'
  }
];

export const STLC_PHASES = [
  {
    phase: '1. Requirement Analysis',
    activities: 'QA analyzes SRS, User Stories, and Acceptance Criteria. Identifies testing types needed and raises RTM queries.',
    activitiesHinglish: 'QA team SRS aur User Stories ko analyze karti hai, testing scope define karti hai aur requirement doubts clear karti hai.',
    deliverables: 'RTM Draft, Requirement Queries List, Test Automation Feasibility Report.',
    deliverablesHinglish: 'RTM Draft, Requirement Queries List, Automation Feasibility Report.',
    entryCriteria: 'SRS / User Story document signed off and available.',
    entryCriteriaHinglish: 'SRS ya User Story document available aur approved hona.',
    exitCriteria: 'All requirement ambiguities resolved with PO/Dev.',
    exitCriteriaHinglish: 'Saare requirement doubts Product Owner/Dev ke sath resolve hona.'
  },
  {
    phase: '2. Test Planning',
    activities: 'QA Lead defines testing scope, strategy, test estimates, resource allocation, tool selection, and risk management.',
    activitiesHinglish: 'QA Lead testing scope, strategy, effort estimates, team allocation aur tools select karta hai.',
    deliverables: 'Master Test Plan Document, Effort Estimation Sheet.',
    deliverablesHinglish: 'Approved Test Plan Document, Estimation Sheet.',
    entryCriteria: 'Requirement analysis complete and queries resolved.',
    entryCriteriaHinglish: 'Requirement analysis complete hona aur queries resolve hona.',
    exitCriteria: 'Test Plan reviewed and approved by stakeholders.',
    exitCriteriaHinglish: 'Test Plan stakeholders dwara review aur sign-off hona.'
  },
  {
    phase: '3. Test Case Design / Development',
    activities: 'QA writes detailed test cases, applies testing techniques (BVA, EP), maps cases to RTM, and prepares test data.',
    activitiesHinglish: 'QA detailed test cases likhta hai (BVA, EP techniques use karke), test data banata hai aur RTM map karta hai.',
    deliverables: 'Approved Test Cases, Test Data sets, RTM Matrix.',
    deliverablesHinglish: 'Reviewed Test Cases, Test Data, RTM Matrix.',
    entryCriteria: 'Test Plan approved, requirements baselined.',
    entryCriteriaHinglish: 'Test Plan approved aur requirements finalized hona.',
    exitCriteria: 'Test cases reviewed, peer-checked, and approved.',
    exitCriteriaHinglish: 'Test cases ka peer-review complete aur approve hona.'
  },
  {
    phase: '4. Test Environment Setup',
    activities: 'Setting up hardware, staging servers, test databases, network mock servers, and test management tools.',
    activitiesHinglish: 'Staging servers, test databases, automation tools aur credentials ready karna.',
    deliverables: 'Ready Testbed / Staging Environment with Smoke Test Passed.',
    deliverablesHinglish: 'Live Staging Environment jahan Smoke Test pass ho chuka ho.',
    entryCriteria: 'Test Plan ready, environment requirements provided.',
    entryCriteriaHinglish: 'Environment hardware aur software requirements available hona.',
    exitCriteria: 'Test environment verified and smoke test passes.',
    exitCriteriaHinglish: 'Test environment ready ho aur initial build load ho rahi ho.'
  },
  {
    phase: '5. Test Execution',
    activities: 'Testers execute test cases on deployed build, record actual results, log defects in Jira, and retest bug fixes.',
    activitiesHinglish: 'QA build par test cases run karta hai, pass/fail note karta hai aur bugs Jira mein log karta hai.',
    deliverables: 'Executed Test Cases, Bug Reports, Execution Progress Logs.',
    deliverablesHinglish: 'Executed Test Reports, Logged Jira Defects, Retesting status.',
    entryCriteria: 'Build deployed, test environment ready, test cases prepared.',
    entryCriteriaHinglish: 'Build deploy ho chuki ho aur test cases ready hon.',
    exitCriteria: '100% test cases executed, all critical bugs resolved.',
    exitCriteriaHinglish: 'Saare critical test cases run ho chuke hon aur blocker bugs fixed hon.'
  },
  {
    phase: '6. Defect Reporting & Tracking',
    activities: 'Logging bugs with clear reproduction steps, screenshots, and logs; triaging with developers; retesting fixed bugs.',
    activitiesHinglish: 'Clear reproduction steps ke sath bugs log karna, dev team ke sath triage karna aur fixes retest karna.',
    deliverables: 'Defect Metrics, Triage Logs, Retesting Reports.',
    deliverablesHinglish: 'Defect Trend Reports, Retesting logs.',
    entryCriteria: 'Defects identified during test execution.',
    entryCriteriaHinglish: 'Test execution ke dauraan defects milna.',
    exitCriteria: 'Zero open Critical/High bugs; remaining bugs deferred with approval.',
    exitCriteriaHinglish: 'Zero open Blocker/Critical bugs hona.'
  },
  {
    phase: '7. Test Closure',
    activities: 'Analyze test metrics, evaluate exit criteria, document lessons learned, create test summary report, and archive test artifacts.',
    activitiesHinglish: 'Test metrics analyze karna, Final Test Summary Report banana aur lessons learned document karna.',
    deliverables: 'Final Test Summary Report, QA Sign-Off, Lessons Learned Document.',
    deliverablesHinglish: 'Final QA Sign-off Report, Lessons Learned Document.',
    entryCriteria: 'Testing completed and exit criteria satisfied.',
    entryCriteriaHinglish: 'Testing complete hona aur exit criteria satisfy hona.',
    exitCriteria: 'Test Summary Report signed off by QA Lead & PM.',
    exitCriteriaHinglish: 'Test Summary Report QA Lead aur PM dwara formally sign-off hona.'
  }
];

export const SDLC_VS_STLC_COMPARISON = [
  {
    parameter: 'Definition',
    sdlc: 'Complete lifecycle of software development from idea to decommissioning.',
    sdlcHinglish: 'Software develop karne ka complete lifecycle (Idea se lekar Maintenance tak).',
    stlc: 'Dedicated testing lifecycle focused on validating and ensuring product quality.',
    stlcHinglish: 'Dedicated testing lifecycle jiska focus product quality assure aur validate karna hai.'
  },
  {
    parameter: 'Primary Goal',
    sdlc: 'Deliver a functional, working software product to the client.',
    sdlcHinglish: 'Client ko working software product deliver karna.',
    stlc: 'Detect defects, verify requirements, and measure software quality.',
    stlcHinglish: 'Defects dhundhna, requirements verify karna aur quality measure karna.'
  },
  {
    parameter: 'Who is Involved',
    sdlc: 'Product Owners, Architects, Developers, QA, DevOps, Project Managers.',
    sdlcHinglish: 'Product Owners, Architects, Developers, QA, DevOps, PMs.',
    stlc: 'QA Leads, Manual Testers, Automation Engineers, QA Analysts.',
    stlcHinglish: 'QA Leads, Manual Testers, Automation Engineers, QA Analysts.'
  },
  {
    parameter: 'Phases',
    sdlc: 'Requirement → Design → Development → Testing → Deployment → Maintenance.',
    sdlcHinglish: 'Requirement → Design → Coding → Testing → Deployment → Maintenance.',
    stlc: 'Req Analysis → Test Plan → Test Design → Env Setup → Execution → Closure.',
    stlcHinglish: 'Req Analysis → Test Plan → Test Case Design → Env Setup → Execution → Closure.'
  },
  {
    parameter: 'Relationship',
    sdlc: 'STLC is an integral sub-process that runs concurrently with SDLC.',
    sdlcHinglish: 'STLC, SDLC ka hi ek important hissa hai jo sath-sath chalta hai.',
    stlc: 'Starts right during the requirement phase of SDLC and completes at test closure.',
    stlcHinglish: 'SDLC ke requirement phase se shuru hokar release sign-off par khatam hota hai.'
  }
];

export const AGILE_SCRUM_ITEMS = [
  {
    term: 'Agile Methodology',
    definition: 'An iterative, collaborative approach to software delivery where software is built in small, consumable increments, welcoming requirement changes.',
    definitionHinglish: 'Ek iterative aur flexible software development approach jisme software chhote-chhote increments mein develop hota hai aur requirement changes ko welcome kiya jaata hai.',
    qaContext: 'QA is embedded inside cross-functional teams rather than functioning as a siloed gatekeeper at the end.',
    qaContextHinglish: 'QA alag se aakhiri mein nahi baithta, balki cross-functional team ka hissa bankar sprint ke sath-sath test karta hai.'
  },
  {
    term: 'Scrum Framework',
    definition: 'A popular Agile framework organizing work into fixed-length cycles called Sprints (typically 1 to 3 weeks).',
    definitionHinglish: 'Agile ka ek popular framework jisme kaam ko 1 se 3 hafte ke fixed timeframes (Sprints) mein baanta jaata hai.',
    qaContext: 'QA tests stories continuously within the sprint (in-sprint testing) instead of a multi-month waterfall cycle.',
    qaContextHinglish: 'QA har sprint ke andar hi stories ko test karta hai (In-sprint testing).'
  },
  {
    term: 'User Story & Acceptance Criteria',
    definition: 'User Story: Feature written from end-user perspective ("As a [user], I want [goal], so that [value]"). Acceptance Criteria: Specific condition boundaries for the story to pass.',
    definitionHinglish: 'User Story: End-user perspective se likha feature requirement. Acceptance Criteria: Wo mandatory conditions jinko satisfy hone par hi story pass maani jayegi.',
    qaContext: 'QA writes test cases directly derived from Acceptance Criteria and adds negative edge cases.',
    qaContextHinglish: 'QA test cases direct Acceptance Criteria se banata hai aur usme negative scenarios add karta hai.'
  },
  {
    term: 'Definition of Done (DoD)',
    definition: 'A formal agreement checklist across the entire team determining when a user story is truly finished and shippable.',
    definitionHinglish: 'Poori team ka agreed checklist jo batata hai ki story kab poori tarah complete aur production-ready hai.',
    qaContext: 'Includes: Code reviewed, unit tests passing, QA test cases executed, no blocker bugs open, documentation updated.',
    qaContextHinglish: 'Isme shamil hai: Code review, unit tests passed, QA testing done, 0 blocker bugs, docs updated.'
  },
  {
    term: 'Scrum Ceremonies & QA Role',
    definition: 'Sprint Planning (QA estimates testing effort), Daily Standup (QA shares yesterday\'s testing, today\'s plan, blockers), Sprint Review (QA demonstrates tested features), Sprint Retrospective (QA shares testing process improvements).',
    definitionHinglish: 'Sprint Planning (QA testing estimate deta hai), Daily Standup (kya test kiya, kya karenge, kya blocker hai), Sprint Review (demo), Sprint Retrospective (process improvement discussion).',
    qaContext: 'Active participation in all ceremonies ensures testing risks are addressed before development begins.',
    qaContextHinglish: 'Sabhi meetings mein active rehne se testing risks coding shuru hone se pehle hi clear ho jaate hain.'
  }
];

export const BUG_LIFECYCLE_STATES = [
  {
    state: 'New',
    description: 'Bug is discovered and logged for the first time by QA with reproduction steps.',
    descriptionHinglish: 'QA ne naya bug dhundh kar reproduction steps ke sath Jira mein pehli baar log kiya.',
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    state: 'Assigned',
    description: 'QA Lead or Engineering Manager assigns the bug to a specific developer for investigation.',
    descriptionHinglish: 'Lead ya Manager ne bug ko kisi developer ko fix karne ke liye assign kiya.',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    state: 'Open',
    description: 'Developer is actively analyzing the defect, examining logs, and debugging code.',
    descriptionHinglish: 'Developer bug ko analyze kar raha hai aur code debug kar raha hai.',
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    state: 'Fixed',
    description: 'Developer has resolved the code issue, committed changes, and deployed a new test build.',
    descriptionHinglish: 'Developer ne issue fix karke code commit kar diya aur naya build deploy kiya.',
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    state: 'Pending Retest',
    description: 'Build is handed over to QA specifically for retesting the reported issue.',
    descriptionHinglish: 'Naya build QA ko retesting ke liye handover kiya gaya.',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  {
    state: 'Verified',
    description: 'QA retests the issue on the new build and confirms the bug is successfully fixed.',
    descriptionHinglish: 'QA ne naye build par test kiya aur confirm kiya ki bug successfully fix ho gaya hai.',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    state: 'Closed',
    description: 'QA formally closes the ticket with execution proof (screenshot/video).',
    descriptionHinglish: 'QA ne screenshot/video proof ke sath bug ticket ko formally close kar diya.',
    color: 'bg-emerald-200 text-emerald-900 border-emerald-300'
  },
  {
    state: 'Reopened',
    description: 'QA retests on the new build and discovers the bug still reproduces or was partially fixed.',
    descriptionHinglish: 'Retest karne par bug dobara reproduce hua ya sahi se fix nahi hua, isliye ticket Reopen kiya.',
    color: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    state: 'Rejected',
    description: 'Developer determines the behavior matches specifications as designed (Not a Bug).',
    descriptionHinglish: 'Developer ne reject kiya kyunki ye behavior requirement ke hisab se designed hai (Not a Bug).',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  {
    state: 'Duplicate',
    description: 'The bug was already logged in an existing Jira ticket with identical root cause.',
    descriptionHinglish: 'Ye bug pehle se hi kisi doosre Jira ticket mein logged hai.',
    color: 'bg-slate-100 text-slate-800 border-slate-200'
  },
  {
    state: 'Deferred',
    description: 'Defect is valid but low priority; business decides to postpone fix to a future sprint or release.',
    descriptionHinglish: 'Bug valid hai lekin low priority hai; fix ko future sprint ya release tak postpone kiya gaya.',
    color: 'bg-orange-100 text-orange-800 border-orange-200'
  }
];

export const SEVERITY_VS_PRIORITY_MATRIX = [
  {
    type: 'High Severity / High Priority (P1 / Critical)',
    scenario: 'Application crashes immediately when user clicks "Submit Payment" on checkout page.',
    scenarioHinglish: 'Checkout page par "Submit Payment" click karte hi poori app crash ho rahi hai.',
    impact: 'System is broken; direct business revenue is blocked. Must be fixed immediately in hours.',
    impactHinglish: 'System broken hai aur direct business loss ho raha hai. Isko turant kuch ghanto mein fix karna mandatory hai.'
  },
  {
    type: 'High Severity / Low Priority (P3 / Major)',
    scenario: 'Application crashes when generating an annual tax audit report for users running Windows 7.',
    scenarioHinglish: 'Windows 7 par rare annual tax audit report nikalne par app crash hoti hai.',
    impact: 'Critical crash, but affects less than 0.1% of legacy users; can be scheduled in next sprint.',
    impactHinglish: 'Crash bada hai par <0.1% purane users ko affect karta hai; next sprint mein fix kiya ja sakta hai.'
  },
  {
    type: 'Low Severity / High Priority (P1 / Minor)',
    scenario: 'Company brand name is misspelled on the public homepage banner ("Compnay" instead of "Company").',
    scenarioHinglish: 'Homepage banner par company ka naam galat spell ho gaya ("Compnay").',
    impact: 'No functional or technical damage, but severe reputational damage. Demands immediate patch.',
    impactHinglish: 'Functionally koi dikkat nahi hai par company reputation par asar padta hai, isliye turant fix chahiye.'
  },
  {
    type: 'Low Severity / Low Priority (P4 / Trivial)',
    scenario: 'A subtle tooltip text in the profile settings is slightly misaligned by 2 pixels.',
    scenarioHinglish: 'Profile settings mein ek tooltip icon 2 pixels misaligned hai.',
    impact: 'Cosmetic flaw; does not hinder user workflow. Can be fixed during UI cleanup backlog.',
    impactHinglish: 'Chhota cosmetic flaw hai jisse user ka koi kaam nahi rukta. UI cleanup ke time fix hoga.'
  }
];

export const CLIENT_VS_SERVER_VALIDATION = {
  definition: 'Validation ensures user data is correct and secure before saving it to databases. Modern systems apply validation at two distinct layers.',
  definitionHinglish: 'Validation ensure karti hai ki user data save hone se pehle accurate aur safe ho. Systems isko do layers par apply karte hain.',
  clientSide: {
    title: 'Client-Side Validation (Browser / App UI)',
    titleHinglish: 'Client-Side Validation (Browser / Mobile UI)',
    where: 'Executes locally in the client browser using HTML5/JavaScript before sending network request.',
    whereHinglish: 'Network request bhejne se pehle browser mein hi HTML5/JavaScript se execute hoti hai.',
    purpose: 'Improves User Experience (UX) by providing instant visual feedback without waiting for server network trips.',
    purposeHinglish: 'User ko instant visual feedback (red warning) dekar User Experience (UX) behtar banata hai.',
    examples: ['Checking if email contains "@" symbol', 'Verifying password is at least 8 characters long', 'Highlighting required blank fields in red'],
    examplesHinglish: ['Email mein "@" symbol check karna', 'Password minimum 8 characters check karna', 'Blank mandatory fields ko red highlight karna'],
    limitation: 'CANNOT be trusted for security because attackers can easily bypass browser checks via Postman, curl, or disabling JavaScript.',
    limitationHinglish: 'Security ke liye ispar bharosa nahi kiya ja sakta kyunki Postman ya curl se ise aasaani se bypass kiya ja sakta hai.'
  },
  serverSide: {
    title: 'Server-Side Validation (Backend API & Database)',
    titleHinglish: 'Server-Side Validation (Backend API & DB)',
    where: 'Executes on secure backend servers after receiving the HTTP request payload.',
    whereHinglish: 'Backend server par HTTP request aane ke baad execute hoti hai.',
    purpose: 'Guarantees System Security, Data Integrity, and Business Logic Enforcement.',
    purposeHinglish: 'System Security, Data Integrity aur Business Rules enforce karne ke liye mandatory hai.',
    examples: ['Checking if the email is already registered in the database', 'Verifying password hash against database records', 'Checking user permissions and role authorization'],
    examplesHinglish: ['Check karna ki email database mein already registered to nahi hai', 'Password hash verify karna', 'User ke roles aur permissions check karna'],
    rule: 'Never trust input from the client; always validate on the server.',
    ruleHinglish: 'Client ke input par kabhi andha bharosa na karein; server par validate karna mandatory hai.'
  }
};
