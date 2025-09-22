import { decryptTokenToUrl } from "@/lib/crypto";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function MaskPage({ params }: { params: { token: string } }) {
  const url = decryptTokenToUrl(params.token);
  if (!url) {
    return (
      <main style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "#0b0f19", color: "#e6edf3" }}>
        <div>
          <h2>Invalid or expired link</h2>
        </div>
      </main>
    );
  }

  return (
    <main style={{ margin: 0, padding: 0, height: "100vh", width: "100vw", background: "#000" }}>
      <Suspense fallback={<div style={{ color: "white", padding: 16 }}>Loading…</div>}>
        <iframe src={url} style={{ border: 0, width: "100%", height: "100%" }} referrerPolicy="no-referrer" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox" />
      </Suspense>
    </main>
  );
}


