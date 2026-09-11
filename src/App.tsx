import React, { useEffect, useState, useRef } from "react";
import OBR from "@owlbear-rodeo/sdk";
import { TrackerEntry, SavedCharacter } from "./types";
import { LOCAL_STORAGE_REPO_KEY } from "./constants";
import { useOwlbearInitiative } from "./hooks/useOwlbearInitiative";
import { HeaderControls } from "./components/HeaderControls";
import { CharacterLibrary } from "./components/CharacterLibrary";
import { TrackerEntryCard } from "./components/TrackerEntryCard";

export default function App() {
  const {
    isReady,
    entries,
    activeIndex,
    round,
    inCombat,
    saveRoomState,
    handleAddSelected,
  } = useOwlbearInitiative();

  const [repository, setRepository] = useState<SavedCharacter[]>([]);
  const [showRepo, setShowRepo] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load Saved Characters
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_REPO_KEY);
    if (saved) {
      try {
        setRepository(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse repository data", e);
      }
    }
  }, []);

  const saveRepository = (newRepo: SavedCharacter[]) => {
    setRepository(newRepo);
    localStorage.setItem(LOCAL_STORAGE_REPO_KEY, JSON.stringify(newRepo));
  };

  const handleAddCharacterToRepo = (newChar: SavedCharacter) => {
    saveRepository([...repository, newChar]);
  };

  const handleDeleteFromRepo = (id: string) => {
    saveRepository(repository.filter((c) => c.id !== id));
  };

  const handleAddRepoToTracker = async (char: SavedCharacter) => {
    const newEntry: TrackerEntry = {
      id: "entry-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      name: char.name,
      isAuto: true,
      modifier: char.modifier,
      score: 0,
      hp: char.maxHp,
      maxHp: char.maxHp,
      conditions: [],
    };

    await saveRoomState([...entries, newEntry], activeIndex, round, inCombat);
  };

  // Adjust Owlbear Rodeo popup height dynamically
  useEffect(() => {
    const updateWindowHeight = async () => {
      if (!containerRef.current) return;
      const contentHeight = containerRef.current.scrollHeight;
      const targetHeight = Math.min(Math.max(300, contentHeight), 800);

      try {
        await OBR.action.setHeight(targetHeight);
      } catch (_) {}
    };

    if (isReady) {
      const timer = setTimeout(updateWindowHeight, 50);
      return () => clearTimeout(timer);
    }
  }, [entries, repository, showRepo, isReady]);

  // Scroll active token into view when combat turns advance
  useEffect(() => {
    if (inCombat && entryRefs.current[activeIndex]) {
      entryRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex, inCombat]);

  // Tracker Logic Actions
  const toggleAuto = async (id: string) => {
    const updated = entries.map((entry) => {
      if (entry.id !== id) return entry;
      const nextIsAuto = !entry.isAuto;
      let newScore = entry.score;

      if (nextIsAuto && inCombat) {
        const roll = Math.floor(Math.random() * 20) + 1;
        newScore = roll + entry.modifier;
      }

      return { ...entry, isAuto: nextIsAuto, score: newScore };
    });

    await saveRoomState(updated, activeIndex, round, inCombat);
  };

  const updateEntryValue = async (
    id: string,
    field: "score" | "modifier" | "hp" | "maxHp",
    val: number
  ) => {
    const updated = entries.map((e) => {
      if (e.id !== id) return e;
      if (field === "score") return { ...e, score: val };
      if (field === "modifier") return { ...e, modifier: val };
      if (field === "hp") return { ...e, hp: Math.min(e.maxHp, Math.max(0, val)) };
      if (field === "maxHp") {
        const newMax = Math.max(1, val);
        return {
          ...e,
          maxHp: newMax,
          hp: !inCombat ? newMax : Math.min(e.hp, newMax),
        };
      }
      return e;
    });

    await saveRoomState(updated, activeIndex, round, inCombat);
  };

  const adjustHp = async (id: string, delta: number) => {
    const updated = entries.map((e) => {
      if (e.id !== id) return e;
      return { ...e, hp: Math.min(e.maxHp, Math.max(0, e.hp + delta)) };
    });

    await saveRoomState(updated, activeIndex, round, inCombat);
  };

  const toggleCondition = async (entryId: string, conditionName: string) => {
    const updated = entries.map((e) => {
      if (e.id !== entryId) return e;
      const current = e.conditions || [];
      const exists = current.includes(conditionName);
      const nextConditions = exists
        ? current.filter((c) => c !== conditionName)
        : [...current, conditionName];
      return { ...e, conditions: nextConditions };
    });

    await saveRoomState(updated, activeIndex, round, inCombat);
  };

  const startCombat = async () => {
    if (entries.length === 0) return;

    const rolled = entries.map((entry) => {
      if (entry.isAuto) {
        const roll = Math.floor(Math.random() * 20) + 1;
        return { ...entry, score: roll + entry.modifier };
      }
      return entry;
    });

    const sorted = [...rolled].sort((a, b) => b.score - a.score);
    await saveRoomState(sorted, 0, 1, true);
  };

  const nextTurn = async () => {
    if (entries.length === 0) return;
    let nextIdx = activeIndex + 1;
    let nextRound = round;

    if (nextIdx >= entries.length) {
      nextIdx = 0;
      nextRound += 1;
    }

    await saveRoomState(entries, nextIdx, nextRound, true);
  };

  const endCombat = async () => {
    await saveRoomState(entries, 0, 1, false);
  };

  const removeEntry = async (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    let nextIdx = activeIndex;
    if (nextIdx >= updated.length) {
      nextIdx = Math.max(0, updated.length - 1);
    }
    await saveRoomState(updated, nextIdx, round, inCombat && updated.length > 0);
  };

  if (!isReady) {
    return <div style={{ padding: 16, color: "#fff" }}>Connecting to Owlbear Rodeo...</div>;
  }

  return (
    <div
      ref={containerRef}
      style={{
        padding: "12px",
        color: "#fff",
        backgroundColor: "#1e1e24",
        boxSizing: "border-box",
        fontFamily: "sans-serif",
      }}
    >
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #1e1e24; }
        ::-webkit-scrollbar-thumb { background: #444a5a; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #5a6175; }
      `}</style>

      <HeaderControls
        round={round}
        inCombat={inCombat}
        entriesLength={entries.length}
        showRepo={showRepo}
        repoLength={repository.length}
        onStartCombat={startCombat}
        onNextTurn={nextTurn}
        onEndCombat={endCombat}
        onAddSelected={handleAddSelected}
        onToggleRepo={() => setShowRepo(!showRepo)}
      />

      {showRepo && (
        <CharacterLibrary
          repository={repository}
          onAddCharacter={handleAddCharacterToRepo}
          onDeleteCharacter={handleDeleteFromRepo}
          onAddToTracker={handleAddRepoToTracker}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {entries.map((entry, idx) => (
          <TrackerEntryCard
            key={entry.id}
            ref={(el) => (entryRefs.current[idx] = el)}
            entry={entry}
            isActive={inCombat && idx === activeIndex}
            inCombat={inCombat}
            onRemove={removeEntry}
            onToggleAuto={toggleAuto}
            onUpdateValue={updateEntryValue}
            onAdjustHp={adjustHp}
            onToggleCondition={toggleCondition}
          />
        ))}
      </div>
    </div>
  );
}
