import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-10">Memuat…</div>}>
      <Catalog />
    </Suspense>
  );
}
