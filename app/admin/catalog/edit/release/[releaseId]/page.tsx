"use client";
import { useParams } from "next/navigation";
import ReleaseForm from "@/components/admin/ReleaseForm";

export default function EditReleasePage() {
  const params = useParams();
  const releaseId = params.releaseId as string;

  return (
    <ReleaseForm mode="edit" releaseKind="SINGLE" releaseId={releaseId} />
  );
}
