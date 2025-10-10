'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentSession } from '@/lib/session';
import { followEvents, FOLLOW_EVENTS } from '@/lib/follow-events';

interface FollowButtonProps {
  studentId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FollowButton({ 
  studentId, 
  className, 
  variant = 'default',
  size = 'default'
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const session = getStudentSession();
        if (!session) {
          console.error('No student session found');
          setIsCheckingStatus(false);
          return;
        }

        const response = await fetch(`/api/students/${studentId}/follow`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.id}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error('Error checking follow status:', error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [studentId]);

  const handleFollow = async () => {
    try {
      const session = getStudentSession();
      if (!session) {
        toast.error('Please log in to follow students');
        return;
      }

      setIsLoading(true);
      const method = isFollowing ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/students/${studentId}/follow`, {
        method,
        headers: {
          'Authorization': `Bearer ${session.id}`,
        },
      });

      if (response.ok) {
        const newFollowState = !isFollowing;
        setIsFollowing(newFollowState);
        
        // Emit event for real-time updates
        followEvents.emit(FOLLOW_EVENTS.FOLLOW_CHANGED, {
          studentId,
          isFollowing: newFollowState,
          followerId: session.studentId
        });
        
        toast.success(newFollowState ? 'Following student!' : 'Unfollowed student');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update follow status');
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        disabled
      >
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : variant}
      size={size}
      className={className}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Unfollow
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Follow
        </>
      )}
    </Button>
  );
}