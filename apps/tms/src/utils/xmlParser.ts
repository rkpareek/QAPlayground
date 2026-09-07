import { ExecutionStatus, TestCase } from '../types';
import { AutomationResultDocument, NormalizedTestResult } from '../types/automation';
import { calculateSourceHash } from './sourceParser';

/**
 * Normalizes raw XML execution status to unified ExecutionStatus
 */
export function normalizeXmlStatus(rawStatus: string): ExecutionStatus {
  const s = (rawStatus || '').toLowerCase().trim();
  if (s === 'pass' || s === 'passed' || s === 'success' || s === 'ok') return 'passed';
  if (s === 'fail' || s === 'failed' || s === 'failure') return 'failed';
  if (s === 'error' || s === 'errored' || s === 'broken') return 'failed'; // mapped to failed with error details
  if (s === 'skip' || s === 'skipped' || s === 'pending' || s === 'ignored' || s === 'disabled') return 'skipped';
  if (s === 'block' || s === 'blocked') return 'blocked';
  return 'not_run';
}

/**
 * Extracts @T12345678 and @S12345678 tags from text
 */
export function extractTagsFromText(text: string): { testIdRef?: string; suiteIdRef?: string } {
  if (!text) return {};
  const tMatch = text.match(/@T(\d{8}|\w+)/i);
  const sMatch = text.match(/@S(\d{8}|\w+)/i);
  return {
    testIdRef: tMatch ? `@T${tMatch[1]}` : undefined,
    suiteIdRef: sMatch ? `@S${sMatch[1]}` : undefined,
  };
}

/**
 * Securely parses JUnit XML results without executing or fetching external entities
 */
export function parseJUnitXml(
  xmlContent: string,
  fileName: string,
  projectId: string,
  existingTestCases: TestCase[] = []
): AutomationResultDocument {
  // Validate XML size (up to 15MB safe check)
  if (!xmlContent || xmlContent.length > 15 * 1024 * 1024) {
    throw new Error('XML file content is empty or exceeds maximum size limit (15MB).');
  }

  // Security: check against dangerous entity declarations (XXE mitigation)
  if (/<!DOCTYPE/i.test(xmlContent) && /<!ENTITY/i.test(xmlContent)) {
    throw new Error('Security Error: XML contains custom DTD or Entity definitions which are forbidden.');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlContent, 'application/xml');

  // Check for parser errors
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Malformed XML document: ' + (parseError.textContent || 'Failed to parse XML syntax.'));
  }

  const normalizedResults: NormalizedTestResult[] = [];
  const testcaseElements = doc.querySelectorAll('testcase');

  if (testcaseElements.length === 0) {
    throw new Error('No <testcase> elements found in XML file. Please ensure this is a standard JUnit or xUnit XML report.');
  }

  let totalDurationMs = 0;
  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  testcaseElements.forEach((tcEl, index) => {
    const rawName = tcEl.getAttribute('name') || `Test Case #${index + 1}`;
    const rawClassName = tcEl.getAttribute('classname') || '';
    const parentSuiteEl = tcEl.closest('testsuite');
    const rawSuiteName = parentSuiteEl?.getAttribute('name') || rawClassName || 'Default Test Suite';

    // Parse duration in seconds or milliseconds
    const timeAttr = tcEl.getAttribute('time') || '0';
    const durationSeconds = parseFloat(timeAttr) || 0;
    const durationMs = Math.round(durationSeconds * 1000);
    totalDurationMs += durationMs;

    // Check failure, error, skipped child nodes
    const failureEl = tcEl.querySelector('failure');
    const errorEl = tcEl.querySelector('error');
    const skippedEl = tcEl.querySelector('skipped');
    const systemOutEl = tcEl.querySelector('system-out');
    const systemErrEl = tcEl.querySelector('system-err');

    let status: ExecutionStatus = 'passed';
    let rawStatus = 'passed';
    let failureMessage = '';
    let errorDetails = '';
    let stackTrace = '';

    if (failureEl) {
      status = 'failed';
      rawStatus = 'failure';
      failureMessage = failureEl.getAttribute('message') || failureEl.getAttribute('type') || 'Assertion Failed';
      stackTrace = failureEl.textContent || '';
      failedCount++;
    } else if (errorEl) {
      status = 'failed';
      rawStatus = 'error';
      failureMessage = errorEl.getAttribute('message') || errorEl.getAttribute('type') || 'Execution Error';
      errorDetails = errorEl.textContent || '';
      stackTrace = errorEl.textContent || '';
      errorCount++;
    } else if (skippedEl) {
      status = 'skipped';
      rawStatus = 'skipped';
      failureMessage = skippedEl.getAttribute('message') || 'Test Skipped';
      skippedCount++;
    } else {
      passedCount++;
    }

    // Extract tags from test name, class name, or suite name
    const { testIdRef: nameTestId, suiteIdRef: nameSuiteId } = extractTagsFromText(rawName);
    const { testIdRef: classTestId, suiteIdRef: classSuiteId } = extractTagsFromText(rawClassName);
    const { suiteIdRef: parentSuiteId } = extractTagsFromText(rawSuiteName);

    const testIdRef = nameTestId || classTestId;
    const suiteIdRef = nameSuiteId || classSuiteId || parentSuiteId;

    const cleanTestName = rawName.replace(/@T\d+/gi, '').replace(/@S\d+/gi, '').replace(/\s+/g, ' ').trim();
    const cleanSuiteName = rawSuiteName.replace(/@T\d+/gi, '').replace(/@S\d+/gi, '').replace(/\s+/g, ' ').trim();

    // Source line/file if available
    const fileAttr = tcEl.getAttribute('file') || tcEl.getAttribute('filepath') || '';
    const lineAttr = tcEl.getAttribute('line') || '';
    const sourceLine = lineAttr ? parseInt(lineAttr, 10) : undefined;

    // Matching against existing TMS test cases
    let matchedTestCaseId: string | undefined;
    let matchedTestCaseTitle: string | undefined;
    let matchType: 'test_id' | 'source_path' | 'suite_title' | 'title_candidate' | 'unmatched' = 'unmatched';

    if (testIdRef) {
      // 1. Exact Test ID match (e.g. @T12345678 -> find TC with title containing @T12345678 or id)
      const cleanNum = testIdRef.replace('@T', '');
      const match = existingTestCases.find(
        (tc) =>
          tc.title.includes(testIdRef) ||
          tc.id.endsWith(cleanNum) ||
          (tc.customFields && tc.customFields.automationTestId === testIdRef)
      );
      if (match) {
        matchedTestCaseId = match.id;
        matchedTestCaseTitle = match.title;
        matchType = 'test_id';
      }
    }

    if (!matchedTestCaseId && cleanTestName) {
      // 2. Title matching
      const match = existingTestCases.find(
        (tc) => tc.title.toLowerCase().trim() === cleanTestName.toLowerCase()
      );
      if (match) {
        matchedTestCaseId = match.id;
        matchedTestCaseTitle = match.title;
        matchType = 'title_candidate';
      }
    }

    normalizedResults.push({
      id: `norm-res-${index + 1}`,
      testIdRef,
      suiteIdRef,
      testName: rawName,
      cleanTestName,
      suiteName: cleanSuiteName,
      className: rawClassName,
      status,
      rawStatus,
      durationMs,
      failureMessage,
      errorDetails,
      stackTrace,
      stdout: systemOutEl?.textContent || undefined,
      stderr: systemErrEl?.textContent || undefined,
      sourceFile: fileAttr || undefined,
      sourceLine,
      matchedTestCaseId,
      matchedTestCaseTitle,
      matchType,
    });
  });

  const unmatchedCount = normalizedResults.filter((r) => r.matchType === 'unmatched').length;
  const fileHash = calculateSourceHash(xmlContent);

  return {
    importId: 'doc-' + Date.now().toString(36) + '-' + fileHash.substring(2, 6),
    projectId,
    fileName,
    fileHash,
    parser: 'junit_xml',
    parserVersion: '1.0',
    ingestedAt: new Date().toISOString(),
    totalTests: normalizedResults.length,
    passed: passedCount,
    failed: failedCount + errorCount,
    skipped: skippedCount,
    errors: errorCount,
    durationMs: totalDurationMs,
    rawXmlSnippet: xmlContent.slice(0, 500) + (xmlContent.length > 500 ? '\n<!-- TRUNCATED -->' : ''),
    normalizedResults,
    unmatchedCount,
  };
}
