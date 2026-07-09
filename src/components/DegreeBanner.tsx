import { TerminalSquare } from "lucide-react";
import type { ProfileData } from "../types";

export default function DegreeBanner({ degree }: { degree: ProfileData["degree"] }) {
  return (
    <div className="card p-6 bg-gradient-to-br from-maroon-800 via-maroon-900 to-maroon-950 border-none text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 14px)",
        }}
      />
      <div className="relative">
        <TerminalSquare size={26} className="text-white/90" />
        <h2 className="font-display mt-4 text-xl font-bold uppercase tracking-tight leading-tight">
          {degree.program}
        </h2>

        <div className="mt-6 text-xs uppercase tracking-wider text-white/60">
          {degree.classYear}
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">
            EDU
          </div>
          <div className="text-sm font-semibold uppercase tracking-tight leading-tight">
            {degree.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
