"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadResource } from "@/services/resourceService";
import { getCurrentUser } from "@/services/authService";
import { supabase } from "@/lib/supabaseClient";
import { Category } from "@/types";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function prepareUploadPage() {
        const user = await getCurrentUser();
        if (!user) {
            router.push("/login");
            return;
        }
        setUserId(user.id);

        const { data } = await supabase.from("categories").select("*");
        if (data) setCategories(data);
        }

        prepareUploadPage();
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file || !userId || categoryId === "") {
        setErrorMsg(
            "Please select a file, category, and ensure you are logged in.",
        );
        return;
        }

        setLoading(true);
        setErrorMsg(null);

        const { error } = await uploadResource({
        file,
        title,
        description,
        categoryId: Number(categoryId),
        userId,
        });

        if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        } else {
        router.push("/");
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white border rounded-lg shadow-sm mt-8">
        <h1 className="text-2xl font-bold mb-4">Upload Academic Resource</h1>

        {errorMsg && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-sm font-medium">Document Title</label>
            <input
                type="text"
                required
                placeholder="e.g., CS101 Midterm Reviewer"
                className="w-full p-2 border rounded mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            </div>

            <div>
            <label className="block text-sm font-medium">Category</label>
            <select
                required
                className="w-full p-2 border rounded mt-1 bg-white"
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
            >
                <option value="">Select a Category</option>
                {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
                ))}
            </select>
            </div>

            <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
                rows={3}
                placeholder="Brief details about this resource..."
                className="w-full p-2 border rounded mt-1"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            </div>

            <div>
            <label className="block text-sm font-medium">
                File (PDF, Doc, Image)
            </label>
            <input
                type="file"
                required
                className="w-full p-2 border rounded mt-1"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            </div>

            <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
            {loading ? "Uploading..." : "Publish Resource"}
            </button>
        </form>
        </div>
    );
}
