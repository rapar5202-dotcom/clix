
export type RealtimeEventType = 'NEW_POST' | 'LIKE_UPDATE' | 'REPOST_UPDATE' | 'NOTIFICATION';

interface RealtimeEvent {
  type: RealtimeEventType;
  payload: any;
  timestamp: number;
}

class RealtimeEngine {
  private channel: BroadcastChannel;
  private listeners: Set<(event: RealtimeEvent) => void> = new Set();

  constructor() {
    this.channel = new BroadcastChannel('clix_realtime_sync');
    this.channel.onmessage = (event) => {
      this.notifyListeners(event.data);
    };
  }

  private notifyListeners(event: RealtimeEvent) {
    this.listeners.forEach(listener => listener(event));
  }

  subscribe(callback: (event: RealtimeEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  broadcast(type: RealtimeEventType, payload: any) {
    const event: RealtimeEvent = {
      type,
      payload,
      timestamp: Date.now(),
    };
    // Send to other tabs
    this.channel.postMessage(event);
    // Notify local listeners
    this.notifyListeners(event);
  }
}

export const realtime = new RealtimeEngine();
