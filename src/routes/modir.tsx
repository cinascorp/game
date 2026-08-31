import { createFileRoute } from "@tanstack/react-router";
import { AdminClub } from "@/components/admin-club";

export const Route = createFileRoute("/modir")({ component: AdminPage });

function AdminPage() {
  return <AdminClub />;
}
