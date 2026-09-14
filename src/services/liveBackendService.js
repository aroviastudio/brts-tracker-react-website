import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://itinnrnvjwwhstnwomki.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0aW5ucm52and3aHN0bndvbWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTA1MDEsImV4cCI6MjEwNDkyNjUwMX0.FEphwrQL38rskt7t_-n4ZkippCDMPjlAMAoVllRryhM';

class LiveBackendService {
  constructor() {
    this.client = null;
    this.channel = null;
    this.routeId = null;
    this.isInitialized = false;

    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      this.isInitialized = true;
    }
  }

  subscribeToRoute(routeId, onTelemetryReceived) {
    if (!this.isInitialized) return;
    
    if (this.channel) {
      this.client.removeChannel(this.channel);
    }

    this.routeId = routeId;
    this.channel = this.client.channel(`route:${routeId}`);

    this.channel
      .on('broadcast', { event: 'telemetry' }, (payload) => {
        if (onTelemetryReceived) {
          onTelemetryReceived(payload.payload);
        }
      })
      .subscribe();
      
    console.log(`📡 Subscribed to live cloud channel: route:${routeId}`);
  }

  broadcastTelemetry(routeId, telemetryData) {
    if (!this.isInitialized || !this.channel) return;
    
    if (this.routeId !== routeId) {
       this.subscribeToRoute(routeId, () => {});
    }

    this.channel.send({
      type: 'broadcast',
      event: 'telemetry',
      payload: {
        ...telemetryData,
        timestamp: Date.now(),
        sessionId: this._getSessionId() 
      },
    });
  }

  stopListening() {
    if (this.channel) {
      this.client.removeChannel(this.channel);
      this.channel = null;
      this.routeId = null;
    }
  }
  
  _getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'sess_' + Math.random().toString(36).substring(2, 9);
    }
    return this.sessionId;
  }
}

export const liveBackend = new LiveBackendService();
