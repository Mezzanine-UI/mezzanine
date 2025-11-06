import { Key } from 'react';

class MessageTimerController {
  private isPaused = false;

  private timers = new Map<
    Key,
    {
      pause: () => void;
      resume: () => void;
    }
  >();

  pause() {
    if (this.isPaused) return;

    this.isPaused = true;
    this.timers.forEach((timer) => timer.pause());
  }

  register(
    key: Key,
    callbacks: {
      pause: () => void;
      resume: () => void;
    },
  ) {
    this.timers.set(key, callbacks);
  }

  resume() {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.timers.forEach((timer) => timer.resume());
  }

  unregister(key: Key) {
    this.timers.delete(key);
  }
}

export const messageTimerController = new MessageTimerController();
