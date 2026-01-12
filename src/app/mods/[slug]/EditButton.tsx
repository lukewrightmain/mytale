"use client";

import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui";

interface EditButtonProps {
  slug: string;
  ownerClerkId: string | null;
}

export function EditButton({ slug, ownerClerkId }: EditButtonProps) {
  const { userId } = useAuth();

  // Only show if user is the owner
  if (!userId || userId !== ownerClerkId) {
    return null;
  }

  return (
    <Link href={`/mods/${slug}/edit`}>
      <Button variant="outline" size="sm">
        <Pencil className="w-4 h-4" />
        Edit Mod
      </Button>
    </Link>
  );
}

