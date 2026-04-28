export interface HUDOverlayProps {
  pitchDeg: number;
  rollDeg: number;
  batteryPct: number;
  latencyMs: number;
  qualityBand: string;
}

export function HUDOverlay(props: HUDOverlayProps) {
  return (
    <div className="hud-overlay">
      <div className="hud-overlay__row">
        <span>PITCH {props.pitchDeg.toFixed(1)} DEG</span>
        <span>ROLL {props.rollDeg.toFixed(1)} DEG</span>
      </div>
      <div className="hud-overlay__row">
        <span>BAT {Math.round(props.batteryPct)}%</span>
        <span>LAT {Math.round(props.latencyMs)} MS</span>
      </div>
      <div className="hud-overlay__quality">LINK {props.qualityBand.toUpperCase()}</div>
    </div>
  );
}
