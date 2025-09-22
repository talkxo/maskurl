"use client";

import { useCallback, useMemo, useState } from "react";

export default function HomePage() {
  const [inputUrl, setInputUrl] = useState("");
  const [maskedUrl, setMaskedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMaskedUrl(null);
    const url = inputUrl.trim();
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    try {
      // naive validation
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      setError("Invalid URL");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/mask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      if (!res.ok) throw new Error("Failed to create mask");
      const data = (await res.json()) as { token: string };
      setMaskedUrl(`${origin}/m/${data.token}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [inputUrl, origin]);

  const copy = useCallback(async () => {
    if (!maskedUrl) return;
    try {
      await navigator.clipboard.writeText(maskedUrl);
    } catch {}
  }, [maskedUrl]);

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", padding: 24, background: "#0b0f19", color: "#e6edf3" }}>
      <div style={{ width: "100%", maxWidth: 680 }}>
        <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.2 }}>Wavelinks</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Conceal a destination by sharing a masked link. No login. No database.</p>

        <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter URL e.g. https://example.com/article"
            style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid #263043", background: "#0f1525", color: "#e6edf3", outline: "none" }}
          />
          <button type="submit" disabled={loading} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #263043", background: "#1f6feb", color: "white", cursor: "pointer" }}>
            {loading ? "Generating..." : "Create"}
          </button>
        </form>
        {error && <p style={{ color: "#ff6b6b", marginTop: 8 }}>{error}</p>}

        {maskedUrl && (
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <input readOnly value={maskedUrl} style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: "1px solid #263043", background: "#0f1525", color: "#e6edf3" }} />
            <button onClick={copy} style={{ padding: "12px 16px", borderRadius: 10, border: "1px solid #263043", background: "#263043", color: "#e6edf3", cursor: "pointer" }}>Copy</button>
          </div>
        )}

        <p style={{ opacity: 0.65, marginTop: 16, fontSize: 12 }}>
          Note: Some sites cannot be embedded due to X-Frame-Options/CSP. The masked link does not reveal the destination in the address bar here.
        </p>
      </div>
    </main>
  );
}


