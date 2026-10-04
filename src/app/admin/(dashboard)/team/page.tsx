import type { Metadata } from "next";
import { ErrorState, errorMessage } from "@/components/admin/States";
import { TeamView } from "@/components/admin/team/TeamView";
import { currentSession } from "@/lib/session";
import { envAdminEmail, listTeamMembers } from "@/lib/team-data";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const session = await currentSession();

  let members: Awaited<ReturnType<typeof listTeamMembers>> | null = null;
  let failure: string | null = null;
  try {
    members = await listTeamMembers();
  } catch (error) {
    failure = errorMessage(error);
  }

  if (!members) return <ErrorState title="Couldn't load the team" message={failure ?? "Unknown error."} />;
  return (
    <TeamView
      members={members}
      currentId={session?.id}
      currentEmail={session?.email ?? ""}
      builtInEmail={envAdminEmail()}
    />
  );
}
