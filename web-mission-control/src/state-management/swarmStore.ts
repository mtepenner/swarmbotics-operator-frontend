import { create } from "zustand";

import type { ActionStatus, KillChainAction, MissionSnapshot, SwarmNode } from "../network-services/grpc-web-client";

interface SwarmState {
  nodes: SwarmNode[];
  actions: KillChainAction[];
  throughputSeries: number[];
  latencySeries: number[];
  packetLossSeries: number[];
  videoFeed: MissionSnapshot["videoFeed"];
  attitude: MissionSnapshot["attitude"];
  teleopFocusId: string | null;
  applySnapshot: (snapshot: MissionSnapshot) => void;
  decideAction: (actionId: string, status: Extract<ActionStatus, "approved" | "denied">) => void;
  setTeleopFocus: (nodeId: string) => void;
}

export const useSwarmStore = create<SwarmState>((set) => ({
  nodes: [],
  actions: [],
  throughputSeries: [],
  latencySeries: [],
  packetLossSeries: [],
  videoFeed: {
    latencyMs: 0,
    packetLossPct: 0,
    bitrateMbps: 0,
  },
  attitude: {
    pitchDeg: 0,
    rollDeg: 0,
    batteryPct: 0,
  },
  teleopFocusId: null,
  applySnapshot: (snapshot) =>
    set((state) => {
      const priorActions = new Map(state.actions.map((action) => [action.id, action]));
      const actions = snapshot.actions.map((action) => {
        const prior = priorActions.get(action.id);
        if (!prior || prior.status === "pending") {
          return action;
        }

        return {
          ...action,
          status: prior.status,
        };
      });

      return {
        nodes: snapshot.nodes,
        actions,
        throughputSeries: snapshot.throughputSeries,
        latencySeries: snapshot.latencySeries,
        packetLossSeries: snapshot.packetLossSeries,
        videoFeed: snapshot.videoFeed,
        attitude: snapshot.attitude,
        teleopFocusId: state.teleopFocusId ?? snapshot.nodes[0]?.id ?? null,
      };
    }),
  decideAction: (actionId, status) =>
    set((state) => ({
      actions: state.actions.map((action) =>
        action.id === actionId
          ? {
              ...action,
              status,
            }
          : action,
      ),
    })),
  setTeleopFocus: (nodeId) => set({ teleopFocusId: nodeId }),
}));
