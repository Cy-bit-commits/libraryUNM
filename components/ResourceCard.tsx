import { Resource } from "@/types";
import { Download, FileText, Calendar } from "lucide-react";

interface ResourceCardProps {
    resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
    return (
    <div className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition">
        <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded">
            <FileText className="w-6 h-6" />
            </div>
            <div>
            <h3 className="font-semibold text-lg text-gray-900">
                {resource.title}
            </h3>
            {resource.categories?.name && (
                <span className="inline-block mt-1 text-xs font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                {resource.categories.name}
                </span>
            )}
            </div>
        </div>
        <a
            href={resource.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition"
        >
            <Download className="w-4 h-4" />
            Download
        </a>
        </div>

        {resource.description && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {resource.description}
        </p>
        )}

        <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(resource.created_at).toLocaleDateString()}</span>
        </div>
        {resource.file_type && (
            <span className="uppercase font-mono text-gray-400">
            {resource.file_type}
            </span>
        )}
        </div>
    </div>
    );
}
