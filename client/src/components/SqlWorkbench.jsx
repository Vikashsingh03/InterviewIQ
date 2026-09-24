import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { BsPlayFill, BsCheckCircleFill, BsXCircleFill, BsTable } from "react-icons/bs";
import { runSqlQuery, getSchemaTables } from "../utils/sqlRunner";
const MAX_ROWS_SHOWN = 50;
function SqlWorkbench({ schemaSql, disabled, onPayload }) {
  const [query, setQuery] = useState("SELECT * FROM employees LIMIT 5;");
  const [tables, setTables] = useState([]);
  const [showSchema, setShowSchema] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const onPayloadRef = useRef(onPayload);
  onPayloadRef.current = onPayload;
  useEffect(() => {
    let alive = true;
    getSchemaTables(schemaSql).then(t => {
      if (alive) setTables(t);
    });
    return () => {
      alive = false;
    };
  }, [schemaSql]);
  useEffect(() => {
    if (onPayloadRef.current) onPayloadRef.current({ query, result, error });
  }, [query, result, error]);
  const handleRun = async () => {
    if (isRunning || disabled) return;
    setIsRunning(true);
    setError(null);
    const out = await runSqlQuery(schemaSql, query);
    setIsRunning(false);
    setHasRun(true);
    if (out.error) {
      setError(out.error);
      setResult(null);
    } else {
      setError(null);
      setResult(out);
    }
  };
  const shownRows = result ? result.rows.slice(0, MAX_ROWS_SHOWN) : [];
  const hiddenCount = result ? result.rows.length - shownRows.length : 0;
  return <div className="flex flex-col rounded-2xl border border-[#1E2229] overflow-hidden mt-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)] bg-[#0C0E11]">
      <div className="flex items-center justify-between bg-[#0C0E11] px-4 py-2.5 border-b border-[#1E2229]">
        <span className="font-mono-studio text-[11px] text-[#8B92A0] tracking-[0.18em]">
          SQL WORKBENCH
        </span>
        <button type="button" onClick={() => setShowSchema(v => !v)} disabled={disabled} className="inline-flex items-center gap-1.5 font-mono-studio text-[11px] text-[#B27E2E] dark:text-[#E8A94C] hover:opacity-80 disabled:opacity-50 tracking-wide">
          <BsTable size={12} />
          {showSchema ? "HIDE SCHEMA" : "SHOW SCHEMA"}
        </button>
      </div>
      {showSchema && <div className="border-b border-[#1E2229] px-4 py-3 grid gap-2 sm:grid-cols-3">
          {tables.map(t => <div key={t.name} className="rounded-lg border border-[#262B34] bg-[#111318] p-2.5">
              <p className="font-mono-studio text-[11px] text-[#E8A94C] tracking-wide mb-1">
                {t.name} <span className="text-[#565D68]">· {t.count} rows</span>
              </p>
              <p className="font-mono-studio text-[10px] text-[#8B92A0] leading-relaxed">
                {t.columns.join(", ")}
              </p>
            </div>)}
        </div>}
      <div style={{ height: "300px" }}>
        <Editor height="300px" language="sql" value={query} onChange={value => setQuery(value ?? "")} theme="vs-dark" options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', monospace",
        minimap: { enabled: false },
        readOnly: disabled,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true
      }} />
      </div>
      <div className="flex items-center justify-between border-t border-[#1E2229] px-4 py-2.5">
        <button type="button" onClick={handleRun} disabled={disabled || isRunning} className="inline-flex items-center gap-2 rounded-lg bg-[#E8A94C] px-4 py-2 font-mono-studio text-[12px] font-bold tracking-wide text-[#0C0E11] hover:bg-[#F6D68A] disabled:opacity-50 transition-colors">
          <BsPlayFill size={14} />
          {isRunning ? "RUNNING…" : "RUN QUERY"}
        </button>
        {hasRun && !isRunning && <span className="inline-flex items-center gap-1.5 font-mono-studio text-[11px] tracking-wide">
            {error ? <><BsXCircleFill size={12} className="text-[#F87171]" /><span className="text-[#F0918D]">ERROR</span></> : <><BsCheckCircleFill size={12} className="text-[#4ADE80]" /><span className="text-[#8B92A0]">{result.rows.length} ROW{result.rows.length === 1 ? "" : "S"}</span></>}
          </span>}
      </div>
      {hasRun && !isRunning && <div className="border-t border-[#1E2229] max-h-56 overflow-auto">
          {error ? <p className="font-mono-studio text-xs text-[#F0918D] px-4 py-3 whitespace-pre-wrap leading-relaxed">{error}</p> : result.rows.length === 0 ? <p className="font-mono-studio text-xs text-[#8B92A0] px-4 py-3">Query ran successfully — 0 rows returned.</p> : <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#14161B]">
                <tr>
                  {result.columns.map((c, i) => <th key={i} className="font-mono-studio text-[10px] tracking-[0.14em] uppercase text-[#E8A94C] px-3 py-2 border-b border-[#262B34] whitespace-nowrap">{c}</th>)}
                </tr>
              </thead>
              <tbody>
                {shownRows.map((row, ri) => <tr key={ri} className={ri % 2 ? "bg-[#101216]" : ""}>
                    {row.map((cell, ci) => <td key={ci} className="font-mono-studio text-xs text-[#D8DCE3] px-3 py-1.5 border-b border-[#1E2229] whitespace-nowrap">{cell === null ? <span className="text-[#565D68]">NULL</span> : String(cell)}</td>)}
                  </tr>)}
              </tbody>
            </table>}
          {!error && hiddenCount > 0 && <p className="font-mono-studio text-[10px] text-[#565D68] px-4 py-2 tracking-wide">+ {hiddenCount} MORE ROWS</p>}
        </div>}
    </div>;
}
export default SqlWorkbench;
