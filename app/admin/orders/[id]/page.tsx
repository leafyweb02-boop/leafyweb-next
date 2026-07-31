"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import jsPDF from "jspdf";

import { supabase } from "@/lib/supabase";
import CustomerCard from "@/components/admin/CustomerCard";
import { Order } from "@/types/order";
import {
  createWebsiteFromOrderIfMissing,
  deleteGeneratedWebsite,
  getGeneratedWebsiteById,
  GeneratedWebsiteRecord,
} from "@/services/websiteService";
import { updateOrderGeneratedWebsiteId } from "@/services/orderService";

interface TimelineRecord {
  id: number;
  order_id: number;
  title: string;
  description: string | null;
  type: string;
  created_at: string;
}

type TimelineEntry = TimelineRecord;

interface OrderDetail extends Order {
  website_address?: string;
  notes?: string;
  address?: string;
}

export default function CustomerDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");

  const [timeline, setTimeline] = useState<TimelineRecord[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Note");
  const [linkedWebsite, setLinkedWebsite] = useState<
    GeneratedWebsiteRecord | null
  >(null);
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [creatingWebsite, setCreatingWebsite] = useState(false);

  const [downloading, setDownloading] = useState(false);
  const [invoiceProcessing, setInvoiceProcessing] = useState(false);
  const [workflowMessage, setWorkflowMessage] = useState("");
  const [workflowError, setWorkflowError] = useState("");
  const router = useRouter();

  const loadLinkedWebsite = useCallback(
    async (websiteId?: number) => {
      if (!websiteId) {
        setLinkedWebsite(null);
        return;
      }

      setWebsiteLoading(true);
      const website = await getGeneratedWebsiteById(websiteId);
      setLinkedWebsite(website);
      setWebsiteLoading(false);
    },
    []
  );

  const loadOrder = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setOrder(data);
    setNotes(data?.notes || "");

    void loadLinkedWebsite(data?.generated_website_id);

    const {
      data: history,
      error: timelineError,
    } = await supabase
      .from("customer_timeline")
      .select("*")
      .eq("order_id", id)
      .order("created_at", {
        ascending: false,
      });

    if (timelineError) {
      console.error(timelineError);
    }

    setTimeline(history || []);
    setLoading(false);
  }, [id, loadLinkedWebsite]);

  useEffect(() => {
    async function fetchOrder() {
      await loadOrder();
    }

    void fetchOrder();
  }, [loadOrder]);

  async function saveNotes() {
    const { error } = await supabase
      .from("orders")
      .update({
        notes,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Notes saved successfully!");
    loadOrder();
  }

  async function createDraftWebsite() {
    if (!order) {
      return;
    }

    if (order.generated_website_id) {
      alert("This order already has a linked website.");
      return;
    }

    setCreatingWebsite(true);

    const website = await createWebsiteFromOrderIfMissing(order);

    if (!website) {
      setCreatingWebsite(false);
      alert("This order already has a linked website or the website could not be created.");
      return;
    }

    const { error } = await updateOrderGeneratedWebsiteId(order.id, website.id);

    if (error) {
      console.error(error);

      const { error: deleteError } = await deleteGeneratedWebsite(website.id);
      if (deleteError) {
        console.error("Rollback delete failed:", deleteError);
        alert(
          "Website was created but could not be linked to the order. The newly created website could not be removed automatically. Please remove it manually if needed."
        );
      } else {
        alert(
          "Website was created but could not be linked to the order. The created website has been removed to avoid an orphan record."
        );
      }

      setCreatingWebsite(false);
      return;
    }

    setOrder((current) =>
      current
        ? {
            ...current,
            generated_website_id: website.id,
          }
        : current
    );
    setLinkedWebsite(website);
    setCreatingWebsite(false);
    alert("Draft website created and linked to this order.");
  }

  async function openInvoice() {
    if (!order) return;

    if (invoiceProcessing) {
      return;
    }

    setInvoiceProcessing(true);
    setWorkflowError("");
    setWorkflowMessage("");

    const { data: existingInvoice, error: existingInvoiceError } = await supabase
      .from("invoices")
      .select("id")
      .eq("order_id", order.id)
      .maybeSingle();

    if (existingInvoiceError) {
      setWorkflowError(existingInvoiceError.message);
      setInvoiceProcessing(false);
      return;
    }

    if (existingInvoice?.id) {
      setWorkflowMessage("Existing invoice found. Opening it now.");
      setInvoiceProcessing(false);
      router.push(`/admin/invoices/${existingInvoice.id}`);
      return;
    }

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      order.id
    ).padStart(4, "0")}`;
    const amount = order.amount ?? 999;

    const { data: createdInvoice, error: createInvoiceError } = await supabase
      .from("invoices")
      .insert(
        {
          order_id: order.id,
          invoice_number: invoiceNumber,
          package_name: order.package_name || "Starter Package",
          amount,
          tax: 0,
          total: amount,
          status: "Pending",
        }
      )
      .select("id")
      .single();

    setInvoiceProcessing(false);

    if (createInvoiceError || !createdInvoice?.id) {
      setWorkflowError(
        createInvoiceError?.message || "Invoice could not be created. Please try again."
      );
      return;
    }

    setWorkflowMessage("Invoice created successfully.");
    router.push(`/admin/invoices/${createdInvoice.id}`);
  }

  async function addTimeline() {
    if (!title.trim()) {
      alert("Please enter a timeline title.");
      return;
    }

    const { error } = await supabase
      .from("customer_timeline")
      .insert({
        order_id: Number(id),
        title: title.trim(),
        description: description.trim(),
        type,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setType("Note");

    loadOrder();
  }

  async function downloadCustomerPDF() {
    try {
      setDownloading(true);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const margin = 16;

      const contentWidth =
        pageWidth - margin * 2;

      let y = 18;

      const orange = {
        r: 255,
        g: 122,
        b: 0,
      };

      const dark = {
        r: 18,
        g: 18,
        b: 18,
      };

      const gray = {
        r: 105,
        g: 105,
        b: 105,
      };

      const light = {
        r: 245,
        g: 245,
        b: 245,
      };

      const customerName =
        order?.business_name ||
        order?.contact_person ||
        "Customer";

      const status =
        order?.status || "Pending";

      const generatedDate =
        new Date().toLocaleString();

      const safeText = (
        value: unknown,
        fallback = "Not provided"
      ) => {
        if (
          value === null ||
          value === undefined ||
          String(value).trim() === ""
        ) {
          return fallback;
        }

        return String(value);
      };

      const drawHeader = (
        pageNumber: number
      ) => {
        pdf.setFillColor(
          dark.r,
          dark.g,
          dark.b
        );

        pdf.rect(
          0,
          0,
          pageWidth,
          38,
          "F"
        );

        pdf.setFillColor(
          orange.r,
          orange.g,
          orange.b
        );

        pdf.rect(
          0,
          35,
          pageWidth,
          3,
          "F"
        );

        pdf.setTextColor(
          255,
          255,
          255
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(23);

        pdf.text(
          "LEAFYWEB",
          margin,
          18
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(9);

        pdf.setTextColor(
          220,
          220,
          220
        );

        pdf.text(
          "Professional Website Studio",
          margin,
          25
        );

        pdf.setFontSize(8);

        pdf.text(
          `CUSTOMER PROFILE  •  ${pageNumber}`,
          pageWidth - margin,
          18,
          {
            align: "right",
          }
        );

        pdf.setTextColor(
          35,
          35,
          35
        );
      };

      const drawFooter = (
        pageNumber: number,
        totalPages: number
      ) => {
        pdf.setDrawColor(
          225,
          225,
          225
        );

        pdf.line(
          margin,
          pageHeight - 15,
          pageWidth - margin,
          pageHeight - 15
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
          gray.r,
          gray.g,
          gray.b
        );

        pdf.text(
          "Generated by Leafyweb",
          margin,
          pageHeight - 9
        );

        pdf.text(
          generatedDate,
          pageWidth / 2,
          pageHeight - 9,
          {
            align: "center",
          }
        );

        pdf.text(
          `Page ${pageNumber} of ${totalPages}`,
          pageWidth - margin,
          pageHeight - 9,
          {
            align: "right",
          }
        );

        pdf.setTextColor(
          35,
          35,
          35
        );
      };

      const newPage = () => {
        pdf.addPage();

        y = 50;

        drawHeader(
          pdf.getNumberOfPages()
        );
      };

      const ensureSpace = (
        requiredHeight: number
      ) => {
        if (
          y + requiredHeight >
          pageHeight - 24
        ) {
          newPage();
        }
      };

      drawHeader(1);

      y = 52;

      // Premium customer title section

      pdf.setFillColor(
        light.r,
        light.g,
        light.b
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        31,
        4,
        4,
        "F"
      );

      pdf.setFillColor(
        orange.r,
        orange.g,
        orange.b
      );

      pdf.roundedRect(
        margin,
        y,
        5,
        31,
        2,
        2,
        "F"
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(18);

      pdf.setTextColor(
        dark.r,
        dark.g,
        dark.b
      );

      pdf.text(
        safeText(customerName),
        margin + 11,
        y + 13
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(9);

      pdf.setTextColor(
        gray.r,
        gray.g,
        gray.b
      );

      pdf.text(
        "Customer Profile & Project Information",
        margin + 11,
        y + 21
      );

      const statusText =
        safeText(status);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(9);

      const statusWidth =
        pdf.getTextWidth(
          statusText.toUpperCase()
        ) + 12;

      pdf.setFillColor(
        statusText.toLowerCase() ===
          "completed"
          ? 34
          : orange.r,
        statusText.toLowerCase() ===
          "completed"
          ? 139
          : orange.g,
        statusText.toLowerCase() ===
          "completed"
          ? 34
          : orange.b
      );

      pdf.roundedRect(
        pageWidth -
          margin -
          statusWidth,
        y + 10,
        statusWidth,
        9,
        4,
        4,
        "F"
      );

      pdf.setTextColor(
        255,
        255,
        255
      );

      pdf.text(
        statusText.toUpperCase(),
        pageWidth -
          margin -
          statusWidth / 2,
        y + 16,
        {
          align: "center",
        }
      );

      pdf.setTextColor(
        35,
        35,
        35
      );

      y += 43;

          const drawSectionTitle = (
        title: string
      ) => {
        ensureSpace(18);

        pdf.setFillColor(
          orange.r,
          orange.g,
          orange.b
        );

        pdf.roundedRect(
          margin,
          y,
          4,
          9,
          2,
          2,
          "F"
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(15);

        pdf.setTextColor(
          dark.r,
          dark.g,
          dark.b
        );

        pdf.text(
          title,
          margin + 9,
          y + 7
        );

        y += 15;
      };

      const drawInfoCard = (
        label: string,
        value: unknown,
        x: number,
        cardY: number,
        width: number,
        height: number
      ) => {
        pdf.setFillColor(
          250,
          250,
          250
        );

        pdf.setDrawColor(
          230,
          230,
          230
        );

        pdf.roundedRect(
          x,
          cardY,
          width,
          height,
          3,
          3,
          "FD"
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
          gray.r,
          gray.g,
          gray.b
        );

        pdf.text(
          label.toUpperCase(),
          x + 6,
          cardY + 8
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(10);

        pdf.setTextColor(
          dark.r,
          dark.g,
          dark.b
        );

        const valueLines =
          pdf.splitTextToSize(
            safeText(value),
            width - 12
          );

        pdf.text(
          valueLines.slice(0, 2),
          x + 6,
          cardY + 16
        );
      };

      // CUSTOMER INFORMATION

      drawSectionTitle(
        "Customer Information"
      );

      const gap = 6;

      const cardWidth =
        (contentWidth - gap) / 2;

      const cardHeight = 28;

      drawInfoCard(
        "Business Name",
        order?.business_name,
        margin,
        y,
        cardWidth,
        cardHeight
      );

      drawInfoCard(
        "Contact Person",
        order?.contact_person,
        margin + cardWidth + gap,
        y,
        cardWidth,
        cardHeight
      );

      y += cardHeight + gap;

      drawInfoCard(
        "WhatsApp",
        order?.whatsapp,
        margin,
        y,
        cardWidth,
        cardHeight
      );

      drawInfoCard(
        "Email",
        order?.email,
        margin + cardWidth + gap,
        y,
        cardWidth,
        cardHeight
      );

      y += cardHeight + gap;

      drawInfoCard(
        "Business Type",
        order?.business_type,
        margin,
        y,
        cardWidth,
        cardHeight
      );

      drawInfoCard(
        "Selected Template",
        order?.template,
        margin + cardWidth + gap,
        y,
        cardWidth,
        cardHeight
      );

      y += cardHeight + 10;

      // PROJECT INFORMATION

      drawSectionTitle(
        "Project Information"
      );

      const drawWideCard = (
        label: string,
        value: unknown
      ) => {
        const text =
          safeText(value);

        const lines =
          pdf.splitTextToSize(
            text,
            contentWidth - 14
          );

        const cardHeight =
          Math.max(
            27,
            16 + lines.length * 5
          );

        ensureSpace(
          cardHeight + 6
        );

        pdf.setFillColor(
          250,
          250,
          250
        );

        pdf.setDrawColor(
          230,
          230,
          230
        );

        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          cardHeight,
          3,
          3,
          "FD"
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(8);

        pdf.setTextColor(
          gray.r,
          gray.g,
          gray.b
        );

        pdf.text(
          label.toUpperCase(),
          margin + 7,
          y + 8
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(10);

        pdf.setTextColor(
          dark.r,
          dark.g,
          dark.b
        );

        pdf.text(
          lines,
          margin + 7,
          y + 16
        );

        y += cardHeight + 6;
      };

      drawWideCard(
        "Address",
        order?.address ||
          order?.business_address
      );

      drawWideCard(
        "Website Description",
        order?.website_description
      );

      // ADMIN NOTES

      if (
        notes &&
        notes.trim()
      ) {
        drawSectionTitle(
          "Admin Notes"
        );

        const noteLines =
          pdf.splitTextToSize(
            notes.trim(),
            contentWidth - 16
          );

        const noteHeight =
          Math.max(
            32,
            20 +
              noteLines.length * 5
          );

        ensureSpace(
          noteHeight + 8
        );

        pdf.setFillColor(
          255,
          247,
          238
        );

        pdf.setDrawColor(
          255,
          190,
          125
        );

        pdf.roundedRect(
          margin,
          y,
          contentWidth,
          noteHeight,
          4,
          4,
          "FD"
        );

        pdf.setFillColor(
          orange.r,
          orange.g,
          orange.b
        );

        pdf.circle(
          margin + 10,
          y + 11,
          4,
          "F"
        );

        pdf.setTextColor(
          255,
          255,
          255
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(9);

        pdf.text(
          "!",
          margin + 10,
          y + 14,
          {
            align: "center",
          }
        );

        pdf.setTextColor(
          dark.r,
          dark.g,
          dark.b
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(10);

        pdf.text(
          noteLines,
          margin + 18,
          y + 12
        );

        y += noteHeight + 10;
      }

            // CRM TIMELINE

      if (timeline.length > 0) {
        drawSectionTitle(
          "CRM Timeline"
        );

        timeline.forEach(
          (item: TimelineEntry, index: number) => {
            const timelineTitle =
              safeText(
                item.title,
                "Timeline Update"
              );

            const timelineType =
              safeText(
                item.type,
                "Note"
              );

            const timelineDescription =
              item.description
                ? String(
                    item.description
                  )
                : "";

            const descriptionLines =
              timelineDescription
                ? pdf.splitTextToSize(
                    timelineDescription,
                    contentWidth - 25
                  )
                : [];

            const itemHeight =
              Math.max(
                31,
                23 +
                  descriptionLines.length *
                    5
              );

            ensureSpace(
              itemHeight + 7
            );

            // Timeline line

            pdf.setDrawColor(
              225,
              225,
              225
            );

            if (
              index <
              timeline.length - 1
            ) {
              pdf.line(
                margin + 6,
                y + 8,
                margin + 6,
                y + itemHeight + 5
              );
            }

            // Timeline dot

            pdf.setFillColor(
              orange.r,
              orange.g,
              orange.b
            );

            pdf.circle(
              margin + 6,
              y + 8,
              3.5,
              "F"
            );

            // Timeline card

            pdf.setFillColor(
              250,
              250,
              250
            );

            pdf.setDrawColor(
              230,
              230,
              230
            );

            pdf.roundedRect(
              margin + 14,
              y,
              contentWidth - 14,
              itemHeight,
              3,
              3,
              "FD"
            );

            // Type badge

            pdf.setFillColor(
              dark.r,
              dark.g,
              dark.b
            );

            pdf.roundedRect(
              margin + 20,
              y + 5,
              28,
              7,
              3,
              3,
              "F"
            );

            pdf.setTextColor(
              255,
              255,
              255
            );

            pdf.setFont(
              "helvetica",
              "bold"
            );

            pdf.setFontSize(7);

            pdf.text(
              timelineType
                .toUpperCase()
                .slice(0, 14),
              margin + 34,
              y + 9.8,
              {
                align: "center",
              }
            );

            // Title

            pdf.setTextColor(
              dark.r,
              dark.g,
              dark.b
            );

            pdf.setFontSize(11);

            pdf.text(
              timelineTitle,
              margin + 53,
              y + 10
            );

            // Description

            if (
              descriptionLines.length >
              0
            ) {
              pdf.setFont(
                "helvetica",
                "normal"
              );

              pdf.setFontSize(9);

              pdf.setTextColor(
                gray.r,
                gray.g,
                gray.b
              );

              pdf.text(
                descriptionLines,
                margin + 20,
                y + 19
              );
            }

            // Date

            if (
              item.created_at
            ) {
              const timelineDate =
                new Date(
                  item.created_at
                ).toLocaleString();

              pdf.setFont(
                "helvetica",
                "normal"
              );

              pdf.setFontSize(7.5);

              pdf.setTextColor(
                145,
                145,
                145
              );

              pdf.text(
                timelineDate,
                pageWidth -
                  margin -
                  5,
                y + itemHeight - 5,
                {
                  align: "right",
                }
              );
            }

            pdf.setTextColor(
              dark.r,
              dark.g,
              dark.b
            );

            y += itemHeight + 7;
          }
        );
      }

      // Final premium information box

      ensureSpace(30);

      pdf.setFillColor(
        dark.r,
        dark.g,
        dark.b
      );

      pdf.roundedRect(
        margin,
        y,
        contentWidth,
        25,
        4,
        4,
        "F"
      );

      pdf.setFillColor(
        orange.r,
        orange.g,
        orange.b
      );

      pdf.roundedRect(
        margin,
        y,
        5,
        25,
        2,
        2,
        "F"
      );

      pdf.setTextColor(
        255,
        255,
        255
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(11);

      pdf.text(
        "Built for a better digital presence.",
        margin + 11,
        y + 10
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(8.5);

      pdf.setTextColor(
        205,
        205,
        205
      );

      pdf.text(
        "Leafyweb • Build. Grow. Inspire.",
        margin + 11,
        y + 17
      );

      y += 32;

      // Add footer to all PDF pages

      const totalPages =
        pdf.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pdf.setPage(page);

        drawFooter(
          page,
          totalPages
        );
      }

      // Safe file name

      const safeName =
        safeText(
          customerName,
          `customer-${id}`
        )
          .replace(
            /[^a-z0-9]/gi,
            "-"
          )
          .replace(
            /-+/g,
            "-"
          )
          .replace(
            /^-|-$/g,
            ""
          )
          .toLowerCase();

      pdf.save(
        `leafyweb-premium-${safeName}.pdf`
      );

    } catch (error) {
      console.error(
        "Premium PDF error:",
        error
      );

      alert(
        "PDF could not be created. Please try again."
      );

    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-red-500 text-2xl">
        Customer not found.
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8">

      {workflowError ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
          {workflowError}
        </div>
      ) : null}

      {workflowMessage ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          {workflowMessage}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-4">

        <button
          onClick={openInvoice}
          disabled={invoiceProcessing}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold"
        >
          {invoiceProcessing
            ? "Opening Invoice..."
            : "🧾 Generate Invoice"}
        </button>

        <button
          onClick={
            downloadCustomerPDF
          }
          disabled={
            downloading
          }
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold"
        >
          {downloading
            ? "Creating Premium PDF..."
            : "✨ Download Premium PDF"}
        </button>

      </div>

      <CustomerCard
        order={order}
      />

      <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              Website Delivery
            </h2>
            <p className="text-gray-400 mt-2">
              Manage the order website workflow and preview draft websites.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {order.generated_website_id && (
              <span className="rounded-full border border-green-500 bg-green-500/10 px-4 py-2 text-sm text-green-100">
                Website linked
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {order.generated_website_id ? (
            <div className="space-y-4">
              {websiteLoading ? (
                <div className="rounded-2xl border border-gray-700 bg-[#111] p-6">
                  Loading linked website...
                </div>
              ) : linkedWebsite ? (
                <div className="rounded-2xl border border-gray-700 bg-[#111] p-6">
                  <p className="text-gray-400">
                    Website ID: {linkedWebsite.id}
                  </p>
                  <p className="text-gray-400">
                    Status: {linkedWebsite.status}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/admin/generated-websites/${linkedWebsite.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold"
                    >
                      Edit Website
                    </Link>
                    <Link
                      href={`/website/${linkedWebsite.slug}${
                        linkedWebsite.status !== "Published"
                          ? "?preview=true"
                          : ""
                      }`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-semibold"
                    >
                      Preview Website
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-yellow-500 bg-[#111] p-6">
                  <p className="text-yellow-200">
                    This order has a linked website ID, but the website record could not be found.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-700 bg-[#111] p-6">
              <p className="text-gray-300">
                No website is linked to this order yet. Create a draft website from the order details.
              </p>
              <button
                onClick={createDraftWebsite}
                disabled={creatingWebsite}
                className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold"
              >
                {creatingWebsite
                  ? "Creating Draft Website..."
                  : "Create Draft Website"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">

        <h2 className="text-3xl font-bold mb-6">
          Customer Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-400">
              Contact Person
            </p>

            <p className="text-xl">
              {order.contact_person ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Business Name
            </p>

            <p className="text-xl">
              {order.business_name ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              WhatsApp
            </p>

            <p className="text-xl">
              {order.whatsapp ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Email
            </p>

            <p className="text-xl break-all">
              {order.email ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Business Type
            </p>

            <p className="text-xl">
              {order.business_type ||
                "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-gray-400">
              Selected Template
            </p>

            <p className="text-xl">
              {order.template ||
                "Not selected"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-400">
              Address
            </p>

            <p className="text-xl">
              {order.address ||
                order.business_address ||
                "No address"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-400">
              Website Description
            </p>

            <p className="text-xl">
              {order.website_description ||
                "No description"}
            </p>
          </div>

        </div>

      </div>

      <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-6">
          Uploaded Files
        </h2>

        <div className="grid gap-6">
          {order.logo_url ? (
            <div>
              <p className="text-gray-400 mb-3">Uploaded Logo</p>
              <div className="relative h-72 w-full max-w-sm overflow-hidden rounded-3xl border border-gray-700">
                <Image
                  src={order.logo_url}
                  alt="Uploaded logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          {Array.isArray(order.image_urls) && order.image_urls.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {order.image_urls.map((imageUrl, index) => (
                <div
                  key={`image-${index}`}
                  className="relative h-72 w-full overflow-hidden rounded-3xl border border-gray-700"
                >
                  <Image
                    src={imageUrl}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No uploaded images available.</p>
          )}
        </div>
      </div>

      <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">

        <h2 className="text-3xl font-bold mb-6">
          Admin Notes
        </h2>

        <textarea
          value={notes}
          onChange={(e) =>
            setNotes(
              e.target.value
            )
          }
          rows={8}
          className="w-full bg-[#111] border border-gray-700 rounded-xl p-4 outline-none"
          placeholder="Write customer notes here..."
        />

        <button
          onClick={saveNotes}
          className="mt-5 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold"
        >
          Save Notes
        </button>

      </div>

      <div className="bg-[#1d1d1d] rounded-3xl p-8 text-white">

        <h2 className="text-3xl font-bold mb-6">
          CRM Timeline
        </h2>

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          className="w-full bg-[#111] border border-gray-700 rounded-xl p-3 mb-4"
        >
          <option value="Note">
            📝 Note
          </option>

          <option value="Call">
            📞 Call
          </option>

          <option value="WhatsApp">
            💬 WhatsApp
          </option>

          <option value="Email">
            📧 Email
          </option>

          <option value="Payment">
            💰 Payment
          </option>

          <option value="Website">
            🌐 Website
          </option>
        </select>

        <input
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
          placeholder="Timeline Title"
          className="w-full bg-[#111] border border-gray-700 rounded-xl p-3 mb-4"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          rows={4}
          placeholder="Description..."
          className="w-full bg-[#111] border border-gray-700 rounded-xl p-3 mb-4"
        />

        <button
          onClick={addTimeline}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
        >
          Add Timeline
        </button>

        <div className="mt-8 space-y-5">

          {timeline.length === 0 && (

            <p className="text-gray-400">
              No timeline entries yet.
            </p>

          )}

          {timeline.map(
            (item) => (

              <div
                key={item.id}
                className="border-l-4 border-orange-500 pl-5 py-4 bg-[#111] rounded-r-xl"
              >

                <div className="flex items-center gap-3 mb-3">

                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                    {item.type ||
                      "Note"}
                  </span>

                  <h3 className="font-bold text-xl">
                    {item.title}
                  </h3>

                </div>

                {item.description && (

                  <p className="text-gray-300">
                    {item.description}
                  </p>

                )}

                <p className="text-sm text-gray-500 mt-3">

                  {item.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString()
                    : ""}

                </p>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
} 