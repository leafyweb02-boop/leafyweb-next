"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useReactToPrint } from "react-to-print";
import { supabase } from "@/lib/supabase";
import { Order } from "@/types/order";

type OrderData = Omit<Order, "amount"> & {
  package_name?: string;
  amount?: number | string;
};

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const invoiceId = Number(id);

  const [status, setStatus] = useState("Pending");
  const [invoice, setInvoice] = useState<{
    id: number;
    order_id: number;
    invoice_number: string;
    package_name?: string | null;
    amount?: number | null;
    tax?: number | null;
    total?: number | null;
    status?: string | null;
  } | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Leafyweb-Invoice-${id}`,
  });

  const loadInvoice = useCallback(async () => {
    if (!invoiceId || Number.isNaN(invoiceId)) {
      setLoading(false);
      setInvoice(null);
      setOrder(null);
      return;
    }

    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoiceData) {
      console.error("Invoice loading error:", invoiceError);
      setInvoice(null);
      setOrder(null);
      setLoading(false);
      return;
    }

    setInvoice(invoiceData);
    setStatus(invoiceData.status || "Pending");

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", invoiceData.order_id)
      .single();

    if (orderError || !orderData) {
      console.error("Order loading error:", orderError);
      setOrder(null);
      setLoading(false);
      return;
    }

    setOrder(orderData);
    setLoading(false);
  }, [invoiceId]);

  useEffect(() => {
    async function fetchInvoice() {
      await loadInvoice();
    }

    void fetchInvoice();
  }, [loadInvoice]);

  const [dueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString();
  });

  async function updateStatus(
    value: string
  ) {
    setStatus(value);

    if (!invoiceId || Number.isNaN(invoiceId)) {
      return;
    }

    const { error } = await supabase
      .from("invoices")
      .update({
        status: value,
      })
      .eq("id", invoiceId);

    if (error) {
      console.error(
        "Status update error:",
        error
      );
    }
  }

 function downloadPDF() {
  if (!invoiceRef.current) return;

  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=1000"
  );

  if (!printWindow) {
    alert(
      "Please allow pop-ups and try again."
    );
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Leafyweb Invoice</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            background: white;
            color: #1f2937;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
          }

          @page {
            size: A4;
            margin: 12mm;
          }

          button {
            display: none !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 14px;
            border: 1px solid #d1d5db;
          }

          th {
            background: #f3f4f6;
          }

          .text-orange-500 {
            color: #f97316 !important;
          }

          .bg-white {
            background: white !important;
          }

          .shadow-xl {
            box-shadow: none !important;
          }
        </style>
      </head>

      <body>
        ${invoiceRef.current.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        Invoice not found.
      </div>
    );
  }

  const invoiceNo =
    invoice.invoice_number ||
    `INV-${new Date().getFullYear()}-${String(
      invoiceId
    ).padStart(4, "0")}`;

  const invoiceDate =
    new Date().toLocaleDateString();

  const packageName =
    invoice.package_name ||
    order?.package_name ||
    "Starter Package";

  const amount = Number(
    invoice.amount ?? order?.amount ?? 999
  );

  const tax = invoice.tax ?? 0;

  const total = invoice.total ?? amount + tax;

  const statusColor =
    status === "Paid"
      ? "bg-blue-500"
      : status === "Completed"
      ? "bg-green-500"
      : status === "Cancelled"
      ? "bg-red-500"
      : "bg-yellow-500";

  return (
    <div className="p-10">

      {/* Action Buttons */}
      <div className="mb-6 flex flex-wrap items-center gap-4">

        <button
          onClick={handlePrint}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          🖨 Print Invoice
        </button>

        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          📄 Download PDF
        </button>

        <select
          value={status}
          onChange={(e) =>
            updateStatus(
              e.target.value
            )
          }
          className="border rounded-xl px-4 py-3 bg-white text-black"
        >
          <option value="Pending">
            Pending
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

      </div>

      <div className="mb-6">

        <span
          className={`${statusColor} text-white px-4 py-2 rounded-full font-semibold`}
        >
          {status}
        </span>

      </div>

      {/* Printable Invoice */}
      <div
        ref={invoiceRef}
        className="bg-white rounded-3xl shadow-xl p-10 text-gray-900"
      >

        <div className="flex justify-between">

          <div>

            <h1 className="text-5xl font-bold text-orange-500">
              LEAFYWEB
            </h1>

            <p className="text-gray-500 mt-2">
              Professional Website Studio
            </p>

          </div>

          <div className="text-right">

            <h2 className="text-3xl font-bold">
              INVOICE
            </h2>

            <p className="mt-4">
              <strong>No:</strong>{" "}
              {invoiceNo}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {invoiceDate}
            </p>

            <p>
              <strong>Due:</strong>{" "}
              {dueDate}
            </p>

          </div>

        </div>

        <hr className="my-10" />

        <div className="grid grid-cols-2 gap-10">

          <div>

            <h3 className="font-bold text-xl mb-4">
              Bill To
            </h3>

            <p>
              {order?.contact_person || "Customer"}
            </p>

            <p>
              {order?.business_name || "No business name"}
            </p>

            <p>
              {order?.email || "No email provided"}
            </p>

            <p>
              {order?.whatsapp || "No phone provided"}
            </p>

          </div>

          <div>

            <h3 className="font-bold text-xl mb-4">
              Service
            </h3>

            <p>
              {packageName}
            </p>

          </div>

        </div>

        <table className="w-full mt-10 border">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-4">
                Description
              </th>

              <th className="text-right p-4">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            <tr>

              <td className="p-4">
                {packageName}
              </td>

              <td className="text-right p-4">
                ₹{amount}
              </td>

            </tr>

            <tr>

              <td className="p-4">
                Tax
              </td>

              <td className="text-right p-4">
                ₹{tax}
              </td>

            </tr>

            <tr className="font-bold text-xl">

              <td className="p-4">
                Total
              </td>

              <td className="text-right p-4 text-orange-500">
                ₹{total}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}