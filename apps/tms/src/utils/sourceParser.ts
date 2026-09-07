import {
  AutomationLanguage,
  AutomationRunner,
  AutomationSourceFile,
  AutomationSuiteInfo,
  AutomationTestInfo,
  SupportedFramework,
} from '../types/automation';

/**
 * Calculates a fast, deterministic hash of code content
 */
export function calculateSourceHash(content: string): string {
  let hash = 0;
  const normalized = content.replace(/\r\n/g, '\n').trim();
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'h_' + Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generates an 8-digit Test ID or Suite ID e.g. @T12345678 or @S12345678
 */
export function generateTestIdTag(prefix: 'T' | 'S' = 'T'): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `@${prefix}${randomDigits}`;
}

/**
 * Auto-detects language, framework, and runner from file content and path
 */
export function detectFramework(
  filePath: string,
  content: string,
  packageJsonContent?: string
): {
  framework: SupportedFramework;
  runner: AutomationRunner;
  language: AutomationLanguage;
} {
  const isTs = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
  const language: AutomationLanguage = isTs ? 'typescript' : 'javascript';

  const hasPlaywrightTestImport =
    /@playwright\/test/i.test(content) || /require\(['"]@playwright\/test['"]\)/i.test(content);
  const hasPlaywrightLibImport =
    /from\s+['"]playwright['"]/i.test(content) || /require\(['"]playwright['"]\)/i.test(content);
  const hasMochaImport =
    /from\s+['"]mocha['"]/i.test(content) ||
    /require\(['"]mocha['"]\)/i.test(content) ||
    /describe\s*\(/.test(content) && /it\s*\(/.test(content) && !hasPlaywrightTestImport;
  const hasCypress = /cy\./i.test(content) || /cypress/i.test(content);

  // Check Hybrid: Mocha runner + Playwright automation library
  if ((hasMochaImport || (!hasPlaywrightTestImport && /describe\s*\(/.test(content) && /it\s*\(/.test(content))) && hasPlaywrightLibImport) {
    return {
      framework: 'mocha_playwright_hybrid',
      runner: 'mocha',
      language,
    };
  }

  // Playwright Test
  if (hasPlaywrightTestImport || /test\s*\(\s*['"`]/.test(content) || /test\.describe/.test(content)) {
    return {
      framework: 'playwright',
      runner: 'playwright_test',
      language,
    };
  }

  // Pure Mocha
  if (hasMochaImport || (/describe\s*\(/.test(content) && /it\s*\(/.test(content))) {
    return {
      framework: 'mocha',
      runner: 'mocha',
      language,
    };
  }

  // Cypress
  if (hasCypress) {
    return {
      framework: 'cypress',
      runner: 'custom',
      language,
    };
  }

  return {
    framework: 'playwright',
    runner: 'playwright_test',
    language,
  };
}

/**
 * Static token and regex parser for JS/TS test files.
 * NEVER executes the code.
 */
export function parseSourceFileContent(
  projectId: string,
  filePath: string,
  content: string,
  overrideFramework?: SupportedFramework,
  overrideRunner?: AutomationRunner
): AutomationSourceFile {
  const { framework: detectedFw, runner: detectedRunner, language } = detectFramework(filePath, content);
  const framework = overrideFramework || detectedFw;
  const runner = overrideRunner || detectedRunner;
  const hash = calculateSourceHash(content);

  const lines = content.split('\n');
  const suites: AutomationSuiteInfo[] = [];
  const tests: AutomationTestInfo[] = [];

  // Stack of active describe / suite blocks
  const suiteStack: {
    id: string;
    name: string;
    suiteIdRef?: string;
    cleanName: string;
    startLine: number;
    depth: number;
  }[] = [];

  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i];

    // Check open/close braces to manage suite nesting
    const openCount = (line.match(/\{/g) || []).length;
    const closeCount = (line.match(/\}/g) || []).length;

    // 1. Suite Detection: describe('Title @S12345678', ...) or test.describe('Title @S12345678', ...)
    const suiteMatch = line.match(/(?:test\.)?describe(?:\.only|\.skip|\.parallel|\.serial)?\s*\(\s*(['"`])(.*?)\1/);
    if (suiteMatch) {
      const rawTitle = suiteMatch[2];
      const suiteIdMatch = rawTitle.match(/@S(\d{8}|\w+)/i);
      const suiteIdRef = suiteIdMatch ? `@S${suiteIdMatch[1]}` : undefined;
      const cleanName = rawTitle.replace(/@S\d+/gi, '').replace(/\s+/g, ' ').trim();
      const suiteId = 'suite-' + hash.substring(2, 6) + '-' + lineNum;

      const parentSuite = suiteStack.length > 0 ? suiteStack[suiteStack.length - 1] : undefined;

      const suiteInfo: AutomationSuiteInfo = {
        id: suiteId,
        suiteIdRef,
        name: rawTitle,
        cleanName,
        filePath,
        startLine: lineNum,
        endLine: lineNum, // updated on close
        parentSuiteId: parentSuite ? parentSuite.id : undefined,
        tests: [],
      };

      suites.push(suiteInfo);
      suiteStack.push({
        id: suiteId,
        name: rawTitle,
        cleanName,
        suiteIdRef,
        startLine: lineNum,
        depth: braceDepth + openCount,
      });
    }

    // 2. Test Detection: test('Title @T12345678', ...) or it('Title @T12345678', ...)
    const testMatch = line.match(/(?:test|it)(?:\.only|\.skip|\.fixme|\.step)?\s*\(\s*(['"`])(.*?)\1/);
    if (testMatch && !suiteMatch) {
      const rawTitle = testMatch[2];
      const testIdMatch = rawTitle.match(/@T(\d{8}|\w+)/i);
      const testIdRef = testIdMatch ? `@T${testIdMatch[1]}` : undefined;
      const cleanTitle = rawTitle.replace(/@T\d+/gi, '').replace(/@S\d+/gi, '').replace(/\s+/g, ' ').trim();

      // Detect tags like @smoke, @regression, @auth
      const tags = (rawTitle.match(/@[\w-]+/g) || []).filter(
        (t) => !t.toUpperCase().startsWith('@T') && !t.toUpperCase().startsWith('@S')
      );

      const currentSuite = suiteStack.length > 0 ? suiteStack[suiteStack.length - 1] : undefined;

      // Extract a snippet of the test
      let endLineGuess = lineNum;
      for (let j = i; j < Math.min(i + 25, lines.length); j++) {
        if (j > i && /^\s*\}\s*\)\s*;?/.test(lines[j])) {
          endLineGuess = j + 1;
          break;
        }
      }
      const testSnippet = lines.slice(i, Math.min(endLineGuess, lines.length)).join('\n');

      const isAsync = /async\s*\(|async\s+function/.test(line) || /async\s*=>/.test(line);
      const isStepBased = /test\.step\(/.test(testSnippet);

      const testInfo: AutomationTestInfo = {
        id: testIdRef ? `mapped-${testIdRef.replace('@', '')}` : `auto-${hash.substring(2, 6)}-${lineNum}`,
        testIdRef,
        title: rawTitle,
        cleanTitle,
        suiteIdRef: currentSuite?.suiteIdRef,
        suiteName: currentSuite ? currentSuite.name : 'Root Suite',
        filePath,
        startLine: lineNum,
        endLine: endLineGuess,
        sourceCode: testSnippet,
        tags,
        annotations: [],
        isAsync,
        isStepBased,
        hasId: Boolean(testIdRef),
      };

      tests.push(testInfo);
      if (currentSuite) {
        const foundSuite = suites.find((s) => s.id === currentSuite.id);
        if (foundSuite) {
          foundSuite.tests.push(testInfo);
        }
      }
    }

    braceDepth += openCount - closeCount;

    // Pop suites if brace depth dropped back
    while (suiteStack.length > 0 && braceDepth < suiteStack[suiteStack.length - 1].depth) {
      const popped = suiteStack.pop();
      if (popped) {
        const suite = suites.find((s) => s.id === popped.id);
        if (suite) {
          suite.endLine = lineNum;
        }
      }
    }
  }

  const fileName = filePath.split('/').pop() || filePath;

  return {
    id: 'src-file-' + hash.substring(2, 8),
    projectId,
    path: filePath,
    fileName,
    content,
    hash,
    language,
    framework,
    runner,
    suites,
    tests,
    lastImportedAt: new Date().toISOString(),
    lastModifiedAt: new Date().toISOString(),
  };
}

/**
 * Injects missing @T######## and @S######## IDs into source code
 * Returns modified code and a list of injected tags
 */
export function injectMissingIds(content: string): {
  newContent: string;
  injectedCount: number;
  injectedMap: { original: string; withTag: string; tag: string; type: 'test' | 'suite' }[];
} {
  let modified = content;
  const injectedMap: { original: string; withTag: string; tag: string; type: 'test' | 'suite' }[] = [];
  let count = 0;

  // 1. Injects @S tags for describes without @S
  modified = modified.replace(
    /((?:test\.)?describe(?:\.only|\.skip|\.parallel)?\s*\(\s*)(['"`])(.*?)\2/g,
    (match, prefix, quote, title) => {
      if (/@S\d{8}/i.test(title)) return match;
      const newTag = generateTestIdTag('S');
      const updatedTitle = `${title.trim()} ${newTag}`;
      injectedMap.push({
        original: title,
        withTag: updatedTitle,
        tag: newTag,
        type: 'suite',
      });
      count++;
      return `${prefix}${quote}${updatedTitle}${quote}`;
    }
  );

  // 2. Injects @T tags for tests/it without @T
  modified = modified.replace(
    /((?:test|it)(?:\.only|\.skip|\.fixme)?\s*\(\s*)(['"`])(.*?)\2/g,
    (match, prefix, quote, title) => {
      if (/@T\d{8}/i.test(title)) return match;
      const newTag = generateTestIdTag('T');
      const updatedTitle = `${title.trim()} ${newTag}`;
      injectedMap.push({
        original: title,
        withTag: updatedTitle,
        tag: newTag,
        type: 'test',
      });
      count++;
      return `${prefix}${quote}${updatedTitle}${quote}`;
    }
  );

  return {
    newContent: modified,
    injectedCount: count,
    injectedMap,
  };
}
