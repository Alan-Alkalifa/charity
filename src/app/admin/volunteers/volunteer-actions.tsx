"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateVolunteerStatus } from "@/app/actions/admin";
import type { VolunteerStatus } from "@/types";

interface Props {
  id: string;
  currentStatus: VolunteerStatus;
}

export function VolunteerActions({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const update = (status: VolunteerStatus) =>
    startTransition(async () => { await updateVolunteerStatus(id, status); });

  if (currentStatus === "pending") {
    return (
      <div className="flex gap-1.5">
        <Button size="sm" className="h-7 text-xs" onClick={() => update("approved")} disabled={isPending}>
          Setujui
        </Button>
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => update("inactive")} disabled={isPending}>
          Tolak
        </Button>
      </div>
    );
  }

  if (currentStatus === "approved") {
    return (
      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => update("active")} disabled={isPending}>
        Aktifkan
      </Button>
    );
  }

  if (currentStatus === "active") {
    return (
      <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={() => update("inactive")} disabled={isPending}>
        Nonaktifkan
      </Button>
    );
  }

  return (
    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => update("pending")} disabled={isPending}>
      Reset
    </Button>
  );
}
