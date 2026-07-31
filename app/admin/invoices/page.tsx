"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Invoice = {
  id: number;
  order_id: number;
  invoice_number: string;
  amount: number | null;
  status: string | null;
};

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const loadInvoices = useCallback(async () => {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setInvoices(data || []);
    }
  }, []);

  useEffect(() => {
    async function fetchInvoices() {
      await loadInvoices();
    }

    void fetchInvoices();
  }, [loadInvoices]);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Invoice History
      </h1>

      <div className="bg-white rounded-2xl overflow-hidden shadow">

        <table className="w-full">

          <thead className="bg-orange-500 text-white">

            <tr>
              <th className="p-4 text-left">Invoice</th>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>

          </thead>

          <tbody>

            {invoices.map((invoice) => (

              <tr
                key={invoice.id}
                className="border-b"
              >
                <td className="p-4">
                  {invoice.invoice_number}
                </td>

                <td className="p-4">
                  #{invoice.order_id}
                </td>

                <td className="p-4">
                  ₹{invoice.amount}
                </td>

                <td className="p-4">
                  {invoice.status}
                </td>

                <td className="p-4">
                  <Link
                    href={`/admin/invoices/${invoice.id}`}
                    className="text-orange-500 font-semibold"
                  >
                    View
                  </Link>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}