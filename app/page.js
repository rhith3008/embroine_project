
export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "40px 8%",
      }}
    >
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #292936",
          paddingBottom: "24px",
        }}
      >
        <h2 style={{ color: "#a78bfa", margin: 0 }}>
          EMBRIONE
        </h2>

        <a
          href="/team"
          style={{ color: "#ffffff", textDecoration: "none" }}
        >
          Meet the Team →
        </a>
      </nav>

      <section
        style={{
          maxWidth: "750px",
          margin: "120px auto",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#a78bfa", letterSpacing: "4px" }}>
          MEET THE TEAM
        </p>

        <h1
          style={{
            fontSize: "clamp(42px, 8vw, 76px)",
            lineHeight: 1.1,
            marginBottom: "24px",
          }}
        >
          The people behind
          <br />
          <span style={{ color: "#a78bfa" }}>
            Embrione.
          </span>
        </h1>

        <p
          style={{
            color: "#b5b5c5",
            fontSize: "18px",
            lineHeight: 1.8,
          }}
        >
          Get to know our team, explore different domains,
          and discover the people bringing ideas to life.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginTop: "36px",
          }}
        >
          <a
            href="/team"
            style={{
              background: "#8b5cf6",
              color: "#ffffff",
              padding: "15px 25px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Explore the Team
          </a>

          <a
            href="/register"
            style={{
              border: "1px solid #555568",
              color: "#ffffff",
              padding: "15px 25px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Join the Team
          </a>
        </div>
      </section>

      <footer
        style={{
          textAlign: "center",
          color: "#777789",
          borderTop: "1px solid #292936",
          paddingTop: "24px",
        }}
      >
        © 2026 Embrione · Meet the Team
      </footer>
    </main>
  );
}
