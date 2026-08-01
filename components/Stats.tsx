 export default function Stats() {
  return (
   <section
     id="stats"
     className="relative bg-[#111111] px-4 py-16 sm:px-6 md:py-24"
   >
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-8">
        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "clamp(2rem, 7vw, 3rem)", margin: 0 }}>
            1000+
          </h2>
          <p style={{ color: "#aaaaaa" }}>Websites Built</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "clamp(2rem, 7vw, 3rem)", margin: 0 }}>
            500+
          </h2>
          <p style={{ color: "#aaaaaa" }}>Happy Clients</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "clamp(2rem, 7vw, 3rem)", margin: 0 }}>
            99.9%
          </h2>
          <p style={{ color: "#aaaaaa" }}>Uptime</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "clamp(2rem, 7vw, 3rem)", margin: 0 }}>
            24/7
          </h2>
          <p style={{ color: "#aaaaaa" }}>Support</p>
        </div>
      </div>
    </section>
  );
}