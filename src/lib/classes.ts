import { db } from '@/lib/db';
import { classes } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface Class {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getClasses(): Promise<Class[]> {
  try {
    const result = await db.select().from(classes);
    return result;
  } catch (error) {
    console.error('Error fetching classes:', error);
    return [];
  }
}

export async function getClassById(id: string): Promise<Class | null> {
  try {
    const result = await db.select().from(classes).where(eq(classes.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching class by id:', error);
    return null;
  }
}

export async function createClass(name: string): Promise<Class | null> {
  try {
    const result = await db.insert(classes).values({
      name,
    }).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error creating class:', error);
    return null;
  }
}

export async function updateClass(id: string, name: string): Promise<Class | null> {
  try {
    const result = await db.update(classes)
      .set({ 
        name,
        updatedAt: new Date()
      })
      .where(eq(classes.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error updating class:', error);
    return null;
  }
}

export async function deleteClass(id: string): Promise<boolean> {
  try {
    await db.delete(classes).where(eq(classes.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting class:', error);
    return false;
  }
}