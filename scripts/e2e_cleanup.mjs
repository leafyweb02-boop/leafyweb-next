import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local if present and env vars are not set
function loadEnvFile(path) {
  try {
    const src = fs.readFileSync(path, "utf8");
    src.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) return;
      const key = m[1];
      let val = m[2] || "";
      if (val.startsWith("\"") && val.endsWith("\"")) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    });
  } catch {
    // ignore
  }
}

loadEnvFile(".env.local");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars NEXT_PUBLIC_SUPABASE_URL / KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  if (!fs.existsSync("e2e_result.json")) {
    console.error("Missing e2e_result.json — nothing to clean up.");
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync("e2e_result.json", "utf-8"));
  const { orderId, websiteId } = data;

  if (websiteId) {
    const { error } = await supabase.from("generated_websites").delete().eq("id", websiteId);
    if (error) console.error("Failed to delete website:", error.message || error);
    else console.log("Deleted website id:", websiteId);
  }

  if (orderId) {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) console.error("Failed to delete order:", error.message || error);
    else console.log("Deleted order id:", orderId);
  }

  // remove result file
  try {
    fs.unlinkSync("e2e_result.json");
  } catch {
    // ignore
  }

  console.log("Cleanup complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
