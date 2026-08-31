import { createFileRoute } from "@tanstack/react-router";
import { AceClub } from "@/components/ace-club";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <AceClub />;
}
