import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export interface Category {
  id: string;
  name: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export interface UpdateCategoryData {
  name?: string;
  bgHex?: string;
  borderHex?: string;
  textHex?: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const result = await db.select().from(categories);
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const result = await db.select().from(categories).where(eq(categories.id, id));
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching category by id:', error);
    return null;
  }
}

export async function createCategory(data: CreateCategoryData): Promise<Category | null> {
  try {
    const result = await db.insert(categories).values({
      name: data.name,
      bgHex: data.bgHex,
      borderHex: data.borderHex,
      textHex: data.textHex,
    }).returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(id: string, data: UpdateCategoryData): Promise<Category | null> {
  try {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.bgHex !== undefined) updateData.bgHex = data.bgHex;
    if (data.borderHex !== undefined) updateData.borderHex = data.borderHex;
    if (data.textHex !== undefined) updateData.textHex = data.textHex;

    const result = await db.update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();
    return result[0] || null;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}