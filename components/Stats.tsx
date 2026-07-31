 export default function Stats() {
  return (
   <section
     id="stats"
     className="relative bg-[#111111] py-24 px-6"
   >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "48px", margin: 0 }}>
            1000+
          </h2>
          <p style={{ color: "#aaaaaa" }}>Websites Built</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "48px", margin: 0 }}>
            500+
          </h2>
          <p style={{ color: "#aaaaaa" }}>Happy Clients</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "48px", margin: 0 }}>
            99.9%
          </h2>
          <p style={{ color: "#aaaaaa" }}>Uptime</p>
        </div>

        <div>
          <h2 style={{ color: "#ff7a00", fontSize: "48px", margin: 0 }}>
            24/7
          </h2>
          <p style={{ color: "#aaaaaa" }}>Support</p>
        </div>
      </div>
    </section>
  );
}