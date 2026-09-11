import React from "react";

interface HeaderControlsProps {
  round: number;
  inCombat: boolean;
  entriesLength: number;
  showRepo: boolean;
  repoLength: number;
  onStartCombat: () => void;
  onNextTurn: () => void;
  onEndCombat: () => void;
  onAddSelected: () => void;
  onToggleRepo: () => void;
}

export const HeaderControls: React.FC<HeaderControlsProps> = ({
  round,
  inCombat,
  entriesLength,
  showRepo,
  repoLength,
  onStartCombat,
  onNextTurn,
  onEndCombat,
  onAddSelected,
  onToggleRepo,
}) => {
  return (
    <div
      style={{
        position: "sticky",
        top: "-12px",
        backgroundColor: "#1e1e24",
        paddingTop: "12px",
        marginTop: "-12px",
        zIndex: 10,
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
      }}
    >
      <h2 style={{ margin: "0 0 8px 0", textAlign: "center", fontSize: "18px" }}>
        Initiative Tracker
      </h2>

      {/* Round & Combat Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2a2d37",
          padding: "8px 12px",
          borderRadius: "6px",
          marginBottom: "8px",
        }}
      >
        <span style={{ fontWeight: "bold", fontSize: "14px", color: "#ffd700" }}>
          Round: {round}
        </span>
        {!inCombat ? (
          <button
            style={{
              padding: "6px 12px",
              backgroundColor: "#2e7d32",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={onStartCombat}
            disabled={entriesLength === 0}
          >
            ⚔️ Start Combat
          </button>
        ) : (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              style={{
                padding: "6px 12px",
                backgroundColor: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={onNextTurn}
            >
              Next Turn ▶
            </button>
            <button
              style={{
                padding: "6px 8px",
                backgroundColor: "#c62828",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={onEndCombat}
            >
              End
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <button
          onClick={onAddSelected}
          style={{
            flex: 1,
            padding: "8px",
            backgroundColor: "#444a5a",
            color: "#ffd700",
            border: "1px dashed #ffd700",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ➕ Selected Tokens
        </button>
        <button
          onClick={onToggleRepo}
          style={{
            padding: "8px 12px",
            backgroundColor: showRepo ? "#ffd700" : "#2a2d37",
            color: showRepo ? "#000" : "#ffd700",
            border: "1px solid #ffd700",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          📚 Library ({repoLength})
        </button>
      </div>
    </div>
  );
};
