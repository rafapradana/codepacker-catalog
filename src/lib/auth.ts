import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, admins } from './schema';
import { eq, and } from 'drizzle-orm';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

export async function authenticateAdmin(credentials: LoginCredentials): Promise<AdminUser | null> {
  try {
    // Find user by username and role
    const user = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        passwordHash: users.passwordHash,
        role: users.role,
      })
      .from(users)
      .where(and(
        eq(users.username, credentials.username),
        eq(users.role, 'admin')
      ))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    const foundUser = user[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.passwordHash);
    
    if (!isPasswordValid) {
      return null;
    }

    // Get admin details
    const adminDetails = await db
      .select({
        fullName: admins.fullName,
      })
      .from(admins)
      .where(eq(admins.userId, foundUser.id))
      .limit(1);

    if (adminDetails.length === 0) {
      return null;
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, foundUser.id));

    return {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      fullName: adminDetails[0].fullName,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}