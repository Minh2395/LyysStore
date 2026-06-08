import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role;

  if (!session) {
    redirect("/login");
  }

  if (role === "ADMIN") {
    redirect("/dashboard");
  }

  if (role === "USER") {
    redirect("/home");
  }

  return null;
}
