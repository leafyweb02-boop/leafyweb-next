import { createClient } from "@supabase/supabase-js";

// Load .env.local if present and env vars are not set
const fs = await import("fs");
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

const [, , websiteIdArg, statusArg] = process.argv;

if (!websiteIdArg || !statusArg) {
  console.error("Usage: node e2e_set_status.mjs <websiteId> <status>");
  process.exit(1);
}

const websiteId = Number(websiteIdArg);
const status = statusArg;

async function main() {
  const { error } = await supabase
    .from("generated_websites")
    .update({ status })
    .eq("id", websiteId);

  if (error) {
    console.error("Failed to set status:", error.message || error);
    process.exit(1);
  }

  console.log(`Website ${websiteId} status set to ${status}`);
}

main();
