export interface GamepadState {
  connected: boolean;
  label: string;
  throttle: number;
  yaw: number;
  primaryPressed: boolean;
}

export function readGamepadState(): GamepadState {
  if (typeof navigator === "undefined" || typeof navigator.getGamepads !== "function") {
    return {
      connected: false,
      label: "SIMULATED INPUT",
      throttle: 0.18,
      yaw: -0.06,
      primaryPressed: false,
    };
  }

  const pad = Array.from(navigator.getGamepads()).find((candidate) => candidate !== null);
  if (!pad) {
    return {
      connected: false,
      label: "NO CONTROLLER",
      throttle: 0,
      yaw: 0,
      primaryPressed: false,
    };
  }

  return {
    connected: true,
    label: pad.id,
    throttle: pad.axes[1] ?? 0,
    yaw: pad.axes[2] ?? 0,
    primaryPressed: Boolean(pad.buttons[0]?.pressed),
  };
}
