import Link from "next/link";
import LeafywebHeroAnimation from "@/components/LeafywebHeroAnimation";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#111111] text-white py-16 px-4 sm:px-6 md:py-24"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,122,0,0.18) 0%, #111111 60%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div
            className="glass mb-6 inline-block"
            style={{
              padding: "8px 18px",
              color: "#ff7a00",
              fontWeight: "bold",
              fontSize: "13px",
              letterSpacing: "1px",
            }}
          >
            🚀 AI-Powered Platform
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-7xl">
            Build.
            <br />
            Grow.
            <br />
            Inspire.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg md:mt-8 md:text-xl md:leading-9">
            Leafyweb empowers businesses to launch stunning,
            AI-powered websites in minutes — without complexity,
            without compromise.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10">
            <Link
              href="/order"
              className="w-full rounded-xl bg-[#ff7a00] px-8 py-4 text-center font-semibold shadow-[0_0_30px_rgba(255,122,0,.45)] transition hover:bg-orange-600 sm:w-auto"
            >
              Get Started
            </Link>

            <Link
              href="/order"
              className="w-full rounded-xl border-2 border-[#ff7a00] px-8 py-4 text-center font-semibold transition hover:bg-[#ff7a00] sm:w-auto"
            >
              Order Website
            </Link>
          </div>
        </div>

        <div
          className="glass flex items-center justify-center"
          style={{
            height: "320px",
            borderRadius: "30px",
          }}
        >
          <div className="flex h-full w-full items-center justify-center p-4">
            <div className="mx-auto w-full max-w-[520px] max-h-[500px]">
              <LeafywebHeroAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}