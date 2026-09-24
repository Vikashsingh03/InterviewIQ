import initSqlJs from "sql.js";
let sqlPromise = null;
const getSQL = () => {
  if (!sqlPromise) sqlPromise = initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
  return sqlPromise;
};
export const runSqlQuery = async (schemaSql, query) => {
  const SQL = await getSQL();
  const db = new SQL.Database();
  try {
    db.exec(schemaSql);
  } catch (e) {
    try { db.close(); } catch (ignored) { void ignored; }
    return { error: "Could not load the task database." };
  }
  try {
    const results = db.exec(query);
    try { db.close(); } catch (ignored) { void ignored; }
    const last = results.length ? results[results.length - 1] : null;
    if (!last) return { columns: [], rows: [] };
    return { columns: last.columns, rows: last.values };
  } catch (e) {
    try { db.close(); } catch (ignored) { void ignored; }
    return { error: e.message || "Query failed." };
  }
};
export const getSchemaTables = async schemaSql => {
  const SQL = await getSQL();
  const db = new SQL.Database();
  try {
    db.exec(schemaSql);
    const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")[0].values.map(r => r[0]);
    const out = tables.map(t => {
      const cols = db.exec(`PRAGMA table_info("${t}");`)[0].values.map(r => `${r[1]} (${r[2]})`);
      const count = db.exec(`SELECT COUNT(*) FROM "${t}";`)[0].values[0][0];
      return { name: t, columns: cols, count };
    });
    try { db.close(); } catch (ignored) { void ignored; }
    return out;
  } catch (e) {
    try { db.close(); } catch (ignored) { void ignored; }
    return [];
  }
};
