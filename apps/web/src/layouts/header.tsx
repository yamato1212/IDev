import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";

import { LayoutGrid, Users2 } from "lucide-react";
import { Icons } from "@/components/icons";

export async function Header() {
  return (
    <div className="flex w-full fixed mx-auto z-50 justify-between">
      <div className="w-full">
        <div className="z-60 w-full py-2  backdrop-blur-sm sm:py-2">
          <nav className=" px-4 ">
            <div className="mx-auto flex max-w-[1200px]  items-center justify-between rounded-full">
              <div className="gap- flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <Icons.logo className="size-12" />

                  <h1 className="text-xl font-semibold">IDev</h1>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
