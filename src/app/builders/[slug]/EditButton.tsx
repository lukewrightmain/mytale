"use client";

import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui";

interface EditButtonProps {
  slug: string;
}

export function EditButton({ slug }: EditButtonProps) {
  return (
    <Link href={`/builders/${slug}/edit`}>
      <Button variant="outline" size="sm">
        <Edit className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    </Link>
  );
}
