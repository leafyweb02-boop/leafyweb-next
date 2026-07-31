"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const plans = [
  {
    name: "Launch",
    price: "$29",
    description: "Perfect for startups and personal brands.",
    features: [
      "1 Website",
      "Premium Template",
      "Free SSL",
      "Cloud Hosting",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "$79",
    description: "Ideal for growing businesses.",
    features: [
      "10 Websites",
      "AI Content Generator",
      "Premium Templates",
      "SEO Optimization",
      "Analytics Dashboard",
      "Priority Support",
    ],
    popular: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "Tailored solutions for enterprises.",
    features: [
      "Unlimited Websites",
      "Dedicated Infrastructure",
      "Custom Design",
      "Advanced Security",
      "API Integration",
      "24/7 Priority Support",
    ],
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#111111] py-28 px-6 text-white"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-56 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/10 blur-[170px] animate-pulse" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        <div className="text-center mb-20">

          <span className="px-5 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 uppercase tracking-[3px] text-sm font-semibold">
            Pricing
          </span>

          <h2 className="mt-8 text-5xl font-bold">
            Simple & Transparent Pricing
          </h2>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your business.
          </p>

          <div className="mt-10 flex justify-center">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1">

              <button className="rounded-full bg-orange-500 px-6 py-2 font-semibold">
                Monthly
              </button>

              <button className="px-6 py-2 text-gray-400 hover:text-white transition">
                Yearly
              </button>

            </div>
          </div>

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={`
                relative
                rounded-3xl
                border
                p-10
                transition-all
                duration-500
                hover:-translate-y-4
                hover:scale-[1.03]
                ${
                  plan.popular
                    ? "border-orange-500 bg-white/10 shadow-[0_0_45px_rgba(255,122,0,0.25)] hover:shadow-[0_0_70px_rgba(255,122,0,0.40)]"
                    : "border-white/10 bg-white/5 hover:border-orange-500/40 hover:shadow-[0_0_50px_rgba(255,122,0,0.18)]"
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-5 py-2 text-sm font-bold">
                  ⭐ MOST POPULAR
                </div>
              )}              <h3 className="mt-4 text-3xl font-bold">
                {plan.name}
              </h3>

              <p className="mt-3 text-gray-400">
                {plan.description}
              </p>

              <div className="mt-8">
                <span className="text-6xl font-bold">
                  {plan.price}
                </span>

                {plan.price !== "Custom" && (
                  <span className="text-gray-400 ml-2">
                    /month
                  </span>
                )}
              </div>

              <div className="mt-10 space-y-4">
                {plan.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check
                      size={20}
                      className="text-orange-500 flex-shrink-0"
                    />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/order"
                className={`
                  mt-10
                  inline-flex
                  items-center
                  justify-center
                  w-full
                  rounded-xl
                  py-4
                  font-semibold
                  transition-all
                  duration-300
                  hover:scale-105
                  ${
                    plan.popular
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "border border-white/20 hover:border-orange-500 hover:bg-white/5"
                  }
                `}
              >
                Get Started
              </Link>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}