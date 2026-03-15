const { Pool } = require("pg");

async function test(label, user, password, host, port) {
  const pool = new Pool({
    host,
    port,
    database: "postgres",
    user,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    const c = await pool.connect();
    const r = await c.query('SELECT COUNT(*) FROM "Student"');
    c.release();
    await pool.end();
    return "OK - students: " + r.rows[0].count;
  } catch (e) {
    await pool.end().catch(() => {});
    return "FAIL: " + e.message.split("\n")[0];
  }
}

(async () => {
  const pooler = "aws-0-ap-south-1.pooler.supabase.com";
  const direct = "db.rbwhugwstkjyebsfsyux.supabase.co";
  const ref = "postgres.rbwhugwstkjyebsfsyux";

  const tests = [
    ["pooler:6543 old-pw", ref,        "Bolero@8178199664", pooler, 6543],
    ["pooler:6543 new-pw", ref,        "4achievers2026",    pooler, 6543],
    ["pooler:5432 old-pw", ref,        "Bolero@8178199664", pooler, 5432],
    ["pooler:5432 new-pw", ref,        "4achievers2026",    pooler, 5432],
    ["direct:5432 new-pw", "postgres", "4achievers2026",    direct, 5432],
    ["direct:5432 old-pw", "postgres", "Bolero@8178199664", direct, 5432],
  ];

  for (const [label, user, pw, host, port] of tests) {
    const res = await test(label, user, pw, host, port);
    console.log(label + ": " + res);
  }
})();
