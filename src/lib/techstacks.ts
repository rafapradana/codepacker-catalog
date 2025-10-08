import { db } from '@/lib/db';
import { techstacks } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface TechStack {
  id: string;
  name: string;
  iconUrl: string | null;
  bgHex: string;
  borderHex: string;
  textHex: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTechStackData {
  name: string;
  iconUrl?: string | null;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export interface UpdateTechStackData {
  name?: string;
  iconUrl?: string | null;
  bgHex?: string;
  borderHex?: string;
  textHex?: string;
}

export async function getTechStacks(): Promise<TechStack[]> {
  try {
    const result = await db.select().from(techstacks);
    return result;
  } catch (error) {
    console.error('Error fetching tech stacks:', error);
    return [];
  }
}

export async function getTechStackById(id: string): Promise<TechStack | null> {
  try {
    const result = await db.select().from(techstacks).where(eq(techstacks.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching tech stack by id:', error);
    return null;
  }
}

export async function createTechStack(data: CreateTechStackData): Promise<TechStack | null> {
  try {
    const result = await db.insert(techstacks).values({
      name: data.name,
      iconUrl: data.iconUrl || null,
      bgHex: data.bgHex,
      borderHex: data.borderHex,
      textHex: data.textHex,
    }).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error creating tech stack:', error);
    return null;
  }
}

export async function updateTechStack(id: string, data: UpdateTechStackData): Promise<TechStack | null> {
  try {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.bgHex !== undefined) updateData.bgHex = data.bgHex;
    if (data.borderHex !== undefined) updateData.borderHex = data.borderHex;
    if (data.textHex !== undefined) updateData.textHex = data.textHex;

    const result = await db.update(techstacks)
      .set(updateData)
      .where(eq(techstacks.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error updating tech stack:', error);
    return null;
  }
}

export async function deleteTechStack(id: string): Promise<boolean> {
  try {
    await db.delete(techstacks).where(eq(techstacks.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    return false;
  }
}