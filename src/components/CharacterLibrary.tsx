import React, { useState } from "react";
import { SavedCharacter } from "../types";

interface CharacterLibraryProps {
  repository: SavedCharacter[];
  onAddCharacter: (character: SavedCharacter) => void;
  onDeleteCharacter: (id: string) => void;
  onAddToTracker: (character: SavedCharacter) => void;
}

export const CharacterLibrary: React.FC<CharacterLibraryProps> = ({
  repository,
  onAddCharacter,
  onDeleteCharacter,
  onAddToTracker,
}) => {
  const [newCharName, setNewCharName] = useState("");
  const [newCharMod, setNewCharMod] = useState(0);
  const [newCharHp, setNewCharHp] = useState(10);

  const handleSave = () => {
    if (!newCharName.trim()) return;
    onAddCharacter({
      id: "repo-" + Date.now(),
      name: newCharName.trim(),
      modifier: newCharMod,
      maxHp: newCharHp,
    });
    setNewCharName("");
    setNewCharMod(0);
    setNewCharHp(10);
  };

  return (
    <div
      style={{
        backgroundColor: "#2a2d37",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "12px",
        border: "1px solid #444a5a",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "13px", marginBottom: "8px", color: "#ffd700" }}>
        Character Library
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Character/Monster Name"
          value={newCharName}
          onChange={(e) => setNewCharName(e.target.value)}
          style={{
            padding: "4px 8px",
            backgroundColor: "#1e1e24",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "4px",
            fontSize: "12px",
          }}
        />
        <div style={{ display: "flex", gap: "6px" }}>
          <input
            type="number"
            placeholder="Init Mod"
            value={newCharMod}
            onChange={(e) => setNewCharMod(parseInt(e.target.value, 10) || 0)}
            style={{
              width: "50%",
              padding: "4px 8px",
              backgroundColor: "#1e1e24",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
          <input
            type="number"
            placeholder="Max HP"
            value={newCharHp}
            onChange={(e) => setNewCharHp(parseInt(e.target.value, 10) || 1)}
            style={{
              width: "50%",
              padding: "4px 8px",
              backgroundColor: "#1e1e24",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          />
        </div>
        <button
          onClick={handleSave}
          style={{
            padding: "6px",
            backgroundColor: "#2e7d32",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          💾 Save Character Template
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxHeight: "150px", overflowY: "auto" }}>
        {repository.length === 0 ? (
          <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center" }}>No saved templates yet.</div>
        ) : (
          repository.map((char) => (
            <div
              key={char.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#1e1e24",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
              }}
            >
              <div>
                <span style={{ fontWeight: "bold" }}>{char.name}</span>
                <span style={{ color: "#aaa", fontSize: "10px", marginLeft: "6px" }}>
                  (Mod: {char.modifier >= 0 ? `+${char.modifier}` : char.modifier} | HP: {char.maxHp})
                </span>
              </div>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  onClick={() => onAddToTracker(char)}
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  ➕ Add
                </button>
                <button
                  onClick={() => onDeleteCharacter(char.id)}
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#c62828",
                    color: "#fff",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "10px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
