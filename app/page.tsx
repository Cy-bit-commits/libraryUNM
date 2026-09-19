import { getResources } from "@/services/resourceService";
import ResourceCard from "@/components/ResourceCard";

// Forces Next.js to fetch fresh database data on every request
export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: resources, error } = await getResources();

  if (error) {
    console.error("Failed to load resources:", error);
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Academic Resources</h1>

      {!resources || resources.length === 0 ? (
        <p className="text-gray-500">No resources Uploaded.</p>
      ) : (
        <div className="grid gap-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </main>
  );
}
