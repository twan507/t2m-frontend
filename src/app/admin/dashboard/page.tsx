'use client'
import { useAppSelector } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo.access_token

  const router = useRouter()

  useEffect(() => {
    if (!authState || authInfo.user.role !== "T2M ADMIN") {
      router.push("/admin");
    }
  }, [authState, router]);

  const [checkAuth, setCheckAuth] = useState(true);

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  if (!checkAuth) {
    return (
      <>
        <div> T2M AdminDashboard </div>
        <div> T2M AdminDashboard </div>
        <div> T2M AdminDashboard </div>
        <div> T2M AdminDashboard </div>
        <div> T2M AdminDashboard </div>
        <div> T2M AdminDashboard </div>
        <div className="flex gap border border-1 border-black p-20">
          {/* You are now {authState ? "Logged In" : "Logged Out"} */}
        </div>
      </>

    )
  }
}

