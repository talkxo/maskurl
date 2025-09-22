import crypto from "node:crypto";

const SECRET = process.env.MASK_SECRET || "development-secret-change-me";

function getKeyIv() {
  const key = crypto.createHash("sha256").update(SECRET).digest();
  const iv = crypto.createHash("md5").update(SECRET).digest();
  return { key, iv };
}

export function encryptUrlToToken(url: string): string {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  const { key, iv } = getKeyIv();
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const json = JSON.stringify({ u: normalized });
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  const token = encrypted.toString("base64url");
  return token;
}

export function decryptTokenToUrl(token: string): string | null {
  try {
    const { key, iv } = getKeyIv();
    const buf = Buffer.from(token, "base64url");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = Buffer.concat([decipher.update(buf), decipher.final()]).toString("utf8");
    const parsed = JSON.parse(decrypted) as { u: string };
    // Validate URL
    const u = new URL(parsed.u);
    return u.toString();
  } catch {
    return null;
  }
}


