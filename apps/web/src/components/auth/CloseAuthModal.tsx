"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

function CloseAuthModal() {
  const router = useRouter();

  return (
    <Button
      aria-label="close modal"
      variant="ghost"
      className="size-6 rounded-md p-0"
      onClick={() => router.back()}
    >
      <X className="size-4" />
    </Button>
  );
}

export default CloseAuthModal;
