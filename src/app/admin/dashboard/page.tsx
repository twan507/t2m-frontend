'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session || session.user.role !== "T2M ADMIN") {
      router.push("/admin");
    }
  }, [session, router]);

  return (
    <>
      <div> T2M AdminDashboard </div>
      <div> T2M AdminDashboard </div>
      <div> T2M AdminDashboard </div>
      <div> T2M AdminDashboard </div>
      <div> T2M AdminDashboard </div>
      <div> T2M AdminDashboard </div>
    </>

  )
}

