"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-slate-200 px-2 py-1 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-700"
    >
      Log out
    </button>
  );
}
