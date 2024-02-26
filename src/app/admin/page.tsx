import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminPage() {

  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/admin/dashboard")
  } else {
    redirect("/auth/signin")
  }
}




