import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebase";
import type { Transaction, Milestone } from "../dummy-data";
import { getUserProfile } from "./users";

const TRANSACTIONS_COLLECTION = "transactions";

export interface TransactionDoc {
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: Transaction["status"];
  buyerId: string;
  sellerId: string;
  milestones: Array<{
    id: string;
    title: string;
    amount: number;
    status: Milestone["status"];
    dueDate?: string;
  }>;
  createdAt: unknown;
  updatedAt: unknown;
  fundedAt?: string;
  releasedAt?: string;
}

function parseTimestamp(ts: unknown): string {
  if (!ts) return "";
  if (typeof ts === "string") return ts;
  if (typeof ts === "object" && ts !== null && "toDate" in ts) {
    const d = (ts as { toDate: () => Date }).toDate?.();
    return d?.toISOString?.() ?? "";
  }
  return "";
}

export async function createTransaction(data: {
  title: string;
  description: string;
  amount: number;
  currency: string;
  buyerId: string;
  sellerId: string;
  milestones: Array<{ title: string; amount: number; description?: string }>;
}): Promise<string> {
  const db = getFirestoreDb();
  const col = collection(db, TRANSACTIONS_COLLECTION);
  const milestones = data.milestones.map((m, i) => ({
    id: `m${i + 1}`,
    title: m.title,
    amount: m.amount,
    status: "pending" as const,
  }));
  const docRef = await addDoc(col, {
    title: data.title,
    description: data.description,
    amount: data.amount,
    currency: data.currency,
    status: "pending",
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    milestones,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getTransaction(id: string): Promise<Transaction | null> {
  const db = getFirestoreDb();
  const ref = doc(db, TRANSACTIONS_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  const buyer = await getUserProfile(d.buyerId);
  const seller = await getUserProfile(d.sellerId);
  if (!buyer || !seller) return null;
  const milestones: Milestone[] = (d.milestones ?? []).map((m: DocumentData) => ({
    id: m.id ?? "",
    title: m.title ?? "",
    amount: m.amount ?? 0,
    status: m.status ?? "pending",
    dueDate: m.dueDate,
  }));
  return {
    id: snap.id,
    title: d.title ?? "",
    description: d.description ?? "",
    amount: d.amount ?? 0,
    currency: d.currency ?? "USD",
    status: d.status ?? "pending",
    buyerId: d.buyerId,
    sellerId: d.sellerId,
    buyer,
    seller,
    milestones,
    createdAt: parseTimestamp(d.createdAt),
    updatedAt: parseTimestamp(d.updatedAt),
    fundedAt: d.fundedAt,
    releasedAt: d.releasedAt,
  };
}

export async function getTransactionsByUser(userId: string): Promise<Transaction[]> {
  const db = getFirestoreDb();
  const col = collection(db, TRANSACTIONS_COLLECTION);
  const q = query(
    col,
    where("buyerId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  const buyerTxns = await Promise.all(
    snapshot.docs.map((docSnap) => getTransaction(docSnap.id))
  );

  const q2 = query(
    col,
    where("sellerId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot2 = await getDocs(q2);
  const sellerTxns = await Promise.all(
    snapshot2.docs.map((docSnap) => getTransaction(docSnap.id))
  );

  const all = [...buyerTxns, ...sellerTxns]
    .filter((t): t is Transaction => t !== null)
    .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return all;
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const db = getFirestoreDb();
  const col = collection(db, TRANSACTIONS_COLLECTION);
  const q = query(col, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const list = await Promise.all(
    snapshot.docs.map((docSnap) => getTransaction(docSnap.id))
  );
  return list.filter((t): t is Transaction => t !== null);
}

export async function updateTransactionStatus(
  id: string,
  status: Transaction["status"]
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, TRANSACTIONS_COLLECTION, id);
  const updates: Record<string, unknown> = { status, updatedAt: serverTimestamp() };
  if (status === "funded") updates.fundedAt = new Date().toISOString();
  if (status === "released") updates.releasedAt = new Date().toISOString();
  await updateDoc(ref, updates);
}
