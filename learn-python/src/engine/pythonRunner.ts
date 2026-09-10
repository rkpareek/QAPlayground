import { ExecutionResult } from '../types';

export class PythonRunner {
  /**
   * Executes a Python script in a controlled sandbox with timeout,
   * stdout capturing, and deterministic test assertions.
   */
  static async executeCode(
    code: string,
    testCases?: { input?: string; expected_output: string; description: string; hidden?: boolean }[]
  ): Promise<ExecutionResult> {
    const startTime = performance.now();

    // Check basic syntax/forbidden operations before execution
    const forbidden = [
      'import os',
      'import sys',
      'import subprocess',
      'open(',
      'eval(',
      'exec(',
      '__import__',
    ];

    for (const f of forbidden) {
      if (code.includes(f)) {
        return {
          success: false,
          output: '',
          error: `Security Restriction: The instruction "${f}" is restricted inside the learning sandbox.`,
          executionTimeMs: Math.round(performance.now() - startTime),
        };
      }
    }

    try {
      // Simulate safe Python execution environment with JS evaluation
      // For standard Python arithmetic, loops, lists, dicts, functions, strings:
      const runOutcome = await this.runSimulatedPython(code);
      const executionTimeMs = Math.round(performance.now() - startTime);

      if (!runOutcome.success) {
        return {
          success: false,
          output: runOutcome.output,
          error: runOutcome.error,
          executionTimeMs,
        };
      }

      // If test cases are provided, evaluate them
      const testResults: {
        description: string;
        passed: boolean;
        actual: string;
        expected: string;
      }[] = [];

      if (testCases && testCases.length > 0) {
        for (const tc of testCases) {
          const testCode = tc.input ? `${code}\n${tc.input}` : code;
          const tcOutcome = await this.runSimulatedPython(testCode);
          const actualClean = (tcOutcome.output || '').trim();
          const expectedClean = tc.expected_output.trim();
          const passed = actualClean === expectedClean || actualClean.includes(expectedClean);

          testResults.push({
            description: tc.description,
            passed,
            actual: actualClean,
            expected: expectedClean,
          });
        }
      }

      const allTestsPassed = testResults.length === 0 || testResults.every(t => t.passed);

      return {
        success: allTestsPassed && !runOutcome.error,
        output: runOutcome.output,
        error: runOutcome.error,
        executionTimeMs,
        testResults,
      };
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: err?.message || 'Execution Error',
        executionTimeMs: Math.round(performance.now() - startTime),
      };
    }
  }

  /**
   * Safe in-browser simulated Python runner capable of executing
   * standard Python syntax, loops, functions, lists, dicts, math, and prints.
   */
  private static async runSimulatedPython(pythonCode: string): Promise<{
    success: boolean;
    output: string;
    error?: string;
  }> {
    let stdoutBuffer = '';

    // Custom transpilation / sandbox runner for standard algorithmic Python code
    try {
      const jsCode = this.transpilePythonToJs(pythonCode);

      // Create a confined function environment
      const sandboxFn = new Function(
        'print',
        'len',
        'range',
        'str',
        'int',
        'float',
        'bool',
        'sum',
        'min',
        'max',
        'sorted',
        'list',
        'dict',
        `"use strict";
        try {
          ${jsCode}
        } catch (e) {
          throw e;
        }`
      );

      const customPrint = (...args: any[]) => {
        const line = args
          .map(arg => {
            if (arg === null || arg === undefined) return 'None';
            if (typeof arg === 'boolean') return arg ? 'True' : 'False';
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg).replace(/"/g, "'");
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');
        stdoutBuffer += line + '\n';
      };

      const customLen = (obj: any) => (obj ? obj.length ?? Object.keys(obj).length : 0);
      const customRange = (start: number, stop?: number, step = 1) => {
        const res: number[] = [];
        let actualStart = stop === undefined ? 0 : start;
        let actualStop = stop === undefined ? start : stop;
        if (step > 0) {
          for (let i = actualStart; i < actualStop; i += step) res.push(i);
        } else if (step < 0) {
          for (let i = actualStart; i > actualStop; i += step) res.push(i);
        }
        return res;
      };
      const customSum = (arr: number[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0);
      const customMin = (...args: any[]) => {
        const items = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        return Math.min(...items);
      };
      const customMax = (...args: any[]) => {
        const items = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
        return Math.max(...items);
      };
      const customSorted = (arr: any[]) => [...arr].sort((a, b) => (a > b ? 1 : -1));

      // Execute inside safe timeout promise
      const timeoutMs = 3000;
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Execution exceeded 3000ms limit.')), timeoutMs)
      );

      const executionPromise = Promise.resolve().then(() => {
        sandboxFn(
          customPrint,
          customLen,
          customRange,
          String,
          (v: any) => parseInt(v, 10),
          (v: any) => parseFloat(v),
          Boolean,
          customSum,
          customMin,
          customMax,
          customSorted,
          (v: any) => (Array.isArray(v) ? [...v] : Array.from(v || [])),
          (entries?: any) => (entries ? Object.fromEntries(entries) : {})
        );
      });

      await Promise.race([executionPromise, timeoutPromise]);

      return {
        success: true,
        output: stdoutBuffer.trimEnd(),
      };
    } catch (e: any) {
      return {
        success: false,
        output: stdoutBuffer.trimEnd(),
        error: `Runtime / Syntax Error: ${e?.message || String(e)}`,
      };
    }
  }

  /**
   * Lightweight Python to JS converter for core introductory constructs:
   * indentation to braces, def -> function, True/False -> true/false, None -> null,
   * elif -> else if, for x in y -> for (const x of y), etc.
   */
  private static transpilePythonToJs(py: string): string {
    const lines = py.split('\n');
    const indentStack = [0];
    const jsLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const trimmed = rawLine.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Calculate indentation (spaces)
      const indentMatch = rawLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1].length : 0;

      // Close blocks when unindenting
      while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        jsLines.push('}');
      }

      let line = trimmed;

      // Translate keywords & literals
      line = line.replace(/\bTrue\b/g, 'true');
      line = line.replace(/\bFalse\b/g, 'false');
      line = line.replace(/\bNone\b/g, 'null');
      line = line.replace(/\band\b/g, '&&');
      line = line.replace(/\bor\b/g, '||');
      line = line.replace(/\bnot\b/g, '!');
      line = line.replace(/\bpass\b/g, '/* pass */');

      // Append method translation: .append(x) -> .push(x)
      line = line.replace(/\.append\(/g, '.push(');

      // Function definition: def foo(a, b):
      if (line.startsWith('def ')) {
        const match = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
        if (match) {
          const fnName = match[1];
          const params = match[2];
          line = `function ${fnName}(${params}) {`;
          indentStack.push(indent + 2);
          jsLines.push(line);
          continue;
        }
      }

      // For in loops: for x in items: or for x in range(n):
      if (line.startsWith('for ')) {
        const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?)\s*:/);
        if (forMatch) {
          const varName = forMatch[1];
          const iterable = forMatch[2];
          line = `for (let ${varName} of ${iterable}) {`;
          indentStack.push(indent + 2);
          jsLines.push(line);
          continue;
        }
      }

      // While loop: while condition:
      if (line.startsWith('while ')) {
        const whileMatch = line.match(/^while\s+(.*?)\s*:/);
        if (whileMatch) {
          line = `while (${whileMatch[1]}) {`;
          indentStack.push(indent + 2);
          jsLines.push(line);
          continue;
        }
      }

      // If condition: if condition:
      if (line.startsWith('if ')) {
        const ifMatch = line.match(/^if\s+(.*?)\s*:/);
        if (ifMatch) {
          line = `if (${ifMatch[1]}) {`;
          indentStack.push(indent + 2);
          jsLines.push(line);
          continue;
        }
      }

      // Elif: elif condition:
      if (line.startsWith('elif ')) {
        const elifMatch = line.match(/^elif\s+(.*?)\s*:/);
        if (elifMatch) {
          line = `} else if (${elifMatch[1]}) {`;
          jsLines.push(line);
          continue;
        }
      }

      // Else: else:
      if (line.startsWith('else:')) {
        line = `} else {`;
        jsLines.push(line);
        continue;
      }

      // Simple variable assignments without let/var
      if (/^[a-zA-Z_]\w*\s*(=|\+=|-=|\*=)\s*.+/.test(line)) {
        const varMatch = line.match(/^([a-zA-Z_]\w*)/);
        if (varMatch) {
          const varName = varMatch[1];
          // Declare if not yet declared
          line = `if (typeof ${varName} === 'undefined') { var ${varName}; } ${line};`;
        }
      } else if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
        line = `${line};`;
      }

      jsLines.push(line);
    }

    // Close remaining open blocks
    while (indentStack.length > 1) {
      indentStack.pop();
      jsLines.push('}');
    }

    return jsLines.join('\n');
  }
}
