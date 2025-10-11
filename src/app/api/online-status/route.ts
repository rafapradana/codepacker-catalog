import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq, inArray } from 'drizzle-orm'

// Update user online status
export async function POST(request: NextRequest) {
  try {
    const { userId, isOnline } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await db
      .update(users)
      .set({ 
        isOnline: isOnline,
        lastSeen: new Date() 
      })
      .where(eq(users.id, userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update user online status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Get user(s) online status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const userIds = searchParams.get('userIds')

    if (userIds) {
      // Get multiple users status
      const userIdArray = userIds.split(',')
      const usersStatus = await db
        .select({ id: users.id, isOnline: users.isOnline })
        .from(users)
        .where(inArray(users.id, userIdArray))
      
      const statusMap: Record<string, boolean> = {}
      usersStatus.forEach(user => {
        statusMap[user.id] = user.isOnline
      })
      
      return NextResponse.json(statusMap)
    } else if (userId) {
      // Get single user status
      const user = await db
        .select({ isOnline: users.isOnline })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
      
      return NextResponse.json({ isOnline: user[0]?.isOnline || false })
    } else {
      return NextResponse.json({ error: 'User ID(s) required' }, { status: 400 })
    }
  } catch (error) {
    console.error('Failed to get user online status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}