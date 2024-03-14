import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function HomePage() {
  redirect("/tong-quan-thi-truong")
}
