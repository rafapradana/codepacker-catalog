'use client';

// Event system for real-time follow updates
class FollowEventEmitter {
  private listeners: { [key: string]: ((data: any) => void)[] } = {};

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: (data: any) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

export const followEvents = new FollowEventEmitter();

// Event types
export const FOLLOW_EVENTS = {
  FOLLOW_CHANGED: 'follow_changed',
} as const;

export interface FollowChangedData {
  studentId: string;
  isFollowing: boolean;
  followerId: string;
}