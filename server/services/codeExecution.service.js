import axios from "axios";


const PISTON_URL = "http://localhost:2000/api/v2/execute";


const LANGUAGE_CONFIG = {
  cpp: { language: "c++", version: "10.2.0", filename: "main.cpp" },
  python: { language: "python", version: "3.12.0", filename: "main.py" },
  javascript: { language: "javascript", version: "20.11.1", filename: "main.js" },
  java: { language: "java", version: "15.0.2", filename: "Main.java" },
};

const SUPPORTED_LANGUAGES = Object.keys(LANGUAGE_CONFIG);

const executeOnce = async ({ language, code, stdin }) => {
  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    throw new Error(`Language "${language}" is not supported for test execution.`);
  }

  const response = await axios.post(
    PISTON_URL,
    {
      language: config.language,
      version: config.version,
      files: [{ name: config.filename, content: code }],
      stdin: stdin || "",
      compile_timeout: 10000,
      run_timeout: 3000,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 20000,
    }
  );

  const { compile, run } = response.data;

  const compileError =
    compile?.stderr?.trim() || (compile && compile.code !== 0 ? compile.output : null);
  const runStderr = run?.stderr?.trim() || null;
  const timedOut = run?.signal === "SIGKILL" || compile?.signal === "SIGKILL";

  return {
    stdout: run?.stdout || "",
    stderr: compileError || runStderr || null,
    timedOut,
  };
};


export const runTestCases = async ({ language, code, testCases }) => {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return {
      supported: false,
      results: [],
      message: `Running against test cases isn't available for "${language}" yet. You can still submit for AI review.`,
    };
  }

  const results = [];

  for (const testCase of testCases) {
    try {
      const { stdout, stderr, timedOut } = await executeOnce({
        language,
        code,
        stdin: testCase.input,
      });

      const actualOutput = stdout.trim();
      const expectedOutput = testCase.expectedOutput.trim();
      const passed = !stderr && !timedOut && actualOutput === expectedOutput;

      results.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
        error: timedOut ? "Time limit exceeded" : stderr ? stderr.trim() : null,
      });
    } catch (err) {
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput.trim(),
        actualOutput: "",
        passed: false,
        error:
          err.code === "ECONNREFUSED"
            ? "Local Piston container isn't running. Start it with: docker start piston_api"
            : err.message || "Execution failed.",
      });
    }
  }

  return { supported: true, results };
};

export const isLanguageSupportedForExecution = (language) =>
  SUPPORTED_LANGUAGES.includes(language);