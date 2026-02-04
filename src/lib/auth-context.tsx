"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth } from "./firebase";
import { getFirestoreDb } from "./firebase";
import type { User } from "./dummy-data";

interface AuthContextValue {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function firebaseUserToProfile(fb: FirebaseUser): User {
  return {
    id: fb.uid,
    email: fb.email ?? "",
    name: fb.displayName ?? fb.email?.split("@")[0] ?? "User",
    phone: fb.phoneNumber ?? undefined,
    isVerified: fb.emailVerified,
    kycStatus: "pending",
    role: "user",
    createdAt: "",
    avatarUrl: fb.photoURL ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const auth = getFirebaseAuth();
    const fb = auth.currentUser;
    if (!fb) {
      setProfile(null);
      return;
    }
    const db = getFirestoreDb();
    const profileRef = doc(db, "users", fb.uid);
    const snap = await getDoc(profileRef);
    if (snap.exists()) {
      const data = snap.data();
      setProfile({
        id: fb.uid,
        email: data.email ?? fb.email ?? "",
        name: data.name ?? fb.displayName ?? fb.email?.split("@")[0] ?? "User",
        phone: data.phone ?? fb.phoneNumber ?? undefined,
        isVerified: data.isVerified ?? fb.emailVerified,
        kycStatus: data.kycStatus ?? "pending",
        role: data.role ?? "user",
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? "",
        avatarUrl: data.avatarUrl ?? fb.photoURL ?? undefined,
      });
    } else {
      setProfile(firebaseUserToProfile(fb));
    }
  };

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsub = onAuthStateChanged(auth, async (fb) => {
      setFirebaseUser(fb);
      if (!fb) {
        setProfile(null);
      } else {
        const db = getFirestoreDb();
        const profileRef = doc(db, "users", fb.uid);
        const snap = await getDoc(profileRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile({
            id: fb.uid,
            email: data.email ?? fb.email ?? "",
            name: data.name ?? fb.displayName ?? fb.email?.split("@")[0] ?? "User",
            phone: data.phone ?? fb.phoneNumber ?? undefined,
            isVerified: data.isVerified ?? fb.emailVerified,
            kycStatus: data.kycStatus ?? "pending",
            role: data.role ?? "user",
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? "",
            avatarUrl: data.avatarUrl ?? fb.photoURL ?? undefined,
          });
        } else {
          setProfile(firebaseUserToProfile(fb));
        }
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setProfile(null);
    setFirebaseUser(null);
  };

  const value: AuthContextValue = {
    user: profile,
    firebaseUser,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
