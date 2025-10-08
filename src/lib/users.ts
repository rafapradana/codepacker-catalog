import bcrypt from 'bcryptjs';
import { db } from './db';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

export async function createUser(userData: CreateUserData): Promise<User> {
  try {
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Insert user into database
    const [newUser] = await db
      .insert(users)
      .values({
        username: userData.username,
        email: userData.email,
        passwordHash,
        role: userData.role,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
      });

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
      })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  password?: string;
}

export async function updateUser(id: string, userData: UpdateUserData): Promise<User | null> {
  try {
    const updateData: any = {
      updatedAt: new Date()
    };

    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.email !== undefined) updateData.email = userData.email;
    
    // Hash password if provided
    if (userData.password !== undefined && userData.password.trim()) {
      const saltRounds = 12;
      updateData.passwordHash = await bcrypt.hash(userData.password, saltRounds);
    }

    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLogin: users.lastLogin,
      });

    return updatedUser || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}