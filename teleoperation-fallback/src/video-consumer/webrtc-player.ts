export interface VideoFeedTelemetry {
  latencyMs: number;
  packetLossPct: number;
  bitrateMbps: number;
}

export interface VideoSnapshot {
  qualityBand: "clear" | "watch" | "constrained";
  frameTimeMs: number;
  statusLabel: string;
}

export function createVideoSnapshot(telemetry: VideoFeedTelemetry): VideoSnapshot {
  if (telemetry.latencyMs < 90 && telemetry.packetLossPct < 2.5) {
    return {
      qualityBand: "clear",
      frameTimeMs: 16,
      statusLabel: "mission-ready",
    };
  }

  if (telemetry.latencyMs < 140 && telemetry.packetLossPct < 5.0) {
    return {
      qualityBand: "watch",
      frameTimeMs: 24,
      statusLabel: "operator caution",
    };
  }

  return {
    qualityBand: "constrained",
    frameTimeMs: 32,
    statusLabel: "degraded link",
  };
}
