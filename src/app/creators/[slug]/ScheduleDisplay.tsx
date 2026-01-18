"use client";

import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui";
import type { ScheduleSlot } from "@/lib/supabase/queries";

interface ScheduleDisplayProps {
  schedule: ScheduleSlot[];
  timezone: string;
}

const DAY_ORDER: Array<"monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_FULL_LABELS: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function ScheduleDisplay({ schedule, timezone }: ScheduleDisplayProps) {
  // Sort schedule by day of week
  const sortedSchedule = [...schedule].sort(
    (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
  );

  // Get scheduled days for the week view
  const scheduledDays = new Set(schedule.map((s) => s.day));

  return (
    <Card className="p-6">
      <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-primary-500" />
        Streaming Schedule
        <span className="text-sm font-normal text-foreground-muted ml-2">
          ({timezone.split("/").pop()?.replace(/_/g, " ")})
        </span>
      </h2>

      {/* Week Overview */}
      <div className="flex gap-1 mb-6">
        {DAY_ORDER.map((day) => (
          <div
            key={day}
            className={`
              flex-1 py-2 text-center text-xs font-medium rounded-lg transition-colors
              ${scheduledDays.has(day)
                ? "bg-primary-500/20 text-primary-400 border border-primary-500/30"
                : "bg-surface-elevated text-foreground-muted"
              }
            `}
          >
            {DAY_LABELS[day]}
          </div>
        ))}
      </div>

      {/* Detailed Schedule */}
      <div className="space-y-3">
        {sortedSchedule.map((slot, index) => (
          <div
            key={`${slot.day}-${index}`}
            className="flex items-center gap-4 p-3 rounded-lg bg-surface-elevated"
          >
            <div className="w-24">
              <span className="font-medium text-foreground">
                {DAY_FULL_LABELS[slot.day]}
              </span>
            </div>
            <div className="flex items-center gap-2 text-foreground-muted">
              <Clock className="w-4 h-4" />
              <span>
                {slot.start} - {slot.end}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-foreground-subtle mt-4">
        Times shown in creator&apos;s local timezone. Adjust for your timezone accordingly.
      </p>
    </Card>
  );
}

