export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "700px",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            marginBottom: "10px",
            color: "#ff7a00",
          }}
        >
          Leafyweb
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#cfcfcf",
            marginBottom: "30px",
          }}
        >
          Build. Grow. Inspire.
        </p>

        <h2
          style={{
            fontSize: "38px",
            marginBottom: "20px",
          }}
        >
          Build Websites Faster Than Ever
        </h2>

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            color: "#aaaaaa",
            marginBottom: "40px",
          }}
        >
          Leafyweb is a modern website builder and design studio that helps you
          create professional websites quickly with a smart modular system.
        </p>

        <button
          style={{
            background: "#ff7a00",
            color: "white",
            border: "none",
            padding: "16px 35px",
            borderRadius: "8px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}
