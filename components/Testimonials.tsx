"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ahmed Rahman",
    role: "Restaurant Owner",
    review:
      "Leafyweb transformed our restaurant into a modern online brand. The website was delivered quickly and our online orders increased immediately.",
  },
  {
    name: "Sarah Thomas",
    role: "Hotel Manager",
    review:
      "Beautiful design, smooth booking experience and excellent support. Our guests love the new website.",
  },
  {
    name: "David Joseph",
    role: "Business Consultant",
    review:
      "Professional, fast and reliable. Leafyweb helped us launch a premium business website without any hassle.",
  },
];

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

export default function Testimonials() {
  return (
    <section
      className="relative overflow-hidden bg-[#111111] py-28 px-6 text-white"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-orange-500/10 blur-[170px]" />

        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-orange-500/5 blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="inline-block rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 text-sm uppercase tracking-[3px] text-orange-400">
            Testimonials
          </span>

          <h2 className="mt-8 text-5xl font-bold">
            What Our Clients Say
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-gray-400">
            Trusted by restaurants, hotels and businesses around the world.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(255,122,0,0.18)]"
            >              <div className="mb-6 flex text-orange-400 text-xl">
                ★★★★★
              </div>

              <p className="leading-8 text-gray-300">
                “{item.review}”
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-lg font-bold">
                  {item.name.charAt(0)}
                </div>

                <div>
                  <h4 className="font-bold text-white">
                    {item.name}
                  </h4>

                  <p className="text-sm text-orange-400">
                    {item.role}
                  </p>
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}