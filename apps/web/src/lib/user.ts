import { auth } from "@repo/auth";
import { redirect } from "next/navigation";

export const currentUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session?.user;
};
