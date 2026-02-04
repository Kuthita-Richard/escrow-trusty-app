import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getFirestoreDb } from "../firebase";
import type { Dispute, DisputeMessage, Evidence } from "../dummy-data";
import { getTransaction } from "./transactions";
import { getUserProfile } from "./users";

const DISPUTES_COLLECTION = "disputes";

function parseTimestamp(ts: unknown): string {
  if (!ts) return "";
  if (typeof ts === "string") return ts;
  if (typeof ts === "object" && ts !== null && "toDate" in ts) {
    const d = (ts as { toDate: () => Date }).toDate?.();
    return d?.toISOString?.() ?? "";
  }
  return "";
}

export async function createDispute(data: {
  transactionId: string;
  openedBy: string;
  reason: string;
  statement?: string;
}): Promise<string> {
  const db = getFirestoreDb();
  const col = collection(db, DISPUTES_COLLECTION);
  const docRef = await addDoc(col, {
    transactionId: data.transactionId,
    openedBy: data.openedBy,
    status: "open",
    reason: data.reason,
    resolution: null,
    resolutionNote: null,
    evidence: data.statement
      ? [
          {
            id: "statement-1",
            type: "statement",
            content: data.statement,
            uploadedBy: data.openedBy,
            uploadedAt: new Date().toISOString(),
          },
        ]
      : [],
    messages: [],
    createdAt: serverTimestamp(),
    resolvedAt: null,
  });
  return docRef.id;
}

export async function getDispute(id: string): Promise<Dispute | null> {
  const db = getFirestoreDb();
  const ref = doc(db, DISPUTES_COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data();
  const transaction = await getTransaction(d.transactionId);
  if (!transaction) return null;
  const openedByUser = await getUserProfile(d.openedBy);
  if (!openedByUser) return null;

  const evidence: Evidence[] = (d.evidence ?? []).map((e: DocumentData) => ({
    id: e.id ?? "",
    type: e.type ?? "statement",
    content: e.content ?? "",
    fileName: e.fileName ?? undefined,
    uploadedBy: e.uploadedBy ?? "",
    uploadedAt: e.uploadedAt ?? "",
  }));
  const messages: DisputeMessage[] = await Promise.all(
    (d.messages ?? []).map(async (m: DocumentData) => {
      const sender = await getUserProfile(m.senderId);
      return {
        id: m.id ?? "",
        senderId: m.senderId ?? "",
        sender: sender ?? openedByUser,
        content: m.content ?? "",
        createdAt: m.createdAt ?? "",
      };
    }),
  );

  return {
    id: snap.id,
    transactionId: d.transactionId,
    transaction,
    openedBy: d.openedBy,
    openedByUser,
    status: d.status ?? "open",
    reason: d.reason ?? "",
    resolution: d.resolution ?? undefined,
    resolutionNote: d.resolutionNote ?? undefined,
    evidence,
    messages,
    createdAt: parseTimestamp(d.createdAt),
    resolvedAt: d.resolvedAt ? parseTimestamp(d.resolvedAt) : undefined,
  };
}

export async function getDisputesByUser(userId: string): Promise<Dispute[]> {
  const db = getFirestoreDb();
  const col = collection(db, DISPUTES_COLLECTION);

  const q = query(col, where("openedBy", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const opened = await Promise.all(snap.docs.map((d) => getDispute(d.id)));

  // Also include disputes where user is buyer or seller on the transaction.
  const q2 = query(col, orderBy("createdAt", "desc"));
  const snap2 = await getDocs(q2);
  const all = await Promise.all(snap2.docs.map((d) => getDispute(d.id)));
  const filtered = all
    .filter((x): x is Dispute => x !== null)
    .filter((d) => d.openedBy === userId || d.transaction.buyerId === userId || d.transaction.sellerId === userId);

  const merged = [...opened, ...filtered]
    .filter((x): x is Dispute => x !== null)
    .filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return merged;
}

export async function getAllDisputes(): Promise<Dispute[]> {
  const db = getFirestoreDb();
  const col = collection(db, DISPUTES_COLLECTION);
  const q = query(col, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  const list = await Promise.all(snap.docs.map((d) => getDispute(d.id)));
  return list.filter((x): x is Dispute => x !== null);
}

export async function updateDisputeStatus(
  id: string,
  updates: Partial<{
    status: Dispute["status"];
    resolution: Dispute["resolution"];
    resolutionNote: string;
    resolvedAt: string;
  }>,
): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, DISPUTES_COLLECTION, id);
  await updateDoc(ref, {
    ...updates,
    resolvedAt: updates.resolvedAt ? updates.resolvedAt : undefined,
  } as Record<string, unknown>);
}

export async function addDisputeMessage(data: {
  disputeId: string;
  senderId: string;
  content: string;
}): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, DISPUTES_COLLECTION, data.disputeId);
  const message: Omit<DisputeMessage, "sender"> = {
    id: `msg-${Date.now()}`,
    senderId: data.senderId,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  await updateDoc(ref, {
    messages: arrayUnion(message),
  });
}

export async function addDisputeEvidence(data: {
  disputeId: string;
  evidence: Evidence;
}): Promise<void> {
  const db = getFirestoreDb();
  const ref = doc(db, DISPUTES_COLLECTION, data.disputeId);
  await updateDoc(ref, {
    evidence: arrayUnion(data.evidence),
  });
}

