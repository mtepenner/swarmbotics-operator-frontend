import type { SwarmNode } from "../../network-services/grpc-web-client";

interface BattlespaceMapProps {
  nodes: SwarmNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export function BattlespaceMap(props: BattlespaceMapProps) {
  const threatNodes = props.nodes.filter((node) => node.threatScore > 0.65);

  return (
    <div className="battlespace-map panel-shell">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Swarm battlespace overview">
        <defs>
          <linearGradient id="gridGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D4AC6F" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7E9A53" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" rx="4" fill="#101817" />
        {Array.from({ length: 9 }, (_, index) => index + 1).map((line) => (
          <g key={line} opacity="0.18">
            <line x1={line * 10} y1="0" x2={line * 10} y2="100" stroke="url(#gridGlow)" strokeWidth="0.25" />
            <line x1="0" y1={line * 10} x2="100" y2={line * 10} stroke="url(#gridGlow)" strokeWidth="0.25" />
          </g>
        ))}
        <path d="M4 18 C24 8 42 8 70 20 S94 30 98 24" stroke="#D4AC6F" strokeWidth="0.8" opacity="0.45" fill="none" />
        <path d="M6 82 C26 70 44 62 90 84" stroke="#7E9A53" strokeWidth="0.8" opacity="0.45" fill="none" />
        {threatNodes.map((node) => (
          <polygon
            key={`${node.id}-threat`}
            points={`${node.x - 5},${node.y - 2} ${node.x + 3},${node.y - 7} ${node.x + 8},${node.y + 1} ${node.x + 1},${node.y + 7} ${node.x - 6},${node.y + 4}`}
            fill="#F28B3C"
            opacity="0.12"
            stroke="#F28B3C"
            strokeWidth="0.3"
          />
        ))}
        {props.nodes.map((node) => {
          const selected = node.id === props.selectedNodeId;
          return (
            <g key={node.id} onClick={() => props.onSelectNode(node.id)} className="map-node-group">
              <circle
                cx={node.x}
                cy={node.y}
                r={selected ? 3.7 : 2.6}
                fill={selected ? "#F6EBD9" : "#7E9A53"}
                stroke={selected ? "#F28B3C" : "#C9A574"}
                strokeWidth={selected ? 0.8 : 0.4}
              />
              <line
                x1={node.x}
                y1={node.y}
                x2={node.x + Math.cos((node.headingDeg * Math.PI) / 180) * 5}
                y2={node.y + Math.sin((node.headingDeg * Math.PI) / 180) * 5}
                stroke="#F6EBD9"
                strokeWidth="0.35"
              />
              <text x={node.x + 2.4} y={node.y - 3} fill="#E9E1D3" fontSize="2.3">
                {node.callsign}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
