import React, { forwardRef } from "react";
import { TrackerEntry } from "../types";
import { PRESET_CONDITIONS } from "../constants";

interface TrackerEntryCardProps {
  entry: TrackerEntry;
  isActive: boolean;
  inCombat: boolean;
  onRemove: (id: string) => void;
  onToggleAuto: (id: string) => void;
  onUpdateValue: (id: string, field: "score" | "modifier" | "hp" | "maxHp", val: number) => void;
  onAdjustHp: (id: string, delta: number) => void;
  onToggleCondition: (id: string, conditionName: string) => void;
}

export const TrackerEntryCard = forwardRef<HTMLDivElement, TrackerEntryCardProps>(
  (
    {
      entry,
      isActive,
      inCombat,
      onRemove,
      onToggleAuto,
      onUpdateValue,
      onAdjustHp,
      onToggleCondition,
    },
    ref
  ) => {
    const isUnconscious = entry.hp === 0;

    return (
      <div
        ref={ref}
        style={{
          padding: "10px",
          backgroundColor: isActive ? "#3e3b25" : "#2a2d37",
          borderRadius: "6px",
          borderLeft: isActive ? "5px solid #ffd700" : "5px solid transparent",
          opacity: isUnconscious ? 0.7 : 1,
        }}
      >
        {/* Token Name & Delete */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <span style={{ fontWeight: "bold", fontSize: "15px" }}>
            {isActive && "⚔️ "}
            {entry.name}{" "}
            {isUnconscious && (
              <span style={{ color: "#f44336", fontSize: "12px", marginLeft: "4px" }}>
                💀 Unconscious
              </span>
            )}
          </span>
          <button
            style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }}
            onClick={() => onRemove(entry.id)}
          >
            ✕
          </button>
        </div>

        {/* Initiative Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12px",
            marginBottom: "8px",
          }}
        >
          <button
            style={{
              padding: "2px 6px",
              backgroundColor: entry.isAuto ? "#2e7d32" : "#ed6c02",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
            }}
            onClick={() => onToggleAuto(entry.id)}
          >
            {entry.isAuto ? "Auto" : "Manual"}
          </button>

          {entry.isAuto ? (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Mod:</span>
              <input
                type="number"
                value={entry.modifier}
                onChange={(e) =>
                  onUpdateValue(entry.id, "modifier", parseInt(e.target.value, 10) || 0)
                }
                style={{
                  width: "40px",
                  backgroundColor: "#1e1e24",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span>Roll:</span>
              <input
                type="number"
                value={entry.score}
                onChange={(e) =>
                  onUpdateValue(entry.id, "score", parseInt(e.target.value, 10) || 0)
                }
                style={{
                  width: "45px",
                  backgroundColor: "#1e1e24",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "3px",
                  padding: "2px",
                }}
              />
            </div>
          )}

          <div style={{ marginLeft: "auto", fontSize: "14px", fontWeight: "bold", color: "#ffd700" }}>
            Init: {entry.score}
          </div>
        </div>

        {/* HP Controls */}
        <div style={{ backgroundColor: "#1e1e24", padding: "6px", borderRadius: "4px", fontSize: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ fontWeight: "bold", color: "#aaa" }}>HP:</span>
              <input
                type="number"
                value={entry.hp}
                onChange={(e) =>
                  onUpdateValue(entry.id, "hp", parseInt(e.target.value, 10) || 0)
                }
                style={{
                  width: "40px",
                  backgroundColor: "#2a2d37",
                  color: "#fff",
                  border: "1px solid #444",
                  borderRadius: "3px",
                  padding: "2px 4px",
                }}
              />
              <span>/</span>
              <input
                type="number"
                value={entry.maxHp}
                disabled={inCombat}
                onChange={(e) =>
                  onUpdateValue(entry.id, "maxHp", parseInt(e.target.value, 10) || 0)
                }
                style={{
                  width: "40px",
                  backgroundColor: inCombat ? "#181a20" : "#2a2d37",
                  color: inCombat ? "#666" : "#888",
                  border: "1px solid #444",
                  borderRadius: "3px",
                  padding: "2px 4px",
                  cursor: inCombat ? "not-allowed" : "text",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "3px" }}>
              {[-5, -1, 1, 5].map((delta) => (
                <button
                  key={delta}
                  style={{
                    padding: "2px 5px",
                    backgroundColor: delta < 0 ? (delta === -5 ? "#c62828" : "#d32f2f") : (delta === 1 ? "#388e3c" : "#2e7d32"),
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                  onClick={() => onAdjustHp(entry.id, delta)}
                >
                  {delta > 0 ? `+${delta}` : delta}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Conditions Display */}
        <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {(entry.conditions || []).map((cond) => {
            const preset = PRESET_CONDITIONS.find((p) => p.name === cond);
            const bg = preset ? preset.color : "#444a5a";

            return (
              <span
                key={cond}
                onClick={() => onToggleCondition(entry.id, cond)}
                style={{
                  backgroundColor: bg,
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {cond} ✕
              </span>
            );
          })}
        </div>

        {/* Condition Quick Selector */}
        <div style={{ marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {PRESET_CONDITIONS.map((p) => {
            const isActiveCondition = (entry.conditions || []).includes(p.name);
            return (
              <button
                key={p.name}
                onClick={() => onToggleCondition(entry.id, p.name)}
                style={{
                  padding: "2px 6px",
                  fontSize: "10px",
                  borderRadius: "4px",
                  border: isActiveCondition ? `1px solid ${p.color}` : "1px solid #444",
                  backgroundColor: isActiveCondition ? p.color : "#1e1e24",
                  color: isActiveCondition ? "#fff" : "#888",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {isActiveCondition ? `✓ ${p.name}` : `+ ${p.name}`}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
