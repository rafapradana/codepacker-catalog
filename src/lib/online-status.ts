"use client"

export class OnlineStatusManager {
  private static instance: OnlineStatusManager
  private heartbeatInterval: NodeJS.Timeout | null = null
  private userId: string | null = null
  private listeners: Set<(userId: string, isOnline: boolean) => void> = new Set()

  private constructor() {}

  static getInstance(): OnlineStatusManager {
    if (!OnlineStatusManager.instance) {
      OnlineStatusManager.instance = new OnlineStatusManager()
    }
    return OnlineStatusManager.instance
  }

  // Initialize online status tracking for a user
  async initializeUser(userId: string) {
    this.userId = userId
    await this.setUserOnline(userId)
    this.startHeartbeat()
    
    // Set user offline when page is about to unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.setUserOffline(userId)
      })
      
      // Handle visibility change (tab switching, minimizing)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.setUserOffline(userId)
        } else {
          this.setUserOnline(userId)
        }
      })
    }
  }

  // Set user as online
  private async setUserOnline(userId: string) {
    try {
      const response = await fetch('/api/online-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isOnline: true }),
      })
      
      if (response.ok) {
        this.notifyListeners(userId, true)
      }
    } catch (error) {
      console.error('Failed to set user online:', error)
    }
  }

  // Set user as offline
  private async setUserOffline(userId: string) {
    try {
      const response = await fetch('/api/online-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isOnline: false }),
      })
      
      if (response.ok) {
        this.notifyListeners(userId, false)
      }
    } catch (error) {
      console.error('Failed to set user offline:', error)
    }
  }

  // Start heartbeat to keep user online
  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.userId && !document.hidden) {
        this.setUserOnline(this.userId)
      }
    }, 30000) // Update every 30 seconds
  }

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
    
    if (this.userId) {
      this.setUserOffline(this.userId)
    }
  }

  // Add listener for online status changes
  addListener(callback: (userId: string, isOnline: boolean) => void) {
    this.listeners.add(callback)
  }

  // Remove listener
  removeListener(callback: (userId: string, isOnline: boolean) => void) {
    this.listeners.delete(callback)
  }

  // Notify all listeners of status change
  private notifyListeners(userId: string, isOnline: boolean) {
    this.listeners.forEach(callback => callback(userId, isOnline))
  }

  // Get user online status
  async getUserOnlineStatus(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/online-status?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        return data.isOnline || false
      }
      return false
    } catch (error) {
      console.error('Failed to get user online status:', error)
      return false
    }
  }

  // Get multiple users online status
  async getMultipleUsersOnlineStatus(userIds: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await fetch(`/api/online-status?userIds=${userIds.join(',')}`)
      if (response.ok) {
        const data = await response.json()
        return data
      }
      return {}
    } catch (error) {
      console.error('Failed to get multiple users online status:', error)
      return {}
    }
  }
}

// Export singleton instance
export const onlineStatusManager = OnlineStatusManager.getInstance()