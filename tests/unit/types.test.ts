import { describe, it, expect } from "vitest";
import {
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  type ProjectStatus,
  type TaskStatus,
} from "@/lib/types";

// These label maps drive UI badges. If a new status is added to the union but
// not to the label map, the value would render as a raw enum string. These
// tests pin the maps to the full set of statuses so that gap is caught.
const PROJECT_STATUSES: ProjectStatus[] = [
  "planning",
  "building",
  "launched",
  "paused",
  "archived",
];

const TASK_STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

describe("PROJECT_STATUS_LABELS", () => {
  it("has a human label for every project status", () => {
    for (const status of PROJECT_STATUSES) {
      expect(PROJECT_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("has no extra keys beyond the known statuses", () => {
    expect(Object.keys(PROJECT_STATUS_LABELS).sort()).toEqual(
      [...PROJECT_STATUSES].sort()
    );
  });
});

describe("TASK_STATUS_LABELS", () => {
  it("has a human label for every task status", () => {
    for (const status of TASK_STATUSES) {
      expect(TASK_STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it("renders in_progress as 'In progress'", () => {
    expect(TASK_STATUS_LABELS.in_progress).toBe("In progress");
  });
});
