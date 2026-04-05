import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import HallDetailsClient from "./HallDetailsClient";

export const revalidate = 0; // Ensure fresh data on each request

export default async function HallPage({ params }) {
  // In Next.js App Router, params is a Promise that needs to be awaited
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const { data: hall, error } = await supabase
    .from("halls")
    .select("*")
    .eq("id", id)
    .single();

  // Handle case where fetch error occurs or hall doesn't exist
  if (error || !hall) {
    console.error("Hall fetch error or not found:", error?.message);
    // Since we don't have a specific not found page yet, we will just pass a fallback or call notFound()
    // For graceful development testing even if the ID is wrong, we pass null and let the client handle placeholders.
  }

  return <HallDetailsClient hall={hall || null} />;
}
