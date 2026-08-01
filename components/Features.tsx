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
  const handleTemplatesScroll = () => {
    document.getElementById("templates")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#111111] text-white px-4 py-16 sm:px-6 md:py-28"
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
      <div className="relative mx-auto max-w-7xl">

        <motion.div
          className="mb-12 text-center md:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >

          <span className="inline-block px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 uppercase tracking-[3px] text-sm font-semibold">
            Features
          </span>

          <h2 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
            Everything You Need
            <br />
            to Build Modern Websites
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-gray-400 sm:text-lg md:mt-8 md:text-xl md:leading-9">
  Leafyweb combines AI, premium templates,
  cloud hosting and automation into one powerful platform.
</p>

</motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">

  {features.map((feature, index) => {
  const Icon = feature.icon;

  return (
    <div
      key={index}
      className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(255,122,0,0.18)] sm:rounded-3xl sm:p-6 md:p-8"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 sm:mb-8 sm:h-16 sm:w-16">
        <Icon
          size={34}
          className="text-orange-500 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
        />
      </div>

      <h3 className="mb-2 text-base font-bold transition-colors duration-300 group-hover:text-orange-400 sm:mb-4 sm:text-xl md:text-2xl">
        {feature.title}
      </h3>

      <p className="text-xs leading-6 text-gray-400 transition-colors duration-300 group-hover:text-gray-300 sm:text-sm sm:leading-7 md:text-base md:leading-8">
        {feature.description}
      </p>

      {feature.title === "Modern Templates" ? (
        <button
          type="button"
          onClick={handleTemplatesScroll}
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-orange-500
            opacity-100
            translate-y-0
            transition-all
            duration-500
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-orange-400
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#111111]
            md:mt-8
            md:text-base
            md:opacity-0
            md:translate-y-3
            md:group-hover:opacity-100
            md:group-hover:translate-y-0
          "
        >
          Learn More

          <span className="transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </button>
      ) : (
        <div
          className="
            mt-6
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-orange-500
            opacity-100
            translate-y-0
            transition-all
            duration-500
            md:mt-8
            md:text-base
            md:opacity-0
            md:translate-y-3
            md:group-hover:opacity-100
            md:group-hover:translate-y-0
          "
        >
          Learn More

          <span className="transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </div>
      )}
    </div>
  );
})}

        </div>
      </div>
    </section>
  );
}