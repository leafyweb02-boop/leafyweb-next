"use client";
import Header from "@/components/admin/Header";
import SearchBar from "@/components/admin/SearchBar";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");

  const loadOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setOrders(data || []);
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      await loadOrders();
    }

    void fetchOrders();
  }, [loadOrders]);

  async function deleteOrder(id: number) {
    const ok = confirm("Delete this order?");

    if (!ok) return;

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadOrders();
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    loadOrders();
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.business_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      order.contact_person
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-10">

      <Header />

<div className="mb-8">
  <SearchBar
    value={search}
    onChange={setSearch}
  />
</div>

      <div className="overflow-x-auto rounded-2xl border shadow">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Contact</th>

              <th className="p-4 text-left">Business</th>

              <th className="p-4 text-left">WhatsApp</th>

              <th className="p-4 text-left">Email</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">
                  {order.contact_person}
                </td>

                <td className="p-4">
                  {order.business_name}
                </td>

                <td className="p-4">
                  {order.whatsapp}
                </td>

                <td className="p-4">
                  {order.email}
                </td>

                <td className="p-4">

                  <select
                    value={order.status || "Pending"}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2"
                  >
                    <option>Pending</option>
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Awaiting Content</option>
                    <option>Ready for Review</option>
                    <option>Completed</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                  </select>

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}