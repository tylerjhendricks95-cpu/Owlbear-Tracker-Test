import { ConditionPreset } from "./types";

export const METADATA_KEY = "com.tylerjhendricks95-cpu.initiative-tracker/metadata";
export const LOCAL_STORAGE_REPO_KEY = "initiative_tracker_repository";

export const CONTEXT_ICON =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFD700'><path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'/></svg>";

export const PRESET_CONDITIONS: ConditionPreset[] = [
  { name: "Blessed", color: "#0288d1" },
  { name: "Blinded", color: "#546e7a" },
  { name: "Charmed", color: "#e91e63" },
  { name: "Concentrating", color: "#f57f17" },
  { name: "Frightened", color: "#c62828" },
  { name: "Grappled", color: "#8d6e63" },
  { name: "Invisible", color: "#00acc1" },
  { name: "Paralyzed", color: "#b71c1c" },
  { name: "Poisoned", color: "#2e7d32" },
  { name: "Prone", color: "#7b1fa2" },
  { name: "Restrained", color: "#d81b60" },
  { name: "Stunned", color: "#ed6c02" },
];
