"use client"

import { useState, useEffect, useCallback } from 'react'
import { onlineStatusManager } from '@/lib/online-status'

export function useOnlineStatus(userId?: string) {
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Initialize online status tracking for current user
  const initializeOnlineStatus = useCallback(async (currentUserId: string) => {
    try {
      await onlineStatusManager.initializeUser(currentUserId)
    } catch (error) {
      console.error('Failed to initialize online status:', error)
    }
  }, [])

  // Get online status for a specific user
  const getUserOnlineStatus = useCallback(async (targetUserId: string) => {
    try {
      setIsLoading(true)
      const status = await onlineStatusManager.getUserOnlineStatus(targetUserId)
      setIsOnline(status)
    } catch (error) {
      console.error('Failed to get user online status:', error)
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (userId) {
      getUserOnlineStatus(userId)
      
      // Listen for status changes
      const handleStatusChange = (changedUserId: string, online: boolean) => {
        if (changedUserId === userId) {
          setIsOnline(online)
        }
      }
      
      onlineStatusManager.addListener(handleStatusChange)
      
      return () => {
        onlineStatusManager.removeListener(handleStatusChange)
      }
    }
  }, [userId, getUserOnlineStatus])

  return {
    isOnline,
    isLoading,
    initializeOnlineStatus,
    getUserOnlineStatus
  }
}

export function useMultipleOnlineStatus(userIds: string[]) {
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const getMultipleOnlineStatuses = useCallback(async () => {
    if (userIds.length === 0) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      const statuses = await onlineStatusManager.getMultipleUsersOnlineStatus(userIds)
      setOnlineStatuses(statuses)
    } catch (error) {
      console.error('Failed to get multiple online statuses:', error)
      setOnlineStatuses({})
    } finally {
      setIsLoading(false)
    }
  }, [userIds])

  useEffect(() => {
    getMultipleOnlineStatuses()
    
    // Listen for status changes
    const handleStatusChange = (changedUserId: string, online: boolean) => {
      if (userIds.includes(changedUserId)) {
        setOnlineStatuses(prev => ({
          ...prev,
          [changedUserId]: online
        }))
      }
    }
    
    onlineStatusManager.addListener(handleStatusChange)
    
    return () => {
      onlineStatusManager.removeListener(handleStatusChange)
    }
  }, [userIds, getMultipleOnlineStatuses])

  return {
    onlineStatuses,
    isLoading,
    refreshStatuses: getMultipleOnlineStatuses
  }
}