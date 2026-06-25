import type { EngineEventMap, EventHandler } from '../types/events';

export class EventBus<TEvents extends object = EngineEventMap> {
  private readonly listeners = new Map<keyof TEvents, Set<EventHandler<TEvents[keyof TEvents]>>>();

  on<TKey extends keyof TEvents>(eventName: TKey, handler: EventHandler<TEvents[TKey]>): () => void {
    const handlers = this.getHandlers(eventName);
    handlers.add(handler as EventHandler<TEvents[keyof TEvents]>);
    return () => this.off(eventName, handler);
  }

  off<TKey extends keyof TEvents>(eventName: TKey, handler: EventHandler<TEvents[TKey]>): void {
    this.listeners.get(eventName)?.delete(handler as EventHandler<TEvents[keyof TEvents]>);
  }

  emit<TKey extends keyof TEvents>(eventName: TKey, payload: TEvents[TKey]): void {
    this.listeners.get(eventName)?.forEach((handler) => handler(payload));
  }

  clear(): void {
    this.listeners.clear();
  }

  private getHandlers<TKey extends keyof TEvents>(
    eventName: TKey,
  ): Set<EventHandler<TEvents[keyof TEvents]>> {
    let handlers = this.listeners.get(eventName);
    if (!handlers) {
      handlers = new Set<EventHandler<TEvents[keyof TEvents]>>();
      this.listeners.set(eventName, handlers);
    }
    return handlers;
  }
}
