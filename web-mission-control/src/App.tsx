import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { CommandThrottler, HUDOverlay, TriggerManager, clampPtzVector, createVideoSnapshot, readGamepadState } from "@teleop";

import { startMissionStream } from "./network-services/grpc-web-client";
import { useSwarmStore } from "./state-management/swarmStore";
import { GlobalOverview } from "./views/GlobalOverview";
import { KillChainManager } from "./views/KillChainManager";

export function App() {
  const nodes = useSwarmStore((state) => state.nodes);
  const actions = useSwarmStore((state) => state.actions);
  const throughputSeries = useSwarmStore((state) => state.throughputSeries);
  const latencySeries = useSwarmStore((state) => state.latencySeries);
  const packetLossSeries = useSwarmStore((state) => state.packetLossSeries);
  const videoFeed = useSwarmStore((state) => state.videoFeed);
  const attitude = useSwarmStore((state) => state.attitude);
  const teleopFocusId = useSwarmStore((state) => state.teleopFocusId);
  const applySnapshot = useSwarmStore((state) => state.applySnapshot);
  const decideAction = useSwarmStore((state) => state.decideAction);
  const setTeleopFocus = useSwarmStore((state) => state.setTeleopFocus);

  const [triggerManager] = useState(() => new TriggerManager());
  const [commandThrottler] = useState(() => new CommandThrottler(220));
  const [gamepadState, setGamepadState] = useState(() => readGamepadState());
  const [triggerStatus, setTriggerStatus] = useState(() => triggerManager.getStatus());
  const [commandGateOpen, setCommandGateOpen] = useState(true);

  const deferredActions = useDeferredValue(actions);

  useEffect(() => {
    return startMissionStream((snapshot) => {
      startTransition(() => {
        applySnapshot(snapshot);
      });
    });
  }, [applySnapshot]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setGamepadState(readGamepadState());
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, []);

  const focusedNode = nodes.find((node) => node.id === teleopFocusId) ?? nodes[0] ?? null;
  const videoSnapshot = createVideoSnapshot(videoFeed);
  const ptzVector = focusedNode
    ? clampPtzVector({
        panDeg: focusedNode.headingDeg - 90,
        tiltDeg: focusedNode.threatScore * 32 - 12,
        zoom: focusedNode.signalQuality / 100,
      })
    : clampPtzVector({ panDeg: 0, tiltDeg: 0, zoom: 0.4 });

  function handleDecision(actionId: string, status: "approved" | "denied") {
    const gateOpen = commandThrottler.accept();
    setCommandGateOpen(gateOpen);
    if (!gateOpen) {
      return;
    }

    decideAction(actionId, status);

    const selectedAction = actions.find((action) => action.id === actionId);
    if (status === "approved" && selectedAction?.payloadType === "kinetic") {
      triggerManager.arm("operator-main");
      triggerManager.authorize(actionId);
      setTriggerStatus(triggerManager.getStatus());
      return;
    }

    if (status === "denied") {
      triggerManager.release();
      setTriggerStatus(triggerManager.getStatus());
    }
  }

  function handleSelectNode(nodeId: string) {
    setTeleopFocus(nodeId);
  }

  return (
    <div className="app-shell">
      <header className="command-bar">
        <div>
          <p className="eyebrow">Swarmbotics Operator Frontend</p>
          <h1>Mission Control Console</h1>
        </div>
        <div className="command-bar__metrics">
          <article>
            <span>Nodes Online</span>
            <strong>{nodes.length}</strong>
          </article>
          <article>
            <span>Pending Actions</span>
            <strong>{actions.filter((action) => action.status === "pending").length}</strong>
          </article>
          <article>
            <span>Jump-In Feed</span>
            <strong>{Math.round(videoFeed.latencyMs)} ms</strong>
          </article>
        </div>
      </header>

      <main className="dashboard-layout">
        <section className="dashboard-layout__main">
          <GlobalOverview
            nodes={nodes}
            selectedNodeId={teleopFocusId}
            throughputSeries={throughputSeries}
            latencySeries={latencySeries}
            packetLossSeries={packetLossSeries}
            onSelectNode={handleSelectNode}
          />
          <KillChainManager actions={deferredActions} onApprove={(id) => handleDecision(id, "approved")} onDeny={(id) => handleDecision(id, "denied")} />
        </section>

        <aside className="dashboard-layout__side">
          <section className="panel teleop-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Jump In Module</p>
                <h2>Teleoperation Fallback</h2>
              </div>
              <p className="panel-note">Shared controls from the teleoperation library drive HUD state, input capture, and payload safety locks.</p>
            </div>
            <div className="teleop-stage">
              <div className="teleop-stage__screen">
                <img src="/mission-grid.svg" alt="Tactical grid" className="teleop-stage__grid" />
                <HUDOverlay
                  pitchDeg={attitude.pitchDeg}
                  rollDeg={attitude.rollDeg}
                  batteryPct={focusedNode?.batteryPct ?? attitude.batteryPct}
                  latencyMs={videoFeed.latencyMs}
                  qualityBand={videoSnapshot.qualityBand}
                />
                <div className="teleop-stage__focus">{focusedNode?.callsign ?? "No asset selected"}</div>
              </div>
            </div>
            <div className="teleop-readouts">
              <article>
                <span>Gamepad</span>
                <strong>{gamepadState.connected ? "CONNECTED" : gamepadState.label}</strong>
                <small>
                  THR {gamepadState.throttle.toFixed(2)} // YAW {gamepadState.yaw.toFixed(2)}
                </small>
              </article>
              <article>
                <span>Command Gate</span>
                <strong>{commandGateOpen ? "OPEN" : `WAIT ${commandThrottler.remainingMs()}MS`}</strong>
                <small>Throttle window prevents degraded-link input flooding.</small>
              </article>
              <article>
                <span>Payload Safety</span>
                <strong>{triggerStatus.safetyLock ? "LOCKED" : "ARMED"}</strong>
                <small>{triggerStatus.authorizationToken ?? "Awaiting operator authorization token"}</small>
              </article>
              <article>
                <span>PTZ Vector</span>
                <strong>
                  {Math.round(ptzVector.panDeg)} / {Math.round(ptzVector.tiltDeg)} / {(ptzVector.zoom * 100).toFixed(0)}
                </strong>
                <small>PAN / TILT / ZOOM envelope</small>
              </article>
            </div>
          </section>

          <section className="panel side-brief">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Field Bridge</p>
                <h2>ATAK Surface</h2>
              </div>
            </div>
            <ul>
              <li>CoT translation for field telemetry and threat remarks</li>
              <li>Quick radial tasking for defend, reposition, and observe actions</li>
              <li>PiP ISR feed layout staged for low-distraction field use</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
