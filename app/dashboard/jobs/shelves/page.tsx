import { ShelfEditor } from "@/features/shelves";
import { getImageMetadata } from "@/features/shelves";

export default async function ShelvesPage() {
  const image = await getImageMetadata("shelf.jpeg");

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Shelf Management
          </h1>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <ShelfEditor image={image} />
      </div>
    </div>
  );
}
