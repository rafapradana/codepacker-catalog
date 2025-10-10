'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { followEvents, FOLLOW_EVENTS } from '@/lib/follow-events';

interface FollowStatsProps {
  studentId: string;
  className?: string;
}

interface Stats {
  followersCount: number;
  followingCount: number;
}

export function FollowStats({ studentId, className }: FollowStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching follow stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [studentId]);

  // Listen for follow events to update stats in real-time
  useEffect(() => {
    const handleFollowChanged = (data: any) => {
      // If this student was followed/unfollowed, update their follower count
      if (data.studentId === studentId) {
        setStats(prevStats => {
          if (!prevStats) return prevStats;
          return {
            ...prevStats,
            followersCount: data.isFollowing 
              ? prevStats.followersCount + 1 
              : prevStats.followersCount - 1
          };
        });
      }
      // If this student followed/unfollowed someone else, update their following count
      if (data.followerId === studentId) {
        setStats(prevStats => {
          if (!prevStats) return prevStats;
          return {
            ...prevStats,
            followingCount: data.isFollowing 
              ? prevStats.followingCount + 1 
              : prevStats.followingCount - 1
          };
        });
      }
    };

    followEvents.on(FOLLOW_EVENTS.FOLLOW_CHANGED, handleFollowChanged);

    return () => {
      followEvents.off(FOLLOW_EVENTS.FOLLOW_CHANGED, handleFollowChanged);
    };
  }, [studentId]);

  if (isLoading) {
    return (
      <div className={`flex gap-8 ${className}`}>
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="text-center">
          <Skeleton className="h-6 w-8 mx-auto mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <>
      <div className="text-center">
        <div className="font-semibold text-lg text-foreground">{stats.followersCount}</div>
        <div className="text-sm text-muted-foreground">followers</div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-lg text-foreground">{stats.followingCount}</div>
        <div className="text-sm text-muted-foreground">following</div>
      </div>
    </>
  );
}