"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInUser } from "@/services/authService";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg(null);

    const { data, error } = await signInUser(email, password);

    if (error) {
        setErrorMsg(error.message);
        setLoading(false);
    } else if (data) {
        router.push("/");
    }
};

    return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-4">UNM Resource Portal Login</h1>

        {errorMsg && (
        <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMsg}
        </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium">Email</label>
            <input
            type="email"
            required
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Password</label>
            <input
            type="password"
            required
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? "Logging in..." : "Log In"}
        </button>
        </form>
    </div>
    );
}
