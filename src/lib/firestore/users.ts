import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebase";
import type { User } from "../dummy-data";

const USERS_COLLECTION = "users";

export interface UserDoc {
  email: string;
  name: string;
  phone?: string;
  isVerified: boolean;
  kycStatus: "pending" | "submitted" | "approved" | "rejected";
  role: "user" | "admin";
  createdAt: string;
  avatarUrl?: string;
}

export async function createUserProfile(
  uid: string,
  data: {
    email: string;
    name: string;
    phone?: string;
    role?: "user" | "admin";
  }
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, USERS_COLLECTION, uid);
  await setDoc(ref, {
    email: data.email,
    name: data.name,
    phone: data.phone ?? null,
    isVerified: false,
    kycStatus: "pending",
    role: data.role ?? "user",
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const db = getFirestoreDb();
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    id: uid,
    email: d.email ?? "",
    name: d.name ?? "",
    phone: d.phone ?? undefined,
    isVerified: d.isVerified ?? false,
    kycStatus: d.kycStatus ?? "pending",
    role: d.role ?? "user",
    createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? "",
    avatarUrl: d.avatarUrl ?? undefined,
  };
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserDoc, "createdAt">>
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, USERS_COLLECTION, uid);
  await updateDoc(ref, updates as Record<string, unknown>);
}
