/** 管理所有 Message 計時器的 singleton controller。hover 任一 Message 時暫停所有。 */
export class MessageTimerController {
  private readonly timers = new Map<
    string,
    { pause: () => void; resume: () => void }
  >();
  private isPaused = false;

  register(
    key: string,
    callbacks: { pause: () => void; resume: () => void },
  ): void {
    this.timers.set(key, callbacks);
  }

  unregister(key: string): void {
    this.timers.delete(key);
  }

  pause(): void {
    if (this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.timers.forEach((t) => t.pause());
  }

  resume(): void {
    if (!this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.timers.forEach((t) => t.resume());
  }
}

export const messageTimerController = new MessageTimerController();
