"use client";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#0b0b0f",
          color: "#f4f4f5",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420, padding: 24 }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.7, marginBottom: 20 }}>
            An unexpected error occurred. You can try again.
          </p>
          <button
            type="button"
            onClick={() => unstable_retry()}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "1px solid #3f3f46",
              background: "#18181b",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
