/** A team member as the dashboard sees it — never the password hash. Client-safe. */
export type TeamMemberRecord = {
  id: string;
  name?: string;
  email: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};
