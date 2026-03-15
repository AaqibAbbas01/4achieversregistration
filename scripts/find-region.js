const { Pool } = require("pg");

async function test(label, user, password, host, port) {
  const pool = new Pool({
    host, port, database: "postgres", user, password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    const c = await pool.connect();
    const r = await c.query('SELECT COUNT(*) FROM "Student"');
    c.release();
    await pool.end();
    return "✅ OK - students: " + r.rows[0].count;
  } catch (e) {
    await pool.end().catch(() => {});
    return "❌ " + e.message.split("\n")[0];
  }
}

(async () => {
  const pooler = "aws-0-ap-south-1.pooler.supabase.com";
  const direct = "db.rbwhugwstkjyebsfsyux.supabase.co";
  const ref = "postgres.rbwhugwstkjyebsfsyux";

  const tests = [
    ["pooler:6543 old-pw", ref,       "Bolero@8178199664", pooler, 6543],
    ["pooler:6543 new-pw", ref,       "4achievers2026",    pooler, 6543],
    ["pooler:5432 old-pw", ref,       "Bolero@8178199664", pooler, 5432],
    ["pooler:5432 new-pw", ref,       "4achievers2026",    pooler, 5432],
    ["direct:5432 new-pw", "postgres","4achievers2026",    direct, 5432],
    ["direct:5432 old-pw", "postgres","Bolero@8178199664", direct, 5432],
  ];

  for (const [label, user, pw, host, port] of tests) {
    const res = await test(label, user, pw, host, port);
    console.log(label + ": " + res);
  }
})();

const regions = [
  "ap-south-1",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "us-east-1",
  "us-west-1",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "sa-east-1",
  "ca-central-1",
];

async function testRegion(region) {
  const pool = new Pool({
    host: `aws-0-${region}.pooler.supabase.com`,
    port: 6543,
    database: "postgres",
    user: `postgres.${ref}`,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
  try {
    const client = await pool.connect();
    const res = await client.query("SELECT 1 as ok");
    client.release();
    await pool.end();
    return { region, status: "✅ CONNECTED" };
  } catch (e) {
    await pool.end().catch(() => {});
    return { region, status: `❌ ${e.message.split("\n")[0]}` };
  }
}

(async () => {
  console.log("Testing Supabase pooler regions (explicit params)...\n");
  for (const region of regions) {
    const result = await testRegion(region);
    console.log(`${result.region}: ${result.status}`);
    if (result.status.startsWith("✅")) {
      console.log(`\n🎯 Found! Use region: ${result.region}`);
      process.exit(0);
    }
  }
  // Also try direct connection
  console.log("\nTrying direct connection (db.{ref}.supabase.co:5432)...");
  const pool = new Pool({
    host: `db.${ref}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    await pool.end();
    console.log("Direct: ✅ CONNECTED");
  } catch (e) {
    await pool.end().catch(() => {});
    console.log(`Direct: ❌ ${e.message.split("\n")[0]}`);
  }
})();
