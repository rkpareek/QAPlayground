export const SECURITY_FUNDAMENTALS = {
  whatIs: 'Security testing is a type of software testing that uncovers vulnerabilities, threats, security risks, and malicious exploits in a software application to protect data confidentiality, integrity, and availability.',
  whatIsHinglish: 'Security Testing ek aisa testing type hai jo software application ke andar ke security vulnerabilities, threats aur risks ko identify karta hai taaki user data ki Confidentiality, Integrity aur Availability safe rahe.',
  whyQA: 'QA testers do not need to be ethical hackers or penetration testers, but must possess practical security awareness to verify input validation, authentication guards, role permissions, and session protection during normal functional testing.',
  whyQAHinglish: 'QA testers ko certified ethical hacker hone ki zaroorat nahi hai, par functional testing ke dauran unhe basic security checks (Input validation, Token expiration, Role-based permissions, XSS attacks) verify karna zaroor aana chahiye.',
  corePillars: [
    {
      title: 'Confidentiality',
      desc: 'Ensuring sensitive data (passwords, payment cards, personal PII) is accessible only to authorized entities.',
      descHinglish: 'Ye ensure karna ki sensitive data (passwords, credit cards, PII) sirf authorized users hi access kar sakein.'
    },
    {
      title: 'Integrity',
      desc: 'Guaranteeing that data is accurate, trustworthy, and protected against unauthorized modification in transit or at rest.',
      descHinglish: 'Data bilkul accurate aur trustworthy rahe aur transit ya database mein bina permission alter na kiya ja sake.'
    },
    {
      title: 'Authentication',
      desc: 'Verifying the true identity of a user or service claiming to access the system.',
      descHinglish: 'User ya client ki real identity ko verify karna (Login, OTP, JWT token ke through).'
    },
    {
      title: 'Authorization',
      desc: 'Enforcing strict role-based boundaries to ensure users can only access their permitted resources.',
      descHinglish: 'Role-based access control enforce karna taaki normal user admin resources access na kar sake.'
    },
    {
      title: 'Availability',
      desc: 'Ensuring services remain operational, resilient, and accessible to legitimate users without denial of service.',
      descHinglish: 'Ensure karna ki servers aur services hamesha up aur running rahein legitimate users ke liye.'
    }
  ]
};

export const COMMON_VULNERABILITIES = [
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    whatItMeans: 'Occurs when an application takes untrusted user input without sanitization or escaping and renders it directly in the HTML document, allowing malicious JavaScript to execute in another user\'s browser.',
    whatItMeansHinglish: 'Jab application user input ko bina sanitize kiye direct HTML page par render kar deti hai, jisse attacker ka malicious JavaScript code doosre users ke browser mein execute ho jaata hai.',
    simpleExample: 'Entering `<script>alert("XSS")</script>` into a blog comment field. If unsanitized, visiting users execute that script and leak their session cookies.',
    simpleExampleHinglish: 'Comment box mein `<script>alert("XSS")</script>` daalna. Agar sanitize na ho to page kholne wale har user ke browser mein script run hokar cookies leak ho sakti hain.',
    whatQAShouldCheck: [
      'Enter benign HTML tags (`<b>Test</b>`, `<h1>Header</h1>`) and script tags (`<script>alert(1)</script>`) into text boxes, search fields, comments, and profile inputs.',
      'Verify the app renders the input as plain text (escaped HTML: `&lt;script&gt;`) rather than interpreting it as live code.',
      'Verify `HttpOnly` cookie flags are set so JavaScript cannot read session cookies.'
    ],
    whatQAShouldCheckHinglish: [
      'Search bar, comment fields aur profile inputs mein HTML tags (`<b>bold</b>`) aur script tags (`<script>alert(1)</script>`) enter karke test karein.',
      'Verify karein ki app script ko execute karne ke bajaye clean text ki tarah display kar rahi hai.',
      'Check karein ki session cookies par `HttpOnly` flag enabled ho taaki JavaScript unhe access na kar sake.'
    ]
  },
  {
    id: 'sqli',
    name: 'SQL Injection (SQLi)',
    whatItMeans: 'Occurs when untrusted user input is directly concatenated into database SQL queries without parameterization, allowing an attacker to manipulate query structure to read or destroy database data.',
    whatItMeansHinglish: 'Jab user input ko directly SQL query mein concatenate kar diya jaata hai bina parameterized queries ke, jisse attacker SQL logic modify karke database ka data leak ya delete kar sakta hai.',
    simpleExample: 'Entering `admin\' OR \'1\'=\'1` into the username field on a login form to bypass password checks.',
    simpleExampleHinglish: 'Login box mein `admin\' OR \'1\'=\'1` enter karke password check bypass karne ki koshish karna.',
    whatQAShouldCheck: [
      'Input characters with special SQL significance (such as single quotes `\'`, double quotes `"`, semicolons `;`, `--`) into all input fields and URL query parameters.',
      'Verify the application handles these gracefully with standard validation errors, and never leaks raw database error messages or stack traces.',
      'Verify backend developers use parameterized queries / ORM prepared statements.'
    ],
    whatQAShouldCheckHinglish: [
      'Input boxes aur URL query parameters mein SQL characters jaise `\'`, `"`, `;`, `--` enter karke test karein.',
      'Verify karein ki application clean validation error de aur backend database error stack trace screen par na dikhaye.',
      'Ensure karein ki backend mein ORM / Prepared Statements use ho rahe hain.'
    ]
  },
  {
    id: 'csrf',
    name: 'Cross-Site Request Forgery (CSRF)',
    whatItMeans: 'An attack that tricks a currently authenticated user into submitting an unauthorized request or transaction to a web application they are logged into without their knowledge.',
    whatItMeansHinglish: 'Ek aisa attack jisme logged-in user ko kisi malicious link par click karwake unki active session cookies ke sath unauthorized transaction execute karwaya jaata hai.',
    simpleExample: 'While logged into a banking site, a user visits a malicious forum containing a hidden image tag `<img src="https://bank.com/transfer?amount=1000&to=attacker">` that automatically executes using the user\'s active cookies.',
    simpleExampleHinglish: 'Banking site par login rehne ke dauran user kisi forum par click karta hai jahan background image tag se bina uski marzi ke transfer request execute ho jaati hai.',
    whatQAShouldCheck: [
      'Verify that all state-changing operations (POST, PUT, DELETE) require a unique, unpredictable Anti-CSRF token or `SameSite=Strict` cookie attribute.',
      'Verify sensitive actions (like password reset or email change) require re-entering the current password.'
    ],
    whatQAShouldCheckHinglish: [
      'Check karein ki sabhi state-changing API calls (POST, PUT, DELETE) mein unique Anti-CSRF token ya `SameSite=Strict` cookie header laga ho.',
      'Sensitive actions (jaise email change ya password reset) par current password confirm karwaya jaata ho.'
    ]
  },
  {
    id: 'broken-access-control',
    name: 'Broken Access Control & IDOR',
    whatItMeans: 'Insecure Direct Object Reference (IDOR) and broken access controls happen when the system fails to verify whether the authenticated user actually owns or has permission to view the requested object ID.',
    whatItMeansHinglish: 'Insecure Direct Object Reference (IDOR) tab hota hai jab server ye check karna bhool jaata hai ki logged-in user us specific record/ID ko dekhne ka haqdaar hai ya nahi.',
    simpleExample: 'User A logs in, views their invoice at URL `/api/invoices/1001`, then changes the URL to `/api/invoices/1002` and is able to see User B\'s private billing details.',
    simpleExampleHinglish: 'User A apne invoice `/api/invoices/1001` dekhne ke baad URL badal kar `/api/invoices/1002` kar deta hai aur User B ka private invoice dekh leta hai.',
    whatQAShouldCheck: [
      'Log in with two different test accounts (User A and User B).',
      'Attempt to access, edit, or delete User B\'s resources using User A\'s session token.',
      'Attempt to access Admin URLs (e.g., `/admin/users`) with a basic user account, verifying status 403 Forbidden is returned.'
    ],
    whatQAShouldCheckHinglish: [
      'Do alag test accounts (User A aur User B) se login karein.',
      'User A ke session token se User B ke resources ko fetch ya modify karne ki koshish karein.',
      'Normal user account se Admin pages (jaise `/admin/dashboard`) open karke verify karein ki 403 Forbidden mil raha hai.'
    ]
  },
  {
    id: 'sensitive-data-exposure',
    name: 'Sensitive Data Exposure & Insecure Storage',
    whatItMeans: 'Failing to adequately encrypt or protect sensitive user credentials, credit cards, health records, or authentication tokens.',
    whatItMeansHinglish: 'Sensitive user data (passwords, credit cards, health info) ko bina encryption ke plain text mein store ya transmit karna.',
    simpleExample: 'Storing passwords in plaintext in the database or transmitting credit card numbers over unencrypted HTTP.',
    simpleExampleHinglish: 'Database mein passwords ko plain text mein save karna ya bina HTTPS ke credit card number send karna.',
    whatQAShouldCheck: [
      'Verify entire web application enforces HTTPS (TLS) and redirects HTTP to HTTPS.',
      'Verify password fields mask characters with asterisks/dots on UI.',
      'Inspect network tab to verify passwords and sensitive tokens are not logged in plain text in query parameters or browser console logs.',
      'Verify session tokens expire automatically upon logout or inactivity timeout.'
    ],
    whatQAShouldCheckHinglish: [
      'Check karein ki poori application HTTPS enforce karti hai aur HTTP requests automatically HTTPS par redirect hoti hain.',
      'UI par password fields dots/asterisks se masked hon.',
      'Network tab aur browser console mein passwords ya sensitive tokens plain text mein print na ho rahe hon.',
      'Logout karne par ya inactivity ke baad session token automatically expire hota ho.'
    ]
  }
];

export const OWASP_TOP_10_OVERVIEW = [
  {
    rank: 'A01:2021',
    name: 'Broken Access Control',
    nameHinglish: 'Broken Access Control (Access Rules Bypass)',
    desc: 'Restrictions on what authenticated users are allowed to do are not properly enforced.',
    descHinglish: 'Users ko unke allowed roles ke bahar permissions mil jaana.'
  },
  {
    rank: 'A02:2021',
    name: 'Cryptographic Failures',
    nameHinglish: 'Cryptographic Failures (Data Encryption Failures)',
    desc: 'Failures related to encryption (or lack thereof) leading to exposure of sensitive data.',
    descHinglish: 'Passwords aur card data ko bina strong encryption ke store ya transfer karna.'
  },
  {
    rank: 'A03:2021',
    name: 'Injection (XSS & SQLi)',
    nameHinglish: 'Injection (SQLi, XSS, Command Injection)',
    desc: 'User-supplied data is not validated, filtered, or sanitized by the application.',
    descHinglish: 'User input ko sanitize kiye bina direct query ya HTML mein daalna.'
  },
  {
    rank: 'A04:2021',
    name: 'Insecure Design',
    nameHinglish: 'Insecure Design (Architectural Flaws)',
    desc: 'Risks related to design and architectural flaws, missing threat modeling.',
    descHinglish: 'System architecture aur design phase mein security controls miss hona.'
  },
  {
    rank: 'A05:2021',
    name: 'Security Misconfiguration',
    nameHinglish: 'Security Misconfiguration (Default Settings)',
    desc: 'Default accounts, open cloud storage buckets, verbose error messages.',
    descHinglish: 'Default passwords reh jaana, cloud storage public hona ya debug errors leak hona.'
  },
  {
    rank: 'A06:2021',
    name: 'Vulnerable & Outdated Components',
    nameHinglish: 'Vulnerable & Outdated Components',
    desc: 'Using outdated third-party npm packages or libraries with known CVE vulnerabilities.',
    descHinglish: 'Purani vulnerable third-party libraries aur packages use karna.'
  },
  {
    rank: 'A07:2021',
    name: 'Identification & Authentication Failures',
    nameHinglish: 'Authentication & Session Failures',
    desc: 'Permitting brute force attacks, weak passwords, or missing multi-factor auth.',
    descHinglish: 'Brute-force attack se na bachana, weak passwords allow karna ya session na expire karna.'
  },
  {
    rank: 'A08:2021',
    name: 'Software & Data Integrity Failures',
    nameHinglish: 'Software & Data Integrity Failures',
    desc: 'Code and infrastructure that does not protect against integrity violations.',
    descHinglish: 'Untrusted CI/CD pipelines ya unverified software updates use karna.'
  },
  {
    rank: 'A09:2021',
    name: 'Security Logging & Monitoring Failures',
    nameHinglish: 'Logging & Monitoring Failures',
    desc: 'Insufficient logging to detect, escalate, and alert on active security breaches.',
    descHinglish: 'Security breach ke logs record na hona jisse attack detect na ho sake.'
  },
  {
    rank: 'A10:2021',
    name: 'Server-Side Request Forgery (SSRF)',
    nameHinglish: 'Server-Side Request Forgery (SSRF)',
    desc: 'Web applications fetching remote resources without validating user-supplied URLs.',
    descHinglish: 'Server ko user-supplied URL se internal network query karne dena.'
  }
];
