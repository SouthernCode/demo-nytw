import Link from "next/link";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2 font-semibold", className)}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary ring-1 ring-primary/30">
        <Rocket className="h-4 w-4" />
      </span>
      <span className="text-base tracking-tight">
        Launch<span className="text-primary">Pad</span>
      </span>
    </Link>
  );
}
