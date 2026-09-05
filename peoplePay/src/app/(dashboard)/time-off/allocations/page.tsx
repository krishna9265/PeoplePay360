import { redirect } from "next/navigation";

export default function TimeOffAllocationsPage() {
  redirect("/time-off?tab=allocations");
}
