"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

type TemplateType = "restaurant" | "hotel" | "business";

interface TemplateCardProps {
  title: string;
  description: string;
  type: TemplateType;
}

export default function Templates() {
  return (
    <section
      id="templates"
      className="relative overflow-hidden bg-[#111111] text-white py-28 px-6"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-56 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/10 blur-[160px] animate-pulse" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 uppercase tracking-[3px] text-sm font-semibold">
            Templates
          </span>

         <div className="text-center mb-20">

  <span
    className="
      inline-block
      px-5
      py-2
      rounded-full
      border
      border-orange-500/30
      bg-orange-500/10
      text-orange-400
      uppercase
      tracking-[3px]
      text-sm
      font-semibold
    "
  >
    Templates
  </span>

  <h2 className="mt-8 text-5xl md:text-6xl font-bold leading-tight">
    Choose Your
    <br />
    Perfect Website
  </h2>

  <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400 leading-9">
    Launch beautiful websites for restaurants, hotels, businesses,
    ecommerce stores and more using professionally crafted templates.
  </p>

</div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          <TemplateCard
            title="🍽️ Restaurant"
            description="Perfect for restaurants, cafés and food businesses."
            type="restaurant"
          />

          <TemplateCard
            title="🏨 Hotel"
            description="Elegant booking and hospitality websites."
            type="hotel"
          />

          <TemplateCard
            title="🏢 Business"
            description="Professional websites for companies and startups."
            type="business"
          />
        </motion.div>
      </div>
    </section>
  );
}

function TemplateCard({
  title,
  description,
  type,
}: TemplateCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="
        group
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-8
        transition-all
        duration-500
        hover:-translate-y-3
        hover:scale-[1.02]
        hover:border-orange-500/40
        hover:shadow-[0_0_40px_rgba(255,122,0,0.18)]
      "
    >
      {/* Browser Preview */}
      <div className="relative h-48 rounded-2xl bg-[#2b2b2b] overflow-hidden mb-8">

        {/* Orange Glow */}
        <div
          className="
            absolute
            inset-0
            bg-orange-500/5
            opacity-0
            transition-opacity
            duration-700
            group-hover:opacity-100
            pointer-events-none
          "
        />

        {/* Browser Bar */}
        <div className="h-9 bg-[#1d1d1d] flex items-center px-4 gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Preview */}
        <div className="p-5">

                    {/* Restaurant */}
        {type === "restaurant" && (
          <>
            <div className="h-16 rounded-xl bg-orange-500/20 flex items-center px-4 mb-4">
              <div className="h-3 w-28 rounded-full bg-orange-500"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="h-10 rounded-lg bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-10 rounded-lg bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-10 rounded-lg bg-[#1d1d1d] border border-white/10"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 rounded-xl bg-white/10"></div>
              <div className="h-14 rounded-xl bg-orange-500/20"></div>
            </div>

            <div className="h-8 rounded-lg bg-orange-500 mt-4"></div>
          </>
        )}

        {/* Hotel */}
        {type === "hotel" && (
          <>
            <div className="h-12 rounded-xl bg-blue-500/20 flex items-center px-4 mb-4">
              <div className="h-3 w-24 rounded-full bg-blue-500"></div>
            </div>

            <div className="space-y-3">
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
            </div>

            <div className="h-8 rounded-lg bg-blue-500 mt-4"></div>
          </>
        )}

        {/* Business */}
        {type === "business" && (
          <>
            <div className="h-10 rounded-xl bg-purple-500/20 flex items-center px-4 mb-4">
              <div className="h-3 w-20 rounded-full bg-purple-500"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
              <div className="h-16 rounded-xl bg-[#1d1d1d] border border-white/10"></div>
            </div>

            <div className="h-10 rounded-lg bg-purple-500"></div>
          </>
        )}

                </div>
      </div>

      <h3 className="text-2xl font-bold text-orange-500 mb-4 group-hover:text-orange-400 transition-colors">
        {title}
      </h3>

      <p className="text-gray-400 leading-8 group-hover:text-gray-300 transition-colors">
        {description}
      </p>
<div className="flex items-center gap-1 mt-4 text-orange-400">
  ★★★★★
  <span className="text-gray-500 text-sm ml-2">
    4.9 (128)
  </span>
</div>
      <div className="flex gap-3 mt-8">
  <Link
  href="/order"
  className="
    flex-1
    rounded-xl
    bg-orange-500
    py-3
    text-center
    font-semibold
    transition-all
    duration-300
    hover:bg-orange-400
    hover:scale-105
  "
>
  Use Template
</Link>

  <button
    className="
      rounded-xl
      border
      border-white/10
      px-5
      transition-all
      duration-300
      hover:border-orange-500
      hover:text-orange-400
    "
  >
    Preview
  </button>
      </div>
    </motion.div>
  );
}  
       