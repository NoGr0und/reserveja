import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const derivedKeyBuffer = Buffer.from(key, "hex");
  const newKey = scryptSync(password, salt, KEY_LENGTH);

  try {
    return timingSafeEqual(derivedKeyBuffer, newKey);
  } catch {
    return false;
  }
}
