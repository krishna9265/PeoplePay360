import { redirect } from "next/navigation";

export default function TimeOffRequestsPage() {
  redirect("/time-off?tab=requests");
}
