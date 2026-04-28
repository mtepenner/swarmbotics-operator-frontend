export interface PtzVector {
  panDeg: number;
  tiltDeg: number;
  zoom: number;
}

export function clampPtzVector(vector: PtzVector): PtzVector {
  return {
    panDeg: Math.max(-180, Math.min(180, vector.panDeg)),
    tiltDeg: Math.max(-45, Math.min(60, vector.tiltDeg)),
    zoom: Math.max(0, Math.min(1, vector.zoom)),
  };
}
