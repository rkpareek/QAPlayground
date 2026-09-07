import { InterviewQuestionItem } from '../types';

export const QA_INTERVIEW_QUESTIONS: InterviewQuestionItem[] = [
  // --- MANUAL TESTING (36 Questions, ~72%) ---
  {
    id: 1,
    question: "What is manual testing, and when is it preferred over automation?",
    category: "Manual Testing",
    answer: "Manual testing is software testing executed by a human tester without automation scripts to verify user experience, business workflows, and edge cases. It is preferred for exploratory testing, usability evaluations, ad-hoc testing, and rapidly changing early-stage features.",
    answerHinglish: "Manual Testing ek software testing process hai jisme human tester bina kisi automation script ke manually application test karta hai. Ye Exploratory testing, Usability testing, Ad-hoc testing, aur rapidly changing early-stage features ke liye best maana jaata hai.",
    example: "Evaluating whether a new onboarding checkout layout feels intuitive on varying mobile screens.",
    exampleHinglish: "Check karna ki naya checkout layout mobile screen par user ke liye intuitive aur easy lag raha hai ya nahi.",
    tags: ["Basics", "Manual vs Auto"]
  },
  {
    id: 2,
    question: "Why is software testing required in the development life cycle?",
    category: "Manual Testing",
    answer: "Software testing is required to identify defects early, ensure compliance with user requirements, prevent costly production failures, safeguard security, and maintain overall customer trust and product quality.",
    answerHinglish: "Testing ka main purpose early stage par Defects identify karna, user requirements verify karna, costly production failures prevent karna, aur customer trust maintain karke high software quality ensure karna hai.",
    example: "Finding a discount calculation bug in QA saves the company from major revenue loss in production.",
    exampleHinglish: "QA testing mein coupon discount calculation ka bug milne se company ka production par hone wala financial loss bach jaata hai.",
    tags: ["Fundamentals", "Quality"]
  },
  {
    id: 3,
    question: "What is the difference between Verification and Validation?",
    category: "Manual Testing",
    answer: "Verification is static testing checking 'Are we building the product right?' through reviews and walkthroughs without code execution. Validation is dynamic testing checking 'Are we building the right product?' by executing the software against user requirements.",
    answerHinglish: "Verification static testing hai jo check karta hai 'Are we building the product right?' (reviews aur walkthroughs bina code run kiye). Validation dynamic testing hai jo check karta hai 'Are we building the right product?' (actual software run karke test karna).",
    example: "Verification: Reviewing the SRS document. Validation: Executing login test cases in staging.",
    exampleHinglish: "Verification: SRS document review karna. Validation: Staging build par actual Login test cases execute karna.",
    tags: ["Fundamentals", "ISTQB"]
  },
  {
    id: 4,
    question: "What is the difference between Quality Assurance (QA) and Quality Control (QC)?",
    category: "Manual Testing",
    answer: "QA is process-oriented and proactive—it focuses on establishing processes, audits, and standards to prevent defects. QC is product-oriented and reactive—it focuses on testing the actual software build to identify existing defects.",
    answerHinglish: "QA process-oriented aur proactive hota hai jiska focus defects ko aane se rokna (prevent karna) hota hai. QC product-oriented aur reactive hota hai jisme actual software build test karke existing defects ko identify kiya jaata hai.",
    example: "QA: Defining coding and test review guidelines. QC: Executing regression test suites.",
    exampleHinglish: "QA: Code review aur test guidelines define karna. QC: Regression test cases execute karke bugs dhundhna.",
    tags: ["Concepts", "ISTQB"]
  },
  {
    id: 5,
    question: "Explain the difference between Error, Defect, Bug, and Failure.",
    category: "Manual Testing",
    answer: "An Error is a human mistake in code or design. A Defect is the resulting flaw inside the software artifact. A Bug is an informal term for a defect found during testing. A Failure occurs when a defect manifests during execution and causes the system to malfunction or crash.",
    answerHinglish: "Error developer se hui human mistake hai. Defect software code ya design mein aayi flaw hai. Bug testing ke dauraan mile defect ka informal term hai. Aur Failure tab hota hai jab defect execution ke time system ko crash ya malfunction kar deta hai.",
    example: "Developer writes wrong syntax (Error) → Code stores wrong value (Defect/Bug) → App crashes on checkout (Failure).",
    exampleHinglish: "Developer ne galat logic likha (Error) → Code ne wrong amount store kiya (Bug/Defect) → User checkout par app crash ho gaya (Failure).",
    tags: ["Defects", "ISTQB"]
  },
  {
    id: 6,
    question: "What is the difference between Severity and Priority? Give an example of High Severity / Low Priority.",
    category: "Manual Testing",
    answer: "Severity indicates the technical impact of a defect on the system (how badly it breaks functionality), usually decided by QA. Priority indicates how urgently the business needs the defect fixed, decided by Product/Triage. High Severity / Low Priority occurs when a severe crash happens in an obscure, rarely used legacy module.",
    answerHinglish: "Severity batati hai ki Bug ka technical impact kitna bada hai (system kitna affect hua), jo QA decide karta hai. Priority batati hai ki Bug ko kitni jaldi fix karna hai (business urgency), jo Product Manager decide karta hai.",
    example: "App crashes when generating an annual tax report for users on Windows 7 (High Severity, Low Priority).",
    exampleHinglish: "Windows 7 par rare annual tax report generate karne par app crash ho jaana (High Severity, Low Priority kyunki users bohot kam hain).",
    tags: ["Defects", "Severity/Priority"]
  },
  {
    id: 7,
    question: "Give an example of High Priority / Low Severity defect.",
    category: "Manual Testing",
    answer: "High Priority / Low Severity occurs when the technical defect is trivial or cosmetic, but the business/brand impact demands immediate resolution.",
    answerHinglish: "High Priority / Low Severity tab hota hai jab bug technical level par chhota ya cosmetic ho, lekin brand reputation ya business impact ki wajah se turant fix hona zaroori ho.",
    example: "Company CEO's name or brand logo is misspelled on the homepage header.",
    exampleHinglish: "Company homepage ke header par brand name ya logo ki spelling galat ho jaana (Immediate fix chahiye par functionality break nahi hai).",
    tags: ["Defects", "Severity/Priority"]
  },
  {
    id: 8,
    question: "What is the difference between Smoke Testing and Sanity Testing?",
    category: "Manual Testing",
    answer: "Smoke testing is broad and shallow, executed on initial builds to verify if critical core paths work before deeper testing. Sanity testing is narrow and deep, executed on relatively stable builds after bug fixes to verify a specific module works as expected.",
    answerHinglish: "Smoke Testing broad aur shallow hoti hai jo new build aane par critical core features verify karne ke liye ki jaati hai (build reject ya accept karne ke liye). Sanity Testing narrow aur deep hoti hai jo bug fixes ke baad specific module ko verify karne ke liye hoti hai.",
    example: "Smoke: Verify app launches and user can login. Sanity: Thoroughly test payment module after payment gateway patch.",
    exampleHinglish: "Smoke: Check karna ki app launch ho rahi hai aur login chal raha hai. Sanity: Payment gateway bug fix hone ke baad pure payment module ko test karna.",
    tags: ["Testing Types", "Smoke vs Sanity"]
  },
  {
    id: 9,
    question: "What is the difference between Regression Testing and Retesting?",
    category: "Manual Testing",
    answer: "Retesting verifies that a specific failed test case now passes after a developer fixed the defect. Regression testing verifies that recent code fixes or updates have not introduced new unintended bugs into existing untouched functionality.",
    answerHinglish: "Retesting ka matlab hai specific fixed bug ko dubara test karna ki wo pass ho raha hai ya nahi. Regression Testing ka purpose verify karna hai ki naye code changes ki wajah se existing functionality break toh nahi hui.",
    example: "Retesting: Re-checking bug #102 on login. Regression: Testing cart, profile, and search to ensure they still work.",
    exampleHinglish: "Retesting: Login bug #102 ko re-test karna. Regression: Login change hone ke baad Cart, Checkout aur Profile bhi test karna ki wo sahi chal rahe hain.",
    tags: ["Testing Types", "Regression"]
  },
  {
    id: 10,
    question: "What is the difference between Functional and Non-Functional Testing?",
    category: "Manual Testing",
    answer: "Functional testing validates WHAT the system does against functional requirements (business logic, calculations, user flows). Non-Functional testing validates HOW WELL the system performs (speed, scalability, security, usability, reliability).",
    answerHinglish: "Functional Testing check karti hai ki system 'KYA karta hai' (requirements, business logic, user flows). Non-Functional Testing check karti hai ki system 'KITNI ACHHI TARAH perform karta hai' (speed, security, scalability, usability).",
    example: "Functional: Can user submit form? Non-Functional: Does form submit in under 1 second under 500 concurrent users?",
    exampleHinglish: "Functional: Kya user registration form submit kar pa raha hai? Non-Functional: Kya 1000 concurrent users par form 1 second mein submit ho raha hai?",
    tags: ["Testing Types"]
  },
  {
    id: 11,
    question: "What is the difference between a Test Scenario and a Test Case?",
    category: "Manual Testing",
    answer: "A Test Scenario is a high-level one-liner describing 'What to test' from an end-to-end user perspective. A Test Case is a detailed document containing preconditions, exact step-by-step instructions, test data, and expected results describing 'How to test'.",
    answerHinglish: "Test Scenario high-level overview hota hai jo batata hai 'Kya test karna hai' (What to test). Test Case detailed document hota hai jisme step-by-step steps, preconditions, test data aur expected results hote hain jo batate hain 'Kaise test karna hai' (How to test).",
    example: "Scenario: Verify user login. Test Case: Enter invalid email, enter valid password, click submit, expect error banner.",
    exampleHinglish: "Scenario: Login functionality verify karo. Test Case: Valid email dalo, galat password dalo, Submit click karo, verify karo error banner dikh raha hai.",
    tags: ["Test Design", "Documentation"]
  },
  {
    id: 12,
    question: "What are the key components of a professional Test Case?",
    category: "Manual Testing",
    answer: "A standard test case includes: Test Case ID, Description/Title, Pre-conditions, Test Steps, Test Data, Expected Result, Actual Result, Execution Status (Pass/Fail/Blocked), Severity, Priority, and Post-conditions.",
    answerHinglish: "Ek standard Test Case mein ye fields hoti hain: Test Case ID, Scenario/Title, Pre-conditions, Step-by-Step Test Steps, Test Data, Expected Result, Actual Result, Status (Pass/Fail/Blocked), Severity, Priority, aur Post-conditions.",
    example: "TC_AUTH_01 | Verify Valid Login | Precondition: Registered User | Steps: 1. Enter email, 2. Enter pass, 3. Click Login | Expected: Dashboard displayed.",
    exampleHinglish: "TC_LOGIN_01 | Valid Login check | Precondition: User active hai | Steps: Email dalo, Password dalo, Login click karo | Expected: Dashboard open hona chahiye.",
    tags: ["Test Design", "Documentation"]
  },
  {
    id: 13,
    question: "What is Positive vs Negative testing?",
    category: "Manual Testing",
    answer: "Positive testing validates that the system behaves correctly with valid inputs and expected user paths (happy path). Negative testing validates that the system handles invalid, unexpected, out-of-boundary inputs gracefully without crashing and displays clear error messages.",
    answerHinglish: "Positive Testing valid data ke saath happy path test karti hai ki feature kaam kar raha hai. Negative Testing invalid, unexpected data ya galat input daal kar check karti hai ki system crash na ho aur proper error message show kare.",
    example: "Positive: Entering valid 10-digit phone number. Negative: Entering alphabets or 8 digits in phone field.",
    exampleHinglish: "Positive: 10-digit valid mobile number enter karna. Negative: Mobile number field mein alphabets ya 8 digits enter karna.",
    tags: ["Test Design"]
  },
  {
    id: 14,
    question: "Explain Boundary Value Analysis (BVA) with a practical example.",
    category: "Manual Testing",
    answer: "BVA is a black-box test design technique focusing on testing values at the boundaries of input partitions where defects most frequently occur: Min, Min+1, Min-1, Max, Max+1, and nominal values.",
    answerHinglish: "Boundary Value Analysis (BVA) ek black-box technique hai jo input range ke boundary edges par test karti hai, kyunki maximum bugs boundaries par hi aate hain: Min, Min+1, Min-1, Max, Max+1 aur Nominal values.",
    example: "Input field accepts age 18 to 60: Test boundaries at 17 (Invalid), 18 (Valid), 19 (Valid), 59 (Valid), 60 (Valid), 61 (Invalid).",
    exampleHinglish: "Agar Age field 18 se 60 allow karta hai: Test karo 17 (Invalid), 18 (Valid), 19 (Valid), 59 (Valid), 60 (Valid), 61 (Invalid).",
    tags: ["Test Techniques", "BVA"]
  },
  {
    id: 15,
    question: "Explain Equivalence Partitioning (EP) with a practical example.",
    category: "Manual Testing",
    answer: "EP divides input data into valid and invalid equivalence classes where the system treats all values within a class identically, reducing total test cases while maintaining test coverage.",
    answerHinglish: "Equivalence Partitioning (EP) input data ko valid aur invalid partitions (classes) mein baant deta hai. Har class se ek representative value test karne se time bachta hai aur full coverage milta hai.",
    example: "Password length 8-16 chars: Valid partition [8-16], Invalid partition 1 [<8], Invalid partition 2 [>16]. Pick one representative from each: 5, 10, 20.",
    exampleHinglish: "Password 8-16 chars: Valid partition [8-16], Invalid [<8], Invalid [>16]. Har partition se ek value lo: 5 (Invalid), 12 (Valid), 20 (Invalid).",
    tags: ["Test Techniques", "EP"]
  },
  {
    id: 16,
    question: "What is Decision Table Testing and when should QA use it?",
    category: "Manual Testing",
    answer: "Decision Table testing is a systematic technique to test combinations of complex business rules, inputs, and their resulting actions in a tabular matrix. Use it when business logic depends on multiple boolean conditions.",
    answerHinglish: "Decision Table Testing tab use ki jaati hai jab business logic multiple conditions ya inputs ke combinations par depend karti hai. Isme tabular matrix banakar har combination ka expected output test kiya jaata hai.",
    example: "Applying a coupon: Condition 1 (Cart > $50), Condition 2 (First order), Condition 3 (Active member) → Rule yields 20% discount or rejection.",
    exampleHinglish: "Coupon logic: Cart value > ₹500, First user, Active member. In teeno conditions ke True/False combinations par discount apply karke verify karna.",
    tags: ["Test Techniques"]
  },
  {
    id: 17,
    question: "What are the key phases of the Software Development Life Cycle (SDLC)?",
    category: "Manual Testing",
    answer: "SDLC phases include: 1. Requirement Gathering & Analysis, 2. System Design & Architecture, 3. Development/Coding, 4. Testing, 5. Deployment/Release, 6. Maintenance & Support.",
    answerHinglish: "SDLC ke main phases: 1. Requirement Gathering & Analysis, 2. Design, 3. Development/Coding, 4. Testing, 5. Deployment/Release, 6. Maintenance & Support.",
    example: "QA gets involved in Phase 1 (Requirement Review) to catch ambiguities before code is written.",
    exampleHinglish: "QA requirement analysis phase se hi shuru karta hai taaki code likhne se pehle hi requirements clear ho sakein.",
    tags: ["SDLC"]
  },
  {
    id: 18,
    question: "What are the phases of the Software Testing Life Cycle (STLC)?",
    category: "Manual Testing",
    answer: "STLC phases are: 1. Requirement Analysis, 2. Test Planning, 3. Test Case Design/Development, 4. Test Environment Setup, 5. Test Execution, 6. Defect Reporting & Retesting, 7. Test Closure & Summary Report.",
    answerHinglish: "STLC ke phases: 1. Requirement Analysis, 2. Test Planning, 3. Test Case Design, 4. Test Environment Setup, 5. Test Execution & Defect Reporting, 6. Retesting & Regression, 7. Test Closure & Summary Report.",
    example: "During Test Design, QA writes test cases and prepares test data while developers write code.",
    exampleHinglish: "Test Design phase mein QA test cases aur test data ready karta hai jab developers code likh rahe hote hain.",
    tags: ["STLC"]
  },
  {
    id: 19,
    question: "What is the difference between SDLC and STLC?",
    category: "Manual Testing",
    answer: "SDLC encompasses the entire software creation process from inception to maintenance, led by developers, PMs, and architects. STLC is a subset dedicated specifically to testing activities, verification, and quality reporting, led by the QA team.",
    answerHinglish: "SDLC pure software development ka overall process hai jo requirement se deployment tak chalta hai. STLC testing activities ka dedicated process hai jo QA team handle karti hai quality ensure karne ke liye.",
    example: "SDLC goal: Produce a working software product. STLC goal: Validate product quality and detect defects.",
    exampleHinglish: "SDLC ka goal working software deliver karna hai. STLC ka goal quality validate karke defects detect karna hai.",
    tags: ["SDLC", "STLC"]
  },
  {
    id: 20,
    question: "What is a Requirements Traceability Matrix (RTM) and why is it important?",
    category: "Manual Testing",
    answer: "An RTM is a document mapping business/functional requirements directly to test cases and logged defects. It ensures 100% test coverage, identifies gaps, and helps assess the impact of requirement changes.",
    answerHinglish: "RTM (Requirements Traceability Matrix) ek document hota hai jo har Requirement ko corresponding Test Cases aur Defects ke saath map karta hai, taaki 100% test coverage ensure ho sake aur koi feature test hone se na chhoote.",
    example: "A table showing Requirement ID 'REQ-01' mapped to Test Cases 'TC-01', 'TC-02' and Jira Bug 'BUG-45'.",
    exampleHinglish: "Ek table jisme Requirement 'REQ-01' mapped hai Test Case 'TC-01', 'TC-02' aur Jira Bug 'BUG-12' ke saath.",
    tags: ["Documentation", "RTM"]
  },
  {
    id: 21,
    question: "What are Entry Criteria and Exit Criteria in STLC?",
    category: "Manual Testing",
    answer: "Entry Criteria are prerequisite conditions required before a testing phase can start (e.g., stable build delivered, test data prepared). Exit Criteria are required conditions/metrics to conclude testing (e.g., 100% test execution, 95% pass rate, 0 critical bugs open).",
    answerHinglish: "Entry Criteria wo conditions hain jo kisi testing phase ko shuru karne se pehle poori honi chahiye (jaise stable build, approved test cases). Exit Criteria wo metrics hain jo testing complete mark karne ke liye zaroori hain (jaise 0 critical bugs, 100% test execution).",
    example: "Exit criterion for release: Zero Critical/High severity bugs in open or in-progress state.",
    exampleHinglish: "Production Release ka Exit Criteria: Ek bhi Critical ya High severity bug open state mein nahi hona chahiye.",
    tags: ["STLC", "Process"]
  },
  {
    id: 22,
    question: "Describe the standard Bug Life Cycle from creation to closure.",
    category: "Manual Testing",
    answer: "New (reported by QA) → Assigned (to developer) → Open (developer analyzing) → Fixed (code corrected) → Retest (QA re-verifies on new build) → Verified (QA confirms fix) → Closed. Alternative paths include: Reopened, Rejected, Duplicate, Deferred, or Won't Fix.",
    answerHinglish: "Bug Life Cycle: New (QA ne log kiya) → Assigned (Dev ko assign hua) → Open (Dev analyse kar raha hai) → Fixed (Code fix kiya) → Retest (QA re-verify kar raha hai) → Verified (Fix confirm hui) → Closed. Agar bug abhi bhi aa raha hai to Reopened hota hai.",
    example: "QA finds bug #44 (New), Dev assigns to self (Open), fixes in branch (Fixed), QA re-tests on staging (Verified) and Closes ticket.",
    exampleHinglish: "QA ko bug mila (New) → Dev ne fix kiya (Fixed) → QA ne verify karke pass kiya (Closed).",
    tags: ["Bug Life Cycle", "Defects"]
  },
  {
    id: 23,
    question: "What information should be included in an effective Bug Report?",
    category: "Manual Testing",
    answer: "A clear bug report includes: Bug ID, Summary/Title, Environment (OS, Browser, Device, Build #), Severity, Priority, Preconditions, Clear Step-by-Step reproduction steps, Test Data used, Expected Result, Actual Result, and Attachments (Screenshots, screen recording, console logs).",
    answerHinglish: "Ek achhe Bug Report mein: Clear Title, Environment details (OS, Browser, Build version), Severity/Priority, Preconditions, Step-by-Step reproduction steps, Test Data, Expected Result, Actual Result, aur Attachments (Screenshots/Logs) hone chahiye.",
    example: "Title: [Checkout] Clicking 'Apply Promo' causes 500 error when code has trailing space.",
    exampleHinglish: "Summary: [Cart] 'Apply Promo' par click karne par 500 error aa raha hai agar promo code ke aage space ho.",
    tags: ["Defects", "Reporting"]
  },
  {
    id: 24,
    question: "What is Defect Leakage and how is it calculated?",
    category: "Manual Testing",
    answer: "Defect Leakage is the percentage of bugs that bypassed QA testing and were discovered in UAT or production by end-users. Formula: (Defects found in Prod / Total Defects found in QA + Prod) * 100.",
    answerHinglish: "Defect Leakage wo percentage of bugs hai jo QA testing mein miss ho gaye aur UAT ya Production par end-users ko mile. Formula: (Defects in Prod / Total Defects in QA + Prod) * 100.",
    example: "5 bugs found in Prod, 95 found in QA → Defect Leakage = (5 / 100) * 100 = 5%.",
    exampleHinglish: "Agar 5 bugs Prod par mile aur 95 bugs QA mein mile the, toh Defect Leakage = (5 / 100) * 100 = 5%.",
    tags: ["Metrics", "Quality"]
  },
  {
    id: 25,
    question: "What is User Acceptance Testing (UAT) and who performs it?",
    category: "Manual Testing",
    answer: "UAT is the final phase of software testing performed by clients, business stakeholders, or real end-users in a production-like staging environment to validate business workflows and accept the product for release.",
    answerHinglish: "UAT (User Acceptance Testing) testing ka final phase hota hai jise actual client, business team ya real end-users execute karte hain production-like environment mein ye verify karne ke liye ki product business needs poori kar raha hai ya nahi.",
    example: "Hospital administrators testing patient intake workflows in UAT before the clinical system goes live.",
    exampleHinglish: "Banking operations team naye loan approval module ko production go-live se pehle UAT environment mein test karti hai.",
    tags: ["Testing Types", "UAT"]
  },
  {
    id: 26,
    question: "What is the difference between System Testing and System Integration Testing (SIT)?",
    category: "Manual Testing",
    answer: "System Testing evaluates the complete, integrated software product against specified requirements as a single standalone entity. SIT focuses specifically on data flow, communication, and interface contracts between multiple connected sub-systems and external third-party APIs.",
    answerHinglish: "System Testing pure integrated system ko ek standalone product ki tarah requirements ke against test karti hai. SIT (System Integration Testing) specifically multiple sub-systems aur third-party services (jaise payment gateways, CRM) ke beech data communication ko test karti hai.",
    example: "System Testing: Verifying search and cart. SIT: Verifying payment gateway, ERP, and shipping carrier integrations.",
    exampleHinglish: "System Testing: Search aur Cart test karna. SIT: Cart ka Payment Gateway aur Courier Logistics API ke saath data flow test karna.",
    tags: ["Testing Types", "SIT"]
  },
  {
    id: 27,
    question: "What is Agile and how does Scrum work for a QA tester?",
    category: "Manual Testing",
    answer: "Agile is an iterative software development methodology emphasizing flexibility, collaboration, and continuous delivery. Scrum divides work into 1-4 week Sprints where QA tests features continuously throughout the sprint rather than waiting for the end.",
    answerHinglish: "Agile ek iterative methodology hai jisme software small increments mein develop hota hai. Scrum mein 1-4 weeks ke Sprints hote hain, jisme QA sprint ke dauraan continuously test karta hai bina sprint ke end ka wait kiye.",
    example: "QA attends daily standup, participates in sprint planning, writes test cases during story development, and executes in-sprint testing.",
    exampleHinglish: "QA daily standup attend karta hai, sprint planning mein story estimate deta hai, aur dev complete hote hi in-sprint testing execute karta hai.",
    tags: ["Agile", "Scrum"]
  },
  {
    id: 28,
    question: "What is the difference between a User Story, Acceptance Criteria, and Definition of Done (DoD)?",
    category: "Manual Testing",
    answer: "A User Story is a feature requirement from the end-user perspective ('As a user, I want...'). Acceptance Criteria are specific functional boundaries for that individual story. Definition of Done (DoD) is the team-wide checklist required for ANY story to be released (e.g., code reviewed, unit tests pass, QA approved, regression passed).",
    answerHinglish: "User Story user perspective se feature requirement hoti hai ('As a user, I want...'). Acceptance Criteria us specific story ke pass hone ki boundaries hoti hain. Definition of Done (DoD) team ka universal checklist hota hai jo har story complete hone ke liye mandatory hota hai.",
    example: "Story: User can reset password. AC: Link expires in 15 mins. DoD: Automated tests added and QA signed off.",
    exampleHinglish: "User Story: Password reset. Acceptance Criteria: OTP 10 min mein expire ho. DoD: Code review pass, QA sign-off aur regression green.",
    tags: ["Agile", "Scrum"]
  },
  {
    id: 29,
    question: "What is Client-Side vs Server-Side Validation, and why can't QA rely only on Client-Side?",
    category: "Manual Testing",
    answer: "Client-side validation happens in the browser for instant user feedback (e.g., email format check). Server-side validation happens on the backend for data integrity and security (e.g., unique email, password hash). QA cannot rely only on client-side because browser validation can be easily bypassed via Postman or disabling JavaScript.",
    answerHinglish: "Client-side validation browser mein instant user feedback ke liye hoti hai (jaise empty field check). Server-side validation backend par security aur data integrity ke liye hoti hai. QA ko dono test karni hoti hain kyunki client-side validation Postman ya dev tools se bypass ho sakti hai.",
    example: "Client checks password has 8 characters; Server verifies password is correct and hashes it securely.",
    exampleHinglish: "Client check karta hai phone number 10 digits ka hai; Server check karta hai ki wo phone number database mein duplicate toh nahi hai.",
    tags: ["Validation", "Security"]
  },
  {
    id: 30,
    question: "What is Exploratory Testing and how is it structured?",
    category: "Manual Testing",
    answer: "Exploratory testing is simultaneous learning, test design, and test execution where the tester uses intuition, domain knowledge, and past defect patterns to uncover subtle bugs without pre-scripted steps. It is often structured using timeboxed test charters (session-based testing).",
    answerHinglish: "Exploratory Testing mein test design aur execution ek saath hota hai bina kisi rigid test case ke. Tester apni creativity, domain knowledge aur past bug experience use karke hidden defects discover karta hai (Timeboxed Charters ke through).",
    example: "A 45-minute exploratory session focusing exclusively on rapid consecutive button clicks and network interruptions.",
    exampleHinglish: "Ek 45-minute exploratory session jisme payment button ko double-click karke ya network drop karke edge cases test kiye jaate hain.",
    tags: ["Test Techniques"]
  },
  {
    id: 31,
    question: "How do you handle testing when requirements are incomplete or ambiguous?",
    category: "Manual Testing",
    answer: "Review existing documents, consult the Product Owner and developers early to clarify expectations, reference previous versions or competitor workflows, document all assumptions, and create exploratory test charters to validate functionality.",
    answerHinglish: "Jab requirements ambiguous hon, to turant Product Owner aur Developer se connect karke doubts clarify karein, competitor workflows dekhein, saari assumptions ko test cases mein document karein aur exploratory testing use karein.",
    example: "Logging a query in Jira: 'Clarification needed on max file upload size for invoice attachments.'",
    exampleHinglish: "Jira story par comment karna: 'Need clarification: File upload ki max size 5MB hai ya 10MB?'",
    tags: ["Practical QA", "Process"]
  },
  {
    id: 32,
    question: "What steps do you take when a critical defect is found in Production?",
    category: "Manual Testing",
    answer: "1. Immediately notify QA lead and engineering manager with clear steps. 2. Verify severity and customer impact. 3. Assist dev in reproducing locally. 4. Retest the hotfix build in staging. 5. Perform sanity check in production post-deployment. 6. Conduct Root Cause Analysis (RCA) to prevent recurrence.",
    answerHinglish: "1. Turant QA lead aur dev team ko exact reproduction steps aur logs ke saath inform karo. 2. Impact analyse karo. 3. Hotfix build ko staging par test karo. 4. Production deploy ke baad sanity check karo. 5. RCA (Root Cause Analysis) karo taaki aage aisa na ho.",
    example: "Payment processing down: QA logs blocker, tests emergency patch v1.2.1, and verifies live payment succeeds.",
    exampleHinglish: "Payment gateway down hone par: Blocker bug raise karo, hotfix test karo, aur deployment ke baad live payment verify karo.",
    tags: ["Practical QA", "Defects"]
  },
  {
    id: 33,
    question: "What is Risk-Based Testing and how do you prioritize test execution?",
    category: "Manual Testing",
    answer: "Risk-Based Testing prioritizes test features based on the probability of failure and the financial/business impact of that failure. High-risk, core revenue-generating features are tested earliest and most thoroughly.",
    answerHinglish: "Risk-Based Testing mein test execution business impact aur failure probability ke hisaab se prioritize kiya jaata hai. Jo features business ke liye sabse critical hain (jaise Checkout/Payments), unhe sabse pehle aur deeply test kiya jaata hai.",
    example: "In a banking app, fund transfer and transaction ledger are tested with highest priority over profile theme changes.",
    exampleHinglish: "Banking app mein Fund Transfer aur OTP validation ko Profile photo change se zyada high priority par test kiya jaata hai.",
    tags: ["Test Strategy"]
  },
  {
    id: 34,
    question: "What is Defect Density and how is it useful?",
    category: "Manual Testing",
    answer: "Defect Density measures the number of confirmed defects in a software component divided by the size of that component (e.g., per 1,000 lines of code or per user story). It identifies high-risk, fragile modules requiring refactoring or heavier testing.",
    answerHinglish: "Defect Density measure karti hai ki kisi module ke size ke proportion mein kitne bugs mile hain (e.g., Bugs per User Story ya per 1000 lines of code). Isse pata chalta hai ki kaunsa module unstable hai aur kahan zyada testing ki zaroorat hai.",
    example: "Checkout module has 15 bugs / 500 lines of code (high density), indicating need for developer refactoring.",
    exampleHinglish: "Checkout module mein 15 bugs mile sirf 2 stories mein (High Defect Density), matlab ye area fragile hai.",
    tags: ["Metrics"]
  },
  {
    id: 35,
    question: "What is End-to-End (E2E) Testing vs Compatibility Testing?",
    category: "Manual Testing",
    answer: "E2E testing validates complete business flows from start to finish across all integrated layers. Compatibility testing validates whether the application functions uniformly across various operating systems, browsers, screen resolutions, and network conditions.",
    answerHinglish: "E2E Testing pure user journey ko shuru se aakhri tak test karti hai (e.g., Signup se lekar Order Delivery tak). Compatibility Testing check karti hai ki application alag-alag browsers (Chrome, Safari), devices aur OS versions par properly chal rahi hai ya nahi.",
    example: "E2E: Sign up → Add item to cart → Pay with PayPal → Verify email invoice. Compatibility: Testing checkout on Safari on iOS 17 vs Chrome on Android 14.",
    exampleHinglish: "E2E: Signup → Search Item → Add to Cart → Payment → Invoice generation. Compatibility: Chrome, Safari aur Android browsers par layout aur buttons check karna.",
    tags: ["Testing Types"]
  },
  {
    id: 36,
    question: "What is the difference between Alpha Testing and Beta Testing?",
    category: "Manual Testing",
    answer: "Alpha testing is performed at the developer's site by internal employees and dedicated QA before external release. Beta testing is performed in real-world environments by a selected group of external end-users to gather feedback under real conditions.",
    answerHinglish: "Alpha Testing internal team aur QA karte hain release se pehle internal environment mein. Beta Testing real external users karte hain real-world environment mein feedback aur edge-case bugs find karne ke liye.",
    example: "Alpha: Internal QA and product team test v2.0 build. Beta: 500 public users invite-tested via TestFlight.",
    exampleHinglish: "Alpha: Company ke andar v2.0 build test karna. Beta: 500 real users ko early access dekar app test karwana.",
    tags: ["Testing Types"]
  },

  // --- API & POSTMAN TESTING (7 Questions, ~14%) ---
  {
    id: 37,
    question: "What is API testing and why is it important compared to UI testing?",
    category: "API Testing",
    answer: "API testing verifies application programming interfaces directly at the business logic layer without relying on the graphical user interface. It is faster, allows early defect detection before UI is built, and is much less prone to flaky UI changes.",
    answerHinglish: "API Testing mein hum UI ke bina directly backend endpoints par request bhejkar response, status codes aur business logic validate karte hain. Ye UI testing se bohot fast hoti hai aur frontend ready hone se pehle hi bugs pakad leti hai.",
    example: "Validating that POST /api/v1/orders returns HTTP 201 with correct total before web/mobile UI screens are developed.",
    exampleHinglish: "POST /api/v1/orders par JSON body bhejkar verify karna ki status 201 Created aa raha hai, jabki UI screen abhi ban rahi hai.",
    tags: ["API Basics"]
  },
  {
    id: 38,
    question: "What is the difference between GET, POST, PUT, PATCH, and DELETE HTTP methods?",
    category: "API Testing",
    answer: "GET retrieves resources without modifying data (idempotent). POST creates a new resource. PUT replaces an existing resource entirely. PATCH partially updates specific fields of an existing resource. DELETE removes a resource.",
    answerHinglish: "GET data fetch karta hai (read-only). POST naya resource create karta hai. PUT pure resource ko complete replace/update karta hai. PATCH specific fields ko partial update karta hai. DELETE resource ko remove karta hai.",
    example: "GET /users (Fetch all), POST /users (Create user), PUT /users/1 (Replace full user), PATCH /users/1 (Update only email), DELETE /users/1 (Remove).",
    exampleHinglish: "GET /users (Users dekho), POST /users (Naya user banao), PUT /users/1 (Pure profile ko replace karo), PATCH /users/1 (Sirf phone update karo), DELETE /users/1 (User delete karo).",
    tags: ["HTTP", "Methods"]
  },
  {
    id: 39,
    question: "Explain HTTP Status Codes: 200, 201, 400, 401, 403, 404, 500, 503.",
    category: "API Testing",
    answer: "200: OK (Success). 201: Created. 400: Bad Request (Invalid payload). 401: Unauthorized (Missing/invalid token). 403: Forbidden (Authenticated but lack permissions). 404: Not Found. 500: Internal Server Error. 503: Service Unavailable.",
    answerHinglish: "200: Success OK. 201: Resource Created. 400: Bad Request (Invalid input). 401: Unauthorized (Token missing/invalid). 403: Forbidden (Permission nahi hai). 404: URL/Resource Not Found. 500: Server Internal Error. 503: Server Unavailable/Down.",
    example: "Sending malformed JSON returns 400; Accessing admin endpoint with basic user token returns 403.",
    exampleHinglish: "Galat JSON format bhejne par 400 aana chahiye; Normal user token se Admin API call karne par 403 Forbidden aana chahiye.",
    tags: ["HTTP", "Status Codes"]
  },
  {
    id: 40,
    question: "What is the difference between Authentication (401) and Authorization (403)?",
    category: "API Testing",
    answer: "Authentication (401) verifies 'Who are you?' (identity validation via credentials or JWT token). Authorization (403) verifies 'What permissions do you have?' (access rights to a specific resource after identity is confirmed).",
    answerHinglish: "Authentication (401) check karti hai 'Aap kaun hain?' (Identity verify karna, e.g. Login credentials/Token). Authorization (403) check karti hai 'Aapke paas kya permission hai?' (Access rights check karna user identity confirm hone ke baad).",
    example: "Missing Bearer token gives 401 Unauthorized. Regular member trying to delete organization gives 403 Forbidden.",
    exampleHinglish: "Bina login token ke API call par 401 Unauthorized milega. Regular user agar kisi dusre company ka data delete kare to 403 Forbidden milega.",
    tags: ["Security", "API Basics"]
  },
  {
    id: 41,
    question: "What are Query Parameters vs Path Parameters in API requests?",
    category: "API Testing",
    answer: "Path parameters identify a specific resource path (e.g., `/users/{id}`). Query parameters filter, sort, or paginate that resource after the `?` delimiter (e.g., `/users?role=admin&limit=10`).",
    answerHinglish: "Path Parameters specific resource ko identify karne ke liye URL path ka part hote hain (e.g., `/users/{id}`). Query Parameters URL ke aage `?` ke baad data ko filter, sort ya paginate karne ke liye use hote hain (e.g., `/users?status=active&page=2`).",
    example: "GET /orders/1024 (Path param: specific order). GET /orders?status=shipped&page=2 (Query params: filter & page).",
    exampleHinglish: "GET /orders/105 (Path Parameter se specific order 105 nikala). GET /orders?city=Delhi&sort=asc (Query Parameter se filter kiya).",
    tags: ["HTTP", "API Basics"]
  },
  {
    id: 42,
    question: "What key elements do you validate when performing functional API testing?",
    category: "API Testing",
    answer: "1. HTTP Response Status Code. 2. Response Body payload & Schema (data types, mandatory keys). 3. Response Headers (Content-Type, Cache). 4. Response Time. 5. Error handling for negative payloads. 6. Database state change.",
    answerHinglish: "API Testing mein ye 6 cheezein validate karte hain: 1. Status Code (e.g. 200, 201). 2. Response Body aur JSON Schema (keys aur data types). 3. Response Time (SLA under 1s). 4. Response Headers. 5. Negative input handling. 6. Database state change.",
    example: "In Postman: `pm.response.to.have.status(200); pm.expect(pm.response.json().user.id).to.eql(12);`",
    exampleHinglish: "Postman test script mein: Status code 200 check karo, user.id number verify karo aur response time < 800ms assert karo.",
    tags: ["Postman", "API Validation"]
  },
  {
    id: 43,
    question: "How do Environment Variables and Collections in Postman assist QA testing?",
    category: "API Testing",
    answer: "Collections organize API requests into logical folders for automated runner execution. Environment Variables store dynamic data (e.g., `{{baseUrl}}`, `{{authToken}}`) so the same test suite runs seamlessly across Dev, QA, Staging, and Prod without editing URLs.",
    answerHinglish: "Postman Collections saari API requests ko module-wise organize karte hain. Environment Variables (jaise `{{baseUrl}}`, `{{token}}`) dynamic data store karte hain, jisse same test suite Dev, QA aur Staging environments par bina URL edit kiye run ho jaata hai.",
    example: "Setting `baseUrl = https://qa-api.com` in QA environment and passing JWT auth token dynamically from login response to subsequent requests.",
    exampleHinglish: "Login API ke response se JWT token nikaal kar environment variable `{{authToken}}` mein set karna aur baaki sabhi APIs mein automatically pass karna.",
    tags: ["Postman", "Automation"]
  },

  // --- AUTOMATION BASICS (4 Questions, ~8%) ---
  {
    id: 44,
    question: "What is Automation Testing, and what should vs should NOT be automated?",
    category: "Automation Basics",
    answer: "Automation testing uses software tools to execute pre-scripted tests against an application automatically. Automate: Repetitive regression suites, smoke tests, data-driven tests, and API validation. Do NOT automate: One-time tests, frequently changing UI, ad-hoc exploratory testing, and usability checks.",
    answerHinglish: "Automation Testing tools aur scripts ke zariye repetitive test cases ko automatically execute karti hai. Automate karein: Regression suite, Smoke test, Data-driven tests, API workflows. Automate NA karein: Frequently changing UI, Usability evaluation, One-time tests, Exploratory testing.",
    example: "Automating 200 nightly regression tests across browsers; testing new UI theme manually.",
    exampleHinglish: "Nightly 200 Regression tests ko Playwright se automatically run karna; Naye feature ka look-and-feel manually test karna.",
    tags: ["Automation Basics"]
  },
  {
    id: 45,
    question: "What is a Test Automation Framework and what are its core components?",
    category: "Automation Basics",
    answer: "A framework is a structured set of guidelines, libraries, and utilities that organize test scripts for maintainability and scalability. Core components: Test Runner, Page Object Model (POM) layer, Locators, Test Data manager, Assertion library, Configuration/Env management, and HTML Reporting.",
    answerHinglish: "Test Automation Framework rules, guidelines aur utilities ka ek structured architecture hota hai jo test automation ko maintainable aur scalable banata hai. Main components: Test Runner, POM Classes, Test Data Handler, Assertions, Config/Env Manager, aur HTML Reports.",
    example: "A Playwright TypeScript framework with page classes, `.env` config, and Allure reporting.",
    exampleHinglish: "Playwright TypeScript framework jisme Page classes, `.env` config, test data JSONs aur Allure test reports configured hote hain.",
    tags: ["Automation Framework"]
  },
  {
    id: 46,
    question: "What is the Page Object Model (POM) pattern and why is it used?",
    category: "Automation Basics",
    answer: "POM is a design pattern where each web page has a corresponding class containing its UI locators and action methods. Tests interact with page methods rather than direct locators, preventing code duplication and making maintenance easy when UI changes.",
    answerHinglish: "Page Object Model (POM) ek popular design pattern hai jisme har web page ke liye ek alag class hoti hai jisme us page ke locators aur action methods hote hain. Agar kal ko UI change hota hai to sirf us class mein locator update karna hota hai, 50 test files mein nahi.",
    example: "If 'Login' button ID changes, update only `LoginPage.ts` once instead of updating 50 separate test files.",
    exampleHinglish: "Agar 'Submit' button ka selector change hota hai to sirf `CheckoutPage.ts` mein ek jagah change hoga aur saare tests smoothly chalenge.",
    tags: ["Design Patterns", "Selenium/Playwright"]
  },
  {
    id: 47,
    question: "What is CI/CD and how does a QA engineer interact with automated CI pipelines?",
    category: "Automation Basics",
    answer: "CI (Continuous Integration) automatically builds and tests code when developers merge changes. CD (Continuous Delivery/Deployment) deploys tested builds to staging or prod. QA configures automated smoke/regression suites to run on pipeline triggers (e.g., Jenkins/GitHub Actions) and reviews build reports.",
    answerHinglish: "CI (Continuous Integration) code merge hote hi automated build aur tests run karta hai. CD (Continuous Deployment) pass hue build ko automatically deploy karta hai. QA apne automation regression suite ko CI pipeline (Jenkins / GitHub Actions) ke saath trigger karwata hai.",
    example: "GitHub Actions triggers automated Playwright API test suite on pull request merge.",
    exampleHinglish: "Developer ke PR raise karte hi GitHub Actions automatically smoke suite run karta hai aur failure aane par PR block kar deta hai.",
    tags: ["CI/CD", "DevOps"]
  },

  // --- SECURITY TESTING BASICS (3 Questions, ~6%) ---
  {
    id: 48,
    question: "What is Cross-Site Scripting (XSS) and what should a QA tester verify?",
    category: "Security Testing",
    answer: "XSS occurs when an application accepts untrusted user input without sanitization and renders it directly in the browser, allowing malicious JavaScript to execute. QA tests by inputting benign script tags (`<script>alert(1)</script>`) in text boxes, search fields, and profile names to ensure inputs are HTML-escaped.",
    answerHinglish: "XSS tab hota hai jab application bina sanitize kiye user input ko browser par render kar deti hai aur malicious JavaScript run ho jaati hai. QA inputs fields (Search, Comments) mein `<script>alert(1)</script>` daal kar check karta hai ki wo plain text render ho, script execute na ho.",
    example: "Entering `<script>alert('test')</script>` in a comment box should display as plain text, not trigger an alert popup.",
    exampleHinglish: "Comment box mein `<script>alert('test')</script>` enter karne par browser popup nahi aana chahiye, balki plain text dikhna chahiye.",
    tags: ["Security", "OWASP"]
  },
  {
    id: 49,
    question: "What is SQL Injection (SQLi) and what basic awareness should QA have?",
    category: "Security Testing",
    answer: "SQL Injection happens when untrusted user input is directly concatenated into a backend database query, allowing unauthorized database access or modification. QA tests input fields with single quotes (`' OR '1'='1`) to verify the app uses parameterized queries and does not expose SQL syntax errors.",
    answerHinglish: "SQL Injection tab hota hai jab user input directly database SQL query mein bina sanitize ya parameterize kiye jud jaata hai. QA login fields aur query parameters mein `' OR '1'='1` daal kar check karta hai ki database error leak na ho aur query bypass na ho.",
    example: "Entering `' OR 1=1 --` into a login field must return standard 'Invalid credentials' rather than logging in or leaking a database stack trace.",
    exampleHinglish: "Username field mein `' OR 1=1 --` daalne par normal 'Invalid username/password' error aana chahiye, login bypass nahi hona chahiye.",
    tags: ["Security", "OWASP"]
  },
  {
    id: 50,
    question: "What is Insecure Direct Object Reference (IDOR) and Broken Access Control?",
    category: "Security Testing",
    answer: "IDOR occurs when an application exposes a reference to internal objects (like database IDs) in URLs or parameters without verifying if the authenticated user owns that object. QA tests by logging in as User A and changing URL parameters to access User B's private invoices or profile.",
    answerHinglish: "IDOR tab hota hai jab API/URL mein direct database ID expose hoti hai bina ownership check kiye. QA User A banke login karta hai aur URL mein ID change karke dekhta hai ki kya wo User B ka private invoice ya data dekh pa raha hai. Aisa hone par 403 Forbidden aana chahiye.",
    example: "User A (ID #101) changing URL `GET /api/invoices/101` to `GET /api/invoices/102` must return 403 Forbidden, not User B's invoice.",
    exampleHinglish: "User A (ID 101) ne URL badalkar `GET /api/invoice/102` kiya, to server ko 403 Forbidden return karna chahiye, User B ka invoice nahi.",
    tags: ["Security", "Access Control"]
  }
];
