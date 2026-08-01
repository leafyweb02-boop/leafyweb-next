"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose a Template",
    description:
      "Browse polished, industry-ready templates tailored to your business needs.",
  },
  {
    number: "02",
    title: "Submit Your Details",
    description:
      "Share your brand details and content preferences to personalize the site quickly.",
  },
  {
    number: "03",
    title: "We Build Your Website",
    description:
      "Our platform assembles your content, design, and features into a launch-ready website.",
  },
  {
    number: "04",
    title: "Review & Launch",
    description:
      "Review the result, fine-tune what matters, and publish with confidence.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
    },
  },
};

export default function HowLeafywebWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-[#111111] px-4 py-16 text-white sm:px-6 md:py-28"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[170px]" />
        <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center md:mb-20"
        >
          <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm uppercase tracking-[3px] text-orange-400">
            How It Works
          </span>

          <h2 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            How Leafyweb Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-sm text-gray-400 sm:text-base md:text-lg">
            Turn your idea into a polished website in a few guided, premium steps.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4 md:gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(255,122,0,0.18)] sm:p-5 md:p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/15 text-sm font-bold text-orange-400 ring-1 ring-orange-500/30 sm:h-14 sm:w-14">
                {step.number}
              </div>

              <h3 className="text-base font-bold text-white sm:text-lg">
                {step.title}
              </h3>

              <p className="mt-3 text-xs leading-6 text-gray-400 sm:text-sm sm:leading-7">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
