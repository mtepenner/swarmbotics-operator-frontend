export type LinkMode = "manet" | "5g" | "satcom";
export type MissionState = "screening" | "overwatch" | "fallback" | "hold";
export type PayloadType = "isr" | "ew" | "kinetic";
export type ActionStatus = "pending" | "approved" | "denied";

export interface SwarmNode {
  id: string;
  callsign: string;
  x: number;
  y: number;
  altitudeM: number;
  headingDeg: number;
  batteryPct: number;
  linkMode: LinkMode;
  missionState: MissionState;
  payloadType: PayloadType;
  threatScore: number;
  signalQuality: number;
}

export interface KillChainAction {
  id: string;
  callsign: string;
  targetLabel: string;
  payloadType: PayloadType;
  confidence: number;
  status: ActionStatus;
  recommendedEffect: string;
  windowSeconds: number;
}

export interface MissionSnapshot {
  nodes: SwarmNode[];
  actions: KillChainAction[];
  throughputSeries: number[];
  latencySeries: number[];
  packetLossSeries: number[];
  videoFeed: {
    latencyMs: number;
    packetLossPct: number;
    bitrateMbps: number;
  };
  attitude: {
    pitchDeg: number;
    rollDeg: number;
    batteryPct: number;
  };
}

const baseNodes: SwarmNode[] = [
  {
    id: "fireant-01",
    callsign: "FIREANT-01",
    x: 22,
    y: 34,
    altitudeM: 2,
    headingDeg: 40,
    batteryPct: 88,
    linkMode: "manet",
    missionState: "screening",
    payloadType: "isr",
    threatScore: 0.42,
    signalQuality: 93,
  },
  {
    id: "fireant-02",
    callsign: "FIREANT-02",
    x: 46,
    y: 28,
    altitudeM: 2,
    headingDeg: 95,
    batteryPct: 79,
    linkMode: "manet",
    missionState: "overwatch",
    payloadType: "ew",
    threatScore: 0.57,
    signalQuality: 89,
  },
  {
    id: "fireant-03",
    callsign: "FIREANT-03",
    x: 62,
    y: 48,
    altitudeM: 2,
    headingDeg: 150,
    batteryPct: 72,
    linkMode: "5g",
    missionState: "screening",
    payloadType: "kinetic",
    threatScore: 0.78,
    signalQuality: 74,
  },
  {
    id: "fireant-04",
    callsign: "FIREANT-04",
    x: 78,
    y: 38,
    altitudeM: 2,
    headingDeg: 250,
    batteryPct: 64,
    linkMode: "5g",
    missionState: "hold",
    payloadType: "isr",
    threatScore: 0.33,
    signalQuality: 82,
  },
  {
    id: "fireant-05",
    callsign: "FIREANT-05",
    x: 88,
    y: 22,
    altitudeM: 2,
    headingDeg: 310,
    batteryPct: 58,
    linkMode: "satcom",
    missionState: "fallback",
    payloadType: "ew",
    threatScore: 0.68,
    signalQuality: 61,
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function makeSeries(tick: number, baseline: number, swing: number, floor: number): number[] {
  return Array.from({ length: 12 }, (_, index) => {
    const value = baseline + Math.sin((tick + index) / 2.2) * swing - index * 0.45;
    return Number(clamp(value, floor, baseline + swing).toFixed(1));
  });
}

function buildSnapshot(tick: number): MissionSnapshot {
  const nodes = baseNodes.map((node, index) => {
    const phase = tick * 0.8 + index * 1.4;
    const linkMode: LinkMode = tick % 5 === 0 && index >= 3 ? "satcom" : tick % 3 === 0 && index >= 2 ? "5g" : "manet";
    return {
      ...node,
      x: Number(clamp(node.x + Math.sin(phase) * 3.4, 10, 94).toFixed(1)),
      y: Number(clamp(node.y + Math.cos(phase / 1.7) * 4.2, 10, 90).toFixed(1)),
      headingDeg: Math.round((node.headingDeg + tick * 9 + index * 17) % 360),
      batteryPct: Number(Math.max(24, node.batteryPct - tick * 0.35 - index * 0.4).toFixed(1)),
      linkMode,
      missionState: tick % 6 === 0 && index === 4 ? "fallback" : node.missionState,
      threatScore: Number(clamp(node.threatScore + Math.sin(phase / 2.3) * 0.14, 0.18, 0.92).toFixed(2)),
      signalQuality: Math.round(clamp(node.signalQuality + Math.cos(phase / 2.1) * 6.5, 42, 98)),
    };
  });

  const throughputSeries = makeSeries(tick, 54, 8, 24);
  const latencySeries = makeSeries(tick, 88, 22, 42);
  const packetLossSeries = Array.from({ length: 12 }, (_, index) => Number((1.2 + Math.abs(Math.sin((tick + index) / 3)) * 2.8).toFixed(1)));

  const actions: KillChainAction[] = [
    {
      id: "action-kinetic-01",
      callsign: nodes[2].callsign,
      targetLabel: "RIDGELINE-17",
      payloadType: "kinetic",
      confidence: Number((0.82 + Math.sin(tick / 5) * 0.05).toFixed(2)),
      status: "pending",
      recommendedEffect: "disable",
      windowSeconds: 34,
    },
    {
      id: "action-ew-02",
      callsign: nodes[1].callsign,
      targetLabel: "REPEATER-ECHO",
      payloadType: "ew",
      confidence: Number((0.74 + Math.cos(tick / 4) * 0.04).toFixed(2)),
      status: "pending",
      recommendedEffect: "jam",
      windowSeconds: 52,
    },
    {
      id: "action-isr-03",
      callsign: nodes[0].callsign,
      targetLabel: "ALLEY-DELTA",
      payloadType: "isr",
      confidence: Number((0.67 + Math.sin(tick / 6) * 0.06).toFixed(2)),
      status: "pending",
      recommendedEffect: "observe",
      windowSeconds: 68,
    },
  ];

  const latestLatency = latencySeries[latencySeries.length - 1];
  const latestThroughput = throughputSeries[throughputSeries.length - 1];

  return {
    nodes,
    actions,
    throughputSeries,
    latencySeries,
    packetLossSeries,
    videoFeed: {
      latencyMs: latestLatency,
      packetLossPct: packetLossSeries[packetLossSeries.length - 1],
      bitrateMbps: Number((latestThroughput / 4.3).toFixed(1)),
    },
    attitude: {
      pitchDeg: Number((Math.sin(tick / 3.4) * 5.8).toFixed(1)),
      rollDeg: Number((Math.cos(tick / 4.6) * 8.4).toFixed(1)),
      batteryPct: nodes[2].batteryPct,
    },
  };
}

export function startMissionStream(onSnapshot: (snapshot: MissionSnapshot) => void): () => void {
  let tick = 0;
  onSnapshot(buildSnapshot(tick));

  const intervalId = window.setInterval(() => {
    tick += 1;
    onSnapshot(buildSnapshot(tick));
  }, 1800);

  return () => window.clearInterval(intervalId);
}
