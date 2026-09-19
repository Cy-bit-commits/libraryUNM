"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { uploadResource } from "@/services/resourceService";
import { getCurrentUser } from "@/services/authService";
import { supabase } from "@/lib/supabaseClient";
import { Category } from "@/types";
import { Loader2, CheckCircle2, UploadCloud } from "lucide-react";

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        async function prepareUploadPage() {
            const user = await getCurrentUser();


        if (!user) {
            router.push("/login");
            return;
        }

        setUserId(user.id);

        const { data, error } = await supabase.from("categories").select("*");
        if (!error && data) setCategories(data);
        }

        prepareUploadPage();
    }, [router]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        let activeUserId = userId;


        if (!activeUserId) {
            const user = await getCurrentUser();
            activeUserId = user?.id || null;
        }

        if (!file || !activeUserId || categoryId === "") {
            setErrorMsg(
                "Please select a valid file, category, and ensure you are logged in.",
            );
            return;
        }

        setLoading(true);
        setIsSuccess(false);
        setErrorMsg(null);

        const { error } = await uploadResource({
            file,
            title,
            description,
            categoryId: Number(categoryId),
            userId: activeUserId,
            onStatusUpdate: (msg) => setStatusMessage(msg),
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
        } else {
            setIsSuccess(true);
            setTimeout(() => {
                router.refresh();
                router.push("/");
            }, 1200);
        }
    };

    return (
        <div className="relative max-w-xl mx-auto p-6 bg-white border rounded-lg shadow-sm mt-8">
            {/* Real-Time Loading Screen Modal Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
                    {isSuccess ? (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                        <h3 className="text-xl font-bold text-gray-900">All Done!</h3>
                        <p className="text-sm text-gray-500 mt-2">{statusMessage}</p>
                    </>
                    ) : (
                    <>
                        <div className="relative mb-4 flex items-center justify-center">
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                        <UploadCloud className="w-7 h-7 text-blue-600 absolute" />
                        </div>
                        <h3   h3 className="text-lg font-semibold text-gray-900">
                            Uploading Resource
                        </h3>
                        <p className="text-sm text-gray-500 mt-2 font-medium animate-pulse">
                        {statusMessage || "Preparing file..."}
                        </p>
                    </>
                    )}
                </div>
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Upload Academic Resource
            </h1>

            {errorMsg && (
                <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {errorMsg}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Document Title
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g., CS101 Final Reviewer"
                    className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    Category
                </label>
                <select
                    required
                    className="w-full p-2 border rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={categoryId}
                    onChange={(e) => {
                    const val = e.target.value;
                    setCategoryId(val === "" ? "" : Number(val));
                    }}
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
                <label className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    rows={3}
                    placeholder="Brief details about this resource..."
                    className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700">
                    File (PDF, Doc, Image)
                </label>
                <input
                    type="file"
                    required
                    className="w-full p-2 border rounded mt-1 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                </div>

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                Publish Resource
                </button>
            </form>
            </div>
        );
}
