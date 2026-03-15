const { Pool } = require("pg");

const ref = "rbwhugwstkjyebsfsyux";
const password = "Bolero@8178199664"; // actual password, no URL encoding needed with explicit params
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
