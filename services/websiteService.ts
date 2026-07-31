import { supabase } from "@/lib/supabase";
import { Order } from "@/types/order";

export type GeneratedWebsiteStatus = "Draft" | "Published" | "Archived";

export interface GeneratedWebsiteRecord {
  id: number;
  business_name: string;
  business_type: string;
  template: string;
  description: string;
  slug: string;
  status: string;
  created_at: string;
  address?: string;
  phone?: string;
  email?: string;
  menu_item_1?: string;
  menu_price_1?: string;
  menu_item_2?: string;
  menu_price_2?: string;
  menu_item_3?: string;
  menu_price_3?: string;
  menu_item_4?: string;
  menu_price_4?: string;
  opening_hours_mon_thu?: string;
  opening_hours_fri_sat?: string;
  opening_hours_sun?: string;
  gallery_image_1?: string;
  gallery_image_2?: string;
  gallery_image_3?: string;
  gallery_image_4?: string;
}

export function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(name: string) {
  const baseSlug = createSlug(name);
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const { data, error } = await supabase
      .from("generated_websites")
      .select("id")
      .eq("slug", slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Slug lookup error:", error);
      return slug;
    }

    if (!data) {
      return slug;
    }

    slug = `${baseSlug}-${count}`;
    count += 1;
  }
}

export async function getGeneratedWebsiteById(
  id: number
): Promise<GeneratedWebsiteRecord | null> {
  const { data, error } = await supabase
    .from("generated_websites")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load generated website:", error);
    return null;
  }

  return data as GeneratedWebsiteRecord | null;
}

export async function createGeneratedWebsite(
  website: Omit<GeneratedWebsiteRecord, "id" | "created_at"> & {
    status?: GeneratedWebsiteStatus;
  }
): Promise<GeneratedWebsiteRecord | null> {
  const { data, error } = await supabase
    .from("generated_websites")
    .insert({
      ...website,
      status: website.status || "Draft",
    })
    .select("*")
    .single();

  if (error) {
    console.error("Generated website creation error:", error);
    return null;
  }

  return data as GeneratedWebsiteRecord;
}

export async function createWebsiteFromOrder(
  order: Order
): Promise<GeneratedWebsiteRecord | null> {
  const slug = await generateUniqueSlug(order.business_name || "website");

  const websiteData: Omit<GeneratedWebsiteRecord, "id" | "created_at"> & {
    status?: GeneratedWebsiteStatus;
  } = {
    business_name: order.business_name,
    business_type: order.business_type || "Restaurant",
    template: order.template || "Modern",
    description: order.website_description || "",
    slug,
    status: "Draft",
  };

  const address = order.address || order.business_address;
  const phone = order.whatsapp;
  const email = order.email;

  if (address) {
    websiteData.address = address;
  }

  if (phone) {
    websiteData.phone = phone;
  }

  if (email) {
    websiteData.email = email;
  }

  return await createGeneratedWebsite(websiteData);
}

export async function deleteGeneratedWebsite(
  id: number
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from("generated_websites")
    .delete()
    .eq("id", id);

  return { error };
}

export async function createWebsiteFromOrderIfMissing(
  order: Order
): Promise<GeneratedWebsiteRecord | null> {
  if (order.generated_website_id) {
    return null;
  }

  return await createWebsiteFromOrder(order);
}
