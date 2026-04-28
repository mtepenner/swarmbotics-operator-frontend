export class CommandThrottler {
  private lastAcceptedAt = 0;

  constructor(private readonly minIntervalMs: number) {}

  accept(now = Date.now()): boolean {
    if (now - this.lastAcceptedAt < this.minIntervalMs) {
      return false;
    }

    this.lastAcceptedAt = now;
    return true;
  }

  remainingMs(now = Date.now()): number {
    return Math.max(0, this.minIntervalMs - (now - this.lastAcceptedAt));
  }
}
