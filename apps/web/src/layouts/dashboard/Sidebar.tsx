// app/dashboard/components/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MyLearningItem {
  icon: string;
  title: string;
  slug: string;
}

interface SidebarProps {
  myLearningItems: MyLearningItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ myLearningItems }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`bg-[#F7F7F7] h-screen transition-all border border-[#E2E2E2] duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center p-4 border-b">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        {isExpanded && <span className="font-semibold ml-2">yamato</span>}
      </div>

      <div className="px-4 pt-4">
        <Link
          href="/dashboard/find-book"
          className={cn(
            "flex items-center space-x-2 p-2 hover:bg-gray-100 rounded",
            pathname.startsWith("/dashboard/find-book") && "bg-gray-200"
          )}
        >
          <Plus size={18} />
          {isExpanded && <span className="text-xs">find book</span>}
        </Link>
      </div>

      {myLearningItems.map((item, index) => (
        <Link href={`/dashboard/${item.slug}`} key={index}>
          <div className="p-4">
            <div className="flex justify-between w-full items-center space-x-2 p-2 bg-white rounded shadow-sm">
              <div className="flex items-center">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-5 h-5 mr-2"
                />
                {isExpanded && <span className="text-sm">{item.title}</span>}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </aside>
  );
};
