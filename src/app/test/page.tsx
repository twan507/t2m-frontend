'use client'
import { useEffect, useState } from "react";
import AuthSignInModal from "@/components/auth/signin.modal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setAuthState, resetAuthState } from "@/redux/authSlice";

export default function Home() {

  const [isSignInModalOpen, setSignInModalOpen] = useState(false)

  const [checkAuth, setCheckAuth] = useState(true);

  const authInfo = useAppSelector((state) => state.auth)
  const authState = !!authInfo.access_token
  const dispatch = useAppDispatch();

  const userData = {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjU5MDJjZmRlOGVkOGE2OGVmNGY4Y2M0IiwibmFtZSI6IlQyTSBVU0VSIDIiLCJlbWFpbCI6InVzZXIyQHQybS52biIsInJvbGUiOiJUMk0gVVNFUiIsImFmZmlsaWF0ZUNvZGUiOiIiLCJzcG9uc29yQ29kZSI6IkNUVjAwMCIsImlhdCI6MTcxMDgyNzAyOCwiZXhwIjoxNzEwOTEzNDI4fQ.PKv6iJfsqo-xcFVhs92ySg_R7bVvU0Y6Zp6QgIXA2CM",
    "user": {
      "_id": "65902cfde8ed8a68ef4f8cc4",
      "name": "T2M USER 2",
      "email": "user2@t2m.vn",
      "phoneNumber": "0123456789",
      "role": "T2M USER",
      "affiliateCode": "",
      "sponsorCode": "CTV000",
      "licenseInfo": {
        "daysLeft": 90,
        "product": "ADVANCED",
        "accessLevel": 2
      },
      "permissions": []
    }
  }

  useEffect(() => {
    setCheckAuth(false)
  }, []);

  const handleLogin = () => {
    dispatch(setAuthState(userData));
    console.log(authInfo)
    console.log(authState)
  };

  const handleLogout = () => {
    dispatch(resetAuthState());
    console.log(authInfo)
    console.log(authState)
  };

  if (!checkAuth) {
    return (
      <main className="w-full h-screen grid md:grid-cols-2 place-items-center">

        <AuthSignInModal
          isSignInModalOpen={isSignInModalOpen}
          setSignInModalOpen={setSignInModalOpen}
        />

        <button onClick={() => setSignInModalOpen(true)}>Open</button>
        <button onClick={() => handleLogin()}>Login</button>
        <button onClick={() => handleLogout()}>Logout</button>

        <h1>{authInfo?.user?.name}</h1>

      </main>
    );
  }
}
