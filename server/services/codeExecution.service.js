import axios from "axios";
import { execFile } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";
import { buildProgram, buildBatchProgram } from "../data/dsaStarters.js";

const RUNNER = process.env.CODE_RUNNER || "auto";

const WANDBOX_URL = "https://wandbox.org/api/compile.json";
const JDOODLE_URL = "https://api.jdoodle.com/v1/execute";
const PISTON_URL =
  process.env.PISTON_URL || "http://localhost:2000/api/v2/execute";

const WANDBOX_COMPILERS = {
  cpp: process.env.WANDBOX_CPP_COMPILER || "gcc-13.2.0",
  python: process.env.WANDBOX_PYTHON_COMPILER || "cpython-3.12.7",
  java: process.env.WANDBOX_JAVA_COMPILER || "openjdk-jdk-21+35",
};

const JDOODLE_LANG = {
  javascript: {
    language: "nodejs",
    versionIndex: process.env.JDOODLE_NODE_VERSION || "4",
  },
  python: {
    language: "python3",
    versionIndex: process.env.JDOODLE_PYTHON_VERSION || "4",
  },
  cpp: {
    language: "cpp",
    versionIndex: process.env.JDOODLE_CPP_VERSION || "5",
  },
  java: {
    language: "java",
    versionIndex: process.env.JDOODLE_JAVA_VERSION || "4",
  },
};

const PISTON_CONFIG = {
  cpp: { language: "c++", version: "10.2.0", filename: "main.cpp" },
  python: { language: "python", version: "3.10.0", filename: "main.py" },
  javascript: {
    language: "javascript",
    version: "18.15.0",
    filename: "main.js",
  },
  java: { language: "java", version: "15.0.2", filename: "Main.java" },
};

const SUPPORTED_LANGUAGES = ["javascript", "python", "cpp", "java"];

const hasJdoodleKeys = () =>
  Boolean(process.env.JDOODLE_CLIENT_ID && process.env.JDOODLE_CLIENT_SECRET);

const pickProvider = (language) => {
  if (RUNNER === "jdoodle") return hasJdoodleKeys() ? "jdoodle" : null;
  if (RUNNER === "wandbox")
    return WANDBOX_COMPILERS[language] ? "wandbox" : null;
  if (RUNNER === "piston") return "piston";
  if (language === "javascript") return hasJdoodleKeys() ? "jdoodle" : null;
  return WANDBOX_COMPILERS[language] ? "wandbox" : null;
};

const detectCompileKind = (language, text) => {
  if (!text) return "runtime";
  if (/runtime error/i.test(text)) return "runtime";
  if (language === "cpp" && /(^|[\s:])error(\s|:)/i.test(text)) return "compile";
  if (language === "java" && /\.java:\d+\s*:\s*error/i.test(text))
    return "compile";
  if (
    (language === "python" || language === "javascript") &&
    /syntaxerror/i.test(text)
  )
    return "compile";
  return "runtime";
};

const friendlyRunError = (err) => {
  if (err?.response?.status === 429)
    return "Code runner is busy right now. Wait a few seconds and try again.";
  if (err?.code === "ECONNREFUSED" || err?.code === "ENOTFOUND")
    return "Code execution service is unreachable. Try again in a moment.";
  return err?.message || "Execution failed.";
};

const executeWandbox = async ({ language, code, stdin, batch }) => {
  const compiler = WANDBOX_COMPILERS[language];
  const payload = {
    code:
      language === "java"
        ? code.replace("public class Main", "class Main")
        : code,
    compiler,
    stdin: stdin || "",
  };

  const response = await axios.post(WANDBOX_URL, payload, {
    headers: { "Content-Type": "application/json" },
    timeout: batch ? 60000 : 30000,
  });

  const data = response.data || {};
  const compileError = (data.compiler_error || "").trim();
  const programError = (data.program_error || "").trim();
  const hasRealError =
    compileError && /(^|[\s:])error(\s|:)/i.test(compileError);

  if (hasRealError) {
    return {
      stdout: "",
      stderr: compileError,
      timedOut: false,
      errorKind: "compile",
      warnings: null,
    };
  }

  if (data.signal) {
    return {
      stdout: data.program_output || "",
      stderr: "Time limit exceeded",
      timedOut: true,
      errorKind: "timeout",
      warnings: null,
    };
  }

  return {
    stdout: data.program_output || "",
    stderr: programError || null,
    timedOut: false,
    errorKind: programError ? "runtime" : null,
    warnings: compileError || null,
  };
};

const executeJdoodle = async ({ language, code, stdin, batch }) => {
  const conf = JDOODLE_LANG[language];
  const response = await axios.post(
    JDOODLE_URL,
    {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      language: conf.language,
      versionIndex: conf.versionIndex,
      stdin: stdin || "",
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: batch ? 60000 : 30000,
    },
  );

  const data = response.data || {};
  if (data.statusCode !== 200) {
    const errText = (data.error || data.output || "Execution failed.").trim();
    return {
      stdout: "",
      stderr: errText,
      timedOut: false,
      errorKind: detectCompileKind(language, errText),
    };
  }

  return {
    stdout: data.output || "",
    stderr: null,
    timedOut: false,
    errorKind: null,
  };
};

const executePiston = async ({ language, code, stdin, batch }) => {
  const config = PISTON_CONFIG[language];
  const response = await axios.post(
    PISTON_URL,
    {
      language: config.language,
      version: config.version,
      files: [{ name: config.filename, content: code }],
      stdin: stdin || "",
      compile_timeout: 10000,
      run_timeout: batch ? 15000 : 3000,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: batch ? 40000 : 20000,
    },
  );

  const { compile, run } = response.data;
  const compileError =
    compile?.stderr?.trim() ||
    (compile && compile.code !== 0 ? compile.output : null);
  const runStderr = run?.stderr?.trim() || null;
  const timedOut = run?.signal === "SIGKILL" || compile?.signal === "SIGKILL";

  return {
    stdout: run?.stdout || "",
    stderr: compileError || runStderr || null,
    timedOut,
    errorKind: timedOut
      ? "timeout"
      : compileError
        ? "compile"
        : runStderr
          ? "runtime"
          : null,
  };
};

const executeLocalNode = async ({ code, stdin, batch }) => {
  const safeInput = JSON.stringify(stdin || "");
  const program = String(code).replace(
    'require("fs").readFileSync(0, "utf8")',
    "(" + safeInput + ")",
  );
  const file = join(tmpdir(), "interviewiq-" + randomUUID() + ".cjs");
  await writeFile(file, program, "utf8");
  try {
    const result = await new Promise((resolve) => {
      execFile(
        process.execPath,
        [file],
        { timeout: batch ? 30000 : 8000, maxBuffer: 4 * 1024 * 1024 },
        (error, stdout, stderr) => {
          if (error && (error.killed || error.signal === "SIGTERM")) {
            resolve({
              stdout: stdout || "",
              stderr: "Time limit exceeded",
              timedOut: true,
              errorKind: "timeout",
            });
          } else {
            const errText = (stderr || "").trim() || null;
            resolve({
              stdout: stdout || "",
              stderr: errText,
              timedOut: false,
              errorKind: errText ? "runtime" : null,
            });
          }
        },
      );
    });
    return result;
  } finally {
    unlink(file).catch(() => {});
  }
};

const executeOnce = async ({ language, code, stdin, batch }) => {
  if (language === "javascript" && RUNNER !== "jdoodle") {
    return executeLocalNode({ code, stdin, batch });
  }
  const provider = pickProvider(language);
  if (!provider) {
    throw new Error(
      language === "javascript"
        ? "JavaScript execution needs a free JDoodle API key. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to the server .env."
        : `Code execution is not configured for "${language}" right now.`,
    );
  }
  if (provider === "wandbox")
    return executeWandbox({ language, code, stdin, batch });
  if (provider === "jdoodle")
    return executeJdoodle({ language, code, stdin, batch });
  return executePiston({ language, code, stdin, batch });
};

const extractCaseBlock = (stdout, uuid, i) => {
  const open = "__IQ" + uuid + "B" + i + "__";
  const close = "__IQ" + uuid + "E" + i + "__";
  const start = stdout.indexOf(open);
  if (start < 0) return null;
  const end = stdout.indexOf(close, start + open.length);
  if (end < 0) return null;
  let block = stdout.slice(start + open.length, end);
  if (block.startsWith("\n")) block = block.slice(1);
  if (block.endsWith("\n")) block = block.slice(0, -1);
  return block;
};

const blankCaseResult = (testCase, fields) =>
  Object.assign(
    {
      input: testCase.input,
      expectedOutput: testCase.expectedOutput.trim(),
      actualOutput: "",
      passed: false,
      error: null,
      errorKind: null,
      skipped: false,
    },
    fields,
  );

const runTestCasesLegacy = async ({
  language,
  code,
  testCases,
  io,
  funcName,
  returns,
}) => {
  const results = [];

  const program =
    io && funcName && returns
      ? buildProgram(io, language, funcName, returns, code)
      : code;

  for (let caseIdx = 0; caseIdx < testCases.length; caseIdx++) {
    const testCase = testCases[caseIdx];
    if (caseIdx > 0) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    let attempt = 0;
    for (;;) {
      try {
        const { stdout, stderr, timedOut } = await executeOnce({
          language,
          code: program,
          stdin: testCase.input,
        });

        const actualOutput = stdout.trim();
        const expectedOutput = testCase.expectedOutput.trim();
        const passed = !stderr && !timedOut && actualOutput === expectedOutput;

        results.push(
          blankCaseResult(testCase, {
            actualOutput,
            passed,
            error: timedOut
              ? "Time limit exceeded"
              : stderr
                ? stderr.trim()
                : null,
            errorKind: timedOut ? "tle" : stderr ? "runtime" : null,
          }),
        );
        break;
      } catch (err) {
        const rateLimited = err.response?.status === 429;
        if (rateLimited && attempt < 2) {
          attempt += 1;
          await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
          continue;
        }
        results.push(
          blankCaseResult(testCase, {
            error: err.message?.includes("JDOODLE")
              ? err.message
              : friendlyRunError(err),
            errorKind: "runtime",
          }),
        );
        break;
      }
    }
  }

  return { supported: true, results };
};

export const runTestCases = async ({
  language,
  code,
  testCases,
  io,
  funcName,
  returns,
}) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return {
      supported: false,
      results: [],
      message: `Running against test cases isn't available for "${language}" yet. You can still submit for AI review.`,
    };
  }

  const provider = pickProvider(language);
  if (!provider) {
    return {
      supported: false,
      results: [],
      message:
        language === "javascript"
          ? "JavaScript execution needs a free JDoodle API key. Add JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET to the server .env, then try again."
          : `Code execution isn't available for "${language}" right now. Try again later.`,
    };
  }

  const uuid = randomUUID().replace(/-/g, "");
  const batchProgram =
    io && funcName && returns
      ? buildBatchProgram(
          io,
          language,
          funcName,
          returns,
          code,
          testCases.map((t) => t.input),
          uuid,
        )
      : null;

  if (!batchProgram) {
    return runTestCasesLegacy({
      language,
      code,
      testCases,
      io,
      funcName,
      returns,
    });
  }

  let execResult;
  let attempt = 0;
  for (;;) {
    try {
      execResult = await executeOnce({
        language,
        code: batchProgram,
        stdin: "",
        batch: true,
      });
      break;
    } catch (err) {
      if (err?.response?.status === 429 && attempt < 2) {
        attempt += 1;
        await new Promise((resolve) => setTimeout(resolve, 3000 * attempt));
        continue;
      }
      return {
        supported: true,
        results: testCases.map((t) =>
          blankCaseResult(t, {
            error: friendlyRunError(err),
            errorKind: "runtime",
          }),
        ),
      };
    }
  }

  const stdout = execResult.stdout || "";
  const stderr = (execResult.stderr || "").trim() || null;
  const timedOut = Boolean(execResult.timedOut);
  const topKind = execResult.errorKind || null;

  const results = [];
  let stoppedAt = -1;
  for (let i = 0; i < testCases.length; i++) {
    const block = extractCaseBlock(stdout, uuid, i);
    if (block === null) {
      stoppedAt = i;
      break;
    }
    const xMark = "__IQ" + uuid + "X" + i + "__";
    const xPos = block.indexOf(xMark);
    let actualOutput;
    let error = null;
    let errorKind = null;
    if (xPos >= 0) {
      actualOutput = block.slice(0, xPos).trim();
      error = block.slice(xPos + xMark.length).trim() || "Runtime error";
      errorKind = "runtime";
    } else {
      actualOutput = block.trim();
    }
    const expectedOutput = testCases[i].expectedOutput.trim();
    results.push(
      blankCaseResult(testCases[i], {
        actualOutput,
        passed: !error && actualOutput === expectedOutput,
        error,
        errorKind,
      }),
    );
  }

  if (stoppedAt >= 0) {
    if (timedOut) {
      for (let i = stoppedAt; i < testCases.length; i++) {
        results.push(
          blankCaseResult(
            testCases[i],
            i === stoppedAt
              ? { error: "Time Limit Exceeded", errorKind: "tle" }
              : { skipped: true },
          ),
        );
      }
    } else if (
      topKind === "compile" ||
      (results.length === 0 && (stderr || stdout.trim()))
    ) {
      const msg = stderr || stdout.trim() || "Compilation failed.";
      const kind =
        topKind === "compile" ? "compile" : detectCompileKind(language, msg);
      for (let i = stoppedAt; i < testCases.length; i++) {
        results.push(
          blankCaseResult(testCases[i], { error: msg, errorKind: kind }),
        );
      }
    } else {
      const emptyReturnCrash = /no return statement/i.test(execResult.warnings || "");
      if (emptyReturnCrash) {
        results.push(
          blankCaseResult(testCases[stoppedAt], {
            actualOutput: "",
            passed: false,
          }),
        );
      } else {
        const msg =
          stderr || "Runtime error: the program crashed before finishing.";
        const kind = topKind || detectCompileKind(language, msg);
        results.push(
          blankCaseResult(testCases[stoppedAt], {
            error: msg,
            errorKind: kind,
          }),
        );
      }
      for (let i = stoppedAt + 1; i < testCases.length; i++) {
        results.push(blankCaseResult(testCases[i], { skipped: true }));
      }
    }
  }

  return { supported: true, results };
};

export const isLanguageSupportedForExecution = (language) =>
  SUPPORTED_LANGUAGES.includes(language);

export const EXECUTION_LANGUAGES = SUPPORTED_LANGUAGES;
