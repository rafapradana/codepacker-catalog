"use client"

import { cn } from "@/lib/utils"
import { useOnlineStatus } from "@/hooks/use-online-status"

interface OnlineStatusDotProps {
  userId: string
  size?: "sm" | "md" | "lg"
  className?: string
  showOffline?: boolean
}

export function OnlineStatusDot({ 
  userId, 
  size = "md", 
  className,
  showOffline = false 
}: OnlineStatusDotProps) {
  const { isOnline, isLoading } = useOnlineStatus(userId)

  if (isLoading) {
    return null
  }

  if (!isOnline && !showOffline) {
    return null
  }

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-6 h-6"
  }

  const borderSizeClasses = {
    sm: "border-2",
    md: "border-2",
    lg: "border-[3px]"
  }

  return (
    <div
      className={cn(
        "absolute rounded-full border-white",
        sizeClasses[size],
        borderSizeClasses[size],
        isOnline ? "bg-green-500" : "bg-gray-400",
        className
      )}
      title={isOnline ? "Online" : "Offline"}
    />
  )
}

interface ProfileWithOnlineStatusProps {
  userId: string
  children: React.ReactNode
  dotSize?: "sm" | "md" | "lg"
  dotPosition?: "top-right" | "bottom-right" | "top-left" | "bottom-left"
  className?: string
  showOffline?: boolean
}

export function ProfileWithOnlineStatus({
  userId,
  children,
  dotSize = "md",
  dotPosition = "bottom-right",
  className,
  showOffline = false
}: ProfileWithOnlineStatusProps) {
  const positionClasses = {
    "top-right": "-top-1 -right-1",
    "bottom-right": "-bottom-1 -right-1", 
    "top-left": "-top-1 -left-1",
    "bottom-left": "-bottom-1 -left-1"
  }

  return (
    <div className={cn("relative inline-block", className)}>
      {children}
      <OnlineStatusDot
        userId={userId}
        size={dotSize}
        showOffline={showOffline}
        className={positionClasses[dotPosition]}
      />
    </div>
  )
}