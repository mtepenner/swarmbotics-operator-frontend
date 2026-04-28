export interface TriggerStatus {
  safetyLock: boolean;
  armedBy: string | null;
  authorizationToken: string | null;
}

export class TriggerManager {
  private state: TriggerStatus = {
    safetyLock: true,
    armedBy: null,
    authorizationToken: null,
  };

  arm(operatorId: string): TriggerStatus {
    this.state = {
      safetyLock: false,
      armedBy: operatorId,
      authorizationToken: this.state.authorizationToken,
    };
    return this.getStatus();
  }

  authorize(token: string): TriggerStatus {
    if (this.state.safetyLock) {
      return this.getStatus();
    }

    this.state = {
      ...this.state,
      authorizationToken: token,
    };
    return this.getStatus();
  }

  release(): TriggerStatus {
    this.state = {
      safetyLock: true,
      armedBy: null,
      authorizationToken: null,
    };
    return this.getStatus();
  }

  getStatus(): TriggerStatus {
    return { ...this.state };
  }
}
