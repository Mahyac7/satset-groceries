"use client";

import { categories } from "@/lib/data";

interface Props {
  active: string;
  onSelect: (id: string) => void;
}

export function CategoryNav({ active, onSelect }: Props) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {categories.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-brand bg-brand text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-brand/40"
            }`}
          >
            <span aria-hidden>{cat.icon}</span>
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
