"use client";

/** The admin API's envelope: { data } or { error: { message, fields? } }. */
export type ApiFieldErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  fields?: ApiFieldErrors;

  constructor(message: string, status: number, fields?: ApiFieldErrors) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

type Envelope<T> = { data: T } | { error: { message: string; fields?: ApiFieldErrors } };

/** Calls an API route and unwraps the envelope; throws ApiError with the server's message. */
export async function api<T>(url: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const { json, ...rest } = init ?? {};
  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: { ...(json !== undefined && { "Content-Type": "application/json" }), ...rest.headers },
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 401) {
    // The session has expired. Reloading lets the proxy send the browser to the login
    // page, which returns here after signing in.
    window.location.reload();
    throw new ApiError("Your session has expired. Sign in again.", 401);
  }

  let body: Envelope<T> | undefined;
  try {
    body = (await response.json()) as Envelope<T>;
  } catch {
    body = undefined;
  }

  if (!response.ok || !body || "error" in body) {
    const error = body && "error" in body ? body.error : undefined;
    throw new ApiError(error?.message ?? `Request failed (${response.status}).`, response.status, error?.fields);
  }
  return body.data;
}
