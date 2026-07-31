import Link from "next/link";
import LeafywebHeroAnimation from "@/components/LeafywebHeroAnimation";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#111111] text-white py-24 px-6"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,122,0,0.18) 0%, #111111 60%)",
      }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>

          <div
            className="glass inline-block mb-8"
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

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build.
            <br />
            Grow.
            <br />
            Inspire.
          </h1>

          <p className="mt-8 text-gray-400 text-lg md:text-xl leading-9 max-w-xl">
            Leafyweb empowers businesses to launch stunning,
            AI-powered websites in minutes — without complexity,
            without compromise.
          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link
              href="/order"
              className="bg-[#ff7a00] hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold shadow-[0_0_30px_rgba(255,122,0,.45)]"
            >
              Get Started
            </Link>

            <Link
              href="/order"
              className="border-2 border-[#ff7a00] hover:bg-[#ff7a00] transition px-8 py-4 rounded-xl font-semibold"
            >
              Order Website
            </Link>

          </div>

        </div>

        {/* Right Side */}
        <div
          className="glass flex items-center justify-center"
          style={{
            height: "500px",
            borderRadius: "30px",
          }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            <div className="mx-auto w-full max-w-[520px] max-h-[500px]">
              <LeafywebHeroAnimation />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}