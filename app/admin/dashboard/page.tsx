"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Order {
  id: number;
  business_name: string;
  contact_person: string;
  whatsapp: string;
  email: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchOrders() {
      await loadOrders();
    }

    void fetchOrders();
  }, [loadOrders]);

  return (
    <div>
      <h1 className="text-5xl font-bold text-white mb-8">
        Dashboard
      </h1>

      {/* Total Orders Card */}
      <div className="bg-[#1d1d1d] rounded-3xl p-8 w-96 mb-10">
        <p className="text-gray-400 text-lg">
          Total Orders
        </p>

        <h2 className="text-6xl font-bold text-white">
          {orders.length}
        </h2>
      </div>

      {/* Latest Orders */}
      <div className="bg-[#1d1d1d] rounded-3xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6">
          Latest Orders
        </h2>

        <table className="w-full text-white">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="pb-4">Contact Person</th>
              <th className="pb-4">Business</th>
              <th className="pb-4">WhatsApp</th>
              <th className="pb-4">Email</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400"
                >
                  Loading...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400"
                >
                  No Orders Found
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-800"
                >
                  <td className="py-4">
                    {order.contact_person}
                  </td>

                  <td>
                    {order.business_name}
                  </td>

                  <td>
                    {order.whatsapp}
                  </td>

                  <td>
                    {order.email}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}