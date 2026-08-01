"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Star, Heart, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-white/10 bg-[#0d0d0d] text-white"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[170px]" />
        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-orange-500/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-orange-500 sm:text-4xl">Leafyweb</h2>

            <p className="mt-6 text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
              Build. Grow. Inspire.
              <br />
              Create beautiful websites in minutes with our intelligent platform.
            </p>

            <div className="mt-8 flex gap-4">
              <Link href="/" className="rounded-full border border-white/10 p-3 transition hover:border-orange-500 hover:text-orange-400">
                <Globe size={18} />
              </Link>
              <Link href="/#templates" className="rounded-full border border-white/10 p-3 transition hover:border-orange-500 hover:text-orange-400">
                <Star size={18} />
              </Link>
              <Link href="/#features" className="rounded-full border border-white/10 p-3 transition hover:border-orange-500 hover:text-orange-400">
                <Heart size={18} />
              </Link>
              <Link href="mailto:support@leafyweb.com" className="rounded-full border border-white/10 p-3 transition hover:border-orange-500 hover:text-orange-400">
                <Mail size={18} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Quick Links</h3>

            <ul className="space-y-4 text-gray-400">
              <li>
                <Link href="/" className="transition hover:text-orange-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#features" className="transition hover:text-orange-400">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#templates" className="transition hover:text-orange-400">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition hover:text-orange-400">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Services</h3>

            <ul className="space-y-4 text-gray-400">
              <li>Website Builder</li>
              <li>AI Content</li>
              <li>Cloud Hosting</li>
              <li>Premium Templates</li>
              <li>SEO Optimization</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Contact</h3>

            <ul className="space-y-4 text-gray-400">
              <li>support@leafyweb.com</li>
              <li>www.leafyweb.com</li>
              <li>Kerala, India</li>
              <li>Available 24/7</li>
            </ul>
          </div>
        </motion.div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-sm text-gray-500">© 2026 Leafyweb. All rights reserved.</p>

          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/" className="transition hover:text-orange-400">
              Privacy Policy
            </Link>
            <Link href="/" className="transition hover:text-orange-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}