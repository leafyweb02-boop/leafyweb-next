"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_AUTH_COOKIE = "leafyweb-admin-auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/admin/dashboard");
        return;
      }

      setCheckingAuth(false);
    }

    void checkSession();
  }, [router]);

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=3600; SameSite=Lax`;
    router.push("/admin/dashboard");
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6 text-white">
        <div className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-10 text-center">
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
      <div className="bg-[#1d1d1d] p-10 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-[#2a2a2a] text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded-lg bg-[#2a2a2a] text-white"
        />

        <button
          onClick={login}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold"
        >
          Login
        </button>
      </div>
    </div>
  );
}
