import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";
import { getFirebaseApp } from "./firebase";

let analytics: Analytics | null | undefined;

/**
 * Initialize Firebase Analytics in a browser environment.
 * Call this only from client-side code (e.g. inside useEffect).
 */
export async function initAnalytics(): Promise<Analytics | null> {
  if (analytics !== undefined) {
    return analytics;
  }

  if (typeof window === "undefined") {
    analytics = null;
    return analytics;
  }

  const supported = await isSupported().catch(() => false);
  if (!supported) {
    analytics = null;
    return analytics;
  }

  analytics = getAnalytics(getFirebaseApp());
  return analytics;
}

