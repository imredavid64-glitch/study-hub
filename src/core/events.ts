import type { FeatureEvent } from './types.js';

type EventHandler = (event: FeatureEvent) => void | Promise<void>;

class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private globalHandlers: Set<EventHandler> = new Set();
  private eventLog: FeatureEvent[] = [];
  private maxLogSize = 1000;

  on(eventType: FeatureEvent['type'], handler: EventHandler): () => void {
    const key = eventType;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key)!.add(handler);
    return () => this.off(key, handler);
  }

  onAny(handler: EventHandler): () => void {
    this.globalHandlers.add(handler);
    return () => this.globalHandlers.delete(handler);
  }

  off(eventType: string, handler: EventHandler): void {
    this.handlers.get(eventType)?.delete(handler);
  }

  emit(event: FeatureEvent): void {
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    const handlers = this.handlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          const result = handler(event);
          if (result instanceof Promise) {
            result.catch(err => console.error(`Event handler error for ${event.type}:`, err));
          }
        } catch (err) {
          console.error(`Event handler error for ${event.type}:`, err);
        }
      });
    }

    this.globalHandlers.forEach(handler => {
      try {
        const result = handler(event);
        if (result instanceof Promise) {
          result.catch(err => console.error(`Global event handler error:`, err));
        }
      } catch (err) {
        console.error(`Global event handler error:`, err);
      }
    });
  }

  getEventLog(): FeatureEvent[] {
    return [...this.eventLog];
  }

  clearLog(): void {
    this.eventLog = [];
  }
}

export const eventBus = new EventBus();

export function emitEvent(event: FeatureEvent): void {
  eventBus.emit(event);
}

export function onEvent(eventType: FeatureEvent['type'], handler: EventHandler): () => void {
  return eventBus.on(eventType, handler);
}

export function onAnyEvent(handler: EventHandler): () => void {
  return eventBus.onAny(handler);
}

export function createEvent<T extends FeatureEvent['type']>(
  type: T,
  payload: Extract<FeatureEvent, { type: T }>['payload']
): FeatureEvent {
  return { type, payload } as FeatureEvent;
}