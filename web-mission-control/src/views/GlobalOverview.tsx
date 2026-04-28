import { BattlespaceMap } from "../components/map-engine/BattlespaceMap";
import { TelemetryGraph } from "../components/telemetry-graphs/TelemetryGraph";
import type { SwarmNode } from "../network-services/grpc-web-client";

interface GlobalOverviewProps {
  nodes: SwarmNode[];
  selectedNodeId: string | null;
  throughputSeries: number[];
  latencySeries: number[];
  packetLossSeries: number[];
  onSelectNode: (nodeId: string) => void;
}

export function GlobalOverview(props: GlobalOverviewProps) {
  const selected = props.nodes.find((node) => node.id === props.selectedNodeId) ?? props.nodes[0];
  const activeNodes = props.nodes.filter((node) => node.missionState !== "fallback").length;
  const highThreatNodes = props.nodes.filter((node) => node.threatScore > 0.65).length;

  return (
    <section className="panel command-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Web Mission Control</p>
          <h2>Global Overview</h2>
        </div>
        <p className="panel-note">Streaming 3 mission corridors, 5 active assets, and real-time kill-chain escalations.</p>
      </div>
      <div className="overview-stats">
        <article>
          <span>Active Nodes</span>
          <strong>{activeNodes}</strong>
        </article>
        <article>
          <span>Threat Cells</span>
          <strong>{highThreatNodes}</strong>
        </article>
        <article>
          <span>Selected Link</span>
          <strong>{selected?.linkMode.toUpperCase() ?? "N/A"}</strong>
        </article>
      </div>
      <div className="overview-grid">
        <BattlespaceMap nodes={props.nodes} selectedNodeId={props.selectedNodeId} onSelectNode={props.onSelectNode} />
        <div className="overview-side">
          <div className="selected-node panel-shell">
            <span className="eyebrow">Focused Asset</span>
            <h3>{selected?.callsign ?? "Awaiting stream"}</h3>
            <dl>
              <div>
                <dt>Mission</dt>
                <dd>{selected?.missionState ?? "unknown"}</dd>
              </div>
              <div>
                <dt>Payload</dt>
                <dd>{selected?.payloadType ?? "unknown"}</dd>
              </div>
              <div>
                <dt>Battery</dt>
                <dd>{selected ? `${Math.round(selected.batteryPct)}%` : "--"}</dd>
              </div>
              <div>
                <dt>Signal</dt>
                <dd>{selected ? `${selected.signalQuality}%` : "--"}</dd>
              </div>
            </dl>
          </div>
          <TelemetryGraph title="Throughput" values={props.throughputSeries} color="#D4AC6F" unit="mbps" />
          <TelemetryGraph title="Latency" values={props.latencySeries} color="#F28B3C" unit="ms" />
          <TelemetryGraph title="Packet Loss" values={props.packetLossSeries} color="#7E9A53" unit="%" />
        </div>
      </div>
    </section>
  );
}
