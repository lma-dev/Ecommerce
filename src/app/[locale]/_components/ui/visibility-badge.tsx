import { Badge } from "@/components/ui/badge";

export function ActiveBadge({ value }: { value?: string | null }) {
  const v = String(value ?? "").toUpperCase();

  if (v === "ACTIVE") {
    return (
      <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">
        Active
      </Badge>
    );
  }
  if (v === "INACTIVE") {
    return (
      <Badge className="bg-zinc-300 text-zinc-800 hover:bg-zinc-300">
        Inactive
      </Badge>
    );
  }

  // fallback (unknown/empty)
  return (
    <Badge variant="outline" className="text-zinc-700">
      —
    </Badge>
  );
}
