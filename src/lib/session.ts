import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { verifyToken } from "./auth";

const COOKIE_NAME = "curalink_token";

export async function getCurrentAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const account = await prisma.account.findUnique({
    where: { id: payload.accountId },
    include: { doctor: true, patient: true },
  });

  return account;
}

export { COOKIE_NAME };