import { TerminologyItem } from '../types';

export const QA_TERMINOLOGY: TerminologyItem[] = [
  {
    id: 'srs',
    term: 'Software Requirement Specification',
    abbreviation: 'SRS',
    category: 'Requirements',
    shortDefinition: 'A formal document that details all functional and non-functional requirements, features, and constraints of a software application.',
    shortDefinitionHinglish: 'Ek formal document jisme software ke saare functional aur non-functional requirements, features aur technical constraints detail mein likhe hote hain.',
    example: 'Specifies that user login must lockout after 5 failed attempts within 10 minutes.',
    exampleHinglish: 'Specifies karta hai ki 5 baar galat password enter karne par account 10 minute ke liye lock ho jaana chahiye.'
  },
  {
    id: 'brd',
    term: 'Business Requirement Document',
    abbreviation: 'BRD',
    category: 'Requirements',
    shortDefinition: 'A high-level document written from the client or business perspective stating what the business problem is and what the expected solution must achieve.',
    shortDefinitionHinglish: 'Client ya business perspective se likha gaya high-level document jo batata hai ki business problem kya hai aur solution se kya achieve karna hai.',
    example: 'Online retail business requires a 1-click checkout option to reduce cart abandonment by 20%.',
    exampleHinglish: 'E-commerce business ko cart abandonment 20% kam karne ke liye 1-click checkout feature chahiye.'
  },
  {
    id: 'frd',
    term: 'Functional Requirement Document',
    abbreviation: 'FRD / FRS',
    category: 'Requirements',
    shortDefinition: 'A granular document defining exactly how individual features, user interactions, and screen elements must behave.',
    shortDefinitionHinglish: 'Ek detailed document jo define karta hai ki individual features, screen elements aur user interactions exactly kaise behave karenge.',
    example: 'The "Submit" button must disable immediately upon click until the API response arrives.',
    exampleHinglish: '"Submit" button click hote hi disable ho jaana chahiye jab tak API ka response na aa jaye.'
  },
  {
    id: 'requirement',
    term: 'Requirement',
    category: 'Requirements',
    shortDefinition: 'A capability or condition that a software product must satisfy to fulfill a contract, standard, or user need.',
    shortDefinitionHinglish: 'Wo zaroorat ya condition jo software ko kisi contract, user expectation ya standard ko fulfill karne ke liye poori karni hoti hai.',
    example: 'System must generate PDF invoices for every completed order.',
    exampleHinglish: 'Har completed order ke liye system ko PDF invoice generate karna zaroori hai.'
  },
  {
    id: 'functional-req',
    term: 'Functional Requirement',
    category: 'Requirements',
    shortDefinition: 'Specifies WHAT the system should do—the exact operations, data manipulation, business logic, and behavior.',
    shortDefinitionHinglish: 'Ye define karta hai ki system ko "KYA karna hai"—business logic, operations, calculations aur exact features.',
    example: 'User can reset their password via an email verification link.',
    exampleHinglish: 'User email verification link ke through apna password reset kar sakta hai.'
  },
  {
    id: 'non-functional-req',
    term: 'Non-Functional Requirement',
    category: 'Requirements',
    shortDefinition: 'Specifies HOW WELL the system performs its functions—including performance, scalability, security, usability, and reliability.',
    shortDefinitionHinglish: 'Ye define karta hai ki system apne functions ko "KITNI ACHHI TARAH perform karta hai"—speed, security, scalability aur reliability.',
    example: 'Payment API response time must be under 1.5 seconds under a concurrent load of 1,000 users.',
    exampleHinglish: '1000 concurrent users ke load par Payment API ka response time 1.5 seconds se kam hona chahiye.'
  },
  {
    id: 'acceptance-criteria',
    term: 'Acceptance Criteria',
    abbreviation: 'AC',
    category: 'Requirements',
    shortDefinition: 'Predefined conditions and boundaries that a user story or feature must meet for the product owner to mark it as accepted.',
    shortDefinitionHinglish: 'Wo predefined conditions jo kisi User Story ko Product Owner dwara "Accepted" mark karne ke liye pass karni zaroori hoti hain.',
    example: 'Given a registered email, when clicking "Forgot Password", then a 6-digit OTP is sent within 15 seconds.',
    exampleHinglish: 'Registered email daal kar "Forgot Password" click karne par 15 second mein 6-digit OTP aana chahiye.'
  },
  {
    id: 'test-scenario',
    term: 'Test Scenario',
    category: 'Test Execution & Metrics',
    shortDefinition: 'A high-level test idea or single statement describing "What to test" from a user perspective.',
    shortDefinitionHinglish: 'Ek high-level statement ya test idea jo batata hai ki "Kya test karna hai" (What to test).',
    example: 'Verify login functionality with valid and invalid credentials.',
    exampleHinglish: 'Login functionality ko valid aur invalid credentials ke saath verify karo.'
  },
  {
    id: 'test-case',
    term: 'Test Case',
    category: 'Test Execution & Metrics',
    shortDefinition: 'A detailed document containing preconditions, step-by-step instructions, test data, expected result, and actual result describing "How to test".',
    shortDefinitionHinglish: 'Detailed document jisme preconditions, step-by-step steps, test data aur expected result hote hain jo batate hain "Kaise test karna hai".',
    example: 'TC_LOGIN_01: Enter "user@test.com", enter valid password "Pass123", click Login, expect Dashboard navigation.',
    exampleHinglish: 'TC_LOGIN_01: Email enter karo, Password enter karo, Login click karo, Dashboard open hona chahiye.'
  },
  {
    id: 'test-data',
    term: 'Test Data',
    category: 'Test Execution & Metrics',
    shortDefinition: 'Input values, credentials, and environmental data specifically prepared and fed into the application to execute test cases.',
    shortDefinitionHinglish: 'Wo input values, user credentials ya datasets jo test cases ko execute karne ke liye specifically taiyar kiye jaate hain.',
    example: 'A test CSV file containing 100 valid credit card numbers and 20 expired cards.',
    exampleHinglish: 'Ek test CSV file jisme 100 valid test credit cards aur 20 expired cards ka data ho.'
  },
  {
    id: 'test-suite',
    term: 'Test Suite',
    category: 'Test Execution & Metrics',
    shortDefinition: 'A logical collection of multiple test cases grouped together for a specific testing goal or build verification.',
    shortDefinitionHinglish: 'Multiple test cases ka ek grouped collection jo kisi specific goal (jaise Smoke test ya Regression) ke liye ek saath run kiya jaata hai.',
    example: 'Smoke Test Suite containing 15 critical path test cases run before every release.',
    exampleHinglish: 'Smoke Test Suite jisme 15 critical test cases hain jo har build release se pehle run hote hain.'
  },
  {
    id: 'test-plan',
    term: 'Test Plan',
    category: 'SDLC & STLC',
    shortDefinition: 'A comprehensive document describing testing scope, approach, resources, schedule, deliverables, and risk mitigation strategies.',
    shortDefinitionHinglish: 'Ek comprehensive document jo testing ka scope, approach, resources, timeline aur risk management strategy describe karta hai.',
    example: 'QA Lead creates the sprint test plan allocating 3 testers and defining staging server scope.',
    exampleHinglish: 'QA Lead sprint test plan banata hai jisme 3 testers ka allocation aur testing timeline define hoti hai.'
  },
  {
    id: 'test-strategy',
    term: 'Test Strategy',
    category: 'SDLC & STLC',
    shortDefinition: 'A high-level, organization-wide document establishing the standard testing methodology, tools, environments, and quality guidelines.',
    shortDefinitionHinglish: 'Ek organization-level high-level document jo company ke standard testing guidelines, tools, automation approach aur quality standards define karta hai.',
    example: 'Company strategy stating all microservices must have 80% automated unit tests and automated regression runs in CI.',
    exampleHinglish: 'Company guideline jisme likha hai ki har service ke liye CI mein automated regression run hona mandatory hai.'
  },
  {
    id: 'rtm',
    term: 'Requirements Traceability Matrix',
    abbreviation: 'RTM',
    category: 'SDLC & STLC',
    shortDefinition: 'A matrix mapping requirements directly to their corresponding test cases and defects to ensure 100% test coverage and no missed requirements.',
    shortDefinitionHinglish: 'Ek table/matrix jo har Requirement ko uske corresponding Test Cases aur Defects ke saath link karti hai taaki 100% test coverage confirm ho sake.',
    example: 'Req ID #104 mapped to Test Case #TC-12 and #TC-13, showing full verification coverage.',
    exampleHinglish: 'Requirement REQ-01 ko Test Case TC-01 aur TC-02 se map kiya gaya hai.'
  },
  {
    id: 'traceability',
    term: 'Traceability',
    category: 'SDLC & STLC',
    shortDefinition: 'The ability to track the relationship and lifecycle of a requirement forwards (to test cases and defects) and backwards (to client business needs).',
    shortDefinitionHinglish: 'Requirement ke lifecycle ko forward (test cases aur defects tak) aur backward (business goals tak) track karne ki ability.',
    example: 'Tracing a critical production bug back to an unverified acceptance criterion.',
    exampleHinglish: 'Production bug ko track karke dekhna ki kaunsa acceptance criteria test hone se chhoot gaya tha.'
  },
  {
    id: 'error',
    term: 'Error (Mistake)',
    category: 'Defects & Quality',
    shortDefinition: 'A human action or misunderstanding made by a developer, analyst, or tester that produces an incorrect result in code or design.',
    shortDefinitionHinglish: 'Developer, designer ya tester se hui human mistake jiski wajah se code ya logic mein galat output generate hota hai.',
    example: 'Developer accidentally writes `if (age > 18)` instead of `if (age >= 18)` in validation logic.',
    exampleHinglish: 'Developer ne galti se `age >= 18` ki jagah `age > 18` likh diya.'
  },
  {
    id: 'defect',
    term: 'Defect',
    category: 'Defects & Quality',
    shortDefinition: 'A flaw or imperfection found in a software artifact, code, or requirement during the development or testing phase.',
    shortDefinitionHinglish: 'Development ya testing ke dauraan software code, design ya document mein payi gayi flaw ya kami.',
    example: 'Tester finds that entering a valid discount code returns a 500 internal server error in staging.',
    exampleHinglish: 'Valid discount code daalne par system 500 internal server error de raha hai.'
  },
  {
    id: 'bug',
    term: 'Bug',
    category: 'Defects & Quality',
    shortDefinition: 'An informal industry term for a defect or discrepancy between expected behavior and actual application behavior noticed during execution.',
    shortDefinitionHinglish: 'Testing ke dauraan notice kiya gaya issue jahan actual behavior expected behavior se match nahi karta.',
    example: 'Profile avatar image fails to render after saving.',
    exampleHinglish: 'Save click karne ke baad user profile photo load nahi ho rahi hai.'
  },
  {
    id: 'failure',
    term: 'Failure',
    category: 'Defects & Quality',
    shortDefinition: 'The manifestation of a defect during runtime where the software system cannot perform its required function or crashes.',
    shortDefinitionHinglish: 'Runtime par defect ke execute hone se jab system apna kaam nahi kar pata ya crash ho jaata hai, use Failure kehte hain.',
    example: 'Checkout page crashes completely with a white screen when an end-user applies a coupon in production.',
    exampleHinglish: 'Production par end-user ke coupon apply karne par pure checkout page ka crash ho jaana.'
  },
  {
    id: 'incident',
    term: 'Incident',
    category: 'Defects & Quality',
    shortDefinition: 'Any unplanned interruption, unexpected behavior, or deviation that requires investigation to determine if it is a defect or environment issue.',
    shortDefinitionHinglish: 'Koi bhi unexpected deviation ya system interruption jise investigate karke pata lagaya jaata hai ki ye code bug hai ya server issue.',
    example: 'Database connection timeout triggered on the staging environment during night batch runs.',
    exampleHinglish: 'Staging environment par raat ko database timeout trigger ho jaana.'
  },
  {
    id: 'severity',
    term: 'Severity',
    category: 'Defects & Quality',
    shortDefinition: 'The technical impact and degree of harm a defect causes on the system functionality, operations, or data integrity.',
    shortDefinitionHinglish: 'Ye batata hai ki kisi Bug ka technical impact kitna serious hai (system functionality kitni break hui hai).',
    example: 'Critical severity: Complete database corruption or application crash on startup.',
    exampleHinglish: 'Critical Severity: App launch par hi crash ho jaana ya payment data corrupt ho jaana.'
  },
  {
    id: 'priority',
    term: 'Priority',
    category: 'Defects & Quality',
    shortDefinition: 'The urgency and business importance indicating how quickly a defect must be resolved and deployed.',
    shortDefinitionHinglish: 'Ye batati hai ki Bug ko kitni jaldi fix karna chahiye (business urgency aur release timeline).',
    example: 'High priority: Company logo is misspelled on the homepage header—functionally minor, but urgent for brand reputation.',
    exampleHinglish: 'High Priority: Homepage par brand name ki spelling galat hona—turant fix karna zaroori hai.'
  },
  {
    id: 'regression-testing',
    term: 'Regression Testing',
    category: 'Testing Types',
    shortDefinition: 'Testing existing, previously working features to verify that recent code changes, bug fixes, or enhancements have not introduced new defects.',
    shortDefinitionHinglish: 'Regression Testing ka purpose ye verify karna hai ki new changes ya bug fixes ki wajah se existing functionality break nahi hui hai.',
    example: 'Running 50 core workflow tests after the developer updated the third-party payment gateway library.',
    exampleHinglish: 'Payment library update hone ke baad Cart, Login aur Orders ke saare existing test cases verify karna.'
  },
  {
    id: 'retesting',
    term: 'Retesting',
    category: 'Testing Types',
    shortDefinition: 'Specifically executing the exact failed test cases again on a new build to confirm that a reported defect has indeed been resolved.',
    shortDefinitionHinglish: 'Retesting ka matlab hai us specific failed test case ko dubara run karna ye confirm karne ke liye ki bug fix ho gaya hai.',
    example: 'Re-running TC_LOGIN_02 to confirm that entering an invalid password now correctly shows the error message.',
    exampleHinglish: 'TC_LOGIN_02 ko re-run karke verify karna ki invalid password ka error banner ab sahi aa raha hai.'
  },
  {
    id: 'smoke-testing',
    term: 'Smoke Testing (Build Verification)',
    category: 'Testing Types',
    shortDefinition: 'A shallow, wide set of critical path tests executed on initial builds to verify if the build is stable enough for deeper testing.',
    shortDefinitionHinglish: 'Smoke Testing initial build aane par critical core features check karne ke liye ki jaati hai ye dekhne ke liye ki build stable hai ya reject karni hai.',
    example: 'Verifying app launches, user can log in, and home feed renders before starting full sprint testing.',
    exampleHinglish: 'Check karna ki application open ho rahi hai aur user login kar pa raha hai.'
  },
  {
    id: 'sanity-testing',
    term: 'Sanity Testing',
    category: 'Testing Types',
    shortDefinition: 'A narrow, deep set of tests executed on a stable build following a specific bug fix or minor release to verify that specific module works.',
    shortDefinitionHinglish: 'Sanity Testing bug fix ke baad kisi particular module ko quickly aur deeply test karne ke liye ki jaati hai.',
    example: 'Testing only the shopping cart calculations and discount codes thoroughly after a pricing bug fix.',
    exampleHinglish: 'Pricing bug fix hone ke baad sirf Cart aur Checkout calculations ko deeply verify karna.'
  },
  {
    id: 'verification',
    term: 'Verification',
    category: 'SDLC & STLC',
    shortDefinition: 'Static evaluation process checking "Are we building the product right?" by reviewing documents, designs, and code without executing it.',
    shortDefinitionHinglish: 'Static testing process jo check karta hai "Are we building the product right?" (bina code execute kiye documents aur design review karna).',
    example: 'Peer-reviewing SRS document, code walk-throughs, and inspecting test cases.',
    exampleHinglish: 'SRS document ka review aur test case review karna.'
  },
  {
    id: 'validation',
    term: 'Validation',
    category: 'SDLC & STLC',
    shortDefinition: 'Dynamic testing process checking "Are we building the right product?" by executing software against actual user requirements.',
    shortDefinitionHinglish: 'Dynamic testing process jo check karta hai "Are we building the right product?" (actual software ko execute karke test karna).',
    example: 'Executing functional tests, UI tests, and UAT sessions with real end-users.',
    exampleHinglish: 'Functional test cases execute karna aur user workflows test karna.'
  },
  {
    id: 'qa',
    term: 'Quality Assurance (QA)',
    abbreviation: 'QA',
    category: 'Defects & Quality',
    shortDefinition: 'A process-oriented, proactive discipline focused on establishing and improving testing standards and processes to prevent defects.',
    shortDefinitionHinglish: 'Process-oriented aur proactive approach jiska focus defects ko prevent karna aur testing processes ko improve karna hai.',
    example: 'Auditing code review checklists and setting up automated CI linting gates.',
    exampleHinglish: 'Quality process aur testing standards set karna taaki bugs kam se kam generate hon.'
  },
  {
    id: 'qc',
    term: 'Quality Control (QC)',
    abbreviation: 'QC',
    category: 'Defects & Quality',
    shortDefinition: 'A product-oriented, reactive discipline focused on identifying and finding defects in the actual software through test execution.',
    shortDefinitionHinglish: 'Product-oriented aur reactive approach jisme actual software build ko test karke defects find kiye jaate hain.',
    example: 'Executing test cases and logging bugs in Jira.',
    exampleHinglish: 'Test cases execute karna aur Jira mein bugs report karna.'
  },
  {
    id: 'quality',
    term: 'Software Quality',
    category: 'Defects & Quality',
    shortDefinition: 'The degree to which a software system satisfies both stated requirements and implied user needs, performance, and reliability expectations.',
    shortDefinitionHinglish: 'Wo standard jahan software stated requirements aur user expectations (performance, security, usability) ko poori tarah satisfy kare.',
    example: 'A banking app that is fast, secure, accurate, and easy to use meets high software quality.',
    exampleHinglish: 'Ek banking app jo fast, secure aur bug-free ho, high quality maani jaati hai.'
  },
  {
    id: 'sdlc',
    term: 'Software Development Life Cycle',
    abbreviation: 'SDLC',
    category: 'SDLC & STLC',
    shortDefinition: 'The end-to-end framework defining the phases involved in building software from requirement inception to decommissioning.',
    shortDefinitionHinglish: 'Software develop karne ka complete framework jo Requirement Gathering se lekar Deployment aur Maintenance tak chalta hai.',
    example: 'Requirement → Design → Development → Testing → Deployment → Maintenance.',
    exampleHinglish: 'Requirement → Design → Development → Testing → Deployment → Maintenance.'
  },
  {
    id: 'stlc',
    term: 'Software Testing Life Cycle',
    abbreviation: 'STLC',
    category: 'SDLC & STLC',
    shortDefinition: 'The structured sequence of specific activities conducted during the testing process to ensure software quality goals are achieved.',
    shortDefinitionHinglish: 'Testing process ka systematic step-by-step sequence jo quality ensure karne ke liye QA team execute karti hai.',
    example: 'Requirement Analysis → Test Planning → Test Design → Env Setup → Test Execution → Defect Tracking → Closure.',
    exampleHinglish: 'Requirement Analysis → Test Planning → Test Design → Environment Setup → Test Execution → Defect Reporting → Closure.'
  },
  {
    id: 'uat',
    term: 'User Acceptance Testing',
    abbreviation: 'UAT',
    category: 'Testing Types',
    shortDefinition: 'The final phase of functional testing performed by end-users, clients, or domain experts to validate business readiness for production release.',
    shortDefinitionHinglish: 'Testing ka aakhri phase jise client ya real end-users perform karte hain ye verify karne ke liye ki product production release ke liye ready hai.',
    example: 'Finance team testing tax calculation reports in pre-prod before go-live.',
    exampleHinglish: 'Business team live deployment se pehle final product ko approve karti hai.'
  },
  {
    id: 'sit',
    term: 'System Integration Testing',
    abbreviation: 'SIT',
    category: 'Testing Types',
    shortDefinition: 'Testing the end-to-end integration and data transfer between multiple interconnected modules, databases, and external third-party systems.',
    shortDefinitionHinglish: 'Multiple interconnected modules aur third-party systems ke beech data flow aur integration ko test karna.',
    example: 'Verifying e-commerce order data flows to inventory, payment gateway, and shipping carrier systems.',
    exampleHinglish: 'Order place hone par inventory database, payment gateway aur courier API ke beech communication verify karna.'
  },
  {
    id: 'production',
    term: 'Production Environment (Live / Prod)',
    category: 'Environment & Release',
    shortDefinition: 'The real-world, live server environment where actual end-users and customers interact with the released software system.',
    shortDefinitionHinglish: 'Live server environment jahan real end-users aur customers actual software use karte hain.',
    example: 'https://app.mycompany.com where live financial transactions happen.',
    exampleHinglish: 'https://amazon.in ya https://swiggy.com jahan real transactions hoti hain.'
  },
  {
    id: 'environment',
    term: 'Test Environment (Testbed / Staging)',
    category: 'Environment & Release',
    shortDefinition: 'A dedicated hardware, software, network, and database setup mimicking production where testers execute test cases safely.',
    shortDefinitionHinglish: 'Ek isolated server aur database setup jo production jaisa hota hai taaki QA bina risk ke testing kar sake.',
    example: 'QA staging cluster configured with mock payment gateways and isolated test databases.',
    exampleHinglish: 'QA Staging server jahan test credit cards aur dummy data use kiya jaata hai.'
  },
  {
    id: 'build',
    term: 'Build',
    category: 'Environment & Release',
    shortDefinition: 'A standalone executable version of the software compiled by developers from source code and handed to QA for testing.',
    shortDefinitionHinglish: 'Developers dwara source code compile karke banaya gaya executable package (APK, IPA ya deployable artifacts) jo QA ko test karne ke liye diya jaata hai.',
    example: 'Android APK build v2.4.0-b18 delivered to the QA team for testing.',
    exampleHinglish: 'Testing ke liye deliver hua Android APK build v2.4.0-b18.'
  },
  {
    id: 'release',
    term: 'Release',
    category: 'Environment & Release',
    shortDefinition: 'The formal distribution of an approved, thoroughly tested software build to end-users or clients.',
    shortDefinitionHinglish: 'QA dwara approve kiya gaya final tested build jo officially end-users ke liye deploy kiya jaata hai.',
    example: 'Version 2.4.0 published on the Apple App Store and Google Play Store.',
    exampleHinglish: 'App Store aur Play Store par published Version 2.4.0.'
  },
  {
    id: 'deployment',
    term: 'Deployment',
    category: 'Environment & Release',
    shortDefinition: 'The technical process of moving compiled software artifacts and configuration files onto target servers or cloud instances.',
    shortDefinitionHinglish: 'Compiled code aur application files ko target server ya cloud environment par install/host karne ka technical process.',
    example: 'Deploying the Docker container image to the Kubernetes staging cluster.',
    exampleHinglish: 'Docker image ko staging Kubernetes server par deploy karna.'
  },
  {
    id: 'hotfix',
    term: 'Hotfix (Emergency Patch)',
    category: 'Environment & Release',
    shortDefinition: 'An urgent, targeted code fix developed and deployed directly to production to resolve a critical, blocking issue outside regular release cycles.',
    shortDefinitionHinglish: 'Production par aayi kisi critical ya blocking bug ko quickly fix karke turant deploy kiya gaya emergency code patch.',
    example: 'Patching a security vulnerability in production authentication service within 2 hours of discovery.',
    exampleHinglish: 'Payment failure bug ko regular release ka wait kiye bina 2 ghante mein fix karke live karna.'
  },
  {
    id: 'patch',
    term: 'Patch',
    category: 'Environment & Release',
    shortDefinition: 'A small piece of software or code update designed to fix bugs, update drivers, or address vulnerabilities in an existing release.',
    shortDefinitionHinglish: 'Chhota code update jo kisi existing version mein specific bugs fix karne ya security update ke liye release hota hai.',
    example: 'Security Patch v1.4.1 fixing token expiration bug.',
    exampleHinglish: 'Security Patch v1.4.1 jo token expiration issue fix karta hai.'
  },
  {
    id: 'baseline',
    term: 'Baseline',
    category: 'Requirements',
    shortDefinition: 'A formally approved and frozen version of a specification, design, or test artifact that serves as the official reference point for future changes.',
    shortDefinitionHinglish: 'Kisi requirement document ya design ka officially approved aur freeze kiya gaya version jise future comparison ke liye base maana jaata hai.',
    example: 'SRS v1.0 signed off by stakeholders; any future feature requests require a formal Change Request (CR).',
    exampleHinglish: 'Approved SRS v1.0 jisme naya change lane ke liye Change Request (CR) lagana padega.'
  },
  {
    id: 'entry-criteria',
    term: 'Entry Criteria',
    category: 'SDLC & STLC',
    shortDefinition: 'The set of prerequisite conditions that must be fulfilled before a specific testing phase or activity is allowed to start.',
    shortDefinitionHinglish: 'Wo conditions jo kisi testing phase ko shuru karne se pehle poori honi mandatory hoti hain.',
    example: 'Entry criteria for test execution: stable build deployed, test cases reviewed, test data seeded.',
    exampleHinglish: 'Execution shuru karne ka criteria: Stable build milna, test cases ready hona, test data available hona.'
  },
  {
    id: 'exit-criteria',
    term: 'Exit Criteria (Definition of Done for Testing)',
    category: 'SDLC & STLC',
    shortDefinition: 'The defined metrics and conditions that must be satisfied to declare a testing phase officially complete and ready for sign-off.',
    shortDefinitionHinglish: 'Wo conditions aur quality metrics jo testing phase ko officially complete declare karne ke liye mandatory hoti hain.',
    example: 'Exit criteria: 100% test cases executed, 95% pass rate, 0 Critical or High severity bugs open.',
    exampleHinglish: 'Testing complete hone ka criteria: Saare test cases run ho chuke hon, 0 critical open bugs hon.'
  },
  {
    id: 'test-closure',
    term: 'Test Closure',
    category: 'SDLC & STLC',
    shortDefinition: 'The final phase of STLC where test deliverables, execution metrics, lessons learned, and sign-off reports are finalized and archived.',
    shortDefinitionHinglish: 'STLC ka aakhri phase jahan final Test Summary Report prepare hoti hai, metrics analyze hote hain aur testing sign-off diya jaata hai.',
    example: 'Publishing the Final Test Summary Report and conducting a QA retrospective.',
    exampleHinglish: 'Final Test Summary Report share karna aur QA retrospective meeting hold karna.'
  },
  {
    id: 'test-coverage',
    term: 'Test Coverage',
    category: 'Test Execution & Metrics',
    shortDefinition: 'A quantitative metric indicating the percentage of requirements, code paths, or features exercised by a set of test cases.',
    shortDefinitionHinglish: 'Ye batata hai ki aapke test cases ne total requirements ya features ka kitna percentage cover kiya hai.',
    example: 'Formula: (Requirements Tested / Total Requirements) * 100 = 94% coverage.',
    exampleHinglish: 'Formula: (Tested Requirements / Total Requirements) * 100 = 95% Coverage.'
  },
  {
    id: 'defect-leakage',
    term: 'Defect Leakage',
    category: 'Test Execution & Metrics',
    shortDefinition: 'The ratio of defects discovered in production (or UAT) by users that were missed by the QA testing team during staging testing.',
    shortDefinitionHinglish: 'Wo percentage of bugs jo QA testing ke dauraan miss ho gaye aur direct Production ya UAT par discover hue.',
    example: 'Formula: (Bugs found in Prod / Total Bugs found in QA + Prod) * 100.',
    exampleHinglish: 'Formula: (Prod Bugs / (QA Bugs + Prod Bugs)) * 100.'
  },
  {
    id: 'defect-density',
    term: 'Defect Density',
    category: 'Test Execution & Metrics',
    shortDefinition: 'The number of confirmed defects identified in a module relative to the size of the module (e.g., per Function Point or KLOC).',
    shortDefinitionHinglish: 'Module ke size ke mukable usme mile bugs ka proportion (e.g. Bugs per 1000 lines of code ya per User Story).',
    example: '12 defects found across 1,000 lines of code = 12 defects / KLOC.',
    exampleHinglish: '1000 lines of code mein 12 bugs = 12 Defect Density.'
  },
  {
    id: 'rca',
    term: 'Root Cause Analysis',
    abbreviation: 'RCA',
    category: 'Defects & Quality',
    shortDefinition: 'A systematic problem-solving technique aimed at identifying the fundamental originating reason a defect occurred to prevent recurrence.',
    shortDefinitionHinglish: 'Kisi bug ki root wajah (fundamental cause) pata karne ka analysis taaki future mein aisi galti dubara na ho.',
    example: '5-Whys analysis reveals payment bug occurred because API timeout wasn\'t configured in the configuration file.',
    exampleHinglish: '5-Whys analysis se pata lagana ki payment bug config timeout miss hone ki wajah se aaya.'
  },
  {
    id: 'risk',
    term: 'Risk',
    category: 'SDLC & STLC',
    shortDefinition: 'A potential future event or uncertainty with negative consequences on project quality, schedule, budget, or system reliability.',
    shortDefinitionHinglish: 'Aisa koi potential factor ya uncertainty jo project timeline, quality ya budget ko negatively affect kar sakta hai.',
    example: 'Third-party SMS gateway API might go down during Black Friday peak hours.',
    exampleHinglish: 'Peak sale day par third-party payment gateway down ho jaane ka risk.'
  },
  {
    id: 'assumption',
    term: 'Assumption',
    category: 'Requirements',
    shortDefinition: 'A factor or condition considered to be true or certain during test planning without concrete proof.',
    shortDefinitionHinglish: 'Aisi condition jise testing plan karte waqt bina concrete proof ke sach maan liya jaata hai.',
    example: 'Assuming the staging database will have at least 50,000 records mirroring production.',
    exampleHinglish: 'Ye assume karna ki staging database mein production jaisa 50,000 user records ka data hoga.'
  },
  {
    id: 'dependency',
    term: 'Dependency',
    category: 'Requirements',
    shortDefinition: 'A condition or deliverable from an external team, system, or vendor that is required before a testing activity can proceed.',
    shortDefinitionHinglish: 'Kisi external team, API ya module par nirbharta jiske bina aage ki testing start nahi ho sakti.',
    example: 'Payment checkout testing is dependent on the backend team delivering the Stripe sandbox webhook API.',
    exampleHinglish: 'Checkout testing ke liye backend team dwara Stripe webhook API provide karne ki dependency.'
  },
  {
    id: 'blocker',
    term: 'Blocker',
    category: 'Defects & Quality',
    shortDefinition: 'A severe defect or environment outage that completely prevents further test execution or feature progress.',
    shortDefinitionHinglish: 'Aisa critical bug ya server issue jiski wajah se aage ki testing poori tarah ruk jaati hai.',
    example: 'Login API returns 500 error, blocking all downstream testing of dashboard, profile, and checkout modules.',
    exampleHinglish: 'Login hi fail ho raha hai, jisse dashboard aur cart test karna block ho gaya.'
  }
];
