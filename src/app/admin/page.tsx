import { redirect } from "next/navigation";

/** The dashboard opens on the requests inbox. */
export default function AdminIndexPage() {
  redirect("/admin/requests");
}
