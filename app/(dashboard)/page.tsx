"use client";

import { useState, useEffect } from "react";
import { getResources, searchResources } from "@/services/resourceService";
import { Resource } from "@/types";
import ResourceCard from "@/components/ResourceCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    const loadAllResources = async () => {
        setLoading(true);
        const { data } = await getResources();
        if (data) setResources(data);
        setLoading(false);
    };

    useEffect(() => {
        loadAllResources();
    }, []);

    
    const handleSearch = async (query: string) => {
        if (!query.trim()) {
        loadAllResources();
        return;
        }
        setLoading(true);
        const { data } = await searchResources(query);
        if (data) setResources(data);
        setLoading(false);
    };

    return (
        <main className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Feed</h1>
            <p className="text-gray-600 text-sm">
                Explore and share study materials at UNM
            </p>
            </div>
            <Link
            href="/upload"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
            <PlusCircle className="w-5 h-5" />
            Upload Resource
            </Link>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
            <div className="text-center py-12 text-gray-500">
            Loading resources...
            </div>
        ) : resources.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
            No resources found. Be the first to upload!
            </div>
        ) : (
            <div className="grid gap-4 mt-6">
            {resources.map((item) => (
                <ResourceCard key={item.id} resource={item} />
            ))}
            </div>
        )}
        </main>
    );
}
