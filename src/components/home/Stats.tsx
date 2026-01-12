import { Package, Server, Download, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { getStats } from "@/lib/supabase/queries";

export async function Stats() {
  const data = await getStats();

  const stats = [
    {
      label: "Mods Available",
      value: data.mods,
      icon: Package,
      color: "text-primary-400",
      bgColor: "bg-primary-500/10",
    },
    {
      label: "Active Servers",
      value: data.servers,
      icon: Server,
      color: "text-secondary-400",
      bgColor: "bg-secondary-500/10",
    },
    {
      label: "Total Downloads",
      value: data.downloads,
      icon: Download,
      color: "text-accent-400",
      bgColor: "bg-accent-500/10",
    },
    {
      label: "Players Online",
      value: data.playersOnline,
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <section className="py-16 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-surface-elevated border border-border hover:border-stone-700 transition-colors"
            >
              <div
                className={`w-14 h-14 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <span className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-1">
                {formatNumber(stat.value)}
              </span>
              <span className="text-foreground-muted text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
