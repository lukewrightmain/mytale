"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui";

interface EditButtonProps {
  creatorId: string;
  slug: string;
}

export function EditButton({ creatorId, slug }: EditButtonProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkOwnership() {
      try {
        const response = await fetch(`/api/creators/${slug}/ownership`);
        const data = await response.json();
        setIsOwner(data.isOwner);
      } catch (error) {
        console.error("Error checking ownership:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkOwnership();
  }, [slug]);

  if (isLoading || !isOwner) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={() => router.push(`/creators/${slug}/edit`)}
      className="flex items-center gap-2"
    >
      <Pencil className="w-4 h-4" />
      Edit
    </Button>
  );
}

