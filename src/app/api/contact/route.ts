import { contactSchema } from "@/lib/contact-schema";

/**
 * Receives quote requests from the contact form.
 * Currently validates and logs. Nothing is sent anywhere yet.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: "Some fields are invalid.",
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
      { status: 422 },
    );
  }

  // Honeypot filled in → almost certainly a bot. Pretend it worked so it stops retrying.
  if (parsed.data.website) {
    return Response.json({ ok: true });
  }

  const { website, ...lead } = parsed.data;
  void website;

  // TODO(form-backend): send `lead` to the inbox or CRM.
  //   - Email: Resend / Postmark / SMTP, to the address in content/site.ts
  //   - CRM: HubSpot / Pipedrive / Zoho, mapping `interest` to the department
  //   Add rate limiting (per IP) before going live.
  console.info("[contact] new quote request", { ...lead, receivedAt: new Date().toISOString() });

  return Response.json({ ok: true });
}
