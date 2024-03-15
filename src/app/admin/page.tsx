'use client'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminPage() {

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      if (session.user.role === "T2M ADMIN") {
        router.push("/admin/dashboard")
      }
    }
  }, [session])

  return (
    <div></div>
  )
}
