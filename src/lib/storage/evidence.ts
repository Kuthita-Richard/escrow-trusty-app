import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "../firebase";

export async function uploadDisputeEvidenceFile(params: {
  disputeId: string;
  file: File;
}): Promise<{ url: string; fileName: string; path: string }> {
  const storage = getFirebaseStorage();
  const safeName = params.file.name.replace(/[^\w.\-]+/g, "_");
  const path = `disputes/${params.disputeId}/evidence/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, params.file);
  const url = await getDownloadURL(storageRef);
  return { url, fileName: params.file.name, path };
}

