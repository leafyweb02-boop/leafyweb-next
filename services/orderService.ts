import { supabase } from "@/lib/supabase";
import { Order, OrderStatus } from "@/types/order";

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data as Order[];
}

export async function deleteOrder(id: number) {
  return await supabase
    .from("orders")
    .delete()
    .eq("id", id);
}

export async function updateOrderStatus(
  id: number,
  status: OrderStatus
) {
  return await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
}

export async function updateOrderGeneratedWebsiteId(
  id: number,
  generated_website_id: number
) {
  return await supabase
    .from("orders")
    .update({ generated_website_id })
    .eq("id", id);
}