import { useEffect, useState } from "react";
import OBR, { Item } from "@owlbear-rodeo/sdk";
import { TrackerEntry, RoomData } from "../types";
import { METADATA_KEY, CONTEXT_ICON } from "../constants";

export function useOwlbearInitiative() {
  const [isReady, setIsReady] = useState(false);
  const [entries, setEntries] = useState<TrackerEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [inCombat, setInCombat] = useState<boolean>(false);

  const saveRoomState = async (
    newEntries: TrackerEntry[],
    newActiveIdx: number,
    newRound: number,
    newInCombat: boolean
  ) => {
    setEntries(newEntries);
    setActiveIndex(newActiveIdx);
    setRound(newRound);
    setInCombat(newInCombat);

    await OBR.room.setMetadata({
      [METADATA_KEY]: {
        entries: newEntries,
        activeIndex: newActiveIdx,
        round: newRound,
        inCombat: newInCombat,
      },
    });

    if (newInCombat && newEntries.length > 0) {
      const activeId = newEntries[newActiveIdx]?.id;
      if (activeId) {
        await OBR.player.select([activeId]);
      }
    }
  };

  const addTokensToTracker = async (items: Item[]) => {
    const currentMetadata = (await OBR.room.getMetadata())[METADATA_KEY] as RoomData | undefined;
    const existingEntries = currentMetadata?.entries || [];
    const newEntries = [...existingEntries];

    for (const item of items) {
      if (newEntries.some((e) => e.id === item.id)) continue;

      const tokenName = item.name || "Token";
      const isManualToken = tokenName.startsWith("**");

      newEntries.push({
        id: item.id,
        name: tokenName,
        isAuto: !isManualToken,
        modifier: 0,
        score: 0,
        hp: 10,
        maxHp: 10,
        conditions: [],
      });
    }

    await saveRoomState(newEntries, activeIndex, round, inCombat);
  };

  const handleAddSelected = async () => {
    const selectedIds = await OBR.player.getSelection();
    if (!selectedIds || selectedIds.length === 0) return;

    const selectedItems = await OBR.scene.items.getItems(selectedIds);
    await addTokensToTracker(selectedItems);
  };

  useEffect(() => {
    OBR.onReady(async () => {
      setIsReady(true);

      try {
        await OBR.contextMenu.remove("com.tylerjhendricks95-cpu.initiative-tracker/add-token");
      } catch (_) {}

      try {
        await OBR.contextMenu.create({
          id: "com.tylerjhendricks95-cpu.initiative-tracker/add-token",
          icons: [{ icon: CONTEXT_ICON, label: "Add to Initiative" }],
          select: [
            {
              items: [
                { property: "layer", value: "CHARACTER" },
                { property: "layer", value: "MOUNT" },
                { property: "type", value: "IMAGE" },
              ],
            },
          ],
          async onClick(context) {
            await addTokensToTracker(context.items);
          },
        });
      } catch (err) {
        console.error("Failed to register context menu:", err);
      }

      const handleMetadata = async (metadata: Record<string, unknown>) => {
        const data = metadata[METADATA_KEY] as RoomData | undefined;
        if (data) {
          setEntries(data.entries || []);
          setActiveIndex(data.activeIndex || 0);
          setRound(data.round || 1);
          setInCombat(data.inCombat || false);

          if (data.inCombat && data.entries.length > 0) {
            const activeId = data.entries[data.activeIndex]?.id;
            if (activeId) await OBR.player.select([activeId]);
          }
        }
      };

      OBR.room.onMetadataChange(handleMetadata);
      const initial = await OBR.room.getMetadata();
      await handleMetadata(initial);
    });
  }, []);

  return {
    isReady,
    entries,
    activeIndex,
    round,
    inCombat,
    saveRoomState,
    handleAddSelected,
  };
}
