interface TelemetryGraphProps {
  title: string;
  values: number[];
  color: string;
  unit: string;
}

export function TelemetryGraph(props: TelemetryGraphProps) {
  const max = Math.max(...props.values, 1);
  const min = Math.min(...props.values, 0);
  const range = Math.max(1, max - min);
  const points = props.values
    .map((value, index) => {
      const x = props.values.length === 1 ? 0 : (index / (props.values.length - 1)) * 100;
      const y = 34 - ((value - min) / range) * 26;
      return `${x},${y}`;
    })
    .join(" ");

  const latest = props.values[props.values.length - 1] ?? 0;

  return (
    <div className="telemetry-graph panel-shell">
      <div className="telemetry-graph__meta">
        <span>{props.title}</span>
        <strong>
          {latest}
          {props.unit}
        </strong>
      </div>
      <svg viewBox="0 0 100 38" preserveAspectRatio="none" aria-label={props.title}>
        <polyline points="0,34 100,34" fill="none" stroke="#2B3533" strokeWidth="0.6" />
        <polyline points={points} fill="none" stroke={props.color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
