import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const role = session?.user?.role;

  // Admin → dashboard
  if (role === "ADMIN") {
    redirect("/dashboard");
  }

  // User hoặc guest → shop home
  redirect("/home");
}
