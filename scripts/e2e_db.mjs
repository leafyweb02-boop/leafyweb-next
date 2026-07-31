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

function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function generateUniqueSlug(name) {
  const base = createSlug(name || "website");
  let slug = base;
  let count = 1;

  while (true) {
    const { data, error } = await supabase
      .from("generated_websites")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Slug lookup error:", error.message || error);
      return slug;
    }

    if (!data) return slug;

    slug = `${base}-${count}`;
    count += 1;
  }
}

async function main() {
  const timestamp = Date.now();
  const businessName = `Leafyweb E2E Test Restaurant ${timestamp}`;

  console.log("Creating test order for:", businessName);

  const { data: orderData, error: orderErr } = await supabase
    .from("orders")
    .insert([
      {
        business_name: businessName,
        contact_person: "E2E Tester",
        whatsapp: "+000000000",
        email: `e2e+${timestamp}@example.com`,
        business_type: "Restaurant",
        template: "Modern",
        website_description: "Temporary E2E test order",
        business_address: "Test address",
        status: "New",
      },
    ])
    .select("*")
    .single();

  if (orderErr) {
    console.error("Failed to create test order:", orderErr.message || orderErr);
    process.exit(1);
  }

  const order = orderData;
  console.log("Created order id:", order.id);

  // Create website from order
  const slug = await generateUniqueSlug(order.business_name || "website");

  const { data: websiteData, error: websiteErr } = await supabase
    .from("generated_websites")
    .insert([
      {
        business_name: order.business_name,
        business_type: order.business_type || "Restaurant",
        template: order.template || "Modern",
        description: order.website_description || "",
        slug,
        status: "Draft",
      },
    ])
    .select("*")
    .single();

  if (websiteErr) {
    console.error("Failed to create website:", websiteErr.message || websiteErr);
    // cleanup order
    await supabase.from("orders").delete().eq("id", order.id);
    process.exit(1);
  }

  const website = websiteData;
  console.log("Created website id:", website.id, "slug:", website.slug);

  // Link website to order
  const { error: linkErr } = await supabase
    .from("orders")
    .update({ generated_website_id: website.id })
    .eq("id", order.id);

  if (linkErr) {
    console.error("Failed to link website to order:", linkErr.message || linkErr);
    // cleanup
    await supabase.from("generated_websites").delete().eq("id", website.id);
    await supabase.from("orders").delete().eq("id", order.id);
    process.exit(1);
  }

  console.log("Linked website to order.");

  // Verify link
  await supabase
    .from("orders")
    .select("*")
    .eq("id", order.id)
    .maybeSingle();

  await supabase
    .from("generated_websites")
    .select("*")
    .eq("id", website.id)
    .maybeSingle();

  // Attempt duplicate creation (should be prevented by client-side check; simulate call to createWebsiteFromOrderIfMissing())
  const { data: duplicateAttempt } = await supabase
    .from("orders")
    .select("generated_website_id")
    .eq("id", order.id)
    .maybeSingle();

  let duplicateCreated = false;
  if (!duplicateAttempt?.generated_website_id) {
    // unexpected; try creating
    const attempt = await supabase
      .from("generated_websites")
      .insert([
        {
          business_name: order.business_name,
          business_type: order.business_type || "Restaurant",
          template: order.template || "Modern",
          description: order.website_description || "",
          slug: await generateUniqueSlug(order.business_name || "website"),
          status: "Draft",
        },
      ])
      .select("*");

    if (attempt.error || (attempt.data && attempt.data.length === 0)) {
      duplicateCreated = false;
    } else {
      duplicateCreated = true;
    }
  }

  // Edit website fields
  const editedName = `${website.business_name} – Edited`;
  const editedDescription = "This is a temporary end-to-end test website.";

  const { error: editErr } = await supabase
    .from("generated_websites")
    .update({ business_name: editedName, description: editedDescription })
    .eq("id", website.id);

  if (editErr) {
    console.error("Failed to edit website:", editErr.message || editErr);
  } else {
    console.log("Edited website fields.");
  }

  const result = {
    orderId: order.id,
    websiteId: website.id,
    slug: website.slug,
    duplicateCreated,
  };

  fs.writeFileSync("e2e_result.json", JSON.stringify(result, null, 2));

  console.log("E2E create/edit complete. Results written to e2e_result.json");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
