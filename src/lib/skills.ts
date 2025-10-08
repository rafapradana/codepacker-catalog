import { db } from '@/lib/db';
import { skills } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface Skill {
  id: string;
  name: string;
  iconUrl: string | null;
  bgHex: string;
  borderHex: string;
  textHex: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSkillData {
  name: string;
  iconUrl?: string | null;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export interface UpdateSkillData {
  name?: string;
  iconUrl?: string | null;
  bgHex?: string;
  borderHex?: string;
  textHex?: string;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const result = await db.select().from(skills);
    return result;
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function getSkillById(id: string): Promise<Skill | null> {
  try {
    const result = await db.select().from(skills).where(eq(skills.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching skill by id:', error);
    return null;
  }
}

export async function createSkill(data: CreateSkillData): Promise<Skill | null> {
  try {
    const result = await db.insert(skills).values({
      name: data.name,
      iconUrl: data.iconUrl || null,
      bgHex: data.bgHex,
      borderHex: data.borderHex,
      textHex: data.textHex,
    }).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error creating skill:', error);
    return null;
  }
}

export async function updateSkill(id: string, data: UpdateSkillData): Promise<Skill | null> {
  try {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.bgHex !== undefined) updateData.bgHex = data.bgHex;
    if (data.borderHex !== undefined) updateData.borderHex = data.borderHex;
    if (data.textHex !== undefined) updateData.textHex = data.textHex;

    const result = await db.update(skills)
      .set(updateData)
      .where(eq(skills.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error updating skill:', error);
    return null;
  }
}

export async function deleteSkill(id: string): Promise<boolean> {
  try {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    return false;
  }
}