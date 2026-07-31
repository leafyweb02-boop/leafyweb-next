"use client";

import {
  Zap,
  Palette,
  Bot,
  Cloud,
  ShieldCheck,
  Rocket,
} from "lucide-react";

import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Fast Website Creation",
    description:
      "Launch stunning websites in minutes with our intelligent website builder.",
  },
  {
    icon: Palette,
    title: "Modern Templates",
    description:
      "Beautiful templates designed for restaurants, hotels and businesses.",
  },
  {
    icon: Bot,
    title: "AI Content",
    description:
      "Generate professional website content instantly using AI.",
  },
  {
    icon: Cloud,
    title: "Cloud Hosting",
    description:
      "Fast, reliable cloud hosting included with every website.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SSL, backups and enterprise-level protection included.",
  },
  {
    icon: Rocket,
    title: "One Click Launch",
    description:
      "Publish your website instantly with a single click.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#111111] text-white py-28 px-6"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

  <div
    className="
      absolute
      -top-56
      left-1/2
      -translate-x-1/2
      w-[700px]
      h-[700px]
      rounded-full
      bg-orange-500/10
      blur-[150px]
      animate-pulse
    "
  />

  <div
    className="
      absolute
      bottom-0
      right-0
      w-[450px]
      h-[450px]
      rounded-full
      bg-orange-500/5
      blur-[140px]
    "
  />

</div>
<div
  className="
    absolute
    inset-0
    bg-[radial-gradient(circle_at_top,rgba(255,122,0,0.08),transparent_60%)]
  "
></div>
      <div className="relative max-w-7xl mx-auto">

        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <span className="inline-block px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 uppercase tracking-[3px] text-sm font-semibold">
            Features
          </span>

          <h2 className="mt-8 text-5xl md:text-6xl font-bold leading-tight">
            Everything You Need
            <br />
            to Build Modern Websites
          </h2>

          <p className="mt-8 max-w-3xl mx-auto text-xl text-gray-400 leading-9">
  Leafyweb combines AI, premium templates,
  cloud hosting and automation into one powerful platform.
</p>

</motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

  {features.map((feature, index) => {
  const Icon = feature.icon;

  return (
    <div
      key={index}
      className="group rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-3 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(255,122,0,0.18)]"
    >
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8">
        <Icon
          size={34}
          className="text-orange-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        />
      </div>

      <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-400 transition-colors duration-300">
        {feature.title}
      </h3>

      <p className="text-gray-400 leading-8 transition-colors duration-300 group-hover:text-gray-300">
        {feature.description}
      </p>

      <div
  className="
    mt-8
    flex
    items-center
    gap-2
    text-orange-500
    font-semibold
    opacity-0
    translate-y-3
    transition-all
    duration-500
    group-hover:opacity-100
    group-hover:translate-y-0
  "
>
  Learn More

  <span className="transition-transform duration-300 group-hover:translate-x-2">
    →
  </span>
</div>
    </div>
  );
})}

        </div>
      </div>
    </section>
  );
}