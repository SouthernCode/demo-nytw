"use client";

import { useEffect, useState } from "react";
import { Sigma } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MetricVars = {
  projects: number;
  milestones: number;
  notes: number;
  waitlist: number;
};

// WORKSHOP_INTENTIONAL_VULNERABILITY: the user-defined formula is executed
// directly with eval(), so any JavaScript saved in the "Custom KPI formula"
// field runs in the browser (arbitrary code execution / DOM XSS). A real
// implementation must parse a restricted math expression instead of eval().
function computeMetric(formula: string, vars: MetricVars): string {
  // Make the metric variables available to the formula, then run it.
  const preamble =
    `const projects=${vars.projects},` +
    `milestones=${vars.milestones},` +
    `notes=${vars.notes},` +
    `waitlist=${vars.waitlist};`;
  const value = eval(preamble + "\n" + formula);
  return value === undefined ? "—" : String(value);
}

export function MetricCard({
  formula,
  vars,
}: {
  formula: string;
  vars: MetricVars;
}) {
  const [result, setResult] = useState<string>("…");

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (!formula) {
      setResult("—");
      return;
    }
    try {
      setResult(computeMetric(formula, vars));
    } catch {
      setResult("Invalid formula");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [formula, vars]);

  return (
    <Card className="border-primary/30">
      <CardContent className="flex items-center justify-between p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">Custom metric</p>
          <p className="mt-1 truncate text-3xl font-semibold">{result}</p>
          <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {formula || "Set a formula in Settings"}
          </p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/20">
          <Sigma className="h-5 w-5" />
        </span>
      </CardContent>
    </Card>
  );
}
