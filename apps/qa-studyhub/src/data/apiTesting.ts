import { HttpStatusCodeItem } from '../types';

export const HTTP_METHODS_DATA = [
  {
    method: 'GET',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    description: 'Retrieves data or resources from the server without making any modifications.',
    descriptionHinglish: 'Server se data ya resources read/fetch karne ke liye use hota hai bina kisi modification ke.',
    idempotent: 'Yes',
    requestBody: 'No',
    example: 'GET /api/v1/users/42 → Returns user profile with status 200 OK.',
    exampleHinglish: 'GET /api/v1/users/42 → User profile return karega status 200 OK ke sath.'
  },
  {
    method: 'POST',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Submits new data in the request body to create a brand new resource on the server.',
    descriptionHinglish: 'Request body mein data bhej kar server par ek brand new resource create karne ke liye.',
    idempotent: 'No',
    requestBody: 'Yes (JSON/Form)',
    example: 'POST /api/v1/users (with JSON payload) → Returns status 201 Created.',
    exampleHinglish: 'POST /api/v1/users (JSON payload ke sath) → Status 201 Created return karega.'
  },
  {
    method: 'PUT',
    color: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Replaces an entire existing resource with the complete updated payload provided.',
    descriptionHinglish: 'Puraane resource ko complete nayi details ke sath replace karne ke liye.',
    idempotent: 'Yes',
    requestBody: 'Yes',
    example: 'PUT /api/v1/users/42 (with all fields) → Replaces user profile with status 200 OK.',
    exampleHinglish: 'PUT /api/v1/users/42 (saare fields ke sath) → Complete profile replace karke 200 OK dega.'
  },
  {
    method: 'PATCH',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Partially modifies specific fields of an existing resource without altering other fields.',
    descriptionHinglish: 'Existing resource ke specific fields ko partially update karne ke liye.',
    idempotent: 'No',
    requestBody: 'Yes',
    example: 'PATCH /api/v1/users/42 ({"email": "new@qa.com"}) → Updates only email field.',
    exampleHinglish: 'PATCH /api/v1/users/42 (sirf email field) → Baaki data chhod kar sirf email update karega.'
  },
  {
    method: 'DELETE',
    color: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Deletes a specified resource from the server.',
    descriptionHinglish: 'Specified resource ko server/database se permanently ya soft delete karne ke liye.',
    idempotent: 'Yes',
    requestBody: 'Usually No',
    example: 'DELETE /api/v1/users/42 → Removes user with status 200 OK or 204 No Content.',
    exampleHinglish: 'DELETE /api/v1/users/42 → User ko remove karke status 200 OK ya 204 No Content dega.'
  }
];

export const HTTP_STATUS_CODES: HttpStatusCodeItem[] = [
  // 2xx
  {
    code: 200,
    name: 'OK',
    category: '2xx Success',
    description: 'Standard success response for GET, PUT, or PATCH requests.',
    descriptionHinglish: 'Standard success response jab request successfully process ho gayi ho.',
    qaCheck: 'Verify response body contains expected payload data and correct data types.',
    qaCheckHinglish: 'Verify karein ki response body mein expected data aur correct fields aa rahe hain.'
  },
  {
    code: 201,
    name: 'Created',
    category: '2xx Success',
    description: 'Resource successfully created on server following a POST request.',
    descriptionHinglish: 'POST request ke baad server par naya resource successfully create ho gaya.',
    qaCheck: 'Verify new resource ID exists in response and resource is persisted in database.',
    qaCheckHinglish: 'Verify karein ki new record ID response mein hai aur database mein entry create hui hai.'
  },
  {
    code: 204,
    name: 'No Content',
    category: '2xx Success',
    description: 'Request succeeded but the response body is intentionally empty (common for DELETE).',
    descriptionHinglish: 'Request success ho gayi par response body empty hai (zyadatar DELETE ke liye).',
    qaCheck: 'Verify response status is 204 and subsequent GET on that ID returns 404.',
    qaCheckHinglish: 'Check karein status 204 hai aur baad mein GET karne par 404 milta hai.'
  },
  // 3xx
  {
    code: 301,
    name: 'Moved Permanently',
    category: '3xx Redirection',
    description: 'The requested resource URL has been permanently assigned a new URI in Location header.',
    descriptionHinglish: 'Requested URL ko permanently naye address par shift kar diya gaya hai.',
    qaCheck: 'Verify redirection target URL is correct and handles data safely.',
    qaCheckHinglish: 'Verify karein ki browser ya API client sahi naye URL par redirect ho raha hai.'
  },
  {
    code: 302,
    name: 'Found (Temporary Redirect)',
    category: '3xx Redirection',
    description: 'The resource temporarily resides under a different URI.',
    descriptionHinglish: 'Resource temporarily kisi alag URL par available hai.',
    qaCheck: 'Verify browser or API client follows redirect smoothly.',
    qaCheckHinglish: 'Verify karein ki redirect location header ke sath theek se handle ho raha hai.'
  },
  // 4xx
  {
    code: 400,
    name: 'Bad Request',
    category: '4xx Client Error',
    description: 'Server cannot process request due to malformed syntax, invalid JSON, or missing required fields.',
    descriptionHinglish: 'Request format galat hai (invalid JSON, missing mandatory fields ya bad syntax).',
    qaCheck: 'Verify error payload contains meaningful message detailing which field was invalid.',
    qaCheckHinglish: 'Verify karein ki error message mein clear detail ho ki kaunsa field missing ya invalid hai.'
  },
  {
    code: 401,
    name: 'Unauthorized',
    category: '4xx Client Error',
    description: 'Authentication is required and has either failed or was not provided (missing/expired token).',
    descriptionHinglish: 'Authentication missing hai ya Bearer token expire/galat hai.',
    qaCheck: 'Verify sending request without "Authorization" header returns 401, not 500 or 200.',
    qaCheckHinglish: 'Bina auth token ke request bhejne par 401 aana chahiye (500 ya 200 nahi).'
  },
  {
    code: 403,
    name: 'Forbidden',
    category: '4xx Client Error',
    description: 'User identity is authenticated, but the user does not possess required role permissions.',
    descriptionHinglish: 'User logged in hai lekin uske paas us action ko karne ka role/permission nahi hai.',
    qaCheck: 'Verify regular user attempting to call admin-only endpoints receives 403.',
    qaCheckHinglish: 'Normal user jab admin endpoint call kare to 403 Forbidden milna chahiye.'
  },
  {
    code: 404,
    name: 'Not Found',
    category: '4xx Client Error',
    description: 'The requested resource ID or endpoint URL does not exist on the server.',
    descriptionHinglish: 'Requested URL endpoint ya resource ID server par exist nahi karti.',
    qaCheck: 'Verify querying non-existent ID (e.g., /users/999999) returns 404 gracefully.',
    qaCheckHinglish: 'Non-existent ID query karne par clean 404 error aana chahiye.'
  },
  {
    code: 409,
    name: 'Conflict',
    category: '4xx Client Error',
    description: 'Request could not be completed due to a conflict in current state (e.g., duplicate email).',
    descriptionHinglish: 'Database state mein conflict hai (jaise already registered email ya duplicate username).',
    qaCheck: 'Verify registering an email that already exists returns 409 Conflict.',
    qaCheckHinglish: 'Already existing email se register karne par 409 Conflict aana chahiye.'
  },
  {
    code: 422,
    name: 'Unprocessable Entity',
    category: '4xx Client Error',
    description: 'Request syntax is valid JSON, but contained semantic or business rule validation errors.',
    descriptionHinglish: 'JSON syntax sahi hai par data business rules ke khilaf hai (jaise negative age ya future birthdate).',
    qaCheck: 'Verify sending age = -5 or negative price returns 422 with validation errors array.',
    qaCheckHinglish: 'Negative price ya invalid data bhejne par 422 aur proper error array aani chahiye.'
  },
  // 5xx
  {
    code: 500,
    name: 'Internal Server Error',
    category: '5xx Server Error',
    description: 'Generic server crash or unhandled exception in backend code.',
    descriptionHinglish: 'Backend code mein unhandled exception ya crash jo server handle nahi kar paaya.',
    qaCheck: 'Always log as high-severity bug; ensure server does not leak raw database stack traces in response.',
    qaCheckHinglish: 'High-severity bug log karein; ensure karein ki server raw database stack trace leak na kare.'
  },
  {
    code: 502,
    name: 'Bad Gateway',
    category: '5xx Server Error',
    description: 'Server acting as gateway/proxy received an invalid response from upstream microservice.',
    descriptionHinglish: 'Gateway ya reverse proxy ko upstream microservice se invalid response mila.',
    qaCheck: 'Verify proxy timeout configurations and microservice health.',
    qaCheckHinglish: 'Proxy timeout settings aur upstream microservices ka status check karein.'
  },
  {
    code: 503,
    name: 'Service Unavailable',
    category: '5xx Server Error',
    description: 'Server is temporarily overloaded or undergoing maintenance.',
    descriptionHinglish: 'Server temporarily overloaded hai ya maintenance mode mein hai.',
    qaCheck: 'Verify retry headers and user-friendly fallback messaging.',
    qaCheckHinglish: 'Retry-After headers aur user-friendly maintenance banner check karein.'
  }
];

export const API_TESTING_CONCEPTS = [
  {
    title: 'Functional API Testing',
    description: 'Validating that each API endpoint correctly performs its designated business function and produces expected output for given inputs.',
    descriptionHinglish: 'Ye verify karna ki har API endpoint apna business logic sahi execute kar raha hai aur correct output de raha hai.'
  },
  {
    title: 'Positive vs Negative API Testing',
    description: 'Positive: Testing with valid headers, authentication, and correct payload expecting 200/201. Negative: Testing with missing tokens, malformed JSON, out-of-range numbers, and SQL chars expecting 400, 401, 403, 404, or 422.',
    descriptionHinglish: 'Positive: Valid payload aur token ke sath 200/201 check karna. Negative: Missing token, invalid JSON ya special characters bhej kar 400, 401, 403, 404 handle karna test karna.'
  },
  {
    title: 'Response Payload & Schema Validation',
    description: 'Verifying that response JSON matches the defined OpenAPI/Swagger contract (checking field names, data types: string, number, boolean, array, and required nullability).',
    descriptionHinglish: 'Verify karna ki response JSON contract/schema ke sath match karta hai (field names, types jaise string/number/boolean).'
  },
  {
    title: 'Header & Content-Type Validation',
    description: 'Verifying headers such as `Content-Type: application/json`, `Cache-Control`, and custom security headers are present.',
    descriptionHinglish: 'Check karna ki `Content-Type: application/json`, `Cache-Control` aur security headers sahi set hain.'
  },
  {
    title: 'Authentication & Authorization',
    description: 'Authentication (Bearer tokens, API keys, OAuth) verifies identity. Authorization tests verify role-based access control (Admin vs Viewer).',
    descriptionHinglish: 'Authentication user ki identity verify karta hai (JWT token). Authorization check karta hai ki user ke paas us resource ka access hai ya nahi.'
  },
  {
    title: 'CRUD Flow Testing',
    description: 'Executing an end-to-end entity cycle: 1. POST (Create) → 2. GET (Read & verify) → 3. PUT/PATCH (Update & verify) → 4. DELETE (Remove) → 5. GET (Verify 404 Not Found).',
    descriptionHinglish: 'Complete lifecycle test karna: 1. POST (Create) → 2. GET (Verify) → 3. PUT/PATCH (Update) → 4. DELETE (Remove) → 5. GET (Verify 404).'
  }
];

export const POSTMAN_CORE_CONCEPTS = [
  {
    name: 'Request Builder',
    detail: 'Configuring HTTP Method, URL Endpoint, Query Params, Headers (`Content-Type`, `Authorization`), and Body (raw JSON, form-data, x-www-form-urlencoded).',
    detailHinglish: 'HTTP Method, URL, Query Params, Headers aur Request Body (JSON/Form) configure karna.'
  },
  {
    name: 'Collections & Folders',
    detail: 'Organizing API requests into structured suites (e.g., Auth Suite, User Management, Order Processing) to run entire test suites automatically using Collection Runner.',
    detailHinglish: 'API requests ko folders aur suites mein organize karke Collection Runner se auto-run karna.'
  },
  {
    name: 'Environments & Variables',
    detail: 'Defining variable keys (e.g. `{{baseUrl}}`, `{{token}}`, `{{userId}}`) so test requests dynamically switch between Dev, QA, Staging, and Production environments without modifying request URLs.',
    detailHinglish: 'Variables (`{{baseUrl}}`, `{{token}}`) use karna taaki Dev, QA aur Staging ke beech bina URL change kiye switch kar sakein.'
  },
  {
    name: 'Pre-request Scripts & Test Assertions',
    detail: 'Writing JavaScript assertions in the "Tests" tab to automatically validate HTTP status, response time, and payload values using `pm.test()` and `pm.expect()`.',
    detailHinglish: '"Tests" tab mein JavaScript assertions likhna taaki status code aur response data automatically validate ho sake.'
  }
];

export const SAMPLE_POSTMAN_TEST_SCRIPT = `// 1. Verify Status Code is 200 OK
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// 2. Verify Response Time is under 800ms
pm.test("Response time is acceptable (< 800ms)", function () {
    pm.expect(pm.response.responseTime).to.be.below(800);
});

// 3. Verify Response Body Schema and Data
pm.test("User object contains valid ID and Email", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("id");
    pm.expect(jsonData.email).to.eql("john.qa@example.com");
    pm.expect(jsonData.isActive).to.be.true;
    
    // Save auth token dynamically to environment for next request
    if (jsonData.token) {
        pm.environment.set("authToken", jsonData.token);
    }
});`;
