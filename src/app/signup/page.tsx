"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"CONSULTANT" | "INDIVIDUAL">("CONSULTANT");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, accountType }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error?.formErrors?.[0] ?? data.error ?? "Sign up failed.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      setError("Account created, but automatic sign-in failed. Please log in.");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-1 text-2xl font-semibold">Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">
        Set up a consultant/agency account to manage multiple clients, or an individual account for your own charity or CIC.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Account type</legend>
          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <input
              type="radio"
              name="accountType"
              checked={accountType === "CONSULTANT"}
              onChange={() => setAccountType("CONSULTANT")}
            />
            Consultant / agency — I manage compliance for multiple client organisations
          </label>
          <label className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm">
            <input
              type="radio"
              name="accountType"
              checked={accountType === "INDIVIDUAL"}
              onChange={() => setAccountType("INDIVIDUAL")}
            />
            Individual charity / CIC — I manage my own organisation
          </label>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            className="rounded-md border border-gray-300 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            required
            className="rounded-md border border-gray-300 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            required
            minLength={8}
            className="rounded-md border border-gray-300 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-gray-900 underline">
          Log in
        </a>
      </p>
    </div>
  );
}
