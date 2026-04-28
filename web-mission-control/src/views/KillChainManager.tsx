import type { KillChainAction } from "../network-services/grpc-web-client";

interface KillChainManagerProps {
  actions: KillChainAction[];
  onApprove: (actionId: string) => void;
  onDeny: (actionId: string) => void;
}

export function KillChainManager(props: KillChainManagerProps) {
  return (
    <section className="panel command-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Operator Approval</p>
          <h2>Kill Chain Manager</h2>
        </div>
        <p className="panel-note">Pending actions are held until an operator explicitly approves or denies the effect window.</p>
      </div>
      <div className="action-list">
        {props.actions.map((action) => (
          <article key={action.id} className={`action-card action-card--${action.status}`}>
            <div className="action-card__header">
              <div>
                <strong>{action.callsign}</strong>
                <span>{action.targetLabel}</span>
              </div>
              <span className="action-card__status">{action.status}</span>
            </div>
            <dl>
              <div>
                <dt>Effect</dt>
                <dd>{action.recommendedEffect}</dd>
              </div>
              <div>
                <dt>Payload</dt>
                <dd>{action.payloadType}</dd>
              </div>
              <div>
                <dt>Confidence</dt>
                <dd>{Math.round(action.confidence * 100)}%</dd>
              </div>
              <div>
                <dt>Window</dt>
                <dd>{action.windowSeconds}s</dd>
              </div>
            </dl>
            <div className="action-card__controls">
              <button type="button" onClick={() => props.onApprove(action.id)} disabled={action.status !== "pending"}>
                Approve
              </button>
              <button type="button" className="button-secondary" onClick={() => props.onDeny(action.id)} disabled={action.status !== "pending"}>
                Deny
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
