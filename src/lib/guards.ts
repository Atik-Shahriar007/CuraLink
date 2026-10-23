import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { getCurrentAccount } from "./session";
import type { Account, Doctor, Patient, AmbulanceProvider } from "@prisma/client";

/**
 * Route guards for the operations APIs.
 *
 * The rest of the codebase inlines `getCurrentAccount()` plus a role comparison
 * in every handler. These helpers do not replace that pattern wholesale — the
 * existing routes keep working untouched — but the new operations surface has
 * enough endpoints that repeating the same four lines twenty times would be the
 * kind of duplication that eventually drifts.
 */

export type StaffAccount = Account & {
  doctor: Doctor | null;
  patient: Patient | null;
  ambulanceProvider: AmbulanceProvider | null;
};

export type GuardFailure = { error: NextResponse };

export function isStaff(account: { role: string }): boolean {
  return account.role === "ADMIN" || account.role === "SUPPORT_AGENT";
}

/**
 * Require an authenticated account. Returns either the account or a response to
 * return verbatim:
 *
 *   const guard = await requireAccount();
 *   if ("error" in guard) return guard.error;
 *   const { account } = guard;
 */
export async function requireAccount(): Promise<
  { account: StaffAccount } | GuardFailure
> {
  const account = await getCurrentAccount();
  if (!account) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { account };
}

/** Require one of the given roles. */
export async function requireAnyRole(
  roles: Array<"ADMIN" | "SUPPORT_AGENT" | "DOCTOR" | "PATIENT" | "AMBULANCE_PROVIDER">
): Promise<{ account: StaffAccount } | GuardFailure> {
  const result = await requireAccount();
  if ("error" in result) return result;
  if (!roles.includes(result.account.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}

/** Shorthand for the admin-only surfaces (health console, incidents). */
export async function requireAdmin(): Promise<{ account: StaffAccount } | GuardFailure> {
  return requireAnyRole(["ADMIN"]);
}

/**
 * Reports are triaged by both admins and support agents, matching how support
 * tickets already work: agents handle the daily flow, admins own escalations.
 */
export async function requireStaff(): Promise<{ account: StaffAccount } | GuardFailure> {
  return requireAnyRole(["ADMIN", "SUPPORT_AGENT"]);
}

/** Every account id that should be told about an operational alert. */
export async function adminAccountIds(): Promise<string[]> {
  const admins = await prisma.account.findMany({
    where: { role: "ADMIN", isActive: true },
    select: { id: true },
  });
  return admins.map((a) => a.id);
}

export function displayName(account: {
  firstName: string | null;
  lastName: string | null;
  email: string;
}): string {
  const name = [account.firstName, account.lastName].filter(Boolean).join(" ").trim();
  return name || account.email;
}
