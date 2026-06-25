export interface GameLoopListener {
  update(deltaMs: number, timeMs: number): void;
}

export class GameLoop {
  private readonly listeners = new Set<GameLoopListener>();

  add(listener: GameLoopListener): void {
    this.listeners.add(listener);
  }

  remove(listener: GameLoopListener): void {
    this.listeners.delete(listener);
  }

  update(deltaMs: number, timeMs: number): void {
    this.listeners.forEach((listener) => listener.update(deltaMs, timeMs));
  }
}
