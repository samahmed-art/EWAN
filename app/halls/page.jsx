import { supabase } from "@/lib/supabase";
import HallsClient from "./HallsClient";

export const revalidate = 0; // Ensure fresh data on each request

export default async function HallsPage() {
  const { data: halls, error } = await supabase.from('halls').select('*');

  if (error) {
    console.error("Error fetching halls from Supabase:", error.message);
  }

  // Ensure initialHalls is always an array
  const initialHalls = halls || [];

  return (
    <HallsClient initialHalls={initialHalls} />
  );
}
